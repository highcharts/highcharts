/* eslint-disable */

// WIP
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
        this.element.classList.add('group-component')
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
        super.render()
        this.element.style.display = 'flex';
        this.element.style.flexDirection = this.options.direction;
        this.components.forEach((comp): void => {
            comp.parentElement = this.element;
            comp.options.dimensions = this.options.direction === 'column' ? {
                height: comp.options.dimensions?.height || ((1 / this.components.length) * 100) + '%'
            } : {
                    width: comp.options.dimensions?.width || ((1 / this.components.length) * 100) + '%'
                }
            comp.element.classList.replace('highcharts-dashboard-component', 'child-component');
            comp.render();
        });
        return this;
    }
}
