$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2010'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' % of production with ' + this.point.r + '&euro; of revenue';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Fruit production/revenue',
                radiusValued: true,
                minRadius: 20,
                data: [
                    {
                        name: 'Apples',
                        y: 12,
                        r:20000,
                        sliced: true,
                        selected: true
                    },{
                        name: 'Pears',
                        y: 12000,
                        r:25
                    },{
                        name: 'Strawberries',
                        y: 5,
                        r:15000
                    },{
                        name: 'Peaches',
                        y: 15,
                        r:30000
                    }
                    
                ]
            }]
        });
    });
    
});