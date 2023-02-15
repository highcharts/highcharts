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

import type HighchartsComponent from '../../Extensions/DashboardPlugins/HighchartsComponent';

import EditMode from './EditMode.js';
import U from '../../Core/Utilities.js';
import Cell from '../Layout/Cell.js';
import Row from '../Layout/Row.js';
import EditGlobals from './EditGlobals.js';
import Menu from './Menu/Menu.js';
import type MenuItem from './Menu/MenuItem.js';
import Globals from '../Globals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import EditRenderer from './EditRenderer.js';
import Bindings from '../Actions/Bindings.js';
import GUIElement from '../Layout/GUIElement.js';
import Layout from '../Layout/Layout.js';
import DataTable from '../../Data/DataTable.js';

const {
    merge,
    createElement,
    addEvent
} = U;

class Sidebar {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: Sidebar.Options = {
        enabled: true,
        className: 'test',
        dragIcon: EditGlobals.iconsURL + '/drag.svg',
        closeIcon: EditGlobals.iconsURL + '/close.svg'
    };

    public static tabs: Array<Sidebar.TabOptions> = [{
    // {
    //     type: 'design',
    //     icon: '',
    //     items: {
    //         cell: ['cellWidth']
    //     }
    // },
        type: 'component',
        icon: '',
        items: {
            cell: ['componentSettings']
        }
    }, {
        type: 'data',
        icon: '',
        items: {
            cell: ['']
        }
    }];

    public static predefinedWidth: Array<Sidebar.PredefinedWidth> = [{
        name: 'auto',
        value: 'auto',
        icon: ''
    }, {
        name: '1/1',
        value: '100',
        icon: ''
    }, {
        name: '1/3',
        value: '33.333',
        icon: ''
    }, {
        name: '1/6',
        value: '16.666',
        icon: ''
    }];

    public static components: Array<Sidebar.AddComponentDetails> = [
        {
            text: 'layout',
            onDrop: function (
                sidebar: Sidebar,
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
                    type: 'html',
                    cell: cellName,
                    isResizable: true,
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
                sidebar: Sidebar,
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
                function (sidebar: Sidebar, dropContext: Cell|Row): void|Cell {
                    if (sidebar && dropContext) {
                        return sidebar.onDropNewComponent(dropContext, {
                            cell: '',
                            type: 'html',
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
                sidebar: Sidebar,
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
                        type: 'DataGrid',
                        store: new Dashboards.CSVStore(new DataTable(columns))
                    } as any); // necessary for now
                }
            }
        }
    ];

    public static tabsGeneralOptions: Array<Sidebar.TabOptions> = [{
        type: 'components',
        icon: '',
        items: {
            cell: ['addComponent']
        }
    }];

    public static items = merge(Menu.items, {
        componentSettings: {
            id: 'componentSettings',
            type: 'componentSettings',
            text: 'Settings',
            events: {
                update: function (): void {
                    ((this as MenuItem).menu.parent as Sidebar)
                        .getComponentEditableOptions();
                }
            }
        },
        cellWidth: {
            id: 'cellWidth',
            type: 'input',
            text: 'Cell width',
            events: {
                click: function (
                    this: MenuItem,
                    input: HTMLDOMElement,
                    e: any
                ): void {
                    const inputValue = +(input as any).value,
                        cell = this.menu.parent.context;

                    if (cell.getType() === Globals.guiElementType.cell) {
                        cell.setSize({ width: inputValue });
                    }
                },
                update: function (this: MenuItem, e: any): void {
                    const item = this,
                        cell = this.menu.parent.context;

                    if (cell &&
                        cell.getType() === Globals.guiElementType.cell &&
                        cell.container &&
                        item.innerElement &&
                        item.innerElement.tagName === 'INPUT' &&
                        (item.innerElement as any).value !==
                            cell.container.offsetWidth
                    ) {
                        const sidebar =
                            ((this as MenuItem).menu.parent as Sidebar);

                        (item.innerElement as any).value =
                            sidebar.getCellWidth(cell);

                        sidebar.getWidthGridOptions();
                    }
                },
                onCellResize: function (this: MenuItem, e: any): void {
                    if (this.options.events && this.options.events.update) {
                        this.options.events.update.apply(this, arguments);
                    }
                }
            }
        },
        rowHeight: {
            id: 'rowHeight',
            type: 'input',
            text: 'Row height',
            events: {
                click: function (
                    this: MenuItem,
                    input: HTMLDOMElement,
                    e: any
                ): void {
                    const inputValue = +(input as any).value,
                        row = this.menu.parent.context;

                    if (row.getType() === Globals.guiElementType.row) {
                        row.setSize(inputValue);
                    }
                },
                update: function (this: MenuItem, e: any): void {
                    const item = this,
                        row = this.menu.parent.context;

                    if (
                        row.getType() === Globals.guiElementType.row &&
                        row.container &&
                        item.innerElement &&
                        item.innerElement.tagName === 'INPUT' &&
                        (item.innerElement as any).value !==
                            row.container.offsetHeight
                    ) {
                        (item.innerElement as any).value =
                            row.container.offsetHeight;
                    }
                },
                onCellResize: function (this: MenuItem, e: any): void {
                    if (this.options.events && this.options.events.update) {
                        this.options.events.update.apply(this, arguments);
                    }
                }
            }
        }
    });

    public static itemsGeneralOptions: Record<string, MenuItem.Options> = {
        addLayout: {
            id: 'addLayout',
            type: 'addLayout',
            events: {
                update: function (this: MenuItem): void {
                    (this.menu.parent as Sidebar).getLayoutOptions();
                }
            }
        },
        addComponent: {
            id: 'addComponent',
            type: 'addComponent',
            events: {
                update: function (this: MenuItem): void {
                    (this.menu.parent as Sidebar).getComponents();
                }
            }
        }
    };

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode
    ) {
        this.tabs = {};
        this.isVisible = false;
        this.options = merge(
            Sidebar.defaultOptions,
            (editMode.options.toolbars || {}).settings
        );
        this.editMode = editMode;

        this.container = this.renderContainer();

        this.renderCloseButton();
        this.renderTitle();
        this.initTabs(
            Sidebar.tabs,
            true
        );
        this.initTabs(
            Sidebar.tabsGeneralOptions
        );
        this.initEvents();
    }

