/* *
 *
 *  Sparkline Cell Renderer class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Column from '../../../Core/Table/Column';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type DataTable from '../../../../Data/DataTable';
import type * as HighchartsNamespace from '../../highcharts';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
import SparklineContent from '../ContentTypes/SparklineContent.js';

import U from '../../../../Core/Utilities.js';
const {
    merge
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Renderer for the Text in a column..
 */
class SparklineRenderer extends CellRenderer {

    /**
     * The default edit mode renderer type names for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'textInput';

    /**
     * Default options for the sparkline renderer.
     */
    public static defaultOptions: SparklineRenderer.Options = {
        type: 'sparkline'
    };

    public override options: SparklineRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(column: Column) {
        super(column);

        if (!SparklineContent.H) {
            throw new Error(
                'Sparkline Renderer: Highcharts is not loaded. Please ensure ' +
                'that Highcharts namespace is registered before the Sparkline' +
                ' Renderer is used.'
            );
        }

        this.options = merge(
            SparklineRenderer.defaultOptions,
            this.column.options.cells?.renderer || {}
        );
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(cell: TableCell): SparklineContent {
        return new SparklineContent(cell, this);
    }
}


/* *
 *
 *  Namespace
 *
 * */

namespace SparklineRenderer {

    /**
     * Imports the Highcharts namespace to be used by the Sparkline Renderer.
     *
     * @param H
     * Highcharts namespace.
     */
    export function useHighcharts(H: typeof HighchartsNamespace): void {
        if (H && !SparklineContent.H) {
            SparklineContent.H = H;
        }
    }

    /**
     * Options to control the sparkline renderer content.
     */
    export interface Options extends CellRenderer.Options {
        type: 'sparkline';
        chartOptions?: (
            ((data: DataTable.CellType) => HighchartsNamespace.Options) |
            HighchartsNamespace.Options
        );
    }

}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {

    interface CellRendererTypeRegistry {
        sparkline: typeof SparklineRenderer;
    }
}

CellRendererRegistry.registerRenderer('sparkline', SparklineRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default SparklineRenderer;
