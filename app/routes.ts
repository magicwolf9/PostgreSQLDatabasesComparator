import * as Router from 'koa-router';
import * as config from 'config';
import {BaseController} from './controllers/base_controller';
import {logger} from "../globals";

const router = new Router();
const baseController = new BaseController();

/**
 * @api {get} /comparator/differences comparator/changeSchema?schema=*schema_name*
 * @apiName comparator
 * @apiGroup differences
 *
 * @apiDescription Возвращает различия в значениях некоторых таблиц из тестовой и продуктовой базы
 *
 * @apiSuccess {Object} result Объект ответа. Массив различий в значениях с их описанием.
 * @apiError {Any} error Текст/код ошибки сервиса.
 */
const pathToCompare: string = config.get('url') + 'differences';
const pathToChangeSchema: string = config.get('url') + 'changeSchema';

router
    .get(pathToCompare, baseController.differences);
router
    .get(pathToChangeSchema, baseController.changeSchema);

logger.info(`URL to compare databases from config : ` + pathToCompare);
logger.info(`URL to change db pair to work with: ` + pathToChangeSchema);

export {router};
