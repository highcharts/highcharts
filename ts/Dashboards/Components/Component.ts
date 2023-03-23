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

import type Cell from '../Layout/Cell.js';
import type ComponentType from './ComponentType';
import type JSON from '../../Core/JSON';
import type NavigationBindingsOptionsObject from
    '../../Extensions/Annotations/NavigationBindingsOptions';
import type Serializable from '../Serializable';

import type DataConnector from '../../Data/Connectors/DataConnector';
import type DataModifier from '../../Data/Modifiers/DataModifier';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type TextOptions from './TextOptions';
import type Row from '../Layout/Row';
import CallbackRegistry from '../CallbackRegistry.js';
import DG from '../Globals.js';
const {
    classNamePrefix
} = DG;
import DataTable from '../../Data/DataTable.js';
import EditableOptions from './EditableOptions.js';
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    getStyle,
    relativeLength
} = U;

import CU from './ComponentUtilities.js';
const {
    getMargins,
    getPaddings
} = CU;
import ComponentGroup from './ComponentGroup.js';
import DU from '../Utilities.js';
const { uniqueKey } = DU;
import Sync from './Sync/Sync.js';

abstract class Component<TEventObject extends Component.EventTypes = Component.EventTypes> {

    public static createTextElement(
        tagName: string,
        elementName: string,
        textOptions: Component.TextOptionsType
    ): HTMLElement | undefined {
        if (typeof textOptions === 'object') {
            const { className, text, style } = textOptions;
            return createElement(tagName, {
                className: className || `${classNamePrefix}component-${elementName}`,
                textContent: text
            }, style);
        }

        if (typeof textOptions === 'string') {
            return createElement(tagName, {
                className: `${classNamePrefix}component-${elementName}`,
                textContent: textOptions
            });
        }
    }

    public static Sync = Sync;
    public static defaultOptions: Component.ComponentOptions = {
        className: `${classNamePrefix}component`,
        parentElement: document.body,
        parentCell: void 0,
        type: '',
        id: '',
        title: false,
        caption: false,
        style: {
            display: 'flex',
            'flex-direction': 'column'
        },
        sync: Sync.defaultHandlers,
        editableOptions: [
            'style',
            'title',
            'caption'
        ],
        editableOptionsBindings: EditableOptions.defaultBindings
    };

    public parentElement: HTMLElement;
    public parentCell?: Cell;
    public connector?: Component.ConnectorTypes; // the attached connector
    protected dimensions: { width: number | null; height: number | null };
    public element: HTMLElement;
    public titleElement?: HTMLElement;
    public captionElement?: HTMLElement;
    public contentElement: HTMLElement;
    public options: Component.ComponentOptions;
    public type: string;
    public id: string;
    // An array of options marked as editable by the UI.
    public editableOptions: EditableOptions;
    // Registry of callbacks registered on the component. Used in the Highcharts
    // component to keep track of chart events.
    public callbackRegistry = new CallbackRegistry();
    // The interval for redrawing the component on data changes.
    private tableEventTimeout?: number;
    // Event listeners tied to the current DataTable. Used for redrawing the
    // component on data changes.
    private tableEvents: Function[] = [];
    // Event listeners tied to the parent cell. Used for redrawing/resizing the
    // component on interactions.
    private cellListeners: Function[] = [];
    protected hasLoaded: boolean;
    protected shouldRedraw: boolean;

    protected syncHandlers: Sync.OptionsRecord;

    // DataModifier that is applied on top of modifiers set on the DataConnector
    public presentationModifier?: DataModifier;
    // The table being presented, either a result of the above or a way to
    // modify the table via events.
    public presentationTable?: DataTable;

    // The active group of the component. Used for sync.
    public activeGroup: ComponentGroup | undefined = void 0;

    public abstract sync: Sync;

    /**
     * Timeouts for calls to `Component.resizeTo()`
     */
    protected resizeTimeouts: number[] = [];

    /**
     * Timeouts for resizing the content. I.e. `chart.setSize()`
     */
    protected innerResizeTimeouts: number[] = [];

