import * as config from 'config';
import { IAppConfig, InnotsApp, PgPool, PgService } from "innots";


import { router } from "./app/routes";

const app = new InnotsApp(config.get<IAppConfig>('appConfig'), router);
export{app}