import express = require("express");
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");
import { lang } from "../lang";
import uuid = require("uuid");
import { validateRegister } from "../middleware/user.middleware";
import { UsersTable } from "../types/db.types";
import { UserData } from "../base";
import {
    GetBaseRes,
    GetUsersLoginReq,
    GetUsersLoginRes,
    GetUsersRegisterReq,
} from "../types/api.types";
import { ResultSetHeader } from "mysql2";
import { db } from "../db";
const router = express.Router();

export interface UsersResult extends Array<UsersTable>, ResultSetHeader {}

/**
 * @method login route
 * @param {string} "/user/login" the route
 * @param {LoginRequest} req requested fields
 * @param {express.Response} res Result
 * @author Flowtastisch
 * @memberof Aciiverse
 * @date 15.08.2024
 */
router.post("/login", async (req, res) => {
    const body: GetUsersLoginReq = req.body,
        username = body.username,
        password = body.password;

    if (!username || !password) {
        // -> input data is NOT valid
        return res.status(401).send({
            message: lang.getText("err.aciifx.userOrPass"),
        });
    }

    try {
        const result: UsersResult = await db.query(
            "SELECT * FROM users WHERE username = ?;",
            [body.username]
        );
        if (!result) {
            throw Error;
        } else if (Array.isArray(result) && !result.length) {
            // -> No data founded
            throw Error;
        }

        // compare passwords
        const matched = await bcrypt.compare(password, result[0]["password"]!);
        if (!matched) {
            throw Error;
        }

        // update users lastlogin
        const today = new Date(),
            tokenExp = new Date().setDate(today.getDate() + 7),
            secrKey = process.env.FX_SECRET_KEY;

        db.query("UPDATE users SET lastLogin = ? WHERE uuid = ?;", [
            today,
            result[0].uuid,
        ]);

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
            message: lang.getText("suc.aciifx.login"),
            token,
            tokenExp,
            user: result[0],
        } as GetUsersLoginRes);
    } catch (error) {
        console.error(error);
        res.status(401).send({
            message: lang.getText("err.aciifx.userOrPass"),
        });
    }
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
router.post("/register", validateRegister, async (req, res) => {
    const body: GetUsersRegisterReq = req.body;

    try {
        const users: { uuid: UsersTable["uuid"] }[] & ResultSetHeader =
            await db.query(
                "SELECT uuid FROM users WHERE LOWER(username) = LOWER(?)",
                [body.username]
            );

        // username already in use
        if (users && Array.isArray(users) && users.length) {
            return res.status(409).send({
                message: lang.getText("err.aciifx.usernameExists", {
                    values: body.username!,
                }),
            } as GetBaseRes);
        }

        // hash password
        const hash = await bcrypt.hash(body.password!, 10),
            newUuid = uuid.v4();

        // create new user
        await db.query(
            "INSERT INTO users (uuid, username, email, password, registered, verified) VALUES (?, ?, ?, ?, now(), false);",
            [newUuid, body.username, body.email, hash]
        );

        return res.status(201).send({
            message: lang.getText("suc.aciifx.registration"),
        } as GetBaseRes);
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: lang.getText("err.aciifx.registration"),
        });
    }
});

module.exports = router;
