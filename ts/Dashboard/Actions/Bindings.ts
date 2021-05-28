/* eslint-disable */
import type ComponentTypes from '../Component/ComponentType';
import ChartComponent from './../Component/ChartComponent.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import GroupComponent from './../Component/GroupComponent.js';

import type {
    HTMLDOMElement
} from '../../Core/Renderer/DOMElementType';
import type GUIElement from '../Layout/GUIElement';

import Cell from '../Layout/Cell.js';
import Row from '../Layout/Row.js';
import Layout from '../Layout/Layout.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    objectEach,
    merge
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
    ): ComponentTypes | undefined {
        const compontentContainer = document.getElementById(options.cell);
        const events = options.events;

        let component: ComponentTypes|undefined;

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

            // update cell size (when component is wider, cell should adjust)
            // this.updateSize();
            if (options && options.dimensions) {
                Cell.setContainerSize(options.dimensions, compontentContainer);
            }
        }

        // add events
        if (component) {
            fireEvent(component, 'mount');
        }

        return component;
    }

    public static componentFromJSON(
        json: HTMLComponent.ClassJSON|ChartComponent.ClassJSON,
        cellContainer: HTMLDOMElement|undefined
    ): ComponentTypes | undefined {

        const compontentContainer = cellContainer;
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


        // update cell size (when component is wider, cell should adjust)
        // this.updateSize();
        if (json.options.dimensions && cellContainer) {
            Cell.setContainerSize(json.options.dimensions, cellContainer);
        }

        // TODO - events

        return component;
    }

    public static getCell(idOrElement: string): Cell|undefined {
        const cell = Bindings.getGUIElement(idOrElement);
        return cell instanceof Cell ? cell : void 0;
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
        return new ChartComponent(
            merge(
                options,
                {
                    parentElement: compontentContainer as HTMLDOMElement,
                    chartOptions: options.chartOptions,
                    dimensions: options.dimensions
                }
            )
        );
    }

    public static htmlComponent(
        compontentContainer: HTMLDOMElement,
        options: Bindings.ComponentOptions
    ): HTMLComponent {
        return new HTMLComponent(
            merge(
                options,
                {
                    parentElement: compontentContainer as HTMLDOMElement,
                    elements: options.elements
                })
        );
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
                        chart: {},
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
        cell: string;
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
        cell: Cell;
    }
}

export default Bindings;
