$(function () {


    var colors = ['#4D92B4', '#B89D83', '#585148', '#BDC6D4', '#6A7D39', '#BBB3AC', '#9A3D37', '#B4B77B', '#807266', '#d7c2aa', '#a36650'];
    var setup = {
        chart: {
            "type": "pie",
            "alignTicks": false,
            "renderTo": "P_ComposerPart0_Chart_Container",
            "amsClientID": "P_ComposerPart0_Chart",
            plotBackgroundColor: 'rgba(0,255,255,0.25)'
        },
        credits: {
            enabled: false
        },
        colors: colors,
        title: {
            "text": null,
            "style": {
                "fontFamily": "Arial, Helvetica, Sans Serif",
                "fontSize": "13px",
                "fontWeight": "bold",
                "color": "#222222"
            }
        },
        "legend": {
            backgroundColor: 'rgba(255,0,255,0.25)',
            "enabled": true,
            "borderWidth": 0,
            "itemMarginBottom": 10,
            "itemStyle": {
                "fontFamily": "Arial, Helvetica, Sans Serif",
                "fontSize": "10px",
                "color": "#222222"
            }
        },
        "exporting": {
            "buttons": {
                "contextButton": {
                    "enabled": false
                },
                "exportButton": {
                    "enabled": false
                },
                "printButton": {
                    "enabled": false
                }
            }
        },
        "tooltip": {
            "valueDecimals": 2
        },
        xAxis: {
            "labels": {
                "style": {
                    "fontFamily": "Arial, Helvetica, Sans Serif",
                    "fontSize": "10px",
                    "color": "#222222",
                    "paddingLeft": "4px",
                    "paddingRight": "4px"
                },
                "overflow": false
            },
            "title": {
                "text": null,
                "style": {}
            },
            "categories": ["Stamm 1 (AM Level) (Stamm 1 (AM Level) Desc)", "Stamm 1 / AM 3 (AM Level) (Asset manager 3)", "10821 (Description 10821)", "10822 (Description 10822)", "Stamm 1 / AM 1 (AM Level) (Asset manager 1)", "Stamm 1 / AM 4 (AM Level)", "2851 (Description 2851)", "10826 (Description 10826)", "10827 (Description 10827)", "Rest"],
            "tickmarkPlacement": "on"
        },
        yAxis: {
            "title": {
                "text": null,
                "style": {}
            },
            "minPadding": 0,
            "maxPadding": 0,
            "reversedStacks": false,
            "labels": {
                "style": {
                    "fontFamily": "Arial, Helvetica, Sans Serif",
                    "fontSize": "10px",
                    "color": "#222222"
                }
            },
            "plotLines": [{
                "value": 0,
                "width": 2,
                "color": "#222222",
                "zIndex": 4
            }]
        },
        plotOptions: {
            pie: {
                "tooltip": {
                    "pointFormat": "<span>{series.name}</span>: <b>{point.y}</b><br/>",
                    "valueDecimals": 2,
                    "valueSuffix": " CHF"
                },
                "allowPointSelect": true,
                "borderWidth": 0
            }
        },
        // now the data
        series: [{
            "name": "Value",
            "showInLegend": true,
            "dataLabels": {
                "enabled": false
            },
            minSize: 1,
            data: [{
                name: "Stamm 1 (AM Level) (Stamm 1 (AM Level) Desc)",
                y: 783842291.00,
                "color": colors[0]
            }, {
                name: "Stamm 1 / AM 3 (AM Level) (Asset manager 3)",
                y: 688035357.00,
                "color": colors[1]
            }, {
                name: "10821 (Description 10821)",
                y: 413786164.00,
                "color": colors[2]
            }, {
                name: "10822 (Description 10822)",
                y: 217199588.00,
                "color": colors[3]
            }, {
                name: "Stamm 1 / AM 1 (AM Level) (Asset manager 1)",
                y: 196689593.00,
                "color": colors[4]
            }, {
                name: "Stamm 1 / AM 4 (AM Level)",
                y: 124974272.00,
                "color": colors[5]
            }, {
                name: "2851 (Description 2851)",
                y: 111758966.00,
                "color": colors[6]
            }, {
                name: "10826 (Description 10826)",
                y: 64569428.00,
                "color": colors[7]
            }, {
                name: "10827 (Description 10827)",
                y: 38127860.00,
                "color": colors[8]
            }, {
                name: "Rest",
                y: 104615493.00,
                "color": colors[9]
            }]
        }]
    };

    var chart = new Highcharts.Chart(setup);

    $('#resize').click(function () {
        chart.setSize(550, 255, false);
    });
});