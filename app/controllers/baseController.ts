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

        let i;
        let hasCode: boolean;
        let k;
        this.table1Data = await KassaTestModel.getAll(this.table1Name);
        this.table2Data = await KassaTestModel.getAll1(this.table2Name);

        let differences: Array<IDifference> = [];

        // {[codes], [codes]} {[values], [values]}
        // codes map ---> loop "find" else make a diff
        //                                             if true check values

        let table1Columns: Array<string> = this.table1Data.map(a => a.extra_code);
        let table2Columns: Array<string> = this.table2Data.map(a => a.extra_code);

        // make hashmap column-value
        let table1HashMap = this.table1Data.reduce(function(map, obj) {
            map[obj.extra_code] = obj.extra_name;
            return map;
        }, {});
        let table2HashMap = this.table2Data.reduce(function(map, obj) {
            map[obj.extra_code] = obj.extra_name;
            return map;
        }, {});

        let uniqueColumnsInTable1 = table1Columns.filter(val => table2Columns.indexOf(val) == -1);
        let uniqueColumnsInTable2 = table2Columns.filter(val => table1Columns.indexOf(val) == -1);

        // make differences from unique columns and delete them from hashmap
        for(let columnName of uniqueColumnsInTable1){
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
        }

        for(let columnName of uniqueColumnsInTable2){
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
        }

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

    makeDifference(table1row?: number, table2row?: number): IDifference{
        let newDiff: IDifference;

        newDiff.table1 = this.table1Name;
        newDiff.table2 = this.table2Name;


        newDiff.rowInTable1 = table1row;
        newDiff.rowInTable2 = table2row;

        if(table1row && table2row) {
            newDiff.columnInTable1 = this.table1Data[table1row].extra_code;
            newDiff.columnInTable2 = this.table2Data[table2row].extra_code;

            newDiff.valueInTable1 = this.table1Data[table1row].extra_name;
            newDiff.valueInTable2 = this.table2Data[table2row].extra_name;
        }
        return newDiff;
    }

}



interface IDifference{
    table1: string;
    table2: string;

    columnInTable1: string;
    columnInTable2: string;

    rowInTable1: number;
    rowInTable2: number;

    valueInTable1: any;
    valueInTable2: any;
}