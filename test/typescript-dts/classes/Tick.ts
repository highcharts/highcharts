import * as Highcharts from 'highcharts';

test_Tick();

function test_Tick() {
    const chart = new Highcharts.Chart('container', {});
    const axis = new Highcharts.Axis(chart, {});
    const tick = new Highcharts.Tick(axis, 0);

    return (
        tick.label instanceof Highcharts.SVGElement &&
        tick.mark instanceof Highcharts.SVGElement
    )
}
