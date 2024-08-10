import express  = require('express');
import bcrypt = require('bcryptjs')
import uuid     = require('uuid');
import jwt = require("jsonwebtoken");
import { connection as db } from './db/mysql.db';
import { isLoggedIn, validateRegister } from './middleware/user.middleware';
import { UserData, UserResponse } from './base';
import { Language } from './lang';

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
 * @method displays service status and time at the init route from the system
 * @param {string} "/" the route
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req requested fields
 * @param {Response<any, Record<string, any>, number>} res Result
 * @author Flowtastisch
 * @memberof Aciiverse
 * @date 02.03.2024
 */
router.get('/', (req, res) => {
    const   today   = new Date(),
            options = {
                day:    '2-digit' as "2-digit" | "numeric",
                month:  '2-digit' as "2-digit" | "numeric",
                year:   'numeric' as "2-digit" | "numeric",
                hour:   '2-digit' as "2-digit" | "numeric",
                minute: '2-digit' as "2-digit" | "numeric",
                second: '2-digit' as "2-digit" | "numeric"
            };
    const txt = Language.getText('testTedxt');
    console.log(txt)
    res.status(200).send({
        message: `Service alive! Time: ${today.toLocaleDateString('de-DE', options)}`
    });
});

/**
 * @method register route
 * @param {string} "/" the route
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req requested fields
 * @param {Response<any, Record<string, any>, number>} res Result
 * @author DerEineFlow
 * @memberof AWESOME CREW
 */
router.post('/register', validateRegister, (req: RegisterRequest, res: express.Response, next: express.NextFunction) => {
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

/**
 * @method login route
 * @param {string} "/" the route
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req requested fields
 * @param {Response<any, Record<string, any>, number>} res Result
 * @author DerEineFlow
 * @memberof AWESOME CREW
 */
router.post('/login', (req: LoginRequest, res, next) => {
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

module.exports = router;