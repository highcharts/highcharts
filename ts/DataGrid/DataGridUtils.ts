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

export default {
    makeDiv: (className: string): HTMLElement => {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }
};
