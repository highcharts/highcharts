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


abstract class DataAuthenticator {

}

/* *
 *
 *  Registry
 *
 * */

declare module './AuthenticatorType' {
    interface AuthenticatorTypeRegistry {
        DataAuthenticator: typeof DataAuthenticator;
    }
}

/* *
 *
 *  Export
 *
 * */

export default DataAuthenticator;