    constructor(options: Partial<Component.ComponentOptions>) {
        this.options = merge(Component.defaultOptions, options);
        this.id = this.options.id && this.options.id.length ?
            this.options.id :
            uniqueKey();

        // Todo: we might want to handle this later
        if (typeof this.options.parentElement === 'string') {
            const el = document.getElementById(this.options.parentElement);
            if (!el) {
                throw new Error(
                    'Could not find element with id: ' +
                    this.options.parentElement
                );
            }
            this.parentElement = el;

        } else {
            this.parentElement = this.options.parentElement;
        }

        if (this.options.parentCell) {
            this.parentCell = this.options.parentCell;
            if (this.parentCell.container) {
                this.parentElement = this.parentCell.container;
            }
            this.attachCellListeneres();
        }

        this.type = this.options.type;
        this.connector = this.options.connector;
        this.hasLoaded = false;
        this.shouldRedraw = true;
        this.editableOptions =
            new EditableOptions(this, options.editableOptionsBindings);

        this.presentationModifier = this.options.presentationModifier;

        // Initial dimensions
        this.dimensions = {
            width: null,
            height: null
        };

        this.syncHandlers = this.handleSyncOptions();
        this.element = createElement('div', {
            className: this.options.className
        }, this.options.style);

        this.contentElement = createElement('div', {
            className: `${this.options.className}-content`
        }, {
            height: '100%'
        }, void 0, true);

    }

    /**
    * Handles the sync options. Applies the given defaults if no
    * specific callback given
    */
    protected handleSyncOptions(
        defaultHandlers: typeof Sync.defaultHandlers = Sync.defaultHandlers
    ): Component['syncHandlers'] {
        return Object.keys(this.options.sync)
            .reduce(
                (
                    carry: Sync.OptionsRecord,
                    handlerName
                ): Sync.OptionsRecord => {
                    if (handlerName) {
                        const handler = this.options.sync[handlerName];

                        if (handler && typeof handler === 'object') {
                            carry[handlerName] = handler;
                        }
                        if (handler && typeof handler === 'boolean') {
                            carry[handlerName] = defaultHandlers[handlerName];
                        }
                    }

                    return carry;
                },
                {}
            );
    }

    // Setup listeners on cell/other things up the chain
    private attachCellListeneres(): void {
        // remove old listeners
        while (this.cellListeners.length) {
            const destroy = this.cellListeners.pop();
            if (destroy) {
                destroy();
            }
        }

        if (this.parentCell && Object.keys(this.parentCell).length) {
            const board = this.parentCell.row.layout.board;
            this.cellListeners.push(
                // Listen for resize on dashboard
                addEvent(board, 'cellResize', (): void => {
                    this.resizeTo(this.parentElement);
                }),
                // Listen for changed parent
                addEvent(
                    this.parentCell.row,
                    'cellChange',
                    (e: { row: Row }): void => {
                        const { row } = e;
                        if (row && this.parentCell) {
                            const hasLeftTheRow =
                                row.getCellIndex(this.parentCell) === void 0;
                            if (hasLeftTheRow) {
                                if (this.parentCell) {
                                    this.setCell(this.parentCell);
                                }
                            }
                        }
                    }
                )
            );

        }
    }

    // Set a parent cell
    public setCell(cell: Cell, resize = false): void {
        this.parentCell = cell;
        if (cell.container) {
            this.parentElement = cell.container;
        }
        this.attachCellListeneres();
        if (resize) {
            this.resizeTo(this.parentElement);
        }
    }

    private setupTableListeners(table: DataTable): void {
        const connector = this.connector;

        if (connector) {
            if (table) {
                [
                    'afterSetRows',
                    'afterDeleteRows',
                    'afterSetColumns',
                    'afterDeleteColumns',
                    'afterSetCell'
                ].forEach((event: any): void => {
                    this.tableEvents.push((table)
                        .on(event, (e: any): void => {
                            clearInterval(this.tableEventTimeout);
                            this.tableEventTimeout = setTimeout((): void => {
                                this.emit({
                                    ...e,
                                    type: 'tableChanged'
                                });
                                this.tableEventTimeout = void 0;
                            }, 0);
                        }));
                });
            }


            const component = this;
            this.tableEvents.push(connector.on('afterLoad', (): void => {
                this.emit({
                    target: component,
                    type: 'tableChanged'
                });
            }));
        }
    }

    private clearTableListeners(): void {
        const connector = this.connector,
            tableEvents = this.tableEvents;

        if (tableEvents.length) {
            tableEvents.forEach(
                (removeEventCallback): void => removeEventCallback()
            );
        }

        if (connector) {
            tableEvents.push(connector.table.on(
                'afterSetModifier',
                (e): void => {
                    if (e.type === 'afterSetModifier') {
                        this.emit({
                            ...e,
                            type: 'tableChanged'
                        });
                    }
                }
            ));
        }
    }

