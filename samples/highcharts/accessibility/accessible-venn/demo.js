Highcharts.chart('container', {
    accessibility: {
        enabled: true,
        point: {
            descriptionFormatter: function (point) {
                return point.accessibility.description;
            }
        },
        description: 'A venn chart showing the benefits of designing for accessibility'
    },

    chart: {
        margin: 0,
        spacing: 0
    },

    plotOptions: {
        venn: {
            borderWidth: 0,
            borderColor: '#000'
        }
    },

    series: [{
        type: 'venn',
        borderColor: '#333',
        borderWidth: 0,
        states: {
            hover: {
                enabled: true,
                borderColor: '#222',
                opacity: 1
            },
            inactive: {
                enabled: false,
                opacity: 0.1,
                borderWidth: 0
            }
        },

        dataLabels: {
            style: {
                enabled: false,
                textOutline: '0px contrast',
                fontSize: '14px'
            }
        },
        name: 'Business Case for Accessibility',
        data: [{
            sets: ['2'],
            value: 5,
            accessibility: {
                enabled: true,
                description: 'Drive Innovation - Accessibility features in products and services often solve unanticipated problems for all users.'
            },
            name: 'innovation',
            color: Highcharts.getOptions().colors[0],
            dataLabels: {
                enabled: true,
                useHTML: true,
                formatter: function () {
                    return '<div id="innovation"  class="dataLabel"><h4 class="open">Drive Innovation</h4><p class="info">Accessibility features in products and services often solve unanticipated problems for all users. <a href="#">Learn more</a></p><i id="innovation-icon" class="fas fa-cogs"></i><h4 class="closed">Drive Innovation</h4></div>';
                }
            }
        }, {
            sets: ['3'],
            value: 5,
            accessibility: {
                description: 'Enhance your brand - Accessible content will not only will enhance customer loyalty and brand awareness, but also improve organic search results.'
            },
            name: 'brand',
            color: Highcharts.getOptions().colors[2],
            borderColor: '#333',
            dataLabels: {
                y: 110,
                x: -30,
                useHTML: true,
                formatter: function () {
                    return '<div id="brand" class="dataLabel"><h4>Enhance your brand</h4><i id="brand-icon" class="far fa-smile"></i><p  class="info">Accessible content will not only will enhance customer loyalty and brand awareness, but also improve organic search results. <a href="#">Learn more</a></p></div>';
                }
            }
        }, {
            sets: ['4'],
            value: 5,
            name: 'reach',
            color: Highcharts.getOptions().colors[3],
            accessibility: {
                description: 'Extend Market Reach - Reach the 1.3 billion people world-wide who are affected by a visual impairment with accessible content.'
            },
            dataLabels: {
                y: 0,
                x: 0,
                zIndex: 10,
                useHTML: true,
                formatter: function () {
                    return '<div id="reach" class="dataLabel"><i id="reach-icon" class="fas fa-funnel-dollar"></i><h4 >Extend Market Reach</h4><p  class="info">Reach the <b>1.3 billion people</b> world-wide who are affected by a visual impairment with accessible content. <a href="#">Learn more</a> </p></div>';
                }
            }
        }, {
            sets: ['5'],
            value: 5,
            name: 'legal',
            accessibility: {
                description: 'Minimize Legal Risk - You or your customer might be facing a lawsuit if your software products are not accessible.'
            },
            color: Highcharts.getOptions().colors[5],
            dataLabels: {
                y: 5,
                x: -10,
                useHTML: true,
                formatter: function () {
                    return '<div id="legal" class="dataLabel"><i id="legal-icon" class="fas fa-gavel"></i><h4 >Minimize Legal Risk</h4><p class="info">You or your customer might be facing a lawsuit if your software products are not accessible. <a href="#">Learn more</a></p> </div>';
                }
            }
        }, {
            sets: ['4', '5'],
            value: 3,
            name: 'reach,legal',
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            dataLabels: {
                enabled: false
            },
            color: Highcharts.getOptions().colors[5],
            borderColor: '#333'
        }, {
            sets: ['2', '3'],
            value: 3,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'innovation,brand',
            color: Highcharts.getOptions().colors[2],
            borderColor: '#333',
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['3', '4'],
            value: 3,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'brand,reach',
            color: Highcharts.getOptions().colors[2],
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '4', '5'],
            value: 2,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'innovation,reach,legal',
            color: Highcharts.getOptions().colors[5],
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['5', '2'],
            value: 3,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'legal,innovation',
            color: Highcharts.getOptions().colors[5],
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '4'],
            value: 1,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'innovation,reach',
            color: '#fff',
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['3', '5'],
            value: 3,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'brand,legal',
            color: '#fff',
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['3', '4', '5'],
            value: 2,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'brand,reach,legal',
            color: '#fff',
            opacity: 1,
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '5'],
            value: 1,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'innovation,brand,legal',
            color: '#fff',
            opacity: 1,
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '4'],
            value: 2,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            name: 'innovation,brand,reach',
            color: Highcharts.getOptions().colors[2],
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '4', '5'],
            value: 3,
            accessibility: {
                description: 'The Business Case for Accessibility'
            },
            color: '#fff',
            opacity: 1,
            name: 'innovation,brandreachlegal',
            dataLabels: {
                enabled: true,
                useHTML: true,
                y: -30,
                x: -30,
                formatter: function () {
                    return '<i id="aicon" class="fas fa-universal-access"></i>';
                }
            }
        }]
    }],

    title: {
        text: '',
        style: {
            fontFamily: 'Roboto',
            fontSize: '20px',
            fontWeight: 'bold'
        }
    },

    tooltip: {
        enabled: false
    },

    exporting: {
        enabled: false
    }

});

$('i').mouseover(function (e) {
    e.preventDefault();
    $('.dataLabel').removeClass('over');
    const idArray = this.id.split('-');
    const id = idArray[0];

    $('#' + id).addClass('over');
    $('#' + id).css({ zIndex: 1000 });
    $('#aicon').addClass('over');

    setTimeout(function () {
        $('.dataLabel').removeClass('over');
        $('#aicon').removeClass('over');
    }, 5000);
});
