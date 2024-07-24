import express  = require('express');
import bcrypt = require('bcryptjs')
import uuid     = require('uuid');
import jwt = require("jsonwebtoken");
import { connection as db } from './db/mysql.db';
import { isLoggedIn } from './middleware/user.middleware';
import { UserData, UserResponse } from './base';

const router = express.Router();

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
    res.status(200).send({
        message: `Service alive! Time: ${today.toLocaleDateString('de-DE', options)}`
    });
});

/**
 * @Copyright (MIT Licence) (c) 2010 Nicholas Campbell
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * @Copyright (MIT Licence) (c) 2010-2020 Robert Kieffer and other contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * @method register route
 * @param {string} "/" the route
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req requested fields
 * @param {Response<any, Record<string, any>, number>} res Result
 * @author DerEineFlow
 * @memberof AWESOME CREW
 */
router.post('/register', isLoggedIn, (req, res: express.Response, next) => {
    db.query('SELECT uuid FROM users WHERE LOWER(username) = LOWER(?)',
        [req.body.username],
        (err, result) => {   // Insert into ingredients
        if (result && Array.isArray(result) && result.length) {
            return res.status(409).send({
                message: 'This username is already in use!',
            });
        }
        // username not in use
        bcrypt.hash(req.body.password, 10, (err, passHash) => {
            if (err) {
                // -> Error occured
                console.error(err.message);
                return res.status(500).send({
                    message: err.message,
                });
            }
            db.query('INSERT INTO users (uuid, username, password, registered) VALUES (?, ?, ?, now());',
                [uuid.v4(), req.body.username, passHash],
                (err, result) => {
                    if (err) {
                        // -> Error occured
                        console.error(err.message);
                        return res.status(400).send({
                            message: err.message,
                        });
                    }
                    return res.status(201).send({
                        message: 'Registered!',
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
router.post('/login', (req, res, next) => {
    db.query('SELECT * FROM users WHERE username = ?;',
        [req.body.username],
        (err, result: UserResponse[]) => {
            if (err) {
                // -> Unexpected Error
                console.error(err);
                return res.status(401).send({
                    message: 'The username or password is incorrect!',
                });
            } else if (Array.isArray(result) && !result.length) {
                // -> No data founded
                return res.status(401).send({
                    message: 'The username or password is incorrect!',
                });
            }
            bcrypt.compare(req.body.password,
                result[0]['password']!,
                (bError, bSuccess) => {
                    if (bError) {
                        // -> Unexpected error
                        console.error(bError);
                        return res.status(401).send({
                            message: 'The username or password is incorrect!',
                        });
                    }
                    if (bSuccess) {
                        // -> Password valid
                        const   today   = new Date(),
                                secrKey = process.env.FX_SECRET_KEY;

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
                            message: 'Logged in!',
                            token,
                            user: result[0],
                        });
                    }
                    return res.status(400).send({
                        message: 'The username or password is incorrect!',
                    });
                }
            )
        }
    )
});

module.exports = router;