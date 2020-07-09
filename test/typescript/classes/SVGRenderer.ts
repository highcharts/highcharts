import * as Highcharts from 'highcharts';

test_SVGRenderer();

function test_SVGRenderer() {
    const chart = new Highcharts.Chart('container', {}),
        renderer = chart.renderer;

    // #13678 tests
    renderer.g();
    renderer.box = renderer.box;
    renderer.rect();
}
