import {dbServices, TEST_DB} from "../../globals";

export class TablesListModel {

    static async getTables(DBName: string, isTestDB: string, tablesNamesWithPrefixes: Array<string>): Promise<Array<string>> {
        const pgService = isTestDB === TEST_DB ? dbServices.testPgService : dbServices.prodPgService;

        const tableNames = await pgService.getRows(`
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'kassa' AND tablename SIMILAR TO  $1;`, [tablesNamesWithPrefixes.join('|')]);

        return tableNames.map(function(k) {
            return k.tablename;
        });
    }
}