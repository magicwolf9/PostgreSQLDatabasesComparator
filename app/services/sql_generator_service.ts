import * as _ from 'lodash';
import {DiffGenerator, IDifference} from "./diff_generator_service";
const fs = require('fs');

import {logger, PROD_SCHEMA} from "../../globals";
import {isNull, isUndefined} from "util";

export class SQLGenerator{

    generateSQL(differences: Array<IDifference>): [Array<IDifference>, Array<string>]{

        let SQLCommandsTestToProd: Array<string> = [];
        let SQLCommandsProdToTest: Array<string> = [];

        differences.forEach(difference => {

            switch(difference.type) {

                case DiffGenerator.NO_SUCH_ROW:{

                    let commandTestToProd: string;
                    let commandProdToTest: string;

                    [commandTestToProd, commandProdToTest] = this.generateForNoSuchRow(difference);

                    SQLCommandsTestToProd = SQLCommandsTestToProd.concat(commandTestToProd);
                    SQLCommandsProdToTest = SQLCommandsProdToTest.concat(commandProdToTest);

                    difference.SQLtoFixIt = commandTestToProd + commandProdToTest;
                    break;
                }

                case DiffGenerator.DIFFERENT_VALUES: {

                    let commandTestToProd: string;
                    let commandProdToTest: string;

                    [commandTestToProd, commandProdToTest] = this.generateForDifferentValues(difference);

                    SQLCommandsTestToProd = SQLCommandsTestToProd.concat(commandTestToProd);
                    SQLCommandsProdToTest = SQLCommandsProdToTest.concat(commandProdToTest);

                    difference.SQLtoFixIt = commandTestToProd + commandProdToTest;
                    break;
                }
                default:
                    break;
            }

        });

        //TODO разнести в разные файлы

        fs.writeFile('/SQLCommandsTestDataToProd', SQLCommandsTestToProd, function (err) {
           if(err){
               logger.error(err);
           }
        });

        fs.writeFile('/SQLCommandsProdDataToTest', SQLCommandsProdToTest, function (err) {
            if(err){
                logger.error(err);
            }
        });


        return [differences, SQLCommandsTestToProd];
    }

    generateForNoSuchRow(difference: IDifference): [string, string]{
        let SQLcommand: string = `INSERT INTO ` + difference.table + ` (`;

        const row = difference.valueInTest? difference.valueInTest: difference.valueInProd;

        Object.keys(row).forEach(key => {
            if(!(difference.primaryKeys.indexOf(_.snakeCase(key)) != -1 && (typeof row[key] == 'number'))) {
                SQLcommand += _.snakeCase(key) + `, `;
            }
        });

        //delete last `, `
        SQLcommand = SQLcommand.substr(0 , SQLcommand.length - 2);

        SQLcommand += `) 
        VALUES (`;

        Object.keys(row).forEach(key => {
            //if row[key] is not an autoincrement primary key
            if(!(difference.primaryKeys.indexOf(_.snakeCase(key)) != -1 && (typeof row[key] == 'number'))){

                if(isNull(row[key]) || isUndefined(row[key])) {
                    SQLcommand += `default, `;
                } else if (typeof row[key] != 'number'){
                    SQLcommand += `'`+ row[key] + `', `;
                } else {
                    SQLcommand += row[key] + `, `;
                }
            }
        });

        //delete last `, `
        SQLcommand = SQLcommand.substr(0 , SQLcommand.length - 2);

        SQLcommand += `);`;
        return [SQLcommand, SQLcommand];
    }

    generateForDifferentValues(difference: IDifference): [string, string] {

        let commandForTestToProd: string = `UPDATE kassa.${difference.table} SET `;
        let commandForProdToTest: string = `UPDATE kassa.${difference.table} SET `;

        //get only differences in values
        let rowTest: any = _.cloneDeep(difference.valueInTest);
        let rowProd: any = _.cloneDeep(difference.valueInProd);

        [rowTest, rowProd] = this.deleteEqualsValuesFromRows(rowTest, rowProd);

        //generate sql to transfer test data to prod
        Object.keys(rowTest).forEach(key =>{

            //if row[key] is not an autoincrement primary key
            if(!(difference.primaryKeys.indexOf(_.snakeCase(key)) != -1 && (typeof rowTest[key] == 'number'))){

                if(typeof rowTest[key] != 'number') {
                    commandForTestToProd += _.snakeCase(key) + ` = '` + rowTest[key] + `', `;
                } else {
                    commandForTestToProd += _.snakeCase(key) + ` = ` + rowTest[key] + `, `;
                }
            }
        });

        //generate sql to transfer prod data to test
        Object.keys(rowProd).forEach(key =>{

            //if row[key] is not an autoincrement primary key
            if(!(difference.primaryKeys.indexOf(_.snakeCase(key)) != -1 && (typeof rowTest[key] == 'number'))) {

                if (typeof rowProd[key] != 'number') {
                    commandForProdToTest += _.snakeCase(key) + ` = '` + rowProd[key] + `', `;
                } else {
                    commandForProdToTest += _.snakeCase(key) + ` = ` + rowProd[key] + `, `;
                }
            }
        });

        //delete last `, `
        commandForTestToProd = commandForTestToProd.substr(0 , commandForTestToProd.length - 2);
        commandForProdToTest = commandForProdToTest.substr(0 , commandForProdToTest.length - 2);

        //TODO add 'where'
        commandForTestToProd += ` WHERE `;
        commandForProdToTest += ` WHERE `;

        rowTest = difference.valueInTest;
        rowProd = difference.valueInProd;

        difference.primaryKeys.forEach(key => {
            key = _.camelCase(key);

            if(typeof rowTest[key] != 'number') {

                commandForTestToProd += key + ` = '` + rowTest[key.toString()] + `' AND `;
                commandForProdToTest += key + ` = '` + rowProd[key.toString()] + `' AND `;
            } else {

                commandForTestToProd += key + ` = ` + rowTest[key.toString()] + ` AND `;
                commandForProdToTest += key + ` = ` + rowProd[key.toString()] + ` AND `;
            }
        });

        //delete last ` AND `
        commandForTestToProd = commandForTestToProd.substr(0 , commandForTestToProd.length - 4);
        commandForProdToTest = commandForProdToTest.substr(0 , commandForProdToTest.length - 4);

        return [commandForTestToProd, commandForProdToTest]
    }

    deleteEqualsValuesFromRows(rowTest: any, rowProd: any): [any, any]{
        Object.keys(rowTest).forEach(key => {

            if(Object.keys(rowProd).indexOf(key) == -1){

                delete rowTest[key];

            } else if(rowTest[key] == rowProd[key]){

                delete rowTest[key];
                delete rowProd[key];
            }
        });

        Object.keys(rowProd).forEach(key => {
            if(Object.keys(rowTest).indexOf(key) == -1){
                delete rowProd[key];
            }
        });
        return [_.pickBy(rowTest, v => v !== undefined), _.pickBy(rowProd, v => v !== undefined)];
    }
}