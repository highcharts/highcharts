var forExport = false,
    data = JSON.parse(document.getElementById('data').innerHTML);

// Conditionally shorten names to fit into the cells
Highcharts.addEvent(Highcharts.Series, 'afterDrawDataLabels', function () {
    this.points.forEach(function (p) {
        var label = p.dataLabel,
            textStr,
            newText;
        if (label) {

            // First, shorten "dotter"
            textStr = label.textStr;
            if (label.element.textContent.indexOf('\u2026') !== -1) {
                newText = textStr.replace(/(dtr\.|dtr|datter|dotter)/g, 'd.');
                if (newText !== textStr) {
                    label.attr({
                        text: newText
                    });
                }
            }

            // Second, replace patronym with single letter
            textStr = label.textStr;
            if (label.element.textContent.indexOf('\u2026') !== -1) {
                newText = textStr.replace(
                    / ([a-zA-Z]+)(d\.|son|sen) /g,
                    function (a) {
                        return a.substr(0, 2) + ' ';
                    }
                );
                if (newText !== textStr) {
                    label.attr({
                        text: newText
                    });
                }
            }
        }
    });
});

Highcharts.chart('container', {

    chart: {
        width: forExport ? 3000 : undefined,
        height: '100%',
        backgroundColor: 'transparent'
    },

    title: {
        text: ''
    },
    series: [{
        type: 'sunburst',
        animation: false,
        data: data,
        startAngle: -90,
        borderColor: 'gray',
        dataLabels: {
            format: '{point.name}',
            useHTML: false,
            style: {
                fontWeight: 'normal',
                overflow: 'hidden',
                //textOverflow: '"."' is nice when useHTML
                whiteSpace: 'nowrap',
                textAlign: 'center',
                fontSize: forExport ? '14px' : undefined,
                textOutline: 'none'
            },
            padding: 3
        },
        point: {
            events: {
                click: function () {
                    var win = window.open(
                        'https://www.geni.com/' + this.geniProfileId,
                        'profile'
                    );
                    win.focus();
                }
            }
        },
        levels: [{
            level: 1,
            color: '#ffffff'
        }, {
            level: 2,
            color: '#ffffff'
        }, {
            level: 3
        }, {
            level: 4,
            colorVariation: {
                key: 'brightness',
                to: -0.2
            }
        }, {
            level: 5,
            colorVariation: {
                key: 'brightness',
                to: 0.2
            }
        }, {
            level: 6,
            colorVariation: {
                key: 'brightness',
                to: 0.1
            }
        }, {
            level: 7,
            colorVariation: {
                key: 'brightness',
                to: 0.1
            }
        }, {
            level: 8,
            dataLabels: {
                style: {
                    fontSize: forExport ? undefined : '9px'
                }
            }
        }, {
            level: 9,
            dataLabels: {
                style: {
                    fontSize: forExport ? '11px' : '7px'
                }
            }
        }, {
            level: 10,
            levelSize: forExport ? {} : {
                unit: 'pixels',
                value: 16
            },
            dataLabels: {
                enabled: forExport,
                style: {
                    fontSize: forExport ? '10px' : '7px'
                }
            }
        }, {
            level: 11,
            levelSize: forExport ? {} : {
                unit: 'pixels',
                value: 16
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: forExport ? undefined : '7px'
                }
            }
        }],
        states: {
            hover: {
                brightness: -0.25
            }
        },
        turboThreshold: Number.MAX_VALUE

    }],
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.label}',
        useHTML: false,
        outside: true,
        _style: {
            pointerEvents: 'auto'
        }
    },
    exporting: {
        allowHTML: true
    }
});