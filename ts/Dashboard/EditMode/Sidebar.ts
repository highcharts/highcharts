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
import WindbarbPoint from '../../Series/Windbarb/WindbarbPoint.js';

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
            items: ['t1', 't2']
        }
    }

    public static tabs: Array<Sidebar.TabOptions> = [{
        type: 'design',
        icon: '',
        items: ['t1']
    }, {
        type: 'data',
        icon: '',
        items: ['t2']
    }, {
        type: 'component',
        icon: '',
        items: ['t1', 't2']
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
            )
        );

        this.menu.initItems(Sidebar.items);
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

        const titleElement = sidebar.title = createElement(
            'div', {
                className: EditGlobals.classNames.editSidebarTitle,
                textContent: 'Cell Options' // shoudl be dynamic
            }, {}, sidebar.container
        );

        // set default offset top, when cell or row is lower
        const offsetTop = titleElement.getBoundingClientRect().top;

        if (window.pageYOffset > offsetTop) {
            titleElement.style.marginTop = window.pageYOffset - offsetTop + 'px';
        } else {
            titleElement.style.marginTop = '0px';
        }

        // add sticky position
        addEvent(window, 'scroll', function (): void {
            const containerOffsetTop = window.pageYOffset - offsetTop;

            if (window.pageYOffset >= offsetTop) {
                titleElement.style.marginTop = containerOffsetTop + 'px';
            } else {
                titleElement.style.marginTop = '0px';
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
            sidebar.activeTab.element.classList.remove(
                EditGlobals.classNames.editSidebarTabActive
            );
        }

        tab.element.classList.add(
            EditGlobals.classNames.editSidebarTabActive
        );

        sidebar.activeTab = tab;
        tab.isActive = true;

        sidebar.menu.updateActiveItems(tab.options.items);
    }

    public show(): void {
        if (this.container) {
            // activate first tab.
            this.onTabClick(this.tabs[Sidebar.tabs[0].type]);

            if (!this.isVisible) {
                this.container.classList.add(
                    EditGlobals.classNames.editSidebarShow
                );
                this.isVisible = true;

                // set margin on all layouts in dashboard to avoid overlap
                this.reserveToolbarSpace();

                // Hide row and cell toolbars.
                this.editMode.hideToolbars(['cell', 'row']);
            }
        }
    }

    public hide(): void {
        if (this.container) {
            this.container.classList.remove(
                EditGlobals.classNames.editSidebarShow
            );

            this.isVisible = false;
            this.removeToolbarSpace();
            this.guiElement = void 0;
        }
    }

    private reserveToolbarSpace(): void {
        const layouts = this.editMode.dashboard.container.querySelectorAll(
            '.' + DashboardGlobals.classNames.layout
        );

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].classList.add(
                EditGlobals.classNames.layoutToolbarSpace
            );
        }
    }

    private removeToolbarSpace(): void {
        const layouts = this.editMode.dashboard.container.querySelectorAll(
            '.' + DashboardGlobals.classNames.layout
        );

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].classList.remove(
                EditGlobals.classNames.layoutToolbarSpace
            );
        }
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
        items: Array<string>;
    }

    export interface Tab {
        element: HTMLDOMElement;
        options: TabOptions;
        isActive: boolean;
    }
}

export default Sidebar;
