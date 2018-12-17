/* *
 *
 *  Test cases for highcharts-gantt.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts/highcharts-gantt';

test_Gantt();

/**
 * Tests Highcharts.seriesTypes.gantt in a complex use case.
 *
 * @todo
 * - Make it more complex.
 */
function test_Gantt() {
    Highcharts.ganttChart('container', {
        title: {
            text: 'Gantt Chart with Progress Indicators'
        },
        xAxis: {
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        },

        series: [{
            type: 'gantt',
            name: 'Project 1',
            data: [{
                name: 'Start prototype',
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                completed: 0.25
            }, {
                name: 'Test prototype',
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 29)
            }, {
                name: 'Develop',
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                completed: {
                    amount: 0.12,
                    fill: '#fa0'
                }
            }, {
                name: 'Run acceptance tests',
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26)
            }]
        }]
    });
}
