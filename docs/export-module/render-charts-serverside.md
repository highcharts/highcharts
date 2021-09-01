Command Line Rendering
======================

Node Export Server
------------------

In addition to being able to run as a server, our [node export server](https://github.com/highcharts/node-export-server) is a fully functional command line tool for creating chart images in PNG, JPEG, PDF or SVG, based on chart configurations or chart SVGs. Whether you want to generate charts in automated reports or emails, have consistent images between front and back end, or simply batch convert charts to images, the node export server is your tool.

Install with `npm install highcharts-export-server -g` or clone from [https://github.com/highcharts/node-export-server](https://github.com/highcharts/node-export-server)

The tool has a simple command line syntax: `highcharts-export-server <arguments>`

Examples:

*   Convert a chart configuration to a PNG image: `highcharts-export-server -infile chartConfig.json -outfile chart.png`
*   Batch convert three charts into images: `highcharts-export-server -batch "infile1.json=outfile1.png;infile2.json=outfile2.png;infile3.json=outfile3.png;"`

See documentation on [GitHub](https://github.com/highcharts/node-export-server/blob/master/README.md) for more information

Instructions for our legacy export servers can be found [here](https://highcharts.com/docs/export-module/legacy-export-servers).
