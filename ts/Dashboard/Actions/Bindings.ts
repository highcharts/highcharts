import Component from './../Component/Component.js';
import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import GroupComponent from './../Component/GroupComponent.js';

import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';

import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    objectEach
} = U;
class Bindings {
    /* *
    *
    *  Constructors
    *
    * */
    // public constructor() {
    // }

    /* *
    *
    *  Properties
    *
    * */

    /* *
    *
    *  Functions
    *
    * */
    public addComponent(
        options: Bindings.ComponentType
    ): HTMLComponent|ChartComponent|GroupComponent|undefined { //
        const compontentContainer = document.getElementById(options.column);
        const bindings = this;
        const events = options.events;

        let component: HTMLComponent|ChartComponent|GroupComponent|undefined;

        // add elements to containers
        if (compontentContainer) {
            switch (options.type) {
                case 'chart':
                    component = bindings.chartComponent(
                        compontentContainer,
                        options
                    );
                    break;
                case 'html':
                    component = bindings.htmlComponent(
                        compontentContainer,
                        options
                    );
                    break;
                // case 'group':
                //     component = bindings.groupComponent(
                //         compontentContainer,
                //         options.config
                //     );
                //     break;
                default:
                    component = void 0;
            }

            component?.render();
        }

        // add events
        if (component) {
            objectEach(events, (fn, key): void => {
                addEvent(
                    component,
                    key,
                    fn
                );
            });

        }

        fireEvent(component, 'mount');

        return component;
    }

    public chartComponent(
        compontentContainer: HTMLDOMElement,
        options: Bindings.ComponentType
    ): ChartComponent {
        return new ChartComponent({
            parentElement: compontentContainer as HTMLDOMElement,
            chartOptions: options.chartOptions,
            dimensions: options.dimensions
        });
    }

    public htmlComponent(
        compontentContainer: HTMLDOMElement,
        options: Bindings.ComponentType
    ): HTMLComponent {
        return new HTMLComponent({
            parentElement: compontentContainer as HTMLDOMElement,
            elements: options.elements
        });
    }

    public groupComponent(
        compontentContainer: HTMLDOMElement
    ): GroupComponent {
        return new GroupComponent({
            parentElement: compontentContainer,
            direction: 'column',
            components: [
                new HTMLComponent({
                    elements: [{
                        tagName: 'img',
                        attributes: {
                            src: 'https://i.ytimg.com/vi/qlO4M6MfDFY/hqdefault.jpg',
                            title: 'I heard you like components'
                        }
                    }]
                }),
                new ChartComponent({
                    chartOptions: {
                        series: [{
                            type: 'pie',
                            data: [1, 2, 3]
                        }]
                    }
                })
            ]
        });
    }
}

namespace Bindings {
    export interface Options {

    }

    export interface ComponentType {
        column: string;
        type: string;
        chartOptions?: any;
        elements?: any;
        dimensions?: { width: number; height: number };
        events?: any;
    }
    export interface ComponentOptions {
        options: any;
        component: ChartComponent|HTMLComponent|GroupComponent|undefined;
    }
}

export default Bindings;
