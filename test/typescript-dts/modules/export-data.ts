import * as Highcharts from 'highcharts';
import "highcharts/modules/export-data";

test_exportingClass();

/**
 * Tests that the export-data members are declared on the `Exporting` class
 * together with the members from the exporting module. #25384
 */
function test_exportingClass() {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'line',
            data: [1, 2, 3]
        }]
    });

    const csv: string = chart.exporting.getCSV(),
        rows: Array<Array<(number|string)>> = chart.exporting.getDataRows(),
        table: string = chart.exporting.getTable(),
        filename: string = chart.exporting.getFilename();

    chart.exporting.downloadCSV();
    chart.exporting.downloadXLS();
    chart.exporting.viewData();
    chart.exporting.hideData();
    chart.exporting.print();
}