    /* *
    *
    *  Properties
    *
    * */
    public container: HTMLDOMElement;
    public options?: Sidebar.Options;
    public isVisible: boolean;
    public editMode: EditMode;
    public title?: HTMLDOMElement;
    public tabs: Record<string, Sidebar.Tab>;
    public activeTab?: Sidebar.Tab;
    public context?: Cell|Row;
    public rowCellTab?: HTMLDOMElement;
    public generalOptionsTab?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */

    private renderContainer(): HTMLDOMElement {
        const sidebar = this;

        return createElement(
            'div', {
                className: EditGlobals.classNames.editSidebar +
                    ' ' + ((sidebar.options || {}).className || '')
            },
            {},
            sidebar.editMode.board.container
        );
    }

    private renderTitle(): void {
        const sidebar = this;

        sidebar.title = createElement(
            'div', {
                className: EditGlobals.classNames.editSidebarTitle,
                textContent: 'SETTINGS'
            }, {}, sidebar.container
        );
    }

    private initTabs(
        tabs: Array<Sidebar.TabOptions>,
        isRowCell?: boolean
    ): void {
        const sidebar = this;

        // create the whole tab (including menu) container
        const tabContainer = createElement(
            'div', {
                className: EditGlobals.classNames.editSidebarTabContainer
            }, {}, sidebar.container
        );

        if (isRowCell) {
            sidebar.rowCellTab = tabContainer;
        } else {
            sidebar.generalOptionsTab = tabContainer;
        }

        // create tab menu container
        const container = createElement(
            'div', {
                className: EditGlobals.classNames.editSidebarTabsContainer
            }, {}, tabContainer
        );

        let tabElement;
        let contentContainer;
        let buttonsContainer;
        let content;
        let saveBtn;
        let cancelBtn;
        let contentItems = [];

        for (let i = 0, iEnd = tabs.length; i < iEnd; ++i) {
            contentItems = tabs[i].items.cell;
            const isComponentSettings = contentItems[0] === 'componentSettings';

            tabElement = createElement(
                'div', {
                    className: EditGlobals.classNames.editSidebarTab,
                    textContent: tabs[i].type,
                    onclick: function (): void {
                        sidebar.onTabClick(sidebar.tabs[tabs[i].type]);
                    }
                }, {}, container
            );

            contentContainer = createElement(
                'div', {
                    className: EditGlobals.classNames.editSidebarTabContent
                }, {}, tabContainer
            );

            content = new Menu(
                contentContainer,
                {
                    itemsClassName: EditGlobals.classNames.editSidebarMenuItem,
                    items: contentItems
                },
                this.editMode,
                sidebar
            );

            content.initItems(
                isRowCell ? Sidebar.items : Sidebar.itemsGeneralOptions,
                true
            );

            if (isRowCell) {
                buttonsContainer = createElement(
                    'div', {
                        className: (
                            EditGlobals.classNames.editSidebarTabBtnWrapper
                        )
                    }, {}, contentContainer
                );

                saveBtn = EditRenderer.renderButton(
                    buttonsContainer,
                    {
                        value: 'Apply',
                        className: EditGlobals.classNames.editSidebarTabBtn,
                        callback: (): void => {
                            // temp switch
                            if (isComponentSettings) {
                                sidebar.updateComponent();
                            }

                            // @ToDo - only for testing should be refactored
                            // probably the whole save button
                            if (
                                sidebar.context &&
                                sidebar.activeTab &&
                                sidebar.activeTab.content.activeItems &&
                                sidebar.activeTab.content.activeItems[0] &&
                                sidebar.activeTab.content.activeItems[0]
                                    .innerElement
                            ) {
                                let value = (
                                    sidebar.activeTab.content.activeItems[0]
                                        .innerElement as any
                                ).value;

                                if (
                                    sidebar.context.getType() ===
                                    Globals.guiElementType.cell
                                ) {
                                    const ctxCell = sidebar.context as Cell;

                                    value = (
                                        value === 'auto' ?
                                            value :
                                            value + '%'
                                    );
                                    ctxCell.setSize(value);
                                    ctxCell.updateSize(
                                        value,
                                        sidebar.editMode.rwdMode
                                    );
                                }
                            }
                        }
                    }
                );


                cancelBtn = EditRenderer.renderButton(
                    buttonsContainer,
                    {
                        value: 'Cancel',
                        className: EditGlobals.classNames.editSidebarTabBtn,
                        callback: (): void => {
                            sidebar.hide();
                        }
                    }
                );
            }

            sidebar.tabs[tabs[i].type] = {
                element: tabElement,
                options: tabs[i],
                isActive: false,
                contentContainer: contentContainer,
                content: content,
                saveBtn: saveBtn as HTMLDOMElement,
                cancelBtn: cancelBtn as HTMLDOMElement
            };
        }
    }

