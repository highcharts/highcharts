import React from 'react';
import ReactDOM from 'react-dom';

// TODO: remove this workaround import
import HC from '/code/es-modules/masters/highcharts.src.js';
import '/code/es-modules/masters/highcharts-more.src.js';
import '/code/es-modules/masters/modules/wordcloud.src.js';

import { Chart, Series, XAxis, Title, setHighcharts } from '@highcharts/react';

setHighcharts(HC);

const defaultText =
    `Charts are an essential tool for visualizing data, making complex information more accessible and understandable. They come in various forms, including bar charts, line charts, pie charts, and scatter plots, each serving different purposes. A well-designed chart can highlight trends, compare data points, and reveal patterns that might not be obvious in raw numbers. Modern libraries like Highcharts provide powerful tools for creating interactive and dynamic charts in web applications. Whether for business analytics, scientific research, or financial reports, charts help turn data into actionable insights.
`;

function removePunctuation(str) {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
}

function getOccuranceOfWords(words) {
    const wordsArray = removePunctuation(words).toLowerCase()
        .replaceAll(/\n/g, ' ')
        .split(' ');

    const wordCount = {};
    wordsArray.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const data = Object.keys(wordCount).map(word => ({ name: word, weight: wordCount[word] }));

    // Sort and limit
    data.sort((a, b) => b.weight - a.weight);
    data.length = 40;

    return data;
}

const textareaStyle = {
    width: "100%",
    height: "150px",
    padding: "12px",
    border: "2px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease-in-out",
    backgroundColor: "#fff",
    color: "#333",
    resize: "none",
    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
};

const textSources = {
    'Chart': 'https://en.wikipedia.org/wiki/Chart',
    'Highcharts': 'https://en.wikipedia.org/wiki/Highcharts',
    'Tag cloud': 'https://en.wikipedia.org/wiki/Tag_cloud',
    'Visualisation': 'https://en.wikipedia.org/wiki/Visualization_(graphics)'
}

// Fetch the text content of a wikipedia article
// Limit to introduction
async function fetchText(url) {
    const titleMatch = url.match(/\/wiki\/([^#]+)/);
    if (!titleMatch || !titleMatch[1]) {
        throw new Error('Invalid Wikipedia URL');
    }
    const title = decodeURIComponent(titleMatch[1]);
    const apiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&origin=*`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const pages = data.query.pages;
    const pageKey = Object.keys(pages)[0];
    if (pageKey === "-1") {
        throw new Error('Page not found');
    }

    return pages[pageKey].extract;
}


export default function ChartComponent() {
    const [content, setContent] = React.useState(defaultText);
    const [data, setData] = React.useState(getOccuranceOfWords(content));

    React.useEffect(() => {
        const to = setTimeout(() => {
            if (typeof content == 'string') {
                const newData = getOccuranceOfWords(content)
                setData(newData);
            }
        }, 250);

        return () => clearTimeout(to)
    }, [content, setData]);


    return (
        <div>
            <Chart>
                <Title>{''}</Title>
                <Series
                    type="wordcloud" rotation={{
                        from: 1,
                        to: 1
                    }}
                    data={data}
                />
            </Chart>

            <div>
                <p>Load article from Wikipedia:</p>
                <div role="group">
                    {Object.entries(textSources).map(([name, url]) => {
                        return <button aria-label={`Load the ${name} article`} key={name} onClick={async () => setContent(await fetchText(url))}>{name}</button>
                    })}
                </div>
            </div>
            <textarea
                style={textareaStyle}
                onChange={(e) => setContent(e.target.value)}
                value={content}
            ></textarea>
            <dl aria-live="polite">
                <div>
                    <dt>Word count</dt>
                    <dd>{removePunctuation(content).split(' ').length}</dd>
                </div>
                <div>
                    <dt>Unique words</dt>
                    <dd>{new Set(removePunctuation(content).split(' ')).size}</dd>
                </div>
            </dl>
        </div>
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);
