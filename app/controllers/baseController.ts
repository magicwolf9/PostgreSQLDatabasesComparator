import {Controller} from "innots";
import {Context} from 'koa';
import {KassaTestModel, ExampleTableRow} from "../models/kassa_test";

export class BaseController extends  Controller{

    table = async (ctx: Context, next: () => any): Promise<void> => {

        let tableData: Array<ExampleTableRow> = await KassaTestModel.getAll('kassa_test');

        console.log();

        ctx.body = tableData;
        next();
    }

}