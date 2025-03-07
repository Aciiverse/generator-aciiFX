import express = require("express");
import cors = require("cors");

// Read environments
require("dotenv").config({ path: `${__dirname}/../.env` });

// big int handler
declare global {
    interface BigInt {
        toJSON(): Number;
    }
}
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

// Get env data
const port = parseInt(process.env.FX_PORT!) || 3000,
    system = process.env.FX_SYSTEM || "LOCAL",
    domain = process.env.FX_DOMAIN || "",
    app = express(),
    router = require("./lib/router");

let serviceURL: string;

switch (system) {
    case "LOCAL":
        serviceURL = `http://localhost:${port}/api`;
        break;

    case "SERVER":
        serviceURL = `http://${domain}:${port}/api`;
        break;
}

// Error handling
process.on("uncaughtException", (err) => {
    console.error(err);
});

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(port, () => {
    console.log(`aciiFX started at ${serviceURL}`);
});
