import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import U from '../../Core/Utilities.js';

const {
    createElement
} = U;

abstract class GUIElement {
    /**
     *
     * Prefix of a GUIElement HTML class name.
     *
     */
    protected static readonly prefix: string = 'highcharts-dashboard-';

    /* *
    *
    *  Properties
    *
    * */

    /**
     * HTML container of a GUIElement.
     */
    public container?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Create or set existing HTML element as a GUIElement container.
     *
     * @param {boolean} render
     * Decide wheather to render a new element or not.
     *
     * @param {HTMLDOMElement} parentContainer
     * The container for a new HTML element.
     *
     * @param {HTMLAttributes} attribs
     * Attributes for a new HTML element.
     *
     * @param {HTMLElement|string} elementOrId
     * HTML element or id of HTML element that will be set
     * as a GUIELement container.
     */
    protected setElementContainer(
        render?: boolean,
        parentContainer?: HTMLDOMElement,
        attribs: HTMLAttributes = {},
        elementOrId?: (HTMLElement|string),
        style?: CSSObject
    ): void {
        const guiElement = this;

        let elem;

        // @ToDo use try catch block
        if (render && parentContainer) {
            guiElement.container = createElement(
                'div',
                attribs,
                style || {},
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

export default GUIElement;
