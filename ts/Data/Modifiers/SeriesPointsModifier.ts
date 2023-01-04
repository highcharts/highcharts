/* *
 *
 *  (c) 2020-2022 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 */
class SeriesPointsModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options for the series points modifier.
     */
    public static readonly defaultOptions: SeriesPointsModifier.Options = {
        modifier: 'SeriesPoints'
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the series points modifier.
     *
     * @param {SeriesPointsModifier.Options} [options]
     * Options to configure the series points modifier.
     */
    public constructor(options?: DeepPartial<SeriesPointsModifier.Options>) {
        super();

        this.options = merge(SeriesPointsModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Options of the series points modifier.
     */
    public options: SeriesPointsModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Renames columns to alternative column names (alias) depending on mapping
     * option.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with `modified` property as a reference.
     */
    public modifyTable<T extends DataTable>(
        table: T,
        eventDetail?: DataEventEmitter.EventDetail
    ): T {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        const aliasMap = modifier.options.aliasMap || {},
            aliases = Object.keys(aliasMap),
            modified = table.modified = table.clone(false, eventDetail);

        for (let i = 0, iEnd = aliases.length, alias: string; i < iEnd; ++i) {
            alias = aliases[i];
            modified.renameColumn(aliasMap[alias], alias);
        }

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace SeriesPointsModifier {

    /**
     * Options to configure the modifier.
     */
    export interface Options extends DataModifier.Options {
        aliasMap?: Record<string, string>;
    }
}

/* *
 *
 *  Register
 *
 * */

DataModifier.addModifier(SeriesPointsModifier);

declare module './ModifierType' {
    interface ModifierTypeRegistry {
        SeriesPoints: typeof SeriesPointsModifier;
    }
}

/* *
 *
 *  Export
 *
 * */

export default SeriesPointsModifier;
