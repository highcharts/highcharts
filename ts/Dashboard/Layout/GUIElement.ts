import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type {
    CSSObject
} from '../../Core/Renderer/CSSObject';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';
import U from '../../Core/Utilities.js';

const {
    createElement,
    addEvent
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
     * @param {GUIElement.ContainerOptions} options
     * Options.
     */
    protected setElementContainer(
        options: GUIElement.SetElementContainerOptions
    ): void {
        const guiElement = this;

        let elem;

        // @ToDo use try catch block
        if (options.render && options.parentContainer) {

            // Purge empty id attribute.
            if (options.attribs && !options.attribs.id) {
                delete options.attribs.id;
            }

            guiElement.container = createElement(
                'div',
                options.attribs || {},
                options.style || {},
                options.parentContainer
            );
        } else if (options.element instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = options.element;
        } else if (typeof options.elementId === 'string') {
            elem = document.getElementById(options.elementId);

            if (elem) {
                guiElement.container = elem;
            } else {
                // Error
            }
        } else {
            // Error
        }

        // Set bindedGUIElement event on GUIElement container.
        if (guiElement.container) {
            addEvent(guiElement.container, 'bindedGUIElement', function (
                e: GUIElement.BindedGUIElementEvent
            ): void {
                e.guiElement = guiElement;
                e.stopImmediatePropagation();
            });
        }
    }

}

namespace GUIElement {
    export interface SetElementContainerOptions {
        render?: boolean;
        parentContainer?: HTMLDOMElement;
        attribs?: HTMLAttributes;
        style?: CSSObject;
        element?: HTMLElement;
        elementId?: string;
    }

    export interface BindedGUIElementEvent extends Event {
        guiElement: GUIElement;
    }
}

export default GUIElement;
