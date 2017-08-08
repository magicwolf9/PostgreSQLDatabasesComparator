import * as config from 'config';
import {PgService} from "innots";
import {logger as innoLogger} from 'innots';

/* tslint:disable */
const Pool = require('pg-pool');

const test_pool = new Pool(config.get('test_db'));
const prod_pool = new Pool(config.get('prod_db'));

const test_pgService = new PgService(test_pool);
const prod_pgService = new PgService(prod_pool);
/* tslint:enable */


const test_logger = innoLogger.getLogger(config);
const prod_logger = innoLogger.getLogger(config);

export {test_pgService, test_logger};
export {prod_pgService, prod_logger};