    public setConnector(connector: Component.ConnectorTypes | undefined): this {
        // Clean up old event listeners
        while (this.tableEvents.length) {
            const eventCallback = this.tableEvents.pop();
            if (typeof eventCallback === 'function') {
                eventCallback();
            }
        }

        this.connector = connector;

        if (connector) {
            // Set up event listeners
            this.clearTableListeners();
            this.setupTableListeners(connector.table);

            // re-setup if modifier changes
            connector.table.on(
                'setModifier',
                (): void => this.clearTableListeners()
            );
            connector.table.on(
                'afterSetModifier',
                (e: DataTable.SetModifierEvent): void => {
                    if (e.type === 'afterSetModifier' && e.modified) {
                        this.setupTableListeners(e.modified);
                    }
                }
            );


            // Add the component to a group based on the
            // connector table id by default
            // TODO: make this configurable
            const tableID = connector.table.id;

            if (!ComponentGroup.getComponentGroup(tableID)) {
                ComponentGroup.addComponentGroup(new ComponentGroup(tableID));
            }

            const group = ComponentGroup.getComponentGroup(tableID);
            if (group) {
                group.addComponents([this.id]);
                this.activeGroup = group;
            }
        }

        fireEvent(this, 'connectorAttached', { connector });
        return this;
    }

    setActiveGroup(group: ComponentGroup | string | null): void {
        if (typeof group === 'string') {
            group = ComponentGroup.getComponentGroup(group) || null;
        }
        if (group instanceof ComponentGroup) {
            this.activeGroup = group;
        }
        if (group === null) {
            this.activeGroup = void 0;
        }
        if (this.activeGroup) {
            this.activeGroup.addComponents([this.id]);
        }
    }


    private getContentHeight(): number {
        const parentHeight =
            this.dimensions.height || Number(getStyle(this.element, 'height'));
        const titleHeight = this.titleElement ?
            this.titleElement.clientHeight + getMargins(this.titleElement).y :
            0;
        const captionHeight = this.captionElement ?
            this.captionElement.clientHeight +
            getMargins(this.captionElement).y :
            0;

        return parentHeight - titleHeight - captionHeight;
    }

    /**
     * Resize the component
     * @param {number|string|null} [width]
     * The width to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style
     * @param {number|string|null} [height]
     * The height to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style.
     */
    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        // if (!this.resizeTimeout) {
        //     this.resizeTimeout = requestAnimationFrame(() => {

        if (height) {
            // Get offset for border, padding
            const pad =
                getPaddings(this.element).y + getMargins(this.element).y;

            this.dimensions.height = relativeLength(
                height, Number(getStyle(this.parentElement, 'height'))
            ) - pad;
            this.element.style.height = this.dimensions.height + 'px';
            this.contentElement.style.height = this.getContentHeight() + 'px';
        }
        if (width) {
            const pad =
                getPaddings(this.element).x + getMargins(this.element).x;
            this.dimensions.width = relativeLength(
                width, Number(getStyle(this.parentElement, 'width'))
            ) - pad;
            this.element.style.width = this.dimensions.width + 'px';
        }

        if (height === null) {
            this.dimensions.height = null;
            this.element.style.removeProperty('height');
        }

        if (width === null) {
            this.dimensions.width = null;
            this.element.style.removeProperty('width');
        }

