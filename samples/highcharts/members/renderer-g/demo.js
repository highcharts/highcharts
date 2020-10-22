const renderer = new Highcharts.Renderer(
    document.getElementById('container'),
    400,
    300
);

const group = renderer.g().add();

renderer.circle(200, 150, 100).attr({
    fill: '#FCFFC5',
    stroke: 'black',
    'stroke-width': 1
}).add(group);

renderer.rect(90, 150, 100, 100, 5).attr({
    fill: '#C5FFC5',
    stroke: 'black',
    'stroke-width': 1
}).add(group);

let visible = true;

document.getElementById('button').addEventListener('click', () => {
    if (visible) {
        group.hide();
    } else {
        group.show();
    }
    visible = !visible;
});