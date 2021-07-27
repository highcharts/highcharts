/* *
 *
 *  Data module
 *
 *  (c) 2012-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ChartType from '../../Core/Chart/Chart';
import type DataType from './Data';
import type Options from '../../Core/Options';

import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    merge
} = U;

/* *
 *
 *  Composition
 *
 * */

/**
 * @private
 */
namespace DataComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Chart extends ChartType {
        data?: DataType;
        hasDataDef?: boolean;
        liveDataURL?: string;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<unknown> = [];

    /* *
     *
     *  Variables
     *
     * */

    let Data: typeof DataType;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose(
        ChartClass: typeof ChartType,
        DataClass: typeof DataType
    ): void {
        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            addEvent(ChartClass, 'init', onChartInit);
        }
        if (!Data) {
            Data = DataClass;
        }
    }

    /**
     * Extend Chart.init so that the Chart constructor accepts a new
     * configuration option group, data.
     * @private
     */
    function onChartInit(
        this: Chart,
        e: Event & {
            args: [
                (Partial<Options>|undefined),
                (ChartType.CallbackFunction|undefined)
            ];
        }
    ): void {
        const chart = this, // eslint-disable-line no-invalid-this
            callback = e.args[1];

        let userOptions: Partial<Options> = (e.args[0] || {});

        if (userOptions && userOptions.data && !chart.hasDataDef) {
            chart.hasDataDef = true;
            /**
             * The data parser for this chart.
             *
             * @name Highcharts.Chart#data
             * @type {Highcharts.Data|undefined}
             */
            chart.data = new Data(extend(userOptions.data, {

                afterComplete: function (
                    dataOptions?: Partial<Options>
                ): void {
                    let i, series;

                    // Merge series configs
                    if (
                        Object.hasOwnProperty.call(
                            userOptions,
                            'series'
                        )
                    ) {
                        if (typeof userOptions.series === 'object') {
                            i = Math.max(
                                userOptions.series.length,
                                dataOptions && dataOptions.series ?
                                    dataOptions.series.length :
                                    0
                            );
                            while (i--) {
                                series = userOptions.series[i] || {};
                                userOptions.series[i] = merge(
                                    series,
                                    dataOptions && dataOptions.series ?
                                        dataOptions.series[i] :
                                        {}
                                );
                            }
                        } else { // Allow merging in dataOptions.series (#2856)
                            delete userOptions.series;
                        }
                    }

                    // Do the merge
                    userOptions = merge(dataOptions, userOptions);

                    // Run chart.init again
                    chart.init(userOptions, callback);
                }
            }), userOptions, chart);

            e.preventDefault();
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataComposition;
