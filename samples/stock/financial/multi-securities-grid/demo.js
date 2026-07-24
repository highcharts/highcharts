// Data from nasdaq.com — same source as samples/stock/demo/compare

const REAL_TICKERS = ['AAPL'];
const MOCK_TICKER_COUNT = 15;

(async () => {

    const KNOWN_TICKERS = REAL_TICKERS.concat(getMockTickers());
    // Seed the cache with generated demo securities and cache fetched data.
    const dataCache = {};
    const GAP = 2; // % horizontal gap between columns
    // Wider vertical gap so a pane's x-axis labels aren't covered by the
    // tooltip pinned at the top of the pane below.
    const ROW_GAP = 5;

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

    // ticker -> [{ seriesId, type, axisId, hasAxis, groupId, options }]
    const paneIndicators = {};

    // Templates of indicators added with "All securities". Newly enabled
    // panes inherit these; groupId ties pane instances to their template.
    const allIndicators = [];

    // Indicators extend SMASeries but register under their own type, so
    // plotOptions.sma doesn't propagate — set the tooltip format per type.
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
        const mockIndex = getMockTickers().indexOf(ticker);
        if (mockIndex >= 0) {
            const template = await loadTicker(REAL_TICKERS[0]);
            dataCache[ticker] = generateMockData(mockIndex, template);
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
        // Cells in the last row expand to share the full row width.
        const cellsInThisRow = row === rows - 1 ?
            total - (rows - 1) * cols :
            cols;

        const rowHeight = 100 / rows;
        const cellWidth = 100 / cellsInThisRow;
        const col = index - row * cols;

        return {
            top: (row * rowHeight) + '%',
            left: (col * cellWidth) + '%',
            width: Math.max(cellWidth - GAP, 1) + '%',
            height: Math.max(rowHeight - ROW_GAP, 1) + '%'
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

    // Resizers bind only to the next axis in the same column, so dragging
    // can't reach into another column.
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

    // Add one indicator to one ticker's pane. No redraw.
    function addIndicatorToPane(navigation, data, ticker, groupId) {
        const theChart = navigation.chart;
        const parentSeries = theChart.get(ticker);
        if (!parentSeries) {
            return;
        }

        const seriesConfig = {
            id: Highcharts.uniqueKey(),
            linkedTo: ticker,
            type: data.type
        };
        navigation.fieldsToOptions(data.fields, seriesConfig);

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
            groupId: groupId,
            options: seriesConfig
        });

        if (hasAxis) {
            layoutColumn(theChart, ticker);
            bindColumnResizers(theChart, ticker);
        }
    }

    // Pane instances a popup action applies to: the picked one, or its whole
    // group with "All securities" (by groupId, or by type if ungrouped).
    function getTargetEntries(seriesId, allSecurities) {
        const all = Object.entries(paneIndicators).flatMap(
            ([ticker, entries]) => entries.map(entry => ({ ticker, entry }))
        );
        const target = all.find(t => t.entry.seriesId === seriesId);
        if (!target) {
            return [];
        }
        if (!allSecurities) {
            return [target];
        }
        const { groupId, type } = target.entry;
        return all.filter(
            ({ entry }) => (groupId ?
                entry.groupId === groupId :
                entry.type === type)
        );
    }

    // Remove one pane instance: series, linked series, own axis. No redraw.
    function removeIndicatorFromPane(theChart, ticker, entry) {
        const series = theChart.get(entry.seriesId);
        if (series) {
            (series.linkedSeries || []).forEach(ls => ls.remove(false));
            const yAxis = series.yAxis;
            series.remove(false);
            if (entry.hasAxis && yAxis && yAxis.options.id === entry.axisId) {
                yAxis.remove(false);
            }
        }
        paneIndicators[ticker] = paneIndicators[ticker].filter(
            e => e !== entry
        );
    }

    // Column-aware replacement for NavigationBindings.utils.manageIndicators.
    // Triggered by the indicator popup's onSubmit callback.
    function columnAwareManageIndicators(navigation, data) {
        const theChart = navigation.chart;

        if (data.actionType === 'edit') {
            const baseConfig = { type: data.type };
            navigation.fieldsToOptions(data.fields, baseConfig);
            const targets = getTargetEntries(
                data.seriesId, data.allSecurities
            );
            targets.forEach(({ ticker, entry }) => {
                const config = Highcharts.merge(
                    baseConfig, { linkedTo: ticker }
                );
                const series = theChart.get(entry.seriesId);
                if (series) {
                    series.update(config, false);
                }
                // Keep stored options in sync so rebuild() reproduces the
                // current state.
                entry.options = Highcharts.merge(entry.options, config);
            });
            // New panes must inherit the edited params too.
            if (data.allSecurities && targets.length) {
                const groupId = targets[0].entry.groupId;
                allIndicators.forEach(template => {
                    if (template.groupId === groupId) {
                        template.options = Highcharts.merge(
                            template.options, baseConfig
                        );
                    }
                });
            }
            deselectIndicatorsButton(navigation);
            theChart.redraw();
            return;
        }

        if (data.actionType === 'remove') {
            const targets = getTargetEntries(
                data.seriesId, data.allSecurities
            );
            if (!targets.length) {
                return;
            }
            targets.forEach(({ ticker, entry }) => {
                removeIndicatorFromPane(theChart, ticker, entry);
            });
            // Group removed everywhere — stop propagating to new panes.
            if (data.allSecurities) {
                const groupId = targets[0].entry.groupId;
                const type = targets[0].entry.type;
                const matches = template => (
                    groupId ?
                        template.groupId === groupId :
                        template.type === type
                );
                for (let i = allIndicators.length - 1; i >= 0; i--) {
                    if (matches(allIndicators[i])) {
                        allIndicators.splice(i, 1);
                    }
                }
            }
            [...new Set(targets.map(t => t.ticker))].forEach(ticker => {
                layoutColumn(theChart, ticker);
                bindColumnResizers(theChart, ticker);
            });
            deselectIndicatorsButton(navigation);
            theChart.redraw();
            return;
        }

        // ADD path — one pane, or every pane when "All securities" is on.
        let groupId;
        if (data.allSecurities) {
            groupId = Highcharts.uniqueKey();
            const template = { type: data.type };
            navigation.fieldsToOptions(data.fields, template);
            allIndicators.push({
                groupId,
                type: data.type,
                hasAxis: indicatorsWithAxes.indexOf(data.type) >= 0,
                options: template
            });
        }
        const tickers = data.allSecurities ?
            activeTickers.slice() :
            [data.linkedTo];
        tickers.forEach(ticker => {
            addIndicatorToPane(navigation, data, ticker, groupId);
        });

        deselectIndicatorsButton(navigation);
        theChart.redraw();
    }

    // Without this the toolbar button stays selected after submit and the
    // next click toggles it off instead of reopening the popup.
    function deselectIndicatorsButton(navigation) {
        Highcharts.fireEvent(navigation, 'deselectButton', {
            button: navigation.selectedButtonElement
        });
    }

    // Popup is wiped on every open, so re-inject the checkbox per tab —
    // outside .highcharts-popup-rhs-col, which getFields scans for inputs.
    function injectAllSecuritiesCheckboxes(navigation) {
        const tabs = navigation.popup && navigation.popup.container
            .querySelectorAll('.highcharts-tab-item-content');
        if (!tabs) {
            return;
        }
        ['add', 'edit'].forEach((kind, i) => {
            const tab = tabs[i];
            if (!tab || tab.querySelector('.all-securities')) {
                return;
            }
            const label = document.createElement('label');
            label.className = 'all-securities';
            label.innerHTML = '<input type="checkbox" id="all-securities-' +
                kind + '">All securities';
            tab.appendChild(label);
        });
    }

    function isAllSecuritiesChecked(navigation, kind) {
        const box = navigation.popup && navigation.popup.container
            .querySelector('#all-securities-' + kind);
        return !!(box && box.checked);
    }

    // linkedTo breaks across panes of different widths (#1417), so sync
    // extremes manually on setExtremes (fires before the initiating redraw).
    function syncExtremes(e) {
        const axis = this;
        if (e.trigger === 'syncExtremes') {
            return;
        }
        axis.chart.xAxis.forEach(other => {
            if (other !== axis && other.options.id?.startsWith('x-')) {
                other.setExtremes(
                    e.min, e.max, false, false, { trigger: 'syncExtremes' }
                );
            }
        });
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
                events: { setExtremes: syncExtremes },
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
        // The new pane inherits every "All securities" indicator —
        // rebuild() creates the series and axes from these entries.
        if (allIndicators.length) {
            paneIndicators[ticker] = paneIndicators[ticker] || [];
            allIndicators.forEach(template => {
                paneIndicators[ticker].push({
                    seriesId: Highcharts.uniqueKey(),
                    type: template.type,
                    axisId: template.hasAxis ?
                        Highcharts.uniqueKey() : void 0,
                    hasAxis: template.hasAxis,
                    groupId: template.groupId,
                    options: Highcharts.merge(template.options)
                });
            });
        }
        rebuild();
    }

    function removeSecurity(ticker) {
        if (activeTickers.length <= 1) {
            return;
        }
        // oneToOne update drops this ticker's axes/series; drop our state too
        // so they don't reappear on the next rebuild.
        delete paneIndicators[ticker];
        activeTickers = activeTickers.filter(t => t !== ticker);
        rebuild();
    }

    // Rightmost point of a series that is actually inside the plot.
    function lastVisiblePoint(series) {
        if (!series || !series.points) {
            return null;
        }
        for (let i = series.points.length - 1; i >= 0; i--) {
            const point = series.points[i];
            if (
                point.isInside &&
                typeof point.plotX === 'number' &&
                typeof point.plotY === 'number'
            ) {
                return point;
            }
        }
        return null;
    }

    // Pin the main series' latest visible point plus indicators with a value
    // at that date; skips histograms (VBP) that would crowd the split tooltip.
    function getPaneTooltipPoints(theChart) {
        const points = [];
        activeTickers.forEach(ticker => {
            const mainPoint = lastVisiblePoint(theChart.get(ticker));
            if (!mainPoint) {
                return;
            }
            points.push(mainPoint);
            (paneIndicators[ticker] || []).forEach(ind => {
                const point = lastVisiblePoint(theChart.get(ind.seriesId));
                if (point && point.x === mainPoint.x) {
                    points.push(point);
                }
            });
        });
        return points;
    }

    function refreshPaneTooltips(theChart) {
        const points = getPaneTooltipPoints(theChart);

        if (points.length) {
            theChart.tooltip.refresh(points);
            // refresh() sets 'hover'; reset to normal so pinned points don't
            // keep a halo (visible on line series and indicators).
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

    // Bootstrap: load the real ticker(s) first so mocks can reuse their dates
    // as a template, then load the rest in parallel and render.
    await Promise.all(REAL_TICKERS.map(loadTicker));
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
                // Route the popup submit through our column-aware handler
                // instead of the default vertical-stacking one.
                indicators: {
                    className: 'highcharts-indicators',
                    init: function () {
                        const navigation = this;
                        Highcharts.fireEvent(navigation, 'showPopup', {
                            formType: 'indicators',
                            options: {},
                            onSubmit: function (data) {
                                data.allSecurities = isAllSecuritiesChecked(
                                    navigation,
                                    data.actionType === 'add' ?
                                        'add' : 'edit'
                                );
                                columnAwareManageIndicators(
                                    navigation,
                                    data
                                );
                            }
                        });
                        injectAllSecuritiesCheckboxes(navigation);
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

    // Split tooltip's distribute() is 1-D and stacks side-by-side panes; re-
    // anchor each pane's tooltips to its own yAxis top. Guarded to this chart.
    Highcharts.addEvent(Highcharts.Tooltip, 'refresh', function () {
        const opts = this.options;
        if (this.chart !== chart || !opts.fixed) {
            return;
        }
        const positionY = opts.position?.y ?? 0;

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

    // Keep tooltips pinned to the latest points instead of hiding (no built-in
    // "always visible" option). Guarded to this chart.
    Highcharts.wrap(Highcharts.Tooltip.prototype, 'hide', function (
        proceed,
        delay
    ) {
        if (this.chart === chart && this.options.keepVisible) {
            refreshPaneTooltips(this.chart);
            return;
        }

        proceed.call(this, delay);
    });

    // Confine crosshairs to their pane: the stock default (acrossPanes) spans
    // all rows; acrossPanes:false uses the per-pane path (cf. Tick, #18025).
    Highcharts.wrap(
        Highcharts.Axis.prototype,
        'getPlotLinePath',
        function (proceed, options) {
            if (
                this.chart === chart &&
                options &&
                options.acrossPanes === void 0
            ) {
                options = Highcharts.merge(options, { acrossPanes: false });
            }
            return proceed.call(this, options);
        }
    );

    // Sync hover across panes: take the point under the cursor in its own pane
    // (searchPoint), then show that same x on every pane (synced and active).
    Highcharts.wrap(chart.pointer, 'getHoverData', function (proceed, ...args) {
        const e = args[5]; // getHoverData's last arg is the pointer event

        const pane = e && chart.series.find(series => {
            const xAxis = series.xAxis,
                yAxis = series.yAxis;
            return isMainSeries(series) && series.visible && xAxis && yAxis &&
                e.chartX >= xAxis.pos &&
                e.chartX <= xAxis.pos + xAxis.len &&
                e.chartY >= yAxis.pos &&
                e.chartY <= yAxis.pos + yAxis.len;
        });
        const hoverPoint = pane && pane.searchPoint(e, true);
        if (!hoverPoint) {
            return proceed.apply(this, args);
        }

        const hoverPoints = [];
        chart.series.forEach(series => {
            if (
                series.options.isInternal || !series.visible ||
                !series.points
            ) {
                return;
            }
            const point = series.points.find(
                p => p.x === hoverPoint.x && !p.isNull
            );
            if (point) {
                hoverPoints.push(point);
            }
        });
        return { hoverPoint, hoverPoints, hoverSeries: pane };
    });

    // Initial paint rendered before the refresh handler above existed; run one
    // pass now so the first frame is anchored per pane too.
    refreshPaneTooltips(chart);

    // Propagate the range selector's initial extremes to the other panes.
    const initialExtremes = chart.xAxis[0].getExtremes();
    chart.xAxis[0].setExtremes(initialExtremes.min, initialExtremes.max);

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
        // Newly added panes must follow the current zoom (linkedTo used to
        // do this implicitly; extremes are now synced via setExtremes).
        const ext = chart.xAxis[0].getExtremes();
        chart.xAxis[0].setExtremes(
            typeof ext.userMin === 'number' ? ext.userMin : ext.min,
            typeof ext.userMax === 'number' ? ext.userMax : ext.max,
            false
        );
        // Axis geometry changed via update() doesn't refresh grid/ticks until
        // the chart is marked dirtyBox.
        chart.isDirtyBox = true;
        // Series must re-render too, else clean series keep old geometry after
        // the axes move.
        chart.series.forEach(series => {
            series.isDirty = true;
        });
        chart.redraw();
        renderTickerChips();
        refreshPaneTooltips(chart);
    }

})();


// Reuse the real ticker's dates (template = [[ts, o, h, l, c], ...]) so every
// pane shares identical dates and density — ordinal axes then stay aligned.
function generateMockData(index, template) {

    const data = [];
    let prevClose = 100 + index * 10;
    template.forEach((row, j) => {
        const ts = row[0];
        const trend = 100 + Math.sin(j / 10) * 20 + index * 10;
        const open = prevClose;
        const close = trend + (Math.random() - 0.5) * 4;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        data.push([ts, open, high, low, close]);
        prevClose = close;
    });
    return data;
}

function getMockTickers() {
    const tickers = [];
    for (let i = 1; i <= MOCK_TICKER_COUNT; i++) {
        tickers.push('MOCK' + i);
    }
    return tickers;
}
