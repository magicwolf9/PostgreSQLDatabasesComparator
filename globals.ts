import * as config from 'config';
import {PgService} from "innots";
import {logger as innoLogger} from 'innots';

/* tslint:disable */
const Pool = require('pg-pool');

export let currentServiceName: string = config.get('defaultServiceName');



let testPool = new Pool(config.get(currentServiceName + '.test_db'));
let prodPool = new Pool(config.get(currentServiceName + '.prod_db'));

let testPgService = new PgService(testPool);
let prodPgService = new PgService(prodPool);
/* tslint:enable */

const dbServices = {
    test_pool: testPool,
    prod_pool: prodPool,
    testPgService: testPgService,
    prodPgService: prodPgService,
};

export const TEST_DB: string = 'test';
export const PROD_DB: string = 'production';


const logger = innoLogger.getLogger(config);
export {logger, dbServices};