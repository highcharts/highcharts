import type { ComponentType, ComponentTypeRegistry } from './ComponentType';
import U from '../../Core/Utilities.js';
const { merge } = U;

class ComponentRegistry {
    /**
     * Regular expression to extract the  name (group 1) from the
     * stringified class type.
     */
    public nameRegExp = /^(?:class|function)\s(\w*?)(?:Component)?\W/;

    /**
     *
     * Record of component classes
     * @todo
     *
     */
    public registry = {} as ComponentTypeRegistry;

    /* *
    *
    *  Functions
    *
    * */

    /**
     * Method used to register new component classes.
     */
    public registerComponent<T extends keyof ComponentTypeRegistry>(
        ComponentClass: ComponentTypeRegistry[T]
    ): boolean {
        const name = this.getName(ComponentClass) as T;

        if (
            typeof name === 'undefined' ||
            this.registry[name]
        ) {
            return false;
        }

        this.registry[name] = ComponentClass;

        return true;
    }

    /**
     *
     */
    public getAllComponentNames(): Array<string> {
        return Object.keys(this.registry);
    }

    /**
     *
     */
    public getAllComponents(): ComponentTypeRegistry {
        return merge(this.registry);
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
    public getName(
        component: (NewableFunction | ComponentType)
    ): string {
        return (
            component.toString().match(this.nameRegExp) ||
            ['', '']
        )[1];
    }

    public getComponent<T extends keyof ComponentTypeRegistry>(
        key:T
    ): (ComponentTypeRegistry[T]|undefined) {
        return this.registry[key];
    }
}

export default new ComponentRegistry();
