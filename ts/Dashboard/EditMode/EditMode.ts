import U from '../../Core/Utilities.js';
import Dashboard from './../Dashboard.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import type { CSSJSONObject } from './../../Data/DataCSSObject';
import EditRenderer from './EditRenderer.js';
import Resizer from './../Actions/Resizer.js';
import type Layout from './../Layout/Layout.js';
import CellEditToolbar from './Toolbars/CellToolbar.js';
import RowEditToolbar from './Toolbars/RowToolbar.js';
import OptionsToolbar from './Toolbars/OptionsToolbar.js';

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
    public cellToolbar?: CellEditToolbar;
    public rowToolbar?: RowEditToolbar;
    public optionsToolbar?: OptionsToolbar;

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
        const editMode = this,
            dashboard = editMode.dashboard;

        editMode.active = true;

        let layout;

        // Init resizers.
        for (let i = 0, iEnd = dashboard.layouts.length; i < iEnd; ++i) {
            layout = dashboard.layouts[i];

            if (!layout.resizer) {
                editMode.initLayoutResizer(layout);
            }
        }

        // Init cellToolbar.
        if (!editMode.cellToolbar) {
            editMode.cellToolbar = new CellEditToolbar(editMode);
        }

        // Init rowToolbar.
        if (!editMode.rowToolbar) {
            editMode.rowToolbar = new RowEditToolbar(editMode);
        }

        // Init optionsToolbar.
        if (!editMode.optionsToolbar) {
            editMode.optionsToolbar = new OptionsToolbar(editMode);
        }

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

        // Hide toolbars.
        if (editMode.cellToolbar) {
            editMode.cellToolbar.hide();
        }
    }

    private initLayoutResizer(layout: Layout): void {
        const dashboard = this.dashboard,
            guiOptions = dashboard.options.gui;

        if (guiOptions) {
            if (guiOptions.layoutOptions.resize) {
                layout.resizer = new Resizer(layout);
            } else if (guiOptions.layoutOptions.resizerJSON) {
                layout.resizer = Resizer.fromJSON(
                    layout, guiOptions.layoutOptions.resizerJSON
                );
            }
        }
    }

    public isActive(): boolean {
        return this.active;
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
