import * as config from 'config';
import {PgService} from "innots";
import {logger as innoLogger} from 'innots';

/* tslint:disable */
const Pool = require('pg-pool');

export let currentDBName: string = config.get('defaultDBName');

let test_pool = new Pool(config.get(currentDBName + '.test_db'));
let prod_pool = new Pool(config.get(currentDBName + '.prod_db'));

let testPgService = new PgService(test_pool);
let prodPgService = new PgService(prod_pool);
/* tslint:enable */

export const TEST_SCHEMA: string = 'test';
export const PROD_SCHEMA: string = 'production';


const logger = innoLogger.getLogger(config);
export {testPgService, prodPgService, logger};