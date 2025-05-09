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

import CellContent from '../../../Core/Table/CellContent/CellContent.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a checkbox type of cell content.
 */
class CheckboxContent extends CellContent {

    private input?: HTMLInputElement;

    public override add(): void {
        const cell = this.cell;

        this.input = document.createElement('input');
        this.input.type = 'checkbox';
        this.input.checked = !!cell.value;
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !cell.column.options.cells?.editable;

        cell.htmlElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
    }

    public destroy(): void {
        this.input?.removeEventListener('change', this.onChange);
        this.input?.remove();
    }

    private onChange = (e: Event): void => {
        this.cell.setValue(
            (e.target as HTMLInputElement).checked,
            true
        );

        this.cell.column.options.rendering?.events?.change?.call(this.cell);
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default CheckboxContent;
