import express = require("express");
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");
import { Language } from "../lang";
import { db } from "../db/mysql.db";
import uuid = require("uuid");
import { validateRegister } from "../middleware/user.middleware";
import { UsersResult, UsersTable } from "../types/db.types";
import { UserData } from "../base";
import { GetBaseRes, GetUsersLoginReq, GetUsersLoginRes, GetUsersRegisterReq } from "../types/api.types";
import { ResultSetHeader } from "mysql2";
const router = express.Router();

/**
 * @method login route
 * @param {string} "/user/login" the route
 * @param {LoginRequest} req requested fields
 * @param {express.Response} res Result
 * @author Flowtastisch
 * @memberof Aciiverse
 * @date 15.08.2024
 */
router.post("/login", (req, res) => {
    const body: GetUsersLoginReq = req.body,
        username = body.username,
        password = body.password;

    if (!username || !password) {
        // -> input data is NOT valid
        return res.status(401).send({
            message: Language.getText("err.aciifx.userOrPass"),
        });
    }

    db.query("SELECT * FROM users WHERE username = ?;", [body.username], (err, result: UsersResult) => {
        if (err) {
            // -> Unexpected Error
            console.error(err);
            return res.status(401).send({
                message: Language.getText("err.aciifx.userOrPass"),
            });
        } else if (Array.isArray(result) && !result.length) {
            // -> No data founded
            return res.status(401).send({
                message: Language.getText("err.aciifx.userOrPass"),
            });
        }

        bcrypt.compare(password, result[0]["password"]!, (bError, bSuccess) => {
            if (bError) {
                // -> Unexpected error
                console.error(bError);
                return res.status(401).send({
                    message: Language.getText("err.aciifx.userOrPass"),
                });
            }
            if (bSuccess) {
                // -> Password valid
                const today = new Date(),
                    tokenExp = new Date().setDate(today.getDate() + 7),
                    secrKey = process.env.FX_SECRET_KEY;

                db.query("UPDATE users SET lastLogin = ? WHERE uuid = ?;", [today, result[0].uuid]);

                if (!secrKey) throw Error; // No secret key set -> log out

                const token = jwt.sign(
                    {
                        username: result[0].username,
                        uuid: result[0].uuid,
                        isAdmin: result[0].isAdmin,
                        lastLogin: today,
                        registered: result[0].registered,
                    } as UserData,
                    secrKey,
                    { expiresIn: "7d" }
                );

                delete result[0].password;

                return res.status(200).send({
                    message: Language.getText("suc.aciifx.login"),
                    token,
                    tokenExp,
                    user: result[0],
                } as GetUsersLoginRes);
            }
            return res.status(400).send({
                message: Language.getText("err.aciifx.userOrPass"),
            } as GetBaseRes);
        });
    });
});

/**
 * @method register route
 * @param {string} "/user/register" the route
 * @param {RegisterRequest} req requested fields
 * @param {express.Response} res Result
 * @author Flowtastisch
 * @memberof Aciiverse
 * @date 15.08.2024
 */
router.post("/register", validateRegister, (req, res) => {
    const body: GetUsersRegisterReq = req.body;

    db.query("SELECT uuid FROM users WHERE LOWER(username) = LOWER(?)", [body.username], (err, result: { uuid: UsersTable["uuid"] }[] & ResultSetHeader) => {
        // Insert into ingredients
        if (result && Array.isArray(result) && result.length) {
            return res.status(409).send({
                message: Language.getText("err.aciifx.usernameExists"),
            } as GetBaseRes);
        }
        // username not in use
        bcrypt.hash(body.password!, 10, (err, passHash) => {
            if (err) {
                // -> Error occured
                console.error(err.message);
                return res.status(500).send({
                    message: Language.getText("err.aciifx.registration"),
                });
            }
            db.query(
                "INSERT INTO users (uuid, username, email, password, registered, verified) VALUES (?, ?, ?, ?, now(), false);",
                [uuid.v4(), body.email, body.username, passHash],
                (err, result: ResultSetHeader) => {
                    if (err) {
                        // -> Error occured
                        console.error(err.message);
                        return res.status(400).send({
                            message: Language.getText("err.aciifx.registration"),
                        } as GetBaseRes);
                    }
                    return res.status(201).send({
                        message: Language.getText("suc.aciifx.registration"),
                    } as GetBaseRes);
                }
            );
        });
    });
});

module.exports = router;
