import * as config from "config";
import * as _ from 'lodash';
import {Controller} from "innots";
import {Context} from 'koa';
import {TableDataModel} from "../models/table_data";
import {Comparator, IComparatorSettings, ITableInfo} from "../services/comparator_service";
import {TablePrimariyKeysModel} from "../models/table_keys";
import {ListTablesNamesModel} from "../models/list_tables";
import {IDifference} from "../services/diff_generator_service";
import {TextDiffGenerator} from "../services/text_difference_generator_service";
import {SQLGenerator} from "../services/sql_generator_service";


export class BaseController extends Controller {

    comparator = new Comparator();
    SQLGenerator = new SQLGenerator();
    //textDiffsGenerator = new TextDiffGenerator();

    differences = async (ctx: Context, next: () => any): Promise<void> => {

        let tablesToCompare: Array<string> = config.get('comparator_settings.tablesToCompare');
        let differences = {};

        const allTablesTest: Array<string> = await ListTablesNamesModel.getTables(true);
        const allTablesProd: Array<string> = await ListTablesNamesModel.getTables(false);

        //fill tablesToCompare for test (replace all ref_* with [ref_.., ref_.., ref_..])
        const tablesToCompareTest: Array<string> = this.getFullTablesToCompare(allTablesTest, tablesToCompare);

        //fill tablesToCompare for prod
        const tablesToCompareProd: Array<string> = this.getFullTablesToCompare(allTablesProd, tablesToCompare);

        //check if tablesToCompare for test and prod have same tables, if no --> make differences for tables

        let {tablesToCompare: newTablesToCompare, tableDifferences: tablesDiffs} = this.comparator.compareListOfTablesNamesAndMakeDiffs(tablesToCompareTest, tablesToCompareProd);

        differences["Differences in tables"] = tablesDiffs;
        differences["tables"] = {};

        for (let tableName of newTablesToCompare) {

            const testTable: ITableInfo = await TableDataModel.getData(tableName, true);
            const prodTable: ITableInfo = await TableDataModel.getData(tableName, false);

            testTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(tableName, true);
            prodTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(tableName, false);

            const tableDifferences = _.cloneDeep(
                this.comparator.compareTables(testTable, prodTable, this.getComparatorSettingsForTable(tableName))
            );
            differences["tables"][tableName] = tableDifferences;
        }

        let {SQLCommandsTestToProd: testToProd, SQLCommandsProdToTest: prodToTest}= this.SQLGenerator.generateSQLAndFillDiffs(differences["tables"]);

        differences["SQLTestToProd"] = testToProd;
        differences["SQLProdToTest"] = prodToTest;

        //ctx.body = this.textDiffsGenerator.generateTexts(differences);
        ctx.body = differences;
        next();
    };

    getComparatorSettingsForTable(tableName: string): IComparatorSettings {
        const defaultSettings: IComparatorSettings = {
            searchByPrimaries: true,
            ignorePrimaries: false
        };

        const tablesWithOverriddenSettings: Array<any> = config.get('comparator_settings.overrideDefaultSettings');


        for (let table of tablesWithOverriddenSettings) {
            if (table.tableName == tableName) {
                return table.settings;
            }
        }

        return defaultSettings;
    }

    getFullTablesToCompare(listOfTables: Array<string>, listToCompareWithShortcuts: Array<string>): Array<string> {
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

    getTablesNamesFromShortcut(shortcut: string, listOfTables: Array<string>): Array<string> {
        let editedShortcut: string = shortcut.substr(0, shortcut.indexOf('*'));

        return listOfTables.filter(tableName => {
            return tableName.startsWith(editedShortcut);
        });
    }
}
