/* *
 *
 *  (c) 2009-2024 Highsoft AS
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
import Board from '../Board';
const {
    addEvent,
    fireEvent,
    error
} = U;

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
        cell: Cell|Cell.DOMCell;
        component: ComponentType;
        options: Partial<Component.Options>;
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

    export async function addComponent(
        options: Partial<ComponentType['options']>,
        board: Board,
        cell?: Cell
    ): Promise<(Component|void)> {
        const optionsStates = (options as any).states;
        const optionsEvents = options.events;
        const renderTo = options.renderTo || options.cell;

        if (!renderTo) {
            error(
                'The `renderTo` option is required to render the component.'
            );
            return;
        }

        cell = cell || Bindings.getCell(renderTo);

        const componentContainer =
            cell?.container || document.querySelector('#' + renderTo);

        if (!componentContainer || !options.type) {
            error(
                'The component is misconfigured and is unable to find the' +
                'HTML cell element ${renderTo} to render the content.'
            );
            return;
        }

        let ComponentClass =
            ComponentRegistry.types[options.type] as Class<ComponentType>;

        if (!ComponentClass) {
            error(
                `The component's type ${options.type} does not exist.`
            );

            if (cell) {
                ComponentClass =
                    ComponentRegistry.types['HTML'] as Class<ComponentType>;

                options.title = {
                    text: board.editMode?.lang.errorMessage ||
                        'Something went wrong',
                    className:
                        Globals.classNamePrefix + 'component-title-error ' +
                        Globals.classNamePrefix + 'component-title'
                };
            }
        }

        const component = new ComponentClass(cell, options, board);
        const promise = component.load()['catch']((e): void => {
            // eslint-disable-next-line no-console
            console.error(e);
            component.update({
                connector: {
                    id: ''
                },
                title: {
                    text: board.editMode?.lang.errorMessage ||
                        'Something went wrong',
                    className:
                        Globals.classNamePrefix + 'component-title-error ' +
                        Globals.classNamePrefix + 'component-title'
                }
            });
        });

        if (cell) {
            component.setCell(cell);
            cell.mountedComponent = component;
        }


        board.mountedComponents.push({
            options: options,
            component: component,
            cell: cell || {
                id: renderTo,
                container: componentContainer as HTMLElement,
                mountedComponent: component
            }
        });

        fireEvent(component, 'mount');

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
        if (optionsStates?.hover) {
            componentContainer.classList.add(Globals.classNames.cellHover);
        }

        fireEvent(component, 'afterLoad');

        return promise;
    }

    /** @internal */
    export function componentFromJSON(
        json: Component.JSON
    ): (Component|undefined) {
        let componentClass = ComponentRegistry.types[
            json.$class as keyof ComponentTypeRegistry
        ];

        if (!componentClass) {
            return;
        }

        const cell = Bindings.getCell(json.options.renderTo || '');
        if (!cell) {
            return;
        }
        const component = componentClass.fromJSON(json as any, cell);

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
