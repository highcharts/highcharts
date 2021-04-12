import EditMode from './EditMode.js';
import EditGlobals from '../EditMode/EditGlobals.js';
import U from '../../Core/Utilities.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';

const {
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
    public renderContextButton(): HTMLDOMElement|undefined {
        const editMode = this.editMode;

        let ctxBtnElement;

        if (editMode.options.contextMenu) {
            ctxBtnElement = createElement(
                'div', {
                    className: EditGlobals.classNames.contextMenuBtn,
                    onclick: function (): void {
                        editMode.onContextBtnClick(editMode);
                    }
                }, {}, editMode.dashboard.container
            );
            ctxBtnElement.style.background = 'url(' +
                editMode.options.contextMenu.icon +
            ') no-repeat 50% 50%';
        }

        return ctxBtnElement;
    }

    public renderSelect(
        options: Array<string>,
        parentElement: HTMLDOMElement
    ): HTMLDOMElement|undefined {
        let customSelect;

        if (parentElement) {
            customSelect = createElement(
                'select',
                {
                    className: 'select' // EditGlobals.classNames.customSelect
                },
                {},
                parentElement
            );

            for (let i = 0, iEnd = options.length; i < iEnd; ++i) {
                createElement(
                    'option',
                    {},
                    {},
                    customSelect
                );
            }
        }

        return customSelect;
    }

    public renderSwitcher(
        parentElement: HTMLDOMElement
    ): HTMLDOMElement|undefined {
        let switcher;

        if (parentElement) {
            switcher = createElement(
                'label',
                {
                    className: 'switch'
                },
                {},
                parentElement
            );

            this.renderCheckbox(switcher);

            createElement(
                'span',
                {
                    className: 'slider'
                },
                {},
                parentElement
            );
        }

        return switcher;
    }

    public renderInput(
        parentElement: HTMLDOMElement
    ): HTMLDOMElement|undefined {
        let input;

        if (parentElement) {
            input = createElement(
                'input', {
                    type: 'text'
                }, {

                },
                parentElement
            );
        }

        return input;
    }

    public renderTextarea(
        parentElement: HTMLDOMElement
    ): HTMLDOMElement|undefined {
        let textarea;

        if (parentElement) {
            textarea = createElement(
                'textarea', {

                }, {

                },
                parentElement
            );
        }

        return textarea;
    }

    public renderCheckbox(
        parentElement: HTMLDOMElement
    ): HTMLDOMElement|undefined {
        let input;

        if (parentElement) {
            input = createElement(
                'input', {
                    type: 'checkbox'
                }, {

                },
                parentElement
            );
        }

        return input;
    }
}

namespace EditRenderer {}

export default EditRenderer;
