/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/sonification
 * @requires highcharts
 *
 * Sonification module
 *
 * (c) 2012-2021 Øystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import ChartSonify from '../../Extensions/Sonification/ChartSonify.js';
import Earcon from '../../Extensions/Sonification/Earcon.js';
import Instrument from '../../Extensions/Sonification/Instrument.js';
import PointSonify from '../../Extensions/Sonification/PointSonify.js';
import SeriesSonify from '../../Extensions/Sonification/SeriesSonify.js';
import Sonification from '../../Extensions/Sonification/Sonification.js';
import Timeline from '../../Extensions/Sonification/Timeline.js';
import TimelineEvent from '../../Extensions/Sonification/TimelineEvent.js';
import TimelinePath from '../../Extensions/Sonification/TimelinePath.js';
const G: AnyRecord = Highcharts;
G.sonification = {
    ...Sonification,
    instruments: Instrument.definitions,
    Earcon,
    Instrument,
    Timeline,
    TimelineEvent,
    TimelinePath
};
G.Earcon = Earcon;
G.Instrument = Instrument;
ChartSonify.compose(G.Chart);
SeriesSonify.compose(G.Series);
PointSonify.compose(G.Point);
