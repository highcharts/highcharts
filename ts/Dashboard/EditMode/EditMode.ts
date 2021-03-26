import U from '../../Core/Utilities.js';
import Dashboard from './../Dashboard.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes.js';
import CSSObject from '../../Core/Renderer/CSSObject.js';

const {
    merge,
    createElement,
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

        if (this.options.contextMenu.enabled) {
            this.renderContextButton();
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

    public menuItems: Record<string, EditMode.MenuItem> = {
        separator: {
            element: 'div',
            attribs: {
                className: EditGlobals.separator,
                textContent: ''
            },
            styles: {
                backgroundColor: '#eee',
                height: '1px',
                margin: '5px 0px 5px 0px',
                padding: '0px',
                cursor: 'default'
            }
        },
        editMode: {
            element: 'div',
            attribs: {
                className: EditGlobals.editModeEnabled,
                textContent: 'Edit mode',
                onclick: function (this: EditMode, e: any): void {
                    this.onEditModeToggle(e.target);
                }
            }
        },
        saveLocal: {
            element: 'div',
            attribs: {
                className: EditGlobals.saveLocalItem,
                textContent: 'Save locally',
                onclick: function (): void {}
            }
        }
    }

    /* *
    *
    *  Functions
    *
    * */
    private renderContextButton(): void {
        const editMode = this;

        editMode.contextButtonElement = createElement(
            'div', {
                className: EditGlobals.contextMenuBtn,
                onclick: function (): void {
                    editMode.onContextBtnClick(editMode);
                }
            }, {
                width: '32px',
                height: '32px',
                border: '1px solid #555',
                marginLeft: 'auto',
                padding: '5px',
                cursor: 'pointer',
                borderRadius: '3px'
            }, editMode.dashboard.container
        );

        for (let i = 0; i < 3; ++i) {
            createElement(
                'div', {
                    className: 'edit-ctx-btn-bar'
                }, {
                    height: '4px',
                    backgroundColor: '#555',
                    margin: '0px 0px 4px 0px'
                }, editMode.contextButtonElement
            );
        }
    }

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
            width = 150,
            menuItems = [];

        if (contextButtonElement) {
            // Render menu container.
            const element = createElement(
                'div', {
                    className: EditGlobals.contextMenu
                }, {
                    width: width + 'px',
                    border: '1px solid #555',
                    backgroundColor: '#fff',
                    marginLeft: 'auto',
                    padding: '5px',
                    borderRadius: '3px',
                    position: 'absolute',
                    display: 'none',
                    top: contextButtonElement.offsetTop +
                        contextButtonElement.offsetHeight + 'px',
                    left: contextButtonElement.offsetLeft - width +
                        contextButtonElement.offsetWidth + 'px',
                    zIndex: 9999
                }, editMode.dashboard.container
            );

            // Render menu items.
            for (let i = 0, iEnd = menuItemsOptions.length; i < iEnd; ++i) {
                menuItems.push(
                    editMode.renderMenuItem(menuItemsOptions[i], element)
                );
            }

            editMode.contextMenu = {
                element: element,
                isOpen: false,
                menuItems: menuItems
            };
        }
    }

    public renderMenuItem(
        item: string,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        const editMode = this,
            itemSchema = editMode.menuItems[item];

        return createElement(
            itemSchema.element,
            merge(itemSchema.attribs || {}, {
                onclick: function (): void {
                    if (itemSchema.attribs && itemSchema.attribs.onclick) {
                        itemSchema.attribs.onclick.apply(editMode, arguments);
                    }
                },
                className: EditGlobals.contextMenuItem +
                    (itemSchema.attribs || {}).className || ''
            }),
            merge({
                height: '30px',
                padding: '5px',
                color: '#555',
                cursor: 'pointer'
            }, itemSchema.styles || {}),
            container
        );
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
            editMode.disactivateEditMode(btnElement);
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
        editMode.dashboard.container.className += EditGlobals.editModeEnabled;
    }

    public disactivateEditMode(
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

            if (oneClass !== EditGlobals.editModeEnabled) {
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
    }

    export interface ContextMenuOptions {
        enabled: true;
        menuItems: Array<string>;
    }

    export interface ContextMenu {
        element: HTMLDOMElement;
        isOpen: boolean;
        menuItems: Array<HTMLDOMElement>;
    }

    export interface MenuItem {
        element: string;
        attribs?: HTMLAttributes;
        styles?: CSSObject;
    }
}

export default EditMode;
