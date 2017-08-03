import * as config from 'config';
import {App} from "innots";

import {router} from './app/routes';
const app = new App(config, router);