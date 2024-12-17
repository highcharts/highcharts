Instruments
===

There are two types of tracks available in the Highcharts sonification module: Instrument tracks and Speech tracks. An instrument track is a track that plays a sequence of notes using the built-in Highcharts synthesizer.

All configuration options for instrument tracks can be found under [defaultInstrumentOptions](https://api.highcharts.com/highcharts/sonification.defaultInstrumentOptions) in the API documentation.

Available Presets
-----------------

There are several presets available for different instrument sounds. Broadly speaking there are 4 different types of sounds:

1. Plucked, staccato sounds that do not sustain: This includes presets such as `piano`, `vibraphone` and `plucked`. These work well when you want separation between notes. Note duration mapping has no effect on these.
2. Continuous, sustained sounds: This includes presets such as `flute`, `saxophone`, `basic1` and `basic2`. These instruments work well for continuous playing.
3. Percussion sounds: These are sounds without melody, such as `chop`, `shaker` and `noise`. Mapping to pitch has no effect on these.
4. Effect sounds: These are sounds that have some additional effects added to them that varies with pitch, such as `wind` and `wobble`.

The below demo shows off the available instrument presets:

<iframe style="width: 100%; height: 510px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/all-instruments allow="fullscreen"></iframe>

Custom Presets
--------------

It is possible to create your own custom presets by giving configuration options for a [SynthPatch](https://api.highcharts.com/class-reference/Highcharts.SynthPatchOptionsObject) object.

The demo below illustrates this:

<iframe style="width: 100%; height: 455px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/custom-instrument allow="fullscreen"></iframe>

Using Synth Classes Directly
----------------------------

Both the [Highcharts.sonification.SynthPatch](https://api.highcharts.com/class-reference/Highcharts.SynthPatch) class and the [Highcharts.sonification.SonificationInstrument](https://api.highcharts.com/class-reference/Highcharts.SonificationInstrument) class can be used directly as a platform for creating custom sound experiences and sonifications.

The below demo shows a use case with `SynthPatch` where we create a simple sonification manually.

<iframe style="width: 100%; height: 520px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/sonification/manual-using-synth allow="fullscreen"></iframe>

Next Steps
----------
We have talked about instruments, next up is exploring [speech](https://www.highcharts.com/docs/sonification/speech).
