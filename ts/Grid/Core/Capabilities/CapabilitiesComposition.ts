/* *
 *
 *  Grid capabilities composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';

import DataProviderRegistry from '../Data/DataProviderRegistry.js';
import { defaultOptions } from '../Defaults.js';
import Globals from '../Globals.js';
import {
    addEvent,
    fireEvent,
    pushUnique
} from '../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

export type GridCapabilityState = boolean | 'n/a';
export type GridKeyStatus = 'valid' | 'invalid' | 'missing' | 'expired';
export type GridKeyCapabilityState = GridKeyStatus | 'n/a';
export type GridProduct = 'lite' | 'pro';

export interface GridCapabilities {
    filtering: boolean;
    sorting: boolean;
    pinning: GridCapabilityState;
    treeView: GridCapabilityState;
    pagination: boolean;
    editMode: GridCapabilityState;
    cellFormat: boolean;
    cellFormatter: boolean;
    strictHeights: boolean;
    customTheme: boolean;
    header: boolean;
    remoteOperations: GridCapabilityState;
    key: GridKeyCapabilityState;
}


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the grid classes with derived feature capabilities.
 *
 * @param GridClass
 * The class to extend.
 *
 * @param product
 * Product variant the class belongs to.
 *
 */
export function compose(
    GridClass: typeof Grid,
    product: GridProduct = 'pro'
): void {
    if (!pushUnique(Globals.composed, 'GridCapabilities')) {
        return;
    }

    const hasProFeatures = product === 'pro';
    const update = function (this: Grid): void {
        updateCapabilities.call(this, hasProFeatures);
    };

    addEvent(GridClass, 'beforeLoad', update);
    addEvent(GridClass, 'afterUpdate', update);
}

/**
 * Updates derived capabilities from the current Grid options.
 *
 * @param this
 * Grid instance.
 *
 * @param hasProFeatures
 * Whether Pro-only features are available.
 */
function updateCapabilities(this: Grid, hasProFeatures: boolean): void {
    const capabilities = this.capabilities || (this.capabilities = {
        filtering: false,
        sorting: false,
        pinning: 'n/a',
        treeView: 'n/a',
        pagination: false,
        editMode: 'n/a',
        cellFormat: false,
        cellFormatter: false,
        strictHeights: false,
        customTheme: false,
        header: true,
        remoteOperations: 'n/a',
        key: 'n/a'
    });
    const options = this.options;
    const columnPolicy = this.columnPolicy;
    const columnDefaults = options?.columnDefaults;
    const rendering = options?.rendering;
    const dataOptions = options?.data;
    const columnIds = columnPolicy.getColumnIds();
    const sortingDefaultsEnabled =
        columnDefaults?.sorting?.enabled !== false;
    let filtering = columnDefaults?.filtering?.enabled === true;
    let sorting = sortingDefaultsEnabled;
    let editMode = (
        hasProFeatures &&
        columnDefaults?.cells?.editMode?.enabled === true
    );
    let cellFormat = columnDefaults?.cells?.format !== void 0;
    let cellFormatter = columnDefaults?.cells?.formatter !== void 0;

    for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
        const columnId = columnIds[i];
        const columnOptions = columnPolicy.getIndividualColumnOptions(
            columnId
        );

        filtering = filtering || columnPolicy.isColumnFilteringEnabled(
            columnId
        );
        sorting = sorting || columnPolicy.isColumnSortingEnabled(columnId);
        editMode = (
            editMode ||
            hasProFeatures &&
            columnPolicy.isColumnEditable(columnId)
        );
        cellFormat = cellFormat || columnOptions?.cells?.format !== void 0;
        cellFormatter = (
            cellFormatter ||
            columnOptions?.cells?.formatter !== void 0
        );

        if (
            filtering &&
            sorting &&
            (!hasProFeatures || editMode) &&
            cellFormat &&
            cellFormatter
        ) {
            break;
        }
    }

    capabilities.filtering = filtering;
    capabilities.sorting = sorting;
    capabilities.pagination = options?.pagination?.enabled === true;
    capabilities.cellFormat = cellFormat;
    capabilities.cellFormatter = cellFormatter;
    capabilities.strictHeights = rendering?.rows?.strictHeights === true;
    capabilities.customTheme = (
        rendering?.theme ??
        defaultOptions.rendering?.theme
    ) !== defaultOptions.rendering?.theme;
    capabilities.header = rendering?.header?.enabled !== false;

    if (hasProFeatures) {
        const rowPinning = (this as {
            rowPinning?: {
                isEnabled: () => boolean;
            };
        }).rowPinning;
        const treeView = (dataOptions as {
            treeView?: { enabled?: boolean };
        } | undefined)?.treeView;

        capabilities.pinning = !!rowPinning?.isEnabled();
        capabilities.treeView = !!treeView && treeView.enabled !== false;
        capabilities.editMode = editMode;
        capabilities.remoteOperations = (
            dataOptions?.providerType === 'remote' &&
            !!DataProviderRegistry.types[dataOptions.providerType]
        );
        capabilities.key = 'missing';
    } else {
        capabilities.pinning = 'n/a';
        capabilities.treeView = 'n/a';
        capabilities.editMode = 'n/a';
        capabilities.remoteOperations = 'n/a';
        capabilities.key = 'n/a';
    }

    fireEvent(this, 'updateCapabilities', { capabilities });
}
/* *
 *
 *  Declarations
 *
 * */

declare module '../Grid' {
    export default interface Grid {
        /**
         * Derived Grid feature state.
         */
        capabilities: GridCapabilities;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
