import {TEST_SCHEMA} from "../../globals";

import {NO_SUCH_TABLE} from "../../globals";
import {NO_SUCH_COLUMN} from "../../globals";
import {NO_SUCH_ROW} from "../../globals";
import {DIFFERENT_VALUES} from "../../globals";

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

    generateDifferentValuesDiff(rowTest: Array<any>, rowProd: Array<any>): IDifference {
        return {
            type: DIFFERENT_VALUES,

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
            type: NO_SUCH_ROW,

            schema: schema,
            table: this.tableName,

            valueInTest: valueInTest,
            valueInProd: valueInProd,
        };
    }

    generateNoSuchColumns(uniqueColumnsTest: Array<string>, uniqueColumnsProd: Array<string>): IDifference {
        return {
            type: NO_SUCH_COLUMN,

            table: this.tableName,

            columnsInTest: uniqueColumnsTest,
            columnsInProd: uniqueColumnsProd,
        }
    }

    generateNoSuchTable(tableName: string, schema: string): IDifference {
        return {
            type: NO_SUCH_TABLE,

            schema: schema,
            table: tableName
        }
    }
}