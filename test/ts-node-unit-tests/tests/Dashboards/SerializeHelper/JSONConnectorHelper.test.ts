import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import JSONConnector from '../../../../../ts/Data/Connectors/JSONConnector';
import JSONConnectorHelper from '../../../../../ts/Dashboards/SerializeHelper/JSONConnectorHelper';

describe('JSONConnectorHelper', () => {
    it('should serialize and deserialize JSONConnector', () => {
        const connector = new JSONConnector({
            data: [
                [1, 2, 3],
                [4, 5, 6]
            ]
        });
        const json = JSONConnectorHelper.toJSON(connector);
        const connector2 = JSONConnectorHelper.fromJSON(json);
        const json2 = JSONConnectorHelper.toJSON(connector2);

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
