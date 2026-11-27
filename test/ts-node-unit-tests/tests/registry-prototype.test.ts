import { describe, it } from 'node:test';
import { rejects, strictEqual } from 'node:assert';

import ComponentRegistry from '../../../ts/Dashboards/Components/ComponentRegistry.js';
import DataPool from '../../../ts/Data/DataPool.js';
import DataConnector from '../../../ts/Data/Connectors/DataConnector.js';
import DataConverter from '../../../ts/Data/Converters/DataConverter.js';
import DataModifier from '../../../ts/Data/Modifiers/DataModifier.js';
import CellRendererRegistry from '../../../ts/Grid/Pro/CellRendering/CellRendererRegistry.js';
import DataProviderRegistry from '../../../ts/Grid/Core/Data/DataProviderRegistry.js';

const registries = {
    ComponentRegistry: ComponentRegistry.types,
    DataConnector: DataConnector.types,
    DataConverter: DataConverter.types,
    DataModifier: DataModifier.types,
    CellRendererRegistry: CellRendererRegistry.types,
    DataProviderRegistry: DataProviderRegistry.types
} as Record<string, Record<string, unknown>>;

describe('Type registries', () => {
    it('do not resolve type names to Object.prototype members', () => {
        for (const name of Object.keys(registries)) {
            for (const key of [
                'constructor',
                'toString',
                'valueOf',
                'hasOwnProperty',
                '__proto__'
            ]) {
                strictEqual(
                    registries[name][key],
                    void 0,
                    `${name}.types.${key} should be undefined`
                );
            }
        }
    });

    it('reject unregistered connector types instead of constructing them', () =>
        rejects(() => {
            const dataPool = new DataPool();

            dataPool.setConnectorOptions({
                id: 'A',
                type: 'constructor'
            } as never);

            return dataPool.getConnector('A');
        }, /Connector type not found/));
});
