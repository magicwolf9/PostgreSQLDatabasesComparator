var array = require('lodash/array');

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

class Comparator{
    differences: Array<IDifference> = [];
    table1Name: string;
    table2Name: string;

    compareTables(table1Info: ITableInfo, table2Info: ITableInfo): Array<IDifference>{
        this.table1Name = table1Info.tableName;
        this.table2Name = table2Info.tableName;

        //TODO for each row in table1 search same primary in table1
        //TODO if there are no row with same primary values make difference
        //TODO if there is a row, then compare rows

        //TODO for each row in table2 search same primary in table1
        //TODO if there are no row with same primary values make difference

        return this.differences;
    };

    compareRows(row1Data: Array<any>, row2Data: Array<any>){

        // {[codes], [codes]} {[values], [values]}
        // codes map ---> loop "find" else make a diff
        //                                             if true check values

        const row1Columns: Array<string> = row1Data.map(a => a.extra_code);
        const row2Columns: Array<string> = row2Data.map(a => a.extra_code);

        // make hashmap column-value
        const row1HashMap = row1Data.reduce((map, obj) => {
            map[obj.extra_code] = obj.extra_name;
            return map;
        }, {});
        const row2HashMap = row2Data.reduce((map, obj) => {
            map[obj.extra_code] = obj.extra_name;
            return map;
        }, {});

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

    samePrimaryKeys(primaryKeys1: Array<string>, primaryKeys2: Array<string>): boolean{
        return array.differences(primaryKeys1, primaryKeys2).length === 0;
    }
}