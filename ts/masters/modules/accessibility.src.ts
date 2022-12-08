/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/accessibility
 * @requires highcharts
 *
 * Accessibility module
 *
 * (c) 2010-2021 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import Accessibility from '../../Accessibility/Accessibility.js';
import AccessibilityComponent from '../../Accessibility/AccessibilityComponent.js';
import ChartUtilities from '../../Accessibility/Utils/ChartUtilities.js';
import HTMLUtilities from '../../Accessibility/Utils/HTMLUtilities.js';
import KeyboardNavigationHandler from '../../Accessibility/KeyboardNavigationHandler.js';
import SeriesDescriber from '../../Accessibility/Components/SeriesComponent/SeriesDescriber.js';

const G: AnyRecord = Highcharts;
G.i18nFormat = Accessibility.i18nFormat;
G.A11yChartUtilities = ChartUtilities;
G.A11yHTMLUtilities = HTMLUtilities;
G.AccessibilityComponent = AccessibilityComponent;
G.KeyboardNavigationHandler = KeyboardNavigationHandler;
G.SeriesAccessibilityDescriber = SeriesDescriber;

Accessibility.compose(
    G.Chart,
    G.Legend,
    G.Point,
    G.Series,
    G.SVGElement,
    G.RangeSelector
);
