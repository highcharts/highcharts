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
            elements: []
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
    public options: HTMLComponent.HTMLComponentOptions;

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

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.elements = this.options.elements || [];
        this.constructTree();
        this.innerElements.forEach((element): void => {
            this.element.appendChild(element);
        });
        this.parentElement.appendChild(this.element);
        this.emit({ type: 'afterLoad' });
        return this;
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
    export interface HTMLComponentOptions extends Component.ComponentOptions {
        elements?: Highcharts.ASTNode[];
    }

    export interface HTMLComponentJSONOptions extends Component.ComponentJSONOptions {
        elements: DataJSON.JSONObject[];
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
