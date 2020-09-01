QUnit.test('Organization data', assert => {
    let chart = Highcharts.chart('container', {
        series: [{
            type: 'organization',
            keys: ['from', 'to'],
            data: [
                ["44", "8"],
                ["8", "13"],
                ["44", "43"],
                ["43", "10"],
                // Error:
                ["13", "10"]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].nodes[4].graphic.element.getAttribute('fill'),
        Highcharts.defaultOptions.colors[4],
        'The last element should be rendered and filled accoring to colorByPoint'
    );

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [{
            type: 'organization',
            keys: ['from', 'to'],
            data: [
                ['Skill Cluster', 'Skill 1'],
                ['Skill Cluster', 'Skill 2'],
                ['Skill Cluster', 'Skill 3'],
                ['Skill Cluster', 'Skill 4'],
                ['Skill Cluster', 'Skill 5'],
                ['Skill Cluster', 'Skill 6'],
                ['Skill 2', 'Skill 6 3rd Level'],
                ['Skill 6 3rd Level', 'Skill 7 4th Level'],
                ['Skill 7 4th Level', 'Skill 8 5th Level']
            ]
        }]
    });

    assert.notEqual(
        chart.series[0].nodes[8].dataLabel.y,
        -9999,
        'Node labels should be visible when not overlap (#13100).'
    );
});

QUnit.test('Organization single data', assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'organization',
            keys: ['from', 'to'],
            data: [
                ['hey', 'hey']
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].nodes.length,
        1,
        'A single-node series should be possible (#11792)'
    );
    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'The SVG should not contain NaN'
    );
});

QUnit.test('Drilldown in the organization chart should be allowed, #13711.', assert => {
    var clock = TestUtilities.lolexInstall(),
        chart = Highcharts.chart('container', {
            chart: {
                type: 'organization'
            },
            series: [{
                data: [{
                    from: "A",
                    to: "B"
                }],
                nodes: [{
                    id: 'B',
                    drilldown: "B-drill"
                }]
            }],
            drilldown: {
                activeDataLabelStyle: {
                    color: 'contrast'
                },
                series: [{
                    id: "B-drill",
                    name: "CD",
                    keys: ['from', 'to'],
                    data: [
                        ['C', 'D']
                    ]
                }]
            }
        });

    assert.strictEqual(
        chart.series[0].points[0].from,
        'A',
        'The chart should render correctly.'
    );

    chart.series[0].points[0].toNode.doDrilldown();

    setTimeout(function () {
        assert.strictEqual(
            chart.series[0].points[0].from,
            'C',
            'Drilldown should be performed and the points should be changed.'
        );
        assert.ok(
            chart.series[0].nodes[0].graphic.visibility !== 'hidden',
            'Node should be visible.'
        );
        chart.drillUp();
    }, 500);

    setTimeout(function () {
        assert.strictEqual(
            chart.series[0].points[0].from,
            'A',
            'Drillup should be performed and the points should be changed.'
        );
        assert.ok(
            chart.series[0].nodes[0].graphic.visibility !== 'hidden',
            'Node should be visible.'
        );
    }, 1000);

    TestUtilities.lolexRunAndUninstall(clock);
});
