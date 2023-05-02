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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    ComponentType,
    ComponentTypeRegistry
} from '../Components/ComponentType';
import type GUIElement from '../Layout/GUIElement';
import type Cell from '../Layout/Cell';
import type Layout from '../Layout/Layout';
import type Row from '../Layout/Row';
import type Component from '../Components/Component.js';

import ComponentRegistry from '../Components/ComponentRegistry.js';
import Globals from '../Globals.js';
import U from '../../Core/Utilities.js';
const { merge, addEvent, fireEvent } = U;

/* *
 *
 *  Namespace
 *
 * */

namespace Bindings {

    /* *
     *
     *  Declarations
     *
     * */

    export interface MountedComponent {
        cell: Cell;
        component: Component;
        options: Partial<Component.ComponentOptions>;
    }

    /* *
     *
     *  Functions
     *
     * */

    function getGUIElement(
        idOrElement: string
    ): (GUIElement|undefined) {
        const container = typeof idOrElement === 'string' ?
            document.getElementById(idOrElement) : idOrElement;

        let guiElement;

        if (container !== null) {
            fireEvent(container, 'bindedGUIElement', {}, function (
                e: GUIElement.BindedGUIElementEvent
            ): void {
                guiElement = e.guiElement;
            });
        }

        return guiElement;
    }

    export function addComponent(
        options: Partial<Component.ComponentOptions>,
        cell?: Cell
    ): (Component|undefined) {
        // TODO: Check if there are states in the options, and if so, add them
        const optionsStates = (options as any).states;
        const optionsEvents = options.events;

        cell = cell || Bindings.getCell(options.cell || '');

        if (!cell || !cell.container || !options.type) {
            return;
        }

        const componentContainer = cell.container;

        const ComponentClass =
            ComponentRegistry.getComponent(options.type) as Class<Component>;

        if (!ComponentClass) {
            return;
        }

        let componentOptions = merge<Partial<ComponentType['options']>>(
            options,
            {
                board: cell && cell.row.layout.board,
                parentCell: cell,
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
            componentContainer.classList.add(Globals.classNames.cellHover);
        }

        fireEvent(component, 'afterLoad');

        return component;
    }

    /** @internal */
    export function componentFromJSON(
        json: Component.JSON,
        cellContainer: (HTMLElement|undefined) // @todo
    ): (Component|undefined) {
        let componentClass = ComponentRegistry.getComponent(
            json.$class as keyof ComponentTypeRegistry
        );

        if (!componentClass) {
            return;
        }
        const component = componentClass.fromJSON(json as any);

        if (component) {
            component.render();
        }

        return component;
    }

    export function getCell(
        idOrElement: string
    ): (Cell|undefined) {
        const cell = getGUIElement(idOrElement);

        if (!(cell && cell.getType() === 'cell')) {
            return;
        }

        return (cell as Cell);
    }

    export function getRow(
        idOrElement: string
    ): (Row|undefined) {
        const row = getGUIElement(idOrElement);

        if (!(row && row.getType() === 'row')) {
            return;
        }

        return (row as Row);
    }

    export function getLayout(
        idOrElement: string
    ): (Layout|undefined) {
        const layout = getGUIElement(idOrElement);

        if (!(layout && layout.getType() === 'layout')) {
            return;
        }

        return layout as Layout;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Bindings;
