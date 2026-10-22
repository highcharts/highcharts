import { Chart, Highcharts, Title, Subtitle, Tooltip } from '@highcharts/react';
import { WordcloudSeries } from '@highcharts/react/series/Wordcloud';
import { Exporting } from '@highcharts/react/modules/Exporting';
import { Accessibility } from '@highcharts/react/modules/Accessibility';
import type { Word } from './types';

import 'highcharts/es-modules/masters/modules/non-cartesian-zoom.src.js';

const text =
        'Chapter 1. Down the Rabbit-Hole ' +
        'Alice was beginning to get very tired of sitting by her sister on ' +
        'the bank, and of having nothing to do: ' +
        'once or twice she had peeped into the book her sister was reading, ' +
        'but it had no pictures or conversations ' +
        "in it, 'and what is the use of a book,' thought Alice " +
        "'without pictures or conversation?'" +
        'So she was considering in her own mind (as well as she could, for ' +
        'the hot day made her feel very sleepy ' +
        'and stupid), whether the pleasure of making a daisy-chain would be ' +
        'worth the trouble of getting up and picking ' +
        'the daisies, when suddenly a White Rabbit with pink eyes ran close ' +
        'by her.',
    lines = text.replace(/[():'?0-9]+/g, '').split(/[,\. ]+/g),
    data = lines.reduce((arr: Word[], word) => {
        let obj = Highcharts.find(arr, (obj: Word) => obj.name === word);
        if (obj) {
            obj.weight += 1;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);

export default function WordcloudChart() {
    return (
        <Chart
            options={{
                chart: {
                    zooming: {
                        type: 'xy'
                    },
                    panning: {
                        enabled: true,
                        type: 'xy'
                    },
                    panKey: 'shift'
                }
            }}
        >
            <Title align="left">
                Wordcloud of Alice's Adventures in Wonderland
            </Title>
            <Subtitle align="left">
                An excerpt from chapter 1: Down the Rabbit-Hole
            </Subtitle>
            <Tooltip
                headerFormat={
                    '<span style="font-size: 16px"><b>{point.name}</b>' +
                    '</span><br>'
                }
            />
            <Exporting />
            <Accessibility
                screenReaderSection={{
                    beforeChartFormat:
                        '<h5>{chartTitle}</h5>' +
                        '<div>{chartSubtitle}</div>' +
                        '<div>{chartLongdesc}</div>' +
                        '<div>{viewTableButton}</div>'
                }}
            />
            <WordcloudSeries data={data} name="Occurrences" />
        </Chart>
    );
}
