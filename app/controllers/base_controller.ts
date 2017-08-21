import * as config from "config";
import * as _ from 'lodash';
import {Controller, PgService} from "innots";
import {Context} from 'koa';
import {TableDataModel} from "../models/table_data";
import {Comparator, IComparatorSettings, ITableInfo} from "../services/comparator_service";
import {TablesWithPrimariesListModel} from "../models/list_tables";
import {SQLGenerator} from "../services/sql_generator_service";
import {isUndefined} from "util";
import {Pool} from "pg";
import * as globals from  "../../globals";
import {PROD_DB, TEST_DB} from "../../globals";
const dbServices = globals.dbServices;

export class BaseController extends Controller {

    public readonly serviceNameToDbConfig: any = {
        kassaDbConfig: config.get('kassaDbConfig'),
        kassa2DbConfig: config.get('kassa2DbConfig'),
    };

    comparator = new Comparator();
    SQLGenerator = new SQLGenerator();
    //textDiffsGenerator = new TextDiffGenerator();
    serviceName: string;

    differences = async (ctx: Context, next: () => any): Promise<void> => {

        const data = {
            serviceName: <string> config.get('defaultServiceName')
        };

        if(!isUndefined(ctx.request.query['dbServiceName']) && config.has(ctx.request.query['dbServiceName'])) {
            data.serviceName = this.validate(ctx, (validator) => {
                return validator.isString('dbServiceName', 0, 30)
            });
        }

        this.serviceName = data.serviceName;
        this.setPools(this.serviceNameToDbConfig[data.serviceName]);

        this.SQLGenerator.DBName = globals.currentServiceName;


        let tablesToCompare: Array<string> = config.get(globals.currentServiceName + '.comparator_settings.tablesToCompare');
        let differences = {};

        const tablesToCompareTest: any = await TablesWithPrimariesListModel.getTables(globals.currentServiceName,TEST_DB, tablesToCompare);
        const tablesToCompareProd:any = await TablesWithPrimariesListModel.getTables(globals.currentServiceName, PROD_DB, tablesToCompare);

        //check if tablesToCompare for test and prod have same tables, if no --> make differences for tables
        //TODO change method and check diffs in primary keys
        let {tablesToCompare: newTablesToCompare, tableDifferences: tablesDiffs} = this.comparator.compareListOfTablesNamesAndMakeDiffs(tablesToCompareTest, tablesToCompareProd);

        differences["DDLDifferences"] = tablesDiffs;
        differences["ContentDifferences"] = {};

        for (let tableAndPrimaries of newTablesToCompare) {

            const testTable: ITableInfo = await TableDataModel.getData(tableAndPrimaries.tableName, TEST_DB);
            const prodTable: ITableInfo = await TableDataModel.getData(tableAndPrimaries.tableName, PROD_DB);

            testTable.primaryKeys = tableAndPrimaries.primaryColumns;
            prodTable.primaryKeys = tableAndPrimaries.primaryColumns;

            const tableDifferences = _.cloneDeep(
                this.comparator.compareTables(testTable, prodTable, this.getComparatorSettingsForTable(tableAndPrimaries.tableName))
            );
            if(tableDifferences.length > 0)
                differences["ContentDifferences"][tableAndPrimaries.tableName] = tableDifferences;
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
        console.log(tableName);

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
