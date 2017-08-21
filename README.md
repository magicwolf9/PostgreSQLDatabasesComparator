# PostgreSQLDatabasesComparator
That service can connect to 2 PostgreSQL databases and check values of certain tables.
As a result differences in values are shown to the user and  are generated SQL commands to fix the differences. 
It is used to compare test and production databases of a product.

How to use: 

Fill config before use

To get differences: localhost:8089/comparator/differences?dbServiceName=*dbServiceName* //*dbServiceName* must be described in config

Config sample

{
    "defaultServiceName": "defService", //default service (group of settings)
    "port": 8089,
    "url": "/comparator/",
    "logLevel": "DEBUG",
    "defService": {
        "test_db": {
            "host": "*",
            "port": 5432,
            "database": "*",
            "user": "*",
            "password": "*"
        },
        "prod_db": {
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
            "host": "*",
            "port": 5432,
            "database": "*",
            "user": "*",
            "password": "*"
        },
        "prod_db": {
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
