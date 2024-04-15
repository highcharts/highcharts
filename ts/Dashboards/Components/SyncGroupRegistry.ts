/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import Component from './Component';


/* *
 *
 *  Class
 *
 * */
class SyncGroupRegistry {

    /* *
    *
    * Properties
    *
    * */
    private components: Record<string, Set<Component>> = {};

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Add a sync with a component to the sync group.
     *
     * @param groupName name of the group
     * @param syncType type of the sync to add
     * @param component component to add
     */
    public addComponent(
        groupName: string,
        syncType: string,
        component: Component
    ): void {
        if (!groupName || !syncType) {
            return;
        }

        const groupKey = `${groupName}:${syncType}`;
        const componentsSet: Set<Component> | undefined =
            this.components[groupKey];

        if (componentsSet) {
            componentsSet.add(component);
        } else {
            this.components[groupKey] = new Set([component]);
        }
    }

    /**
     * Get all components from the sync group.
     *
     * @param groupName name of the group
     * @param syncType type of the sync to get
     * @return components
     */
    public getComponents(
        groupName: string,
        syncType: string
    ): Component[] {
        const componentsSet = this.components[`${groupName}:${syncType}`];

        if (componentsSet) {
            return Array.from(componentsSet);
        }

        return [];
    }

    /**
     * Remove a component from the sync group.
     *
     * @param groupName name of the group
     * @param syncType type of the sync to remove
     * @param component component to remove
     */
    public removeComponent(
        groupName: string,
        syncType: string,
        component: Component
    ): void {
        const groupKey = `${groupName}:${syncType}`;
        const componentsSet = this.components[groupKey];

        if (componentsSet) {
            componentsSet.delete(component);
        }

        if (componentsSet.size < 1) {
            delete this.components[groupKey];
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */
export default SyncGroupRegistry;
