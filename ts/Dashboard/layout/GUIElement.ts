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
    public getType(): string {
        const guiElement = this;

        let type = '';

        if (guiElement instanceof Layout) {
            type = 'layout';
        } else if (guiElement instanceof Row) {
            type = 'row';
        } else if (guiElement instanceof Column) {
            type = 'column';
        }

        return type;
    }

    protected setElementContainer(
        render?: boolean,
        parentContainer?: HTMLDOMElement,
        element?: (HTMLElement|string)
    ): void {
        const guiElement = this,
            options = guiElement.options,
            type = guiElement.getType();

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
            attribs.className = className ? className + ' ' + PREFIX + type : PREFIX + type;

            guiElement.container = createElement('div', attribs, {}, parentContainer);
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

    protected setInnerElements(
        render?: boolean
    ): void {
        const guiElement = this,
            innerElementsOptions = (guiElement.options as any).rows ||
                (guiElement.options as any).columns || [];

        let options,
            innerElements,
            innerElement;

        if (render) {
            for (let i = 0, iEnd = innerElementsOptions.length; i < iEnd; ++i) {
                options = innerElementsOptions[i];
                guiElement.addInnerElement(options);
            }
        } else if (guiElement.container) {
            if (guiElement instanceof Layout) {
                innerElements = guiElement.container
                    .getElementsByClassName(guiElement.options.rowClassName);
            } else if (guiElement instanceof Row) {
                innerElements = guiElement.container
                    .getElementsByClassName(guiElement.layout.options.columnClassName);
            }

            if (innerElements) {
                for (let i = 0, iEnd = innerElements.length; i < iEnd; ++i) {
                    innerElement = innerElements[i];

                    if (innerElement instanceof HTMLElement) { // @ToDo check if this is enough
                        guiElement.addInnerElement({}, innerElement);
                    }
                }
            }
        }
    }

    private addInnerElement(
        options: Column.Options,
        element?: HTMLElement
    ): (GUIElement|undefined) {
        const guiElement = this;

        let innerGUIElement;

        if (guiElement instanceof Layout) {
            innerGUIElement = new Row(guiElement, options, element);
            guiElement.rows.push(innerGUIElement);
        } else if (guiElement instanceof Row) {
            innerGUIElement = new Column(guiElement, options, element);
            guiElement.columns.push(innerGUIElement);
        } else {
            // Error
        }

        return innerGUIElement;
    }
}

interface GUIElement {
    options: (Layout.Options|Row.Options|Column.Options);
}

export default GUIElement;
