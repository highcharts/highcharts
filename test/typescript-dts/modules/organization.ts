import * as Highcharts from 'highcharts';
import OrganizationModule from "highcharts/modules/organization";

OrganizationModule(Highcharts);

test_simple();

function test_simple() {
    Highcharts.chart('container', {
        plotOptions: {
            series: {
                // general options for all series
            },
            organization: {
                // shared options for all organization series
            }
        },
        series: [{
            // specific options for this series instance
            type: 'organization',
            data: [{
                from: 'Category1',
                to: 'Category2',
                weight: 2
            }, {
                from: 'Category1',
                to: 'Category3',
                weight: 5
            }]
        }]
    });
}
