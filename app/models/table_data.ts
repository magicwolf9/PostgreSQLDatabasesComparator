import {testPgService} from "../../globals";
import {prodPgService} from "../../globals";
import {ITableInfo} from "../services/comparator_service";

export class TableDataModel {
    static async getData(DBName: string, tableName: string, isTestDB : boolean): Promise<ITableInfo> {
        const pgService = isTestDB ? testPgService : prodPgService;

        return {
            tableName: tableName,
            primaryKeys: [],
            tableData: await pgService.getRows(`SELECT * FROM ${DBName}.${tableName}`, [])
        };
    }

}