import {DiffGenerator, IDifference} from "./diff_generator_service";
import {PROD_DB, TEST_DB} from "../../globals";

export class TextDiffGenerator{

    generateTexts(differences: Array<IDifference>): Array<string>{

        let textDiffs: Array<string> = [];

        differences.forEach(difference =>{
            switch(difference.type) {
                case DiffGenerator.NO_SUCH_TABLE: {

                    textDiffs = textDiffs.concat(this.generateNoSuchTable(difference));
                    break;
                }
                case DiffGenerator.NO_SUCH_COLUMN: {

                    textDiffs = textDiffs.concat(this.generateNoSuchColumn(difference));
                    break;
                }
                case DiffGenerator.NO_SUCH_ROW: {

                    textDiffs = textDiffs.concat(this.generateNoSuchRow(difference));
                    break;
                }
                case DiffGenerator.DIFFERENT_VALUES: {

                    textDiffs = textDiffs.concat(this.generateDifferentValues(difference));
                    break;
                }
                default:
                    break;
            }
        });

        return textDiffs;
    }

    generateNoSuchTable(difference: IDifference): string{
        return 'There is no table "' + difference.table + '" in ' + difference.schema + 'schema';
    }

    generateNoSuchColumn(difference: IDifference): Array<string>{
        let textDiffTest: string;
        let textDiffProd: string;

        let columnText: string = 'is no column';

        if(difference.columnsInTest.length != 0) {
            if (difference.columnsInTest.length > 1) {
                columnText = 'are no columns';
            }
            textDiffTest = 'There ' + columnText + ' "' + difference.columnsInTest + '" in table "'
                + difference.table + '" of ' + TEST_DB + 'schema';
        }

        if(difference.columnsInProd.length != 0) {
            columnText = 'is no column';
            if (difference.columnsInProd.length > 1) {
                columnText = 'are no columns';
            }
            textDiffProd = 'There ' + columnText + ' "' + difference.columnsInProd + '" in table "'
                + difference.table + '" of ' + PROD_DB + 'schema';
        }

        if(textDiffTest && textDiffProd)
            return [textDiffTest, textDiffProd];

        if(textDiffTest)
            return [textDiffTest];

        return [textDiffProd];
    }

    generateNoSuchRow(difference: IDifference): string{

        const rowValue = difference.schema === TEST_DB ? difference.valueInProd : difference.valueInTest;

        return 'There is no row with values: ' + JSON.stringify(rowValue) + ' in table "' + difference.table
            + '" of ' + difference.schema + ' schema';
    }

    generateDifferentValues(difference: IDifference): string{
        return `Different values in rows with same primaries in table ` + difference.table + `. 
            Row in test schema: ` + JSON.stringify(difference.valueInTest) + `
            Row in prod schema: ` + JSON.stringify(difference.valueInProd);
    }
}