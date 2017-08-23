import {dbServices, PROD_DB, TEST_DB} from "../../globals";
import {isUndefined} from "util";

export interface ITableStructure {
    tableName: string,
    primaryColumns: Array<string>
}

export class TablesWithPrimariesListModel {

    static async getTables(DBName: string, isTestDB: string, tablesNamesWithPrefixes: Array<string>): Promise<Array<ITableStructure>> {

        let pgService;
        switch (isTestDB) {
            case TEST_DB: {
                pgService = dbServices.testPgService;
                break;
            }
            case PROD_DB: {
                pgService = dbServices.prodPgService;
                break;
            }
            default: {
                break;
            }
        }

        const result = await pgService.getRows(`
            SELECT tablename, json_agg(attname) as pk_columns
            FROM pg_tables
            LEFT JOIN pg_index
            ON indrelid = (schemaname || '.' || tablename)::regclass AND indisprimary = true
            LEFT JOIN  pg_attribute ON attrelid = indrelid
                                     AND attnum = ANY(indkey)
            LEFT JOIN  (SELECT unnest AS table_prefix, row_number() OVER (PARTITION BY unnest) 
                AS index from unnest($1::text[])) as table_ordering
            ON tablename LIKE table_prefix
            WHERE tablename SIMILAR TO (array_to_string($1::text[], '|'))
            GROUP BY tablename, index
            ORDER BY index;`, [tablesNamesWithPrefixes]);

        return result.map(value => {
            let primaryColumnNames = value.pkColumns;

            if (isUndefined(primaryColumnNames)) {
                primaryColumnNames = [];
            }

            return {tableName: value.tablename, primaryColumns: primaryColumnNames};
        });
    }
}