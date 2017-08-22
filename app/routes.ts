import * as Router from 'koa-router';
import * as config from 'config';
import {BaseController} from './controllers/base_controller';
import {logger} from "../globals";

const router = new Router();
const baseController = new BaseController();

/**
 * @api {get} /comparator/getDifferences comparator/changeSchema?schema=*schema_name*
 * @apiName comparator
 * @apiGroup getDifferences
 *
 * @apiDescription Возвращает различия в значениях некоторых таблиц из тестовой и продуктовой базы
 *
 * @apiSuccess {Object} result Объект ответа. Массив различий в значениях с их описанием.
 * @apiError {Any} error Текст/код ошибки сервиса.
 */
const pathToCompare: string = config.get('url') + 'getDifferences';

router
    .get(pathToCompare, baseController.getDifferences);

logger.info(`URL to compare databases from config : ` + pathToCompare + `?dbServiceName=*dbServiceName*  dbServiceName must be described in config file`);

export {router};
