
$(function () {
    $('#container').highcharts({
        title: {
            text: 'All flags should be crisp with a straight stem'
        },
        series: [{
            type: 'flags',
            data: [{
                x: 0,
                title: 'auto'
            }]
        }, {
            type: 'flags',
            data: [{
                x: 1,
                title: 1,
                lineWidth: 1
            }]
        }, {
            type: 'flags',
            data: [{
                x: 2,
                title: 2,
                lineWidth: 2
            }]
        }, {
            type: 'flags',
            data: [{
                x: 3,
                title: 3,
                lineWidth: 3
            }]
        }, {
            type: 'flags',
            data: [{
                x: 4,
                title: 4,
                lineWidth: 4
            }]
        }, {
            type: 'flags',
            data: [{
                x: 5,
                title: 5,
                lineWidth: 5
            }]
        }]
    });
});