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
    protected static readonly defaultOptions: EditMode.Options = {
        enabled: true,
        contextMenu: {
            enabled: true,
            iconURL: 'https://code.highcharts.com/@product.version@/gfx/dashboard-icons/menu.svg',
            menuItems: ['saveLocal', 'separator', 'editMode']
        }
    }

    public static menuItems: Record<EditGlobals.TLangKeys, EditMode.MenuItemOptions> = {
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
    *  Constructor
    *
    * */
    constructor(
        dashboard: Dashboard,
        options: EditMode.Options|undefined
    ) {
        this.options = merge(EditMode.defaultOptions, options || {});
        this.dashboard = dashboard;
        this.lang = merge({}, EditGlobals.lang, this.options.lang);

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
            editMode.setVisibleContextMenu(false);
        } else {
            editMode.setVisibleContextMenu(true);
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

    public setVisibleContextMenu(visible: boolean): void {
        const editMode = this;

        if (editMode.contextMenu) {
            if (visible) {
                editMode.contextMenu.element.style.display = 'block';
                editMode.contextMenu.isOpen = true;
            } else {
                editMode.contextMenu.element.style.display = 'none';
                editMode.contextMenu.isOpen = false;
            }
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
            css(btnElement, { color: 'rgb(49 216 71)' });
        }

        // Set edit mode active class to dashboard.
        editMode.dashboard.container.classList.add(
            EditGlobals.classNames.editModeEnabled
        );
    }

    public deactivateEditMode(
        btnElement?: HTMLDOMElement
    ): void {
        const editMode = this,
            dashboardCnt = editMode.dashboard.container;

        editMode.active = false;

        // Temp solution.
        if (btnElement) {
            css(btnElement, { color: '#555' });
        }

        dashboardCnt.classList.remove(
            EditGlobals.classNames.editModeEnabled
        );
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
        iconURL: string;
        menuItems: Array<MenuItemOptions|EditGlobals.TLangKeys>;
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
