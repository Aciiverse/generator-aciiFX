# generator-aciiFX

> Simple & Powerful Aciiverse NodeTS Backend

> [Here](/README.md) is the doc also in english.

## Entwickler\*Innen

-   [Flowtastisch](https://github.com/flowtastisch)

## Credits

### generator-aciiFX

-   [bcryptjs](https://github.com/kelektiv/node.bcrypt.js)
-   [concurrently](https://github.com/open-cli-tools/concurrently)
-   [cors](https://github.com/expressjs/cors)
-   [dotenv](https://github.com/motdotla/dotenv)
-   [express](https://github.com/expressjs/express)
-   [javascript](https://www.javascript.com/)
-   [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
-   [prettier](https://github.com/prettier/prettier)
-   [uuid](https://github.com/uuidjs/uuid)
-   [typescript](https://github.com/Microsoft/TypeScript)

### aciiFX-CLI

-   [express](https://github.com/expressjs/express)
-   [mariadb](https://github.com/sidorares/mariadb)
-   [prettier](https://github.com/prettier/prettier)
-   [typescript](https://github.com/Microsoft/TypeScript)

### Zusätzlich für den YO Generator

-   [coveralls](https://github.com/nickmerwin/node-coveralls)
-   [jest](https://jestjs.io/)
-   [yeoman](https://yeoman.io/)

### Zusätzlich für die Demo App

-   html5
-   css3

## Features

-   simples und leistungsstarkes **API Grundgerüst**
-   **Usersystem** inkl. Middleware
-   simples & modulares **Übersetzungsmodul**
-   Typen von Backend zu Frontend (**Types2FrontendApp**)

## Eigenes Projekt generieren

### Was du brauchst

-   NodeJS (>= vXX)
-   TypeScript `npm install -g typescript`
-   Erreichbare MySQL Datenbank

### Installation

1.  Installiere Yeoman

        npm install -g yo

2.  Installiere den aciiFX-CLI generator

        npm i -g @aciiverse/generator-aciifx-cli

3.  Zur genaueren Auswahl stehen folgende Optionen

-   **Demo Ordner:** Installiere den nur, wenn du aciiFX testen willst. Es generiert dir eine simple HTML Seite, die die Hauptfunktionen von aciiFX zeigen sollen. Führe dazu die `./demo/index.html` Datei im Browser aus.

4.  Führe den Generator in deinem Wunschordner aus (!Achtung Der Generator generiert einen eigenen Ordner in deinem Ordner!)

        yo @aciiverse/aciifx-cli

5.  Führe jetzt den Befehlt `npm run start:dev` aus oder alternativ kannst du in die `package.json` gehen und findest bei den `scripts` den Befehl `start:dev`

## Entwickeln mit aciiFX

> Entwickeln tust du im `./aciiFX/src/` Ordner

> Hier sind ein paar Beispiele, wie man die Funktionen benutzen kann:

### Routen

#### Neue Route (Module)

Um eine neue Route zu erstellen, erstellst du eine neue Typescript-Datei. Lege die neue Datei folgendermaßen ab: `./aciiFX/src/lib/route/{Deine Route}.route.ts` ab. {Deine Route} ersetzt du mit der gewünschten Route. Hier sind ein paar Beispiele _(Die `/service` Route ist eine Ausnahme)_:

| Modul  | Route                 | Datei          | Usecase                           |
| ------ | --------------------- | -------------- | --------------------------------- |
| User   | /users/login          | users.route.ts | Login des Users                   |
| User   | /users/register       | users.route.ts | Registrieren des Users            |
| Spiele | /games                | games.route.ts | Anzeige aller Spiele              |
| Spiele | /games/:id            | games.route.ts | Anzeige eines Spieles             |
| Spiele | /games/:id/scoreboard | games.route.ts | Anzeige der Punkte eines Spieles  |
| Spiele | /games/:id/players    | games.route.ts | Anzeige der Spieler eines Spieles |

#### Der Inhalt deiner Routing Datei sollte folgendermaßen aussehen (for example: `games.route.ts`):

    import express = require("express");
    import { db } from "../db";

    const router = express.Router();

    router.get("/", (req: express.Request, res: express.Response) => {
        // Handles GET "/games"
    });

    router.get("/game/:id", (req: express.Request, res: express.Response) => {
        // Handles GET "/game/1", "/game/2", "/game/3", etc...
    });

    module.exports = router;

#### Routen Ausgabe (Return) :

> Ein paar Beispiele, wie man mit express Daten an's Frontend übergeben kann

-   Eine Standardausgabe nur mit Nachricht:

        res.status(202).send({
            message: "Success",
        });

-   Eine Ausgabe mit Nachricht und Datei:

        const result = [
            {
                id: 1,
                name: "Assassin's Creed Shadows"
            },
            {
                id: 2,
                name: "Assassin's Creed Valhallah"
            }
        ];

        res.status(202).send({
            message: "Success",
            data: result
        });

-   Ein Bild oder eine andere Datei (als Blob gespeichert):

        const image = {
            data: <...>,
            type: 'image/png'
        }

        res.setHeader('Content-Type', image.type);
        res.end(image.data, 'binary');

### API Types (Types2FrontendApp)

Du kannst deine API Types (Request & Response) automatisch für's Frontend erreichbar machen.

1. Erstelle dafür alle Requests und Response Types in `./aciiFX/src/lib/types/api.types.ts`.
   Die Namneskonvention der Typen ist wie folgt: `{Request Art (Get, Post, Put, Delete)}{Name der Route}{Req oder Res}` Bsp: `GetUsersLoginReq`. Hierzu gehören folgende Typen:

-   Request Types: Alle Typen, die die Body-Daten abbilden, die du vom Frontend bekommst:

        const body: GetUsersLoginReq = req.body;

-   Response Types: Alle Typen, die ans Frontend geschickt werden:

        return res.status(200).send({
                <Deine Daten>
        } as GetUsersLoginRes);

2. Um die Typen erreichbar zu machen führe den Befehl aus `npm run export:types`
3. Jetzt hat sich der Ordner `./apiTypes` generiert. Diese Typen können jetzt einfach vom Frontend wie Module importiert werden.

### Übersetzungsmodul (Lang)

Um immer die aktuelle Sprache zu bekommen, kannst du das Lang Modul nutzen.

-   Im Ordner `./aciiFX/lang` findest du .json Dateien. Du kannst eigene hinzufügen für zB. französisch -> `fr.lang.json`
-   In der .env legst du eine Standardsprache fest.
-   Welcher Text als erstes genommen wird, wird folgendermaßen entschieden:
    1. Die Sprache, die der Funktion mitgegeben wird
    2. Die Sprache, die in der `.env` (`FX_LANG_DEFAULT_LANGUAGE`) als Standardsprache ausgewählt wurde
    3. English `en.lang.json`
-   Einen Text kannst du dir folgendermaßen holen:

        // In config file: { "err.test": "Hello World!" }
        const text = lang.getText("err.test");
        console.log(text);
        // Hello World!

-   Du kannst auch Werte mitgeben als String:

        // In config file: { "err.test": "Hello {0}!" }
        const text = lang.getText("err.test", { values: "Ezio" });
        console.log(text);
        // Hello World!

    oder als Array:

        // In config file: { "err.test": "Hello {0} {1}!" }
        const text = lang.getText("err.test", { values: ["Ezio", "Auditore"] });
        console.log(text);
        // Hello Ezio Auditore!

-   Die Sprache kann auch über `options mitgegeben werden`:

        // In de.lang.json config file: { "err.test": "Hello World!" }
        // In en.lang.json config file: { "err.test": "Hallo Welt!" }
        // In .env: FX_LANG_DEFAULT_LANGUAGE=en
        const text = lang.getText("err.test", { lang: 'de' });
        console.log(text);
        // Hallo Welt!

### SQL Queries

SQL Queries werden durch das `db` Modul vereinfacht. Du kannst wie in diesem Beispiel eine SQL Abfrage ausführen ohne dich in Promise Verschachtelungen zu verheddern

-   eine Abfrage sieht folgendermaßen aus:

        try {
            const result: GamesResult = await db.query("SELECT * FROM games WHERE gameId = ?;", [gameId]);
        } catch (error) {
            // -> error inside sql query
            console.error(error);
        }

-   die Abfragen können beliebig kombiniert werden:

        router.get("/games/:id", async (req, res) => {
            const gameId = req.params.id;
            try {
                // execute sql query
                const games: GamesResult = await db.query("SELECT * FROM games WHERE gameId = ?;", [gameId]);

                // validate
                if (!games) {
                    // -> games are undefined
                    throw Error; // go into catch block
                } else if (Array.isArray(games) && !games.length) {
                    // -> No data founded
                    throw Error; // go into catch block
                }

                // optional second, third, etc... query BEGIN
                const players: GamesResult = await db.query("SELECT * FROM players WHERE gameId = ?;", [gameId]);

                // validate
                if (!players) {
                    // -> games are undefined
                    throw Error; // go into catch block
                } else if (Array.isArray(players) && !players.length) {
                    // -> No data founded
                    return res.status(401).send({
                        message: lang.getText("err.noPlayers founded"),
                    });
                }
                // optional second, third, etc... query END

                // success
                res.status(202).send({
                    message: lang.getText("suc.gamesFounded"),
                    data: games
                });
            } catch (error) {
                // error occured
                console.error(error);
                res.status(401).send({
                    message: lang.getText("err.insideSQLQuery"),
                });
            }
        });
