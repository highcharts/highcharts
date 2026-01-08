/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AnyRecord } from '../../Shared/Types';
import type Board from '../Board';
import type {
    ComponentType,
    ComponentTypeRegistry
} from './ComponentType';
import type DataConnectorType from '../../Data/Connectors/DataConnectorType';
import type Row from '../Layout/Row';
import type SidebarPopup from '../EditMode/SidebarPopup';
import type TextOptions from './TextOptions';

import Cell from '../Layout/Cell.js';
import CellHTML from '../Layout/CellHTML.js';
import CallbackRegistry from '../CallbackRegistry.js';
import ConnectorHandler from './ConnectorHandler.js';
import DataTable from '../../Data/DataTable.js';
import EditableOptions from './EditableOptions.js';
import Sync from './Sync/Sync.js';

import Globals from '../Globals.js';
const { classNamePrefix } = Globals;

import U from '../../Core/Utilities.js';
const {
    createElement,
    isArray,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    getStyle,
    diffObjects,
    removeEvent
} = U;

import CU from './ComponentUtilities.js';
const {
    getMargins,
    getPaddings
} = CU;

import DU from '../Utilities.js';
const {
    deepClone,
    uniqueKey
} = DU;

/* *
 *
 *  Class
 *
 * */

/**
 * Abstract class of component.
 */
abstract class Component {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates HTML text element like header or title
     *
     * @param tagName
     * HTML tag name used as wrapper of text like `h2` or `p`.
     *
     * @param elementName
     * Name of element
     *
     * @param textOptions
     * The options for the component
     *
     * @returns
     * HTML object when title is created, otherwise undefined
     *
     * @internal
     */
    public static createTextElement(
        tagName: string,
        elementName: string,
        textOptions: Component.TextOptionsType
    ): HTMLElement | undefined {
        if (typeof textOptions === 'object') {
            const { className, text, style } = textOptions;
            return createElement(
                tagName,
                {
                    className: className || `${classNamePrefix}component-${elementName}`,
                    textContent: text
                },
                style
            );
        }

        if (typeof textOptions === 'string') {
            return createElement(
                tagName,
                {
                    className: `${classNamePrefix}component-${elementName}`,
                    textContent: textOptions
                },
                {}
            );
        }
    }


    /* *
     *
     *  Static Properties
     *
     * */

    /** @internal */
    public static Sync = Sync;

    /**
     * Predefined sync config for component.
     */
    public static predefinedSyncConfig: Sync.PredefinedSyncConfig = {
        defaultSyncOptions: {},
        defaultSyncPairs: {}
    };

    /**
     * Default options of the component.
     */
    public static defaultOptions: Partial<Component.Options> = {
        className: `${classNamePrefix}component`,
        id: '',
        title: false,
        caption: false,
        sync: Sync.defaultHandlers,
        editableOptions: [{
            name: 'title',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'caption',
            propertyPath: ['caption'],
            type: 'input'
        }]
    };


    /* *
     *
     *  Properties
     *
     * */

    /**
     * The HTML element or id of HTML element that is used for appending
     * a component.
     * @internal
     */
    public parentElement: HTMLElement;

    /**
     * Instance of cell, where component is attached.
     * @internal
     */
    public cell: Cell|CellHTML;

    /**
     * The connector handlers for the component. They are used to handle the
     * connector options and data tables.
     */
    public connectorHandlers: ConnectorHandler[] = [];

    /**
     * The board the component belongs to
     * @internal
     */
    public board: Board;

    /**
     * Size of the component (width and height).
     */
    protected dimensions: { width: number | null; height: number | null };

    /**
     * The HTML element where the component is.
     * @internal
     */
    public element: HTMLElement;

    /**
     * The HTML element where the title is.
     * @internal
     */
    public titleElement?: HTMLElement;

    /**
     * Whether the component state is active.
     */
    public isActive?: boolean;

    /**
     * The HTML element where the caption is.
     */
    public captionElement?: HTMLElement;

    /**
     * The HTML element where the component's content is.
     * @internal
     */
    public contentElement: HTMLElement;

    /**
     * The options for the component.
     */
    public options: Component.Options;

