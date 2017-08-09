import * as config from 'config';
import {Controller} from "innots";
import {Context} from 'koa';
import {KassaTestModel} from "../models/kassa_test";
import {Comparator, ITableInfo} from "../services/comparator_service";


export class BaseController extends Controller{
    table = async (ctx: Context, next: () => any): Promise<void> => {

        const testTableName = config.get('tablesToCompare')[0].tableName;
        const prodTableName = config.get('tablesToCompare')[0].tableName;

        const testTable: ITableInfo = await KassaTestModel.getAll(testTableName, true);
        const prodTable: ITableInfo = await KassaTestModel.getAll(prodTableName, false);

        testTable.primaryKeys =  config.get('tablesToCompare')[0].primaryKeys;
        prodTable.primaryKeys = config.get('tablesToCompare')[0].primaryKeys;

        ctx.body = new Comparator().compareTables(testTable, prodTable);
        next();
    };
}
