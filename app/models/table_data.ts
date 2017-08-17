import * as config from 'config';
import {testPgService} from "../../globals";
import {prodPgService} from "../../globals";
import {ITableInfo} from "../services/comparator_service";

const schema = config.get('schema');

export class TableDataModel {
    static async getData(tableName: string, isTestDB : boolean): Promise<ITableInfo> {
        const pgService = isTestDB ? testPgService : prodPgService;

        return {
            tableName: tableName,
            primaryKeys: [],
            tableData: await pgService.getRows(`SELECT * FROM ${schema}.${tableName}`, [])
        };
    }

}