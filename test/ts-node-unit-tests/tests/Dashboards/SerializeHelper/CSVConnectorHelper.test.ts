import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import CSVConnector from '../../../../../ts/Data/Connectors/CSVConnector';
import CSVConnectorHelper from '../../../../../ts/Dashboards/SerializeHelper/CSVConnectorHelper';

describe('CSVConnectorHelper', () => {
    it('should serialize and deserialize CSVConnector', () => {
        const connector = new CSVConnector({
            csv: 'Date,Grade\n24 May,5.8\n25 May,7.9\n15 July,8.1',
            decimalPoint: '.',
            itemDelimiter: ','
        });
        const json = CSVConnectorHelper.toJSON(connector);
        const connector2 = CSVConnectorHelper.fromJSON(json);
        const json2 = CSVConnectorHelper.toJSON(connector2);

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
