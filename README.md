# aciiFX-CLI

> Simple & Powerful Aciiverse NodeTS Backend

> [Hier](/README.de.md) ist die Doku ebenfalls in deutsch.

## Developer

-   [Flowtastisch](https://github.com/flowtastisch)

## Credits

### aciiFX

-   [bcryptjs](https://github.com/kelektiv/node.bcrypt.js)
-   [concurrently](https://github.com/open-cli-tools/concurrently)
-   [cors](https://github.com/expressjs/cors)
-   [dotenv](https://github.com/motdotla/dotenv)
-   [express](https://github.com/expressjs/express)
-   [javascript](https://www.javascript.com/)
-   [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
-   [mysql2](https://github.com/sidorares/node-mysql2)
-   [prettier](https://github.com/prettier/prettier)
-   [uuid](https://github.com/uuidjs/uuid)
-   [typescript](https://github.com/Microsoft/TypeScript)

### Additionally for the generator

-   [coveralls](https://github.com/nickmerwin/node-coveralls)
-   [jest](https://jestjs.io/)
-   [yeoman](https://yeoman.io/)

### Additionally for the demo app

-   html5
-   css3

## Features

-   simple and powerful **api basic framework**
-   **user system** with middleware
-   simple & modular **translation module**
-   types from backend to frontend (**Types2FrontendApp**)

## Generate your own project

### What you need

-   NodeJS (>= vXX)
-   TypeScript `npm install -g typescript`
-   Erreichbare MySQL Datenbank

### Installation

1.  Install Yeoman

        npm install -g yo

2.  Install the aciiFX-CLI generator

        npm i -g @aciiverse/generator-aciifx-cli

3.  The following options are available for a more detailed selection

-   **demo directory:** Only install it if you want to test aciifx. It generates you a simple html page that should show the main functions of aciiFX.cli. Open the `./demo/index.html` file inside your browser.

4.  Perform the generator in your desired folder (!Attention The generator generates its own folder in your folder!)

        yo @aciiverse/aciifx-cli

5.  Now run the command `npm run start:dev` or alternatively you can go to the `package.json` and find the command `start:dev` at `scripts`

## Develop with aciiFX

> You develop in the `./aciiFX/src/` directory

> Here are a few examples of how to use the functions:

### Routes

#### New Route (Modules)

To create a new route, create a new typecript file. Put the new file as follows: `./aciiFX/src/lib/route/{your route}.route.ts`. Replace {your route} with your desired route. Here are a few examples _(The `/service` route is an exception)_:

| Module | Route                 | File           | Usecase                          |
| ------ | --------------------- | -------------- | -------------------------------- |
| Users  | /users/login          | users.route.ts | Login the Users                  |
| Users  | /users/register       | users.route.ts | Register the user                |
| Games  | /games                | games.route.ts | Display of all games             |
| Games  | /games/:id            | games.route.ts | Display of a game                |
| Games  | /games/:id/scoreboard | games.route.ts | Display of the points of a game  |
| Games  | /games/:id/players    | games.route.ts | Display of the players of a game |

#### The content of your routing file should look initially as follows (for example: `games.route.ts`):

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

#### Route output (Return) :

> A few examples of how you can hand over to Express data to the frontend

-   A standard output only with a message:

        res.status(202).send({
            message: "Success",
        });

-   An output with message and file:

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

-   An image or other file (saved as a blob):

        const image = {
            data: <...>,
            type: 'image/png'
        }

        res.setHeader('Content-Type', image.type);
        res.end(image.data, 'binary');

### API Types (Types2FrontendApp)

You can automatically make your API types (Request and Response) available for the frontend.

1. Create all the requests and response types in `./aciiFX/src/lib/types/api.types.ts`.
   The name convention of the types is as follows: `{Request Art (Get, Post, Put, Delete)}{Name der Route}{Req oder Res}` For example: `GetUsersLoginReq`. This includes the following types:

-   Request Types: All types that map the body data that you get from the frontend:

        const body: GetUsersLoginReq = req.body;

-   Response types: All types that are sent to the frontend:

        return res.status(200).send({
                <Deine Daten>
        } as GetUsersLoginRes);

2. To make the guys accessible, carry out the command `npm run export:types`
3. Now the folder `./apiTypes` is generated. These types can now simply be imported from the frontend like modules.

### Translation module (Lang)

To always get the current language, you can use the lang module.

-   In the folder `./aciiFX/lang` you will find .json files. You can add your own for e.g. french -> `fr.lang.json`
-   In the .env file you set a standard language.
-   Which text is taken first is decided as follows:
    1. the language that is given to the function
    2. the language that is defined in the `.env` (`FX_LANG_DEFAULT_LANGUAGE`)
    3. english `en.lang.json`
-   You can get a text as follows:

        // In config file: { "err.test": "Hello World!" }
        const text = lang.getText("err.test");
        console.log(text);
        // Hello World!

-   You can also give values as an string:

        // In config file: { "err.test": "Hello {0}!" }
        const text = lang.getText("err.test", { values: "Ezio" });
        console.log(text);
        // Hello World!

    or as an array:

        // In config file: { "err.test": "Hello {0} {1}!" }
        const text = lang.getText("err.test", { values: ["Ezio", "Auditore"] });
        console.log(text);
        // Hello Ezio Auditore!

-   The requested language can also be defined with `options`:

        // In de.lang.json config file: { "err.test": "Hello World!" }
        // In en.lang.json config file: { "err.test": "Hallo Welt!" }
        // In .env: FX_LANG_DEFAULT_LANGUAGE=en
        const text = lang.getText("err.test", { lang: 'de' });
        console.log(text);
        // Hallo Welt!

### SQL Queries

SQL Queries are through the `db` module simplified. As in this example, you can carry out an SQL query without tanging yourself into promise nesting

-   a query looks like this:

        try {
            const result: GamesResult = await db.query("SELECT * FROM games WHERE gameId = ?;", [gameId]);
        } catch (error) {
            // -> error inside sql query
            console.error(error);
        }

-   the queries can be combined as desired:

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
