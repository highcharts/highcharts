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
 *  Imports
 *
 * */

import type AuthenticatorType from '../Authenticators/AuthenticatorType';
import type CredentialProviderType from './CredentialProviderType';
import type DataJSON from '../../DataJSON';

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

    public static getName(providerType: (CredentialProviderType|Function)): string {
        return (
            providerType.toString().match(DataCredentialProvider.nameRegExp) ||
            ['', '']
        )[1];
    }

    public static getProviderType(providerName: string): (CredentialProviderType|undefined) {
        return DataCredentialProvider.registry[providerName];
    }

    public static getAllProviderNames(): Array<string> {
        return Object.keys(DataCredentialProvider.registry);
    }

    /* *
     *
     *  Functions
     *
     * */

    public abstract setCredentials(authenticator: AuthenticatorType): boolean;

    public abstract toJSON(): DataCredentialProvider.ClassJSON;

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataCredentialProvider {

    export interface ClassJSON extends DataJSON.ClassJSON {
        // nothing here yet
    }

    export type ProviderName = string;

    export interface ProviderRegistry extends Record<string, CredentialProviderType> {
        // nothing here yet
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './CredentialProviderType' {
    interface CredentialProviderTypeRegistry {
        DataCredentialProvider: typeof DataCredentialProvider;
    }
}

/* *
 *
 *  Export
 *
 * */

export default DataCredentialProvider;
