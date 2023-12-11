(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-al-all.topo.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Map chart based on fips from CSV'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-al-all.topo.json">Alabama</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            joinBy: 'fips'
        }],
        data: {
            csv: 'code;value\n01007;58\n01003;10\n01041;32\n01085;84\n01133;12\n01059;97\n01083;95\n01079;84\n01039;70\n01061;30\n01095;63\n01071;20\n01009;85\n01055;23\n01013;85\n01053;79\n01099;39\n01131;46\n01077;36\n01033;42\n01105;56\n01091;52\n01107;72\n01119;74\n01097;29\n01063;96\n01047;76\n01001;63\n01101;70\n01073;62\n01021;35\n01129;22\n01023;88\n01031;56\n01029;1\n01121;85\n01043;30\n01045;14\n01019;41\n01109;92\n01035;77\n01123;88\n01111;87\n01037;34\n01027;19\n01093;19\n01127;100\n01011;93\n01113;79\n01117;47\n01065;66\n01081;78\n01089;63\n01025;35\n01015;93\n01103;90\n01017;34\n01067;6\n01069;25\n01049;15\n01005;8\n01057;43\n01125;86\n01087;71\n01075;11\n01115;62\n01051;96',
            columnTypes: ['string', 'number'],
            seriesMapping: [{
                fips: 0,
                value: 1
            }]
        }
    });

})();
