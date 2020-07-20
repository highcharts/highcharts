/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var DataModifierChain = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function DataModifierChain(dataModifiers) {
        var self = this;
        this.dataModifiersMap = {};
        this.dataModifiers = dataModifiers || [];
        if (self.dataModifiers.length) {
            self.dataModifiers.forEach(function (modifier, i) {
                self.dataModifiersMap[modifier.name] = i;
            });
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    DataModifierChain.prototype.add = function (dataModifier) {
        this.dataModifiers.push(dataModifier);
        this.dataModifiersMap[dataModifier.name] = this.dataModifiers.length - 1;
    };
    DataModifierChain.prototype.remove = function (dataModifier) {
        var index = this.dataModifiersMap[dataModifier.name];
        delete this.dataModifiersMap[dataModifier.name];
        this.dataModifiers.splice(index, 1);
    };
    DataModifierChain.prototype.clear = function () {
        this.dataModifiersMap = {};
        this.dataModifiers.length = 0;
    };
    return DataModifierChain;
}());
export default DataModifierChain;
