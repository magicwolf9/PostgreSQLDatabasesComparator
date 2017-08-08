import * as config from 'config';
import {test_pgService} from "../../globals";
import {prod_pgService} from "../../globals";
import {ITableInfo} from "../services/comparator_service";

const defaultSchema = config.get('defaultSchema');

export class KassaTestModel {
    static async getAll(tableName: string, isTestDB : boolean): Promise<ITableInfo> {
        const pgService = isTestDB ? test_pgService : prod_pgService;

        return {
            tableName: tableName,
            primaryKeys: [],
            /*
            primaryKeys: await pgService.getRows(`
                SELECT a.attname
                FROM   pg_index i
                JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                     AND a.attnum = ANY(i.indkey)
                WHERE  i.indrelid = &1::regclass
                AND    i.indisprimary;`, [tableName]),
            */
            tableData: await pgService.getRows(`SELECT * FROM ${defaultSchema}.$1`, [tableName])
        };
    }

}