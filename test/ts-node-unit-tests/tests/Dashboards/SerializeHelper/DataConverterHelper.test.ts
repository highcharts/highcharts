import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import DataConverter from '../../../../../ts/Data/Converters/DataConverter';
import DataConverterHelper from '../../../../../ts/Dashboards/SerializeHelper/DataConverterHelper';

describe('DataConverterHelper', () => {
    it('should serialize and deserialize DataConverter options', () => {
        const converter = new DataConverter({
            dateFormat: 'YYYY-mm-dd',
            decimalPoint: ','
        });
        const json = DataConverterHelper.toJSON(converter);
        const converter2 = DataConverterHelper.fromJSON(json);
        const json2 = DataConverterHelper.toJSON(converter2);

        deepStrictEqual(
            json.options,
            json2.options,
            'JSON should contain all option values.'
        );
    });

    it('should maintain consistent structure through round-trip', () => {
        const converter = new DataConverter({
            dateFormat: 'YYYY-mm-dd',
            decimalPoint: ','
        });
        const json = DataConverterHelper.toJSON(converter);
        const converter2 = DataConverterHelper.fromJSON(json);
        const json2 = DataConverterHelper.toJSON(converter2);

        deepStrictEqual(
            json,
            json2,
            'Reserialized json should contain all values.'
        );
    });
});