    /**
     * Sets an ID for the component's `div`.
     */
    public id: string;

    /**
     * An array of options marked as editable by the UI.
     */
    public editableOptions: EditableOptions;

    /**
     * Registry of callbacks registered on the component. Used in the Highcharts
     * component to keep track of chart events.
     * @internal
     */
    public callbackRegistry = new CallbackRegistry();

    /**
     * Event listeners tied to the parent cell. Used for rendering/resizing the
     * component on interactions.
     * @internal
     */
    private cellListeners: Function[] = [];

    /**
     * Reference to ResizeObserver, which allows running 'unobserve'.
     * @internal
     */
    private resizeObserver?: ResizeObserver;

    /**
     * The sync handlers for the component.
     */
    protected syncHandlers?: Sync.OptionsRecord;

    /**
     * The sync handler for the component.
     * @internal
     */
    public sync: Sync;

    /**
     * Timeouts for calls to `Component.resizeTo()`.
     * @internal
     */
    protected resizeTimeouts: number[] = [];

    /**
     * Timeouts for resizing the content. I.e. `chart.setSize()`.
     * @internal
     */
    protected innerResizeTimeouts: number[] = [];


    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a component in the cell.
     *
     * @param cell
     * Instance of cell, where component is attached.
     *
     * @param options
     * The options for the component.
     */
    constructor(
        cell: Cell,
        options: Partial<Component.Options>,
        board?: Board
    ) {
        const renderTo = options.renderTo;
        this.board = board || cell?.row?.layout?.board || {};
        this.parentElement =
            cell?.container || document.querySelector('#' + renderTo);
        this.cell = cell;

        this.options = merge(
            Component.defaultOptions as Required<Component.Options>,
            options
        );

        this.id = this.options.id && this.options.id.length ?
            this.options.id :
            uniqueKey();

        if (this.options.connector) {
            const connectorOptionsArray = isArray(this.options.connector) ?
                this.options.connector :
                [this.options.connector];

            for (const connectorOptions of connectorOptionsArray) {
                this.connectorHandlers.push(
                    new ConnectorHandler(this, connectorOptions)
                );
            }
        }

        this.editableOptions =
            new EditableOptions(this, options.editableOptionsBindings);

        this.dimensions = {
            width: null,
            height: null
        };

        this.element = createElement(
            'div',
            {
                className: this.options.className
            },
            {},
            this.parentElement
        );

        if (!Number(getStyle(this.element, 'padding'))) {
            // Fix flex problem, because of wrong height in internal elements
            this.element.style.padding = '0.1px';
        }

        this.contentElement = createElement(
            'div', {
                className: `${this.options.className}-content`
            },
            {},
            this.element,
            true
        );

        this.sync = new Sync(
            this,
            (this.constructor as typeof Component).predefinedSyncConfig
        );

        this.setupEventListeners();

        if (cell) {
            this.attachCellListeners();

            this.on('update', (): void => {
                if (Cell.isCell(this.cell)) {
                    this.cell.setLoadingState();
                }
            });

            this.on('afterRender', (): void => {
                if (Cell.isCell(this.cell)) {
                    this.cell.setLoadingState(false);
                }
            });
        }

        this.on('tableChanged', (): void => {
            this.onTableChanged();
        });
    }


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Function fired when component's data source's data is changed.
     */
    public abstract onTableChanged(e?: Component.EventTypes): void;

    /**
     * Returns the component's options when it is dropped from the sidebar.
     *
     * @param sidebar
     * The sidebar popup.
     */
    public getOptionsOnDrop(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sidebar: SidebarPopup
    ): Partial<ComponentType['options']> {
        return {};
    }

    /**
     * Returns the first connector of the component if it exists.
     *
     * @internal
     * @deprecated
     */
    public getFirstConnector(): Component.ConnectorTypes | undefined {
        return this.connectorHandlers[0]?.connector;
    }

