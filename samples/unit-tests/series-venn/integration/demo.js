QUnit.test('zIndex. #10490', assert => {
    const unsortedData = [{
        sets: ['A', 'B'],
        value: 1
    }, {
        sets: ['B', 'C', 'A'],
        value: 1
    }, {
        sets: ['A'],
        value: 2
    }, {
        sets: ['C'],
        value: 2
    }, {
        sets: ['A', 'C'],
        value: 1
    }, {
        sets: ['B', 'C'],
        value: 1
    }, {
        sets: ['B'],
        value: 2
    }];

    const { series: [{ points }] } = Highcharts.chart('container', {
        series: [{
            type: 'venn',
            data: unsortedData
        }]
    });

    const mapOfIdToZIndex = points.reduce((map, point) => {
        map[point.sets.join()] = point.graphic.attr('zIndex');
        return map;
    }, {});

    assert.deepEqual(
        mapOfIdToZIndex,
        {
            A: 1,
            B: 1,
            C: 1,
            'A,B': 2,
            'A,C': 2,
            'B,C': 2,
            'A,B,C': 3
        },
        'should order the point graphics by its number of sets in the relation'
    );
});