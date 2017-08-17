import * as config from 'config';
import {testPgService} from "../../globals";
import {prodPgService} from "../../globals";

const schema = config.get('schema');

export class ListTablesNamesModel {

    static async getTables(isTestDB: boolean): Promise<Array<string>> {
        const pgService = isTestDB ? testPgService : prodPgService;

        const tableNames = await pgService.getRows(`SELECT tablename FROM pg_tables WHERE schemaname = '${schema}';`, []);

        return tableNames.map(function(k) {
            return k.tablename;
        });
    }
}