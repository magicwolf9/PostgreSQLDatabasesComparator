import {dbServices, TEST_DB} from "../../globals";
import {ITableInfo} from "../services/comparator_service";

export class TableDataModel {
    static async getData(tableName: string, isTestDB : string): Promise<ITableInfo> {
        const pgService = isTestDB === TEST_DB ? dbServices.testPgService : dbServices.prodPgService;

        return {
            tableName: tableName,
            primaryKeys: [],
            tableData: await pgService.getRows(`SELECT * FROM kassa.${tableName};`, [])
        };
    }

}