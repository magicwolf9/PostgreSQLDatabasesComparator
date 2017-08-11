import * as config from 'config';
import {Controller} from "innots";
import {Context} from 'koa';
import {TableDataModel} from "../models/table_data";
import {Comparator, IDifference, ITableInfo} from "../services/comparator_service";
import {TablePrimariyKeysModel} from "../models/table_keys";
import {ListTablesNamesModel} from "../models/list_tables";


export class BaseController extends Controller{

    comparator = new Comparator();

    differences = async (ctx: Context, next: () => any): Promise<void> => {

        let tablesToCompare: Array<string> = config.get('tablesToCompare');
        let differences: Array<IDifference> = [];

        const allTablesTest: Array<string> = await ListTablesNamesModel.getTables(true);
        const allTablesProd: Array<string> = await ListTablesNamesModel.getTables(false);

        //fill tablesToCompare for test (replace all ref_* with [ref_.., ref_.., ref_..])
        const tablesToCompareTest: Array<string> = this.getFullTablesToCompare(allTablesTest, tablesToCompare);

        //fill tablesToCompare for prod
        const tablesToCompareProd: Array<string> = this.getFullTablesToCompare(allTablesProd, tablesToCompare);

        //check if tablesToCompare for test and prod have same tables, if no --> make differences for tables
        let newTablesToCompare: Array<string>;
        [newTablesToCompare, differences] = this.comparator.compareListOfTablesNamesAndMakeDiffs(tablesToCompareTest, tablesToCompareProd);

        for(let i of newTablesToCompare) {

            const tableName = i;

            const testTable: ITableInfo = await TableDataModel.getData(tableName, true);
            const prodTable: ITableInfo = await TableDataModel.getData(tableName, false);

            testTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(tableName, true);
            prodTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(tableName, false);

            differences = this.comparator.compareTables(testTable, prodTable);
        }

        ctx.body = differences;
        next();
    };

    getFullTablesToCompare(listOfTables: Array<string>, listToCompareWithShortcuts: Array<string>): Array<string>{
        let tablesToCompareFull: Array<string> = [];

        listToCompareWithShortcuts.forEach(tableName => {
            if (tableName.endsWith('*')) {
                //table name is a shortcut (example: ref_*)
                tablesToCompareFull = tablesToCompareFull.concat(this.getTablesNamesFromShortcut(tableName, listOfTables));
            } else {
                tablesToCompareFull = tablesToCompareFull.concat(tableName);
            }
        });

        return tablesToCompareFull;
    }

    getTablesNamesFromShortcut(shortcut: string, listOfTables: Array<string>): Array<string>{
        let editedShortcut: string = shortcut.substr(0, shortcut.indexOf('*'));

        return listOfTables.filter(tableName => {
            return tableName.startsWith(editedShortcut);
        });
    }
}
