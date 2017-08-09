import * as Router from 'koa-router';
import * as config from 'config';
import {BaseController} from './controllers/base_controller';

const router = new Router();
const baseController = new BaseController();

/**
 * @api {get} /comparator/differences /rnd_locale/message
 * @apiName comparator
 * @apiGroup differences
 *
 * @apiDescription Возвращает различия в значениях некоторых таблиц из тестовой и продуктовой базы
 *
 * @apiSuccess {Object} result Объект ответа. Массив различий в значениях с их описанием.
 * @apiError {Any} error Текст/код ошибки сервиса.
 */
router
   .get(config.get('url') + 'differences', baseController.table);

export {router};
