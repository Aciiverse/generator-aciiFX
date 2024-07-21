import { NextFunction, Request, Response } from "express";
/**
 * @Copyright (MIT Licence) (c) 2015 Auth0, Inc. <support@auth0.com> (http://auth0.com)
 
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */
import jwt = require("jsonwebtoken");

export interface UserRequest extends Request {
    userData: {}
};

// Checks if the user is logged in
export const isLoggedIn = (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        // -> no authorization header sended
        return res.status(400).send({
            message: 'Your session is not valid!',
        });
    }

    try {
        const   token   = req.headers.authorization,
                secrKey = process.env.FX_SECRET_KEY;

        if (!secrKey) throw Error; // No secret key set -> log out

        const decoded = jwt.verify(token, secrKey);
  
        req.userData = decoded;
        next();
    } catch (err) {
        // -> Error occured
        return res.status(400).send({
            message: 'You must be logged in!',
        });
    }
},
// Checks if the register uuid & password are valid
validateRegister = (req: Request, res: Response, next: NextFunction) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
        return res.status(400).send({
            message: 'The username should be at least 3 characters long.',
        });
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
            message: 'The password should be at least 6 characters long.',
        });
    }
    // password (repeat) must match
    if (!req.body.passwordRepeat ||
        req.body.password !== req.body.passwordRepeat ) {

        return res.status(400).send({
            message: 'Both passwords must match.',
        });

    }
    next();
}