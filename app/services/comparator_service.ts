var _ = require('lodash/array');
var isEqual = require('lodash.isequal');

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

export interface ITableInfo{
    tableName: string;
    primaryKeys: Array<string>;
    tableData: Array<any>;
}

export class Comparator{
    differences: Array<IDifference> = [];
    table1Name: string;
    table2Name: string;
    primaryKeys: Array<string>;

    public compareTables(table1Info: ITableInfo, table2Info: ITableInfo): Array<IDifference>{
        this.table1Name = table1Info.tableName;
        this.table2Name = table2Info.tableName;

        console.log(table1Info);

        //TODO edit data according to settings: search by primary / search by same values/ ignore primary

        this.primaryKeys = table1Info.primaryKeys;

        const table2RestOfRows = table2Info.tableData;

        table1Info.tableData.forEach(row => {
            console.log(row);

            //TODO if need get row from table2 by primaries
            // const row2 = this.findWithSamePrimaries(row, table2Info);

            const row2 = this.findWithSameValues(row, table2Info);

            if(!row2){
                this.differences[this.differences.length] = {
                    table1: this.table1Name,
                    table2: this.table2Name,

                    columnInTable1: '',
                    columnInTable2: '',

                    rowInTable1: table1Info.tableData.indexOf(row),
                    rowInTable2: -1,

                    valueInTable1: row,
                    valueInTable2: '',
                };
            }

            delete table2RestOfRows[table2RestOfRows.indexOf(row2)];

            //if was found by primaries this.compareRows(row, row2);
        });

        //make differences from rest of lines in table2
        for (let row of table2RestOfRows) {
            this.differences[this.differences.length] = {
                table1: this.table1Name,
                table2: this.table2Name,

                columnInTable1: '',
                columnInTable2: '',

                rowInTable1: -1,
                rowInTable2: table2Info.tableData.indexOf(row),

                valueInTable1: '',
                valueInTable2: row,
            };
        }

        return this.differences;
    };

    findWithSamePrimaries(row: Array<any>, secondTableInfo: ITableInfo): Array<any> {
        let keyColumnsOfRowTable1 = new Map<string, string>();

        console.log(Object.keys(row));
        Object.keys(row).forEach(key => {
            if(this.isPrimaryColumn(key)) keyColumnsOfRowTable1.set(key, row[key]);
        });

        console.log(keyColumnsOfRowTable1);

        for(let row2 of secondTableInfo.tableData){
            console.log(row2);

            let keyColumnsOfRowTable2 = new Map<string, string>();

            Object.keys(row2).forEach(key => {
                if(this.isPrimaryColumn(key)) keyColumnsOfRowTable2.set(key, row2[key]);
            });

            console.log(keyColumnsOfRowTable2);

            if(Comparator.samePrimaryKeysValues(keyColumnsOfRowTable1, keyColumnsOfRowTable2)){
                return row2;
            }
        }
        return null;
    }

    findWithSameValues(row1: Array<any>, secondTableInfo: ITableInfo): Array<any> {

        //const row1 = Comparator.rowDataToMap(row);

        for(let row2 of secondTableInfo.tableData){
            console.log(row2);
            //row2 = Comparator.rowDataToMap(row2);

            let valuesEquals: boolean = true;
            Object.keys(row1).forEach((key: string) => {

                if(row2[key] != row1[key]){
                    valuesEquals = false;
                }
            });

            if(valuesEquals) return row2;
        }
        return null;
    }

    compareRows(row1: Array<any>, row2: Array<any>){

        const row1HashMap = Comparator.rowDataToMap(row1);
        const row2HashMap = Comparator.rowDataToMap(row2);

        const row1Columns: Array<string> = Object.keys(row1HashMap);
        const row2Columns: Array<string> = Object.keys(row2HashMap);

        const uniqueColumnsInRow1 = row1Columns.filter(val => row2Columns.indexOf(val) == -1);
        const uniqueColumnsInRow2 = row2Columns.filter(val => row1Columns.indexOf(val) == -1);

        // make differences from unique columns and delete them from hashmap
        uniqueColumnsInRow1.forEach(columnName => {
            this.differences[this.differences.length] = {
                table1: this.table1Name,
                table2: this.table2Name,

                columnInTable1: columnName,
                columnInTable2: '',

                rowInTable1: -1,
                rowInTable2: -1,

                valueInTable1: row1HashMap[columnName],
                valueInTable2: '',
            };
            delete row1HashMap[columnName];
        });

        uniqueColumnsInRow2.forEach(columnName => {
            this.differences[this.differences.length] = {
                table1: this.table1Name,
                table2: this.table2Name,

                columnInTable1: '',
                columnInTable2: columnName,

                rowInTable1: -1,
                rowInTable2: -1,

                valueInTable1: '',
                valueInTable2: row2HashMap[columnName],
            };
            delete row2HashMap[columnName];
        });

        // check columns for equal values, make differences is not
        Object.keys(row1HashMap).forEach((key: string) => {
            const value = row1HashMap[key];

            if(row2HashMap[key] != value){
                this.differences[this.differences.length] = {
                    table1: this.table1Name,
                    table2: this.table2Name,

                    columnInTable1: key,
                    columnInTable2: key,

                    rowInTable1: 1,
                    rowInTable2: 1,

                    valueInTable1: value,
                    valueInTable2: row2HashMap[key],
                };
            }
        });
    }

    static samePrimaryKeysValues(primaryKeysValues1: Map<string, string>, primaryKeysValues2: Map<string, string>): boolean{
        return isEqual(primaryKeysValues1, primaryKeysValues2);
    }

    static rowDataToMap(row: Array<any>): Map<string, string> {
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