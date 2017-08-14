import * as config from 'config';
import {PgService} from "innots";
import {logger as innoLogger} from 'innots';

/* tslint:disable */
const Pool = require('pg-pool');

const test_pool = new Pool(config.get('test_db'));
const prod_pool = new Pool(config.get('prod_db'));

const testPgService = new PgService(test_pool);
const prodPgService = new PgService(prod_pool);
/* tslint:enable */

export const TEST_SCHEMA: string = 'test';
export const PROD_SCHEMA: string = 'production';

export const NO_SUCH_TABLE: string = 'There is no table with given name';
export const NO_SUCH_COLUMN: string = 'There is no such column';
export const NO_SUCH_ROW: string = 'There is no row with same values';
export const DIFFERENT_VALUES: string = 'Values in rows differ';

const logger = innoLogger.getLogger(config);
export {testPgService, prodPgService, logger};