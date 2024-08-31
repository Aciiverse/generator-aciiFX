import { ResultSetHeader } from "mysql2";
import { connection } from "./db/mysql.db";

interface DBQuery extends Array<any>, ResultSetHeader {}

export module db {
    /**
     * @method executes a sql query async
     * @param {string} sql query for sql database
     * @param {values?} values optonal values
     * @returns {Promise<DBQuery>} the sql query result
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 31.08.2024
     */
    export function query(sql: string, values?: any[]): Promise<DBQuery> {
        if (!values) {
            values = [];
        }

        return new Promise<DBQuery>((res, rej) => {
            connection.query(sql, values, (err, result: DBQuery) => {
                if (err) {
                    return rej(err);
                }
                return res(result);
            });
        });
    }
}
