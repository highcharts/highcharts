const chart = Highcharts.chart('container', {
    title: {
        text: 'Standalone Breadcrumbs group'
    }
});

const list = [{
    level: 0,
    levelOptions: {
        name: 'First Element'
    }
}, {
    level: 1,
    levelOptions: {
        name: 'Second Element'
    }
}];

const breadcrumbsOptions = {
    position: {
        align: 'center'
    },
    events: {
        click: function (e, b) {
            console.log(b.level);
        }
    },
    separator: {
        style: {
            color: 'red'
        }
    },
    showFullPath: true
};

const breadcrumbs = new Highcharts.Breadcrumbs(
    chart,
    breadcrumbsOptions
);

breadcrumbs.updateProperties(list);
breadcrumbs.render();