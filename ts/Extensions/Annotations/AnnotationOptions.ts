/* *
 *
 *  (c) 2009-2025 Highsoft, Black Label
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
import type { DeepPartial } from '../../Shared/Types';
import type EventCallback from '../../Core/EventCallback';
import type MockPointOptions from './MockPointOptions';
import type NavigationOptions from '../Exporting/NavigationOptions';
import type CoreOptions from '../../Core/Options';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Possible directions for draggable annotations. An empty string (`''`)
 * makes the annotation undraggable.
 *
 * @typedef {''|'x'|'xy'|'y'} Highcharts.AnnotationDraggableValue
 * @requires modules/annotations
 */
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
    className?: string;
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

    /**
     * Additional options for an annotation with the type.
     */
    typeOptions: AnnotationTypeOptions;
    types: Record<string, DeepPartial<AnnotationOptions>>;
    visible: boolean;
    zIndex: number;
}

export interface AnnotationTypeOptions {
    background?: Partial<ControllableShapeOptions>;
    height?: number;

    /**
     * Line options.
     */
    line?: Partial<ControllableShapeOptions>;
    point: MockPointOptions;
    points?: Array<AnnotationTypePointsOptions>;
    type?: string;

    /**
     * This number defines which xAxis the point is connected to. It refers to
     * either the axis id or the index of the axis in the xAxis array.
     */
    xAxis?: number;

    /**
     * This number defines which yAxis the point is connected to. It refers to
     * either the axis id or the index of the axis in the xAxis array.
     */
    yAxis?: number;
}

export interface AnnotationTypePointsOptions {
    controlPoint?: number;

    /**
     * The x position of the point.
     */
    x?: number;
    xAxis?: number;

    /**
     * The y position of the point.
     */
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
