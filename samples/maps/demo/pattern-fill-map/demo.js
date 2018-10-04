
// We use a darker border for some states
var darkBorderColor = '#ccc';


// Define the data, linking flags to each point's color.pattern.image. We
// specify a smaller border width for the smaller states. For some states we
// also specify an explicit x/y offset for the images, where the default is
// not satisfactory. Aspect ratio is provided in series definition, and the
// width height for each image is calculated automatically based on that and the
// bounding box of each state.
var data = [
    ['Alabama', 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg'],
    ['Alaska', 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg', 1, 10, -10],
    ['Arizona', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg'],
    ['Arkansas', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'],
    ['California', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/640px-Flag_of_California.svg.png', 1, null, null, darkBorderColor],
    ['Colorado', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg'],
    ['Connecticut', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Flag_of_Connecticut.svg/621px-Flag_of_Connecticut.svg.png', 1],
    ['Delaware', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flag_of_Delaware.svg/640px-Flag_of_Delaware.svg.png', 1],
    ['Florida', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/640px-Flag_of_Florida.svg.png', 1, null, null, darkBorderColor],
    ['Georgia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Georgia_%28U.S._state%29.svg/640px-Flag_of_Georgia_%28U.S._state%29.svg.png'],
    ['Hawaii', 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg', 1, null, null, darkBorderColor],
    ['Idaho', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_Idaho.svg/609px-Flag_of_Idaho.svg.png'],
    ['Illinois', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Illinois.svg/800px-Flag_of_Illinois.svg.png'],
    ['Indiana', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg'],
    ['Iowa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Iowa.svg/640px-Flag_of_Iowa.svg.png'],
    ['Kansas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Kansas.svg/800px-Flag_of_Kansas.svg.png'],
    ['Kentucky', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Kentucky.svg/640px-Flag_of_Kentucky.svg.png'],
    ['Louisiana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Louisiana.svg/640px-Flag_of_Louisiana.svg.png', 3],
    ['Maine', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Maine.svg/640px-Flag_of_Maine.svg.png', 2],
    ['Maryland', 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg', 1, null, null, darkBorderColor],
    ['Massachusetts', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Massachusetts.svg/800px-Flag_of_Massachusetts.svg.png', 1, null, null, darkBorderColor],
    ['Michigan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/640px-Flag_of_Michigan.svg.png', 2],
    ['Minnesota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Minnesota.svg/640px-Flag_of_Minnesota.svg.png'],
    ['Mississippi', 'https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg'],
    ['Missouri', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Missouri.svg/640px-Flag_of_Missouri.svg.png'],
    ['Montana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Montana.svg/640px-Flag_of_Montana.svg.png'],
    ['Nebraska', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Nebraska.svg/640px-Flag_of_Nebraska.svg.png'],
    ['Nevada', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flag_of_Nevada.svg/640px-Flag_of_Nevada.svg.png', null, 40],
    ['New Hampshire', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_New_Hampshire.svg/640px-Flag_of_New_Hampshire.svg.png', 2],
    ['New Jersey', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/640px-Flag_of_New_Jersey.svg.png', 2],
    ['New Mexico', 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_New_Mexico.svg'],
    ['New York', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/640px-Flag_of_New_York.svg.png', 2],
    ['North Carolina', 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg'],
    ['North Dakota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_North_Dakota.svg/613px-Flag_of_North_Dakota.svg.png'],
    ['Ohio', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg'],
    ['Oklahoma', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Oklahoma.svg/640px-Flag_of_Oklahoma.svg.png'],
    ['Oregon', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/640px-Flag_of_Oregon.svg.png'],
    ['Pennsylvania', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Pennsylvania.svg/640px-Flag_of_Pennsylvania.svg.png'],
    ['Rhode Island', 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Rhode_Island.svg', 1],
    ['South Carolina', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_South_Carolina.svg/640px-Flag_of_South_Carolina.svg.png'],
    ['South Dakota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_South_Dakota.svg/640px-Flag_of_South_Dakota.svg.png'],
    ['Tennessee', 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg'],
    ['Texas', 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'],
    ['Utah', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Utah_%282011-present%29.svg/800px-Flag_of_Utah_%282011-present%29.svg.png'],
    ['Vermont', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Vermont.svg/640px-Flag_of_Vermont.svg.png', 2],
    ['Virginia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/640px-Flag_of_Virginia.svg.png', 2],
    ['Washington', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Washington.svg/640px-Flag_of_Washington.svg.png'],
    ['West Virginia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_West_Virginia.svg/640px-Flag_of_West_Virginia.svg.png', 2],
    ['Wisconsin', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_Wisconsin.svg/640px-Flag_of_Wisconsin.svg.png'],
    ['Wyoming', 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Wyoming.svg']
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-all'
    },

    title: {
        text: 'US state flags'
    },

    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/Flags_of_the_U.S._states_and_territories">Wikipedia</a>'
    },

    // Add zoom/pan
    mapNavigation: {
        enabled: true,
        enableDoubleClickZoomTo: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    // Limit zoom
    xAxis: {
        minRange: 3500
    },

    // We do not want a legend
    legend: {
        enabled: false
    },

    // Make tooltip show full image
    tooltip: {
        useHTML: true,
        borderColor: '#aaa',
        headerFormat: '<b>{point.point.name}</b><br>',
        pointFormat: '<img style="width: 150px; height: 100px;" src=\'{point.options.color.pattern.image}\'>'
    },

    // Define the series
    series: [{
        name: 'State flags',
        keys: [
            'name', 'color.pattern.image', 'borderWidth', 'color.pattern.x', 'color.pattern.y', 'borderColor'
        ],
        joinBy: 'name',
        data: data,
        borderColor: '#fff',
        color: {
            pattern: {
                // This is inherited by the individual pattern definitions for
                // each point. As long as a width/height for the pattern is not
                // defined, Highcharts will automatically fill the bounding box
                // while preserving the aspect ratio defined here. Without an
                // aspect ratio defined, Highcharts will simply fill the
                // bounding box with the image, stretching it to fit.
                aspectRatio: 3 / 2
            }
        },
        states: {
            hover: {
                borderColor: '#b44',
                borderWidth: 2
            }
        }
    }, {
        /* Separator lines */
        type: 'mapline',
        nullColor: '#aaa'
    }]
});
