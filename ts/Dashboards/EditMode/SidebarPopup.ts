/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  Pawel Lysy
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */
import type EditMode from './EditMode';
import type Cell from '../Layout/Cell';
import type Row from '../Layout/Row';

import BaseForm from '../../Shared/BaseForm.js';
import EditGlobals from './EditGlobals.js';
import GUIElement from '../Layout/GUIElement.js';
import AccordeonMenu from './AccordeonMenu.js';
import EditRenderer from './EditRenderer.js';
/* *
 *
 *  Class
 *
 * */

/**
 * Class which creates the sidebar and handles its behaviour.
 */
class SidebarPopup extends BaseForm {

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructor of the SidebarPopup class.
     *
     * @param parentDiv
     * Element to which the sidebar will be appended.
     * @param iconsURL
     * URL to the icons.
     * @param editMode
     * Instance of EditMode.
     */
    constructor(parentDiv: HTMLElement, iconsURL: string, editMode: EditMode) {
        super(parentDiv, iconsURL);
        this.editMode = editMode;
        this.accordeonMenu = new AccordeonMenu(
            this.iconsURL,
            this.hide.bind(this)
        );
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Instance of EditMode.
     */
    public editMode: EditMode;
    /**
     * Whether the sidebar is visible.
     */
    public isVisible = false;

    public accordeonMenu: AccordeonMenu;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Function to detect on which side of the screen should the sidebar be.
     *
     * @param context
     * The cell or row which is the context of the sidebar.
     * @returns
     * Whether the sidebar should be on the right side of the screen.
     */
    private detectRightSidebar(context: Cell | Row): boolean {

        const editMode = this.editMode;
        const layoutWrapper = editMode.board.layoutsWrapper;

        return GUIElement.getOffsets(
            context as Cell,
            layoutWrapper
        ).left < ((layoutWrapper.offsetWidth / 2) - 10); // 10 = snap

    }

    /**
     * Function to remove the class names from the sidebar.
     */
    private removeClassNames(): void {
        const classNames = EditGlobals.classNames,
            classList = this.container.classList;
        classList.remove(classNames.editSidebarShow);
        classList.remove(classNames.editSidebarRight);
        classList.remove(classNames.editSidebarRightShow);
    }

    /**
     * Function to add the class names to the sidebar depending on the position
     * of the sidebar.
     *
     * @param isRightSidebar
     * Whether the sidebar should be on the right side of the screen.
     */
    private addClassNames(isRightSidebar: boolean): void {
        const classList = this.container.classList;

        if (isRightSidebar) {
            classList.add(
                EditGlobals.classNames.editSidebarRight
            );
        }

        setTimeout(():void => {
            classList.add(EditGlobals.classNames[
                isRightSidebar ? 'editSidebarRightShow' : 'editSidebarShow'
            ]
            );
        });
    }

    /**
     * Function to show the sidebar.
     *
     * @param context
     * The cell or row which is the context of the sidebar.
     */
    public show(context?: Cell | Row): void {
        const editMode = this.editMode,
            isRightSidebar = !!(context && this.detectRightSidebar(context));

        this.showPopup(EditGlobals.classNames.editSidebarShow);
        this.addClassNames(isRightSidebar);

        if (editMode.resizer) {
            editMode.resizer.disableResizer();
        }

        // Remove highlight from the row.
        if (editMode.editCellContext) {
            editMode.editCellContext.row.setHighlight(true);
        }

        editMode.hideToolbars(['cell', 'row']);
        editMode.stopContextDetection();

        this.isVisible = true;

        this.generateContent(context);
    }

    public generateContent(context?: Cell | Row): void {
        if (!context) {
            // TODO: Add content when there is no context
            return;
        }

        this.renderHeader('Settings', this.iconsURL + 'settings.svg');

        const type = context.getType();
        if (type === 'cell') {
            const component = (context as Cell).mountedComponent;
            if (!component) {
                return;
            }
            this.accordeonMenu.renderContent(this.container, component);
        }
    }

    /**
     * Function to hide the sidebar.
     */
    public hide(): void {
        const editMode = this.editMode;
        this.closePopup();
        this.removeClassNames();
        const editCellContext = editMode.editCellContext;

        if (editCellContext) {
            editMode.showToolbars(['cell', 'row'], editCellContext);
            editCellContext.row.setHighlight();

            // Remove cell highlight if active.
            if (editCellContext.isHighlighted) {
                editCellContext.setHighlight(true);
            }
        }

        editMode.isContextDetectionActive = true;
        this.isVisible = false;
    }

    /**
     * Function called when the close button is pressed.
     */
    public closeButtonEvents(): void {
        this.hide();
    }

    public renderHeader(title: string, iconURL: string): void {
        const icon = EditRenderer.renderIcon(this.container, {
            icon: iconURL,
            className: EditGlobals.classNames.editSidebarTitle
        });

        if (icon) {
            icon.textContent = title;
        }
    }
    /**
     * Function to create and add the close button to the sidebar.
     *
     * @param className
     * Class name of the close button.
     * @returns Close button element
     */
    protected addCloseButton(
        className: string = EditGlobals.classNames.popupCloseButton
    ): HTMLElement {
        return super.addCloseButton.call(this, className);
    }

    /**
     * Function that creates the container of the sidebar.
     *
     * @param parentDiv
     * The parent div to which the sidebar will be appended.
     * @param className
     * Class name of the sidebar.
     * @returns The container of the sidebar.
     */
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