    private initEvents(): void {
        const sidebar = this;

        // Call onCellResize events in active sidebar items.
        addEvent(sidebar.editMode.board, 'cellResize', function (): void {
            let item;

            if (sidebar.activeTab) {
                for (item of sidebar.activeTab.content.activeItems) {
                    if (
                        item.options.events &&
                        item.options.events.onCellResize
                    ) {
                        item.options.events.onCellResize.apply(item, arguments);
                    }
                }
            }
        });
    }

    public updateTitle(
        text: string
    ): void {
        const sidebar = this;

        if (sidebar.title) {
            sidebar.title.textContent = text;
        }
    }

    public onTabClick(
        tab: Sidebar.Tab
    ): void {
        const sidebar = this;

        if (sidebar.activeTab) {
            sidebar.activeTab.isActive = false;

            // remove previous options
            if (sidebar.componentEditableOptions) {
                sidebar.componentEditableOptions.destroy();
            }

            sidebar.activeTab.element.classList.remove(
                EditGlobals.classNames.editSidebarTabActive
            );
            sidebar.activeTab.contentContainer.style.display = 'none';
        }

        tab.element.classList.add(
            EditGlobals.classNames.editSidebarTabActive
        );

        tab.contentContainer.style.display = 'block';

        sidebar.activeTab = tab;
        tab.isActive = true;

        tab.content.updateActiveItems();
    }

