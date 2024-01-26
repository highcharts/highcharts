(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

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
                        menuButtonLabel: 'Vis diagram meny'
                    },
                    svgContainerLabel: 'Interaktivt diagram',
                    screenReaderSection: {
                        beforeRegionLabel: 'Diagram skjermleser informasjon',
                        endOfChartMarker: 'Slutt på interaktivt diagram.'
                    }
                },
                decimalPoint: ',',
                thousandsSep: '.',
                loading: 'Laster­...',
                months: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
                shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
                weekdays: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag­'],
                exportButtonTitle: 'Eksporter',
                printButtonTitle: 'Print',
                printChart: 'Skriv ut diagram',
                viewFullscreen: 'Vis i fullskjerm',
                rangeSelectorFrom: 'Fra',
                rangeSelectorTo: 'Til',
                rangeSelectorZoom: 'Zoom',
                downloadPNG: 'Last ned som PNG-bilde',
                downloadJPEG: 'Last ned som JPEG-bilde',
                downloadPDF: 'Last ned som PDF-dokument',
                downloadSVG: 'Last ned som SVG-bilde',
                title: 'AAPL Aksjekurs'
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
                    },
                    svgContainerLabel: 'Interaktives Diagramm',
                    screenReaderSection: {
                        beforeRegionLabel: 'Screenreader-Information des Diagramms',
                        endOfChartMarker: 'Ende des interaktiven Diagramms'
                    }
                },
                decimalPoint: ',',
                thousandsSep: '.',
                loading: 'Daten werden geladen...',
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                shortMonths: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                exportButtonTitle: 'Exportieren',
                printButtonTitle: 'Drucken',
                printChart: 'Diagramm ausdrucken',
                viewFullscreen: 'Im Vollbild anschauen',
                rangeSelectorFrom: 'Von',
                rangeSelectorTo: 'Bis',
                rangeSelectorZoom: 'Zeitraum',
                downloadPNG: 'Download als PNG-Bild',
                downloadJPEG: 'Download als JPEG-Bild',
                downloadPDF: 'Download als PDF-Dokument',
                downloadSVG: 'Download als SVG-Bild',
                resetZoom: 'Zoom zurücksetzen',
                resetZoomTitle: 'Zoom zurücksetzen',
                title: 'AAPL Aktienkurs'
            }
        }
    };


    const chartOptions = {
        chart: {
            style: {
                fontFamily: 'Arial'
            }
        },
        accessibility: {
            landmarkVerbosity: 'one',
            screenReaderSection: {
                beforeChartFormat: '<p>The chart is demonstrating that you can switch between multiple languages in the same chart.</p><p>Financial line chart showing AAPL stock prices, with an additional navigator series showing an overview of the stock.</p>'
            },
            series: {
                pointDescriptionEnabledThreshold: 30
            }
        },
        rangeSelector: {
            selected: 1,
            labelStyle: {
                fontWeight: 'bold',
                color: '#000',
                fontSize: '14px',
                padding: '10px'
            },
            buttons: [{
                type: 'month',
                count: 1,
                text: '1m',
                title: 'View 1 month'
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                title: 'View 3 months'
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                title: 'View 6 months'
            }, {
                type: 'ytd',
                text: 'YTD',
                title: 'View year to date'
            }, {
                type: 'year',
                count: 1,
                text: '1y',
                title: 'View 1 year'
            }, {
                type: 'all',
                text: 'All',
                title: 'View all'
            }]
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

        credits: {
            enabled: false
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    };

    const initialOptions = JSON.parse(JSON.stringify(Highcharts.getOptions()));

    function resetOptions() {
        Highcharts.setOptions(initialOptions);
    }

    function createChart(options) {
        return new Highcharts.stockChart('container', options);
    }

    createChart(chartOptions);

    document.getElementById('en').addEventListener('click', function () {
        resetOptions();
        createChart(chartOptions);
    });

    document.getElementById('no').addEventListener('click', function () {
        Highcharts.setOptions(languages.no);
        createChart(Highcharts.merge(chartOptions, {
            title: {
                text: Highcharts.getOptions().lang.title
            },
            accessibility: {
                series: {
                    descriptionFormat: '{series.name}, serie {seriesNumber} av {chart.series.length} med {series.points.length} datapunkt.'
                },
                screenReaderSection: {
                    beforeChartFormat: '<p>The chart is demonstrating that you can switch between multiple languages in the same chart.</p><p>Finansielt linjediagram som viser AAPL aksjepriser, med tilhørende navigeringsserie som gir et overblikk over aksjen.</p>'
                }
            },
            rangeSelector: {
                buttons: [{
                    type: 'month',
                    count: 1,
                    text: '1m',
                    title: 'Vis 1 måned'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m',
                    title: 'Vis 3 måneder'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m',
                    title: 'Vis 6 måneder'
                }, {
                    type: 'ytd',
                    text: 'YTD',
                    title: 'Vis året til dags dato'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1 år',
                    title: 'Vis 1 år'
                }, {
                    type: 'all',
                    text: 'Alle',
                    title: 'Vis alle'
                }]
            }
        }));
    });

    document.getElementById('de').addEventListener('click', function () {
        Highcharts.setOptions(languages.de);
        createChart(Highcharts.merge(chartOptions, {
            title: {
                text: Highcharts.getOptions().lang.title
            },
            accessibility: {
                series: {
                    descriptionFormat: '{series.name}, Graph {seriesNumber} von {chart.series.length}.'
                },
                screenReaderSection: {
                    beforeChartFormat: '<p>The chart is demonstrating that you can switch between multiple languages in the same chart.</p><p>Liniendiagramm des AAPL-Aktienkurses mit zusätzlichem Navigationsdiagramm für einen Überblick über den Aktienkurs.</p>'
                }
            },
            rangeSelector: {
                buttons: [{
                    type: 'month',
                    count: 1,
                    text: '1 M',
                    title: '1 Monat anzeigen'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3 M',
                    title: '3 Monate anzeigen'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6 M',
                    title: '6 Monate anzeigen'
                }, {
                    type: 'ytd',
                    text: 'YTD',
                    title: 'Jahr bis heute anzeigen'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1 J',
                    title: '1 Jahr anzeigen'
                }, {
                    type: 'all',
                    text: 'Alle',
                    title: 'Alle'
                }]
            }
        }));
    });

})();