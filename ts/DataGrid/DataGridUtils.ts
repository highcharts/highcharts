/* *
 *
 *  Data Grid utilities
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Øystein Moseng
 *
 * */

import type DataTable from '../Data/DataTable';

export default {
    dataTableCellToString(cell: DataTable.CellType): string {
        return (typeof cell === 'string' || typeof cell === 'number' || typeof cell === 'boolean') ?
            '' + cell :
            '';
    },
    emptyHTMLElement(element: HTMLElement): void {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },
    makeDiv: (className: string, id?: string): HTMLElement => {
        const div = document.createElement('div');
        div.className = className;
        if (id) {
            div.id = id;
        }
        return div;
    }
};
