import {Controller} from "innots";
import {Context} from 'koa';
import {KassaTestModel} from "../models/kassa_test";
import {Comparator, ITableInfo} from "../services/comparator_service";



export class BaseController extends Controller{
    table = async (ctx: Context, next: () => any): Promise<void> => {

        const table1Name = 'kassa_test';
        const table2Name = 'kassa_test';

        const table1: ITableInfo = await KassaTestModel.getAll(table1Name);
        const table2: ITableInfo = await KassaTestModel.getAll(table2Name);

        ctx.body = new Comparator().compareTables(table1, table2);
        next();
    };
}
