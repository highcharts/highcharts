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
import type { EditModeRenderer } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type {
    EditModeRendererTypeName
} from '../../CellEditing/CellEditingComposition';

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

/**
 * Renderer for the Checkbox in a column.
 */
class CheckboxRenderer extends CellRenderer implements EditModeRenderer {

    /**
     * The default edit mode renderer type name for this view renderer.
     */
    public static defaultEditingRenderer: EditModeRendererTypeName = 'checkbox';

    /**
     * Default options for the checkbox renderer.
     */
    public static defaultOptions: CheckboxRenderer.Options = {
        type: 'checkbox'
    };

    public override options: CheckboxRenderer.Options;


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(column: Column, options: Partial<CellRenderer.Options>) {
        super(column);
        this.options = merge(CheckboxRenderer.defaultOptions, options);
    }


    /* *
     *
     *  Methods
     *
     * */

    public override render(
        cell: TableCell,
        parentElement?: HTMLElement
    ): CheckboxContent {
        return new CheckboxContent(cell, this, parentElement);
    }
}


/* *
 *
 *  Namespace
 *
 * */

namespace CheckboxRenderer {

    /**
     * Options to control the checkbox renderer content.
     */
    export interface Options extends CellRenderer.Options {
        type: 'checkbox';

        /**
         * Whether the checkbox is disabled.
         */
        disabled?: boolean;
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
