import EditMode from '../EditMode.js';
import U from '../../../Core/Utilities.js';
import Cell from '../../Layout/Cell.js';
import Row from '../../Layout/Row.js';
import Layout from '../../Layout/Layout.js';
import EditGlobals from '../EditGlobals.js';
import Menu from '../Menu/Menu.js';
import type MenuItem from '../Menu/MenuItem.js';
import DashboardGlobals from '../../DashboardGlobals.js';
import { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType.js';

const {
    merge,
    createElement,
    css
} = U;

class OptionsToolbar extends Menu {
    /* *
    *
    *  Static Properties
    *
    * */
    protected static readonly defaultOptions: OptionsToolbar.Options = {
        enabled: true,
        items: ['t1', 't2']
    }

    public static tabs: Array<OptionsToolbar.TabOptions> = [{
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
        const toolbarSettingsOptions =
            (editMode.options.toolbars || {}).settings;

        super(
            editMode.dashboard.container,
            merge(
                OptionsToolbar.defaultOptions,
                toolbarSettingsOptions
            )
        );

        this.tabs = {};
        this.editMode = editMode;

        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptions
            );
        }

        this.renderTitle();
        this.initTabs();

        super.initItems(OptionsToolbar.items);
    }

    /* *
    *
    *  Properties
    *
    * */
    public guiElement?: Cell|Row|Layout;
    public editMode: EditMode;
    public tabs: Record<string, OptionsToolbar.Tab>;
    public activeTab?: OptionsToolbar.Tab;

    /* *
    *
    *  Functions
    *
    * */

    private renderTitle(): void {
        const toolbar = this;

        createElement(
            'div', {
                className: EditGlobals.classNames.editToolbarOptionsTitle,
                textContent: 'Cell Options' // shoudl be dynamic
            }, {}, toolbar.container
        );
    }

    private initTabs(): void {
        const toolbar = this,
            tabs = OptionsToolbar.tabs;

        const container = createElement(
            'div', {
                className: EditGlobals.classNames.editToolbarOptionsTabsContainer
            }, {}, toolbar.container
        );


        let tabElement;

        for (let i = 0, iEnd = tabs.length; i < iEnd; ++i) {
            tabElement = createElement(
                'div', {
                    className: EditGlobals.classNames.editToolbarOptionsTab,
                    textContent: tabs[i].type,
                    onclick: function (): void {
                        toolbar.onTabClick(toolbar.tabs[tabs[i].type]);
                    }
                }, {}, container
            );

            toolbar.tabs[tabs[i].type] = {
                element: tabElement,
                options: tabs[i],
                isActive: false
            };
        }
    }

    public onTabClick(
        tab: OptionsToolbar.Tab
    ): void {
        const toolbar = this;

        if (toolbar.activeTab) {
            toolbar.activeTab.isActive = false;
            toolbar.activeTab.element.classList.remove(
                EditGlobals.classNames.editToolbarOptionsTabActive
            );
        }

        tab.element.classList.add(
            EditGlobals.classNames.editToolbarOptionsTabActive
        );

        toolbar.activeTab = tab;
        tab.isActive = true;

        toolbar.updateActiveItems(tab.options.items);
    }

    public showOptions(tools: Array<string>): void {
        // activate first tab.
        this.onTabClick(this.tabs[OptionsToolbar.tabs[0].type]);

        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptionsShow
            );

            // set margin on all layouts in dashboard to avoid overlap
            this.reserveToolbarSpace();
        }

        // set margin on layouts
    }

    public hide(): void {
        if (this.container) {
            this.container.classList.add(
                EditGlobals.classNames.editToolbarOptionsHide
            );

            this.removeToolbarSpace();
        }
        this.guiElement = void 0;
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
            DashboardGlobals.classNames.layout
        );

        for (let i = 0, iEnd = layouts.length; i < iEnd; ++i) {
            layouts[i].classList.remove(
                EditGlobals.classNames.layoutToolbarSpace
            );
        }
    }
}

namespace OptionsToolbar {
    export interface Options extends Menu.Options {}

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

export default OptionsToolbar;
