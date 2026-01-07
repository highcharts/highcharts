Highcharts.chart('container', {
    chart: {
        type: 'column',
        width: 500
    },
    title: {
        text: 'Demo of <em>xAxis.labels.autoRotationLimit</em>'
    },
    subtitle: {
        text: 'Short words means word-wrap makes sense'
    },
    xAxis: {
        categories: ['Apples', 'Bananas', 'Oranges', 'Pears'],
        labels: {
            autoRotationLimit: 40
        },
        type: 'category'
    },
    series: [
        {
            data: [
                {
                    name: 'Pasta (no gluten)',
                    y: 77
                },
                {
                    name: 'Rice (white & brown)',
                    y: 50
                },
                {
                    name: 'Bread (white & brown)',
                    y: 20
                },
                {
                    name: 'Eggs (chicken, duck & goose)',
                    y: 48
                },
                {
                    name: 'Meat (cattle, fowl & fish)',
                    y: 36
                },
                {
                    name: 'Vegetables',
                    y: 15
                },
                {
                    name: 'Fruits',
                    y: 57
                }
            ],
            showInLegend: false
        }
    ]
} satisfies Highcharts.Options);
