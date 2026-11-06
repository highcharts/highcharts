import { describe, it } from 'node:test';
import { ok } from 'node:assert';

import CSVConnector from '../../../../../ts/Data/Connectors/CSVConnector.js';
import HTMLTableConverter from '../../../../../ts/Data/Converters/HTMLTableConverter.js';

describe('HTMLTableConverter', () => {
    describe('export', () => {
        it('should compare the first multilevel header', () => {
            const connector = new CSVConnector(),
                converter = new HTMLTableConverter();

            connector.getTable().setColumns({
                A: ['X', 1],
                B: ['B', 2]
            });

            const html = converter.export(connector, {
                firstRowAsNames: true,
                useMultiLevelHeaders: true
            });

            ok(
                html.includes('highcharts-table-topheading'),
                'Different first-column headers should produce both levels.'
            );
        });
    });
});
