import React from 'react';
import ReactDOM from 'react-dom';

import { Chart, Series, XAxis, Title, setHighcharts } from '@highcharts/react';
import { Accessibility } from '@highcharts/react/options/Accessibility';
import { WordcloudSeries } from '@highcharts/react/series/Wordcloud';

// Note: These imports are not necessary when using a build tool such as Vite
import 'highcharts/esm/modules/wordcloud.src.js'
import HC from 'highcharts/esm/modules/accessibility.src.js'
setHighcharts(HC)

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

const textSources = {
    'Highcharts': 'https://en.wikipedia.org/wiki/Highcharts',
    'Tag cloud': 'https://en.wikipedia.org/wiki/Tag_cloud',
    'Visualisation': 'https://en.wikipedia.org/wiki/Visualization_(graphics)'
}

async function fetchText(url) {
    const titleMatch = url.match(/\/wiki\/([^#]+)/);
    if (!titleMatch || !titleMatch[1]) {
        return;
    }
    const title = decodeURIComponent(titleMatch[1]);
    const apiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&origin=*`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        return;
    }
    const data = await response.json();
    const pages = data.query.pages;
    const pageKey = Object.keys(pages)[0];
    if (pageKey === "-1") {
        return;
    }

    return pages[pageKey].extract;
}


function TextInput ({ content, setContent }) {
  return (
    <div className="text-input-container">
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
      />
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
};

function WikiButtons ({ textSources, content, setContent }) {
  return (
    <div className="wiki-container">
      <p className="wiki-title">Load article from Wikipedia:</p>
      <div
        role="group"
        className="button-group"
        aria-label="Wikipedia article selection"
      >
        {Object.entries(textSources).map(([name, url]) => (
          <button
            aria-label={`Load the ${name} article into wordcloud`}
            aria-pressed={content === textSources[name]}
            key={name}
            onClick={async () => setContent((await fetchText(url)) ?? 'Failed to load article')}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

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
                <Accessibility />
                <WordcloudSeries
                    rotation={{
                        to: 0
                    }}
                    data={data}
                />
            </Chart>

            <TextInput
                content={content}
                setContent={setContent}
            />

            <WikiButtons
              textSources={textSources}
              content={content}
              setContent={setContent}
            />
        </div>
    );
}

ReactDOM.createRoot(
    document.querySelector('#container')
)?.render(<ChartComponent />);
