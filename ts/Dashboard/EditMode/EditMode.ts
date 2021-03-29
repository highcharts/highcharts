import U from '../../Core/Utilities.js';
import Dashboard from './../Dashboard.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import type { CSSJSONObject } from './../../Data/DataCSSObject';
import EditRenderer from './EditRenderer.js';

const {
    merge,
    css
} = U;

class EditMode {
    /* *
    *
    *  Static Properties
    *
    * */

    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        dashboard: Dashboard,
        options: EditMode.Options
    ) {
        this.options = options;
        this.dashboard = dashboard;
        this.lang = merge({}, EditGlobals.lang, options.lang);

        // Init renderer.
        this.renderer = new EditRenderer(this);

        if (this.options.contextMenu.enabled) {
            this.contextButtonElement = this.renderer.renderContextButton();
        }
    }

    /* *
    *
    *  Properties
    *
    * */

    private active: boolean = false;
    public options: EditMode.Options;
    public dashboard: Dashboard;
    public contextButtonElement?: HTMLDOMElement;
    public contextMenu?: EditMode.ContextMenu;
    public lang: EditGlobals.LangOptions;
    public renderer: EditRenderer;

    public menuItems: Record<EditGlobals.TLangKeys, EditMode.MenuItemOptions> = {
        separator: {
            type: 'separator',
            text: '',
            className: EditGlobals.classNames.separator
        },
        editMode: {
            type: 'editMode',
            className: EditGlobals.classNames.editModeEnabled,
            text: 'Edit mode',
            events: {
                click: function (this: EditMode, e: any): void {
                    this.onEditModeToggle(e.target);
                }
            }
        },
        saveLocal: {
            type: 'saveLocal',
            className: EditGlobals.classNames.saveLocalItem,
            text: 'Save locally',
            events: {
                click: function (): void {}
            }
        }
    }

    /* *
    *
    *  Functions
    *
    * */

    public onContextBtnClick(
        editMode: EditMode
    ): void {
        // Init dropdown if doesn't exist.
        if (!editMode.contextMenu) {
            editMode.initContextMenu();
        }

        // Show context menu.
        if ((editMode.contextMenu || {}).isOpen) {
            editMode.closeContextMenu();
        } else {
            editMode.openContextMenu();
        }

    }

    public initContextMenu(): void {
        const editMode = this,
            contextButtonElement = editMode.contextButtonElement,
            menuItemsOptions = editMode.options.contextMenu.menuItems || [],
            menuItems = [];

        if (contextButtonElement) {
            // Render menu container.
            const element = editMode.renderer.renderContextMenu(contextButtonElement);

            // Render menu items.
            for (let i = 0, iEnd = menuItemsOptions.length; i < iEnd; ++i) {
                menuItems.push(
                    editMode.renderer.renderMenuItem(
                        menuItemsOptions[i],
                        element
                    )
                );
            }

            editMode.contextMenu = {
                element: element,
                isOpen: false,
                menuItems: menuItems
            };
        }
    }

    public openContextMenu(): void {
        const editMode = this;

        if (editMode.contextMenu) {
            css(editMode.contextMenu.element, {
                display: 'block'
            });
            editMode.contextMenu.isOpen = true;
        }
    }

    public closeContextMenu(): void {
        const editMode = this;

        if (editMode.contextMenu) {
            css(editMode.contextMenu.element, {
                display: 'none'
            });
            editMode.contextMenu.isOpen = false;
        }
    }

    public onEditModeToggle(btnElement: HTMLDOMElement): void {
        const editMode = this;

        if (editMode.active) {
            editMode.deactivateEditMode(btnElement);
        } else {
            editMode.activateEditMode(btnElement);
        }
    }

    public activateEditMode(
        btnElement?: HTMLDOMElement
    ): void {
        const editMode = this;

        editMode.active = true;

        // Temp solution.
        if (btnElement) {
            css(btnElement, {
                color: 'rgb(49 216 71)'
            });
        }

        // Set edit mode active class to dashboard.
        editMode.dashboard.container.className +=
            EditGlobals.classNames.editModeEnabled;
    }

    public deactivateEditMode(
        btnElement?: HTMLDOMElement
    ): void {
        const editMode = this,
            dashboardCnt = editMode.dashboard.container,
            dashboardCntClasses = dashboardCnt ?
                dashboardCnt.className.split(' ') : [],
            newClasses = [];

        let oneClass;

        editMode.active = false;

        // Temp solution.
        if (btnElement) {
            css(btnElement, {
                color: '#555'
            });
        }

        // Remove edit mode active class in dashboard.
        for (let i = 0, iEnd = dashboardCntClasses.length; i < iEnd; ++i) {
            oneClass = dashboardCntClasses[i];

            if (oneClass !== EditGlobals.classNames.editModeEnabled) {
                newClasses.push(oneClass);
            }
        }
        dashboardCnt.className = newClasses.join(' ');
    }
}

namespace EditMode {
    export interface Options {
        enabled: boolean;
        contextMenu: ContextMenuOptions;
        lang?: EditGlobals.LangOptions|string;
    }

    export interface ContextMenuOptions {
        enabled: true;
        menuItems: Array<MenuItemOptions>;
    }

    export interface ContextMenu {
        element: HTMLDOMElement;
        isOpen: boolean;
        menuItems: Array<HTMLDOMElement>;
    }

    export interface MenuItemOptions {
        type?: EditGlobals.TLangKeys;
        text?: string;
        className?: string;
        events?: Record<Event['type'], Function>;
        style?: CSSJSONObject;
    }
}

export default EditMode;
