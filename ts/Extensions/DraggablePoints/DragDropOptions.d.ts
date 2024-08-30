/* *
 *
 *  Imports
 *
 * */

import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type { CursorValue } from '../../Core/Renderer/CSSObject';
import type {
    PointDragCallbackFunction,
    PointDragStartCallbackFunction,
    PointDropCallbackFunction
} from './DraggablePoints';

/* *
 *
 *  Declarations
 *
 * */

export interface DragDropGuideBoxOptions {
    className?: string;
    color?: ColorType;
    cursor?: string;
    lineColor?: ColorString;
    lineWidth?: number;
    zIndex?: number;
}

export interface DragDropOptions {
    draggableX?: boolean;
    draggableY?: boolean;
    dragHandle?: DragDropHandleOptions;
    dragMaxX?: number;
    dragMaxY?: number;
    dragMinX?: number;
    dragMinY?: number;
    dragPrecisionX?: number;
    dragPrecisionY?: number;
    dragSensitivity?: number;
    groupBy?: string;
    guideBox?: Record<string, DragDropGuideBoxOptions>;
    liveRedraw?: boolean;
}

export interface DragDropHandleOptions {
    className?: string;
    color?: ColorType;
    cursor?: CursorValue;
    lineColor?: ColorString;
    lineWidth?: number;
    pathFormatter?: Function;
    zIndex?: number;
}

export interface PointEventsOptionsObject {
    drag?: PointDragCallbackFunction;
    dragStart?: PointDragStartCallbackFunction;
    drop?: PointDropCallbackFunction;
}

/* *
 *
 *  Default Export
 *
 * */

export default DragDropOptions;
