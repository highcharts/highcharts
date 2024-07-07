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
 *  - Pawel Lysy
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Component from './Components/Component';
import type ComponentType from './Components/ComponentType';
import type DataPoolOptions from '../Data/DataPoolOptions';
import type JSON from './JSON';
import type EditMode from './EditMode/EditMode';
import type Fullscreen from './EditMode/Fullscreen';

import Bindings from './Actions/Bindings.js';
import ComponentRegistry from './Components/ComponentRegistry.js';
import DashboardsAccessibility from './Accessibility/DashboardsAccessibility.js';
import DataCursor from '../Data/DataCursor.js';
import DataCursorHelper from './SerializeHelper/DataCursorHelper.js';
import DataPool from '../Data/DataPool.js';
import Globals from './Globals.js';
import Layout from './Layout/Layout.js';
import Serializable from './Serializable.js';
import HTMLComponent from './Components/HTMLComponent/HTMLComponent.js';
import U from '../Core/Utilities.js';
const {
    merge,
    addEvent,
    error,
    objectEach,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class that represents a dashboard.
 *
 * @example
 * const dashboard = Dashboards.board('container', {
 *      gui: {
 *          layouts: [{
 *              id: 'layout-1',
 *              rows: [{
 *                  cells: [{
 *                      id: 'dashboard-col-0'
 *                  }]
 *              }]
 *          }]
 *      },
 *      components: [{
 *          cell: 'dashboard-col-0',
 *          type: 'Highcharts',
 *          chartOptions: {
 *              series: [{
 *                  data: [1, 2, 3, 4]
 *              }]
 *          }
 *      }]
 * });
 */
class Board implements Serializable<Board, Board.JSON> {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Factory function for creating a new dashboard.
     *
     * @param renderTo
     * The DOM element to render to, or its id.
     *
     * @param options
     * The options for the dashboard.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When false or
     * undefined, the function returns the dashboard instance.
     */
    public static board(
        renderTo: (string | globalThis.HTMLElement),
        options: Board.Options,
        async?: boolean
    ): Board;

    /**
     * Factory function for creating a new dashboard.
     *
     * @param renderTo
     * The DOM element to render to, or its id.
     *
     * @param options
     * The options for the dashboard.
     *
     * @param async
     * Whether to initialize the dashboard asynchronously. When true, the
     * function returns a promise that resolves with the dashboard instance.
     */
    public static board(
        renderTo: (string | globalThis.HTMLElement),
        options: Board.Options,
        async: true
    ): Promise<Board>;

    // Implementation:
    public static board(
        renderTo: (string | globalThis.HTMLElement),
        options: Board.Options,
        async?: boolean
    ): (Board | Promise<Board>) {
        return new Board(renderTo, options).init(async);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a dashboard with components like charts, tables, and HTML
     * elements.
     *
     * @internal
     * @param renderTo
     * The DOM element to render to, or its id.
     *
     * @param options
     * The options for the dashboard.
     */
    protected constructor(
        renderTo: (string | HTMLElement),
        options: Board.Options
    ) {
        this.options = merge(Board.defaultOptions, options);
        this.dataPool = new DataPool(options.dataPool);
        this.id = uniqueKey();
        this.guiEnabled = !options.gui ?
            false : this.options?.gui?.enabled;
        this.editModeEnabled = !options.editMode ?
            false : this.options?.editMode?.enabled;
        this.layouts = [];
        this.mountedComponents = [];

        this.initContainer(renderTo);
        this.initEditMode();

        // Add table cursors support.
        this.dataCursor = new DataCursor();

        this.index = Globals.boards.length;
        Globals.boards.push(this);

        // A11y module
        this.a11y = new DashboardsAccessibility(this);
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The accessibility module for the dashboard.
     * @internal
     * */
    public a11y: DashboardsAccessibility;

    /**
     * The container referenced by the `renderTo` option when creating the
     * dashboard.
     * @internal
     * */
    public boardWrapper!: HTMLElement;

    /**
     * The main container for the dashboard. Created inside the element
     * specified by user when creating the dashboard.
     * */
    public container!: HTMLElement;

    /**
     * All types of components available in the dashboard.
     * @internal
     */
    public componentTypes = ComponentRegistry.types;

    /**
     * The data cursor instance used for interacting with the data.
     * @internal
     * */
    public dataCursor: DataCursor;

    /**
     * The data pool instance with all the connectors.
     * */
    public dataPool: DataPool;

    /**
     * The edit mode instance. Used to handle editing the dashboard.
     * @internal
     * */
    public editMode?: EditMode;

    /**
     * The fullscreen instance. Controls the fullscreen mode.
     * @internal
     * */
    public fullscreen?: Fullscreen;

    /**
     * Flag to determine if the GUI is enabled.
     * @internal
     * */
    public guiEnabled?: boolean;

    /**
     * Flag to determine if the EditMode is enabled.
     * @internal
     * */
    public editModeEnabled?: boolean;

    /**
     * The unique id of the dashboard, it is generated automatically.
     * */
    public readonly id: string;

    /**
     * Index of the board in the global boards array. Allows to access the
     * specific one when having multiple dashboards.
     * */
    public readonly index: number;

    /**
     * An array of generated layouts.
     * */
    public layouts: Array<Layout>;

    /**
     * The wrapper for the layouts.
     * @internal
     * */
    public layoutsWrapper?: globalThis.HTMLElement;

    /**
     * An array of mounted components on the dashboard.
     * */
    public mountedComponents: Array<Bindings.MountedComponent>;

    /**
     * The options for the dashboard.
     * */
    public options: Board.Options;

    /**
     * Reference to ResizeObserver, which allows running 'unobserve'.
     * @internal
     */
    private resizeObserver?: ResizeObserver;


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Init the layouts and components on the dashboard.
     *
     * @internal
     * @param async Whether to initialize the dashboard asynchronously. When
     * false or undefined the function returns the dashboard instance.
     *  instance.
     *
     * @returns
     * Board instance
     */
    protected init(async?: boolean): Board;

    /**
     * Init the layouts and components on the dashboard, and attaches connectors
     * if they are defined on component level.
     *
     * @internal
     * @param async Whether to initialize the dashboard asynchronously. When
     * true, the function returns a promise that resolves with the dashboard
     *  instance.
     *
     * @returns
     * A promise that resolves with the dashboard instance.
     */
    protected init(async: true): Promise<Board>;

    // Implementation:
    protected init(async?: boolean): (Board | Promise<Board>) {
        const options = this.options;

        const componentPromises = (options.components) ?
            this.setComponents(options.components) : [];

        // Init events.
        this.initEvents();

        if (async) {
            return Promise.all(componentPromises).then((): Board => this);
        }

        return this;
    }
    /**
     * Initializes the events.
     * @internal
     */
    private initEvents(): void {
        const board = this,
            runReflow = (): void => {
                board.reflow();
            };

        if (typeof ResizeObserver === 'function') {
            this.resizeObserver = new ResizeObserver(runReflow);
            this.resizeObserver.observe(board.container);
        } else {
            const unbind = addEvent(window, 'resize', runReflow);
            addEvent(this, 'destroy', unbind);
        }
    }

    /**
     * Initialize the container for the dashboard.
     * @internal
     *
     * @param renderTo
     * The DOM element to render to, or its id.
     */
    private initContainer(renderTo: (string | HTMLElement)): void {
        const board = this;

        if (typeof renderTo === 'string') {
            renderTo = window.document.getElementById(renderTo) as HTMLElement;
        }

        // Display an error if the renderTo doesn't exist.
        if (!renderTo) {
            error(13, true);
        }

        board.container = renderTo;
    }

    /**
     * Inits creating a layouts and setup the EditMode tools.
     * @internal
     *
     */
    private initEditMode():void {
        if (Dashboards.EditMode) {
            this.editMode = new Dashboards.EditMode(
                this,
                this.options.editMode
            );
        } else if (this.editModeEnabled) {
            throw new Error('Missing layout.js module');
        }
    }

    /**
     * Set the components from options.
     * @internal
     *
     * @param components
     * An array of component options.
     *
     */
    public setComponents(
        components: Array<Partial<ComponentType['options']>>
    ): Array<Promise<Component | void>> {
        const promises = [];
        const board = this;
        for (let i = 0, iEnd = components.length; i < iEnd; ++i) {
            promises.push(Bindings.addComponent(components[i], board));
        }
        return promises;
    }

    /**
     * Destroy the whole dashboard, its layouts and elements.
     */
    public destroy(): void {
        const board = this;

        // Destroy layouts.
        for (let i = 0, iEnd = board.layouts?.length; i < iEnd; ++i) {
            board.layouts[i].destroy();
        }

        // Remove resizeObserver from the board
        this.resizeObserver?.unobserve(board.container);

        // Destroy container.
        board.container?.remove();

        // @ToDo Destroy bindings.

        // Delete all properties.
        objectEach(board, function (val: unknown, key: string): void {
            delete (board as Record<string, any>)[key];
        });

        Globals.boards[this.index] = void 0;

        return;
    }

    /**
     * Export layouts to the local storage.
     */
    public exportLocal(): void {
        localStorage.setItem(
            // Dashboard.prefix + this.id,
            Globals.classNamePrefix + '1', // Temporary for demo test
            JSON.stringify(this.toJSON())
        );
    }

    /**
     * Import the dashboard's layouts from the local storage.
     *
     * @param id
     * The id of the layout to import.
     *
     * @returns Returns the imported layout.
     */
    public importLayoutLocal(id: string): Layout | undefined {
        return Layout.importLocal(id, this);
    }

    /**
     * Reflow the dashboard. Hide the toolbars and context pointer. Reflow the
     * layouts and its cells.
     */
    public reflow(): void {
        const board = this;

        if (board.editMode) {
            const editModeTools = board.editMode.tools;

            board.editMode.hideToolbars(['cell', 'row']);
            board.editMode.hideContextPointer();

            // Update expanded context menu container
            if (editModeTools.contextMenu) {
                editModeTools.contextMenu
                    .updatePosition(editModeTools.contextButtonElement);
            }
        }
    }

    /**
     * Converts the given JSON to a class instance.
     *
     * @param json
     * JSON to deserialize as a class instance or object.
     *
     * @returns Returns the class instance or object.
     */
    public fromJSON(
        json: Board.JSON
    ): Board {
        const options = json.options,
            board = new Board(
                options.containerId,
                {
                    componentOptions: options.componentOptions as
                        Partial<Component.Options>,
                    dataPool: options.dataPool,
                    layoutsJSON: options.layouts
                }
            );

        board.dataCursor = DataCursorHelper.fromJSON(json.dataCursor);

        return board;
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @returns Class JSON of this Dashboard instance.
     */
    public toJSON(): Board.JSON {
        const board = this,
            layouts = [];

        // Get layouts JSON.
        for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
            layouts.push(board.layouts[i].toJSON());
        }

        return {
            $class: 'Board',
            dataCursor: DataCursorHelper.toJSON(board.dataCursor),
            options: {
                containerId: board.container.id,
                dataPool: board.options.dataPool as
                    DataPoolOptions & JSON.Object,
                guiEnabled: board.guiEnabled,
                layouts: layouts,
                componentOptions: board.options.componentOptions as
                    Partial<Component.ComponentOptionsJSON>
            }
        };
    }

    /**
     * Convert the current state of board's options into JSON. The function does
     * not support converting functions or events into JSON object.
     *
     * @returns
     * The JSON of boards's options.
     */
    public getOptions(): Globals.DeepPartial<Board.Options> {
        const board = this,
            options: Globals.DeepPartial<Board.Options> = {
                ...this.options,
                components: []
            };

        for (let i = 0, iEnd = board.mountedComponents.length; i < iEnd; ++i) {
            if (
                board.mountedComponents[i].cell &&
                board.mountedComponents[i].cell.mountedComponent
            ) {
                options.components?.push(
                    board.mountedComponents[i].component.getOptions()
                );
            }
        }

        if (this.guiEnabled) {
            options.gui = {
                layouts: []
            };
            for (let i = 0, iEnd = board.layouts.length; i < iEnd; ++i) {
                options.gui.layouts?.push(
                    board.layouts[i].getOptions() as Layout.Options
                );
            }
        } else {
            delete options.gui;
        }

        return options;
    }

    /**
     * Get a Dashboards component by its identifier.
     *
     * @param id
     * The identifier of the requested component.
     *
     * @returns
     * The component with the given identifier.
     */
    public getComponentById(id: string): ComponentType | undefined {
        return this.mountedComponents.find(
            (c): boolean => c.component.id === id
        )?.component;
    }

    /**
     * Get a Dashboards component by its cell identifier.
     *
     * @param id
     * The identifier of the cell that contains the requested component.
     *
     * @returns
     * The component with the given cell identifier.
     */
    public getComponentByCellId(id: string): ComponentType | undefined {
        return this.mountedComponents.find(
            (c): boolean => c.cell.id === id
        )?.component;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Board {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Options to configure the board.
     **/
    export interface Options {
        /**
         * Data pool with all of the connectors.
         **/
        dataPool?: DataPoolOptions;
        /**
         * Options for the GUI. Allows to define graphical elements and its
         * layout.
         **/
        gui?: GUIOptions;
        /**
         * Options for the edit mode. Can be used to enable the edit mode and
         * define all things related to it like the context menu.
         **/
        editMode?: EditMode.Options;
        /**
         * List of components to add to the board.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/component-highcharts | Highcharts component}
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/component-html | HTML component}
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/component-kpi | KPI component}
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/components/custom-component | Custom component}
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/datagrid-component/datagrid-options | Datagrid component}
         *
         **/
        components?: Array<Partial<ComponentType['options']>>;
        /**
         * General options for the components.
         **/
        componentOptions?: Partial<Component.Options>;
        /**
         * A list of serialized layouts to add to the board.
         * @internal
         **/
        layoutsJSON?: Array<Layout.JSON>;
        /**
         * Before changing the styling of the Dashboards layout to fully CSS, it
         * was responsible for responsive breakpoints for the board - small,
         * medium and large.
         *
         * @deprecated
         **/
        responsiveBreakpoints?: ResponsiveBreakpoints;
    }

    /**
     * Serialized options to configure the board.
     * @internal
     **/
    export interface OptionsJSON extends JSON.Object {
        /**
         * General options for the components in JSON format.
         **/
        componentOptions?: Partial<Component.ComponentOptionsJSON>;
        /**
         * List of components to add to the board in JSON format.
         **/
        components?: Array<Component.ComponentOptionsJSON>;
        /**
         * Id of the container to which the board is added.
         **/
        containerId: string;
        /**
         * Data pool with all of the connectors.
         **/
        dataPool?: DataPoolOptions & JSON.Object;
        /**
         * An array of serialized layouts options and their elements to add to
         * the board.
         **/
        layouts: Array<Layout.JSON>;
        /**
         * Whether the GUI is enabled or not.
         **/
        guiEnabled?: boolean;
        /**
         * Before changing the styling of the Dashboards layout to fully CSS, it
         * was responsible for responsive breakpoints for the board - small,
         * medium and large.
         *
         * @deprecated
         **/
        responsiveBreakpoints?: ResponsiveBreakpoints;
    }

    /**
     * Responsive breakpoints for the board - small, medium and large.
     *
     * @deprecated
     **/
    export interface ResponsiveBreakpoints extends JSON.Object {
        /**
         * Value in px to test the dashboard is in small mode.
         *
         * @deprecated
         **/
        small: number;
        /**
         * Value in px to test the dashboard is in medium mode.
         *
         * @deprecated
         **/
        medium: number;
        /**
         * Value in px to test the dashboard is in large mode.
         *
         * @deprecated
         **/
        large: number;
    }

    export interface GUIOptions {
        /**
         * Whether the GUI is enabled or not.
         *
         * @default true
         **/
        enabled?: boolean;
        /**
         * General options for the layouts applied to all layouts.
         **/
        layoutOptions?: Partial<Layout.Options>;
        /**
         * Allows to define graphical elements and its layout. The layout is
         * defined by the row and cells. The row is a horizontal container for
         * the cells. The cells are containers for the elements. The layouts
         * can be nested inside the cells.
         **/
        layouts: Array<Layout.Options>;
    }

    /** @internal */
    export interface JSON extends Serializable.JSON<'Board'> {
        /**
         * Serialized data cursor of the board.
         **/
        dataCursor: DataCursorHelper.JSON;
        /**
         * Serialized options to configure the board.
         **/
        options: OptionsJSON;
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Global dashboard settings.
     * @internal
     *
     */
    export const defaultOptions: Board.Options = {
        gui: {
            enabled: true,
            layoutOptions: {
                rowClassName: void 0,
                cellClassName: void 0
            },
            layouts: []
        },
        components: []
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Import layouts from the local storage.
     *
     * @returns Returns the Dashboard instance or undefined.
     */
    export function importLocal(): (Board | undefined) {
        const dashboardJSON = localStorage.getItem(
            // Dashboard.prefix + this.id,
            Globals.classNamePrefix + '1' // Temporary for demo test
        );

        if (dashboardJSON) {
            try {
                return Serializable
                    .fromJSON(JSON.parse(dashboardJSON)) as Board;
            } catch (e) {
                throw new Error('' + e);
            }
        }
    }

}

/* *
 *
 *  Registry
 *
 * */

Serializable.registerClassPrototype('Board', Board.prototype);
ComponentRegistry.registerComponent('HTML', HTMLComponent);

/* *
 *
 *  Default Export
 *
 * */

export default Board;
