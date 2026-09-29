(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // We use a darker border for some states
    const darkBorderColor = '#ccc';


    // Define the data, linking flags to each point's color.pattern.image. We
    // specify a smaller border width for the smaller states. For some states we
    // also specify an explicit x/y offset for the images, where the default is
    // not satisfactory. Aspect ratio is provided in series definition, and the
    // width height for each image is calculated automatically based on that
    // and the
    // bounding box of each state.
    const data = [
        ['Alabama', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Alabama.svg/1280px-Flag_of_Alabama.svg.png', null, null, -1.5],
        ['Alaska', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Alaska.svg/1280px-Flag_of_Alaska.svg.png', 1, 5, -5],
        ['Arizona', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arizona.svg/1280px-Flag_of_Arizona.svg.png', null, null, -1],
        ['Arkansas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arkansas.svg/1280px-Flag_of_Arkansas.svg.png'],
        ['California', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/1280px-Flag_of_California.svg.png', 1, 2, -2, darkBorderColor],
        ['Colorado', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Flag_of_Colorado.svg/1280px-Flag_of_Colorado.svg.png', null, 1, 1.5],
        ['Connecticut', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Flag_of_Connecticut.svg/1280px-Flag_of_Connecticut.svg.png', 1],
        ['Delaware', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flag_of_Delaware.svg/1280px-Flag_of_Delaware.svg.png', 1],
        ['Florida', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/1280px-Flag_of_Florida.svg.png', 1, 1.5, -1, darkBorderColor],
        ['Georgia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_the_State_of_Georgia.svg/1280px-Flag_of_the_State_of_Georgia.svg.png'],
        ['Hawaii', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Hawaii.svg/1280px-Flag_of_Hawaii.svg.png', 1, null, null, darkBorderColor],
        ['Idaho', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_Idaho.svg/1280px-Flag_of_Idaho.svg.png', null, null, -2],
        ['Illinois', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Illinois.svg/1280px-Flag_of_Illinois.svg.png'],
        ['Indiana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_Indiana.svg/1280px-Flag_of_Indiana.svg.png'],
        ['Iowa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Iowa.svg/1280px-Flag_of_Iowa.svg.png'],
        ['Kansas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Kansas.svg/1280px-Flag_of_Kansas.svg.png', null, null, 2],
        ['Kentucky', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Kentucky.svg/1280px-Flag_of_Kentucky.svg.png'],
        ['Louisiana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Louisiana.svg/1280px-Flag_of_Louisiana.svg.png', 3],
        ['Maine', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Maine.svg/1280px-Flag_of_Maine.svg.png', 2],
        ['Maryland', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Maryland.svg/1280px-Flag_of_Maryland.svg.png', 1, null, null, darkBorderColor],
        ['Massachusetts', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Massachusetts.svg/1280px-Flag_of_Massachusetts.svg.png', 1, null, null, darkBorderColor],
        ['Michigan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/1280px-Flag_of_Michigan.svg.png', 2],
        ['Minnesota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Minnesota.svg/1280px-Flag_of_Minnesota.svg.png'],
        ['Mississippi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_Mississippi.svg/1280px-Flag_of_Mississippi.svg.png', null, null, -1.5],
        ['Missouri', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Missouri.svg/1280px-Flag_of_Missouri.svg.png', null, null, -2],
        ['Montana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Montana.svg/1280px-Flag_of_Montana.svg.png', null, null, 1],
        ['Nebraska', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Nebraska.svg/1280px-Flag_of_Nebraska.svg.png', null, null, 1],
        ['Nevada', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flag_of_Nevada.svg/1280px-Flag_of_Nevada.svg.png', null, 4, 3],
        ['New Hampshire', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_New_Hampshire.svg/1280px-Flag_of_New_Hampshire.svg.png', 2],
        ['New Jersey', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/1280px-Flag_of_New_Jersey.svg.png', 2],
        ['New Mexico', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_New_Mexico.svg/1280px-Flag_of_New_Mexico.svg.png'],
        ['New York', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/1280px-Flag_of_New_York.svg.png', 2],
        ['North Carolina', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_North_Carolina.svg/1280px-Flag_of_North_Carolina.svg.png'],
        ['North Dakota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_North_Dakota.svg/1280px-Flag_of_North_Dakota.svg.png'],
        ['Ohio', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Ohio.svg/1280px-Flag_of_Ohio.svg.png', null, 1, 2],
        ['Oklahoma', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Oklahoma.svg/1280px-Flag_of_Oklahoma.svg.png', null, 1, -0.5],
        ['Oregon', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/1280px-Flag_of_Oregon.svg.png', null, null, -1.5],
        ['Pennsylvania', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Pennsylvania.svg/1280px-Flag_of_Pennsylvania.svg.png', null, null, -1],
        ['Rhode Island', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Rhode_Island.svg/1280px-Flag_of_Rhode_Island.svg.png', 1],
        ['South Carolina', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_South_Carolina.svg/1280px-Flag_of_South_Carolina.svg.png'],
        ['South Dakota', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_South_Dakota.svg/1280px-Flag_of_South_Dakota.svg.png'],
        ['Tennessee', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Tennessee.svg/1280px-Flag_of_Tennessee.svg.png', null, null, 1.5],
        ['Texas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Texas.svg/1280px-Flag_of_Texas.svg.png', null, null, 1.5],
        ['Utah', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Utah.svg/1280px-Flag_of_Utah.svg.png', null, -0.5, 1],
        ['Vermont', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Vermont.svg/1280px-Flag_of_Vermont.svg.png', 2],
        ['Virginia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/1280px-Flag_of_Virginia.svg.png', 2],
        ['Washington', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Washington.svg/1280px-Flag_of_Washington.svg.png', null, null, 8],
        ['West Virginia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_West_Virginia.svg/1280px-Flag_of_West_Virginia.svg.png', 2],
        ['Wisconsin', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_Wisconsin.svg/1280px-Flag_of_Wisconsin.svg.png'],
        ['Wyoming', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Wyoming.svg/1280px-Flag_of_Wyoming.svg.png', null, null, -1.5]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'US state flags'
        },

        subtitle: {
            text: 'Source: <a href="https://en.wikipedia.org/wiki/Flags_of_the_U.S._states_and_territories">Wikipedia</a>'
        },

        accessibility: {
            description: 'Map of US states, where each state is filled with ' +
                'an illustration of its state flag.'
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
            pointFormat: '<img style="width: 150px; height: 100px;" ' +
                'src="{point.options.color.pattern.image}">'
        },

        // Define the series
        series: [{
            name: 'State flags',
            accessibility: {
                exposeAsGroupOnly: true
            },
            keys: [
                'name', 'color.pattern.image', 'borderWidth', 'color.pattern.x',
                'color.pattern.y', 'borderColor'
            ],
            joinBy: 'name',
            data: data,
            borderColor: '#fff',
            color: {
                pattern: {
                    // This is inherited by the individual pattern
                    // definitions for
                    // each point. As long as a width/height for the pattern
                    // is not
                    // defined, Highcharts will automatically fill the
                    // bounding box
                    // while preserving the aspect ratio defined here.
                    // Without an
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
            nullColor: '#aaa',
            accessibility: {
                enabled: false
            }
        }]
    });

})();