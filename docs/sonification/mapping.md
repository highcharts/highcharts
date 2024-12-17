Mapping to Data
===

When sonifying data, the most common use case is to specify the instruments you want to be playing, and then mapping data properties to various instrument parameters.

For example you may map Y-values to the instrument pitch, to result in a sound that rises in pitch for higher data values.

The below chart demonstrates some of the different audio parameters you can map to with the sonification module, and what they do:

<iframe style="width: 100%; height: 822px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/mapping-overview allow="fullscreen"></iframe>

Configuration
------------

There are several ways to define mapping for tracks in Highcharts. The easiest one is fixed mapping, where an audio parameter gets a fixed value:

    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            instrument: 'saxophone',
            mapping: {
                volume: 0.4,
                pan: 0,
                noteDuration: 300,
                pitch: 'a3'
            }
        }
    }

With the above configuration, the audio values stay fixed and do not change. For every data point we will play the note "A3" for 300 milliseconds, at 0.4 volume, in the center of the stereo field. Obviously this does not communicate a lot, so we would prefer to map something to a data property:

    mapping: {
        volume: 0.4,
        pan: 0,
        noteDuration: 300,
        pitch: 'y'
    }

By changing the pitch mapping to `"y"`, the pitch of the instrument will change as the Y-values change. Lower Y-values will cause a lower pitch, and higher values will cause a higher pitch. We can map any of the parameters to any data point property. Use dot notation to access nested properties.

Often we want to define the pitch range for the instrument. This can be done by passing a configuration object to the mapping parameter:

    mapping: {
        volume: 0.4,
        pan: 0,
        noteDuration: 300,
        pitch: {
            mapTo: 'y',
            min: 'c3',
            max: 'g6'
        }
    }

Now we are mapping to this instrument range, so that the lowest Y-value will play a "c3" note, and the highest a "g6" note.

For a complete overview of the mapping properties available, with all the detailed configuration options for each, see [defaultInstrumentOptions.mapping](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions.mapping) for instrument tracks, and [defaultSpeechOptions.mapping](https://api.highcharts.com/highcharts/sonification.defaultSpeechOptions.mapping) for speech tracks.

Effective Mapping
-----------------

Sonification is both a science and an art, and while there is no definitive "right" way to do it, here are 7 tips from science that can be helpful if the goal is for the sound experience to be intuitive:

1. Pitch mapping is often intuitive if communicating amount or size. For size, lower pitch is often assumed to mean bigger.
2. G4 to F6 is the most accurate pitch range for most humans, if a narrow range is acceptable.
3. Different instruments/timbres can be used to categorize sounds and create separation, but comparisons between different instruments can sometimes be harder.
4. Duration can be used to convey importance. Use with caution, as it can overlap other sounds, and also interrupt the user's flow of interaction if the duration is too long.
5. Volume can be used to convey intensity, but it can be hard to hear small differences in volume, and it can be heard differently across different devices.
6. Tempo, such as with tremolo or varying the gap between notes, is good for conveying intensity, or the speed of something. It is relatively easy for most people to hear small differences in tempo.
7. Stereo pan is often helpful, but requires the user to have headphones or stereo speakers, and should therefore usually not be relied on alone.

**Dual coding:**

It is entirely possible to map the same data property to multiple audio parameters, and this is often a good idea. For example, you could map Y-values to both volume, duration, and pitch to emphasise the importance of a change in Y-value for a particular dataset.

    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            instrument: 'saxophone',
            mapping: {
                pan: 0,
                volume: 'y',
                noteDuration: 'y',
                pitch: 'y'
            }
        }
    }

**Information Overload:**

It can be easy to overwhelm the user with sound information if you have too much going on at once with the sonification. This particularly applies to multiple series playing at the same time.

In general, more than 3 changing parameters at one time can be messy. Most people can consistently track 2 changes at once if they are distinct enough.

With that said, sonification is also sometimes used to make sense of large and complex datasets where the goal is less to communicate all the data, and more to listen for patterns or abnormalities. In these cases the soundscapes are often more complex, with many things going on at once.

Next Steps:
-----------
This article dealt with the basics of mapping configuration. The next step up is exploring [more advanced mapping](https://www.highcharts.com/docs/sonification/advanced-mapping) options.
