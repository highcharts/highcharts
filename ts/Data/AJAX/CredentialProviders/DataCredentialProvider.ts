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
abstract class DataCredentialProvider {

    /* *
     *
     *  Static Properties
     *
     * */

    private static readonly nameRegExp = /^function\s+(\w*?)Provider\s*\(/;

    private static readonly registry: DataCredentialProvider.ProviderRegistry = {};

    /* *
     *
     *  Static Functions
     *
     * */

    public static addProvider(providerType: typeof DataCredentialProvider): boolean {
        const providerName = DataCredentialProvider.getName(providerType),
            registry = DataCredentialProvider.registry;

        if (!providerName || registry[providerName]) {
            return false;
        }

        registry[providerName] = providerType;
        return true;
    }

    public static getName(providerType: typeof DataCredentialProvider): string {
        return (
            providerType.toString().match(DataCredentialProvider.nameRegExp) ||
            ['', '']
        )[1];
    }

    public static getProviderType(providerName: string): (typeof DataCredentialProvider|undefined) {
        return DataCredentialProvider.registry[providerName];
    }

    public static getAllProviderNames(): Array<string> {
        return Object.keys(DataCredentialProvider.registry);
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataCredentialProvider {

    export type ProviderName = string;

    export interface ProviderRegistry extends Record<string, typeof DataCredentialProvider> {
        // nothing here yet
    }

}

/* *
 *
 *  Export
 *
 * */

export default DataCredentialProvider;
