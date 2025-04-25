/* *
 *
 *  Checkbox Cell Renderer class
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
import CheckboxContent from '../ContentTypes/CheckboxContent.js';

import U from '../../../../Core/Utilities.js';
const {
    merge
} = U;


/* *
 *
 *  Class
 *
 * */

class CheckboxRenderer extends CellRenderer {

    public static defaultOptions: CheckboxRenderer.Options = {
        type: 'checkbox',
        disableDblClickEditor: true
    };

    public override options: CheckboxRenderer.Options;

    public constructor(column: Column) {
        super(column);

        this.options = merge(
            this.column.options.rendering || {},
            CheckboxRenderer.defaultOptions
        )
    }

    public override render(cell: TableCell): CheckboxContent {
        return new CheckboxContent(cell);
    }

}


/* *
 *
 *  Namespace
 *
 * */

namespace CheckboxRenderer {

    export interface Options extends CellRenderer.Options {
        type: 'checkbox';
    }

}


/* *
 *
 *  Registry
 *
 * */

declare module '../CellRendererType' {
    interface CellRendererTypeRegistry {
        checkbox: typeof CheckboxRenderer
    }
}

CellRendererRegistry.registerRenderer('checkbox', CheckboxRenderer);


/* *
 *
 *  Default Export
 *
 * */

export default CheckboxRenderer;
