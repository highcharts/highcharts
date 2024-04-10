Notifications and Earcons
===

Earcons, or "ear-icons" are brief sound icons that gives the user some information, or notifies them of an event.

Often we would like to give sound feedback to notify the user of points of interest, or to direct their attention towards something. Sometimes we would also like to use speech, either for notifying or for providing additional context to a sound.

Using Conditional Tracks
------------------------

One way to accomplish this is with [conditional tracks](https://www.highcharts.com/docs/sonification/conditional-tracks), where we play a sound or announce some speech when certain criteria are met, such as when a specific value is reached.

    globalTracks: [{
        instrument: 'vibraphone',
        mapping: {
            pitch: ['c6', 'g6'],
            gapBetweenNotes: 140
        },
        activeWhen: {
            prop: 'y',
            crossingUp: 100
        }
    }, {
        instrument: 'saxophone',
        mapping: {
            pitch: ['g6', 'c6'],
            gapBetweenNotes: 140
        },
        activeWhen: {
            prop: 'y',
            crossingDown: 100
        }
    }]

In the example above we are setting up two notifications, one for when the Y-value crosses over 100, and a different one when it crosses below.

Using Events
------------

We can also play notifications programmatically, using event handlers.

To do this we can use the [chart.sonification.playNote()](https://api.highcharts.com/class-reference/Highcharts.Sonification#playNote) and [chart.sonification.speak](https://api.highcharts.com/class-reference/Highcharts.Sonification#speak) functions.

These functions allow us to quickly play a note or speak an announcement without dealing with setting up our own [SonificationInstrument](https://api.highcharts.com/class-reference/Highcharts.SonificationInstrument) or [SonificationSpeaker](https://api.highcharts.com/class-reference/Highcharts.SonificationSpeaker) objects. With that said, there is the option to do this instead if more control and flexibility is wanted, and it is recommended to go this route if you are doing a lot of notifications in the same chart.

The below demo illustrates how to set up [sonification event handlers](https://api.highcharts.com/highcharts/sonification.events) and use the functions mentioned above to play notes and speech announcements.

<iframe style="width: 100%; height: 415px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/chart-events allow="fullscreen"></iframe>

Next Steps
----------
Another important tool for sonification is [context cues](https://www.highcharts.com/docs/sonification/context-cues), tracks providing background information.
