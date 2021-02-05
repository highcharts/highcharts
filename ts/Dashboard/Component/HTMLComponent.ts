import Component from './Component.js';
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge
} = U;
import AST from '../../Core/Renderer/HTML/AST.js';
import CSSObject from '../../Core/Renderer/CSSObject.js';

namespace HTMLComponent {

    export type ComponentType = HTMLComponent;
    export interface HTMLComponentOptions extends Component.ComponentOptions {
        elements: Highcharts.ASTNode[];
    }

    export interface HTMLComponentEventObject extends Component.Event {
    }

    export interface HTMLComponentUpdateEvent extends Component.UpdateEvent {
        options?: HTMLComponentOptions;
    }
}

class HTMLComponent extends Component<HTMLComponent.HTMLComponentEventObject> {

    public static defaultOptions = {
        ...Component.defaultOptions
    }

    private innerElements: HTMLElement[];
    private elements: Highcharts.ASTNode[];

    constructor(options: HTMLComponent.HTMLComponentOptions) {
        options = merge(
            HTMLComponent.defaultOptions,
            options
        );
        super(options);

        this.type = 'HTML';
        this.innerElements = [];
        this.elements = options.elements;


        this.on('tableChanged', (e: Component.TableChangedEvent): void => {
            if (e.detail?.sender !== this.id) {
                this.redraw();
            }
        });
    }

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.hasLoaded = true;
        this.emit({ type: 'afterLoad' });
        return this;
    }

    public render(): this {
        const { elements } = super.render(); // Fires the render event

        this.elements = elements;
        this.constructTree();
        this.innerElements.forEach((element): void => {
            this.element.appendChild(element);
        });
        this.emit({ type: 'afterRender', component: this, detail: { sender: this.id } });
        return this;
    }

    public redraw(): this {
        const { elements } = super.redraw(); // Fires the render event
        this.elements = elements;
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

        this.emit({ type: 'afterRedraw', component: this, detail: { sender: this.id } });
        return this;
    }


    // Could probably use the serialize function moved on
    // the exportdata branch
    private constructTree(): void {
        this.elements.forEach((el): void => {
            const created = createElement(el.tagName || 'div', el.attributes, el.attributes?.style as CSSObject);
            if (el.textContent) {
                AST.setElementHTML(created, el.textContent);
            }
            this.innerElements.push(created);
        });
    }
}

export default HTMLComponent;
