import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable';
import DataTableHelper from '../../../../../ts/Dashboards/SerializeHelper/DataTableHelper';

describe('DataTableHelper', () => {
    describe('JSON serializer for DataTable', () => {
        const customID = 'myCustomID';
        const table = new DataTable({
            columns: {
                values: [
                    null,
                    void 0,
                    NaN,
                    1,
                    '',
                    'a'
                ]
            },
            id: customID
        });
        const columns = table.getColumns();
        const json = DataTableHelper.toJSON(table);
        const table2 = DataTableHelper.fromJSON(json);

        it('should contain all columns in JSON', () => {
            deepStrictEqual(
                Object.keys(json.columns),
                Object.keys(columns),
                'JSON should contain all columns.'
            );
        });

        it('should contain all rows in JSON', () => {
            deepStrictEqual(
                json.columns['values'].length,
                columns['values'].length,
                'JSON should contain all rows.'
            );
        });

        it('should deserialize all columns correctly', () => {
            deepStrictEqual(
                table2.getColumns(),
                columns,
                'Deserialized table should contain all columns.'
            );
        });

        it('should contain custom id in JSON', () => {
            strictEqual(
                json.id,
                customID,
                'JSON should contain custom id.'
            );
        });

        it('should deserialize custom id correctly', () => {
            strictEqual(
                table2.id,
                customID,
                'Deserialized table should contain custom id.'
            );
        });
    });
});
