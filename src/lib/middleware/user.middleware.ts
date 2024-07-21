import { NextFunction, Request, Response } from "express";
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