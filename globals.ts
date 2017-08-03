import * as config from 'config';
import {PgService} from "innots";
import {logger as innoLogger} from 'innots';

/* tslint:disable */
const Pool = require('pg-pool');
const pool = new Pool(config.get('db'));
const pgService = new PgService(pool);
/* tslint:enable */


const logger = innoLogger.getLogger(config);

export {pgService, logger};