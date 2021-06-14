var getByClass = function (className) {
    return Array.prototype.slice.call(
        document.getElementsByClassName(className)
    );
};
var getEl = function (id) {
    return document.getElementById(id);
};
var nextMouseOver = null;

// Overlay code

function removeOverlay() {
    getEl('venn-figure').setAttribute('aria-hidden', false);
    getEl('before').removeEventListener('focus', removeOverlay);
    getEl('after').removeEventListener('focus', removeOverlay);
    getEl('before').focus();

    getEl('overlay').style.visibility = 'hidden';
    getEl('removeOverlay').style.visibility = 'hidden';
    getEl('removeOverlay').setAttribute('aria-expanded', true);
    getEl('before').setAttribute('tabindex', '-1');
    getEl('after').removeAttribute('tabindex');

    setTimeout(function () {
        getEl('after').innerHTML = 'Venn diagram displayed';
    }, 100);
    setTimeout(function () {
        getEl('after').innerHTML = '';
    }, 800);
}

getEl('before').addEventListener('focus', removeOverlay);
getEl('after').addEventListener('focus', removeOverlay);

getEl('removeOverlay').onclick = removeOverlay;


// Venn code

function removeHover() {
    getByClass('dataLabel').forEach(function (e) {
        e.classList.remove('over');
    });
    getEl('aicon').classList.remove('over');
    getEl('dyncaption').classList.remove('visible');
}

getEl('container').addEventListener('mouseleave', function () {
    removeHover();
});

document.addEventListener('mouseup', function (e) {
    if (!getEl('container').contains(e.target)) {
        removeHover();
    }
});

document.addEventListener('keydown', function (e) {
    if ((e.which || e.keyCode) === 27) { // esc key
        removeHover();
    }
});

Highcharts.chart('container', {
    lang: {
        accessibility: {
            chartContainerLabel: 'Venn diagram of accessibility selling points'
        }
    },

    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                return point.accessibility.description;
            }
        },
        screenReaderSection: {
            beforeChartFormat: '<p>A venn diagram showing 4 major benefits of designing for accessibility, ' +
                'and how they combine together to form the selling point of accessibility.</p>'
        },
        landmarkVerbosity: 'one'
    },

    chart: {
        margin: 0
    },

    credits: {
        enabled: false
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
            enabled: true,
            useHTML: true,
            style: {
                textOutline: '0px contrast',
                fontSize: '14px'
            }
        },
        point: {
            events: {
                mouseOver: function () {
                    var point = this;
                    var pointName = point.name;
                    var category = pointName.split(',')[0];

                    clearTimeout(nextMouseOver);
                    nextMouseOver = setTimeout(function () {
                        getByClass('dataLabel').forEach(function (e) {
                            e.classList.remove('over');
                        });

                        var mq = window.matchMedia('(max-width: 480px)');
                        var caption = getEl('dyncaption');
                        var label = getEl(category);
                        if (mq.matches) {
                            caption.className = 'visible content-' + category;
                            getEl('caption-content').innerHTML = label.innerHTML;
                        } else {
                            caption.classList.remove('visible');
                            label.classList.add('over');
                            getEl('aicon').classList.add('over');
                        }
                    }, 100);
                }
            }
        },
        name: 'Business Case for Accessibility',
        data: [{
            sets: ['2'],
            value: 5,
            accessibility: {
                description: 'Drive Innovation - Accessibility features in products and services often solve unanticipated problems for all users.'
            },
            name: 'innovation',
            color: Highcharts.getOptions().colors[0],
            dataLabels: {
                format: '<div id="innovation"  class="dataLabel"><h4 class="open">Drive Innovation</h4><p class="info">Accessibility features in products and services often solve unanticipated problems for all users.</p><i id="innovation-icon" class="fas fa-cogs"></i><h4 class="closed">Drive Innovation</h4></div>'
            }
        }, {
            sets: ['3'],
            value: 5,
            accessibility: {
                description: 'Enhance your brand - Accessible content will not only enhance customer loyalty and brand awareness, but also improve organic search results.'
            },
            name: 'brand',
            color: Highcharts.getOptions().colors[2],
            borderColor: '#333',
            dataLabels: {
                y: 110,
                x: -30,
                format: '<div id="brand" class="dataLabel"><h4>Enhance your brand</h4><i id="brand-icon" class="far fa-smile"></i><p  class="info">Accessible content will not only enhance customer loyalty and brand awareness, but also improve organic search results.</p></div>'
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
                format: '<div id="reach" class="dataLabel"><i id="reach-icon" class="fas fa-funnel-dollar"></i><h4 >Extend Market Reach</h4><p  class="info">Reach the <b>1.3 billion people</b> world-wide who are affected by a visual impairment with accessible content.</p></div>'
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
                format: '<div id="legal" class="dataLabel"><i id="legal-icon" class="fas fa-gavel"></i><h4 >Minimize Legal Risk</h4><p class="info">You or your customer might be facing a lawsuit if your software products are not accessible.</p> </div>'
            }
        }, {
            sets: ['4', '5'],
            value: 3,
            name: 'legal,reach',
            accessibility: {
                enabled: false
            },
            dataLabels: {
                enabled: false
            },
            color: Highcharts.getOptions().colors[5],
            borderColor: '#333'
        }, {
            sets: ['3', '2'],
            value: 3,
            accessibility: {
                enabled: false
            },
            name: 'brand,innovation',
            color: Highcharts.getOptions().colors[2],
            borderColor: '#333',
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['3', '4'],
            value: 3,
            accessibility: {
                enabled: false
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
                enabled: false
            },
            name: 'legal,innovation,reach',
            color: Highcharts.getOptions().colors[5],
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['5', '2'],
            value: 3,
            accessibility: {
                enabled: false
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
                enabled: false
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
                enabled: false
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
                enabled: false
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
                enabled: false
            },
            name: 'brand,innovation,legal',
            color: '#fff',
            opacity: 1,
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '4'],
            value: 2,
            accessibility: {
                enabled: false
            },
            name: 'brand,innovation,reach',
            color: Highcharts.getOptions().colors[2],
            dataLabels: {
                enabled: false
            }
        }, {
            sets: ['2', '3', '4', '5'],
            value: 3,
            accessibility: {
                enabled: false
            },
            color: '#fff',
            opacity: 1,
            name: 'innovation,brand,reach,legal',
            dataLabels: {
                y: -30,
                x: -30,
                format: '<i id="aicon" class="fas fa-universal-access"></i>'
            }
        }]
    }],

    title: {
        text: ''
    },

    tooltip: {
        enabled: false
    },

    exporting: {
        enabled: false
    }
});
