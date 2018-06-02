import * as config from 'config';
import { IAppConfig, InnotsApp, PgPool, PgService } from "innots";


import { router } from "./app/routes";

const app = new InnotsApp(config.get<IAppConfig>('appConfig'), router);

app.bootstrap()
    .then(() => {
        console.log('server is listening on port', config.get<IAppConfig>('appConfig').port);
    })
    .catch((err) => {
        console.error(err);
    });
    
export{app}