var chart = Highcharts.chart('container', {
    title: {
        text: 'Pitch mapping types',
        align: 'left',
        margin: 25
    },
    sonification: {
        duration: 8000
    },
    series: [{
        sonification: {
            tracks: [{
                mapping: {
                    pitch: {
                        mapTo: 'y', // Map to a point property
                        min: 'c3',
                        max: 'c4'
                    }
                }
            }]
        },
        data: [1, 2, 3, 4, 5]
    }, {
        sonification: {
            tracks: [{
                mapping: {
                    pitch: 'c6' // Map to a fixed value
                }
            }]
        },
        data: [2, 3, 4, 5, 6]
    }, {
        sonification: {
            tracks: [{
                mapping: {
                    // Map to multiple pitches per point
                    pitch: ['c6', 'g6'],
                    // Sets the gap between notes. Can be mapped too.
                    gapBetweenNotes: 120
                }
            }]
        },
        data: [3, 4, 5, 6, 7]
    }, {
        sonification: {
            tracks: [{
                mapping: {
                    // Map to a function, return a note number where 0 is c0
                    pitch: function (e) {
                        var time = e.time,
                            point = e.point;
                        return time > 7000 ?
                            12 + point.y * 5 :
                            12 + point.y * 3;
                    }
                }
            }]
        },
        data: [4, 5, 6, 7, 8]
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
