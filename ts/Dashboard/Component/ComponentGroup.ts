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

import type ComponentTypes from './ComponentType.js';

import SharedState from './SharedComponentState.js';

type componentID = ComponentTypes['id'];

interface ComponentGroup {
    id: string;
    state: SharedState;
    components: componentID[];

    addComponents(components: componentID[]): void;
    removeComponents(components: componentID[]): void;
}

class ComponentGroup {
    private static componentGroups: Record<ComponentGroup['id'], ComponentGroup> = {};

    public static getComponentGroup(
        groupID: ComponentGroup['id']
    ): ComponentGroup | undefined {
        if (this.componentGroups[groupID]) {
            return this.componentGroups[groupID];
        }
    }

    public static addComponentGroup(
        group: ComponentGroup
    ): void {
        const { id } = group;
        if (!this.componentGroups[id]) {
            this.componentGroups[id] = group;
        }
    }

    public static getGroupsFromComponent(
        componentID: componentID
    ): ComponentGroup[] {
        const groups = Object.keys(this.componentGroups);
        return groups.reduce((
            arr: ComponentGroup[],
            groupKey
        ): ComponentGroup[] => {
            const group = this.getComponentGroup(groupKey);
            if (group && group.components.indexOf(componentID) > -1) {
                arr.push(group);
            }

            return arr;
        }, []);
    }

    state: SharedState = new SharedState();
    components: componentID[] = [];
    id: string;

    constructor(id: ComponentGroup['id']) {
        this.id = id;
        ComponentGroup.addComponentGroup(this);
    }

    addComponents(components: componentID[]): void {
        while (components.length) {
            const id = components.pop();
            if (!id) {
                break;
            }
            if (this.components.indexOf(id) === -1) {
                this.components.push(id);
            }
        }
    }

    removeComponents(components: componentID[]): void {
        while (components.length) {
            const id = components.pop();
            if (!id) {
                break;
            }
            const index = this.components.indexOf(id);
            if (index > -1) {
                this.components.splice(index, 1);
            }
        }
    }

    getSharedState(): ComponentGroup['state'] {
        return this.state;
    }

    on(): void {
        throw new Error('Method not implemented.');
    }
    emit(): void {
        throw new Error('Method not implemented.');
    }
}

export default ComponentGroup;
