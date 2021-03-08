import type ComponentType from './ComponentType';
import type DataEventEmitter from '../../Data/DataEventEmitter';
import type DataStore from '../../Data/Stores/DataStore';
import type DataJSON from '../../Data/DataJSON';
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
    relativeLength,
    defined
} = U;

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

    public static defaultOptions: Component.ComponentOptions = {
        className: 'highcharts-dashboard-component',
        parentElement: document.body,
        type: '',
        id: ''
    }

    public parentElement: HTMLElement;
    public store?: DataStore<any>; // the attached store
    public dimensions: { width: number | null; height: number | null };
    public element: HTMLElement;
    public options: Component.ComponentOptions;
    public type: string;
    public id: string;
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

        this.type = this.options.type;
        this.store = this.options.store;
        this.hasLoaded = false;
        // Initial dimensions
        this.dimensions = {
            width: null,
            height: null
        };

        this.element = createElement('div', {
            className: this.options.className
        });

        // Add the component instance to the registry
        Component.addInstance(this);
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
     *
     * @return {this} this
     */
    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): this {

        // If undefined, and parent has set style,
        // set to parents height minus padding, margin, etc
        if (height === void 0 && this.parentElement.style.height) {
            height = '100%';
        }

        if (width === void 0 && this.parentElement.style.width) {
            width = '100%';
        }

        if (height) {
            // Get offset for border, padding, margin
            const diff = this.element.offsetHeight - Number(getStyle(this.element, 'height'));
            this.dimensions.height = relativeLength(height, Number(getStyle(this.parentElement, 'height')), -diff);
            this.element.style.height = this.dimensions.height + 'px';
        }
        if (width) {
            const diff = this.element.offsetWidth - Number(getStyle(this.element, 'width'));
            this.dimensions.width = relativeLength(width, Number(getStyle(this.parentElement, 'width')), -diff);
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
        return this;
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

        /* this.parentElement.appendChild(this.element); */

        // Setup event listeners
        // Grabbed from Chart.ts
        const events = this.options.events;
        if (events) {
            objectEach(events, (eventCallback, eventType): void => {
                if (isFunction(eventCallback)) {
                    this.on(eventType, eventCallback as any);
                }
            });
        }

        this.on('message', (e: Component.MessageEvent): void => {
            if (typeof e.message?.callback === 'function') {
                e.message.callback.apply(this);
            }
        });

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
            this.load();
            // Call resize to set the sizes
            this.resize(
                this.options.dimensions?.width,
                this.options.dimensions?.height
            );
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
        return {
            $class: Component.getName(this.constructor),
            store: this.store?.toJSON(),
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
    export interface Event extends DataEventEmitter.EventObject {
        readonly type: eventTypes;
        component?: Component<any>;
    }

    export interface ComponentOptions {
        parentElement: HTMLElement | string;
        store?: DataStore<any>;
        dimensions?: { width?: number | string; height?: number | string };
        className?: string;
        type: string;
        // allow overwriting gui elements
        navigationBindings?: Highcharts.NavigationBindingsOptionsObject[];
        events?: Record<Event['type'], Function>;
        id?: string;
    }

    // JSON compatible options for exprot
    export interface ComponentJSONOptions extends DataJSON.JSONObject {
        store?: DataStore.ClassJSON; // store id
        parentElement: string; // ID?
        dimensions?: { width: number; height: number };
        className?: string;
        type: string;
        id: string;
    }
}
export default Component;
