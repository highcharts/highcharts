/* eslint-disable require-jsdoc */
import type ComponentType from './ComponentType';
import Cell from '../Layout/Cell.js';
import type DataEventEmitter from '../../Data/DataEventEmitter';
import type DataStore from '../../Data/Stores/DataStore';
import type DataJSON from '../../Data/DataJSON';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type TextOptions from './TextOptions';
import EditableOptions from './EditableOptions.js';
/* import CallbackRegistry from '../CallbackRegistry.js'; */
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    uniqueKey,
    getStyle,
    relativeLength
} = U;

import { getMargins, getPaddings } from './Utils.js';

abstract class Component<TEventObject extends Component.Event = Component.Event> {

    /**
     *
     * Record of component classes
     * @todo
     *
     */
    private static registry: Record<string, ComponentType>

    /**
     *
     * Record of component instances
     *
     */
    public static instanceRegistry: Record<string, Component<any>> = {};

    /**
     * Regular expression to extract the  name (group 1) from the
     * stringified class type.
     */
    private static readonly nameRegExp = /^function\s+(\w*?)(?:Component)?\s*\(/;

    public static addComponent(componentClass: ComponentType): boolean {
        const name = Component.getName(componentClass),
            registry = Component.registry;

        if (
            typeof name === 'undefined' ||
            registry[name]
        ) {
            return false;
        }

        registry[name] = componentClass;

        return true;
    }

    public static getAllComponentNames(): Array<string> {
        return Object.keys(Component.registry);
    }

    public static getAllComponents(): Record<string, ComponentType> {
        return merge(Component.registry);
    }

    /**
     * Extracts the name from a given component class.
     *
     * @param {DataStore} component
     * Component class to extract the name from.
     *
     * @return {string}
     * Component name, if the extraction was successful, otherwise an empty
     * string.
     */
    private static getName(component: (NewableFunction | ComponentType)): string {
        return (
            component.toString().match(Component.nameRegExp) ||
            ['', '']
        )[1];
    }

    /**
     * Adds a component instance to the registry
     * @param {Component} component
     * The component to add
     */
    public static addInstance(component: Component<any>): void {
        Component.instanceRegistry[component.id] = component;
    }

    /**
     * Removes a component instance from the registry
     * @param {Component} component
     * The component to remove
     */
    public static removeInstance(component: Component<any>): void {
        delete Component.instanceRegistry[component.id];
    }

    /**
     * Retrieves the IDs of the registered component instances
     * @return {string[]}
     * Array of component IDs
     */
    public static getAllInstanceIDs(): string[] {
        return Object.keys(this.instanceRegistry);
    }

    /**
     * Retrieves all registered component instances
     * @return {ComponentType[]}
     * Array of components
     */
    public static getAllInstances(): Component<any>[] {
        const ids = this.getAllInstanceIDs();
        return ids.map((id): Component<any> => this.instanceRegistry[id]);
    }

    public static getInstanceById(id: string): Component | undefined {
        return this.instanceRegistry[id];
    }

    public static relayMessage(
        sender: Component<any>, // Possibly layout?
        message: (string | MessageEvent), // should probably be a typical event with optional payloads
        target: string = 'all' // currently all or type. Could also add groups
    ): void {
        this.getAllInstanceIDs()
            .filter((id): boolean => id !== sender.id)
            .forEach((componentID): void => {
                const component = this.instanceRegistry[componentID];
                if (component.type === target || target === 'all') {
                    component.emit({
                        type: 'message',
                        detail: {
                            sender,
                            target
                        },
                        message
                    });
                }
            });
    }

    protected static getUUID(): string {
        return 'dashboard-component-' + uniqueKey();
    }

    public static createTextElement(
        tagName: string,
        elementName: string,
        textOptions: Component.textOptionsType
    ): HTMLElement | undefined {
        const classBase = 'hcd';

        if (typeof textOptions === 'object') {
            const { className, text, style } = textOptions;
            return createElement(tagName, {
                className: className || `${classBase}-component-${elementName}`,
                textContent: text
            }, style);
        }

        if (typeof textOptions === 'string') {
            return createElement(tagName, {
                className: `${classBase}-component-${elementName}`,
                textContent: textOptions
            });
        }
    }
    public static defaultOptions: Component.ComponentOptions = {
        className: 'hcd-component',
        parentElement: document.body,
        parentCell: void 0,
        dimensions: {
            width: '100%',
            height: '100%'
        },
        type: '',
        id: '',
        title: false,
        caption: false,
        style: {
            display: 'flex',
            'flex-direction': 'column'
        },
        editableOptions: [
            'dimensions',
            'id',
            'store',
            'style',
            'title',
            'caption'
        ],
        editableOptionsBindings: void 0
    }

    public parentElement: HTMLElement;
    public parentCell?: Cell;
    public store?: DataStore<any>; // the attached store
    public dimensions: { width: number | null; height: number | null };
    public element: HTMLElement;
    public titleElement?: HTMLElement;
    public captionElement?: HTMLElement;
    public contentElement: HTMLElement;
    public options: Component.ComponentOptions;
    public type: string;
    public id: string;
    public editableOptions: EditableOptions;
    /* public callbackRegistry = new CallbackRegistry(); */
    private tableEventTimeout?: number;
    private tableEvents: Function[] = [];
    protected hasLoaded: boolean;

    constructor(options: Partial<Component.ComponentOptions>) {
        this.options = merge(Component.defaultOptions, options);
        this.id = this.options.id && this.options.id.length ?
            this.options.id :
            Component.getUUID();

        if (typeof this.options.parentElement === 'string') {
            const el = document.getElementById(this.options.parentElement);
            if (!el) {
                throw new Error('Could not find element with id: ' + this.options.parentElement);
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
        this.store = this.options.store;
        this.hasLoaded = false;
        this.editableOptions = new EditableOptions(this, options.editableOptionsBindings);

        // Initial dimensions
        this.dimensions = {
            width: null,
            height: null
        };

        this.element = createElement('div', {
            className: this.options.className
        }, this.options.style);

        this.contentElement = createElement('div', {
            className: `${this.options.className}-content`
        }, {
            height: '100%'
        }, void 0, true);

        // Add the component instance to the registry
        Component.addInstance(this);
    }

    // Setup listeners on cell/other things up the chain
    // TODO: teardown if we want to switch a component between cells
    private attachCellListeneres(): void {
        if (this.parentCell) {
            addEvent(this.parentCell.row, 'cellChange', (e: any): void => {
                this.resizeTo(this.parentElement);
            });
        }
    }

    // Set a parent cell
    public setCell(cell: Cell) {
        this.parentCell = cell;
        if (cell.container) {
            this.parentElement = cell.container;
        }
        this.attachCellListeneres();
    }

    public setStore(store: DataStore<any> | undefined): this {
        this.store = store;
        if (store) {
            // Set up event listeners
            [
                'afterInsertRow',
                'afterDeleteRow',
                'afterChangeRow',
                'afterUpdateRow',
                'afterClearTable'
            ].forEach((event: any): void => {
                this.tableEvents.push(store.table.on(event, (e): void => {

                    clearInterval(this.tableEventTimeout);
                    this.tableEventTimeout = setTimeout((): void => {
                        this.emit({
                            ...e as any,
                            type: 'tableChanged'
                        });
                        this.tableEventTimeout = void 0;
                    }, 0);
                }));
            });

            this.tableEvents.push(store.on('afterLoad', (e): void => {
                this.emit({
                    ...e,
                    type: 'tableChanged'
                });
            }));
        }

        // Clean up old event listeners
        if (!store && this.tableEvents.length) {
            while (this.tableEvents.length) {
                const eventCallback = this.tableEvents.pop();
                if (typeof eventCallback === 'function') {
                    eventCallback();
                }
            }
        }

        fireEvent(this, 'storeAttached', { store });
        return this;
    }


    private getContentHeight(): number {
        const parentHeight = this.dimensions.height || Number(getStyle(this.element, 'height'));
        const titleHeight = this.titleElement ?
            this.titleElement.clientHeight + getMargins(this.titleElement).y :
            0;
        const captionHeight = this.captionElement ?
            this.captionElement.clientHeight + getMargins(this.captionElement).y :
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
     * Null will unset the style
     */
    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        // if (!this.resizeTimeout) {
        //     this.resizeTimeout = requestAnimationFrame(() => {

        if (height) {
            // Get offset for border, padding
            const pad = getPaddings(this.element).y + getMargins(this.element).y;

            this.dimensions.height = relativeLength(height, Number(getStyle(this.parentElement, 'height'))) - pad;
            this.element.style.height = this.dimensions.height + 'px';
            this.contentElement.style.height = this.getContentHeight() + 'px';
        }
        if (width) {
            const pad = getPaddings(this.element).x + getMargins(this.element).x;
            this.dimensions.width = relativeLength(width, Number(getStyle(this.parentElement, 'width'))) - pad;
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
        const { width, height } = element.getBoundingClientRect();
        const padding = getPaddings(element);
        const margins = getMargins(element);

        this.resize(width - padding.x - margins.x, height - padding.y - margins.y);
    }

    /**
     * Handles updating via options
     * @param {Partial<Component.ComponentOptions>} newOptions
     * The options to apply
     *
     * @return {this}
     */
    public update(newOptions: Partial<Component.ComponentOptions>): this {
        // Update options
        this.options = merge(this.options, newOptions);
        fireEvent(this, 'update', {
            options: newOptions
        });

        return this;
    }

    public setTitle(titleOptions: Component.textOptionsType): void {
        const titleElement = Component.createTextElement('h1', 'title', titleOptions);
        if (titleElement) {
            this.titleElement = titleElement;
        }
    }

    public setCaption(captionOptions: Component.textOptionsType): void {
        const captionElement = Component.createTextElement('div', 'caption', captionOptions);
        if (captionElement) {
            this.captionElement = captionElement;
        }
    }

    /**
     * Handles setting things up on initial render
     *
     * @return {this}
     */
    public load(): this {
        // Set up the store on inital load if it has not been done
        if (!this.hasLoaded && this.store) {
            this.setStore(this.store);
        }

        this.setTitle(this.options.title);
        this.setCaption(this.options.caption);
        [this.titleElement, this.contentElement, this.captionElement].forEach((element): void => {
            if (element) {
                this.element.appendChild(element);
            }
        });
        // Setup event listeners
        // Grabbed from Chart.ts
        const events = this.options.events;
        if (events) {

            /* Object.keys(events).forEach(key => { */
            /*     this.callbackRegistry.addCallback(key, { */
            /*         type: 'component', */
            /*         func: (events as any)[key].eventCallback, */
            /*         args: (events as any)[key].eventCallback.arguments, */
            /*         context: this */
            /*     }) */
            /* }) */

            objectEach(events, (eventCallback, eventType): void => {
                if (isFunction(eventCallback)) {
                    this.on(eventType, eventCallback as any);
                }
            });
        }

        this.on('message', (e: Component.MessageEvent): void => {
            if (e.message && typeof e.message.callback === 'function') {
                e.message.callback.apply(this);
            }
        });

        window.addEventListener('resize', (): void => this.resizeTo(this.parentElement));

        this.hasLoaded = true;

        return this;
    }

    /**
     * @todo make this call load on initial render
     *
     * @return {this}
     */
    public render(): this {
        if (!this.hasLoaded) {

            // this.setupResizeListeners()
            this.load();
            // Call resize to fit to the cell
            setTimeout((): void => {
                this.resizeTo(this.parentElement);
            }, 0);
        }

        const e = {
            component: this
        };
        fireEvent(this, 'render', e);

        return e.component;
    }

    /**
     * @todo redraw should (usually) call render
     * @return {this}
     */
    public redraw(): this {
        // Do a redraw
        const e = {
            component: this
        };
        fireEvent(this, 'redraw', e);
        return e.component;
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
    }

    public on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    public emit(
        e: TEventObject
    ): void {
        fireEvent(this, e.type, e);
    }

    public postMessage(message: any, target?: string): void {
        Component.relayMessage(this, message, target);
    }

    /**
     * Converts the class instance to a class JSON.
     *
     * @return {Component.ClassJSON}
     * Class JSON of this Component instance.
     */
    public toJSON(): Component.ClassJSON {
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
        /* const callbacks: any[] = [] */
        /* Object.keys(this.callbackRegistry).forEach(key =>{ */
        /*     callbacks.push(this.callbackRegistry.getCallback(key)); */
        /* }) */
        /*  */
        /* console.log(callbacks); */

        return {
            $class: Component.getName(this.constructor),
            store: this.store ? this.store.toJSON() : void 0,
            options: {
                parentElement: this.parentElement.id,
                dimensions,
                type: this.options.type,
                id: this.options.id || this.id
            }
        };
    }
}

namespace Component {

    export interface ClassJSON extends DataJSON.ClassJSON {
        store?: DataStore.ClassJSON;
        options: ComponentJSONOptions;
    }

    export type eventTypes =
        'render' | 'afterRender' |
        'redraw' | 'afterRedraw' |
        'load' | 'afterLoad' |
        'update' | 'afterUpdate' |
        'message' | 'tableChanged' |
        'resize' | 'storeAttached';
    type ComponentEventTypes = ResizeEvent | MessageEvent | UpdateEvent | TableChangedEvent | Event;
    export interface ResizeEvent extends Event {
        width?: number;
        height?: number;
    }

    export interface MessageEvent extends Event {
        message?: Partial<{
            callback: Function;
        }>;
    }

    export interface UpdateEvent extends Event {
        options?: ComponentOptions;
    }

    export interface TableChangedEvent extends Event {
        options?: ComponentOptions;
    }
    /**
     * The default event object for a component
     */
    export interface Event extends DataEventEmitter.Event {
        readonly type: eventTypes;
        component?: Component<any>;
    }

    export interface ComponentOptions extends EditableOptions {
        parentCell?: Cell;
        parentElement: HTMLElement | string;
        className?: string;
        type: string;
        // allow overwriting gui elements
        navigationBindings?: Highcharts.NavigationBindingsOptionsObject[];
        events?: Record<Event['type'], Function>;
        editableOptions: Array<keyof EditableOptions>;
        editableOptionsBindings?: EditableOptions.BindingsType;
    }

    export interface EditableOptions {
        dimensions?: { width?: number | string; height?: number | string };
        store?: DataStore<any>;
        id?: string;
        style?: CSSObject;
        title: textOptionsType;
        caption: textOptionsType;
    }

    export type textOptionsType = string | false | TextOptions | undefined;

    // JSON compatible options for exprot
    export interface ComponentJSONOptions extends DataJSON.JSONObject {
        store?: DataStore.ClassJSON; // store id
        parentElement: string; // ID?
        style?: {};
        dimensions?: { width: number; height: number };
        className?: string;
        type: string;
        id: string;
    }
}
export default Component;
