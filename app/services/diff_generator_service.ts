import {PROD_DB, TEST_DB} from "../../globals";

export interface IDifference {
    type: string;

    schema?: string;
    table: string;
    primaryKeys?: Array<string>;

    columnsInTest?: Array<string>;
    columnsInProd?: Array<string>;

    valueInTest?: any;
    valueInProd?: any;

    SQLtoFixIt?: string;
}

export class DiffGenerator {
    tableName: string;

    public static readonly NO_SUCH_TABLE: string = 'There is no table with given name';
    public static readonly NO_SUCH_COLUMN: string = 'There is no such column';
    public static readonly NO_SUCH_ROW: string = 'There is no row with same values';
    public static readonly DIFFERENT_VALUES: string = 'Values in rows differ';

    generateDifferentValuesDiff(rowTest: Array<any>, rowProd: Array<any>, primaryKeys: Array<string>): IDifference {
        return {
            type: DiffGenerator.DIFFERENT_VALUES,

            table: this.tableName,
            primaryKeys: primaryKeys,

            valueInTest: rowTest,
            valueInProd: rowProd,
        };
    }

    generateNoSuchRowDiff(row: Array<any>, db: string, primaryKeys: Array<string>): IDifference {
        let valueInTest: any;
        let valueInProd: any;

        switch (db) {
            case TEST_DB: {
                valueInTest = null;
                break;
            }
            case PROD_DB: {
                valueInProd = null;
                break;
            }
            default:
                break;
        }

        if (valueInTest === null) {
            valueInProd = row;
        }

        return {
            type: DiffGenerator.NO_SUCH_ROW,

            schema: db,
            table: this.tableName,
            primaryKeys: primaryKeys,

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

    generateNoSuchTable(tableName: string, db: string): IDifference {
        return {
            type: DiffGenerator.NO_SUCH_TABLE,

            schema: db,
            table: tableName
        }
    }
}