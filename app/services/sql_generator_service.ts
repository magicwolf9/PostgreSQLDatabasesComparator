import * as _ from 'lodash';
import * as config from "config";
import {DiffGenerator, IDifference} from "./diff_generator_service";

const fs = require('fs');

import {logger, PROD_SCHEMA, TEST_SCHEMA} from "../../globals";
import {isNull, isUndefined} from "util";

export class SQLGenerator {

    DBName: string;

    generateSQLAndFillDiffs(differences: Array<any>): { SQLCommandsTestToProd: string, SQLCommandsProdToTest: string } {

        let SQLCommandsTestToProd: string = '';
        let SQLCommandsProdToTest: string = '';

        Object.keys(differences).forEach(tableName => {

            differences[tableName].forEach(diffForTable => {

                switch (diffForTable.type) {

                    case DiffGenerator.NO_SUCH_ROW: {

                        let commandTestToProd: string;
                        let commandProdToTest: string;

                        [commandTestToProd, commandProdToTest] = this.generateForNoSuchRow(diffForTable);

                        if (!isNull(commandTestToProd)) {
                            SQLCommandsTestToProd += commandTestToProd;
                            diffForTable.SQLtoFixIt = commandTestToProd;
                        } else {
                            SQLCommandsProdToTest += commandProdToTest;
                            diffForTable.SQLtoFixIt = commandProdToTest;
                        }

                        break;
                    }

                    case DiffGenerator.DIFFERENT_VALUES: {

                        let commandTestToProd: string;
                        let commandProdToTest: string;

                        [commandTestToProd, commandProdToTest] = this.generateForDifferentValues(diffForTable);

                        SQLCommandsTestToProd += commandTestToProd;
                        SQLCommandsProdToTest += commandProdToTest;

                        diffForTable.SQLtoFixIt = `Fix by transfer test data to prod: ` + commandTestToProd + `\n 
                                Fix by transfer prod data to test: ` + commandProdToTest;
                        break;
                    }
                    default:
                        break;
                }
            });

        });

        //TODO разнести в разные файлы

        fs.writeFile(config.get(this.DBName + '.pathForSQLFiles') + '/SQLCommandsTestDataToProd', SQLCommandsTestToProd, function (err) {
            if (err) {
                logger.error(err);
            }
        });

        fs.writeFile(config.get(this.DBName + '.pathForSQLFiles') + '/SQLCommandsProdDataToTest', SQLCommandsProdToTest, function (err) {
            if (err) {
                logger.error(err);
            }
        });


        return {SQLCommandsTestToProd: SQLCommandsTestToProd, SQLCommandsProdToTest: SQLCommandsProdToTest};
    }

    generateForNoSuchRow(difference: IDifference): [string, string] {
        let SQLcommand: string = `INSERT INTO ` + difference.table + ` (`;

        const row = difference.valueInTest ? difference.valueInTest : difference.valueInProd;

        Object.keys(row).forEach(key => {
            if (!(difference.primaryKeys.indexOf(_.snakeCase(key)) != -1 && (typeof row[key] == 'number'))) {
                SQLcommand += _.snakeCase(key) + `, `;
            }
        });

        //delete last `, `
        SQLcommand = SQLcommand.substr(0, SQLcommand.length - 2);

        SQLcommand += `)\n\t VALUES (`;

        Object.keys(row).forEach(key => {

            //if row[key] is not an autoincrement primary key
            if (!(difference.primaryKeys.indexOf(_.snakeCase(key)) != -1 && (typeof row[key] == 'number'))) {

                SQLcommand += this.addValueToSQLString(row[key]);
            }
        });

        //delete last `, `
        SQLcommand = SQLcommand.substr(0, SQLcommand.length - 2);

        SQLcommand += `);\n`;

        if (difference.schema == TEST_SCHEMA)
            return [null, SQLcommand];

        return [SQLcommand, null];
    }

