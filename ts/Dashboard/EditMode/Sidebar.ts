import EditMode from './EditMode.js';
import U from '../../Core/Utilities.js';
import Cell from '../Layout/Cell.js';
import Row from '../Layout/Row.js';
import Layout from '../Layout/Layout.js';
import EditGlobals from './EditGlobals.js';
import Menu from './Menu/Menu.js';
import type MenuItem from './Menu/MenuItem.js';
import DashboardGlobals from '../DashboardGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';

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
        menu: {
            itemsClassName: EditGlobals.classNames.editSidebarMenuItem,
            items: ['cellWidth', 'rowHeight', 't1', 't2']
        }
    }

    public static tabs: Array<Sidebar.TabOptions> = [{
        type: 'design',
        icon: '',
        items: {
            cell: ['cellWidth'],
            row: ['rowHeight']
        }
    }, {
        type: 'data',
        icon: '',
        items: {
            cell: ['t2'],
            row: ['t1']
        }
    }, {
        type: 'component',
        icon: '',
        items: {
            cell: ['t1', 't2'],
            row: ['t2']
        }
    }]

    public static items: Record<string, MenuItem.Options> =
    merge(Menu.items, {
        t1: {
            type: 't1',
            text: 'tool1',
            events: {
                click: function (): void {}
            }
        },
        t2: {
            type: 't2',
            text: 'tool2',
            events: {
                click: function (): void {}
            }
        },
        cellWidth: {
            id: 'cellWidth',
            type: 'input',
            text: 'Cell width',
            events: {
                click: function (this: MenuItem, input: HTMLDOMElement, e: any): void {
                    const inputValue = +(input as any).value,
                        cell = this.menu.parent.context;

                    if (cell.getType() === DashboardGlobals.guiElementType.cell) {
                        cell.setSize({ width: inputValue });
                    }
                },
                update: function (this: MenuItem, e: any): void {
                    const item = this,
                        cell = this.menu.parent.context;

                    if (
                        cell.getType() === DashboardGlobals.guiElementType.cell &&
                        cell.container &&
                        item.innerElement &&
                        item.innerElement.tagName === 'INPUT'
                    ) {
                        (item.innerElement as any).value = cell.container.offsetWidth;
                    }
                }
            }
        },
        rowHeight: {
            id: 'rowHeight',
            type: 'input',
            text: 'Row height',
            events: {
                click: function (this: MenuItem, input: HTMLDOMElement, e: any): void {
                    const inputValue = +(input as any).value,
                        row = this.menu.parent.context;

                    if (row.getType() === DashboardGlobals.guiElementType.row) {
                        row.setSize(inputValue);
                    }
                },
                update: function (this: MenuItem, e: any): void {
                    const item = this,
                        row = this.menu.parent.context;

                    if (
                        row.getType() === DashboardGlobals.guiElementType.row &&
                        row.container &&
                        item.innerElement &&
                        item.innerElement.tagName === 'INPUT'
                    ) {
                        (item.innerElement as any).value = row.container.offsetHeight;
                    }
                }
            }
        }
    })

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
        this.options = (editMode.options.toolbars || {}).settings;
        this.editMode = editMode;

        this.container = this.renderContainer();

        this.renderTitle();
        this.initTabs();

        this.menu = new Menu(
            this.container,
            merge(
                Sidebar.defaultOptions.menu,
                (this.options || {}).menu
            ),
            this
        );

        this.menu.initItems(Sidebar.items);
        this.initEvents();
    }

    /* *
    *
    *  Properties
    *
    * */
    public guiElement?: Cell|Row|Layout;
    public container: HTMLDOMElement;
    public options?: Sidebar.Options;
    public isVisible: boolean;
    public editMode: EditMode;
    public title?: HTMLDOMElement;
    public tabs: Record<string, Sidebar.Tab>;
    public activeTab?: Sidebar.Tab;
    public menu: Menu;
    public context?: Cell|Row;

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
            sidebar.editMode.dashboard.container
        );
    }

    private renderTitle(): void {
        const sidebar = this;
        const sidebarContainer = this.container;

        const titleElement = sidebar.title = createElement(
            'div', {
                className: EditGlobals.classNames.editSidebarTitle,
                textContent: 'Cell Options' // shoudl be dynamic
            }, {}, sidebar.container
        );

        // set default offset top, when cell or row is lower
        const offsetTop = sidebarContainer.getBoundingClientRect().top;

        if (window.pageYOffset > offsetTop) {
            sidebarContainer.style.marginTop = window.pageYOffset - offsetTop + 'px';
        } else {
            sidebarContainer.style.marginTop = '0px';
        }

        // add sticky position
        addEvent(window, 'scroll', function (): void {
            const containerOffsetTop = window.pageYOffset - offsetTop;

            if (window.pageYOffset >= offsetTop) {
                sidebarContainer.style.marginTop = containerOffsetTop + 'px';
            } else {
                sidebarContainer.style.marginTop = '0px';
            }
        });
    }

    private initTabs(): void {
        const sidebar = this,
            tabs = Sidebar.tabs;

        const container = createElement(
            'div', {
                className: EditGlobals.classNames.editSidebarTabsContainer
            }, {}, sidebar.container
        );


        let tabElement;

        for (let i = 0, iEnd = tabs.length; i < iEnd; ++i) {
            tabElement = createElement(
                'div', {
                    className: EditGlobals.classNames.editSidebarTab,
                    textContent: tabs[i].type,
                    onclick: function (): void {
                        sidebar.onTabClick(sidebar.tabs[tabs[i].type]);
                    }
                }, {}, container
            );

            sidebar.tabs[tabs[i].type] = {
                element: tabElement,
                options: tabs[i],
                isActive: false
            };
        }
    }

    private initEvents(): void {
        const sidebar = this;

        // Hide row and cell toolbars when mouse on sidebar.
        addEvent(sidebar.container, 'mouseenter', (event): void => {
            if (sidebar.isVisible) {
                sidebar.editMode.hideToolbars(['row', 'cell']);
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
        const sidebar = this,
            contextType = sidebar.context && sidebar.context.getType();

        if (contextType) {
            if (sidebar.activeTab) {
                sidebar.activeTab.isActive = false;
                sidebar.activeTab.element.classList.remove(
                    EditGlobals.classNames.editSidebarTabActive
                );
            }

            tab.element.classList.add(
                EditGlobals.classNames.editSidebarTabActive
            );

            sidebar.activeTab = tab;
            tab.isActive = true;

            sidebar.menu.updateActiveItems(tab.options.items[contextType]);
        }
    }

    public show(
        context?: Cell|Row
    ): void {
        const sidebar = this;

        if (context) {

            this.update(context);

            if (!this.isVisible) {
                this.container.classList.add(
                    EditGlobals.classNames.editSidebarShow
                );
                this.isVisible = true;

                // Hide row and cell toolbars.
                this.editMode.hideToolbars(['cell', 'row']);
            }
        }
    }

    public update(
        context: Cell|Row
    ): void {
        this.context = context;

        // activate first tab.
        this.onTabClick(this.tabs[Sidebar.tabs[0].type]);
    }

    public hide(): void {
        this.context = void 0;

        this.container.classList.remove(
            EditGlobals.classNames.editSidebarShow
        );

        this.isVisible = false;
        this.guiElement = void 0;
    }

    public afterCSSAnimate(
        element: HTMLDOMElement,
        callback: Function
    ): void {
        addEvent(element, 'transitionend', callback);
        addEvent(element, 'oTransitionEnd', callback);
        addEvent(element, 'webkitTransitionEnd', callback);
    }
}

namespace Sidebar {
    export interface Options {
        enabled: boolean;
        className: string;
        menu: Menu.Options;
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
    }
}

export default Sidebar;
