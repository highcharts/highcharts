import Component from './Component.js';
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge
} = U;
import AST from '../../Core/Renderer/HTML/AST.js';
import DataJSON from '../../Data/DataJSON.js';
import DataStore from '../../Data/Stores/DataStore.js';

class HTMLComponent extends Component<HTMLComponent.HTMLComponentEventObject> {

    /* *
     *
     *  Static properties
     *
     * */
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            scaleElements: true,
            elements: [],
            editableOptions: [
                ...Component.defaultOptions.editableOptions,
                'scaleElements'
            ]
        }
    );

    /* *
     *
     *  Static functions
     *
     * */

    public static fromJSON(json: HTMLComponent.ClassJSON): HTMLComponent {
        const options = json.options;
        const elements = json.elements?.map((el): Highcharts.ASTNode => JSON.parse(el));
        const store = json.store?.$class ? DataStore.getStore(json.store?.$class) : void 0;

        const component = new HTMLComponent(
            merge(
                options,
                { elements, store: store as any }
            )
        );

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    private innerElements: HTMLElement[];
    private elements: Highcharts.ASTNode[];
    private scaleElements: boolean;
    public options: HTMLComponent.HTMLComponentOptions;
    public editableOptions: Array<keyof HTMLComponent.EditableOptions>;

    /* *
     *
     *  Class constructor
     *
     * */

    constructor(options: Partial<HTMLComponent.HTMLComponentOptions>) {
        options = merge(
            HTMLComponent.defaultOptions,
            options
        );
        super(options);

        this.options = options as HTMLComponent.HTMLComponentOptions;

        this.type = 'HTML';
        this.innerElements = [];
        this.elements = [];
        this.scaleElements = this.options.scaleElements;
        this.editableOptions = this.options.editableOptions;

        this.on('tableChanged', (e: Component.TableChangedEvent): void => {
            if (e.detail?.sender !== this.id) {
                this.redraw();
            }
        });
    }


    /* *
     *
     *  Class methods
     *
     * */

    public createTextElement(
        tagName: string,
        elementName: string,
        textOptions: Component.textOptionsType
    ): HTMLElement | undefined {
        const classBase = 'hcd';

        if (typeof textOptions === 'object') {
            const { className, text, style } = textOptions;
            return createElement(tagName, {
                className: className || `${classBase}-component-${elementName}`,
                textContent: text
            }, style);
        }

        if (typeof textOptions === 'string') {
            return createElement(tagName, {
                className: `${classBase}-component-${elementName}`,
                textContent: textOptions
            });
        }
    }

    public setTitle(titleOptions: Component.textOptionsType): void {
        const titleElement = this.createTextElement('h1', 'title', titleOptions);
        if (titleElement) {
            this.innerElements = [titleElement, ...this.innerElements];
        }
    }

    public setCaption(captionOptions: Component.textOptionsType): void {
        const captionElement = this.createTextElement('div', 'caption', captionOptions);
        if (captionElement) {
            this.innerElements = [captionElement, ...this.innerElements];
        }
    }

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.elements = this.options.elements || [];

        this.constructTree();

        this.setTitle(this.options.title);
        this.setCaption(this.options.caption);

        this.innerElements.forEach((element): void => {
            this.element.appendChild(element);
        });
        this.parentElement.appendChild(this.element);
        if (this.scaleElements) {
            this.autoScale();
        }
        this.emit({ type: 'afterLoad' });
        return this;
    }

    // WIP handle scaling inner elements
    // Could probably also implement responsive config
    public autoScale(): void {
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';

        this.innerElements.forEach((element): void => {
            element.style.width = 'auto';
            element.style.maxWidth = '100%';
            element.style.maxHeight = '100%';
            element.style.flexBasis = 'auto'; // (100 / this.innerElements.length) + '%';
            element.style.overflow = 'auto';
        });
        this.scaleText();
    }

    // WIP basic font size scaling
    // Should also take height into account
    public scaleText(): void {
        this.innerElements.forEach((element): void => {
            element.style.fontSize = Math.max(Math.min(element.clientWidth / (1 * 10), 200), 20) + 'px';
        });
    }

    public render(): this {
        super.render(); // Fires the render event and calls load
        this.emit({ type: 'afterRender', component: this });
        return this;
    }

    public redraw(): this {
        super.redraw();
        this.innerElements = [];
        this.constructTree();

        for (let i = 0; i < this.element.childNodes.length; i++) {
            const childnode = this.element.childNodes[i];
            if (this.innerElements[i]) {
                this.element.replaceChild(this.innerElements[i], childnode);
            } else {
                this.element.removeChild(childnode);
            }
        }

        this.render();
        this.emit({ type: 'afterRedraw', component: this });
        return this;
    }

    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {
        if (this.scaleElements) {
            this.scaleText();
        }
        super.resize(width, height);
        return this;
    }

    public update(options: Partial<HTMLComponent.HTMLComponentOptions>): this {
        super.update(options);
        this.emit({ type: 'afterUpdate', component: this });
        return this;
    }

    // Could probably use the serialize function moved on
    // the exportdata branch
    private constructTree(): void {
        this.elements.forEach((el): void => {
            const { attributes } = el;

            const createdElement = createElement(
                el.tagName || 'div',
                attributes,
                typeof attributes?.style !== 'string' ?
                    attributes?.style :
                    void 0
            );
            if (el.textContent) {
                AST.setElementHTML(createdElement, el.textContent);
            }
            this.innerElements.push(createdElement);
        });
    }

    public toJSON(): HTMLComponent.ClassJSON {
        const elements = (this.options.elements || [])
            .map((el): string => JSON.stringify(el));

        return merge(
            super.toJSON(),
            { elements }
        );
    }
}


/* *
 *
 *  Namespace
 *
 * */
namespace HTMLComponent {

    export type ComponentType = HTMLComponent;
    export interface HTMLComponentOptions extends Component.ComponentOptions, EditableOptions {
        elements?: Highcharts.ASTNode[];
    }

    export interface EditableOptions extends Component.EditableOptions {
        scaleElements: boolean;
    }

    export interface HTMLComponentJSONOptions extends Component.ComponentJSONOptions {
        elements: DataJSON.JSONObject[];
        scaleElements: boolean;
    }

    export interface HTMLComponentEventObject extends Component.Event {
    }

    export interface HTMLComponentUpdateEvent extends Component.UpdateEvent {
        options?: HTMLComponentOptions;
    }

    export interface ClassJSON extends Component.ClassJSON {
        elements?: string[];
        events?: string[];
    }
}

/* *
 *
 *  Default export
 *
 * */
export default HTMLComponent;
