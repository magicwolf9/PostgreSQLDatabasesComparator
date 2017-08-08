import * as config from 'config';
import {pgService} from "../../globals";
import {ITableInfo} from "../services/comparator_service";

const defaultSchema = config.get('defaultSchema');

/*export interface ExampleTableRow{
    colOne: string;
    colTwo: string;
}*/


export class KassaTestModel {
    static async getAll(tableName: string): Promise<ITableInfo> {
        return {
            tableName: '',
            primaryKeys: await pgService.getRows(`
                SELECT a.attname
                FROM   pg_index i
                JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                     AND a.attnum = ANY(i.indkey)
                WHERE  i.indrelid = &1::regclass
                AND    i.indisprimary;`, [tableName]),
            tableData: await pgService.getRows(`SELECT * FROM ${defaultSchema}.$1`, [tableName])
        };
    }

}