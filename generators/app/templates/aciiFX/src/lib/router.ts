import express = require('express');
import { readdirSync } from "fs";
import path = require("path");
const router = express.Router();

const   routeFolder = path.join(__dirname, '/route'),
        routeFiles  = readdirSync(routeFolder); 

routeFiles.forEach(e => {
    if (e.endsWith('.route.js')) {
        // -> is route file
        const routeKey = e.split('.route.js')[0];

        if (routeKey === "service") {
            // -> is basic route
            const newModule = require(`./route/${routeKey}.route`);
            router.use('/', newModule);
        } else {
            // -> check the route
            const newModule = require(`./route/${routeKey}.route`);
            router.use(`/${routeKey}`, newModule);
        }
    }
});

module.exports = router;