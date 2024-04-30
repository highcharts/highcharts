/**
 * Experimental script to describe a demo using AI
 *
 * Usage: From root, run
 *
 * node tools/describe-demo.mjs --path highcharts/demo/line-chart
 */

import { ChatGPTAPI } from 'chatgpt';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const yargs = _yargs(hideBin(process.argv));
const { argv } = yargs;

async function getGitIgnoreMeProperties() {
    const properties = {};
    const lines = await fs.readFile(
        './git-ignore-me.properties', 'utf-8'
    );

    lines.split('\n').forEach(function (line) {
        line = line.split('=');
        if (line[0]) {
            properties[line[0]] = line[1];
        }
    });

    return properties;
}

(async () => {
    const body = await fs.readFile(`samples/${argv.path}/demo.html`)
        .then(data => data.toString());
    const style = await fs.readFile(`samples/${argv.path}/demo.css`)
        .then(data => data.toString());
    const script = await fs.readFile(`samples/${argv.path}/demo.js`)
        .then(data => data.toString());
    const details = yaml.load(
        await fs.readFile(`samples/${argv.path}/demo.details`)
    );

    const tags = details.tags.map(tag => `<li>${tag}</li>`);

    const html = `<html>
        <head>
            <title>${details.name}</title>
            <style>
                ${style}
            </style>
        </head>
        <body>
            <h1>${details.name}</h1>
            <ul>${tags}</ul>
            ${body}
            <script>
                ${script}
            </script>
        </body>
    </html>`;

    const props = await getGitIgnoreMeProperties();
    const chat = new ChatGPTAPI({
        apiKey: props['openai.key'],
        systemMessage: `
        You are a copy writer tasked with writing comprehensive
        descriptions of Highcharts demos.

        For the given demo, create a short description (max 100 words) of the
        features and functionality of the demo. Emphasize the two or three key
        features that make this demo unique.

        Whenever chart concepts are mentioned, ensure that the keywords are
        linked to the Highcharts API reference or general documentation.

        Examples of good responses:
        - Basic line chart showing trends in a dataset. This chart includes the
        \`series-label\` module, which adds a label to each line for
        enhanced readability.
        - A basic column chart comparing estimated corn and wheat production
        in some countries. The chart is making use of the axis crosshair
        feature, to highlight the hovered country.
        - This pie chart shows how the chart legend can be used to provide
        information about the individual slices.
        `
    });

    const response = await chat.sendMessage(html)
        .catch(e => console.error(e));

    if (response) {
        console.log(response.text);
    }


})();
