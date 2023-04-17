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
    ControllableShapeOptions
} from './Controllables/ControllableOptions';
import type ControlPointOptions from './ControlPointOptions';
import type ControlTargetOptions from './ControlTargetOptions';
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
    touchstart?: EventCallback<Annotation>;
    touchend?: EventCallback<Annotation>;
}

export interface AnnotationOptions extends ControlTargetOptions {
    animation: Partial<AnimationOptions>;
    controlPointOptions: ControlPointOptions;
    crop: boolean;
    draggable: AnnotationDraggableValue;
    events: AnnotationEventsOptions;
    id?: (number|string);
    itemType?: string;
    labelOptions?: ControllableLabelOptions;
    labels?: Array<ControllableLabelOptions>;
    langKey?: string;
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
    y?: (number|null);
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
