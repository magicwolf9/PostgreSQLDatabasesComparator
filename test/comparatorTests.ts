var comparator_service = require("../app/services/comparator_service");
import {Comparator} from "../app/services/comparator_service";

var assert = chai.assert;

describe('Comparator', function () {

    describe('Comparator.samePrimaryKeysValues', function () {

        it('should return true on equals maps of primary columns', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary1');
            keys2.set('primaryKey2', 'primary2');

            let result = Comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isTrue(result);
        });

        it('should return true on different orders of keys in maps', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey2', 'primary2');
            keys2.set('primaryKey1', 'primary1');

            let result = Comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isTrue(result);
        });

        it('should return true on empty maps of primary columns', function () {
            const keys1 = new Map();
            const keys2 = new Map();
            let result = Comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isTrue(result);
        });

        it('should return false on partly different maps of primary columns', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary1');
            keys2.set('primaryKey2', 'primary4');

            let result = Comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isFalse(result);
        });

        it('should return false on different maps of primary columns', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary4');
            keys2.set('primaryKey2', 'primary5');

            let result = Comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isFalse(result);
        });


        it('should return true on partly different keys in maps but equal values', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey1', 'primary1');
            keys2.set('primaryKey3', 'primary2');

            let result = Comparator.samePrimaryKeysValues(keys1, keys2);

            assert.isFalse(result);
        });

        it('should return false on different keys in maps but equal values', function () {
            const keys1 = new Map();
            keys1.set('primaryKey1', 'primary1');
            keys1.set('primaryKey2', 'primary2');

            const keys2 = new Map();
            keys2.set('primaryKey4', 'primary1');
            keys2.set('primaryKey3', 'primary2');

            let result = Comparator.samePrimaryKeysValues(keys1,
                keys2);

            assert.isFalse(result);
        });
    });

    describe('Comparator....', function () {

    });
});