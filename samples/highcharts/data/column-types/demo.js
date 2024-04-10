Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    data: {
        csv: 'code;value\n01007;58\n01003;10\n01041;32\n01085;84\n01133;12',
        columnTypes: ['string', 'number']
    },

    title: {
        text: 'X-axis categories based on CSV data'
    }
});
