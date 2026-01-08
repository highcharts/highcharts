/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Board from '../Board.js';

/* *
 *
 *  Functions
 *
 * */

/* *
 *
 *  Class
 *
 * */

class DashboardsAccessibility {
    /* *
    *
    *  Constructor
    *
    * */

    public constructor(
        board: Board
    ) {
        this.board = board;

        this.addTabIndexToCells();
    }

    /* *
     *
     *  Properties
     *
     * */
    public board: Board;

    /* *
    *
    *  Functions
    *
    * */
    public addTabIndexToCells():void {
        const components = this.board.mountedComponents;
        let cell;

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            cell = components[i].cell;
            if (cell && cell.container) {
                cell.container.setAttribute('tabindex', -1);
            }
        }
    }
}

/// namespace DashboardsAccessibility { }

/* *
 *
 *  Default Export
 *
 * */

export default DashboardsAccessibility;
