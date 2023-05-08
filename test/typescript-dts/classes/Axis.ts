import * as Highcharts from 'highcharts';

test_Axis_defaultLabelFormatter();

function test_Axis_defaultLabelFormatter() {
    const chart = new Highcharts.Chart({}),
        axis = new Highcharts.Axis(chart, {}),
        tick = new Highcharts.Tick(axis, 1),
        ctx1: Highcharts.AxisLabelsFormatterContextObject = {
            axis,
            chart,
            dateTimeLabelFormat: '%d',
            isFirst: !!tick.isFirst,
            isLast: !!tick.isLast,
            pos: tick.pos,
            tick,
            value: 0
        },
        ctx2: Highcharts.AxisLabelsFormatterContextObject = {
            axis,
            chart,
            isFirst: !!tick.isFirst,
            isLast: !!tick.isFirst,
            pos: tick.pos,
            text: '',
            tick,
            value: 0
        };

    axis.defaultLabelFormatter.call(ctx1, ctx1);
    axis.defaultLabelFormatter.call(ctx2, ctx2);
}