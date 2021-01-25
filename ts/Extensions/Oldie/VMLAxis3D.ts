/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extension to the VML Renderer
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import U from '../../Core/Utilities.js';
const {
    addEvent
} = U;

/**
 * @private
 */
declare module '../../Core/Axis/Types' {
    interface AxisComposition {
        vml?: VMLAxis3D['vml'];
    }
    interface AxisTypeRegistry {
        VMLAxis3D: VMLAxis3D;
    }
}

/* eslint-disable valid-jsdoc */

class VMLAxis3DAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: VMLAxis3D) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    axis: VMLAxis3D;
    backFrame?: Highcharts.VMLElement;
    bottomFrame?: Highcharts.VMLElement;
    sideFrame?: Highcharts.VMLElement;

}

class VMLAxis3D {

    /* *
     *
     *  Static Properties
     *
     * */

    public static compose(AxisClass: typeof Axis): void {

        AxisClass.keepProps.push('vml');

        addEvent(AxisClass, 'init', VMLAxis3D.onInit);
        addEvent(AxisClass, 'render', VMLAxis3D.onRender);

    }

    /**
     * @private
     */
    public static onInit(this: Axis): void {
        const axis = this;

        if (!axis.vml) {
            axis.vml = new VMLAxis3DAdditions(axis as VMLAxis3D);
        }
    }

    /**
     * @private
     */
    public static onRender(this: Axis): void {
        const axis = this as VMLAxis3D;
        const vml = axis.vml;

        // VML doesn't support a negative z-index
        if (vml.sideFrame) {
            vml.sideFrame.css({ zIndex: 0 });
            (vml.sideFrame.front as any).attr({
                fill: vml.sideFrame.color
            });
        }
        if (vml.bottomFrame) {
            vml.bottomFrame.css({ zIndex: 1 });
            (vml.bottomFrame.front as any).attr({
                fill: vml.bottomFrame.color
            });
        }
        if (vml.backFrame) {
            vml.backFrame.css({ zIndex: 0 });
            (vml.backFrame.front as any).attr({
                fill: vml.backFrame.color
            });
        }
    }

}

interface VMLAxis3D extends Axis {
    vml: VMLAxis3DAdditions;
}

export default VMLAxis3D;