    generateForDifferentValues(difference: IDifference): [string, string] {

        let commandForTestToProd: string = `UPDATE kassa.${difference.table} SET `;
        let commandForProdToTest: string = `UPDATE kassa.${difference.table} SET `;

        //get only differences in values
        let rowTest: any = _.cloneDeep(difference.valueInTest);
        let rowProd: any = _.cloneDeep(difference.valueInProd);

        [rowTest, rowProd] = this.deleteEqualsValuesFromRows(rowTest, rowProd);

        //generate sql to transfer test data to prod
        Object.keys(rowTest).forEach(key => {

            if (!this.columnIsAnAutoincrementPrimaryKey(difference.primaryKeys, key, rowTest[key])) {
                commandForTestToProd += this.addValueAssigntmentToSQLString(key, rowTest[key]);
            }
        });

        //generate sql to transfer prod data to test
        Object.keys(rowProd).forEach(key => {

            //if row[key] is not an autoincrement primary key
            if (!this.columnIsAnAutoincrementPrimaryKey(difference.primaryKeys, key, rowProd[key])) {
                commandForProdToTest += this.addValueAssigntmentToSQLString(key, rowProd[key]);
            }
        });

        //delete last `, `
        commandForTestToProd = commandForTestToProd.substr(0, commandForTestToProd.length - 2);
        commandForProdToTest = commandForProdToTest.substr(0, commandForProdToTest.length - 2);

        //add 'where'
        commandForTestToProd += `\n\t WHERE `;
        commandForProdToTest += `\n\t WHERE `;

        rowTest = difference.valueInTest;
        rowProd = difference.valueInProd;

        difference.primaryKeys.forEach(key => {
            key = _.camelCase(key);

            if (typeof rowTest[key] != 'number') {

                commandForTestToProd += key + ` = '` + rowTest[key.toString()] + `' AND `;
                commandForProdToTest += key + ` = '` + rowProd[key.toString()] + `' AND `;
            } else {

                commandForTestToProd += key + ` = ` + rowTest[key.toString()] + ` AND `;
                commandForProdToTest += key + ` = ` + rowProd[key.toString()] + ` AND `;
            }
        });

        //delete last ` AND `
        commandForTestToProd = commandForTestToProd.substr(0, commandForTestToProd.length - 4);
        commandForProdToTest = commandForProdToTest.substr(0, commandForProdToTest.length - 4);

        commandForTestToProd += `);\n`;
        commandForProdToTest += `);\n`;

        return [commandForTestToProd, commandForProdToTest]
    }

    deleteEqualsValuesFromRows(rowTest: any, rowProd: any): [any, any] {
        Object.keys(rowTest).forEach(key => {

            if (Object.keys(rowProd).indexOf(key) == -1) {

                delete rowTest[key];

            } else if (rowTest[key] == rowProd[key]) {

                delete rowTest[key];
                delete rowProd[key];
            }
        });

        Object.keys(rowProd).forEach(key => {
            if (Object.keys(rowTest).indexOf(key) == -1) {
                delete rowProd[key];
            }
        });
        return [_.pickBy(rowTest, v => v !== undefined), _.pickBy(rowProd, v => v !== undefined)];
    }

    addValueToSQLString(value): string {
        if (isNull(value) || isUndefined(value)) {
            return `default, `;
        } else if (typeof value != 'number') {
            return `'` + value + `', `;
        } else {
            return value + `, `;
        }
    }

    addValueAssigntmentToSQLString(name: string, value): string {
        if (typeof value != 'number') {
            return _.snakeCase(name) + ` = '` + value + `', `;
        } else {
            return _.snakeCase(name) + ` = ` + value + `, `;
        }
    }

    columnIsAnAutoincrementPrimaryKey(primaryKeys: Array<string>, columnName: string, value): boolean {
        return primaryKeys.indexOf(_.snakeCase(columnName)) != -1 && (typeof value == 'number');
    }

}