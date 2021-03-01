import type ComponentTypes from './ComponentType';
import Component from './Component.js';

type optionsType = {
    components: ComponentTypes[];
    direction: 'column' | 'row';
} & Component.ComponentOptions;

export default class GroupComponent extends Component {

    public static defaultOptions: optionsType = {
        ...Component.defaultOptions,
        direction: 'column',
        components: []
    }

    public components: ComponentTypes[];
    public options: optionsType;

    constructor(options: Partial<optionsType>) {
        super(options);
        this.options = { ...GroupComponent.defaultOptions, ...options };
        this.components = options.components || [];
    }

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.hasLoaded = true;
        this.emit({ type: 'afterLoad' });
        return this;
    }
    render(): this {
        super.render();
        this.element.style.display = 'flex';
        this.element.style.flexDirection = this.options.direction;
        this.components.forEach((comp): void => {
            comp.parentElement = this.element;
            if (this.options.direction === 'column') {
                comp.dimensions.width = this.dimensions.width;
                comp.dimensions.height = (this.dimensions.height) / this.components.length;
            }
            if (this.options.direction === 'row') {
                comp.dimensions.height = this.dimensions.height || 500;
                comp.dimensions.width = ((this.dimensions.width || 500) / this.components.length) - 50;
            }
            comp.render();
        });
        return this;
    }
}
