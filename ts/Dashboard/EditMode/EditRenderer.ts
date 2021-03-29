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
        item: EditMode.MenuItemOptions,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        const editMode = this.editMode,
            itemSchema = item.type ? editMode.menuItems[item.type] : {};

        let langTextContent;

        if (itemSchema.type && itemSchema.type !== 'separator') {
            langTextContent = editMode.lang[itemSchema.type];
        }

        return createElement(
            'div', {
                textContent: item.text || langTextContent || itemSchema.text,
                onclick: function (): void {
                    if (item.events && item.events.click) {
                        item.events.click.apply(editMode, arguments);
                    } else if (itemSchema.events && itemSchema.events.click) {
                        itemSchema.events.click.apply(editMode, arguments);
                    }
                },
                className: EditGlobals.classNames.contextMenuItem + ' ' +
                    (item.className || itemSchema.className || '')
            },
            item.style || itemSchema.style || {},
            container
        );
    }
}

namespace EditRenderer {}

export default EditRenderer;
