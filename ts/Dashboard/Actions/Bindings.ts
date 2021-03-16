import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import GroupComponent from './../Component/GroupComponent.js';

import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type GUIElement from '../Layout/GUIElement';

import U from '../../Core/Utilities.js';
import Column from '../Layout/Column.js';
import Row from '../Layout/Row.js';
import Layout from '../Layout/Layout.js';

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

    private static getGUIElement(idOrElement: string): GUIElement|undefined {
        const container = typeof idOrElement === 'string' ?
            document.getElementById(idOrElement) : idOrElement;

        let guiElement;

        if (container instanceof HTMLElement) {
            fireEvent(container, 'bindedGUIElement', {}, function (
                e: GUIElement.BindedGUIElementEvent
            ): void {
                guiElement = e.guiElement;
            });
        }

        return guiElement;
    }

    public static addComponent(
        options: Bindings.ComponentOptions
    ): HTMLComponent|ChartComponent|GroupComponent|undefined {
        const compontentContainer = document.getElementById(options.column);
        const events = options.events;

        let component: HTMLComponent|ChartComponent|GroupComponent|undefined;

        // add elements to containers
        if (compontentContainer) {
            switch (options.type) {
                case 'chart':
                    component = Bindings.chartComponent(
                        compontentContainer,
                        options
                    );
                    break;
                case 'html':
                    component = Bindings.htmlComponent(
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
        if (component && events) {
            objectEach(events, (fn, key): void => {
                addEvent(
                    component,
                    key,
                    fn
                );
            });

            fireEvent(component, 'mount');
        }

        return component;
    }

    public static componentFromJSON(
        json: HTMLComponent.ClassJSON|ChartComponent.ClassJSON
    ): HTMLComponent|ChartComponent|GroupComponent|undefined {

        let component: HTMLComponent|ChartComponent|GroupComponent|undefined;

        switch (json.$class) {
            case 'Chart':
                component = ChartComponent.fromJSON(json as ChartComponent.ClassJSON);
                break;
            case 'HTML':
                component = HTMLComponent.fromJSON(json as HTMLComponent.ClassJSON);
                break;
            default:
                component = void 0;
        }

        component?.render();

        // TODO - events

        return component;
    }

    public static getColumn(idOrElement: string): Column|undefined {
        const column = Bindings.getGUIElement(idOrElement);
        return column instanceof Column ? column : void 0;
    }

    public static getRow(idOrElement: string): Row|undefined {
        const row = Bindings.getGUIElement(idOrElement);
        return row instanceof Row ? row : void 0;
    }

    public static getLayout(idOrElement: string): Layout|undefined {
        const layout = Bindings.getGUIElement(idOrElement);
        return layout instanceof Layout ? layout : void 0;
    }

    public static chartComponent(
        compontentContainer: HTMLDOMElement,
        options: Bindings.ComponentOptions
    ): ChartComponent {
        return new ChartComponent({
            parentElement: compontentContainer as HTMLDOMElement,
            chartOptions: options.chartOptions,
            dimensions: options.dimensions
        });
    }

    public static htmlComponent(
        compontentContainer: HTMLDOMElement,
        options: Bindings.ComponentOptions
    ): HTMLComponent {
        return new HTMLComponent({
            parentElement: compontentContainer as HTMLDOMElement,
            elements: options.elements
        });
    }

    public static groupComponent(
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

    export interface ComponentOptions {
        column: string;
        type: string;
        chartOptions?: any;
        isResizable?: boolean;
        elements?: any;
        dimensions?: { width: number; height: number };
        events?: any;
    }
    export interface MountedComponentsOptions {
        options: any;
        component: ChartComponent|HTMLComponent|GroupComponent|undefined;
        column: Column;
    }
}

export default Bindings;
