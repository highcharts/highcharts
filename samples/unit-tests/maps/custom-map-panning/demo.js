QUnit.test('Custom SVG path map panning', assert => {
    // eslint-disable-next-line max-len
    const customMapData = 'M853,513L853,505L851,503L855,501L853,497L851,493L847,489L845,491L841,487L843,483L843,481L841,479L843,475L841,473L841,473L841,469L841,467L841,463L839,465L839,463L843,461L841,459L843,457L839,451L845,449L853,451L855,447L853,445L855,445L859,447L859,445L861,447L867,445L871,445L867,437L869,437L873,435L879,435L883,437L881,439L881,443L881,445L883,445L885,439L889,433L893,435L891,437L897,439L901,439L901,441L905,445L903,449L905,451L907,449L911,455L907,457L913,461L913,463L917,467L923,465L925,469L933,467L935,469L939,479L943,479L955,475L955,479L953,481L953,487L957,493L959,499L957,501L949,501L947,505L943,511L939,509L937,515L935,513L933,517L929,515L925,521L927,523L925,527L925,525L921,529L919,533L913,543L905,545L901,549L899,545L889,535L891,533L889,531L885,525L883,525L879,527L879,529L879,531L877,529L875,531L873,533L871,531L869,533L869,531L867,531L865,531L859,533L853,535L849,539L847,535L847,529L849,527L847,519L851,515z';

    const chart = Highcharts.mapChart('container', {
        chart: {
            type: 'map',
            panning: {
                enabled: true
            }
        },
        mapNavigation: {
            enabled: true
        },
        plotOptions: {
            map: {
                mapData: [{
                    path: customMapData
                }]
            }
        },
        series: [{
            nullColor: '#eee'
        }]
    });

    chart.mapView.zoomBy(2);

    const controller = new TestController(chart);
    let center = chart.mapView.center;

    // Pan in both x, y directions
    controller.mouseDown(100, 100);
    controller.mouseMove(80, 80);
    controller.mouseUp();

    assert.ok(
        center[0] < chart.mapView.center[0] &&
            center[1] < chart.mapView.center[1],
        'Map should pan in both directions.'
    );

    chart.update({
        chart: {
            panning: {
                type: 'x'
            }
        }
    });

    center = chart.mapView.center;

    controller.mouseDown(80, 80);
    controller.mouseMove(60, 60);
    controller.mouseUp();

    assert.ok(
        center[0] < chart.mapView.center[0] &&
            center[1] === chart.mapView.center[1],
        'Map should pan only in x direction.'
    );

    chart.update({
        chart: {
            panning: {
                type: 'y'
            }
        }
    });

    center = chart.mapView.center;

    controller.mouseDown(60, 60);
    controller.mouseMove(80, 80);
    controller.mouseUp();

    assert.ok(
        center[0] === chart.mapView.center[0] &&
            center[1] > chart.mapView.center[1],
        'Map should pan only in y direction.'
    );

});