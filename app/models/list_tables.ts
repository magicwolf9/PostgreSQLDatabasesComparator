import {testPgService} from "../../globals";
import {prodPgService} from "../../globals";

export class ListTablesNamesModel {

    static async getTables(DBName: string, isTestDB: boolean, tablesNamesWithPrefixes: Array<string>): Promise<Array<string>> {
        const pgService = isTestDB ? testPgService : prodPgService;

        const tableNames = await pgService.getRows(`
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'kassa' AND tablename SIMILAR TO  $1;`, [tablesNamesWithPrefixes.join('|')]);

        return tableNames.map(function(k) {
            return k.tablename;
        });
    }
}