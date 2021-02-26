import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import Layout from './Layout.js';
import Row from './Row.js';
import Column from './Column.js';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import U from '../../Core/Utilities.js';

const {
    createElement
} = U;

const PREFIX = 'highcharts-dashboard-';

abstract class GUIElement {
    /* *
    *
    *  Constructors
    *
    * */

    /* *
    *
    *  Properties
    *
    * */
    public container?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */
    protected setElementContainer(
        render?: boolean,
        parentContainer?: HTMLDOMElement,
        attribs: HTMLAttributes = {},
        elementOrId?: (HTMLElement|string)
    ): void {
        const guiElement = this;

        let elem;

        // @ToDo use try catch block
        if (render && parentContainer) {
            guiElement.container = createElement(
                'div',
                attribs,
                {},
                parentContainer
            );
        } else if (elementOrId instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = elementOrId;
        } else if (typeof elementOrId === 'string') {
            elem = document.getElementById(elementOrId);

            if (elem) {
                guiElement.container = elem;
            } else {
                // Error
            }
        } else {
            // Error
        }
    }

}

interface GUIElement {}

export { GUIElement, PREFIX };