        fireEvent(this, 'resize', {
            width,
            height
        });
        //         cancelAnimationFrame(this.resizeTimeout)
        //         this.resizeTimeout = 0;
        //     });
        // }
    }

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
     * Handles updating via options
     * @param {Partial<Component.ComponentOptions>} newOptions
     * The options to apply
     *
     * @param {boolean} redraw
     * Set to true if the update should redraw the component.
     * If `false` the component will be redrawn only if options are changed.
     *
     * @return {this}
     * The component for chaining
     */
    public update(
        newOptions: Partial<Component.ComponentOptions>,
        redraw: boolean = false
    ): this {
        // Update options
        let shouldForceRedraw = false;

        if (!redraw) {
            const currentOptions = this.options;

            const optionNamesToSkip = this.editableOptions.bindings ?
                this.editableOptions.bindings.skipRedraw :
                [];

            const newOptionKeys = Object.keys(newOptions);
            for (let i = 0; i < newOptionKeys.length; i++) {
                const optionName = newOptionKeys[i];
                if (
                    optionNamesToSkip.indexOf(optionName) > -1
                ) {
                    continue;
                }

                if (optionName in currentOptions) {
                    const oldOptionValue =
                        (currentOptions as AnyRecord)[optionName];
                    const newOptionValue =
                        (newOptions as AnyRecord)[optionName];

                    // If the type has changed, redraw
                    if (typeof oldOptionValue !== typeof newOptionValue) {
                        shouldForceRedraw = true;
                        break;
                    }

                    // If both are objects, do a quick comparison
                    // TODO: order should not really matter in a config
                    // so might want to do a deeper comparison
                    if (
                        typeof oldOptionValue === 'object' &&
                        JSON.stringify(oldOptionValue) !==
                        JSON.stringify(newOptionValue)
                    ) {
                        shouldForceRedraw = true;
                        break;
                    }

                    if (oldOptionValue !== newOptionValue) {
                        shouldForceRedraw = true;
                        break;
                    }
                }
            }
        }

        this.options = merge(this.options, newOptions);
        fireEvent(this, 'update', {
            options: newOptions,
            shouldForceRedraw
        });

        if (redraw || shouldForceRedraw) {
            this.redraw();
        }

        return this;
    }

    public setTitle(titleOptions: Component.TextOptionsType): void {
        const previousTitle = this.titleElement;

        if (
            !titleOptions || typeof titleOptions === 'string' ?
                titleOptions === '' :
                titleOptions.text === ''
        ) {
            if (previousTitle) {
                previousTitle.remove();
            }
            return;
        }

        const titleElement =
            Component.createTextElement('h1', 'title', titleOptions);

        if (titleElement) {
            this.titleElement = titleElement;

            if (previousTitle) {
                previousTitle.replaceWith(this.titleElement);
            }
        }
    }

    public setCaption(captionOptions: Component.TextOptionsType): void {
        const previousCaption = this.captionElement;
        if (
            !captionOptions ||
                typeof captionOptions === 'string' ?
                captionOptions === '' :
                captionOptions.text === ''
        ) {
            if (previousCaption) {
                previousCaption.remove();
            }
            return;
        }

        const captionElement =
            Component.createTextElement('div', 'caption', captionOptions);

        if (captionElement) {
            this.captionElement = captionElement;

            if (previousCaption) {
                previousCaption.replaceWith(this.captionElement);
            }
        }
    }

    /**
     * Handles setting things up on initial render
     *
     * @return {this}
     * The component for chaining
     */
    public load(): this {

        // Set up the connector on inital load if it has not been done
        if (!this.hasLoaded && this.connector) {
            this.setConnector(this.connector);
        }

        this.setTitle(this.options.title);
        this.setCaption(this.options.caption);
        [
            this.titleElement,
            this.contentElement,
            this.captionElement
        ].forEach((element): void => {
            if (element) {
                this.element.appendChild(element);
            }
        });
        // Setup event listeners
        // Grabbed from Chart.ts
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

        this.on('message', (e): void => {
            if ('message' in e) {
                this.onMessage(e.message);
            }
        });

        // TODO: should cleanup this event listener
        window.addEventListener(
            'resize',
            (): void => this.resizeTo(this.parentElement)
        );

        this.hasLoaded = true;
        this.shouldRedraw = false;

        return this;
    }

    /**
     * Renders the component.
     * @todo make this call load on initial render
     * @return {this} Component
     */
    public render(): this {
        if (this.shouldRedraw || !this.hasLoaded) {
            this.load();
            // Call resize to fit to the cell. Only for non HTML elements.
            // There is no need to set a fixed height for the HTML element
            // because it will fill the available space when added to DOM.
            if (this.type !== 'HTML') {
                this.resizeTo(this.parentElement);
            }
        }
        return this;
    }

    /**
     * Redraws the component.
     * @return {this} Component
     */
    public redraw(): this {
        // Do a redraw
        const e = {
            component: this
        };

        fireEvent(this, 'redraw', e);

        this.shouldRedraw = true; // set to make render call load as well

        return this.render();
    }

    /**
     * @todo Should perhaps also remove the component from the registry
     * or set an `isactive` flag to false
     */
    public destroy(): void {
        while (this.element.firstChild) {
            this.element.firstChild.remove();
        }
        // Unregister events
        this.tableEvents.forEach((eventCallback): void => eventCallback());
        this.element.remove();

        Component.removeInstance(this);
    }

    public on<TEvent extends Component.EventTypes>(
        type: TEvent['type'],
        callback: (this: this, e: TEvent) => void
    ): Function {
        return addEvent(this, type, callback);
    }

    public emit<TEvent extends Component.EventTypes>(
        e: TEvent
    ): void {
        if (!e.target) {
            e.target = this;
        }
        fireEvent(this, e.type, e);
    }

    public postMessage(
        message: Component.MessageType,
        target: Component.MessageTarget = {
            type: 'componentType',
            target: 'all'
        }
    ): void {
        const component = Component.getInstanceById(this.id);

        if (component) {
            Component.relayMessage(component, message, target);
        }
    }

    public onMessage(message: Component.MessageType): void {
        if (message && typeof message === 'string') {
            // do something
            return;
        }

        if (
            typeof message === 'object' &&
            typeof message.callback === 'function'
        ) {
            message.callback.apply(this);
        }
    }

    /**
     * Converts the class instance to a class JSON.
     * @internal
     *
     * @return {Component.JSON}
     * Class JSON of this Component instance.
     */
    public toJSON(): Component.JSON {
        const dimensions: Record<'width' | 'height', number> = {
            width: 0,
            height: 0
        };
        objectEach(this.dimensions, function (value, key): void {
            if (value === null) {
                return;
            }
            dimensions[key] = value;
        });

        const json: Component.JSON = {
            $class: Component.getName(this.constructor),
            // connector: this.connector ? this.connector.toJSON() : void 0,
            options: {
                parentElement: this.parentElement.id,
                dimensions,
                type: this.options.type,
                id: this.options.id || this.id
            }
        };

        return json;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Component {

    /* *
    *
    *  Declarations
    *
    * */

    /** @internal */
    export interface JSON extends Serializable.JSON<string> {
        // connector?: DataConnector.ClassJSON;
        options: ComponentOptionsJSON;
    }

    /**
     * The basic events
     */
    export type EventTypes =
        ResizeEvent |
        UpdateEvent |
        TableChangedEvent |
        LoadEvent |
        RenderEvent |
        RedrawEvent |
        JSONEvent |
        MessageEvent |
        PresentationModifierEvent;

    export type ResizeEvent = Event<'resize', {
        readonly type: 'resize';
        width?: number;
        height?: number;
    }>;

    export type UpdateEvent = Event<'update' | 'afterUpdate', {
        options?: ComponentOptions;
    }>;

    export type LoadEvent = Event<'load' | 'afterLoad', {}>;
    export type RedrawEvent = Event<'redraw' | 'afterRedraw', {}>;
    export type RenderEvent = Event<'beforeRender' | 'afterRender', {}>;
    export type MessageEvent = Event<'message', {
        message: MessageType;
        detail?: {
            sender: string;
            target: string;
        };
    }>;

    /** @internal */
    export type JSONEvent = Event<'toJSON' | 'fromJSON', {
        json: Serializable.JSON<string>;
    }>;
    export type TableChangedEvent = Event<'tableChanged', {}>;
    export type PresentationModifierEvent =
        Component.Event<'afterPresentationModifier', { table: DataTable }>;


    export type Event<
        EventType extends string,
        EventRecord extends Record<string, any>> = {
            readonly type: EventType;
            target?: Component;
            detail?: AnyRecord;
        } & EventRecord;

    export type SyncOptions = Record<string, boolean | Partial<Sync.OptionsEntry>>;

    export interface ComponentOptions extends EditableOptions {
        parentCell?: Cell;
        parentElement: HTMLElement | string;
        className?: string;
        type: string;
        // allow overwriting gui elements
        navigationBindings?: NavigationBindingsOptionsObject[];
        events?: Record<string, Function>;
        editableOptions: Array<string>;
        editableOptionsBindings: EditableOptions.OptionsBindings;
        presentationModifier?: DataModifier;
        sync: SyncOptions;
    }

    /**
     * // JSON compatible options for export
     * @internal
     *  */
    export interface ComponentOptionsJSON extends JSON.Object {
        // connector?: DataConnector.ClassJSON; // connector id
        parentElement: string; // ID?
        style?: {};
        className?: string;
        type: string;
        id: string;
    }

    export type ConnectorTypes = DataConnector;

    export interface EditableOptions {
        connector?: ConnectorTypes;
        id?: string;
        style?: CSSObject;
        title: TextOptionsType;
        caption: TextOptionsType;
    }

    export type TextOptionsType = string | false | TextOptions | undefined;

    export interface MessageTarget {
        type: 'group' | 'componentType' | 'componentID';
        target: (
            ComponentType['id'] |
            ComponentType['type'] |
            ComponentGroup['id']
        );
    }

    export type MessageType = string | {
        callback: Function;
    };

    /* *
    *
    *  Constants
    *
    * */

    /**
     *
     * Record of component instances
     *
     */
    export const instanceRegistry: Record<string, ComponentType> = {};

    /**
     * Regular expression to extract the  name (group 1) from the
     * stringified class type.
     */
    const nameRegExp = /^(?:class|function)\s(\w*?)(?:Component)?\W/;

    /**
     *
     * Record of component classes
     * @todo
     *
     */
    export const registry: Record<string, Class<Component>> = {};

    /* *
    *
    *  Functions
    *
    * */

    /**
     *
     */
    export function addComponent<T extends Class<Component>>(
        componentClass: T
    ): boolean {
        const name = Component.getName(componentClass);

        if (
            typeof name === 'undefined' ||
            registry[name]
        ) {
            return false;
        }

        registry[name] = componentClass;

        return true;
    }

    /**
     *
     */
    export function getAllComponentNames(): Array<string> {
        return Object.keys(Component.registry);
    }

    /**
     *
     */
    export function getAllComponents(): Record<string, Class<Component>> {
        return merge(Component.registry);
    }

    /**
     * Extracts the name from a given component class.
     *
     * @param {DataConnector} component
     * Component class to extract the name from.
     *
     * @return {string}
     * Component name, if the extraction was successful, otherwise an empty
     * string.
     */
    export function getName(
        component: (NewableFunction | ComponentType)
    ): string {
        return (
            component.toString().match(nameRegExp) ||
            ['', '']
        )[1];
    }

    /**
     * Adds a component instance to the registry
     * @param {Component} component
     * The component to add
     */
    export function addInstance(component: ComponentType): void {
        Component.instanceRegistry[component.id] = component;

    }

    /**
     * Removes a component instance from the registry
     * @param {Component} component
     * The component to remove
     */
    export function removeInstance(component: Component<any>): void {
        delete Component.instanceRegistry[component.id];
    }

    /**
     * Retrieves the IDs of the registered component instances
     * @return {string[]}
     * Array of component IDs
     */
    export function getAllInstanceIDs(): string[] {
        return Object.keys(instanceRegistry);
    }

    /**
     * Retrieves all registered component instances
     * @return {ComponentType[]}
     * Array of components
     */
    export function getAllInstances(): Component<any>[] {
        const ids = getAllInstanceIDs();
        return ids.map((id): Component<any> => instanceRegistry[id]);
    }

    /**
     *
     */
    export function getComponent<T extends Class<Component>>(
        key: string
    ): (T | undefined) {
        return registry[key] as T;
    }

    /**
     *
     */
    export function getInstanceById(id: string): ComponentType | undefined {
        return instanceRegistry[id];
    }
    /**
     *
     */
    export function relayMessage(
        sender: ComponentType | ComponentGroup,
        // Are there cases where a group should be the sender?
        message: Component.MessageEvent['message'],
        targetObj: Component.MessageTarget
    ): void {
        const emit = (component: ComponentType): void =>
            component.emit({
                type: 'message',
                detail: {
                    sender: sender.id,
                    target: targetObj.target
                },
                message,
                target: component
            });

        const handlers: Record<Component.MessageTarget['type'], Function> = {
            'componentID': (
                recipient: Component.MessageTarget['target']
            ): void => {
                const component = getInstanceById(recipient);
                if (component) {
                    emit(component);
                }
            },
            'componentType': (
                recipient: Component.MessageTarget['target']
            ): void => {
                getAllInstanceIDs()
                    .forEach((instanceID): void => {
                        const component = getInstanceById(instanceID);
                        if (component && component.id !== sender.id) {
                            if (
                                component.type === recipient ||
                                recipient === 'all'
                            ) {
                                emit(component);
                            }
                        }
                    });
            },
            'group': (recipient: Component.MessageTarget['target']): void => {
                // Send a message to a whole group
                const group = ComponentGroup.getComponentGroup(recipient);
                if (group) {
                    group.components.forEach((id): void => {
                        const component = getInstanceById(id);
                        if (component && component.id !== sender.id) {
                            emit(component);
                        }
                    });
                }
            }
        };

        handlers[targetObj.type](targetObj.target);
    }

}

export default Component;
