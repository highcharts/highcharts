// Data from nasdaq.com — same source as samples/stock/demo/compare

const REAL_TICKERS = ['AAPL'];
const MOCK_TICKER_COUNT = 15;

(async () => {

    const KNOWN_TICKERS = REAL_TICKERS.concat(getMockTickers());
    // Seed the cache with generated demo securities and cache fetched data.
    const dataCache = getMockDataCache();
    const GAP = 2; // % gap between rows for visual separation

    let activeTickers = REAL_TICKERS.concat(['MOCK1', 'MOCK2']);
    let columns = 1;
    let activeSeriesOptions = { type: 'candlestick' };

    // Indicators are stacked under their parent series within the same column.
    // Share of pane given to indicators (vs. parent), and per-slot floor.
    const INDICATOR_HEIGHT_FRACTION = 0.3;
    const INDICATOR_MIN_HEIGHT_PCT = 4;

    // Indicator-type lists exposed by stock-tools' compose step.
    const navUtils = Highcharts.NavigationBindings.prototype.utils || {};
    const indicatorsWithAxes = navUtils.indicatorsWithAxes || [];
    const indicatorsWithVolume = navUtils.indicatorsWithVolume || [];

    // ticker -> [{ seriesId, type, axisId, hasAxis, options }]
    const paneIndicators = {};

    // Restore the default tooltip format for every indicator type. Each
    // indicator extends SMASeries but registers under its own series type, so
    // plotOptions.sma alone does not propagate. We iterate seriesTypes once
    // at startup and build a plotOptions entry per indicator type.
    const indicatorPointFormat =
        '<span style="color:{point.color}">●</span> ' +
        '{series.name}: <b>{point.y}</b><br/>';
    const SMASeries = (Highcharts.seriesTypes || {}).sma;
    const indicatorPlotOptions = {};
    if (SMASeries) {
        Object.keys(Highcharts.seriesTypes).forEach(type => {
            const cls = Highcharts.seriesTypes[type];
            if (cls === SMASeries || cls.prototype instanceof SMASeries) {
                indicatorPlotOptions[type] = {
                    tooltip: { pointFormat: indicatorPointFormat }
                };
            }
        });
    }

    async function loadTicker(ticker) {
        if (dataCache[ticker]) {
            return dataCache[ticker];
        }
        const url =
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/' +
            'samples/data/' + ticker.toLowerCase() + '-ohlc.json';
        const data = await (await fetch(url)).json();
        dataCache[ticker] = data;
        return data;
    }

    function paneRect(index, total, cols) {
        const rows = Math.ceil(total / cols);
        const row = Math.floor(index / cols);
        // const cellsInLastRow = total - (rows - 1) * cols;
        // const cellsInThisRow =
        //    row === rows - 1 ? cellsInLastRow : cols;

        const rowHeight = 100 / rows;
        const cellWidth = 100 / cols;
        const col = index % cols;

        return {
            top: (row * rowHeight) + '%',
            left: (col * cellWidth) + '%',
            width: Math.max(cellWidth - GAP, 1) + '%',
            height: Math.max(rowHeight - GAP, 1) + '%'
        };
    }

    function getPaneRect(ticker) {
        const idx = activeTickers.indexOf(ticker);
        if (idx < 0) {
            return null;
        }
        return paneRect(idx, activeTickers.length, columns);
    }

    // Compute top/height for the parent yAxis and each indicator yAxis in a
    // column. All axes share the parent's left/width (the pane's footprint).
    function computeColumnLayout(ticker) {
        const rect = getPaneRect(ticker);
        if (!rect) {
            return null;
        }
        const indicators = (paneIndicators[ticker] || [])
            .filter(i => i.hasAxis);
        const N = indicators.length;
        const paneTop = parseFloat(rect.top);
        const paneHeight = parseFloat(rect.height);

        if (N === 0) {
            return {
                rect,
                parent: { top: rect.top, height: rect.height },
                indicators: []
            };
        }

        const slotPct = Math.max(
            INDICATOR_MIN_HEIGHT_PCT,
            (paneHeight * INDICATOR_HEIGHT_FRACTION) / N
        );
        const totalIndPct = slotPct * N;
        const parentHeight = Math.max(
            paneHeight - totalIndPct,
            INDICATOR_MIN_HEIGHT_PCT
        );

        const indLayouts = [];
        let cursor = paneTop + parentHeight;
        indicators.forEach(ind => {
            indLayouts.push({
                id: ind.axisId,
                top: cursor + '%',
                height: slotPct + '%'
            });
            cursor += slotPct;
        });

        return {
            rect,
            parent: { top: paneTop + '%', height: parentHeight + '%' },
            indicators: indLayouts
        };
    }

    // Apply the computed layout to live axes.
    function layoutColumn(theChart, ticker) {
        const layout = computeColumnLayout(ticker);
        if (!layout) {
            return;
        }
        const parentAxis = theChart.get('y-' + ticker);
        if (parentAxis) {
            parentAxis.update({
                top: layout.parent.top,
                height: layout.parent.height,
                left: layout.rect.left,
                width: layout.rect.width,
                offset: 0
            }, false);
        }
        layout.indicators.forEach(ind => {
            const axis = theChart.get(ind.id);
            if (!axis) {
                return;
            }
            axis.update({
                top: ind.top,
                height: ind.height,
                left: layout.rect.left,
                width: layout.rect.width,
                offset: 0
            }, false);
        });
    }

    // Drag-pane resizers bind only to the next axis in the same column. The
    // last axis in the column has no resizer, so dragging cannot reach into
    // another column.
    function bindColumnResizers(theChart, ticker) {
        const parentAxis = theChart.get('y-' + ticker);
        if (!parentAxis) {
            return;
        }
        const orderedAxes = [parentAxis].concat(
            (paneIndicators[ticker] || [])
                .filter(i => i.hasAxis)
                .map(i => theChart.get(i.axisId))
                .filter(Boolean)
        );
        orderedAxes.forEach((axis, i) => {
            const next = orderedAxes[i + 1];
            if (next) {
                axis.update({
                    resize: {
                        enabled: true,
                        controlledAxis: { next: [next.options.id] }
                    }
                }, false);
            } else {
                axis.update({ resize: { enabled: false } }, false);
            }
        });
    }

    // Column-aware replacement for NavigationBindings.utils.manageIndicators.
    // Triggered by the indicator popup's onSubmit callback.
    function columnAwareManageIndicators(navigation, data) {
        const theChart = navigation.chart;

        if (data.actionType === 'edit') {
            const seriesConfig = {
                linkedTo: data.linkedTo,
                type: data.type
            };
            navigation.fieldsToOptions(data.fields, seriesConfig);
            const series = theChart.get(data.seriesId);
            if (series) {
                series.update(seriesConfig, true);
                // Keep our stored options in sync so rebuild() reproduces the
                // current state.
                Object.keys(paneIndicators).forEach(ticker => {
                    paneIndicators[ticker].forEach(ind => {
                        if (ind.seriesId === data.seriesId) {
                            ind.options = Highcharts.merge(
                                ind.options,
                                seriesConfig
                            );
                        }
                    });
                });
            }
            return;
        }

        if (data.actionType === 'remove') {
            const series = theChart.get(data.seriesId);
            if (!series) {
                return;
            }
            const ticker = series.options.linkedTo;
            const yAxis = series.yAxis;
            const hadOwnAxis = indicatorsWithAxes.indexOf(series.type) >= 0 &&
                yAxis &&
                yAxis.options.id !== 'y-' + ticker;

            if (series.linkedSeries) {
                series.linkedSeries.forEach(ls => ls.remove(false));
            }
            series.remove(false);

            if (paneIndicators[ticker]) {
                paneIndicators[ticker] = paneIndicators[ticker].filter(
                    ind => ind.seriesId !== data.seriesId
                );
            }

            if (hadOwnAxis) {
                yAxis.remove(false);
            }

            layoutColumn(theChart, ticker);
            bindColumnResizers(theChart, ticker);
            theChart.redraw();
            return;
        }

        // ADD path
        const seriesConfig = {
            id: Highcharts.uniqueKey(),
            linkedTo: data.linkedTo,
            type: data.type
        };
        navigation.fieldsToOptions(data.fields, seriesConfig);

        const parentSeries = theChart.get(data.linkedTo);
        if (!parentSeries) {
            return;
        }
        const ticker = data.linkedTo;

        // Match SUM approx if parent uses it (#13950).
        const plotOptions = (Highcharts.getOptions().plotOptions) || {};
        const typeDefaults = plotOptions[data.type];
        if (
            parentSeries.getDGApproximation &&
            parentSeries.getDGApproximation() === 'sum' &&
            !(
                typeDefaults && typeDefaults.dataGrouping &&
                typeDefaults.dataGrouping.approximation
            )
        ) {
            seriesConfig.dataGrouping = { approximation: 'sum' };
        }

        if (indicatorsWithVolume.indexOf(data.type) >= 0) {
            const volumeSeries = theChart.series.filter(
                s => s.options.type === 'column'
            )[0];
            if (volumeSeries) {
                seriesConfig.params = seriesConfig.params || {};
                seriesConfig.params.volumeSeriesID = volumeSeries.options.id;
            }
        }

        const hasAxis = indicatorsWithAxes.indexOf(data.type) >= 0;
        let axisId;

        if (hasAxis) {
            axisId = Highcharts.uniqueKey();
            const rect = getPaneRect(ticker);
            theChart.addAxis({
                id: axisId,
                left: rect.left,
                width: rect.width,
                offset: 0,
                opposite: true,
                title: { text: '' },
                tickPixelInterval: 40,
                showLastLabel: false,
                labels: { align: 'left', y: -2 }
            }, false, false);
            seriesConfig.yAxis = axisId;
        } else {
            seriesConfig.yAxis = parentSeries.yAxis.options.id;
        }
        // Multiple xAxes in this demo — bind to the parent's xAxis explicitly.
        seriesConfig.xAxis = parentSeries.xAxis.options.id;

        theChart.addSeries(seriesConfig, false);

        paneIndicators[ticker] = paneIndicators[ticker] || [];
        paneIndicators[ticker].push({
            seriesId: seriesConfig.id,
            type: data.type,
            axisId: axisId,
            hasAxis: hasAxis,
            options: seriesConfig
        });

        if (hasAxis) {
            layoutColumn(theChart, ticker);
            bindColumnResizers(theChart, ticker);
        }

        Highcharts.fireEvent(navigation, 'deselectButton', {
            button: navigation.selectedButtonElement
        });
        theChart.redraw();
    }

    function buildAxes() {
        const total = activeTickers.length;
        const xAxis = activeTickers.map((ticker, i) => {
            const rect = paneRect(i, total, columns);
            return {
                id: 'x-' + ticker,
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                linkedTo: i === 0 ? null : 0,
                showEmpty: false,
                offset: 0
            };
        });
        const yAxis = [];
        activeTickers.forEach(ticker => {
            const layout = computeColumnLayout(ticker);
            yAxis.push({
                id: 'y-' + ticker,
                top: layout.parent.top,
                left: layout.rect.left,
                width: layout.rect.width,
                height: layout.parent.height,
                opposite: true,
                offset: 0,
                title: { text: null },
                showEmpty: false,
                labels: {
                    // Render labels inside the pane so they don't overflow
                    // into adjacent panes (default is outside-right).
                    align: 'right',
                    x: -8,
                    // y: 14,
                    format: '${value:.2f}'
                }
            });
            layout.indicators.forEach(ind => {
                yAxis.push({
                    id: ind.id,
                    top: ind.top,
                    left: layout.rect.left,
                    width: layout.rect.width,
                    height: ind.height,
                    opposite: true,
                    offset: 0,
                    title: { text: '' },
                    tickPixelInterval: 40,
                    showLastLabel: false,
                    labels: { align: 'left', y: -2 }
                });
            });
        });
        return { xAxis, yAxis };
    }

    function buildSeries() {
        const series = [];
        activeTickers.forEach(ticker => {
            series.push({
                id: ticker,
                name: ticker,
                ...activeSeriesOptions,
                data: dataCache[ticker],
                xAxis: 'x-' + ticker,
                yAxis: 'y-' + ticker
            });
            (paneIndicators[ticker] || []).forEach(ind => {
                series.push({
                    ...ind.options,
                    id: ind.seriesId,
                    linkedTo: ticker,
                    xAxis: 'x-' + ticker,
                    yAxis: ind.hasAxis ? ind.axisId : 'y-' + ticker
                });
            });
        });
        return series;
    }

    // Skip indicators (linkedTo) and navigator/internal series.
    function isMainSeries(series) {
        return !series.options.linkedTo && !series.options.isInternal;
    }

    function applySeriesType(theChart, options) {
        activeSeriesOptions = options;
        theChart.series.forEach(series => {
            if (isMainSeries(series)) {
                series.update(options, false);
            }
        });
        theChart.redraw();
    }

    function makeTypeBinding(className, options) {
        return {
            className,
            init: function (button) {
                applySeriesType(this.chart, options);
                Highcharts.fireEvent(this, 'deselectButton', { button });
            }
        };
    }

    async function addSecurity(ticker) {
        if (activeTickers.includes(ticker)) {
            return;
        }
        await loadTicker(ticker);
        activeTickers.push(ticker);
        rebuild();
    }

    function removeSecurity(ticker) {
        if (activeTickers.length <= 1) {
            return;
        }
        // Indicator axes/series for this ticker get dropped automatically by
        // chart.update(..., oneToOne: true) since they're absent from the new
        // config. Drop our state so they don't reappear on next rebuild.
        delete paneIndicators[ticker];
        activeTickers = activeTickers.filter(t => t !== ticker);
        rebuild();
    }

    function getPaneTooltipPoints(theChart) {
        return activeTickers.reduce((points, ticker) => {
            const series = theChart.get(ticker);
            if (!series) {
                return points;
            }

            for (let i = series.points.length - 1; i >= 0; i--) {
                const point = series.points[i];
                if (
                    typeof point.plotX === 'number' &&
                    typeof point.plotY === 'number'
                ) {
                    points.push(point);
                    break;
                }
            }

            return points;
        }, []);
    }

    function refreshPaneTooltips(theChart) {
        const points = getPaneTooltipPoints(theChart);

        if (points.length) {
            theChart.tooltip.refresh(points);
            points.forEach(point => point.setState());
        }
    }

    function renderTickerChips() {
        const container = document.getElementById('tickers');
        const locked = activeTickers.length === 1;
        container.innerHTML = KNOWN_TICKERS.map(t => {
            const active = activeTickers.includes(t);
            const cls = 'chip' +
                (active ? ' active' : '') +
                (active && locked ? ' locked' : '');
            const action = active ?
                'Remove ' + t : 'Add ' + t;
            return '<button type="button" class="' + cls +
                '" data-ticker="' + t +
                '" aria-pressed="' + active +
                '" aria-label="' + action + '">' +
                '<span class="toggle" aria-hidden="true"></span>' +
                '<span class="label">' + t + '</span>' +
                '</button>';
        }).join('');
    }

    function setColumns(n) {
        columns = n;
        document.querySelectorAll('#columns button').forEach(btn => {
            btn.classList.toggle(
                'active',
                parseInt(btn.dataset.cols, 10) === columns
            );
        });
        rebuild();
    }

    function wireControls() {
        document.getElementById('columns').addEventListener('click', e => {
            const btn = e.target.closest('button[data-cols]');
            if (btn) {
                setColumns(parseInt(btn.dataset.cols, 10));
            }
        });
        document.getElementById('tickers').addEventListener('click', e => {
            const btn = e.target.closest('button[data-ticker]');
            if (!btn) {
                return;
            }
            const ticker = btn.dataset.ticker;
            if (activeTickers.includes(ticker)) {
                removeSecurity(ticker);
            } else {
                addSecurity(ticker);
            }
        });
    }

    // Workaround for Tooltip.renderSplit + tooltip.fixed bug: distribute()
    // is 1-D and shoves side-by-side panes' tooltips down on top of each
    // other. Re-anchor each pane's partial tooltips to the top of their own
    // yAxis after refresh.
    Highcharts.addEvent(Highcharts.Tooltip, 'refresh', function () {
        const opts = this.options;
        if (!opts.fixed) {
            return;
        }
        const positionY = (opts.position && opts.position.y) || 0;

        const byPane = new Map();
        this.chart.series.forEach(series => {
            if (series.tt && series.yAxis) {
                const list = byPane.get(series.yAxis) || [];
                list.push(series);
                byPane.set(series.yAxis, list);
            }
        });

        byPane.forEach((seriesList, yAxis) => {
            let y = yAxis.pos + positionY;
            seriesList.forEach(series => {
                series.tt.attr({ y });
                y += series.tt.getBBox().height + 1;
            });
        });
    });

    Highcharts.wrap(Highcharts.Tooltip.prototype, 'hide', function (
        proceed,
        delay
    ) {
        if (this.options.keepVisible) {
            refreshPaneTooltips(this.chart);
            return;
        }

        proceed.call(this, delay);
    });

    // Bootstrap: load initial datasets in parallel, then render.
    await Promise.all(activeTickers.map(loadTicker));

    const { xAxis, yAxis } = buildAxes();

    const chart = Highcharts.stockChart('container', {
        chart: {
            spacingTop: 20,
            events: {
                render() {
                    refreshPaneTooltips(this);
                }
            }
        },
        stockTools: {
            gui: { enabled: true }
        },
        navigation: {
            bindings: {
                seriesTypeLine: makeTypeBinding(
                    'highcharts-series-type-line',
                    { type: 'line', useOhlcData: true }
                ),
                seriesTypeOhlc: makeTypeBinding(
                    'highcharts-series-type-ohlc',
                    { type: 'ohlc' }
                ),
                seriesTypeCandlestick: makeTypeBinding(
                    'highcharts-series-type-candlestick',
                    { type: 'candlestick' }
                ),
                seriesTypeHeikinAshi: makeTypeBinding(
                    'highcharts-series-type-heikinashi',
                    { type: 'heikinashi' }
                ),
                seriesTypeHLC: makeTypeBinding(
                    'highcharts-series-type-hlc',
                    { type: 'hlc', useOhlcData: true }
                ),
                seriesTypeHollowCandlestick: makeTypeBinding(
                    'highcharts-series-type-hollowcandlestick',
                    { type: 'hollowcandlestick' }
                ),
                // Override the default indicators binding so the popup's
                // submit goes through our column-aware handler instead of
                // the global stack-everything-vertically resizer.
                indicators: {
                    className: 'highcharts-indicators',
                    init: function () {
                        const navigation = this;
                        Highcharts.fireEvent(navigation, 'showPopup', {
                            formType: 'indicators',
                            options: {},
                            onSubmit: function (data) {
                                columnAwareManageIndicators(
                                    navigation,
                                    data
                                );
                            }
                        });
                    }
                }
            }
        },
        rangeSelector: {
            selected: 4
        },

        tooltip: {
            split: true,
            shape: 'square',
            headerShape: 'callout',
            headerFormat: '',
            pointFormat: '<b>{series.name}</b> ' +
                'O <b>${point.open:.2f}</b> ' +
                'H <b>${point.high:.2f}</b> ' +
                'L <b>${point.low:.2f}</b> ' +
                'C <b>${point.close:.2f}</b>',
            borderWidth: 0,
            shadow: false,
            fixed: true,
            keepVisible: true,
            position: {
                align: 'left',
                verticalAlign: 'top',
                relativeTo: 'pane',
                x: 4,
                y: 4
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: indicatorPlotOptions,
        xAxis,
        yAxis,
        series: buildSeries()
    });

    wireControls();
    renderTickerChips();

    function rebuild() {
        const { xAxis, yAxis } = buildAxes();
        chart.update(
            { xAxis, yAxis, series: buildSeries() },
            false, // batch redraw with the resizer rebind below
            true   // oneToOne — match by id, drop missing, add new
        );
        // chart.update may overwrite resize options; rebind per column.
        activeTickers.forEach(ticker => {
            bindColumnResizers(chart, ticker);
        });
        // Force a full box recomputation: when axes' top/left/width/height
        // change via update(), grid lines and tick positions don't refresh
        // until something marks the chart as dirtyBox (browser resize does
        // this implicitly).
        chart.isDirtyBox = true;
        chart.redraw();
        renderTickerChips();
        refreshPaneTooltips(chart);
    }

})();


function getMockDataCache() {
    const cache = {};
    const tickers = getMockTickers();
    tickers.forEach((ticker, i) => {
        const data = [];
        let prevClose = 100 + i * 10;
        for (let j = 0; j < 10000; j++) {
            const ts = Date.UTC(2014, 0, j + 1);
            const dow = new Date(ts).getUTCDay();
            if (dow === 0 || dow === 6) {
                continue;
            }
            const trend = 100 + Math.sin(j / 10) * 20 + i * 10;
            const open = prevClose;
            const close = trend + (Math.random() - 0.5) * 4;
            const high = Math.max(open, close) + Math.random() * 2;
            const low = Math.min(open, close) - Math.random() * 2;
            data.push([ts, open, high, low, close]);
            prevClose = close;
        }
        cache[ticker] = data;
    });
    return cache;
}

function getMockTickers() {
    const tickers = [];
    for (let i = 1; i <= MOCK_TICKER_COUNT; i++) {
        tickers.push('MOCK' + i);
    }
    return tickers;
}
