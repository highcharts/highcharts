/* *
 *
 *  Data Grid utilities
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
