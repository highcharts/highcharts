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

class CheckboxContent extends CellContent {

    private input?: HTMLInputElement;

    public override add(): void {
        this.input = document.createElement('input');
        this.input.type = 'checkbox';
        this.input.checked = !!this.cell.value;
        this.cell.htmlElement.appendChild(this.input);

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
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default CheckboxContent;
