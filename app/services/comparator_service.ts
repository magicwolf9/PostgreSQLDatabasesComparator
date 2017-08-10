
var _ = require('lodash/array');
var isEqual = require('lodash.isequal');

export interface IDifference {
    type: string;

    schema?: string;
    table: string;

    columnsInTest?: Array<string>;
    columnsInProd?: Array<string>;

    valueInTest?: any;
    valueInProd?: any;
}

export interface ITableInfo{
    tableName: string;
    primaryKeys: Array<string>;
    tableData: Array<any>;
}

export class Comparator{
    NO_SUCH_ROW: string = 'There is no row with same values';
    NO_SUCH_COLUMN: string = 'There is no such column';
    DIFFERENT_VALUES: string = 'Values in rows differ';
    TEST_SCHEMA: string = 'test';
    PROD_SCHEMA: string = 'production';

    differences: Array<IDifference> = [];
    tableName: string;
    primaryKeys: Array<string>;

    public compareTables(tableTestInfo: ITableInfo, tableProdInfo: ITableInfo): Array<IDifference>{
        this.tableName = tableTestInfo.tableName;

        console.log(tableTestInfo);

        //TODO edit data according to settings: search by primary / search by same values/ ignore primary

        this.primaryKeys = tableTestInfo.primaryKeys;

        tableTestInfo.tableData.forEach(rowTest => {
            //TODO if need get row from table2 by primaries
            // const row2 = this.findWithSamePrimaries(row, table2Info);

            const rowProd = this.findWithSameValues(rowTest, tableProdInfo);

            if(!rowProd){
                this.differences[this.differences.length] = this.generateNoSuchRowDiff(rowTest, this.PROD_SCHEMA)
            } else {
                delete tableProdInfo.tableData[tableProdInfo.tableData.indexOf(rowProd)];
                tableProdInfo.tableData = tableProdInfo.tableData.filter(Boolean);
            }
            //if was found by primaries this.compareRows(row, row2);
        });

        //make differences from rest of lines in table2
        for (let row of tableProdInfo.tableData) {
            this.differences[this.differences.length] = this.generateNoSuchRowDiff(row, this.TEST_SCHEMA)
        }

        return this.differences;
    };

    findWithSamePrimaries(rowTest: Array<any>, prodTableInfo: ITableInfo): Array<any> {
        let keyColumnsOfRowTest = new Map<string, string>();

        console.log(Object.keys(rowTest));
        Object.keys(rowTest).forEach(key => {
            if(this.isPrimaryColumn(key)) keyColumnsOfRowTest.set(key, rowTest[key]);
        });

        console.log(keyColumnsOfRowTest);

        for(let rowProd of prodTableInfo.tableData){
            console.log(rowProd);

            let keyColumnsOfRowProd = new Map<string, string>();

            Object.keys(rowProd).forEach(key => {
                if(this.isPrimaryColumn(key)) keyColumnsOfRowProd.set(key, rowProd[key]);
            });

            console.log(keyColumnsOfRowProd);

            if(this.samePrimaryKeysValues(keyColumnsOfRowTest, keyColumnsOfRowProd)){
                return rowProd;
            }
        }
        return null;
    }

    findWithSameValues(rowTest: Array<any>, prodTableInfo: ITableInfo): Array<any> {

        for(let row2 of prodTableInfo.tableData){

            let valuesEquals: boolean = true;
            Object.keys(rowTest).forEach((key: string) => {

                if(row2[key] != rowTest[key]){
                    valuesEquals = false;
                }
            });

            if(valuesEquals) return row2;
        }
        return null;
    }

    compareRows(rowTest: Array<any>, rowProd: Array<any>){
/*

        const row1HashMap = this.rowDataToMap(row1);
        const row2HashMap = this.rowDataToMap(row2);
*/

        const row1Columns: Array<string> = Object.keys(rowTest);
        const row2Columns: Array<string> = Object.keys(rowProd);

        const uniqueColumnsInTest = row1Columns.filter(val => row2Columns.indexOf(val) == -1);
        const uniqueColumnsInProd = row2Columns.filter(val => row1Columns.indexOf(val) == -1);

        if(uniqueColumnsInTest.length > 0 || uniqueColumnsInProd.length > 0) {
            this.differences[this.differences.length] = this.generateNoSuchColumns(uniqueColumnsInTest, uniqueColumnsInProd)
        }

        // check columns for equal values, make differences is not
        Object.keys(rowTest).forEach((key: string) => {
            const value = rowTest[key];

            //TODO change because diff for each not equal value is too much
            if(uniqueColumnsInTest.indexOf(key) === -1 && rowProd[key] != value){
                this.differences[this.differences.length] = this.generateDifferentValuesDiff(rowTest, rowProd);
            }
        });
    }

    generateDifferentValuesDiff(rowTest: Array<any>, rowProd: Array<any>): IDifference {
        return {
            type: this.DIFFERENT_VALUES,

            table: this.tableName,

            valueInTest: rowTest,
            valueInProd: rowProd,
        };
    }
    generateNoSuchRowDiff(row: Array<any>, schema: string): IDifference{
        let valueInTest = schema === this.TEST_SCHEMA ? null : row;
        let valueInProd = null;
        if(valueInTest === null) {
            valueInProd = row;
        }

        return {
            type: this.NO_SUCH_ROW,

            schema: schema,
            table: this.tableName,

            valueInTest: valueInTest,
            valueInProd: valueInProd,
        };
    }

    generateNoSuchColumns(uniqueColumnsTest: Array<string>, uniqueColumnsProd: Array<string>): IDifference {
        return {
            type: this.NO_SUCH_COLUMN,

            table: this.tableName,

            columnsInTest: uniqueColumnsTest,
            columnsInProd: uniqueColumnsProd,
        }
    }

    samePrimaryKeysValues(primaryKeysValues1: Map<string, string>, primaryKeysValues2: Map<string, string>): boolean{
        return isEqual(primaryKeysValues1, primaryKeysValues2);
    }

    rowDataToMap(row: Array<any>): Map<string, string> {
        const rowMap = new Map();
        row.forEach(function(obj){
            rowMap.set(obj[0], obj[1]);
        });
        return rowMap;
    }

    isPrimaryColumn(key: string): boolean {
        console.log(key);
        return this.primaryKeys.indexOf(key) != -1;
    }
}