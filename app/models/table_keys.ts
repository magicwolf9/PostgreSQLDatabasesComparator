import * as config from 'config';
import {testPgService} from "../../globals";
import {prodPgService} from "../../globals";

const defaultSchema = config.get('defaultSchema');

export class TablePrimariyKeysModel {
    static async getPrimaries(tableName: string, isTestDB: boolean): Promise<Array<string>> {
        const pgService = isTestDB ? testPgService : prodPgService;

        let keys = await pgService.getRows(`
                SELECT a.attname
                FROM   pg_index i
                JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                     AND a.attnum = ANY(i.indkey)
                WHERE  i.indrelid = '${defaultSchema}.${tableName}'::regclass
                AND    i.indisprimary;`, []);

        keys = keys.map(function (k) {
            return k.attname;
        });


        return keys.map(key => {
            return key.replace(/_/g, '');
        });
    }
}


