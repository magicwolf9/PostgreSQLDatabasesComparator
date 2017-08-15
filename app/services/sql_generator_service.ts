

import {DiffGenerator, IDifference} from "./diff_generator_service";

export class SQLGenerator{

    generateSQL(differences: Array<IDifference>): Array<string>{

        let SQLCommands: Array<string> = [];

        differences.forEach(difference => {

            switch(difference.type) {

                case DiffGenerator.NO_SUCH_ROW:{

                    break;
                }

                case DiffGenerator.DIFFERENT_VALUES: {

                    SQLCommands = SQLCommands.concat(this.generateForDifferentValues(difference));
                    break;
                }
                default:
                    break;
            }

        });

        return SQLCommands;
    }

    generateForDifferentValues(difference: IDifference): string {

        let commandForTestToProd: string;
        let commandForProdToTest: string;

        //TODO generate sql to transfer test data to prod
        //TODO generate sql to transfer prod data to test

        return 'To transfer test data to prod: ***. To transfer prod data to test: ***.';
    }
}