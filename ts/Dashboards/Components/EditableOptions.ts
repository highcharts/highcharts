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

import type { RendererElement } from '../EditMode/EditRenderer.js';
import type Component from './Component.js';

namespace EditableOptions {

    export interface Configuration {
        name: string;
        type: ElementType;
        detailedOptions?: Array<DetailedOptions>
        propertyPath?: Array<string>
        value?: any;
    }

    export type ElementType =
        | 'input'
        | 'text'
        | 'textarea'
        | 'toggle'
        | 'select'
        | 'nested';

    export interface DetailedOptions {
        name: string;
        allowEnabled?: boolean;
        propertyPath?: Array<string>;
        options: Array<Record<string, any>>;
    }


    export interface OptionsBindings {
        keyMap: Record<string, string>;
        typeMap: Record<string, string>;
        skipRedraw: string[]; // keys of options that should not trigger redraw
    }

    export interface getTypesType {
        type?: string;
        value?: string;
        children?: Record<string, getTypesType>
    }

    export type getOptionsType = Record<string, getTypesType>;
}

class EditableOptions {

    public static defaultBindings: EditableOptions.OptionsBindings = {
        keyMap: {
            color: 'colorPicker',
            title: 'text',
            caption: 'text',
            style: 'textarea'
        },
        typeMap: {
            'string': 'text',
            'number': 'input',
            'boolean': 'toggle'
        },
        skipRedraw: []
    };

    // Bindings of basic types to "editor components"
    public static defaultTypeMap: Record<string, string> = {
        'string': 'text',
        'number': 'input',
        'boolean': 'toggle'
    };

    public component: Component;
    public bindings: EditableOptions.OptionsBindings;

    constructor(
        component: Component,
        bindings: EditableOptions.OptionsBindings =
        EditableOptions.defaultBindings
    ) {
        this.component = component;
        this.bindings = bindings;
    }

    public getOptions(): (Array<EditableOptions.Configuration>) {
        return this.component.options.editableOptions;
    }
}

export default EditableOptions;
