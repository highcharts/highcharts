Highcharts.getOptions().colors = ['#A8A8A8'];

Highcharts.chart('container', {
    title: {
        text: 'Apple Inc. Total Assets 9/29/2020'
    },
    subtitle: {
        text:
      'Source: <a href=\'https://finance.yahoo.com/quote/AAPL/balance-sheet/\'> Yahoo Finance</a>'
    },
    tooltip: {
        headerFormat: null,
        pointFormat:
      '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight} million USD',
        nodeFormat: '{point.name}: {point.sum} million USD'
    },
    series: [
        {
            borderColor: '#1a1a1a',
            borderWidth: 1,
            keys: ['from', 'to', 'weight'],
            data: [
                ['Total Assets', 'Current-Assets', 143.71],
                ['Total Assets', 'Non-Current Assets', 180.17],

                ['Current-Assets', 'Cash', 90.94],
                ['Current-Assets', 'Receivables', 37.44],
                ['Current-Assets', 'Inventory', 4.06],
                ['Current-Assets', 'Other CA', 11.26],

                ['Non-Current Assets', 'Net PPE ', 36.76],
                ['Non-Current Assets', 'Investments ', 100.88],
                ['Non-Current Assets', 'Other NCA', 42.52]
            ],
            type: 'sankey',
            name: 'Appel Assets',
            dataLabels: {
                style: {
                    color: '#1a1a1a',
                    textOutline: false
                }
            }
        }
    ]
});
