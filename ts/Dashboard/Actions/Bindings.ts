/* eslint-disable */
import type ComponentTypes from '../Component/ComponentType';
import type GUIElement from '../Layout/GUIElement';
import type HighchartsComponent from '../../Extensions/DashboardPlugin/HighchartsComponent';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type Serializable from '../Serializable';

import Cell from '../Layout/Cell.js';
import Component from '../Component/Component.js';
import HTMLComponent from './../Component/HTMLComponent.js';
import Layout from '../Layout/Layout.js';
import Row from '../Layout/Row.js';
import U from '../../Core/Utilities.js';
const {
    fireEvent,
    merge
} = U;
class Bindings {
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

        let component: ComponentTypes|undefined;

        // add elements to containers
        if (compontentContainer) {
            switch (options.type) {
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
                    const ComponentClass = Component.getComponent(options.type);
                    if (ComponentClass) {
                        component = new ComponentClass(merge(
                            options,
                            {
                                parentElement: compontentContainer as HTMLDOMElement,
                                chartOptions: options.chartOptions,
                                dimensions: options.dimensions
                            }
                        )) as HighchartsComponent;
                    }
                    break;
            }

            component?.render();

            // update cell size (when component is wider, cell should adjust)
            // this.updateSize();
        }

        // add events
        if (component) {
            fireEvent(component, 'mount');
        }

        return component;
    }

    public static componentFromJSON(
        json: HTMLComponent.ClassJSON|HighchartsComponent.ClassJSON,
        cellContainer: HTMLDOMElement|undefined
    ): (Component|undefined) {
        let component: (Component|undefined);

        switch (json.$class) {
            case 'HTML':
                component = HTMLComponent.fromJSON(json as HTMLComponent.ClassJSON);
                break;
            default:
                const componentClass = Component.getComponent(json.$class);
                if (componentClass) {
                    component = (componentClass as unknown as Serializable<Component, typeof json>).fromJSON(json);
                }
                break;
        }

        component?.render();

        // update cell size (when component is wider, cell should adjust)
        // this.updateSize();

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
        component: HighchartsComponent|HTMLComponent|undefined;
        cell: Cell;
    }
}

export default Bindings;
