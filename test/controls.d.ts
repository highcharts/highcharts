/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/
/**
 * DemoKit class, temporarily declared literally for samples.
 */
declare class HighchartsControls {
    static setupBooleanHandler(
        path: string,
        rid: string,
        overrideValue?: boolean
    ): void;
    static setupColorHandler(
        path: string,
        colorId: string,
        opacityId: string,
        valueId: string,
        overrideValue?: string
    ): void;
    static setupNumberHandler(
        path: string,
        rid: string,
        valueRid: string,
        overrideValue?: number
    ): void;
    static setupArrayOfStringHandler(
        path: string,
        rid: string,
        valueRid: string,
        overrideValue?: string[]
    ): void;
    static updateOptionsPreview(): void;
}
