import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import HTMLTableConnector from '../../../../../ts/Data/Connectors/HTMLTableConnector';
import HTMLTableConnectorHelper from '../../../../../ts/Dashboards/SerializeHelper/HTMLTableConnectorHelper';

describe('HTMLTableConnectorHelper', () => {
    it('should serialize and deserialize HTMLTableConnector', () => {
        const connector = new HTMLTableConnector({
            decimalPoint: '.',
            exportIDColumn: true,
            useRowspanHeaders: false,
            useLocalDecimalPoint: false,
            firstRowAsNames: true,
            startRow: 0,
            endRow: Number.MAX_VALUE,
            startColumn: 0,
            endColumn: Number.MAX_VALUE
        });
        const json = HTMLTableConnectorHelper.toJSON(connector);
        const connector2 = HTMLTableConnectorHelper.fromJSON(json);
        const json2 = HTMLTableConnectorHelper.toJSON(connector2);

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
