/* *
 *
 *  Sparkline Cell Renderer class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { AnyRecord } from '../../../../Shared/Types';
import type Column from '../../../Core/Table/Column';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type DataTable from '../../../../Data/DataTable';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

import { CellRenderer, CellRendererOptions } from '../CellRenderer.js';
import { registerRenderer } from '../CellRendererRegistry.js';
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
     * Imports the Highcharts namespace to be used by the Sparkline Renderer.
     *
     * @param H
     * Highcharts namespace.
     */
    public static useHighcharts(H: AnyRecord): void {
        if (H && !SparklineContent.H) {
            SparklineContent.H = H;
        }
    }

    /**
     * The default edit mode renderer type names for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName =
        'textInput';

    /**
     * Default options for the sparkline renderer.
     */
    public static defaultOptions: SparklineRendererOptions = {
        type: 'sparkline'
    };

    public override options: SparklineRendererOptions;


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
 *  Declarations
 *
 * */

/**
 * Options to control the sparkline renderer content.
 */
export interface SparklineRendererOptions extends CellRendererOptions {
    type: 'sparkline';
    chartOptions?: (
        ((this: TableCell, data: DataTable.CellType) => AnyRecord) |
        AnyRecord
    );
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

registerRenderer('sparkline', SparklineRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default SparklineRenderer;
