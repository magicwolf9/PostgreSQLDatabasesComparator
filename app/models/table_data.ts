import * as config from 'config';
import {testPgService} from "../../globals";
import {prodPgService} from "../../globals";
import {ITableInfo} from "../services/comparator_service";

const defaultSchema = config.get('defaultSchema');

export class TableDataModel {
    static async getData(tableName: string, isTestDB : boolean): Promise<ITableInfo> {
        const pgService = isTestDB ? testPgService : prodPgService;

        console.log("getting data");
        return {
            tableName: tableName,
            primaryKeys: [],
            tableData: await pgService.getRows(`SELECT * FROM ${defaultSchema}.${tableName}`, [])
        };
    }

}