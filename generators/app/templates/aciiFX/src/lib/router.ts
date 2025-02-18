import express = require("express");
import { readdirSync } from "fs";
import path = require("path");
const router = express.Router();

const routeFolder = path.join(__dirname, "/routes"),
    routeFiles = readdirSync(routeFolder);

routeFiles.forEach((e) => {
    if (e.endsWith(".routes.js")) {
        // -> is route file
        const routeKey = e.split(".routes.js")[0];

        if (routeKey === "service") {
            // -> is basic route
            const newModule = require(`../routes/${routeKey}.routes`);
            router.use("/", newModule);
        } else {
            // -> check the route
            const newModule = require(`../routes/${routeKey}.routes`);
            router.use(`/${routeKey}`, newModule);
        }
    }
});

module.exports = router;
