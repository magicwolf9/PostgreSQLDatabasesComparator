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
    primaryKeys: Array<string>;

    compareTables(table1Info: ITableInfo, table2Info: ITableInfo): Array<IDifference>{
        this.table1Name = table1Info.tableName;
        this.table2Name = table2Info.tableName;

        table1Info.tableData.forEach(row => Comparator.rowDataToMap(row));
        table2Info.tableData.forEach(row => Comparator.rowDataToMap(row));

        this.primaryKeys = table1Info.primaryKeys;


        //for each row in table1 search same primary in table2
        table1Info.tableData.forEach(row => {
            const keyColumnsOfRowTable1 = row.filter((key, value) => this.isPrimaryColumn(key, value));

            let hasPairRowWithSamePrimaries: boolean = false;

            table2Info.tableData.forEach(row2 => {
                const keyColumnsOfRowTable2 = row2.filter((key, value) => this.isPrimaryColumn(key, value));

                //if there is a row, then compare rows
                if(this.samePrimaryKeysValues(keyColumnsOfRowTable1, keyColumnsOfRowTable2)){
                    hasPairRowWithSamePrimaries = true;
                    this.compareRows(row, row2);
                }
            });

            //if there are no row with same primary values make difference
            if(!hasPairRowWithSamePrimaries){
                //TODO make difference
            }
        });

        //TODO for each row in table2 search same primary in table1
        //TODO if there are no row with same primary values make difference

        return this.differences;
    };

    compareRows(row1HashMap: Array<any>, row2HashMap: Array<any>){

        // {[codes], [codes]} {[values], [values]}
        // codes map ---> loop "find" else make a diff
        //                                             if true check values

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

    samePrimaryKeysValues(primaryKeys1: Array<string>, primaryKeys2: Array<string>): boolean{
        return array.differences(primaryKeys1, primaryKeys2).length === 0;
    }

    static rowDataToMap(row: Array<any>): Array<any> {
        return row.reduce((map, obj) => {
            map[obj.extra_code] = obj.extra_name;
            return map;
        });
    }

    isPrimaryColumn(key, value): boolean {
        return this.primaryKeys.indexOf(key) != -1;
    }
}