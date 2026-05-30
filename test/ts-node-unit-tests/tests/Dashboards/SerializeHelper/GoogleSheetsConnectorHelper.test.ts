import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import GoogleSheetsConnector from '../../../../../ts/Data/Connectors/GoogleSheetsConnector';
import GoogleSheetsConnectorHelper from '../../../../../ts/Dashboards/SerializeHelper/GoogleSheetsConnectorHelper';

describe('GoogleSheetsConnectorHelper', () => {
    it('should serialize and deserialize GoogleSheetsConnector', () => {
        const connector = new GoogleSheetsConnector({
            googleAPIKey: 'test-api-key',
            googleSpreadsheetKey: 'test-spreadsheet-key'
        });
        const json = GoogleSheetsConnectorHelper.toJSON(connector);
        const connector2 = GoogleSheetsConnectorHelper.fromJSON(json);
        const json2 = GoogleSheetsConnectorHelper.toJSON(connector2);

        deepStrictEqual(
            json.options,
            json2.options,
            'JSON should contain all option values.'
        );

        deepStrictEqual(
            json,
            json2,
            'Reserialized json should contain all values.'
        );
    });
});
