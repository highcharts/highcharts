import TypeChecker from './TypeChecker.js';
const { isArray } = TypeChecker;
/**
 *
 * Check if an element is an array, and if not, make it into an array.
 *
 * @function Highcharts.splat
 *
 * @param {*} obj
 *        The object to splat.
 *
 * @return {Array}
 *         The produced or original array.
 */
function splat(obj: any): Array<any> {
    return isArray(obj) ? obj : [obj];
}

const ArrayHelper = {
    splat
};

export default ArrayHelper;
