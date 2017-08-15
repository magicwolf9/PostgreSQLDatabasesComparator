import {TEST_SCHEMA} from "../../globals";

export interface IDifference {
    type: string;

    schema?: string;
    table: string;

    columnsInTest?: Array<string>;
    columnsInProd?: Array<string>;

    valueInTest?: any;
    valueInProd?: any;
}

export class DiffGenerator{
    tableName: string;

    public static readonly NO_SUCH_TABLE: string = 'There is no table with given name';
    public static readonly NO_SUCH_COLUMN: string = 'There is no such column';
    public static readonly NO_SUCH_ROW: string = 'There is no row with same values';
    public static readonly DIFFERENT_VALUES: string = 'Values in rows differ';

    generateDifferentValuesDiff(rowTest: Array<any>, rowProd: Array<any>): IDifference {
        return {
            type: DiffGenerator.DIFFERENT_VALUES,

            table: this.tableName,

            valueInTest: rowTest,
            valueInProd: rowProd,
        };
    }

    generateNoSuchRowDiff(row: Array<any>, schema: string): IDifference{
        let valueInTest = schema === TEST_SCHEMA ? null : row;
        let valueInProd = null;
        if(valueInTest === null) {
            valueInProd = row;
        }

        return {
            type: DiffGenerator.NO_SUCH_ROW,

            schema: schema,
            table: this.tableName,

            valueInTest: valueInTest,
            valueInProd: valueInProd,
        };
    }

    generateNoSuchColumns(uniqueColumnsTest: Array<string>, uniqueColumnsProd: Array<string>): IDifference {
        return {
            type: DiffGenerator.NO_SUCH_COLUMN,

            table: this.tableName,

            columnsInTest: uniqueColumnsTest,
            columnsInProd: uniqueColumnsProd,
        }
    }

    generateNoSuchTable(tableName: string, schema: string): IDifference {
        return {
            type: DiffGenerator.NO_SUCH_TABLE,

            schema: schema,
            table: tableName
        }
    }
}