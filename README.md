# PostgreSQLDatabasesComparator
This application is built for comparation of testing and production services PostgreSQL databases. It generates SQL fixing differences.

How to use: 

Fill config before use

To get differences: localhost:8089/comparator/differences?dbServiceName=*dbServiceName* //*dbServiceName* must be described in config

Config sample
```JavaScript
{
    "defaultServiceName": "defService", //default service (group of settings)
    "port": 8089,
    "url": "/comparator/",
    "logLevel": "DEBUG",
    "defService": {
        "test_db": {
            "schemaName": "*",
            "host": "*",
            "port": 5432,
            "database": "*",
            "user": "*",
            "password": "*"
        },
        "prod_db": {
            "schemaName": "*",
            "host": "*",
            "port": 5432,
            "database": "*",
            "user": "*",
            "password": "*"
        },

        "pathForSQLFiles": "*", //local path to save files with generateg SQL commands
        "comparator_settings": {
            "tablesToCompare": [
                "***", "***" // list of tables to compare, element can be a full table name (example: table_name) and prefix (example: ref_* it will compare all tables starts with ref_)
            ],
            "overrideDefaultSettings": [
                {
                    "table_name": {
                        "searchByPrimaries": false, //search rows from tables in databases by primary keys, if false it will search 2 rows with fully equals columns values
                        "ignorePrimaries": false //ignore primary keys during compare (for example if it is an autoincrement integer)
                    }
                }
            ]
        }
    },
    "service2": {
        "test_db": {
            "schemaName": "*",
            "host": "*",
            "port": 5432,
            "database": "*",
            "user": "*",
            "password": "*"
        },
        "prod_db": {
            "schemaName": "*",
            "host": "*",
            "port": 5432,
            "database": "*",
            "user": "*",
            "password": "*"
        },

        "pathForSQLFiles": "*",
        "comparator_settings": {
            "tablesToCompare": [
                "***", "***" 
            ],
            "overrideDefaultSettings": [
                {
                    "table_name": {
                        "searchByPrimaries": false,
                        "ignorePrimaries": false 
                    }
                }
            ]
        }
    }
}
```
Responce example:

```JavaScript
{
    result: {
        DDLDifferences: "There are no differences in DDL",
        ContentDifferences:
        {
            table_name: [
                {
                    type: "There is no row with same values",
                    schema: "production",
                    table: "tableName",
                    primaryKeys: [
                        "column1"
                    ],
                    valueInTest: {
                        column1: "valueOfColumn1",
                        column2: "valueOfColumn2",
                        column3: "valueOfColumn3"
                    },
                    valueInProd: null,
                    SQLtoFixIt: "INSERT INTO schema_name.table_name (..columns..) VALUES (..values..); "
                }
            ],
            table2_name: [
                {
                    type: "Values in rows differ",
                    table: "table2_name",
                    primaryKeys: [
                        "column1",
                        "column2"
                    ],
                    valueInTest: {
                        column1: "valueOfTestColumn1",
                        column2: "valueOfTestColumn2",
                        column3: "valueOfTestColumn3"
                    },
                    valueInProd: {
                        column1: "valueOfProdColumn1",
                        column2: "valueOfProdColumn2",
                        column3: "valueOfProdColumn3"
                    },
                    SQLtoFixIt: "Test ---> prod: UPDATE schema_name.table2_name SET column3 = 'valueOfTestColumn3' WHERE column1 = 'valueOfProdColumn1' AND column2 = 'valueOfProdColumn2' ; Prod ---> test: UPDATE schema_name.table2_name SET column3 = 'valueOfProdColumn3' WHERE column1 = 'valueOfTestColumn1' AND column2 = 'valueOfTestColumn2' "
                },
            ]
        }
        SQLTestToProd: "*listOfSQLCommands*",
        SQLProdToTest: "*listOfSQLCommands*"
    }
}
```
