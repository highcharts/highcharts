const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    400
);

[
    'Solid',
    'ShortDash',
    'ShortDot',
    'ShortDashDot',
    'ShortDashDotDot',
    'Dot',
    'Dash',
    'LongDash',
    'DashDot',
    'LongDashDot',
    'LongDashDotDot'
].forEach((dashStyle, i) => {
    renderer.text(dashStyle, 10, 30 * i + 20)
        .add();

    renderer.path(['M', 10, 30 * i + 23, 'L', 390, 30 * i + 23])
        .attr({
            'stroke-width': 2,
            stroke: 'black',
            dashstyle: dashStyle
        })
        .add();
});