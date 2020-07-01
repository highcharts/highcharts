const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);
renderer
    .text(
        'This text is <span style="color: red">styled</span> and ' +
        '<a href="https://example.com">linked</a>',
        20,
        20
    )
    .add();