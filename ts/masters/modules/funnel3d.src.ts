/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/funnel3d
 * @requires highcharts
 * @requires highcharts/highcharts-3d
 * @requires highcharts/modules/cylinder
 *
 * Highcharts funnel module
 *
 * (c) 2010-2021 Kacper Madej
 *
 * License: www.highcharts.com/license
 */
'use strict';
import RendererRegistry from '../../Core/Renderer/RendererRegistry.js';
import Funnel3DSeries from '../../Series/Funnel3D/Funnel3DSeries.js';
Funnel3DSeries.compose(RendererRegistry.getRendererType());
export default Funnel3DSeries;