    public show(
        context?: Cell|Row
    ): void {
        const sidebar = this,
            editMode = sidebar.editMode;

        let isRightSidebar = false;

        // hide tabs
        if (sidebar.rowCellTab) {
            sidebar.rowCellTab.classList.remove('current');
        }

        if (sidebar.generalOptionsTab) {
            sidebar.generalOptionsTab.classList.remove('current');
        }

        if (context) {
            // run current tab
            sidebar.update(context);

            if (sidebar.rowCellTab) {
                sidebar.rowCellTab.classList.add('current');
            }
        } else {
            if (sidebar.generalOptionsTab) {
                sidebar.generalOptionsTab.classList.add('current');
            }
        }

        if (!sidebar.isVisible) {
            // detect position of right sidebar
            isRightSidebar = context ? this.detectRightSidebar() : false;

            // apply sidebar init position
            if (isRightSidebar) {
                sidebar.container.classList.add(
                    EditGlobals.classNames.editSidebarRight
                );
            }

            // run showing animation by adding css class
            setTimeout(():void => {
                sidebar.container.classList.add(
                    EditGlobals.classNames[
                        isRightSidebar ?
                            'editSidebarRightShow' : 'editSidebarShow'
                    ]
                );
            }, 0);

            // Disable resizer.
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

            sidebar.isVisible = true;
        }
    }

    public detectRightSidebar(): boolean {

        const editMode = this.editMode;
        const sidebar = editMode.sidebar;
        const layoutWrapper = editMode.board.layoutsWrapper;

        if (sidebar) {
            return GUIElement.getOffsets(
                sidebar.context as Cell,
                layoutWrapper
            ).left < ((layoutWrapper.offsetWidth / 2) - 10); // 10 = snap
        }

        return false;
    }

    public update(
        context: Cell|Row|undefined
    ): void {
        this.context = context;

        // activate first tab.
        this.onTabClick(this.tabs[
            context ? Sidebar.tabs[0].type : Sidebar.tabsGeneralOptions[0].type
        ]);
    }

    public hide(
        showToolbars: boolean = true,
        startContextDetection: boolean = true
    ): void {
        const sidebar = this,
            editMode = sidebar.editMode;

        sidebar.context = void 0;

        // Styles.
        sidebar.container.classList
            .remove(EditGlobals.classNames.editSidebarShow);
        sidebar.container.classList
            .remove(EditGlobals.classNames.editSidebarRight);
        sidebar.container.classList
            .remove(EditGlobals.classNames.editSidebarRightShow);
        editMode.board.container.style.paddingLeft = '';

        // Remove edit overlay if active.
        if (editMode.isEditOverlayActive) {
            editMode.setEditOverlay(true);
        }

        if (editMode.editCellContext) {
            if (showToolbars) {
                editMode.showToolbars(
                    ['cell', 'row'],
                    editMode.editCellContext
                );
                editMode.editCellContext.row.setHighlight();
            }

            // Remove cell highlight if active.
            if (editMode.editCellContext.isHighlighted) {
                editMode.editCellContext.setHighlight(true);
            }
        }

        if (startContextDetection) {
            editMode.isContextDetectionActive = true;
        }

        sidebar.isVisible = false;
    }


    public renderCloseButton(): void {
        const sidebar = this;
        const closeIcon = sidebar.options && sidebar.options.closeIcon;

        sidebar.closeButton = EditRenderer.renderButton(
            sidebar.container,
            {
                className: (
                    EditGlobals.classNames.sidebarNavButton + ' ' +
                    EditGlobals.classNames.sidebarCloseButton
                ),
                callback: (): void => {
                    sidebar.hide();
                },
                icon: closeIcon
            }
        );
    }

    public afterCSSAnimate(
        callback: Function
    ): void {
        const sidebar = this;

        addEvent(sidebar.container, 'transitionend', callback);
        addEvent(sidebar.container, 'oTransitionEnd', callback);
        addEvent(sidebar.container, 'webkitTransitionEnd', callback);
    }

