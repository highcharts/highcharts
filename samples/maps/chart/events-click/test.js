function test(chart) { // eslint-disable-line no-unused-vars
    chart.pointer.onContainerClick({
        pageX: 40,
        pageY: 250,
        type: 'click',
        target: $('svg rect')[0]
    });
    chart.pointer.onContainerClick({
        pageX: 230,
        pageY: 320,
        type: 'click',
        target: $('svg rect')[0]
    });
}