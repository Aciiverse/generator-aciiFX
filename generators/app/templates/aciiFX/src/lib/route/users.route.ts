import express  = require('express');
import bcrypt = require('bcryptjs');
import jwt = require("jsonwebtoken");
import { Language } from '../lang';
import { UserData, UserResponse } from '../base';
import { db } from '../db/mysql.db';
import uuid = require('uuid');
import { validateRegister } from '../middleware/user.middleware';
const router = express.Router();

interface RegisterRequest extends express.Request<{}, any, any, Record<string, any>>{
    body: {
        username?:  string,
        email?:     string
        password?:  string,
    }
}

interface LoginRequest extends express.Request<{}, any, any, Record<string, any>>{
    body: {
        username?:  string
        password?:  string,
    }
}

/**
 * @method login route
 * @param {string} "/user/login" the route
 * @param {LoginRequest} req requested fields
 * @param {express.Response} res Result
 * @author Flowtastisch
 * @memberof Aciiverse
 * @date 15.08.2024
 */
router.post('/login', (req: LoginRequest, res: express.Response) => {
    const   username = req.body.username,
            password = req.body.password;

    if (!username || !password) {
        // -> input data is NOT valid
        return res.status(401).send({
            message: Language.getText('err.aciifx.userOrPass'),
        });
    }

    db.query('SELECT * FROM users WHERE username = ?;',
        [req.body.username],
        (err, result: UserResponse[]) => {
            if (err) {
                // -> Unexpected Error
                console.error(err);
                return res.status(401).send({
                    message: Language.getText('err.aciifx.userOrPass'),
                });
            } else if (Array.isArray(result) && !result.length) {
                // -> No data founded
                return res.status(401).send({
                    message: Language.getText('err.aciifx.userOrPass'),
                });
            }

            bcrypt.compare(password,
                result[0]['password']!,
                (bError, bSuccess) => {
                    if (bError) {
                        // -> Unexpected error
                        console.error(bError);
                        return res.status(401).send({
                            message: Language.getText('err.aciifx.userOrPass'),
                        });
                    }
                    if (bSuccess) {
                        // -> Password valid
                        const   today       = new Date(),
                                tokenExp    = new Date().setDate(today.getDate() + 7),
                                secrKey     = process.env.FX_SECRET_KEY;

                        db.query('UPDATE users SET lastLogin = ? WHERE uuid = ?;',
                            [today, result[0].uuid,]
                        );

                        if (!secrKey) throw Error; // No secret key set -> log out

                        const token = jwt.sign({
                                username:   result[0].username,
                                uuid:       result[0].uuid,
                                isAdmin:    result[0].isAdmin,
                                lastLogin:  today,
                                registered: result[0].registered
                            } as UserData,
                            secrKey,
                            { expiresIn: '7d' }
                        );

                        delete result[0].password;

                        return res.status(200).send({
                            message: Language.getText('suc.aciifx.login'),
                            token,
                            tokenExp,
                            user: result[0],
                        });
                    }
                    return res.status(400).send({
                        message: Language.getText('err.aciifx.userOrPass'),
                    });
                }
            )
        }
    )
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
router.post('/register', validateRegister, (req: RegisterRequest, res: express.Response) => {
    db.query('SELECT uuid FROM users WHERE LOWER(username) = LOWER(?)',
        [req.body.username],
        (err, result) => {   // Insert into ingredients
        if (result && Array.isArray(result) && result.length) {
            return res.status(409).send({
                message: Language.getText('err.aciifx.usernameExists'),
            });
        }
        // username not in use
        bcrypt.hash(req.body.password!, 10, (err, passHash) => {
            if (err) {
                // -> Error occured
                console.error(err.message);
                return res.status(500).send({
                    message: Language.getText("err.aciifx.registration"),
                });
            }
            db.query('INSERT INTO users (uuid, username, email, password, registered, verified) VALUES (?, ?, ?, ?, now(), false);',
                [uuid.v4(), req.body.email, req.body.username, passHash],
                (err, result) => {
                    if (err) {
                        // -> Error occured
                        console.error(err.message);
                        return res.status(400).send({
                            message: Language.getText("err.aciifx.registration"),
                        });
                    }
                    return res.status(201).send({
                        message: Language.getText('suc.aciifx.registration'),
                    });
                }
            );
        });
    });
});

module.exports = router;