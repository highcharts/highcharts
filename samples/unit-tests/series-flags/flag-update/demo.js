QUnit.test('Update flag (#4222)', function (assert) {
    var chart = $('#container')
        .highcharts('StockChart', {
            series: [
                {
                    data: [
                        [Date.UTC(2014, 6, 1), 10],
                        [Date.UTC(2014, 7, 1), 10],
                        [Date.UTC(2014, 8, 1), 10],
                        [Date.UTC(2014, 9, 1), 10],
                        [Date.UTC(2014, 10, 1), 10],
                        [Date.UTC(2014, 11, 1), 10],
                        [Date.UTC(2015, 1, 1), 10],
                        [Date.UTC(2015, 3, 1), 13],
                        [Date.UTC(2015, 4, 1), 14],
                        [Date.UTC(2015, 5, 1), 11],
                        [Date.UTC(2015, 6, 1), 5]
                    ],
                    id: 'dataseries'
                },
                {
                    type: 'flags',
                    data: [
                        {
                            x: Date.UTC(2015, 3, 1),
                            title: 'H',
                            text: 'Name'
                        }
                    ],
                    onSeries: 'dataseries',
                    shape: 'circlepin'
                }
            ]
        })
        .highcharts();

    var flag = {
            x: Date.UTC(2015, 5, 1),
            title: 'Name2',
            text: 'new',
            shape: 'squarepin'
        },
        point = chart.series[1].points[0];

    point.update(flag, true, false);
    assert.strictEqual(
        point.graphic.element.querySelector('text').textContent,
        flag.title,
        'Updated title'
    );
    assert.strictEqual(
        point.graphic.box.symbolName,
        'squarepin',
        '#15384: Shape should have updated'
    );

    chart.tooltip.refresh([point]);

    assert.strictEqual(
        chart.tooltip.label.element.lastChild.lastChild.textContent
            .replace('\u200B', ''),
        flag.text,
        'Updated text'
    );

    const eventCount = el => {
        let count = 0;
        // eslint-disable-next-line
        for (const t in el.hcEvents) {
            count += el.hcEvents[t].length;
        }
        return count;
    };

    const before = eventCount(point.graphic.element);
    chart.series[1].redraw();
    assert.strictEqual(
        eventCount(point.graphic.element),
        before,
        'Event handlers should not leak into point graphic on series redraw'
    );
});

QUnit.test('#14649: Dynamically updated visual attributes', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        series: [
            {
                id: 'data',
                data: [
                    [1, 1],
                    [2, 3],
                    [3, 5]
                ]
            },
            {
                type: 'flags',
                data: [
                    {
                        x: 1,
                        fillColor: 'green'
                    },
                    {
                        x: 3,
                        fillColor: 'red'
                    }
                ],
                onSeries: 'data',
                shape: 'circle'
            }
        ]
    });

    chart.series[1].setData([
        {
            x: 1,
            fillColor: 'blue'
        },
        {
            x: 3,
            fillColor: 'red'
        }
    ]);

    assert.strictEqual(
        chart.series[1].points[0].graphic.attr('fill'),
        'blue',
        'Graphic fill should be updated'
    );

    chart.series[1].points[1].update({
        fillColor: 'pink'
    });

    assert.strictEqual(
        chart.series[1].points[1].graphic.attr('fill'),
        'pink',
        'Graphic fill should be updated'
    );
});