    /**
     * Returns the data table connected to the component by the `connectorId`
     * and `dataTableKey`. If both args are undefined, the first data table is
     * returned.
     *
     * @param connectorId
     * The id of the connector.
     *
     * @param dataTableKey
     * The key of the data table within the connector.
     *
     * @returns
     * The data table, or undefined if no matching handler is found.
     */
    public getDataTable(
        connectorId?: string,
        dataTableKey?: string
    ): DataTable | undefined {
        for (const handler of this.connectorHandlers) {
            if ((
                !connectorId ||
                handler.options.id === connectorId
            ) && (
                !dataTableKey ||
                handler.options.dataTableKey === dataTableKey
            )) {
                return handler.dataTable;
            }
        }
    }

    /**
     * Setup listeners on cell/other things up the chain
     * @internal
     */
    private attachCellListeners(): void {
        // Remove old listeners
        while (this.cellListeners.length) {
            const destroy = this.cellListeners.pop();
            if (destroy) {
                destroy();
            }
        }

        if (
            this.cell &&
            Cell.isCell(this.cell) &&
            Object.keys(this.cell).length
        ) {
            const board = this.cell.row.layout.board;
            this.cellListeners.push(
                // Listen for resize on dashboard
                addEvent(board, 'cellResize', (): void => {
                    this.resizeTo(this.parentElement);
                }),
                // Listen for changed parent
                addEvent(
                    this.cell.row,
                    'cellChange',
                    (e: { row: Row }): void => {
                        const { row } = e;
                        if (row && this.cell) {
                            const hasLeftTheRow =
                                row.getCellIndex(this.cell as Cell) === void 0;
                            if (hasLeftTheRow) {
                                if (this.cell) {
                                    this.setCell(this.cell as Cell);
                                }
                            }
                        }
                    }
                )
            );

        }
    }

    /**
     * Set a parent cell.
     *
     * @param cell
     * Instance of a cell.
     *
     * @param resize
     * Flag that allow to resize the component.
     *
     * @internal
     */
    public setCell(cell: Cell, resize = false): void {
        this.cell = cell;
        if (cell.container) {
            this.parentElement = cell.container;
        }
        this.attachCellListeners();
        if (resize) {
            this.resizeTo(this.parentElement);
        }
    }

    /**
     * Initializes connector handlers for the component.
     */
    public async initConnectors(): Promise<this> {
        fireEvent(this, 'setConnectors', {
            connectorHandlers: this.connectorHandlers
        });

        for (const connectorHandler of this.connectorHandlers) {
            await connectorHandler.initConnector();
        }

        fireEvent(this, 'afterSetConnectors', {
            connectorHandlers: this.connectorHandlers
        });
        return this;
    }

    /**
     * Gets height of the component's content.
     *
     * @returns
     * Current height as number.
     *
     * @internal
     */
    private getContentHeight(): number {
        const titleHeight = this.titleElement ?
            this.titleElement.clientHeight + getMargins(this.titleElement).y :
            0;
        const captionHeight = this.captionElement ?
            this.captionElement.clientHeight +
            getMargins(this.captionElement).y :
            0;

        return titleHeight + captionHeight;
    }

    /**
     * Resize the component
     *
     * @param width
     * The width to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style
     *
     * @param height
     * The height to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style.
     */
    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        if (height) {
            // Get offset for border, padding
            const pad =
                getPaddings(this.element).y + getMargins(this.element).y;
            this.element.style.height = 'calc(100% - ' + pad + 'px)';
            this.contentElement.style.height =
                'calc(100% - ' + this.getContentHeight() + 'px)';
        } else if (height === null) {
            this.dimensions.height = null;
            this.element.style.removeProperty('height');
        }

