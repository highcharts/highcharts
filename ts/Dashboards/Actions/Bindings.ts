/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import type ComponentTypes from '../Component/ComponentType';
import type GUIElement from '../Layout/GUIElement';
import type HighchartsComponent from '../../Extensions/DashboardPlugins/HighchartsComponent';
import type Serializable from '../Serializable';
import type KPIComponent from '../Component/KPIComponent';
import type DataStore from '../../Data/Stores/DataStore';

import Cell from '../Layout/Cell.js';
import Component from '../Component/Component.js';
import HTMLComponent from '../Component/HTMLComponent.js';
import DataGridComponent from '../../Extensions/DashboardPlugins/DataGridComponent.js';
import Layout from '../Layout/Layout.js';
import Row from '../Layout/Row.js';
import Globals from '../Globals.js';
import DataTable from '../../Data/DataTable';
import U from '../../Core/Utilities.js';
const {
    fireEvent,
    addEvent,
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
        options: Bindings.ComponentOptions,
        cell?: Cell
    ): ComponentTypes | undefined {
        const componentContainer = document.getElementById(options.cell);
        const optionsStates = options.states;
        const optionsEvents = options.events;

        cell = cell || Bindings.getCell(options.cell);
        let component: ComponentTypes|undefined;

        // add elements to containers
        if (componentContainer) {
            const ComponentClass = Component.getComponent(options.type);

            switch (options.type) {
                case 'html':
                    component = new HTMLComponent(merge(
                        options,
                        {
                            parentElement: componentContainer,
                            elements: options.elements
                        })
                    );
                    break;
                case 'Highcharts':
                    if (ComponentClass) {
                        component = new ComponentClass(merge(
                            options,
                            {
                                parentElement: componentContainer,
                                chartOptions: options.chartOptions,
                                dimensions: options.dimensions
                            }
                        )) as HighchartsComponent;
                    }
                    break;
                case 'DataGrid':
                    if (ComponentClass) {
                        component = new ComponentClass(merge(
                            options,
                            {
                                parentElement: componentContainer
                            })
                        ) as DataGridComponent;
                    }
                    break;
                case 'KPI':
                    if (ComponentClass) {
                        component = new ComponentClass(merge(
                            options,
                            {
                                parentElement: componentContainer
                            })
                        ) as KPIComponent;
                    }
                    break;
                default:
                    return;
            }

            if (component) {
                component.render();
            }

            // update cell size (when component is wider, cell should adjust)
            // this.updateSize();
        }

        // add events
        if (component) {
            fireEvent(component, 'mount');
        }

        if (cell && component) {
            component.setCell(cell);
            cell.mountedComponent = component;

            cell.row.layout.board.mountedComponents.push({
                options: options,
                component: component,
                cell: cell
            });

            // events
            if (optionsEvents && optionsEvents.click) {
                addEvent(componentContainer, 'click', ():void => {
                    optionsEvents.click();

                    if (
                        cell &&
                        component &&
                        componentContainer &&
                        optionsStates &&
                        optionsStates.active
                    ) {
                        cell.setActiveState();
                    }
                });
            }

            // states
            if (
                componentContainer &&
                optionsStates &&
                optionsStates.hover
            ) {
                componentContainer.classList.add(
                    Globals.classNames.cellHover
                );
            }
        }

        if (component) {
            fireEvent(component, 'afterLoad');
        }

        return component;
    }

    public static componentFromJSON(
        json: HTMLComponent.ClassJSON|HighchartsComponent.ClassJSON,
        cellContainer: HTMLElement|undefined
    ): (Component|undefined) {
        let component: (Component|undefined);
        let componentClass;

        switch (json.$class) {
            case 'HTML':
                component = HTMLComponent.fromJSON(
                    json as HTMLComponent.ClassJSON
                );
                break;
            case 'Highcharts':
                componentClass = Component.getComponent(json.$class);
                if (componentClass) {
                    component = (componentClass as unknown as Serializable<Component, typeof json>).fromJSON(json);
                }
                break;
            case 'DataGrid':
                component = DataGridComponent.fromJSON(
                    json as DataGridComponent.ClassJSON
                );
                break;
            // case 'kpi':
            //     component = KPIComponent.fromJSON(
            //         json as KPIComponent.ClassJSON
            //     );
            //     break;
            default:
                return;
        }

        if (component) {
            component.render();
        }

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
        states?: any;
    }
    export interface MountedComponentsOptions {
        options: any;
        component?: ComponentTypes;
        cell: Cell;
    }
}

export default Bindings;
