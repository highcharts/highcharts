import Point from '../../Core/Series/Point.js';


class LinkPoint extends Point {
    fromNode: Point = void 0 as any;
    toNode: Point = void 0 as any;
    node = {};
    isLink = true;
}


export default LinkPoint;
