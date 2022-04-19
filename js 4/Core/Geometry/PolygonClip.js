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
var isInside = function (clipEdge1, clipEdge2, p) {
    return (clipEdge2[0] - clipEdge1[0]) * (p[1] - clipEdge1[1]) >
        (clipEdge2[1] - clipEdge1[1]) * (p[0] - clipEdge1[0]);
};
var intersection = function (clipEdge1, clipEdge2, prevPoint, currentPoint) {
    var dc = [
        clipEdge1[0] - clipEdge2[0],
        clipEdge1[1] - clipEdge2[1]
    ], dp = [
        prevPoint[0] - currentPoint[0],
        prevPoint[1] - currentPoint[1]
    ], n1 = clipEdge1[0] * clipEdge2[1] - clipEdge1[1] * clipEdge2[0], n2 = prevPoint[0] * currentPoint[1] - prevPoint[1] * currentPoint[0], n3 = 1 / (dc[0] * dp[1] - dc[1] * dp[0]), intersection = [
        (n1 * dp[0] - n2 * dc[0]) * n3,
        (n1 * dp[1] - n2 * dc[1]) * n3
    ];
    intersection.isIntersection = true;
    return intersection;
};
var PolygonClip;
(function (PolygonClip) {
    // Simple line string clipping. Clip to bounds and insert intersection
    // points.
    PolygonClip.clipLineString = function (line, boundsPolygon) {
        var ret = [], l = PolygonClip.clipPolygon(line, boundsPolygon, false);
        for (var i = 1; i < l.length; i++) {
            // Insert gap where two intersections follow each other
            if (l[i].isIntersection && l[i - 1].isIntersection) {
                ret.push(l.splice(0, i));
                i = 0;
            }
            // Push the rest
            if (i === l.length - 1) {
                ret.push(l);
            }
        }
        return ret;
    };
    // Clip a polygon to another polygon using the Sutherland/Hodgman algorithm.
    PolygonClip.clipPolygon = function (subjectPolygon, boundsPolygon, closed) {
        if (closed === void 0) { closed = true; }
        var clipEdge1 = boundsPolygon[boundsPolygon.length - 1], clipEdge2, prevPoint, currentPoint, outputList = subjectPolygon;
        for (var j = 0; j < boundsPolygon.length; j++) {
            var inputList = outputList;
            clipEdge2 = boundsPolygon[j];
            outputList = [];
            prevPoint = closed ?
                // Polygon, wrap around
                inputList[inputList.length - 1] :
                // Open line string, don't wrap
                inputList[0];
            for (var i = 0; i < inputList.length; i++) {
                currentPoint = inputList[i];
                if (isInside(clipEdge1, clipEdge2, currentPoint)) {
                    if (!isInside(clipEdge1, clipEdge2, prevPoint)) {
                        outputList.push(intersection(clipEdge1, clipEdge2, prevPoint, currentPoint));
                    }
                    outputList.push(currentPoint);
                }
                else if (isInside(clipEdge1, clipEdge2, prevPoint)) {
                    outputList.push(intersection(clipEdge1, clipEdge2, prevPoint, currentPoint));
                }
                prevPoint = currentPoint;
            }
            clipEdge1 = clipEdge2;
        }
        return outputList;
    };
})(PolygonClip || (PolygonClip = {}));
/* *
 *
 *  Default Export
 *
 * */
export default PolygonClip;
