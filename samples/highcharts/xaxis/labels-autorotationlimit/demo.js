$(function () {
    $('#container').highcharts({

        chart: {
            type: 'column'
        },
        title: {
            text: 'Auto rotation limit'
        },
        subtitle: {
            text: 'Short words means word-wrap makes sense'
        },
        xAxis: {
            type: 'category',
            labels: {
                autoRotationLimit: 40
            }
        },
        series: [{
            showInLegend: false,
            data: [{
                name: "Pasta (no gluten)",
                y: 77
            }, {
                name: 'Rice (white & brown)',
                y: 50
            }, {
                name: 'Bread (white & brown)',
                y: 20
            }, {
                name: 'Eggs (chicken, duck & goose)',
                y: 48
            }, {
                name: 'Meat (cattle, fowl & fish)',
                y: 36
            }, {
                name: 'Vegetables',
                y: 15
            }, {
                name: 'Fruits',
                y: 57
            }]
        }]
    });
});