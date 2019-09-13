Highcharts.chart('container', {
    title: {
        text: 'Chart with a caption'
    },
    subtitle: {
        text: 'This is the subtitle'
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column',
        name: 'Fruits'
    }],
    caption: {
        text: '<b>The caption renders in the bottom, and is part of the exported chart.</b><br><em>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</em>'
    }
});