    public getComponentEditableOptions(): void {
        const sidebar = this;
        const lang = this.editMode.lang;
        const cell = (sidebar.context as Cell);
        const currentComponent = cell && cell.mountedComponent;
        const componentSettings = currentComponent &&
            currentComponent.editableOptions.getEditableOptions();

        if (componentSettings) {
            const menuItems = {};
            const items: Array<string> = [];
            const activeTab = sidebar.activeTab;
            const activeTabContainer = activeTab && activeTab.content &&
                activeTab && activeTab.content.container;
            let type;
            let chartTypes = {};

            for (const key in componentSettings) {
                if (componentSettings[key]) {
                    type = componentSettings[key].type;

                    if (key === 'chartType') {
                        const chartTypesEnum = [
                            'column',
                            'line',
                            'scatter',
                            'spline',
                            'pie'
                        ];

                        // eslint-disable-next-line
                        const chartOpts = (currentComponent as HighchartsComponent).options.chartOptions;

                        const chartType = chartOpts &&
                            (
                                (chartOpts.chart && chartOpts.chart.type) ||
                                (chartOpts.series && chartOpts.series[0].type)
                            );

                        if (
                            chartType &&
                            chartTypesEnum.indexOf(chartType) !== -1
                        ) {
                            chartTypes = {
                                items: chartTypesEnum,
                                value: chartType
                            };
                        } else {
                            break;
                        }
                    }

                    (menuItems as any)[key] = {
                        id: key,
                        type: type === 'text' ? 'input' : type,
                        text: (lang as any)[key] || key,
                        isActive: true,
                        value: componentSettings[key].value,
                        ...chartTypes
                    };

                    items.push(
                        key
                    );
                }
            }

            // remove previous options
            if (sidebar.componentEditableOptions) {
                sidebar.componentEditableOptions.destroy();
            }

            sidebar.componentEditableOptions = new Menu(
                activeTabContainer as HTMLDOMElement,
                {
                    itemsClassName: EditGlobals.classNames.editSidebarMenuItem,
                    items: items
                },
                this.editMode,
                sidebar
            );

            sidebar.componentEditableOptions.initItems(
                menuItems,
                true
            );

            sidebar.componentEditableOptions.currentElementId = cell.id;
        }
    }

    public getComponents(): void {
        const sidebar = this;
        const activeTab = this.activeTab;
        const tabContainer = activeTab && activeTab.contentContainer;
        const components = Sidebar.components;

        let gridElement;

        if (activeTab && activeTab.listComponent) {
            return;
        }

        // TEMP reset tab content, Menu creates extra div, when addComponent,
        // addLayout or componentSettings
        if (activeTab) {
            activeTab.contentContainer.innerHTML = '';
        }

        if (tabContainer) {
            tabContainer.classList.add(EditGlobals.classNames.editGridItems);
        }

        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            gridElement = createElement(
                'div',
                {},
                {},
                tabContainer
            );

            // Drag drop new component.
            (gridElement.onmousedown as any) = (e: PointerEvent): void => {
                if (sidebar.editMode.dragDrop) {
                    sidebar.hide(false, true);
                    sidebar.editMode.dragDrop.onDragStart(
                        e,
                        void 0,
                        (dropContext: Cell|Row): void => {
                            const newCell =
                                components[i].onDrop(sidebar, dropContext);

                            if (newCell) {
                                sidebar.editMode.setEditCellContext(newCell);
                                sidebar.show(newCell);
                            }
                        }
                    );
                }
            };
            gridElement.innerHTML = components[i].text;
        }

