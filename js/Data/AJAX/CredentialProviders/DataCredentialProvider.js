/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/* *
 *
 *  Class
 *
 * */
var DataCredentialProvider = /** @class */ (function () {
    function DataCredentialProvider() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    DataCredentialProvider.addProvider = function (providerType) {
        var providerName = DataCredentialProvider.getName(providerType), registry = DataCredentialProvider.registry;
        if (!providerName || registry[providerName]) {
            return false;
        }
        registry[providerName] = providerType;
        return true;
    };
    DataCredentialProvider.getName = function (providerType) {
        return (providerType.toString().match(DataCredentialProvider.nameRegExp) ||
            ['', ''])[1];
    };
    DataCredentialProvider.getProviderType = function (providerName) {
        return DataCredentialProvider.registry[providerName];
    };
    DataCredentialProvider.getAllProviderNames = function () {
        return Object.keys(DataCredentialProvider.registry);
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataCredentialProvider.nameRegExp = /^function\s+(\w*?)Provider\s*\(/;
    DataCredentialProvider.registry = {};
    return DataCredentialProvider;
}());
/* *
 *
 *  Export
 *
 * */
export default DataCredentialProvider;
