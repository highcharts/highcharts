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
import AccordeonMenu from './AccordeonMenu.js';
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
                                    /* eslint-disable max-len */
                                    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABIFBMVEX//' +
                                    '/93dY2j7Llkmp+AhegwQ2uf67ZblZqBhOtlnKBjm5yAheql8Lt2c4wtPmh1b4t6f+d3dIhxb4h5fufw9Pj3/' +
                                    'fllmaF8iN53jNBYk5rz9P1nmKbP3OR5i9Vtk7jY9+G38Mitxc/O9dru+/Kr7r/F89Lk+et/g988Unc1SHBAW' +
                                    'XuYur5woqfS4eLZ3vO3y9fW1/jl7PGanu1+qLFwkb+rru+/wfObucSLj+puk7hzj8fv7/xqlbCjp+61uPHH1' +
                                    '9/IyvWGrLfn6PuGmqZ6ebig4biOraZ+gdJ6e6+Uvqx/hpab0LJ8f8Z5eaNmeqJejZpeYoFOcIpZgZRUeJNRW' +
                                    'n2vysyd17WJoaGCjpqgnrS1tceFr7ONjKXOztuVwq6wsMM1MXwqAAAGOElEQVR4nO2aeVcURxTF6WWmG2djF' +
                                    'yEJIw4oigZxCVFURInGJSiuaEy+/7dIVVd1d1V19TLhzOlHn/v7f87pe97td+9rmJoCAAAAAAAAAAAAAAAA' +
                                    'AAAAAAAAAAAAAAAAAAAAAAAAVLhV9wNMnIu/1v0EE2ZnfvV23c8wWXbD/Tt1P8NEOZwJ7waX636KSXJvJly+' +
                                    'cKnBPl0JO52LF7w7C3U/yMS4P+P7/pIX/Fb3g0yMvY7vh6ued+mnup9kQuzMsxGGv1/wvKWG+nS3wxU+YAqD' +
                                    'p3U/y0Q45CP0Oz8zhd6lJ3U/zSR4NBMpvDjNFHpLDYyMhx1uUsYqVxg0sNpEUcFfxP1oiEHzKrgvRxje5S8' +
                                    'ik9g0nx7M+1LhslDoNc2nu3KEPu9tYojNqja35FvIJUqFXtCoavOokygMV6XCRlWbh+kI/fCXZIgN8uljVeG' +
                                    'DWKEXNKbaLPipSWVva5hPD5QRsmWaCGxOBd9TRhj3NimRXrXZWFsc+zc785pA2dukT8lVm7W2O1y7Mt5vHuk' +
                                    'jjHsb0Wqz6Lrtdnu4PobIwxlfV7isKqT3dXHYdscU+dhQmPQ2Abmvi5tcoRA5qiRyxddN6vtXl1SF3tLEn3k' +
                                    '8Ft0UJnJjs+wHB/OGQKW30aw2G213LJF75giV3iZ9SqyCb2oKI5HuxmZuhuzMmALV3kaz2ozcDAUid8OMQrW' +
                                    '3kfTphjnEWOTQ0gbMqIgUXvUMiH1dzNi0SOQ9i0Ktt5H0qcWmqci2VnlWOpk94xu9TUCrgq/nDTGZZBKU960' +
                                    'j1HubeBVJVfArhQpdtQ1koyJSuJxRSKzaDMskRipH65s781aFRm8TkKrgaxUUcpHdZ89f+LY3sZMVSCsyrlQ' +
                                    'S6LpHg9nZwfMXnY6pMswsU49YtaliU9ft/jFwHGd2tvfSnGT0d9IMlCKjmk1HjoRNkokMU5WZ3kbOp4vl8tg' +
                                    'I/xw4TirSefniamxX66qhVW2q2LT7queoMLu+feNHItXvbUR9mtvcFIGvB06G2dm3b6JJ2lYNra+LFUb4xaK' +
                                    'Qi3SYyHDfalNK1cZ+YKgCjwY9q0Ixyb+OlzLdNPIpmWpTalMRFbm86197f+xZRNKpNgUHRsSolztCzqDf6ve' +
                                    '33rNJGirpfF0sPjD0qLDQa3H6bJInTKSqkswf+MsOjFeFI3ScrVZLitwyRJLxaaFNrVGh8bGVwEReV0SSqTa' +
                                    'FNu1+LRmh866l0u+3UpFU/sBfZFMWFSUCDYWxyONIJJVqU9DcSqKCMzAVSpEfmEgqPi04MI6cMpOmqyajkok' +
                                    'k8gf+/AOjLCoirtkVigz5QMOn+TatMEJ1mWameHKjbm2CvOZWHhWczKqR+ljRmZ6mMcLcA6M8KjhzOeNjmRF' +
                                    '8qltZjP3A6H6uMkLZ23R9fHwsELfrFpZgt2neYWiyZci79kEeVMHNuoWlWJvbUfFVkfBR03f9xItr2/e6ZSn' +
                                    'YmluFtBekq0ZsF3LHBcfa3MquiphBYs8T9UoMiCSFJGvT7j8VRyiWab/1/li/Dz0qSSHI2rRaVHB6W/w2ND/' +
                                    'X0EkKQcamFaNCKLx+Mm1+xCCUFBKzuXW/VBthb25w+jQjj1ZSCMwDo1pU9OacbytTN4PspzZKSSFY1BVWioq' +
                                    '5ub9/8HViUUgqKSSGTauM71TKWMgKpJUUAs2mpVHBxvctTYPtjERaSSHQ7+DiqJjrnf5Qf3vDsCm1pJAoB0b' +
                                    'hYcjs+a/xln0yFJJLCoFyYBREBd8umZ8aq4ZeUkiUqMgZIQ8/25K8rSuklxSSxKY5UaFvFw0t8Wn9z5BKYtO' +
                                    'RXd9p1p4x36knhUQeGJZviJbtoqGuGjJfnyzEB4Z5GMbdJZ8nqUKiSSEQB4YRFT0WfqUvlrJqiCaFJLJp91l' +
                                    'Ps2fedlFZSD9dUE0KAW9u3c/pVWENPytxbwvIJoWAHxhJVJRtF424t1G8KTTYgTGqul005DKlnBSCtXYUFXy' +
                                    '7jPf3W9nbKCeFYJFHRcXtorEQkE8KyfD1oKi75LNNPykEm1+rbxeN7/STQvJ/XyS2auivmTPBehv5pDgbN4P' +
                                    'zsGbOwsI5SIozsk3jH0smSMM9CgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg3PAfRD' +
                                    'WjQM3VeT0AAAAASUVORK5CYII='
                                    /* eslint-enable max-len */
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
                    } as any); // necessary for now
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
            this.accordeonMenu.renderContent(this.container, component);
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
            (gridElement.onmousedown as any) = (e: PointerEvent): void => {
                if (sidebar.editMode.dragDrop) {
                    sidebar.hide();
                    sidebar.editMode.dragDrop.onDragStart(
                        e,
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
            };
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
