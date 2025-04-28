/* *
 *
 *  Select Cell Renderer class
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

import CellRenderer from '../CellRenderer.js';
import CellRendererRegistry from '../CellRendererRegistry.js';
import SelectContent from '../ContentTypes/SelectContent.js';

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
 * Renderer for the Select.
 */
class SelectRenderer extends CellRenderer {

    public static defaultOptions: SelectRenderer.Options = {
        type: 'select',
        disableDblClickEditor: true,
        options: []
    };

    public override options: SelectRenderer.Options;

    public constructor(column: Column) {
        super(column);

        this.options = merge(
            this.column.options.rendering || {},
            SelectRenderer.defaultOptions
        );
    }

    public override render(cell: TableCell): SelectContent {
        return new SelectContent(cell);
    }

}


/* *
 *
 *  Namespace
 *
 * */

namespace SelectRenderer {

    export interface SelectOption {
        value: string;
        label?: string;
        disabled?: boolean;
    }

    export interface Options extends CellRenderer.Options {
        type: 'select';
        options: SelectOption[];
    }

}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        select: typeof SelectRenderer
    }
}

CellRendererRegistry.registerRenderer('select', SelectRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default SelectRenderer;
