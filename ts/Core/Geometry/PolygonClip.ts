/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

type XYArray = [number, number];

const isInside = (
    clipEdge1 : XYArray,
    clipEdge2 : XYArray,
    p : XYArray
) : boolean =>
    (clipEdge2[0] - clipEdge1[0]) * (p[1] - clipEdge1[1]) >
    (clipEdge2[1] - clipEdge1[1]) * (p[0] - clipEdge1[0]);

const intersection = (
    clipEdge1: XYArray,
    clipEdge2: XYArray,
    prevPoint: XYArray,
    currentPoint: XYArray
) : XYArray => {
    const dc = [
            clipEdge1[0] - clipEdge2[0],
            clipEdge1[1] - clipEdge2[1]
        ],
        dp = [
            prevPoint[0] - currentPoint[0],
            prevPoint[1] - currentPoint[1]
        ],
        n1 = clipEdge1[0] * clipEdge2[1] - clipEdge1[1] * clipEdge2[0],
        n2 = prevPoint[0] * currentPoint[1] - prevPoint[1] * currentPoint[0],
        n3 = 1 / (dc[0] * dp[1] - dc[1] * dp[0]);

    return [
        (n1 * dp[0] - n2 * dc[0]) * n3,
        (n1 * dp[1] - n2 * dc[1]) * n3
    ];
};

namespace PolygonClip {

    // Simple line string clipping. Clip to bounds and insert intersection
    // points.
    export const clipLineString = (
        line: XYArray[],
        boundsPolygon: XYArray[]
    ): XYArray[][] => {
        const lineString = clipPolygon(line, boundsPolygon, false);

        return [lineString];
    };

    // Clip a polygon to another polygon using the Sutherland/Hodgman algorithm.
    export const clipPolygon = (
        subjectPolygon: XYArray[],
        boundsPolygon: XYArray[],
        closed = true
    ) : Array<XYArray> => {

        let clipEdge1 = boundsPolygon[boundsPolygon.length - 1],
            clipEdge2: XYArray,
            previousPoint: XYArray,
            currentPoint: XYArray,
            outputList : XYArray[] = subjectPolygon;

        for (let j = 0; j < boundsPolygon.length; j++) {
            const inputList = outputList;
            clipEdge2 = boundsPolygon[j];
            outputList = [];
            previousPoint = closed ?
                inputList[inputList.length - 1] :
                inputList[0];
            for (let i = closed ? 0 : 1; i < inputList.length; i++) {
                currentPoint = inputList[i];
                if (isInside(clipEdge1, clipEdge2, currentPoint)) {
                    if (!isInside(clipEdge1, clipEdge2, previousPoint)) {
                        outputList.push(intersection(
                            clipEdge1,
                            clipEdge2,
                            previousPoint,
                            currentPoint
                        ));
                    }
                    outputList.push(currentPoint);
                } else if (isInside(clipEdge1, clipEdge2, previousPoint)) {
                    outputList.push(intersection(
                        clipEdge1,
                        clipEdge2,
                        previousPoint,
                        currentPoint
                    ));
                }
                previousPoint = currentPoint;
            }
            clipEdge1 = clipEdge2;
        }
        return outputList;
    };
}

/* *
 *
 *  Default Export
 *
 * */

export default PolygonClip;
