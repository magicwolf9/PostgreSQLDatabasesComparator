import * as config from 'config';
import {pgService} from "../../globals";

const defaultSchema = config.get('defaultSchema');

export interface ExampleTableRow{
    colOne: string;
    colTwo: string;
}

export  class KassaTestModel{
    // [{colOne: '', colTwo: ''}];
    static async getAll(tableName: string): Promise<ExampleTableRow[]>{
        return await pgService.getRows(`SELECT columnOne, columnTwo FROM ${defaultSchema}.example_table`);
    }
}