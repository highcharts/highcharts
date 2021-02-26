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
    public constructor(
        options: (Layout.Options|Row.Options|Column.Options)
    ) {
        this.options = options;
    }

    /* *
    *
    *  Properties
    *
    * */
    public options: (Layout.Options|Row.Options|Column.Options);
    public container?: HTMLDOMElement;

    /* *
    *
    *  Functions
    *
    * */
    // @ToDo return dictionary type instead of string
    protected setElementContainer(
        type: string,
        render?: boolean,
        parentContainer?: HTMLDOMElement,
        element?: (HTMLElement|string)
    ): void {
        const guiElement = this,
            options = guiElement.options;

        let attribs: HTMLAttributes,
            className,
            elem;

        // @ToDo use try catch block
        if (render && parentContainer) {
            attribs = {};

            if (options.id) {
                attribs.id = options.id;
            }

            // @ToDo remove as any.
            className = (options as any)[type + 'ClassName'];
            attribs.className = className ? 
                className + ' ' + PREFIX + type :
                PREFIX + type;

            guiElement.container = createElement(
                'div',
                attribs,
                {},
                parentContainer
            );
        } else if (element instanceof HTMLElement) { // @ToDo check if this is enough
            guiElement.container = element;
        } else if (typeof options.id === 'string') {
            elem = document.getElementById(options.id);

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

interface GUIElement {
    options: (Layout.Options|Row.Options|Column.Options);
}

export default GUIElement;
