import * as config from 'config';
import {PgService} from "innots";
import {logger as innoLogger} from 'innots';

/* tslint:disable */
const Pool = require('pg-pool');

let testPool;
let prodPool;

let testPgService;
let prodPgService;

const dbServices = {
    currentServiceName: config.get<string>('defaultServiceName'),

    test_pool: testPool,
    prod_pool: prodPool,
    testPgService: testPgService,
    prodPgService: prodPgService,
};

testPool = new Pool(config.get(dbServices.currentServiceName + '.test_db'));
prodPool = new Pool(config.get(dbServices.currentServiceName + '.prod_db'));

testPgService = new PgService(testPool);
prodPgService = new PgService(prodPool);
/* tslint:enable */


export const IGNORE_VALUES_PATTERN: string = config.get<string>('ignoreValuesPattern');
export const TEST_DB: string = 'test';
export const PROD_DB: string = 'production';


const logger = innoLogger.getLogger(config);
export {logger, dbServices};