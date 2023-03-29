/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */
import type EditMode from './EditMode.js';
import type Cell from '../Layout/Cell';
import type Row from '../Layout/Row.js';

import BaseForm from '../../Shared/BaseForm.js';
import EditGlobals from './EditGlobals.js';
import EditRenderer from './EditRenderer.js';

/* *
 *
 *  Class
 *
 * */

class SidebarPopup extends BaseForm {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(parentDiv: HTMLElement, iconsURL: string, editMode: EditMode) {
        super(parentDiv, iconsURL);
        this.editMode = editMode;
    }

    /* *
     *
     *  Properties
     *
     * */

    public editMode: EditMode;
    public isVisible = false;

    /* *
     *
     *  Functions
     *
     * */

    public show(context?: Cell | Row): void {
        this.showPopup(EditGlobals.classNames.editSidebarShow);
        const editMode = this.editMode;

        this.container.classList.add(EditGlobals.classNames.editSidebarShow);

        if (editMode.resizer) {
            editMode.resizer.disableResizer();
        }

        // Remove highlight from the row.
        if (editMode.editCellContext) {
            editMode.editCellContext.row.setHighlight(true);
        }

        // Hide row and cell toolbars.
        editMode.hideToolbars(['cell', 'row']);
        editMode.stopContextDetection();

        this.isVisible = true;
    }

    public hide(): void {

        this.closePopup();
        this.container.classList.remove(EditGlobals.classNames.editSidebarShow);
        this.editMode.board.container.style.paddingLeft = '';
        const editMode = this.editMode;
        if (editMode.editCellContext) {
            editMode.showToolbars(['cell', 'row'], editMode.editCellContext);
            editMode.editCellContext.row.setHighlight();

            // Remove cell highlight if active.
            if (editMode.editCellContext.isHighlighted) {
                editMode.editCellContext.setHighlight(true);
            }
        }

        editMode.isContextDetectionActive = true;
        this.isVisible = false;
    }

    protected addCloseButton(
        className: string = EditGlobals.classNames.sidebarCloseButton +
            ' ' +
            EditGlobals.classNames.sidebarNavButton
    ): HTMLElement {
        // return super.addCloseButton.call(this, className);
        const sidebar = this;
        const closeIcon =
            'https://code.highcharts.com/10.3.3/gfx/dashboard-icons/close.svg';

        sidebar.closeButton = EditRenderer.renderButton(sidebar.container, {
            className,
            callback: (): void => {
                sidebar.hide();
            },
            icon: closeIcon
        }) as HTMLElement;
        return sidebar.closeButton;
    }

    protected createPopupContainer(
        parentDiv: HTMLElement,
        className = EditGlobals.classNames.editSidebar
    ): HTMLElement {
        return super.createPopupContainer.call(this, parentDiv, className);
    }
}

/* *
 *
 *  Namespace
 *
 * */
namespace SidebarPopup {

    export interface Options {

    }
}
/* *
 *
 *  Default Export
 *
 * */

export default SidebarPopup;
