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
import EditRenderer from './EditRenderer.js';

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
        closeIcon: EditGlobals.iconsURL + '/close.svg',
        menu: {
            itemsClassName: EditGlobals.classNames.editSidebarMenuItem,
            items: ['cellWidth', 'rowHeight', 't1', 't2', 'componentSettings']
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
            cell: ['componentSettings'],
            row: ['t2']
        }
    }]

    public static items: Record<string, MenuItem.Options> =
    merge(Menu.items, {
        t1: {
            type: 't1',
            text: 'tool1',
            events: {
                load: function (): void {
                    console.log('aaa');
                },
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
        componentSettings: {
            type: 'componentSettings',
            text: 'Component settings',
            events: {
                update: function (): void {
                    ((this as MenuItem).menu.parent as Sidebar).getComponentEditableOptions();
                }
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
                        item.innerElement.tagName === 'INPUT' &&
                        (item.innerElement as any).value !== cell.container.offsetWidth
                    ) {
                        (item.innerElement as any).value = cell.container.offsetWidth;
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
                        item.innerElement.tagName === 'INPUT' &&
                        (item.innerElement as any).value !== row.container.offsetHeight
                    ) {
                        (item.innerElement as any).value = row.container.offsetHeight;
                    }
                },
                onCellResize: function (this: MenuItem, e: any): void {
                    if (this.options.events && this.options.events.update) {
                        this.options.events.update.apply(this, arguments);
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
        this.isDragged = false;
        this.options = merge(
            Sidebar.defaultOptions,
            (editMode.options.toolbars || {}).settings
        );
        this.editMode = editMode;

        this.container = this.renderContainer();

        this.renderCloseButton();
        this.renderDragDropButton();
        this.renderTitle();
        this.initTabs();

        this.menu = new Menu(
            this.container,
            this.options.menu,
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
    public isDragged: boolean;

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

        sidebar.title = createElement(
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

        // Call onCellResize events in active sidebar items.
        addEvent(sidebar.editMode.dashboard, 'cellResize', function (): void {
            let item;

            for (let i = 0, iEnd = sidebar.menu.activeItems.length; i < iEnd; ++i) {
                item = sidebar.menu.activeItems[i];

                if (item.options.events && item.options.events.onCellResize) {
                    item.options.events.onCellResize.apply(item, arguments);
                }
            }
        });

        // Add sidebar drag drop events.
        addEvent(document, 'mousemove', sidebar.onDrag.bind(sidebar));
        addEvent(document, 'mouseup', sidebar.onDragEnd.bind(sidebar));
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
                this.container.style.left = '0px';
                this.container.style.top = '0px';
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

        if (this.editMode.cellToolbar) {
            this.editMode.cellToolbar.resetEditedCell();
        }

        if (this.editMode.rowToolbar) {
            this.editMode.rowToolbar.resetEditedRow();
        }

        this.isVisible = false;
        this.guiElement = void 0;
    }


    public renderCloseButton(): void {
        const sidebar = this;
        const closeIcon = sidebar.options && sidebar.options.closeIcon;

        sidebar.closeButton = EditRenderer.renderButton(
            sidebar.container,
            {
                className: EditGlobals.classNames.sidebarNavButton,
                callback: (): void => {
                    sidebar.hide();
                },
                icon: closeIcon
            }
        );
    }

    public renderDragDropButton(): void {
        const sidebar = this;
        const dragIcon = sidebar.options && sidebar.options.dragIcon;

        sidebar.dragDropButton = EditRenderer.renderButton(
            sidebar.container,
            {
                className: EditGlobals.classNames.sidebarNavButton,
                style: {
                    cursor: 'grab'
                },
                icon: dragIcon
            }
        ) as HTMLDOMElement;

        sidebar.dragDropButton.onmousedown = sidebar.onDragStart.bind(sidebar);
        sidebar.dragDropButton.onmouseup = sidebar.onDragEnd.bind(sidebar);
    }

    public onDragStart(): void {
        this.isDragged = true;

        if (this.dragDropButton) {
            this.dragDropButton.style.cursor = 'grabbing';
        }
    }

    public onDrag(e: any): void {
        if (this.isDragged) {
            const cntStyle = this.container.style;

            this.container.style.left = +cntStyle.left.substring(0, cntStyle.left.length - 2) +
                e.movementX + 'px';
            this.container.style.top = +cntStyle.top.substring(0, cntStyle.top.length - 2) +
                e.movementY + 'px';
        }
    }

    public onDragEnd(): void {
        if (this.isDragged) {
            this.isDragged = false;

            if (this.dragDropButton) {
                this.dragDropButton.style.cursor = 'grab';
            }
        }
    }

    /**
     * currently for the future, remove when not use, 
     */
    public afterCSSAnimate(
        element: HTMLDOMElement,
        callback: Function
    ): void {
        addEvent(element, 'transitionend', callback);
        addEvent(element, 'oTransitionEnd', callback);
        addEvent(element, 'webkitTransitionEnd', callback);
    }

    public getComponentEditableOptions(): void {
        const sidebar = this;
        const currentComponent = (sidebar.context as Cell).mountedComponent;
        const componentSettings = currentComponent && currentComponent.editableOptions.getEditableOptions();

        if (componentSettings) {
            let menuItems = {};
            let items = [];
            let type, key;

            // temp parser
            for (let i = 0, iEnd = componentSettings.length; i < iEnd; ++i) {
                key = Object.getOwnPropertyNames(componentSettings[i])[0];
                type = (componentSettings[i] as any)[key];

                console.log(componentSettings[i], (componentSettings[i] as any)[key]);

                (menuItems as any)[key] = {
                    id: key,
                    type: type === 'text' ? 'input' : type,
                    text: key,
                    isActive: true
                }

                items.push(
                    key
                )
            }

            sidebar.componentEditableOptions = new Menu(
                sidebar.container,
                {
                    items: items
                },
                sidebar
            );
            

            sidebar.componentEditableOptions.initItems(
                menuItems
            );

        }
        // list editable options
        /*if (componentSettings) {
            for (var key in componentSettings) {
                switch((componentSettings[key] || {}).type) {
                    case 'text':
                        EditRenderer.renderInput(
                            sidebar.container,
                            {
                                title: Object.getOwnPropertyNames(componentSettings[key])[0]
                            }
                        );
                        break;
                    case 'textarea':
                        EditRenderer.renderTextarea(
                            sidebar.container
                        );
                        break;
                    case 'toggle':
                        EditRenderer.renderSwitcher(
                            sidebar.container
                        );
                        break;
                    default:
                        EditRenderer.renderInput(
                            sidebar.container,
                            {
                                title: Object.getOwnPropertyNames(componentSettings[key])[0]
                            }
                        );
                }
            }
        }*/
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
        menu: Menu.Options;
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
    }
}

export default Sidebar;
