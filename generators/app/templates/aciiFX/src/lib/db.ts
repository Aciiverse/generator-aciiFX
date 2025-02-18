import mariadb = require("mariadb");

type ColumnDef = {
    collation: mariadb.Collation;
    columnLength: number;
    columnType: number;
    flags: number;
    scale: number;
    type: string;
}[];

export namespace db {
    export interface DBQuery extends Array<any> {
        /** defined at `INSERT INTO`, `UPDATE`, `DELETE` */
        affectedRows?: number;
        /** defined at `INSERT INTO`, `UPDATE`, `DELETE` */
        insertId?: number;
        /** defined at `INSERT INTO`, `UPDATE`, `DELETE` */
        warningStatus?: number;
        /** defined at `SELECT` */
        meta?: ColumnDef;
    }

    const pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: parseInt(process.env.DB_PORT || "3306"),
        connectionLimit: 1000,
    });

    /**
     * @method executes a sql query async
     * @param {string} sql query for sql database
     * @param {values?} values optonal values
     * @returns {Promise<DBQuery>} the sql query result
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 31.08.2024
     */
    export async function query(sql: string, values?: any[]): Promise<DBQuery> {
        if (!values) {
            values = [];
        }

        return new Promise<DBQuery>(async (res, rej) => {
            try {
                const conn = await pool.getConnection();

                conn.query(sql, values)
                    .then((result) => {
                        return res(result);
                    })
                    .catch((err) => {
                        return rej(err);
                    });

                conn.release();
            } catch (err) {
                console.error(err);
            }
        });
    }
}