        if (this.activeTab) {
            this.activeTab.listComponent = true;
        }

    }

    public getLayoutOptions(): void {
        if (this.activeTab) {
            this.activeTab.contentContainer.innerHTML = 'layouts options';
        }
    }

    public updateComponent(): void {
        const activeTab = this.activeTab;
        const formFields = activeTab &&
            activeTab.contentContainer.querySelectorAll(
                'input, textarea'
            ) || [];
        const chartType = activeTab &&
            activeTab.contentContainer.querySelectorAll('#chartType');
        const updatedSettings = {};
        const mountedComponent = (this.context as Cell).mountedComponent;
        let fieldId;

        for (let i = 0, iEnd = formFields.length; i < iEnd; ++i) {
            fieldId = formFields[i].getAttribute('id');

            if (fieldId) {
                try {
                    (updatedSettings as any)[fieldId] = JSON.parse(
                        (formFields[i] as HTMLTextAreaElement).value
                    );

                    if (
                        fieldId === 'chartOptions' &&
                        (updatedSettings as HighchartsComponent.ComponentOptions).chartOptions && // eslint-disable-line
                        chartType &&
                        chartType[0]
                    ) {
                        (updatedSettings as HighchartsComponent.ComponentOptions).chartOptions = // eslint-disable-line
                            merge(
                                (updatedSettings as HighchartsComponent.ComponentOptions).chartOptions, // eslint-disable-line
                                {
                                    chart: {
                                        type: (chartType[0] as any).value
                                    }
                                }
                            );
                    }
                } catch {
                    (updatedSettings as any)[fieldId] =
                        (formFields[i] as (HTMLInputElement)).value;
                }
            }
        }

        if (mountedComponent) {
            mountedComponent.update(updatedSettings);
        }
    }

    public onDropNewComponent(
        dropContext: Cell|Row,
        componentOptions: Bindings.ComponentOptions
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

    // Get width from options or calculate it.
    private getCellWidth(
        cell: Cell
    ): number | string {
        const sidebar = this,
            currentRwdMode = sidebar.editMode.rwdMode,
            cellRwd = (cell.options.responsive || {})[currentRwdMode],
            definedWidth = cellRwd && cellRwd.width || cell.options.width;

        if (definedWidth && definedWidth !== 'auto') {
            const percentageValue = GUIElement.getPercentageWidth(definedWidth);

            if (percentageValue) {
                return Math.round(parseFloat(percentageValue) * 100) / 100;
            }
        }

        return 'auto';
    }

    private getWidthGridOptions(): void {
        const sidebar = this;
        const activeTab = sidebar.activeTab;
        const activeTabContainer =
            activeTab && activeTab.content && activeTab.content.container;
        const predefinedWidth = Sidebar.predefinedWidth;
        const item = activeTab && activeTab.content.activeItems[0];

        if (activeTab) {
            if (activeTab.customFields) {
                return;
            }

            activeTab.customFields = [];
        }

        const gridWrapper = createElement(
            'div', {
                className: EditGlobals.classNames.editGridItems
            },
            {},
            activeTabContainer
        );

        for (let i = 0, iEnd = predefinedWidth.length; i < iEnd; ++i) {
            const predefinedBtnWidth = createElement(
                'div', {
                    textContent: predefinedWidth[i].name,
                    onclick: function (): void {
                        if (item) {
                            (item.innerElement as any).value =
                                predefinedWidth[i].value;
                        }
                    }
                },
                {},
                gridWrapper
            );

            if (activeTab && activeTab.customFields) {
                activeTab.customFields.push({
                    name: predefinedWidth[i].name,
                    graphic: predefinedBtnWidth
                });
            }
        }
    }
}

interface Sidebar {
    dragDropButton?: HTMLDOMElement;
    closeButton?: HTMLDOMElement;
    componentEditableOptions?: any;
}
namespace Sidebar {
    export interface Options {
        enabled: boolean;
        className: string;
        dragIcon: string;
        closeIcon: string;
    }

    export interface TabOptions {
        type: string;
        icon: string;
        items: Record<string, Array<string>>;
    }

    export interface Tab {
        element: HTMLDOMElement;
        options: TabOptions;
        isActive: boolean;
        content: Menu;
        contentContainer: HTMLDOMElement;
        saveBtn: HTMLDOMElement;
        cancelBtn?: HTMLDOMElement;
        listComponent?: boolean;
        customFields?: Array<unknown>;
    }

    export interface AddComponentDetails {
        text: string;
        onDrop: Function;
    }

    export interface PredefinedWidth {
        name: string;
        value: string;
        icon: string;
    }
}

export default Sidebar;
