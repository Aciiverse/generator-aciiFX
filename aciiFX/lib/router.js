"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
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
    const today = new Date(), options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    res.status(200).send({
        message: `Service alive! Time: ${today.toLocaleDateString('de-DE', options)}`
    });
});
module.exports = router;
//# sourceMappingURL=router.js.map