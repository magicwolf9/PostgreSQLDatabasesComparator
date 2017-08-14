import {IDifference} from "../app/services/diffGenerator_service";

var comparator_service = require("../app/services/comparator_service");
import {Comparator} from "../app/services/comparator_service";
import * as chai from 'chai';
const assert = chai.assert;

import {TEST_SCHEMA} from "../globals";
import {PROD_SCHEMA} from "../globals";

import {NO_SUCH_TABLE} from "../globals";
import {NO_SUCH_COLUMN} from "../globals";
import {NO_SUCH_ROW} from "../globals";
import {DIFFERENT_VALUES} from "../globals";

const comparator = new Comparator();
const tableName = "table";
comparator.tableName = tableName;
comparator.diffGenerator.tableName = tableName;

describe('Comparator', function () {

    describe('Comparator.compareRows', function () {

        it('should create diff about not found column', function (){
            const rowTest: any = {column: 'value', column2: 'value2'};
            const rowProd: any = {column: 'value'};

            let expectedDiff: IDifference = {
                type: NO_SUCH_COLUMN,

                table: tableName,

                columnsInTest: ['column2'],
                columnsInProd: []
            };

            comparator.compareRows(rowTest, rowProd);

            chai.expect(comparator.myDifferences).to.eql([expectedDiff]);
            comparator.myDifferences = [];
        });

        it('should create diff about not equals values', function (){
            const rowTest: any = {column: 'value'};
            const rowProd: any = {column: 'value1'};

            const expectedDiff: IDifference = {
                type: DIFFERENT_VALUES,

                table: tableName,

                valueInTest: rowTest,
                valueInProd: rowProd,
            };

            comparator.compareRows(rowTest, rowProd);

            chai.expect(comparator.myDifferences).to.eql([expectedDiff]);
            comparator.myDifferences = [];
        });

        it('should create diff about not equals values', function (){
            const rowTest: any = {column: 'value', column2: 'value'};
            const rowProd: any = {column: 'value', column2: 'value2'};

            const expectedDiff: IDifference = {
                type: DIFFERENT_VALUES,

                table: tableName,

                valueInTest: rowTest,
                valueInProd: rowProd,
            };

            comparator.compareRows(rowTest, rowProd);

            chai.expect(comparator.myDifferences).to.eql([expectedDiff]);
            comparator.myDifferences = [];
        });

        it('should create diff about not found column and different values', function (){
            const rowTest: any = {column: 'value', column2: 'value2'};
            const rowProd: any = {column: 'value3'};

            const expectedDiffs: IDifference[] = [{
                type: NO_SUCH_COLUMN,

                table: tableName,

                columnsInTest: ['column2'],
                columnsInProd: []
            }, {
                type: DIFFERENT_VALUES,

                table: tableName,

                valueInTest: rowTest,
                valueInProd: rowProd,
            }];

            comparator.compareRows(rowTest, rowProd);

            chai.expect(comparator.myDifferences).to.eql(expectedDiffs);
            comparator.myDifferences = [];
        });

        it('should create diff about not found columns and different values', function (){
            const rowTest: any = {column: 'value', column2: 'value2', column3: 'value3'};
            const rowProd: any = {column: 'value3'};

            const expectedDiffs: IDifference[] = [{
                type: NO_SUCH_COLUMN,

                table: tableName,

                columnsInTest: ['column2', 'column3'],
                columnsInProd: []
            }, {
                type: DIFFERENT_VALUES,

                table: tableName,

                valueInTest: rowTest,
                valueInProd: rowProd,
            }];

            comparator.compareRows(rowTest, rowProd);

            chai.expect(comparator.myDifferences).to.eql(expectedDiffs);
            comparator.myDifferences = [];
        });

    });


    describe('Comparator.samePrimaryKeysValues', function () {

        it('should return true on equals maps of primary columns', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary1');
            keys2.set('primaryKey2', 'primary2');

            let result = comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isTrue(result);
        });

        it('should return true on different orders of keys in maps', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey2', 'primary2');
            keys2.set('primaryKey1', 'primary1');

            let result = comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isTrue(result);
        });

        it('should return true on empty maps of primary columns', function () {
            const keys1 = new Map();
            const keys2 = new Map();
            let result = comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isTrue(result);
        });

        it('should return false on partly different maps of primary columns', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary1');
            keys2.set('primaryKey2', 'primary4');

            let result = comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isFalse(result);
        });

        it('should return false on different maps of primary columns', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary4');
            keys2.set('primaryKey2', 'primary5');

            let result = comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isFalse(result);
        });


        it('should return true on partly different keys in maps but equal values', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary1');
            keys2.set('primaryKey3', 'primary2');

            let result = comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isFalse(result);
        });

        it('should return false on different keys in maps but equal values', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey4', 'primary1');
            keys2.set('primaryKey3', 'primary2');

            let result = comparator.samePrimaryKeysValues(keys1,
                keys2);

            assert.isFalse(result);
        });
    });

    describe('Comparator.isPrimaryColumn', function () {

        it('should return true on string that is in array with length = 1', function (){
            comparator.primaryKeys = ['key1'];

            assert.isTrue(comparator.isPrimaryColumn('key1'));
        });


        it('should return true on one string that is in array with length > 1', function (){
            comparator.primaryKeys = ['key2', 'key1'];

            assert.isTrue(comparator.isPrimaryColumn('key1'));
        });


        it('should return false on empty array of primaries', function (){
            comparator.primaryKeys = [];

            assert.isFalse(comparator.isPrimaryColumn('key1'));
        });

        it('should return false on empty array of primaries and empty string', function (){
            comparator.primaryKeys = [];

            assert.isFalse(comparator.isPrimaryColumn(''));
        });
    });

    describe('Comparator.compareListOfTablesNamesAndMakeDiffs', function () {


        it('should return empty diffs array on equal values and order in arrays', function (){
            comparator.primaryKeys = ['key1'];

            const testTables = ['table1', 'table2', 'table3'];
            const prodTables = ['table1', 'table2', 'table3'];

            let finalListOfTables: Array<string>;
            let differences: IDifference[];
            [finalListOfTables, differences] = comparator.compareListOfTablesNamesAndMakeDiffs(testTables, prodTables);

            chai.expect([finalListOfTables, differences]).to.eql([testTables,[]]);
        });

        it('should return empty diffs array on equal values in arrays but different order', function (){
            comparator.primaryKeys = ['key1'];

            const testTables = ['table1', 'table3', 'table2'];
            const prodTables = ['table2', 'table1', 'table3'];

            let finalListOfTables: Array<string>;
            let differences: IDifference[];
            [finalListOfTables, differences] = comparator.compareListOfTablesNamesAndMakeDiffs(testTables, prodTables);

            chai.expect([finalListOfTables, differences]).to.eql([testTables,[]]);
        });

        it('should return edited list of tables and one diff on different values in arrays', function (){
            comparator.primaryKeys = ['key1'];

            const testTables = ['table1', 'table3', 'table2'];
            const prodTables = ['table2', 'table1'];

            const expectedDiff: IDifference = {
                type: NO_SUCH_TABLE,

                schema: PROD_SCHEMA,
                table: 'table3'
            };
            const expectedTables = ['table1', 'table2'];

            let finalListOfTables: Array<string>;
            let differences: IDifference[];
            [finalListOfTables, differences] = comparator.compareListOfTablesNamesAndMakeDiffs(testTables, prodTables);

            chai.expect([finalListOfTables, differences]).to.eql([expectedTables,[expectedDiff]]);
        });

        it('should return edited list of tables and diffs on different values in arrays', function (){
            comparator.primaryKeys = ['key1'];

            const testTables = ['table1', 'table3', 'table2'];
            const prodTables = ['table2', 'table1', 'table4'];

            const expectedDiff: IDifference[] = [{
                type: NO_SUCH_TABLE,

                schema: PROD_SCHEMA,
                table: 'table3'
            }, {
                type: NO_SUCH_TABLE,

                schema: TEST_SCHEMA,
                table: 'table4'
            }];
            const expectedTables = ['table1', 'table2'];

            let finalListOfTables: Array<string>;
            let differences: IDifference[];
            [finalListOfTables, differences] = comparator.compareListOfTablesNamesAndMakeDiffs(testTables, prodTables);

            chai.expect([finalListOfTables, differences]).to.eql([expectedTables, expectedDiff]);
        });
    });
});