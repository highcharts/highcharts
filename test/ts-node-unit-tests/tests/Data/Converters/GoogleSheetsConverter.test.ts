import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import GoogleSheetsConverter from '../../../../../ts/Data/Converters/GoogleSheetsConverter.js';
import type { GoogleSpreadsheetJSON } from '../../../../../ts/Data/Converters/GoogleSheetsConverterOptions';

describe('GoogleSheetsConverter', () => {
    describe('parse', () => {
        it('should not mutate callback output while extracting headers', () => {
            const json: GoogleSpreadsheetJSON = {
                    majorDimension: 'COLUMNS',
                    values: [
                        ['name', 'A'],
                        ['value', 1]
                    ]
                },
                originalValues = json.values.map((column) => column.slice()),
                converter = new GoogleSheetsConverter({
                    beforeParse: (values) => values
                });

            converter.parse({ json });

            deepStrictEqual(
                json.values,
                originalValues,
                'Header extraction should leave the callback data unchanged.'
            );
        });
    });
});
