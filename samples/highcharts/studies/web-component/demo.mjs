import Highcharts from '../../../../code/es-modules/masters/highcharts.src.js';

const camelize = s => s.toLowerCase().replace(/-./g, x => x[1].toUpperCase());

const resolveAttribute = (value, optionName) => {

    if (optionName === 'data') {
        return value.split(',').map(parseFloat);
    }

    if (optionName === 'categories') {
        return value.split(',').map(s => s.trim());
    }

    if (optionName === 'style') {
        return value.split(';')
            .reduce((cssObject, prop) => {
                const [key, value] = prop.split(':').map(s => s.trim());
                cssObject[key] = value;
                return cssObject;
            }, {});
    }

    if (optionName === 'y') {
        return parseFloat(value);
    }

    // Booleans can be enabled without values, like <chart inverted>
    if (value === '') {
        return true;
    }

    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }
    return value;
};

const resolveElement = element => {
    // Attributes translate to single options
    const options = Array.from(element.attributes).reduce(
        (options, attribute) => {
            const name = camelize(attribute.name);
            options[name] = resolveAttribute(attribute.value, name);

            return options;
        },
        {}
    );

    // Inner text translates to the `text` option, like title.text
    if (element.innerText) {
        options.text = element.innerText.trim();
    }

    let arr;

    // Recurse over child nodes
    for (const child of element.children) {
        // Camelize the kebab case. This is necessary because HTML is case
        // insensitive.
        const nodeName = camelize(child.nodeName);

        // Special tags for series - <line-series>, <column-series> etc.
        const seriesMatch = /^([a-z]+)Series$/.exec(nodeName),
            itemMatch = /^([a-zA-Z\-]+)Item$/.exec(nodeName);
        if (seriesMatch) {
            const series = options.series || [],
                seriesOptions = resolveElement(child);
            seriesOptions.type = seriesMatch[1];
            series.push(seriesOptions);
            options.series = series;

        // General pattern for items of arrays
        } else if (itemMatch) {
            // The `arr` array is now data, categories etc
            arr ??= [];
            arr.push(resolveElement(child));

        } else {
            options[nodeName] = resolveElement(child);
        }
    }

    return arr || options;

};

class HighchartsChart extends HTMLElement {

    // The browser calls this method when the element is added to the DOM.
    connectedCallback() {

        const options = resolveElement(this);

        console.log(options)

        Highcharts.chart(this, options);
    }
}

customElements.define('highcharts-chart', HighchartsChart);