/* *
 *
 *  Grid Value List Popup class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

import type ValueListFilter from './ValueListFilter';

import Popup from '../../Core/UI/Popup.js';


/* *
 *
 *  Class
 *
 * */

/**
 * The popup holding the value list of a column filtered with the `oneOf`
 * operator. It is used by the inline filtering, where the list does not fit
 * the filter row.
 */
class ValueListPopup extends Popup {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The value list rendered in the popup.
     */
    public valueList: ValueListFilter;


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs a popup for the given value list.
     *
     * @param valueList
     * The value list to render in the popup.
     */
    constructor(valueList: ValueListFilter) {
        const column = valueList.filtering.column;
        const grid = column.viewport.grid;

        super(grid, valueList, {
            header: {
                category: grid.options?.lang?.setFilter,
                label: column.header?.value || ''
            }
        });

        this.valueList = valueList;
    }


    /* *
     *
     *  Methods
     *
     * */

    public override show(anchorElement?: HTMLElement): void {
        super.show(anchorElement);
        this.valueList.focusList();
    }

    protected override renderContent(contentElement: HTMLElement): void {
        this.valueList.renderList(contentElement);
    }

    protected override onKeyDown(event: KeyboardEvent): void {
        super.onKeyDown(event);
        this.valueList.onKeyDown(event);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default ValueListPopup;
