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
import U from '../../Core/Utilities.js';

import BaseForm from '../../Shared/BaseForm.js';
import EditGlobals from './EditGlobals.js';
import GUIElement from '../Layout/GUIElement.js';
import Bindings from '../Actions/Bindings.js';
import Layout from '../Layout/Layout.js';
import AccordionMenu from './AccordionMenu.js';
import EditRenderer from './EditRenderer.js';
import Component from '../Components/Component';

const {
    createElement,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class which creates the sidebar and handles its behaviour.
 */
class SidebarPopup extends BaseForm {

    public static components: Array<SidebarPopup.AddComponentDetails> = [
        {
            text: 'layout',
            onDrop: function (
                sidebar: SidebarPopup,
                dropContext: Cell|Row
            ): Cell|void {

                if (!dropContext) {
                    return;
                }

                const row = (
                        dropContext.getType() === 'cell' ?
                            (dropContext as Cell).row :
                            (dropContext as Row)
                    ),
                    board = row.layout.board,
                    newLayoutName = GUIElement.createElementId('layout'),
                    cellName = GUIElement.createElementId('cell'),
                    layout = new Layout(board, {
                        id: newLayoutName,
                        copyId: '',
                        parentContainerId: board.container.id,
                        rows: [{
                            cells: [{
                                id: cellName
                            }]
                        }],
                        style: {}
                    });

                if (layout) {
                    board.layouts.push(layout);
                }

                Bindings.addComponent({
                    type: 'HTML',
                    cell: cellName,
                    elements: [
                        {
                            tagName: 'div',
                            style: { 'text-align': 'center' },
                            textContent: 'Placeholder text'
                        }
                    ]
                });

            }
        }, {
            text: 'chart',
            onDrop: function (
                sidebar: SidebarPopup,
                dropContext: Cell|Row
            ): Cell | void {
                if (sidebar && dropContext) {
                    return sidebar.onDropNewComponent(dropContext, {
                        cell: '',
                        type: 'Highcharts',
                        chartOptions: {
                            series: [
                                {
                                    name: 'Series from options',
                                    data: [1, 2, 1, 4]
                                }
                            ],
                            chart: {
                                animation: false,
                                type: 'pie'
                            }
                        }
                    });
                }
            }
        }, {
            text: 'HTML',
            onDrop:
                function (
                    sidebar: SidebarPopup,
                    dropContext: Cell|Row
                ): void|Cell {
                    if (sidebar && dropContext) {
                        return sidebar.onDropNewComponent(dropContext, {
                            cell: '',
                            type: 'HTML',
                            elements: [{
                                tagName: 'img',
                                attributes: {
                                    src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
                                }
                            }]
                        });
                    }
                }
        }, {
            text: 'datagrid',
            onDrop: function (
                sidebar: SidebarPopup,
                dropContext: Cell | Row
            ): Cell|void {
                const headers = ['Apples', 'Pears', 'Plums'];
                const columns = ((): Record<string, Array<string>> => {
                    const makeRandomRows = (): Array<string> =>
                        new Array(40).map(
                            (): string => (10 * Math.random()).toFixed(2)
                        );
                    const cols: Record<string, Array<string>> = {};
                    for (let i = 0; i < headers.length; ++i) {
                        cols[headers[i]] = makeRandomRows();
                    }
                    return cols;
                })();

                if (sidebar && dropContext) {
                    return sidebar.onDropNewComponent(dropContext, {
                        cell: '',
                        type: 'DataGrid'
                        // connector: new CSVConnector(new DataTable(columns))
                    }); // necessary for now
                }
            }
        }, {
            text: 'KPI',
            onDrop: function (
                sidebar: SidebarPopup,
                dropContext: Cell | Row
            ): Cell|void {
                if (sidebar && dropContext) {
                    return sidebar.onDropNewComponent(dropContext, {
                        cell: '',
                        type: 'KPI',
                        title: 'Example KPI',
                        value: 70
                    });
                }
            }
        }
    ];
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
        this.accordionMenu = new AccordionMenu(
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

    public accordionMenu: AccordionMenu;

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

        this.renderHeader(
            context ? EditGlobals.lang.settings : EditGlobals.lang.addComponent,
            this.iconsURL + 'settings.svg'
        );

        if (!context) {
            this.renderAddComponentsList();
            return;
        }

        const type = context.getType();

        if (type === 'cell') {
            const component = (context as Cell).mountedComponent;
            if (!component) {
                return;
            }
            this.accordionMenu.renderContent(this.container, component);
        }
    }

    public renderAddComponentsList(): void {
        const sidebar = this;
        const components = SidebarPopup.components;
        let gridElement;

        const gridWrapper = createElement('div', {
            className: EditGlobals.classNames.editGridItems
        }, {}, sidebar.container);

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            gridElement = createElement(
                'div',
                {},
                {},
                gridWrapper
            );

            // Drag drop new component.
            gridElement.addEventListener('mousedown', (e: Event): void => {
                if (sidebar.editMode.dragDrop) {
                    sidebar.hide();
                    sidebar.editMode.dragDrop.onDragStart(
                        e as PointerEvent,
                        void 0,
                        (dropContext: Cell|Row): void => {
                            const newCell =
                                components[i].onDrop(sidebar, dropContext);

                            if (newCell) {
                                sidebar.editMode.setEditCellContext(newCell);
                                sidebar.show(newCell);
                                newCell.setHighlight();
                            }
                        }
                    );
                }
            });
            gridElement.innerHTML = components[i].text;
        }
        return;
    }

    public onDropNewComponent(
        dropContext: Cell|Row,
        componentOptions: Partial<Component.ComponentOptions>
    ): Cell | void {
        const sidebar = this,
            dragDrop = sidebar.editMode.dragDrop;

        if (dragDrop) {
            const row = (
                    dropContext.getType() === 'cell' ?
                        (dropContext as Cell).row :
                        (dropContext as Row)
                ),
                newCell = row.addCell({
                    id: GUIElement.createElementId('col')
                });

            dragDrop.onCellDragEnd(newCell);
            const options = merge(componentOptions, {
                cell: newCell.id
            });
            Bindings.addComponent(options, newCell);

            return newCell;
        }
    }

    /**
     * Function to hide the sidebar.
     */
    public hide(): void {
        const editMode = this.editMode;
        const editCellContext = editMode.editCellContext;

        this.closePopup();
        this.removeClassNames();

        // Remove edit overlay if active.
        if (editMode.isEditOverlayActive) {
            editMode.setEditOverlay(true);
        }

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

    export interface AddComponentDetails {
        text: string;
        onDrop: Function;
    }
}
/* *
 *
 *  Default Export
 *
 * */

export default SidebarPopup;
