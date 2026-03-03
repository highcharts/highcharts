/* *
 *
 *  Grid Tree View Composition
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

import type Grid from '../../Core/Grid';
import type { TreeViewOptions } from './TreeViewTypes';

import Globals from '../../Core/Globals.js';
import TreeProjectionController from './TreeProjectionController.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Composes Grid Pro with TreeView projection infrastructure.
 *
 * @param GridClass
 * Grid class to extend.
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'TreeView')) {
        return;
    }

    addEvent(GridClass, 'afterRenderViewport', onAfterRenderViewport);
    addEvent(GridClass, 'beforeDestroy', onBeforeDestroy);
}

/**
 * Initializes or refreshes TreeView projection infrastructure after render.
 *
 * @this Grid
 */
function onAfterRenderViewport(this: Grid): void {
    if (!this.treeProjectionController) {
        this.treeProjectionController =
            new TreeProjectionController(this);
    }

    this.treeProjectionController?.sync();
}

/**
 * Cleans up TreeView projection infrastructure on Grid destroy.
 *
 * @this Grid
 */
function onBeforeDestroy(this: Grid): void {
    this.treeProjectionController?.destroy();
    delete this.treeProjectionController;
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        treeProjectionController?: TreeProjectionController;
    }
}

declare module '../../Core/Data/LocalDataProvider' {
    interface LocalDataProviderOptions {
        /**
         * Tree view options for local provider (Grid Pro module).
         */
        treeView?: TreeViewOptions;
    }
}
/* *
 *
 *  Default export
 *
 * */

export default {
    compose
} as const;
