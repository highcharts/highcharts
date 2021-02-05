import type DataEventEmitter from '../../Data/DataEventEmitter';
import type DataStore from '../../Data/Stores/DataStore';
import type ComponentType from './ComponentType';
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    uniqueKey
} = U;
namespace Component {
    type eventTypes =
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
        parentElement: HTMLElement;
        store?: DataStore<any>;
        dimensions?: { width: number; height: number };
        className?: string;
        type: string;
        // allow overwriting gui elements
        navigationBindings?: Highcharts.NavigationBindingsOptionsObject[];
        events?: Record<Event['type'], Function>;
    }
}

abstract class Component<TEventObject extends Component.Event> {

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
     * Adds a component instance to the registry
     * @param {Component} component
     * The component to add
     */
    public static addComponent(component: Component<any>): void {
        Component.instanceRegistry[component.id] = component;
    }

    /**
     * Removes a component instance from the registry
     * @param {Component} component
     * The component to remove
     */
    public static removeComponent(component: Component<any>): void {
        delete Component.instanceRegistry[component.id];
    }

    /**
     * Retrieves the IDs of the registered component instances
     * @return {string[]}
     * Array of component IDs
     */
    public static getAllComponentIDs(): string[] {
        return Object.keys(this.instanceRegistry);
    }

    /**
     * Retrieves all registered component instances
     * @return {ComponentType[]}
     * Array of components
     */
    public static getAllComponents(): Component<any>[] {
        const ids = this.getAllComponentIDs();
        return ids.map((id): Component<any> => this.instanceRegistry[id]);
    }

    public static relayMessage(
        sender: Component<any>, // Possibly layout?
        message: (string | MessageEvent), // should probably be a typical event with optional payloads
        target: string = 'all' // currently all or type. Could also add groups
    ): void {
        this.getAllComponentIDs()
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

    public static defaultOptions: Component.ComponentOptions = {
        className: 'highcharts-dashboard-component',
        parentElement: document.body,
        type: ''
    }

    public parentElement: HTMLElement;
    public store?: DataStore<any>; // the attached store
    public dimensions: { width: number; height: number };
    public element: HTMLElement;
    public options: Component.ComponentOptions;
    public type: string;
    public id: string;
    private tableEventTimeout?: number;
    private tableEvents: Function[] = [];
    protected hasLoaded: boolean;

    constructor(options: Partial<Component.ComponentOptions>) {
        this.id = 'dashboard-component-' + uniqueKey();
        this.options = merge(Component.defaultOptions, options);
        this.parentElement = this.options.parentElement;
        this.type = this.options.type;
        this.store = this.options.store;
        this.hasLoaded = false;
        // Initial dimensions
        this.dimensions = this.options.dimensions || {
            width: this.parentElement.scrollWidth,
            height: this.parentElement.scrollHeight
        };

        this.element = createElement('div', {
            className: this.options.className
        });
    }

    public attachStore(store: DataStore<any>): void {
        this.store = store;
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

        fireEvent(this, 'storeAttached', { store });
    }

    public resize(width: number, height: number): this {
        this.dimensions = { width, height };
        this.element.style.width = this.dimensions.width + 'px';
        this.element.style.height = this.dimensions.height + 'px';

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
        if (this.store) {
            this.attachStore(this.store);
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

        // Add the component instance to the registry
        Component.addComponent(this);

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

}

export default Component;