        fireEvent(this, 'resize', {
            width,
            height
        });
    }

    /**
     * It's a temporary alternative for the `resize` method. It sets the strict
     * pixel height for the component so that the content can be distributed in
     * the right way, without looping the resizers in the content and container.
     *
     * @param width
     * The width to set the component to.
     *
     * @param height
     * The height to set the component to.
     */
    protected resizeDynamicContent(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        const { element } = this;
        if (height) {
            const margins = getMargins(element).y;
            const paddings = getPaddings(element).y;

            if (typeof height === 'string') {
                height = parseFloat(height);
            }
            height = Math.round(height);

            element.style.height = `${height - margins - paddings}px`;
            this.contentElement.style.height = `${
                element.clientHeight - this.getContentHeight() - paddings
            }px`;
        } else if (height === null) {
            this.dimensions.height = null;
            element.style.removeProperty('height');
        }

        fireEvent(this, 'resize', {
            width,
            height
        });
    }

    /**
     * Adjusts size of component to parent's cell size when animation is done.
     *
     * @param element
     * HTML element that is resized.
     */
    public resizeTo(element: HTMLElement): void {
        while (this.resizeTimeouts.length) {
            const timeout = this.resizeTimeouts.pop();
            if (timeout) {
                cancelAnimationFrame(timeout);
            }
        }
        const timeoutID = requestAnimationFrame((): void => {
            const { width, height } = element.getBoundingClientRect();
            const padding = getPaddings(element);
            const margins = getMargins(element);
            this.resize(
                width - padding.x - margins.x,
                height - padding.y - margins.y
            );
        });

        this.resizeTimeouts.push(timeoutID);
    }

    /**
     * Handles updating via options.
     *
     * @param newOptions
     * The options to apply.
     *
     * @param shouldRerender
     * Set to true if the update should rerender the component.
     */
    public async update(
        newOptions: Partial<Component.Options>,
        shouldRerender: boolean = true
    ): Promise<void> {
        const eventObject = {
            options: newOptions,
            shouldForceRerender: false
        };

        // Update options
        fireEvent(this, 'update', eventObject);

        if (newOptions.connector && Array.isArray(this.options.connector)) {
            this.options.connector = void 0;
        }

        this.options = merge(this.options, newOptions);
        const connectorOptions: Array<ConnectorHandler.ConnectorOptions> = (
            this.options.connector ? (
                isArray(this.options.connector) ? this.options.connector :
                    [this.options.connector]
            ) : []
        );

        let connectorsHaveChanged =
            connectorOptions.length !== this.connectorHandlers.length;

        if (!connectorsHaveChanged) {
            for (let i = 0, iEnd = connectorOptions.length; i < iEnd; i++) {
                const oldOptions = this.connectorHandlers[i]?.options;
                const newOptions = connectorOptions[i];

                // Check if the connector id has changed.
                if (oldOptions.id !== newOptions.id) {
                    connectorsHaveChanged = true;
                    break;
                }

                // Check if the data table key has changed.
                if (oldOptions.dataTableKey !== newOptions.dataTableKey) {
                    connectorsHaveChanged = true;
                    break;
                }

                this.connectorHandlers[i].updateOptions(newOptions);
            }
        }

        if (connectorsHaveChanged) {
            for (const connectorHandler of this.connectorHandlers) {
                connectorHandler.destroy();
            }
            this.connectorHandlers.length = 0;

            for (const options of connectorOptions) {
                this.connectorHandlers.push(
                    new ConnectorHandler(this, options)
                );
            }
            await this.initConnectors();
        }

        if (shouldRerender || eventObject.shouldForceRerender) {
            this.render();
        }
    }

    /**
     * Private method which sets up event listeners for the component.
     *
     * @internal
     */
    private setupEventListeners(): void {
        const events = this.options.events;

        if (events) {
            Object.keys(events).forEach((key): void => {
                const eventCallback = (events as any)[key];

                if (eventCallback) {
                    this.callbackRegistry.addCallback(key, {
                        type: 'component',
                        func: eventCallback
                    });
                }
            });
            objectEach(events, (eventCallback, eventType): void => {
                if (isFunction(eventCallback)) {
                    this.on(eventType as any, eventCallback as any);
                }
            });
        }
        const resizeObserverCallback = (): void => {
            this.resizeTo(this.parentElement);
        };

        if (typeof ResizeObserver === 'function') {
            this.resizeObserver = new ResizeObserver(resizeObserverCallback);
            this.resizeObserver.observe(this.element);
        } else {
            const unbind = addEvent(window, 'resize', resizeObserverCallback);
            addEvent(this, 'destroy', unbind);
        }
    }

    /**
     * Adds title at the top of component's container.
     *
     * @param titleOptions
     * The options for the title.
     */
    public setTitle(titleOptions: Component.TextOptionsType): void {
        const titleElement = this.titleElement,
            shouldExist =
                titleOptions &&
                (typeof titleOptions === 'string' || titleOptions.text);

        if (shouldExist) {
            const newTitle = Component.createTextElement(
                'h2',
                'title',
                titleOptions
            );

            if (newTitle) {
                if (!titleElement) {
                    this.element.insertBefore(
                        newTitle,
                        this.element.firstChild
                    );
                } else {
                    titleElement.replaceWith(newTitle);
                }
                this.titleElement = newTitle;
            }
        } else {
            if (titleElement) {
                titleElement.remove();
                delete this.titleElement;

                return;
            }
        }
    }

    /**
     * Adds caption at the bottom of component's container.
     *
     * @param captionOptions
     * The options for the caption.
     */
    public setCaption(captionOptions: Component.TextOptionsType): void {
        const captionElement = this.captionElement,
            shouldExist =
                captionOptions &&
                (typeof captionOptions === 'string' || captionOptions.text);

        if (shouldExist) {
            const newCaption = Component.createTextElement(
                'div',
                'caption',
                captionOptions
            );

            if (newCaption) {
                if (!captionElement) {
                    this.element.appendChild(newCaption);
                } else {
                    captionElement.replaceWith(newCaption);
                }
                this.captionElement = newCaption;
            }
        } else {
            if (captionElement) {
                captionElement.remove();
                delete this.captionElement;

                return;
            }
        }
    }

    /**
     * Handles setting things up on initial render.
     *
     * @returns
     * The component for chaining.
     *
     * @internal
     */
    public async load(): Promise<this> {

        await this.initConnectors();
        this.render();

        return this;
    }

    /**
     * Renders the component.
     *
     * @returns
     * The component for chaining.
     *
     * @internal
     */
    public render(): this {
        this.emit({ type: 'render' });
        this.setTitle(this.options.title);
        this.setCaption(this.options.caption);
        this.resizeTo(this.parentElement);

        return this;
    }

    /**
     * Destroys the component.
     */
    public destroy(): void {
        /**
         * TODO: Should perhaps set an `isActive` flag to false.
         */

        if (this.sync.isSyncing) {
            this.sync.stop();
        }

        while (this.element.firstChild) {
            this.element.firstChild.remove();
        }

        // Call unmount
        fireEvent(this, 'unmount');

        for (const connectorHandler of this.connectorHandlers) {
            connectorHandler.destroy();
        }

        // Used to removed the onTableChanged event.
        removeEvent(this);

        this.element.remove();
    }

    /**
     * Adds an event listener to the component.
     *
     * @param type
     * The type of event to listen for.
     *
     * @param callback
     * The callback to call when the event is triggered.
     *
     * @returns
     * The function to remove the event listener.
     *
     * @internal
     */
    public on<TEvent extends Component.EventTypes>(
        type: TEvent['type'],
        callback: (this: this, e: TEvent) => void
    ): Function {
        return addEvent(this, type, callback);
    }

    /** @internal */
    public emit<TEvent extends Component.EventTypes>(
        e: TEvent
    ): void {
        if (!e.target) {
            e.target = this;
        }
        fireEvent(this, e.type, e);
    }

    /**
     * Get the component's options.
     * @returns
     * The JSON of component's options.
     *
     * @internal
     *
     */
    public getOptions(): Partial<Component.Options> {
        return diffObjects(this.options, Component.defaultOptions);
    }

    public getEditableOptions(): Component.Options {
        const component = this;

        // When refactoring, limit the copied options to the ones that are
        // actually editable to avoid unnecessary memory usage.
        return deepClone(component.options, [
            'dataTable', 'points', 'series', 'data', 'editableOptions'
        ]);
    }


    public getEditableOptionValue(
        propertyPath?: (string|number)[]
    ): number | boolean | undefined | string {
        const component = this;
        if (!propertyPath) {
            return;
        }

        let result = component.getEditableOptions() as any;

        for (let i = 0, end = propertyPath.length; i < end; i++) {
            if (
                isArray(result) &&
                propertyPath[0] === 'connector' &&
                result.length > 1
            ) {
                return 'multiple connectors';
            }

            if (!result) {
                return;
            }

            result = result[propertyPath[i]];

            if (
                result === false &&
                (
                    propertyPath.indexOf('title') >= 0 ||
                    propertyPath.indexOf('subtitle') >= 0 ||
                    propertyPath.indexOf('caption') >= 0
                )
            ) {
                result = '';
            }
        }

        return result;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface Component {
    type: keyof ComponentTypeRegistry;
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Component {

    export type ConnectorOptions = ConnectorHandler.ConnectorOptions;

    /* *
    *
    *  Declarations
    *
    * */

    /**
     * The basic events
     */
    /** @internal */
    export type EventTypes =
        SetConnectorsEvent |
        ResizeEvent |
        UpdateEvent |
        TableChangedEvent |
        LoadEvent |
        RenderEvent |
        PresentationModifierEvent;

    export type SetConnectorsEvent =
        Event<'setConnectors'|'afterSetConnectors', {}>;

    /** @internal */
    export type ResizeEvent = Event<'resize', {
        readonly type: 'resize';
        width?: number;
        height?: number;
    }>;

    /** @internal */
    export type UpdateEvent = Event<'update' | 'afterUpdate', {
        options?: Options;
    }>;

    /** @internal */
    export type LoadEvent = Event<'load' | 'afterLoad', {}>;
    /** @internal */
    export type RenderEvent = Event<'render' | 'afterRender', {}>;

    /** @internal */
    export type TableChangedEvent = Event<'tableChanged', {}>;
    /** @internal */
    export type PresentationModifierEvent =
        Component.Event<'afterPresentationModifier', { table: DataTable }>;

    /** @internal */
    export type Event<
        EventType extends string,
        EventRecord extends Record<string, any>> = {
            readonly type: EventType;
            target?: Component;
            detail?: AnyRecord;
        } & EventRecord;

    export interface Options {

        /**
         * Cell id, where component is attached.
         */
        renderTo?: string;

        /**
         * The name of class that is applied to the component's container.
         */
        className?: string;

        /**
         * The type of component like: `HTML`, `KPI`, `Highcharts`, `Grid`,
         * `Navigator`.
         */
        type: keyof ComponentTypeRegistry;

        /**
         * Allow overwriting gui elements.
         * @internal
         */
        navigationBindings?: Array<AnyRecord>;
        /**
         * Events attached to the component : `mount`, `unmount`, `resize`, `update`.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/events/ | Mount event }
         */
        events?: Record<string, Function>;
        /**
         * Set of options that are available for editing through sidebar.
         */
        editableOptions?: Array<EditableOptions.Options>;
        /** @internal */
        editableOptionsBindings?: EditableOptions.OptionsBindings;
        /**
         * Sync options. Predefined per component or custom sync options can be
         * used here.
         */
        sync?: Sync.RawOptionsRecord;
        /**
         * Connector options
         */
        connector?: (ConnectorOptions|Array<ConnectorOptions>);
        /**
         * Sets an ID for the component's container.
         */
        id?: string;
        /**
         * The component's title, which will render at the top.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/title/ | Changed captions }
         */
        title?: TextOptionsType;
        /**
         * The component's caption, which will render at the bottom.
         *
         * Try it:
         *
         * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/caption/ | Changed captions }
         */
        caption?: TextOptionsType;

        /**
         * States for the component.
         */
        states?: StatesOptions;
    }

    /**
     * States options for the component.
     */
    export interface StatesOptions {
        active?: {
            /**
             * Whether the component is active. Only used when `enabled` is
             * `true`.
             * If `true`, the `highcharts-dashboards-cell-state-active` class
             * will be added to the component's container.
             *
             * Only one component can be active at a time.
             *
             * Try it:
             * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/dashboards/component-options/states/ | Active state }
             *
             * @default false
             */
            isActive?: boolean;

            /**
             * Whether to enable the active state.
             *
             * @default false
             */
            enabled?: boolean;
        };
        hover?: {
            /**
             * Whether to enable the hover state.
             *
             * @default false
             */
            enabled?: boolean;
        };
    }

    /** @internal */
    export type ConnectorTypes = DataConnectorType;

    /**
     * Allowed types for the text.
    */
    export type TextOptionsType = string | false | TextOptions | undefined;

}

export default Component;
