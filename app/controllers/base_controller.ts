import {Controller} from "innots";
import {Context} from 'koa';
import {KassaTestModel} from "../models/kassa_test";

export interface IDifference {
    table1: string;
    table2: string;

    columnInTable1: string;
    columnInTable2: string;

    rowInTable1: number;
    rowInTable2: number;

    valueInTable1: any;
    valueInTable2: any;
}

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

        const differences: Array<IDifference> = [];

        // {[codes], [codes]} {[values], [values]}
        // codes map ---> loop "find" else make a diff
        //                                             if true check values

        const table1Columns: Array<string> = this.table1Data.map(a => a.extra_code);
        const table2Columns: Array<string> = this.table2Data.map(a => a.extra_code);

        // make hashmap column-value
        const table1HashMap = this.table1Data.reduce((map, obj) => {
            map[obj.extra_code] = obj.extra_name;
            return map;
        }, {});
        const table2HashMap = this.table2Data.reduce((map, obj) => {
            map[obj.extra_code] = obj.extra_name;
            return map;
        }, {});

        const uniqueColumnsInTable1 = table1Columns.filter(val => table2Columns.indexOf(val) == -1);
        const uniqueColumnsInTable2 = table2Columns.filter(val => table1Columns.indexOf(val) == -1);

        // make differences from unique columns and delete them from hashmap
        uniqueColumnsInTable1.forEach(columnName => {
            differences[differences.length] = {
                table1: this.table1Name,
                table2: this.table2Name,

                columnInTable1: columnName,
                columnInTable2: '',

                rowInTable1: -1,
                rowInTable2: -1,

                valueInTable1: table1HashMap[columnName],
                valueInTable2: '',
            };
            delete table1HashMap[columnName];
        });

        uniqueColumnsInTable2.forEach(columnName => {
            differences[differences.length] = {
                table1: this.table1Name,
                table2: this.table2Name,

                columnInTable1: '',
                columnInTable2: columnName,

                rowInTable1: -1,
                rowInTable2: -1,

                valueInTable1: '',
                valueInTable2: table2HashMap[columnName],
            };
            delete table2HashMap[columnName];
        });

        // check columns for equal values, make differences is not
        Object.keys(table1HashMap).forEach((key: string) => {
            const value = table1HashMap[key];
            if(table2HashMap[key] != value){
                differences[differences.length] = {
                    table1: this.table1Name,
                    table2: this.table2Name,

                    columnInTable1: key,
                    columnInTable2: key,

                    rowInTable1: 1,
                    rowInTable2: 1,

                    valueInTable1: value,
                    valueInTable2: table2HashMap[key],
                };
            }
        });

        ctx.body = differences;
        next();
    };
}
