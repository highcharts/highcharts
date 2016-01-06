/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2011-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*eslint no-unused-vars: 0 */ // @todo: Not needed in HC5
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = root.document ?
        	factory(root) : 
            factory;
    } else {
        root.Highcharts = factory(root);
    }
}(typeof window !== 'undefined' ? window : this, function (win) { // eslint-disable-line no-undef
