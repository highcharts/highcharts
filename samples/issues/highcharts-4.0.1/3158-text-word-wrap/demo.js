var renderer;
$(function () {
    renderer = new Highcharts.Renderer(
        $('#container')[0],
        400,
        300
    );

    renderer.text('<b>TheQuickBrownFox</b><br>jumps over the lazy dog, the issue caused the second line to be only one word', 100, 100)
        .css({
            width: '100px',
            color: '#003399'
        })
        .add();
});