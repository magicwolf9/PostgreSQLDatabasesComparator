import {dbServices, PROD_DB, TEST_DB} from "../../globals";
import {ITableInfo} from "../services/comparator_service";
import * as config from "config";

export class TableDataModel {
    static async getData(tableName: string, isTestDB: string): Promise<ITableInfo> {
        let pgService;
        let schemaAndTable: string;

        switch (isTestDB) {
            case TEST_DB: {
                pgService = dbServices.testPgService;
                schemaAndTable = config.get(dbServices.currentServiceName + '.test_db' + '.database')
                    + '.' + tableName;
                break;
            }
            case PROD_DB: {
                pgService = dbServices.prodPgService;
                schemaAndTable = config.get(dbServices.currentServiceName + '.prod_db' + '.database')
                    + '.' + tableName;
                break;
            }
            default: {
                break;
            }
        }

        return {
            tableName: tableName,
            primaryKeys: [],
            tableData: await pgService.getRows(`SELECT * FROM ${schemaAndTable};`, [])
        };
    }

}