import * as config from "config";
import * as _ from 'lodash';
import {Controller, PgService} from "innots";
import {Context} from 'koa';
import {TableDataModel} from "../models/table_data";
import {Comparator, IComparatorSettings, ITableInfo} from "../services/comparator_service";
import {TablePrimariyKeysModel} from "../models/table_keys";
import {TablesListModel} from "../models/list_tables";
import {SQLGenerator} from "../services/sql_generator_service";
import {isUndefined} from "util";
import {Pool} from "pg";
import * as globals from  "../../globals";
import {PROD_DB, TEST_DB} from "../../globals";
const dbServices = globals.dbServices;

export class BaseController extends Controller {

    public readonly serviceNameToDbConfig: any = {
        kassa: config.get('kassaDbConfig'),
        kassa2: config.get('kassa2DbConfig'),
    };

    comparator = new Comparator();
    SQLGenerator = new SQLGenerator();
    //textDiffsGenerator = new TextDiffGenerator();
    serviceName: string;

    differences = async (ctx: Context, next: () => any): Promise<void> => {
// validation
        //if(isUndefined(ctx.request.query['dbServiceName']) || !config.has(ctx.request.query['dbName'])){
        const data = {
            serviceName: 'kassa'
        };
        this.serviceName = data.serviceName;
        this.setPools(this.serviceNameToDbConfig[data.serviceName]);
        this.SQLGenerator.DBName = globals.currentDBName;


        let tablesToCompare: Array<string> = config.get(globals.currentDBName + '.comparator_settings.tablesToCompare');
        let differences = {};

        const tablesToCompareTest: Array<string> = await TablesListModel.getTables(globals.currentDBName,TEST_DB, tablesToCompare);
        const tablesToCompareProd: Array<string> = await TablesListModel.getTables(globals.currentDBName, PROD_DB, tablesToCompare);

        //check if tablesToCompare for test and prod have same tables, if no --> make differences for tables
        let {tablesToCompare: newTablesToCompare, tableDifferences: tablesDiffs} = this.comparator.compareListOfTablesNamesAndMakeDiffs(tablesToCompareTest, tablesToCompareProd);

        differences["DDLDifferences"] = tablesDiffs;
        differences["ContentDifferences"] = {};

        for (let tableName of newTablesToCompare) {

            const testTable: ITableInfo = await TableDataModel.getData(globals.currentDBName, tableName, TEST_DB);
            const prodTable: ITableInfo = await TableDataModel.getData(globals.currentDBName, tableName, PROD_DB);

            testTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(globals.currentDBName, tableName, TEST_DB);
            prodTable.primaryKeys = await TablePrimariyKeysModel.getPrimaries(globals.currentDBName, tableName, PROD_DB);

            const tableDifferences = _.cloneDeep(
                this.comparator.compareTables(testTable, prodTable, this.getComparatorSettingsForTable(tableName))
            );
            if(tableDifferences.length > 0)
                differences["ContentDifferences"][tableName] = tableDifferences;
        }

        let {SQLCommandsTestToProd: testToProd, SQLCommandsProdToTest: prodToTest} =
            this.SQLGenerator.generateSQLAndFillDiffs(differences["ContentDifferences"]);

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

        const tablesWithOverriddenSettings: Array<any> =
            config.get(this.serviceName + '.comparator_settings.overrideDefaultSettings');


        for (let table of tablesWithOverriddenSettings) {
            if (table.tableName == tableName) {
                return table.settings;
            }
        }

        return defaultSettings;
    }

    setPools(dbConfig: any){
        dbServices.test_pool = new Pool(dbConfig.test_db);
        dbServices.prod_pool = new Pool(dbConfig.prod_db);

        dbServices.testPgService = new PgService(dbServices.test_pool);
        dbServices.prodPgService = new PgService(dbServices.prod_pool);
    }
}
