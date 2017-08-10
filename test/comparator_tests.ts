var comparator_service = require("../app/services/comparator_service");
import {Comparator, IDifference} from "../app/services/comparator_service";
import * as chai from 'chai';
const assert = chai.assert;

const comparator = new Comparator();
comparator.tableName = "table";


describe('Comparator', function () {

    describe.skip('Comparator.compareRows', function () {

        it('should return diff about not found column', function (){
            const row1 = {column: 'value', column2: 'value2'};
            const row2 = {column: 'value'};

            /*const expectedDiff: IDifference = {
                type: "",

                table1: 'table1',
                table2: 'table2',

                columnsInTest: 'column2',
                columnsInProd: '',

                valueInTest: 'value2',
                valueInProd: '',
            }*/


            //TODO check result and expected diff
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
});