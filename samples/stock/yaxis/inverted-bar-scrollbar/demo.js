
Highcharts.chart('container', {
    chart: {
        type: 'bar',
        marginLeft: 150
    },
    title: {
        text: 'Most popular ideas by April 2016'
    },
    subtitle: {
        text: 'Source: <a href="https://highcharts.uservoice.com/forums/55896-highcharts-javascript-api">UserVoice</a>'
    },
    xAxis: {
        type: 'category',
        title: {
            text: null
        },
        min: 0,
        max: 4,
        scrollbar: {
            enabled: true
        },
        tickLength: 0
    },
    yAxis: {
        min: 0,
        max: 1200,
        title: {
            text: 'Votes',
            align: 'high'
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Votes',
        data: [
            ["Gantt chart", 1000],
            ["Autocalculation and plotting of trend lines", 575],
            ["Allow navigator to have multiple data series", 523],
            ["Implement dynamic font size", 427],
            ["Multiple axis alignment control", 399],
            ["Stacked area (spline etc) in irregular datetime series", 309],
            ["Adapt chart height to legend height", 278],
            ["Export charts in excel sheet", 239],
            ["Toggle legend box", 235],
            ["Venn Diagram", 203],
            ["Add ability to change Rangeselector position", 182],
            ["Draggable legend box", 157],
            ["Sankey Diagram", 149],
            ["Add Navigation bar for Y-Axis in Highstock", 144],
            ["Grouped x-axis", 143],
            ["ReactJS plugin", 137],
            ["3D surface charts", 134],
            ["Draw lines over a stock chart, for analysis purpose", 118],
            ["Data module for database tables", 118],
            ["Draggable points", 117]
        ]
    }]
});
