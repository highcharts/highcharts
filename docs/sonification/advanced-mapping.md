Advanced Mapping
===

Several advanced options are available for mapping parameters.

Mapping to a Function
---------------------

It is possible to map audio parameters to functions. For example:

    mapping: {
        // Volume is 0.8 for red points, 0.3 for all other points
        volume: (context) => {
            const point = context.point || {};
            return point.color === 'red' ? 0.8 : 0.3;
        },
        pan: 0,
        noteDuration: 300,
        pitch: 'a3'
    }

The function is called for each audio event to be played in that track, and receives a context object parameter with `time`, and potentially `point` and `value` depending on the track. `point` is available if the audio event is related to a data point, and `value` is available if the track is used for a [context track](https://www.highcharts.com/docs/sonification/context-cues) using `valueInterval`.


Mapping Functions
-----------------

Mapping functions - not to be confused with the section above - refer to the mathematical function used when performing the mapping. It is possible to map either linearly or logarithmically. The demo below illustrates the difference, and how `logarithmic` mapping can be useful with logarithmic axes.

<iframe style="width: 100%; height: 510px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/log-mapping allow="fullscreen"></iframe>

The mapping function can be set for any mapping parameter using the [mapFunction](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions.mapping.pitch.mapFunction) option.

    mapping: {
        volume: 0.7,
        pitch: {
            mapTo: 'y',
            mapFunction: 'logarithmic'
        }
    }

Inverted Polarity
-----------------

Any parameter can also be mapped with inverted polarity, meaning the parameter value goes down as the data point value goes up.

For example, if mapping pitch to Y-values with inverted polarity, the pitch will go down as Y-values go up. This is done simply by adding a negative sign `-` before the data property being mapped to.

    mapping: {
        volume: 0.7,
        pitch: '-y'
    }

<iframe style="width: 100%; height: 465px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/polarity-invert allow="fullscreen"></iframe>

Mapping Within
--------------

All mapping parameters can also be configured to specify the range of data point values they are mapping from. This is done using the [within](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions.mapping.pitch.within) option.

This specifies when mapping data properties, whether to map isolated to a series, or to look at the whole chart, or the X or Y axis of the series.

For example if mapping pitch to Y values, you may want all series on the same Y axis to map relative to each other, and not all use the whole instrument range.

The demo below illustrates different mapping settings for pitch, where pitch is mapped to Y values.

<iframe style="width: 100%; height: 630px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/mapping-within allow="fullscreen"></iframe>

Advanced Pitch Mapping
----------------------

For instrument tracks, pitch mapping has a few extra features compared to the other audio parameters.

**Human readable note names:**

Note pitches can be declared both as numbers or as human readable strings. As numbers, they denote a semitone offset from the "c0" note. As strings, they take the form `<note><octave>`, for example `a5`, `Eb4`, or `g#7`.

    mapping: {
        volume: 0.7,
        pitch: {
            mapTo: 'y',
            min: 'c3',
            max: 'g7'
        }
    }

**Pitch arrays:**

It is possible to map pitch to an array of notes, like this:

    mapping: {
        volume: 0.7,
        pitch: ['c4', 'e4', 'g4']
    }

In this case, all these notes are played for each data point, and the [gapBetweenNotes](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions.mapping.gapBetweenNotes) mapping parameter determines the delay between them.

<iframe style="width: 100%; height: 665px; border: none;" src=https://www.highcharts.com/samples/embed/maps/demo/audio-map allow="fullscreen"></iframe>

**Mapping to a musical scale:**

It is possible to map pitch within a musical scale by setting the [scale](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions.mapping.pitch.scale) option.

The scale is defined as an array of note offsets from the root note, or alternatively you can pass in one of the preset scales:

    mapping: {
        volume: 0.7,
        pitch: {
            mapTo: 'y',
            min: 'c3',
            max: 'g7',
            scale: Highcharts.sonification.Scales.minor
        }
    }

The below demo illustrates the various scale presets and how they affect the mapping:

<iframe style="width: 100%; height: 490px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/all-scales allow="fullscreen"></iframe>

Time Mapping
------------

By default, time is mapped to X. This means data points will play in order from lowest X-value to highest X-value.

Time can be mapped like other parameters, for example to Y values instead:

    mapping: {
        time: 'y',
        pitch: 'y',
        volume: 0.6
    }

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/point-play-time allow="fullscreen"></iframe>

Next steps
----------
After a deep dive into mapping, a deep dive into various [instruments](https://www.highcharts.com/docs/sonification/instruments) and making use of the Highcharts synthesizer is next.
