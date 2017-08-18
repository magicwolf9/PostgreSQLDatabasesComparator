import * as config from "config";
import * as _ from 'lodash';
import {Controller, PgService} from "innots";
import {Context} from 'koa';
import {TableDataModel} from "../models/table_data";
import {Comparator, IComparatorSettings, ITableInfo} from "../services/comparator_service";
import {TablePrimariyKeysModel} from "../models/table_keys";
import {ListTablesNamesModel} from "../models/list_tables";
import {SQLGenerator} from "../services/sql_generator_service";
import {isUndefined} from "util";
import {Pool} from "pg";


export class BaseController extends Controller {

    comparator = new Comparator();
    SQLGenerator = new SQLGenerator();
    //textDiffsGenerator = new TextDiffGenerator();

    DBName: string;

    differences = async (ctx: Context, next: () => any): Promise<void> => {


        if(isUndefined(ctx.request.query['dbName']) || !config.has(ctx.request.query['dbName'])){
            require('../../globals').currentDBName = config.get('defaultDBName');
        } else {
            require('../../globals').currentDBName = ctx.request.query['dbName'];
        }
        this.DBName = require('../../globals').currentDBName;

        this.setPools();
        this.SQLGenerator.DBName = this.DBName;

        let tablesToCompare: Array<string> = config.get(this.DBName + '.comparator_settings.tablesToCompare');
        let differences = {};

        const tablesToCompareTest: Array<string> = await ListTablesNamesModel.getTables(this.DBName,true, tablesToCompare);
        const tablesToCompareProd: Array<string> = await ListTablesNamesModel.getTables(this.DBName, false, tablesToCompare);

        //check if tablesToCompare for test and prod have same tables, if no --> make differences for tables
        let {tablesToCompare: newTablesToCompare, tableDifferences: tablesDiffs} = this.comparator.compareListOfTablesNamesAndMakeDiffs(tablesToCompareTest, tablesToCompareProd);

        differences["DDLDifferences"] = tablesDiffs;
        differences["ContentDifferences"] = {};

        for (let tableName of newTablesToCompare) {

            const testTable: ITableInfo = await TableDataModel.getData(this.DBName, tableName, true);
            const prodTable: ITableInfo = await TableDataModel.getData(this.DBName, tableName, false);

            testTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(this.DBName, tableName, true);
            prodTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(this.DBName, tableName, false);

            const tableDifferences = _.cloneDeep(
                this.comparator.compareTables(testTable, prodTable, this.getComparatorSettingsForTable(tableName))
            );
            if(tableDifferences.length > 0)
                differences["ContentDifferences"][tableName] = tableDifferences;
        }

        let {SQLCommandsTestToProd: testToProd, SQLCommandsProdToTest: prodToTest}= this.SQLGenerator.generateSQLAndFillDiffs(differences["ContentDifferences"]);

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

        const tablesWithOverriddenSettings: Array<any> = config.get(this.DBName + '.comparator_settings.overrideDefaultSettings');


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


    setPools(){
        require('../../globals').test_pool = new Pool(config.get(this.DBName + '.test_db'));
        require('../../globals').prod_pool = new Pool(config.get(this.DBName + '.prod_db'));

        require('../../globals').testPgService = new PgService(require('../../globals').test_pool);
        require('../../globals').prodPgService = new PgService(require('../../globals').prod_pool);
    }
}
