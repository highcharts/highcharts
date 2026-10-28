// Seed real Orbit layers using the built-in tools' analysis operations.
const orbitLayerSeeds = new WeakSet();
Highcharts.orbit.registerTool({
    id: 'stock-comparison-analysis',
    name: 'Stock comparison analysis',
    description: 'Initialize the stock comparison analysis',
    group: 'analyze',
    behavior: 'action',
    contentTypes: ['chart'],
    create: () => ({
        canActivate: ctx => (
            ctx.originalOptions.orbit?.initialTool ===
                'stock-comparison-analysis' &&
            !orbitLayerSeeds.has(ctx.content)
        ),
        activate(ctx) {
            orbitLayerSeeds.add(ctx.content);
            const params = { series: ['Target', 'Walmart'] };
            const tools = Highcharts.orbit.getRegisteredTools();
            [
                ['anomaly', 'Anomaly Detection'],
                ['trendline', 'Trend Line']
            ].forEach(([id, description]) => {
                const tool = tools.find(definition => definition.id === id)
                    .create();
                const ops = tool.apply(params, ctx);
                if (ops.length) {
                    ctx.ledger.upsertOps(
                        `tool:${id}:set`,
                        `tool:${id}`,
                        description,
                        ops,
                        params
                    );
                }
            });
        },
        deactivate() {}
    })
});

Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    orbit: {
        enabled: true,
        initialTool: 'stock-comparison-analysis'
    },
    data: {
        csv: document.getElementById('csv').innerText
    },
    title: {
        text: 'Target vs Walmart Weekly Stock Prices'
    },
    subtitle: {
        text: 'Split adjusted, from Jan 2021 to Apr 2026.'
    },
    xAxis: {
        type: 'datetime',
        crosshair: true,
        labels: { format: '{value:%Y}' }
    },
    yAxis: {
        min: 0,
        title: { text: 'Close Price (USD)' },
        labels: { format: '${value:,.0f}' }
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{}, {
        dashStyle: 'shortdash'
    }],
    tooltip: {
        shared: true,
        valuePrefix: '$',
        valueDecimals: 2
    }
});
