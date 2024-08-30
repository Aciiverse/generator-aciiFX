# aciiFX-CLI

> Simple & Powerful Aciiverse NodeTS Backend
> [Here](https://) is the doc also in english.

## Entwickler\*Innen

-   [Flowtastisch](https://)

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
-   [uuid](https://github.com/uuidjs/uuid)
-   [typescript](https://github.com/Microsoft/TypeScript)

### Zusätzlich für den Generator

-   [coveralls](https://github.com/nickmerwin/node-coveralls)
-   [jest](https://jestjs.io/)
-   [yeoman](https://yeoman.io/)

### Zusätzlich für die Demo App

-   html5
-   css3

## Features

-   simples und leistungsstarkes API Grundgerüst
-   Usersystem inkl. Middleware
-   simples & modulares Übersetzungsmodul

## Eigenes Projekt generieren

### Was du brauchst

-   NodeJS (>= vXX)
-   TypeScript `npm install -g typescript`
-   Erreichbare MySQL Datenbank

### Schritt für Schritt

1.  Installiere Yeoman

        npm install -g yo

2.  Installiere den aciiFX-CLI generator

        npm i -g @aciiverse/generator-aciifx-cli

3.  Zur genaueren Auswahl stehen folgende Optionen

-   **Demo Ordner:** Installiere den nur, wenn du aciiFX testen willst. Es generiert dir eine simple HTML Seite, die die Hauptfunktionen von aciiFX zeigen sollen. Führe dazu die `./demo/index.html` Datei im Browser aus.

4.  Führe den Generator in deinem Wunschordner aus (!Achtung Der Generator generiert einen eigenen Ordner in deinem Ordner!)

        yo @aciiverse/aciifx-cli

5.  Führe jetzt den Befehlt `npm run start:dev` aus oder alternativ kannst du in die `package.json` gehen und findest bei den `scripts` den Befehl `start:dev`

### Entwickeln mit aciiFX

> Entwickeln tust du im `./aciiFX/src/` Ordner

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

#### API Types (Types2FrontendApp)

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
