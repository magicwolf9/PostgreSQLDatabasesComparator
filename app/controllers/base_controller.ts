import {Controller} from "innots";
import {Context} from 'koa';
import {KassaTestModel} from "../models/kassa_test";



export class BaseController extends  Controller{

    table1Data: Array<any>;
    table2Data: Array<any>;

    table1Name: string;
    table2Name: string;

    table = async (ctx: Context, next: () => any): Promise<void> => {

        this.table1Name = 'kassa_test';
        this.table2Name = 'kassa_test';

        this.table1Data = await KassaTestModel.getAll(this.table1Name);
        this.table2Data = await KassaTestModel.getAll1(this.table2Name);


//        ctx.body = differences;
        next();
    };
}
