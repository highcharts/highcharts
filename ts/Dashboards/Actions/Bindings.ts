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

import type {
    ComponentClassType,
    ComponentType
} from '../Components/ComponentType';
import type GUIElement from '../Layout/GUIElement';
import type HighchartsComponent from '../../Extensions/DashboardPlugins/HighchartsComponent';
import type KPIComponent from '../Components/KPIComponent';
import type Cell from '../Layout/Cell';
import type Layout from '../Layout/Layout';
import type Row from '../Layout/Row';

import Component from '../Components/Component.js';
import HTMLComponent from '../Components/HTMLComponent.js';
import DataGridComponent from '../../Extensions/DashboardPlugins/DataGridComponent.js';
import Globals from '../Globals.js';
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
        options: Partial<Component.ComponentOptions>,
        cell?: Cell
    ):(Component|undefined) {
        // TODO: Check if there are states in the options, and if so, add them
        const optionsStates = (options as any).states;
        const optionsEvents = options.events;

        cell = cell || Bindings.getCell(options.cell || '');

        if (!cell || !cell.container || !options.type) {
            return;
        }

        const componentContainer = cell.container;

        const ComponentClass =
            Component.getComponent(options.type) as Class<Component>;

        if (!ComponentClass) {
            return;
        }

        let componentOptions = merge<Partial<ComponentType['options']>>(
            options,
            {
                parentElement: componentContainer
            }
        );

        const component = new ComponentClass(componentOptions);

        component.render();
        // update cell size (when component is wider, cell should adjust)
        // this.updateSize();

        // add events
        fireEvent(component, 'mount');


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
            optionsStates &&
            optionsStates.hover
        ) {
            componentContainer.classList.add(
                Globals.classNames.cellHover
            );
        }

        fireEvent(component, 'afterLoad');

        return component;
    }

    public static componentFromJSON(
        json: Component.JSON,
        cellContainer: HTMLElement|undefined
    ): (Component|undefined) {
        let component: (ComponentType|undefined);
        let componentClass: (ComponentClassType|undefined);

        switch (json.$class) {
            case 'HTML':
                component = HTMLComponent.fromJSON(
                    json as HTMLComponent.ClassJSON
                );
                break;
            case 'Highcharts':
                componentClass = Component.getComponent('Highcharts');
                if (componentClass) {
                    component = componentClass
                        .fromJSON(json as HighchartsComponent.ClassJSON);
                }
                break;
            case 'DataGrid':
                component = DataGridComponent.fromJSON(
                    json as DataGridComponent.ClassJSON
                );
                break;
            case 'KPI':
                componentClass = Component.getComponent('KPI');
                if (componentClass) {
                    component = componentClass
                        .fromJSON(json as KPIComponent.ClassJSON);
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

        // TODO - events

        return component;
    }

    public static getCell(idOrElement: string): Cell|undefined {
        const cell = Bindings.getGUIElement(idOrElement);

        if (!(cell && cell.getType() === 'cell')) {
            return;
        }

        return (cell as Cell);
    }

    public static getRow(idOrElement: string): Row|undefined {
        const row = Bindings.getGUIElement(idOrElement);

        if (!(row && row.getType() === 'row')) {
            return;
        }

        return (row as Row);
    }

    public static getLayout(idOrElement: string): Layout|undefined {
        const layout = Bindings.getGUIElement(idOrElement);

        if (!(layout && layout.getType() === 'layout')) {
            return;
        }

        return layout as Layout;
    }
}

namespace Bindings {

    export interface MountedComponentsOptions {
        options: any;
        component?: Component;
        cell: Cell;
    }
}

export default Bindings;
