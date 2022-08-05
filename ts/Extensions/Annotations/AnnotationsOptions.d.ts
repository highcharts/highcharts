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
import type {
    AnnotationControlPointOptionsObject
} from './ControlPointOptions';
import type {
    ControllableLabelOptions,
    ControllableOptions,
    ControllableShapeOptions
} from './Controllables/ControllableOptions';
import type EventCallback from '../../Core/EventCallback';
import type MockPointOptions from './MockPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export type AnnotationDraggableValue = (''|'x'|'y'|'xy');

export interface AnnotationsEventsOptions {
    afterUpdate?: EventCallback<Annotation>;
    add?: EventCallback<Annotation>;
    click?: EventCallback<Annotation>;
    remove?: EventCallback<Annotation>;
}
export interface AnnotationsOptions extends ControllableOptions { // @todo AnnotationOptions.d.ts
    animation: Partial<AnimationOptions>;
    controlPointOptions: AnnotationControlPointOptionsObject;
    crop: boolean;
    draggable: AnnotationDraggableValue;
    events: AnnotationsEventsOptions;
    id?: (number|string);
    itemType?: string;
    labelOptions?: ControllableLabelOptions;
    labels: Array<ControllableLabelOptions>;
    langKey?: string;
    point?: MockPointOptions;
    points?: Array<MockPointOptions>;
    shapeOptions: ControllableShapeOptions;
    shapes?: Array<ControllableShapeOptions>;
    type?: string;
    typeOptions: AnnotationsTypeOptions;
    visible: boolean;
    zIndex: number;
}
export interface AnnotationsTypeOptions {
    background?: Partial<ControllableShapeOptions>;
    height?: number;
    line?: Partial<ControllableShapeOptions>;
    point: MockPointOptions;
    points?: Array<AnnotationsTypePointsOptions>;
    xAxis?: number;
    yAxis?: number;
}
export interface AnnotationsTypePointsOptions {
    controlPoint?: number;
    x?: number;
    xAxis?: number;
    y?: number;
    yAxis?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationsOptions;
