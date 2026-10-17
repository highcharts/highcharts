/**
 * Global test typings. Side-effect imports ensure the declaration files are
 * included by the compiler.
 */
/* eslint-disable node/no-unpublished-import */
import '../code/highcharts';
import 'jquery';
import 'qunit';
import '../test/controls';
import '../test/test-controller.d';
import '../test/test-template.d';
import '../test/test-utilities.d';

/**
 * Global test typings for use in samples.
 */
declare global {
    namespace Highcharts {
        interface Series {
            // @todo: Add proper support. Used in black-and-white demo.
            currentDataGrouping: TimeTicksInfoObject;
        }
    }
    namespace HighchartsConnectors {
        namespace Morningstar {
            class TimeSeriesConnector {
                constructor(options: any);
                load(): Promise<void>;
                getTable(): Highcharts.DataTable;
            }
        }
    }
}
