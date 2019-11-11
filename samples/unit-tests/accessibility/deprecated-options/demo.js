function muteErrors() {
    return Highcharts.addEvent(Highcharts.Chart, 'displayError', function (e) {
        if (e.message && e.message.indexOf('Deprecated option') > 0) {
            e.preventDefault();
        }
    });
}

function getChildProp(root, propArray) {
    return propArray.reduce((acc, cur) => acc[cur], root);
}


QUnit.test('Check that deprecated chart and series options are moved over', assert => {
    const unmute = muteErrors();

    const chart = Highcharts.chart('container', {
            chart: {
                description: 'chartDesc',
                typeDescription: 'chartTypeDesc',
                inverted: true
            },
            series: [{
                description: 'seriesDesc',
                skipKeyboardNavigation: true,
                pointDescriptionFormatter: () => {},
                exposeElementToA11y: false,
                test: 'hello',
                data: [
                    1, 2, { y: 5, test: 'testStr' }, 3
                ]
            }]
        }),
        chartOptions = chart.options,
        seriesOptions = chart.series[0].options,
        seriesA11yOptions = seriesOptions.accessibility,
        pointOptions = chart.series[0].points[2].options;

    assert.strictEqual(chartOptions.chart.inverted, true);
    assert.strictEqual(chartOptions.accessibility.description, 'chartDesc');
    assert.strictEqual(
        chartOptions.accessibility.typeDescription, 'chartTypeDesc'
    );

    assert.strictEqual(seriesOptions.test, 'hello');
    assert.strictEqual(seriesA11yOptions.description, 'seriesDesc');
    assert.ok(seriesA11yOptions.pointDescriptionFormatter);
    assert.strictEqual(seriesA11yOptions.exposeAsGroupOnly, false);
    assert.strictEqual(seriesA11yOptions.keyboardNavigation.enabled, false);

    assert.strictEqual(pointOptions.test, 'testStr');
    assert.strictEqual(pointOptions.y, 5);

    unmute();
});


QUnit.test('Check that deprecated accessibility top level options are moved over', assert => {
    const unmute = muteErrors();

    const newOptionMap = {
            pointDateFormat: ['point', 'dateFormat'],
            pointDateFormatter: ['point', 'dateFormatter'],
            pointDescriptionFormatter: ['point', 'descriptionFormatter'],
            pointDescriptionThreshold: ['series', 'pointDescriptionEnabledThreshold'],
            pointNavigationThreshold: ['keyboardNavigation', 'seriesNavigation',
                'pointNavigationEnabledThreshold'],
            pointValueDecimals: ['point', 'valueDecimals'],
            pointValuePrefix: ['point', 'valuePrefix'],
            pointValueSuffix: ['point', 'valueSuffix'],
            screenReaderSectionFormatter: ['screenReaderSection',
                'beforeChartFormatter'],
            describeSingleSeries: ['series', 'describeSingleSeries'],
            seriesDescriptionFormatter: ['series', 'descriptionFormatter'],
            onTableAnchorClick: ['screenReaderSection', 'onViewDataTableClick'],
            axisRangeDateFormat: ['screenReaderSection', 'axisRangeDateFormat']
        },
        chart = Highcharts.chart('container', {
            accessibility: {
                pointDateFormat: 'dateformat',
                pointDateFormatter: a => a + 1,
                pointDescriptionFormatter: a => a + 2,
                pointDescriptionThreshold: 321,
                pointNavigationThreshold: null,
                pointValueDecimals: 41,
                pointValuePrefix: 'prefix',
                pointValueSuffix: null,
                screenReaderSectionFormatter: a => a + 3,
                describeSingleSeries: true,
                seriesDescriptionFormatter: a => a + 4,
                onTableAnchorClick: a => a + 5,
                axisRangeDateFormat: 'axisdateformat'
            },
            series: [{ data: [1] }]
        }),
        getNewOptionValue = oldOptionKey => getChildProp(
            chart.options.accessibility, newOptionMap[oldOptionKey]
        );

    Object.keys(newOptionMap).forEach(oldOption => {
        assert.strictEqual(
            getNewOptionValue(oldOption),
            chart.options.accessibility[oldOption],
            `Old option and new option should be the same. Option: ${oldOption}`
        );
    });

    unmute();
});


QUnit.test('Check that deprecated keyboardNavigation options are moved over', assert => {
    const unmute = muteErrors();

    const chart = Highcharts.chart('container', {
            accessibility: {
                keyboardNavigation: {
                    skipNullPoints: false,
                    mode: 'modestring'
                }
            },
            series: [{ data: [1] }]
        }),
        kbdOptions = chart.options.accessibility.keyboardNavigation;

    assert.strictEqual(kbdOptions.seriesNavigation.skipNullPoints, false);
    assert.strictEqual(kbdOptions.seriesNavigation.mode, 'modestring');

    unmute();
});


QUnit.test('Check that deprecated lang options are moved over', assert => {
    const unmute = muteErrors();

    const newOptionMap = {
            legendItem: ['legend', 'legendItem'],
            legendLabel: ['legend', 'legendLabel'],
            mapZoomIn: ['zoom', 'mapZoomIn'],
            mapZoomOut: ['zoom', 'mapZoomOut'],
            resetZoomButton: ['zoom', 'resetZoomButton'],
            screenReaderRegionLabel: ['screenReaderSection', 'beforeRegionLabel'],
            rangeSelectorButton: ['rangeSelector', 'buttonText'],
            rangeSelectorMaxInput: ['rangeSelector', 'maxInputLabel'],
            rangeSelectorMinInput: ['rangeSelector', 'minInputLabel'],
            svgContainerEnd: ['screenReaderSection', 'endOfChartMarker'],
            viewAsDataTable: ['table', 'viewAsDataTableButtonText'],
            tableSummary: ['table', 'tableSummary']
        },
        chart = Highcharts.chart('container', {
            lang: {
                accessibility: {
                    legendItem: 'legenditem',
                    legendLabel: 'legendlabel',
                    mapZoomIn: 'mapzoomin',
                    mapZoomOut: 'mapzoomout',
                    resetZoomButton: 'resetzoom',
                    screenReaderRegionLabel: 'screenreaderregion',
                    rangeSelectorButton: 'rangebutton',
                    rangeSelectorMaxInput: 'rangemax',
                    rangeSelectorMinInput: 'rangemin',
                    svgContainerEnd: 'containerend',
                    viewAsDataTable: 'viewasdatatable',
                    tableSummary: 'tablesummary'
                }
            },
            series: [{ data: [1] }]
        }),
        getNewOptionValue = oldOptionKey => getChildProp(
            chart.options.lang.accessibility, newOptionMap[oldOptionKey]
        );

    Object.keys(newOptionMap).forEach(oldOption => {
        assert.strictEqual(
            getNewOptionValue(oldOption),
            chart.options.lang.accessibility[oldOption],
            `Old option and new option should be the same. Option: ${oldOption}`
        );
    });

    unmute();
});
