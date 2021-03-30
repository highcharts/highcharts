import EditMode from './EditMode.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import U from '../../Core/Utilities.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';

const {
    merge,
    createElement
} = U;

class EditRenderer {
    /* *
    *
    *  Constructor
    *
    * */
    constructor(
        editMode: EditMode
    ) {
        this.editMode = editMode;
    }

    /* *
    *
    *  Properties
    *
    * */
    public editMode: EditMode;

    /* *
    *
    *  Functions
    *
    * */
    public renderContextButton(): HTMLDOMElement {
        const editMode = this.editMode,
            ctxBtnElement = createElement(
                'div', {
                    className: EditGlobals.classNames.contextMenuBtn,
                    onclick: function (): void {
                        editMode.onContextBtnClick(editMode);
                    }
                }, {}, editMode.dashboard.container
            );

        for (let i = 0; i < 3; ++i) {
            createElement('div', {}, {}, ctxBtnElement);
        }

        return ctxBtnElement;
    }

    public renderContextMenu(
        contextButtonElement: HTMLDOMElement
    ): HTMLDOMElement {
        const editMode = this.editMode,
            width = 150,
            element = createElement(
                'div', {
                    className: EditGlobals.classNames.contextMenu
                }, {
                    width: width + 'px',
                    top: contextButtonElement.offsetTop +
                        contextButtonElement.offsetHeight + 'px',
                    left: contextButtonElement.offsetLeft - width +
                        contextButtonElement.offsetWidth + 'px'
                }, editMode.dashboard.container
            );

        return element;
    }

    public renderMenuItem(
        itemOrType: EditMode.MenuItemOptions|EditGlobals.TLangKeys,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        const editMode = this.editMode,
            itemSchema = typeof itemOrType === 'string' ? EditMode.menuItems[itemOrType] :
                itemOrType.type ? EditMode.menuItems[itemOrType.type] : {};

        if (itemSchema.type && itemSchema.type !== 'separator') {
            itemSchema.text = editMode.lang[itemSchema.type];
        }

        const item: EditMode.MenuItemOptions = typeof itemOrType === 'string' ?
            merge(itemSchema, { type: itemOrType }) : merge(itemSchema, itemOrType);

        return createElement(
            'div', {
                textContent: item.text,
                onclick: function (): void {
                    if (item.events && item.events.click) {
                        item.events.click.apply(editMode, arguments);
                    }
                },
                className: EditGlobals.classNames.contextMenuItem + ' ' +
                    (item.className || '')
            },
            item.style || {},
            container
        );
    }
}

namespace EditRenderer {}

export default EditRenderer;
