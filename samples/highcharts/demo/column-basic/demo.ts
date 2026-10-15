Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Milano Cortina 2026 Winter Olympic medals, top six nations',
        align: 'left'
    },
    subtitle: {
        text:
            'Source: <a target="_blank" ' +
            'href="https://www.olympics.com/en/olympic-games/milano-cortina-2026/medals">www.olympics.com</a>',
        align: 'left'
    },
    xAxis: {
        categories: [
            'Norway', 'USA', 'Netherlands', 'Italy', 'Germany', 'France'
        ],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Medals'
        }
    },
    legend: {
        symbolRadius: 3
    },
    tooltip: {
        shared: true,
        headerFormat: '<table><caption>{point.key}</caption>',
        pointFormat: `
        <tr>
          <th>
            <svg width="20" height="10">
              <rect x="5" y="0" width="10" height="10" rx="3" ry="3"
                  fill="{series.color}" />
            </svg>
            {series.name}
          </th>
          <td>{point.y}</td>
        </tr>
        `,
        footerFormat: '</table>',
        // valueSuffix: '',
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.1,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Gold medals',
            data: [18, 12, 10, 10, 8, 8]
        },
        {
            name: 'Silver medals',
            data: [12, 12, 7, 6, 10, 9]
        },
        {
            name: 'Bronze medals',
            data: [11, 9, 3, 14, 8, 6]
        }
    ]
});
