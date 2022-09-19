/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type Annotation from './Annotation';
import type AST from '../../Core/Renderer/HTML/AST';
import type {
    ControllableLabelOptions,
    ControllableOptions,
    ControllableShapeOptions
} from './Controllables/ControllableOptions';
import type { ControlPointOptionsObject } from './ControlPointOptions';
import type EventCallback from '../../Core/EventCallback';
import type MockPointOptions from './MockPointOptions';
import type NavigationOptions from '../Exporting/NavigationOptions';
import type CoreOptions from '../../Core/Options';

/* *
 *
 *  Declarations
 *
 * */

export type AnnotationDraggableValue = (''|'x'|'y'|'xy');

export interface AnnotationEventsOptions {
    afterUpdate?: EventCallback<Annotation>;
    add?: EventCallback<Annotation>;
    click?: EventCallback<Annotation>;
    remove?: EventCallback<Annotation>;
}

export interface AnnotationOptions extends ControllableOptions { // @todo AnnotationOptions.d.ts
    animation: Partial<AnimationOptions>;
    controlPointOptions: ControlPointOptionsObject;
    crop: boolean;
    draggable: AnnotationDraggableValue;
    events: AnnotationEventsOptions;
    id?: (number|string);
    itemType?: string;
    labelOptions?: ControllableLabelOptions;
    labels?: Array<ControllableLabelOptions>;
    langKey?: string;
    point?: MockPointOptions;
    points?: Array<MockPointOptions>;
    shapeOptions: ControllableShapeOptions;
    shapes?: Array<ControllableShapeOptions>;
    type?: string;
    typeOptions: AnnotationTypeOptions;
    visible: boolean;
    zIndex: number;
}

export interface AnnotationTypeOptions {
    background?: Partial<ControllableShapeOptions>;
    height?: number;
    line?: Partial<ControllableShapeOptions>;
    point: MockPointOptions;
    points?: Array<AnnotationTypePointsOptions>;
    xAxis?: number;
    yAxis?: number;
}

export interface AnnotationTypePointsOptions {
    controlPoint?: number;
    x?: number;
    xAxis?: number;
    y?: number;
    yAxis?: number;
}

export interface ChartOptions extends CoreOptions {
    annotations: Array<AnnotationOptions>;
    defs: Record<string, AST.Node>;
    navigation: NavigationOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationOptions;
