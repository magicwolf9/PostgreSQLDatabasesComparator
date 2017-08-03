import * as Router from 'koa-router';
import * as config from 'config';
import {BaseController} from './controllers/baseController';

const router = new Router();
const baseController = new BaseController();

/**
 * @api {get} /rnd_locale/message /rnd_locale/message
 * @apiName locale
 * @apiGroup message
 *
 * @apiDescription Возвращает локализованный текст сообщения по коду сообщения, коду приложения
 * и http заголовку Accept-Language (https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Accept-Language).
 *
 * @apiParam {String} text_code Код ошибки
 * @apiParam {String} application_code Код приложения
 *
 * @apiSuccess {Object} result Объект ответа
 * @apiSuccess {String} result.text Локализованный текст
 * @apiSuccess {String} result.type Тип сообщения. Настраивается и дополняется в БД.
 * @apiSuccess {String} result.lang Локаль. Возможные локали настраиваются и дополняются в базе.
 * @apiError {Any} error Текст/код ошибки сервиса.
 */
router
   .get(config.get('url') + 'getTable', baseController.table);

export {router};
