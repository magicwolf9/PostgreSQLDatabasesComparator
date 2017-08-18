import {dbServices, TEST_DB} from "../../globals";

export class TablePrimariyKeysModel {
    static async getPrimaries(DBName: string, tableName: string, isTestDB: string): Promise<Array<string>> {
        const pgService = isTestDB === TEST_DB ? dbServices.testPgService : dbServices.prodPgService;

        let keys = await pgService.getRows(`
                SELECT a.attname
                FROM   pg_index i
                JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                     AND a.attnum = ANY(i.indkey)
                WHERE  i.indrelid = '${DBName}.${tableName}'::regclass
                AND    i.indisprimary;`, []);

        return keys.map(function (k) {
            return k.attname;
        });
    }
}


