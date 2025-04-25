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

import CellContent from '../../../Core/Table/CellContent/CellContent.js';
import SelectRenderer from '../Renderers/SelectRenderer.js';


/* *
 *
 *  Class
 *
 * */

class SelectContent extends CellContent {

    private select?: HTMLSelectElement;
    private optionElements: HTMLOptionElement[] = [];

    public override add(): void {
        const options =
            this.cell.column.options.rendering as SelectRenderer.Options;

        this.select = document.createElement('select');
        for (const option of options.options) {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label || option.value;
            optionElement.disabled = !!option.disabled;

            if (this.cell.value === option.value) {
                optionElement.selected = true;
            }

            this.select.appendChild(optionElement);
            this.optionElements.push(optionElement);
        }
        this.cell.htmlElement.appendChild(this.select);

        this.select.addEventListener('change', this.onChange);
    }

    public destroy(): void {
        this.select?.removeEventListener('change', this.onChange);

        for (const optionElement of this.optionElements) {
            optionElement.remove();
        }
        this.optionElements.length = 0;

        this.select?.remove();
    }

    private onChange = (e: Event): void => {
        // TODO: Handle data table update
        console.log('Select changed', (e.target as HTMLSelectElement).value);
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SelectContent;
