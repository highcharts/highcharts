// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2009-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = root.document ?
        	factory(root) : 
            factory;
    } else {
        root.Highcharts = factory(root);
    }
}(typeof window !== 'undefined' ? window : this, function (win) { // eslint-disable-line no-undef
