const languages = {
    no: {
        lang: {
            accessibility: {
                rangeSelector: {
                    maxInputLabel: 'Velg sluttdato',
                    minInputLabel: 'Velg startdato'
                },
                chartContainerLabel: 'Highcharts interaktivt diagram',
                exporting: {
                    chartMenuLabel: 'Diagram meny',
                    exportRegionLabel: 'Diagram meny',
                    menuButtonLabel: 'Se diagram meny'
                }
            },
            decimalPoint: ',',
            thousandsSep: '.',
            loading: 'Later­...',
            months: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
            weekdays: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag­'],
            exportButtonTitle: 'Eksporter',
            printButtonTitle: 'Print',
            printChart: 'Skriv ut diagram',
            viewFullscreen: 'Se i fullskjerm',
            rangeSelectorFrom: 'Fra',
            rangeSelectorTo: 'Til',
            rangeSelectorZoom: 'Zoom',
            downloadPNG: 'Last ned som PNG-bilde',
            downloadJPEG: 'Last ned som JPEG-bilde',
            downloadPDF: 'Last ned som PDF-dokument',
            downloadSVG: 'Last ned som SVG-bilde',
            title: 'AAPL Aksjekurs'
        },
        rangeSelector: {
            buttons: [{
                type: 'month',
                count: 1,
                text: '1m',
                title: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                title: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: '6m'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'YTD'
            }, {
                type: 'year',
                count: 1,
                text: '1år'
            }, {
                type: 'all',
                text: 'Alle',
                title: 'Alle'
            }]
        }
    },
    de: {
        lang: {
            accessibility: {
                rangeSelector: {
                    maxInputLabel: 'Endpunkt auswählen',
                    minInputLabel: 'Startpunkt auswählen'
                },
                chartContainerLabel: 'Interaktives Highcharts-Diagramm',
                exporting: {
                    chartMenuLabel: 'Diagramm-Menü',
                    exportRegionLabel: 'Diagramm-Menü',
                    menuButtonLabel: 'Diagramm-Menü ansehen'
                }
            },
            decimalPoint: ',',
            thousandsSep: '.',
            loading: 'Daten werden geladen...',
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            shortMonths: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            exportButtonTitle: "Exportieren",
            printButtonTitle: "Drucken",
            printChart: 'Diagramm ausdrucken',
            viewFullscreen: 'Im Vollbild anschauen',
            rangeSelectorFrom: "Von",
            rangeSelectorTo: "Bis",
            rangeSelectorZoom: "Zeitraum",
            downloadPNG: 'Download als PNG-Bild',
            downloadJPEG: 'Download als JPEG-Bild',
            downloadPDF: 'Download als PDF-Dokument',
            downloadSVG: 'Download als SVG-Bild',
            resetZoom: "Zoom zurücksetzen",
            resetZoomTitle: "Zoom zurücksetzen",
            title: 'AAPL Aktienkurs'
        },
        rangeSelector: {
            buttons: [{
                type: 'month',
                count: 1,
                text: '1 M',
                title: '1 M'
            }, {
                type: 'month',
                count: 3,
                text: '3 M',
                title: '3 M'
            }, {
                type: 'month',
                count: 6,
                text: '6 M',
                title: '6 M'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'YTD'
            }, {
                type: 'year',
                count: 1,
                text: '1 J'
            }, {
                type: 'all',
                text: 'Alle',
                title: 'Alle'
            }]
        }
    }
};

Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', data => {

    const chartOptions = {
        chart: {
            style: {
                fontFamily: 'Arial'
            }
        },

        rangeSelector: {
            selected: 1,
            labelStyle: {
                fontWeight: 'bold',
                color: '#000',
                fontSize: '14px',
                padding: '10px'
            }
        },

        title: {
            text: 'AAPL Stock Price'
        },

        xAxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                    color: '#000',
                    fontSize: '12px'
                }
            }
        },

        navigator: {
            xAxis: {
                labels: {
                    style: {
                        color: '#000'
                    }
                }
            }
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    };

    function createChart(options) {
        return new Highcharts.stockChart('container', options);
    }

    createChart(chartOptions);
    const initialOptions = JSON.parse(JSON.stringify(Highcharts.getOptions()));

    function resetOptions() {
        Highcharts.setOptions(initialOptions);
    }

    document.getElementById('en').addEventListener('click', function () {
        resetOptions();
        Highcharts.setOptions(initialOptions);
        createChart(chartOptions);
    });

    document.getElementById('no').addEventListener('click', function () {
        Highcharts.setOptions(languages.no);
        document.getElementById("container").lang = "no";
        createChart(Highcharts.merge(chartOptions, {
            title: { text: Highcharts.getOptions().lang.title }
        }));
    });

    document.getElementById('de').addEventListener('click', function () {
        Highcharts.setOptions(languages.de);
        createChart(Highcharts.merge(chartOptions, {
            title: { text: Highcharts.getOptions().lang.title }
        }));
    });
});
