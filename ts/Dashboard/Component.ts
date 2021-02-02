import type DataStore from '../Data/Stores/DataStore';
import U from '../Core/Utilities.js';
const {
    createElement,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    uniqueKey
} = U;

type eventTypes = 'render' | 'afterRender' | 'redraw' | 'afterRedraw' | 'update' | 'message' | 'tableChanged';

export interface ComponentOptions {
    parentElement: HTMLElement;
    store?: DataStore<any>;
    dimensions?: { width: number; height: number };
    className?: string;
    type: string;
    // allow overwriting gui elements
    navigationBindings?: Highcharts.NavigationBindingsOptionsObject[];
    events?: Record<string, Function>;
}

abstract class Component {
    public static componentRegistry: Record<string, Component> = {};

    public static addComponent(component: Component): void {
        Component.componentRegistry[component.id] = component;
    }

    public static removeComponent(component: Component): void {
        delete Component.componentRegistry[component.id];
    }

    public static getAllComponentIDs(): string[] {
        return Object.keys(this.componentRegistry);
    }

    public static getAllComponents(): Component[] {
        const ids = this.getAllComponentIDs();
        return ids.map((id): Component => this.componentRegistry[id]);
    }

    // This could be on another class
    public static relayMessage(
        sender: Component, // Possibly layout?
        message: (string | object | Function), // should probably be a typical event with optional payloads
        target: string = 'all' // currently all or type. Could also add groups or IDs
    ): void {
        this.getAllComponentIDs().forEach((componentID): void => {
            const component = this.componentRegistry[componentID];

            if (component.type === target || target === 'all') {
                component.emit('message', {
                    detail: {
                        sender,
                        target
                    },
                    message
                });
            }
        });
    }

    public static defaultOptions: ComponentOptions = {
        className: 'highcharts-dashboard-component',
        parentElement: document.body,
        type: ''
    }

    public parentElement: HTMLElement;
    public store?: DataStore<any>; // the attached store
    public dimensions: { width: number; height: number };
    public element: HTMLElement;
    public options: ComponentOptions;
    public type: string;
    public id: string;
    private tableEventTimeout?: number;
    private tableEvents: Function[] = [];

    constructor(options: Partial<ComponentOptions>) {
        this.id = 'dashboard-component' + uniqueKey();
        this.options = merge(Component.defaultOptions, options);
        this.parentElement = this.options.parentElement;
        this.type = this.options.type;
        this.store = this.options.store;
        if (this.store) {
            this.attachStore(this.store);
        }

        // Initial dimensions
        this.dimensions = this.options.dimensions || {
            width: this.parentElement.scrollWidth,
            height: this.parentElement.scrollHeight
        };

        this.element = createElement('div', {
            className: options.className
        });

        this.parentElement.appendChild(this.element);

        // Setup event listeners
        // Grabbed from Chart.ts
        const events = this.options.events;
        if (events) {
            objectEach(events, (event, eventType): void => {
                if (isFunction(event)) {
                    this.on(eventType as eventTypes, event);
                }
            });
        }
        this.on('message', (e: Record<string, any>): void => {
            if (typeof e.message?.callback === 'function') {
                e.message.callback.apply(this);
            }
        });

        Component.addComponent(this);
    }

    public attachStore(store: DataStore<any>): void {
        // Set up event listeners
        ['afterInsertRow', 'afterDeleteRow', 'afterUpdateRow', 'afterClearTable']
            .forEach((event: any): void => {
                this.tableEvents.push(store.table.on(event, (e): void => {

                    clearInterval(this.tableEventTimeout);
                    this.tableEventTimeout = setTimeout((): void => {
                        this.emit('tableChanged', e);
                        this.tableEventTimeout = void 0;
                    }, 100);
                }));
            });

        this.tableEvents.push(store.on('afterLoad', (e): void => {
            this.emit('tableChanged', e);
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

    public update(newOptions: Partial<ComponentOptions>): this {
        // Update options
        this.options = merge(this.options, newOptions);
        fireEvent(this, 'update', {
            options: newOptions
        });

        return this;
    }

    public render(): this {
        this.parentElement.appendChild(this.element);
        const e = {
            component: this
        };
        fireEvent(this, 'render', e);
        return e.component;
    }

    public redraw(): this {
        // Do a redraw
        const e = {
            component: this
        };
        fireEvent(this, 'redraw', e);
        return e.component;
    }

    public destroy(): void {
        while (this.element.firstChild) {
            this.element.firstChild.remove();
        }
        // Unregister events
        this.tableEvents.forEach((eventCallback): void => eventCallback());
        this.element.remove();
    }

    public on(
        type: eventTypes,
        callback: Function
    ): Function {
        return addEvent(this, type, callback);
    }

    public emit(
        type: eventTypes,
        attributes: Record<string, any> = {}
    ): void {
        fireEvent(this, type, attributes);
    }

    public postMessage(message: any, target?: string): void {
        Component.relayMessage(this, message, target);
    }

}

export default Component;
