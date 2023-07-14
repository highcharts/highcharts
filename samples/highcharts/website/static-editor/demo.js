/* eslint-disable use-isnan */
/* eslint-disable no-unused-vars */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-sequences */
/* eslint-disable node/callback-return */
/* eslint-disable max-statements-per-line */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

// ////////////////////////////////////////////////////////////////////////////


var highed = {
    schemas: {},
    meta: {
        chartTemplates: {},
        fonts: []
    },
    plugins: {},

    resources: {
        logo:
      '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "https://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Warstwa_1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px"     width="425.197px" height="141.732px" viewBox="0 0 425.197 141.732" enable-background="new 0 0 425.197 141.732"     xml:space="preserve"><g>    <path fill="#383836" d="M138.475,69.712h-17.02v9.77c0,1.037-0.813,1.851-1.849,1.851c-1.037,0-1.85-0.813-1.85-1.851V57.725        c0-1.037,0.813-1.852,1.85-1.852c1.036,0,1.849,0.813,1.849,1.852v8.436h17.02v-8.436c0-1.037,0.814-1.852,1.85-1.852        c1.036,0,1.85,0.813,1.85,1.852v21.754c0,1.037-0.814,1.851-1.85,1.851c-1.036,0-1.85-0.813-1.85-1.851V69.712z"/>    <path fill="#383836" d="M156.973,79.479c0,1.037-0.814,1.851-1.852,1.851s-1.852-0.813-1.852-1.851V57.725        c0-1.037,0.814-1.852,1.852-1.852s1.852,0.813,1.852,1.852V79.479z"/>    <path fill="#383836" d="M184.125,70.378c0-1.036,0.814-1.774,1.852-1.774c1.034,0,1.852,0.813,1.852,1.849v5.847        c0,0.444-0.226,1.109-0.595,1.479c-2.367,2.369-5.549,3.773-9.176,3.773c-7.178,0-12.949-5.771-12.949-12.948        c0-7.181,5.771-12.949,12.949-12.949c3.627,0,6.809,1.405,9.176,3.771c0.738,0.74,0.738,1.852,0,2.592        c-0.741,0.738-1.922,0.813-2.663,0.072c-1.702-1.699-3.923-2.736-6.513-2.736c-5.104,0-9.249,4.144-9.249,9.25        c0,5.104,4.146,9.25,9.249,9.25c2.367,0,4.441-0.813,6.067-2.222V70.378z"/>    <path fill="#383836" d="M218.162,69.712h-17.019v9.77c0,1.037-0.817,1.851-1.852,1.851c-1.037,0-1.849-0.813-1.849-1.851V57.725        c0-1.037,0.812-1.852,1.849-1.852c1.034,0,1.852,0.813,1.852,1.852v8.436h17.019v-8.436c0-1.037,0.813-1.852,1.849-1.852        c1.037,0,1.852,0.813,1.852,1.852v21.754c0,1.037-0.813,1.851-1.852,1.851c-1.033,0-1.849-0.813-1.849-1.851V69.712z"/>    <path fill="#383836" d="M242.948,81.552c-7.182,0-12.949-5.771-12.949-12.948c0-7.181,5.77-12.949,12.949-12.949        c3.627,0,6.809,1.405,9.176,3.771c0.738,0.74,0.738,1.852,0,2.592c-0.741,0.738-1.925,0.813-2.666,0.072        c-1.699-1.699-3.92-2.736-6.51-2.736c-5.106,0-9.249,4.144-9.249,9.25c0,5.104,4.143,9.25,9.249,9.25        c2.59,0,4.884-0.962,6.586-2.664c0.74-0.741,1.849-0.741,2.59,0c0.738,0.738,0.738,1.85,0,2.589        C249.756,80.146,246.574,81.552,242.948,81.552z"/>    <path fill="#383836" d="M281.569,69.712h-17.02v9.77c0,1.037-0.813,1.851-1.852,1.851c-1.034,0-1.85-0.813-1.85-1.851V57.725        c0-1.037,0.813-1.852,1.85-1.852c1.035,0,1.852,0.813,1.852,1.852v8.436h17.02v-8.436c0-1.037,0.813-1.852,1.853-1.852        c1.034,0,1.849,0.813,1.849,1.852v21.754c0,1.037-0.813,1.851-1.849,1.851c-1.037,0-1.853-0.813-1.853-1.851V69.712z"/>    <path fill="#383836" d="M308.758,57.503l10.507,20.646c0.223,0.443,0.445,1.036,0.445,1.554c0,1.036-0.668,1.628-1.702,1.628        c-0.741,0-1.481-0.222-2.001-1.258l-3.253-6.438h-13.547l-3.183,6.438c-0.517,1.036-1.256,1.258-1.994,1.258        c-1.037,0-1.702-0.593-1.702-1.628c0-0.519,0.22-1.109,0.442-1.554l10.506-20.646c0.668-1.405,2.002-1.628,2.74-1.628        C306.76,55.875,308.09,56.096,308.758,57.503z M300.985,70.083h9.988l-4.957-9.99L300.985,70.083z"/>    <path fill="#383836" d="M340.159,56.023c4.441,0,8.064,3.255,8.064,7.694c0,3.923-2.813,6.884-6.511,7.549l6.731,7.104        c0.664,0.666,0.889,1.85,0.146,2.516c-0.736,0.741-2.145,0.521-2.886-0.296l-8.729-9.176h-6.511v8.142        c0,1.034-0.815,1.774-1.854,1.774c-1.033,0-1.85-0.813-1.85-1.851V57.873c0-1.035,0.814-1.85,1.85-1.85H340.159z M330.468,59.575        v8.288h9.691c2.59,0,4.367-1.776,4.367-4.146c0-2.365-1.777-4.144-4.367-4.144L330.468,59.575L330.468,59.575z"/>    <path fill="#383836" d="M365.047,59.575h-9.249c-1.033,0-1.849-0.74-1.849-1.776c0-1.034,0.813-1.773,1.849-1.773h22.201        c1.037,0,1.852,0.74,1.852,1.773c0,1.037-0.813,1.776-1.852,1.776h-9.249V79.48c0,1.037-0.813,1.851-1.849,1.851        c-1.037,0-1.854-0.813-1.854-1.851V59.575z"/>    <path fill="#383836" d="M388.724,66.013c0-9.25,5.698-10.359,9.99-10.359c1.035,0,1.85,0.813,1.85,1.85        c0,1.036-0.813,1.851-1.85,1.851c-3.479,0-6.29,0.738-6.29,6.66v5.18c0,9.25-5.698,10.358-9.989,10.358        c-1.035,0-1.85-0.813-1.85-1.85s0.814-1.85,1.85-1.85c3.479,0,6.289-0.74,6.289-6.66V66.013z"/></g><polygon fill="#8087E8" points="67.981,30.52 56.757,56.73 42.009,91.171 76.301,76.685 94.465,69.013 "/><polygon fill="#30426B" points="73.7,62.25 76.302,76.685 94.466,69.013 "/><polygon fill="#6699A1" points="67.981,30.52 73.7,62.251 94.465,69.013 "/><polygon fill="#78758C" points="73.7,62.25 94.466,69.013 56.758,56.729 42.009,91.171 76.302,76.685 "/><polygon fill="#A3EDBA" points="42.009,91.171 56.757,56.73 26.442,46.855 "/><polygon fill="#6699A1" points="76.302,76.685 79.628,95.13 94.466,69.013 "/><polygon fill="#8087E8" points="67.981,30.52 56.757,56.73 73.7,62.251 "/></svg>',
        icons: {
            line: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{fill:#42C8C0;} .st1{display:none;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st8{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st9{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} </style> <g id="line"> <path class="st0" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st1"> <polygon class="st2" points="18.1,26.2 28.9,33.7 24.8,21.6 35.6,14.3 22.4,14.3 18.1,1.8 13.9,14.3 0.7,14.3 11.5,21.6 7.4,33.7 "/> </g> <g id="bar" class="st1"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st1"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st1"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st1"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st1"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st1"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st1"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st7" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st8" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st9" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st1"> <g class="st3"> <path class="st0" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st1"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            area: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st8{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st9{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} .st10{fill:#42C8C0;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st7" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st8" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st9" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area"> <g> <path class="st10" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            bar: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{fill:#42C8C0;} .st4{display:inline;} .st5{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st6{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st7{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st8{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st9{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st10{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar"> <g> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st3" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st4"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st4"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st6" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st7" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st7" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st7" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st7" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st7" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st4"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st8" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st9" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st10" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st4"> <path class="st3" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            column: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st8{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st9{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} .st10{fill:#42C8C0;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns"> <g> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st7" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st8" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st9" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st3"> <path class="st10" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            more: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st8{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st9{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} .st10{fill:#42C8C0;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st7" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st8" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st9" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st3"> <path class="st10" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11"> <path class="st10" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            pie: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st8{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st9{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} .st10{fill:#42C8C0;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie"> <g> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st7" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st8" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st9" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st3"> <path class="st10" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            polar: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st8{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st9{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} .st10{fill:#42C8C0;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st7" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st8" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st9" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st3"> <path class="st10" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            'scatter and bubble': '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{fill:#42C8C0;} .st7{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st8{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st9{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st10{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter"> <path class="st6" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st7" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st7" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st7" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st7" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st7" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock" class="st0"> <path class="st2" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st8" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st9" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st10" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st3"> <path class="st6" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> ',
            stock: '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve"> <style type="text/css"> .st0{display:none;} .st1{display:inline;fill:#D66544;} .st2{display:inline;fill:#42C8C0;} .st3{display:inline;} .st4{clip-path:url(#SVGID_4_);fill-rule:evenodd;clip-rule:evenodd;fill:#42C8C0;} .st5{clip-path:url(#SVGID_6_);fill:#42C8C0;} .st6{display:inline;fill:none;stroke:#42C8C0;stroke-width:2;stroke-miterlimit:10;} .st7{fill:#42C8C0;} .st8{clip-path:url(#SVGID_8_);fill:#42C8C0;} .st9{display:inline;fill:none;stroke:#FFFFFF;stroke-width:5;} .st10{display:inline;fill:none;stroke:#42C8C0;stroke-width:2.2574;} </style> <g id="line" class="st0"> <path class="st1" d="M12.1,13.1l3.6,4.1L9,27.7l-6.5,0l0.1-3.8L12.1,13.1z M21.4,11.5l2.5,6.8l-3,2.3l-3.1-3.5L21.4,11.5z M10.1,29.2L17,18.5l3.8,4.2l3.9-2.9l3.6,10.1l4.8-5.1l1.2,2.7l1.2-1.1L33.7,22l-4.8,4.9l-3-8.2l1.7-1.4l4.6,4l3.5-7.9l-1.4-0.5 l-2.5,5.8l-4-3.5L25.4,17l-3.4-9.4l-5.2,8l-4.6-5.1L2.4,21.8l0-20.4L0,1.4v34.5h35.7v-2.1l-33.3,0v-4.7H10.1z"/> </g> <g id="popular" class="st0"> <polygon class="st2" points="18.1,27.7 28.9,35.2 24.8,23.1 35.6,15.8 22.4,15.8 18.1,3.3 13.9,15.8 0.7,15.8 11.5,23.1 7.4,35.2 "/> </g> <g id="bar" class="st0"> <g class="st3"> <defs> <rect id="SVGID_1_" x="-2.2" y="-1.2" width="41.2" height="41.2"/> </defs> <clipPath id="SVGID_2_"> <use xlink:href="#SVGID_1_" style="overflow:visible;"/> </clipPath> </g> <path class="st2" d="M27.5,4.5v25.7h4.6V4.5H27.5z M20.6,13v17.1h4.6V13H20.6z M35.7,34.1H2.3V1.6H0.1v34.3h35.6L35.7,34.1 L35.7,34.1z M13.8,7.3v22.8h4.6V7.3H13.8L13.8,7.3z M6.9,18.8v11.4h4.6V18.8H6.9z"/> </g> <g id="columns" class="st0"> <g class="st3"> <defs> <rect id="SVGID_3_" x="1.3" y="1.5" width="33.8" height="33.8"/> </defs> <clipPath id="SVGID_4_"> <use xlink:href="#SVGID_3_" style="overflow:visible;"/> </clipPath> <path class="st4" d="M27,1.5v32.2h6.4V1.5H27z M16.9,12.2h-6.4v21.5h6.4V12.2z M8.6,22.9H2.2v10.8h6.4V22.9z M25.2,8.2h-6.4v25.5 h6.4V8.2z"/> </g> </g> <g id="pie" class="st0"> <g class="st3"> <defs> <rect id="SVGID_5_" x="-4.4" y="-4.8" width="45.6" height="45.6"/> </defs> <clipPath id="SVGID_6_"> <use xlink:href="#SVGID_5_" style="overflow:visible;"/> </clipPath> <path class="st5" d="M32.2,9.1c-1.3-2.3-3.2-4.2-5.5-5.5c-2.3-1.4-4.9-2.1-7.6-2v15.2h15.2C34.3,14.1,33.6,11.4,32.2,9.1L32.2,9.1 z M31,30.1c2.9-2.9,4.5-6.7,4.5-10.8H20.3L31,30.1z M16.5,19.1V4c-2.7,0-5.3,0.7-7.6,2c-2.3,1.3-4.2,3.2-5.6,5.5 c-2.7,4.7-2.7,10.5,0,15.2c1.3,2.3,3.3,4.2,5.6,5.6c4.1,2.4,9.1,2.7,13.5,0.9c1.8-0.8,3.5-1.9,4.9-3.3L16.5,19.1z"/> </g> </g> <g id="scatter" class="st0"> <path class="st2" d="M32.8,18.7c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C32,16.8,32.8,17.6,32.8,18.7z M14,29.6c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C13.1,27.6,14,28.5,14,29.6z M19.2,29.6 c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9C18.3,27.6,19.2,28.5,19.2,29.6z M21.2,23.8 c0,1.1-0.9,1.9-1.9,1.9s-1.9-0.8-1.9-1.9c0-1.1,0.9-1.9,1.9-1.9S21.2,22.8,21.2,23.8z M26.3,22.5c0,1.1-0.9,1.9-1.9,1.9 c-1.1,0-1.9-0.8-1.9-1.9s0.9-1.9,1.9-1.9C25.4,20.6,26.3,21.5,26.3,22.5z M28.3,16.8c0,1.1-0.9,1.9-1.9,1.9c-1.1,0-1.9-0.8-1.9-1.9 c0-1.1,0.9-1.9,1.9-1.9S28.3,15.7,28.3,16.8z M31.5,11c-1.1,0-1.9,0.8-1.9,1.9c0,1.1,0.9,1.9,1.9,1.9c1.1,0,1.9-0.8,1.9-1.9 C33.5,11.9,32.6,11,31.5,11z M5.6,18.1c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9S5.6,19.1,5.6,18.1z M24.4,7.2 c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C25.3,9.1,24.4,8.2,24.4,7.2z M19.2,7.2c0-1.1,0.9-1.9,1.9-1.9 c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9C20.1,9.1,19.2,8.2,19.2,7.2z M17.3,12.9c0-1.1,0.9-1.9,1.9-1.9s1.9,0.8,1.9,1.9 c0,1.1-0.9,1.9-1.9,1.9S17.3,14,17.3,12.9z M12.1,14.2c0-1.1,0.9-1.9,1.9-1.9c1.1,0,1.9,0.8,1.9,1.9c0,1.1-0.9,1.9-1.9,1.9 S12.1,15.3,12.1,14.2z M10.1,20c0-1.1,0.9-1.9,1.9-1.9S14,18.9,14,20s-0.9,1.9-1.9,1.9C11,21.9,10.1,21,10.1,20z M6.9,25.7 c1.1,0,1.9-0.8,1.9-1.9c0-1.1-0.9-1.9-1.9-1.9s-1.9,0.8-1.9,1.9C4.9,24.9,5.8,25.7,6.9,25.7z M35.2,5.1l-0.4-0.5L5.1,30.2l0.4,0.5 L35.2,5.1z M35.5,35.8H0.1V1.7h1.9V34h33.4V35.8z"/> </g> <g id="polar" class="st0"> <polygon class="st6" points="26.2,4 9.7,4 1.4,18.4 9.7,32.8 26.2,32.8 34.5,18.4 "/> <polygon class="st6" points="23.7,8.3 12.1,8.3 6.3,18.3 12.1,28.4 23.7,28.4 29.5,18.3 "/> <line class="st6" x1="9.7" y1="4" x2="26.2" y2="32.8"/> <line class="st6" x1="26.2" y1="4" x2="9.7" y2="32.8"/> <line class="st6" x1="1.4" y1="18.4" x2="34.5" y2="18.4"/> </g> <g id="stock"> <path class="st7" d="M33.5,9.7c0-0.3-0.2-0.5-0.5-0.5h0h-7.4c-0.3,0-0.5,0.2-0.5,0.5c0,0.1,0.1,0.3,0.2,0.4l2.1,2.1l-7.9,7.9l-4-4 c-0.2-0.2-0.5-0.2-0.8,0l0,0l-9.9,9.9L8,29.3l7.1-7.1l4,4c0.2,0.2,0.5,0.2,0.8,0l0,0l10.8-10.8l2.1,2.1c0.2,0.2,0.5,0.2,0.8,0 c0.1-0.1,0.2-0.2,0.2-0.4V9.7L33.5,9.7z M35.3,33.2H2.8V1.4H0.2v34.4h35.1V33.2z"/> </g> <g id="combo" class="st0"> <g class="st3"> <defs> <rect id="SVGID_7_" x="-2.6" y="-6" width="50.2" height="50.2"/> </defs> <clipPath id="SVGID_8_"> <use xlink:href="#SVGID_7_" style="overflow:visible;"/> </clipPath> <path class="st8" d="M29.4,6.3v25.1H35V6.3H29.4z M21,14.7v16.8h5.6V14.7H21z M35.6,33.1H3V1.5H0.2v34.5h35.4L35.6,33.1L35.6,33.1 z M12.7,9.1v22.3h5.6V9.1H12.7L12.7,9.1z M4.3,20.3v11.2h5.6V20.3H4.3z"/> </g> <polyline class="st9" points="6.3,26 15.3,16.4 23.8,26 32.3,13.3 "/> <polyline class="st10" points="6.9,25.3 15.3,16.4 23.8,26 31.8,14 "/> </g> <g id="area" class="st0"> <g class="st3"> <path class="st7" d="M23,18.9L12.8,8.7L4.9,18.9v10.2h29.5l-4.5-15.9L23,18.9z M35.3,33.7l-32.9,0V1.8L0,1.8v34h35.3L35.3,33.7z" /> </g> </g> <g id="Layer_11" class="st0"> <path class="st2" d="M5.5,19.1H0.9c0.7,8.2,7.3,14.7,15.6,15.4v-4.6C10.8,29.3,6.2,24.8,5.5,19.1z M30.3,19.1 c-0.6,5.7-5.2,10.2-11,10.8v4.6c8.3-0.7,15-7.2,15.6-15.4L30.3,19.1L30.3,19.1z M0.9,16.4h4.6c0.6-5.7,5.2-10.2,11-10.8V1 C8.2,1.6,1.6,8.2,0.9,16.4z M19.3,1v4.6c5.8,0.6,10.4,5.1,11,10.8H35C34.3,8.2,27.7,1.6,19.3,1z"/> </g> </svg> '
        }
    },


    download: function (filename, data, mime) {
        var l = highed.dom.cr('a');
        mime = mime || 'application/octet-stream';
        l.download = filename || 'unkown';
        l.href = 'data:' + mime + ',' + encodeURIComponent(data);
        highed.dom.ap(document.body, l);
        l.click();
        document.body.removeChild(l);
    },


    clearObj: function (obj) {
        Object.keys(obj).forEach(function (key) {
            delete obj[key];
        });
    },


    ajax: function (p) {
        var props = highed.merge(
                {
                    url: false,
                    type: 'GET',
                    dataType: 'json',
                    success: false,
                    error: false,
                    data: {},
                    autoFire: true,
                    headers: {}
                },
                p
            ),
            headers = {
                json: 'application/json',
                xml: 'application/xml',
                text: 'text/plain',
                octet: 'application/octet-stream'
            },
            r = new XMLHttpRequest(),
            events = highed.events();

        if (!props.url) {
            return false;
        }

        r.open(props.type, props.url, true);
        r.setRequestHeader('Content-Type', headers[props.dataType] || headers.text);

        Object.keys(props.headers).forEach(function (key) {
            r.setRequestHeader(key, props.headers[key]);
        });

        r.onreadystatechange = function () {
            events.emit('ReadyStateChange', r.readyState, r.status);

            if (r.readyState === 4 && r.status === 200) {
                if (props.dataType === 'json') {
                    try {
                        var json = JSON.parse(r.responseText);
                        if (highed.isFn(props.success)) {
                            props.success(json);
                        }
                        events.emit('OK', json);
                    } catch (e) {
                        console.log('parse error', e);
                        if (highed.isFn(props.error)) {
                            props.error(e.toString(), r.responseText);
                        }
                        events.emit('Error', e.toString(), r.status);
                    }
                } else {
                    if (highed.isFn(props.success)) {
                        props.success(r.responseText);
                    }
                    events.emit('OK', r.responseText);
                }
            } else if (r.readyState === 4) {
                events.emit('Error', r.status, r.statusText);
                if (highed.isFn(props.error)) {
                    props.error(r.status, r.statusText);
                }
            }
        };

        function fire() {
            try {
                r.send(JSON.stringify(props.data));
            } catch (e) {
                r.send(props.data || true);
            }
        }

        if (props.autoFire) {
            fire();
        }

        return {
            on: events.on,
            fire: fire,
            request: r
        };
    },


    uuid: function () {
        var d = new Date().getTime(),
            uuid;

        if (window.performance && typeof window.performance.now === 'function') {
            d += window.performance.now(); // use high-precision timer if available
        }

        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = ((d + Math.random() * 16) % 16) | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    },


    arrToObj: function (arr) {
        var obj = {};

        if ((!highed.isArr(arr) && !highed.isBasic(arr)) || arr === false) {
            return arr;
        }

        if (highed.isStr(arr)) {
            arr = arr.split(' ');
        }

        arr.forEach(function (thing) {
            obj[thing] = true;
        });

        return obj;
    },


    uncamelize: function (str) {
        var s = '';

        if (!str) {
            return str;
        }

        if (str.length < 0 || !str) {
            return str;
        }

        for (var i = 0; i < str.length; i++) {
            if (str[i] === str[i].toUpperCase()) {
                if (
                    (str[i + 1] && str[i + 1] === str[i + 1].toUpperCase()) ||
          (str[i - 1] && str[i - 1] === str[i - 1].toUpperCase())
                ) { // nothing
                } else {
                    s += ' ';
                }
            }
            s += str[i];
        }

        return s[0].toUpperCase() + s.substr(1);
    },


    clamp: function (min, max, value) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    },


    hexToRgb: function (hex) {
        if (!hex || highed.isObj(hex)) {
            return {
                r: 0,
                g: 0,
                b: 0
            };
        }

        if (hex.indexOf('rgba') === 0) {
            hex = hex
                .substr(5)
                .replace(')', '')
                .split(',');
            return {
                r: parseInt(hex[0], 10),
                g: parseInt(hex[1], 10),
                b: parseInt(hex[2], 10),
                a: parseInt(hex[3], 10)
            };
        }

        if (hex.length === 4) {
            hex += hex[hex.length - 1];
            hex += hex[hex.length - 1];
            hex += hex[hex.length - 1];
        }

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } :
            {
                r: 0,
                g: 0,
                b: 0
            };
    },


    invertHexColor: function (hex) {
        var rgb = highed.hexToRgb(hex),
            res = 0;

        rgb.r = 255 - rgb.r;
        rgb.g = 255 - rgb.g;
        rgb.b = 255 - rgb.b;

        res = rgb.r << 16;
        res |= rgb.g << 8;
        res |= rgb.b;

        return '#' + res;
    },

    getContrastedColor: function (hex) {
        var rgb = highed.hexToRgb(hex),
            avarage = (rgb.r + rgb.g + rgb.b) / 3;

        if (avarage > 150) {
            return '#000';
        }
        return '#FFF';
    },


    toBool: function (what) {
        return what === 'true' || what === true || what === 'on';
    },


    setAttr: function (obj, path, value, index) {
        var current = obj;

        if (!current) {
            return;
        }

        if (highed.isArr(obj)) {
            obj.forEach(function (thing) {
                highed.setAttr(thing, path, value, index);
            });
            return;
        }

        path = path
            .replace(/\-\-/g, '.')
            .replace(/\-/g, '.')
            .split('.');

        path.forEach(function (p, i) {
            if (i === path.length - 1) {
                current[p] = value;
            } else {
                if (typeof current[p] === 'undefined') {
                    current = current[p] = {};
                } else {
                    current = current[p];

                    if (highed.isArr(current)) {
                        if (index > current.length - 1) {
                            for (var j = current.length; j <= index; j++) {
                                current.push({});
                            }
                        }
                        if (index >= 0) {
                            current = current[index];
                        }
                    }
                }
            }
        });
    },


    getAttr: function (obj, path, index) {
        var current = obj,
            result;

        if (!current) {
            return result;
        }

        if (highed.isArr(obj)) {
            obj.forEach(function (thing) {
                result = highed.getAttr(thing, path);
            });
            return result;
        }

        path = path
            .replace(/\-\-/g, '.')
            .replace(/\-/g, '.')
            .split('.');

        path.forEach(function (p, i) {
            if (i === path.length - 1) {
                if (typeof current !== 'undefined') {
                    result = current[p];
                }
            } else {
                if (typeof current[p] === 'undefined') {
                    current = current[p] = {};
                } else {
                    current = current[p];

                    // eslint-disable-next-line max-len
                    if (highed.isArr(current) && index >= 0 && index < current.length) {
                        current = current[index];
                    }
                }
            }
        });

        return result;
    },

    isEmptyObjectArray: function (arr) {
        return highed.isObj(arr[0]) && arr.some(function (b) {
            return Object.keys(b).length === 0;
        });
    },

    isObj: function (what) {
        return what && what.constructor.toString().indexOf('Object') > -1;
    },

    merge: function (a, b, ignoreEmpty, excludeMap) {
        if (!a || !b) {
            return a || b;
        }

        if (ignoreEmpty && Object.keys(b).length === 0) {
            return;
        }

        Object.keys(b).forEach(function (bk) {
            if (excludeMap && excludeMap[bk]) {
                // nothing
            } else if (highed.isNull(b[bk]) || highed.isBasic(b[bk])) {
                a[bk] = b[bk];
            } else if (highed.isArr(b[bk])) {

                if (highed.isEmptyObjectArray(b[bk])) {
                    return;
                }
                a[bk] = [];

                b[bk].forEach(function (i) {
                    if (highed.isNull(i) || highed.isBasic(i)) {
                        a[bk].push(i);
                    } else {
                        a[bk].push(highed.merge(highed.isArr(i) ? [] : {}, i));
                    }
                });
            } else if (
                b[bk].tagName &&
        b[bk].appendChild &&
        b[bk].removeChild &&
        b[bk].style
            ) {
                a[bk] = b[bk];
            } else {
                if (ignoreEmpty && Object.keys(b[bk]).length === 0) {
                    return;
                }

                a[bk] = a[bk] || {};
                highed.merge(a[bk], b[bk]);
            }
        });
        return a;
    },


    isNull: function (what) {
        return typeof what === 'undefined' || what === null;
    },


    isStr: function (what) {
        return typeof what === 'string' || what instanceof String;
    },


    isNum: function (what) {
        return !isNaN(parseFloat(what)) && isFinite(what);
    },


    isFn: function (what) {
        return (what && typeof what === 'function') || what instanceof Function;
    },


    isArr: function (what) {
        return (
            !highed.isNull(what) && what.constructor.toString().indexOf('Array') > -1
        );
    },


    isBool: function (what) {
        return what === true || what === false;
    },


    isBasic: function (what) {
        return (
            !highed.isArr(what) &&
      (highed.isStr(what) ||
        highed.isNum(what) ||
        highed.isBool(what) ||
        highed.isFn(what))
        );
    },


    parseCSV: function (inData, delimiter) {
        var isStr = highed.isStr,
            isArr = highed.isArray,
            isNum = highed.isNum,
            csv = inData || '',
            result = [],
            options = {
                delimiter: delimiter
            },
            potentialDelimiters = {
                ',': true,
                ';': true,
                '\t': true
            },
            delimiterCounts = {
                ',': 0,
                ';': 0,
                '\t': 0
            },
            rows;
        // The only thing CSV formats have in common..
        rows = (csv || '').replace(/\r\n/g, '\n').split('\n');

        // If there's no delimiter, look at the first few rows to guess it.

        if (!options.delimiter) {
            rows.some(function (row, i) {
                if (i > 10) {
                    return true;
                }

                var inStr = false,
                    c, cn, cl,
                    token = '';

                for (var j = 0; j < row.length; j++) {
                    c = row[j];
                    cn = row[j + 1];
                    cl = row[j - 1];

                    if (c === '"') {
                        if (inStr) {
                            if (cl !== '"' && cn !== '"') {
                                // The next non-blank character is likely the delimiter.
                                while (cn === ' ') {
                                    cn = row[++j];
                                }

                                if (potentialDelimiters[cn]) {
                                    delimiterCounts[cn]++;
                                    return true;
                                }

                                inStr = false;
                            }
                        } else {
                            inStr = true;
                        }
                    } else if (potentialDelimiters[c]) {
                        if (!isNaN(Date.parse(token))) {
                            // Yup, likely the right delimiter
                            token = '';
                            delimiterCounts[c]++;
                        } else if (!isNum(token) && token.length) {
                            token = '';
                            delimiterCounts[c]++;
                        }
                    } else {
                        token += c;
                    }
                }
            });

            options.delimiter = ';';

            if (
                delimiterCounts[','] > delimiterCounts[';'] &&
        delimiterCounts[','] > delimiterCounts['\t']
            ) {
                options.delimiter = ',';
            }

            if (
                delimiterCounts['\t'] >= delimiterCounts[';'] &&
        delimiterCounts['\t'] >= delimiterCounts[',']
            ) {
                options.delimiter = '\t';
            }
        }

        rows.forEach(function (row, rowNumber) {
            var cols = [],
                inStr = false,
                i = 0,
                j,
                token = '',
                guessedDel,
                c,
                cp,
                cn;

            function pushToken() {
                if (!token.length) {
                    token = null;
                    // return;
                }

                if (isNum(token)) {
                    token = parseFloat(token);
                }

                cols.push(token);
                token = '';
            }

            for (i = 0; i < row.length; i++) {
                c = row[i];
                cn = row[i + 1];
                cp = row[i - 1];

                if (c === '"') {
                    if (inStr) {
                        pushToken();
                    } else {
                        inStr = false;
                    }

                    // Everything is allowed inside quotes
                } else if (inStr) {
                    token += c;
                    // Check if we're done reading a token
                } else if (c === options.delimiter) {
                    pushToken();

                    // Append to token
                } else {
                    token += c;
                }

                // Push if this was the last character
                if (i === row.length - 1) {
                    pushToken();
                }
            }

            result.push(cols);
        });

        return result;
    },

    removeNulls: function (dataSet) {

        const newDataArr = [];
        dataSet.forEach(function (e) {

            var rarr = [],
                hasData = false;

            e.forEach(function (v) {
                if (v) {
                    hasData = true;
                }

                if (!highed.isNum(v) && highed.isStr(v)) {
                    v = v.replace(/\"/g, '"');
                }

                if (highed.isNum(v)) {
                    v = parseFloat(v);
                }

                if (highed.isStr(v) && Date.parse(v) !== NaN) {
                    // v = (new Date(v)).getTime();
                }

                rarr.push(v);
            });

            if (hasData) {
                newDataArr.push(rarr);
            }
        });

        return newDataArr;
    }

};

// Stateful functions
(function () {
    var logLevels = ['error', 'warn', 'notice', 'verbose'],
        currentLogLevel = 0,
        initQueue = [],
        isReady = false,
        includedScripts = {},
        isOnPhone = false,
        isOnTablet = false,
        options = {
            codeMirrorTheme: 'neo',
            helpURL: 'https://www.highcharts.com/products/highcharts-editor',
            defaultLanguage: 'en',
            includeCDNInExport: true,
            stickyChartProperties: {},
            includeHighcharts: true,
            cloudAPIURL: 'https://cloud-api.highcharts.com/',
            helpImgPath: 'help/',
            thumbnailURL: 'https://cloud.highcharts.com/static/thumbnails/',
            autoIncludeDependencies: true
        },
        cdnScripts = [
            'https://code.highcharts.com/stock/highstock.js',
            'https://code.highcharts.com/highcharts-more.js',
            'https://code.highcharts.com/highcharts-3d.js',
            'https://code.highcharts.com/modules/data.js',
            'https://code.highcharts.com/modules/exporting.js'
        ];

    // /////////////////////////////////////////////////////////////////////////

    function pollForReady() {
        if (!isReady) {
            if (document.body) {
                isReady = true;
                initQueue.forEach(function (fn) {
                    fn();
                });
            } else {
                window.setTimeout(pollForReady, 100);
            }
        }
    }

    pollForReady();

    // /////////////////////////////////////////////////////////////////////////


    highed.exposeOption = function (option) {};


    highed.option = function (option, value) {
        if (!highed.isBasic(option)) {
            highed.merge(options, option);
        } else if (options[option]) {
            if (typeof value !== 'undefined') {
                options[option] = value;
            }
            return options[option];
        }
        return false;
    };

    highed.options = function (options) {
        Object.keys(options || {}).forEach(function (key) {
            highed.option(key, options[key]);
        });
    };

    highed.serializeEditorOptions = function () {
        return highed.merge({}, options);
    };

    highed.ready = function (fn) {
        if (highed.isFn(fn)) {
            if (isReady) {
                fn();
            } else {
                initQueue.push(fn);
            }
        }
    };

    highed.log = function (level) {
        var things = Array.prototype.slice.call(arguments);
        things.splice(0, 1);

        if (level <= currentLogLevel) {
            console.log.apply(undefined, [logLevels[level - 1] + ':'].concat(things)); // eslint-disable-line no-console
        }
    };


    highed.setLogLevel = function (level) {
        if (level <= logLevels.length) {
            currentLogLevel = level;
        }
    };


    highed.include = function (what, fn, asCSS) {
        var n;

        if (!highed.isStr(what)) {
            return highed.isFn(fn) && fn();
        }

        function next() {
            if (n < what.length - 1) {
                highed.include(what[++n], next);
            }

            return highed.isFn(fn) && fn();
        }

        if (highed.isArr(what)) {
            n = -1;
            return next();
        }

        if (includedScripts[what]) {
            highed.log(3, 'script already included, skipping:', what);
            return fn();
        }

        highed.log(3, 'including script', what);
        includedScripts[what] = true;

        if (asCSS || what.lastIndexOf('.css') === what.length - 4) {
            n = document.createElement('link');
            n.rel = 'stylesheet';
            n.type = 'text/css';
            n.href = what;
            n.onload = fn;
        } else {
            n = document.createElement('script');
            n.src = what;
            n.onload = fn;
        }

        document.head.appendChild(n);
    };

    highed.getLetterIndex = function (char) {
        return char.charCodeAt() - 65;
    };


    highed.onPhone = function () {
        return isOnPhone;
    };


    highed.onTablet = function () {
        return isOnTablet;
    };

    function checkIfPhone() {
        var check = false;
        (function (a) {
            if (
                // eslint-disable-next-line max-len
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                    a
                ) ||
        // eslint-disable-next-line max-len
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
        )
            ) {
                check = true;
            }
        }(navigator.userAgent || navigator.vendor || window.opera));
        return check;
    }

    function checkIfTabletDimensions() {
        var userAgent =
            navigator.userAgent.toLowerCase();
        // eslint-disable-next-line max-len
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    }

    isOnPhone = checkIfPhone();
    isOnTablet = checkIfTabletDimensions();

    // /////////////////////////////////////////////////////////////////////////

    // Inject dependencies
    highed.ready(function () {
        if (!options.autoIncludeDependencies) {
            return false;
        }

        highed.include(
            'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css'
        );
        highed.include(
            'https://fonts.googleapis.com/css?family=Roboto:400,300,100,700|Source Sans:400,300,100',
            false,
            true
        );
    });

}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

/*
    Note that the localization system uses attribute names
    rather than a default string. This is to make it easier to
    modify translations.

*/

(function () {
    var currentLang = highed.option('defaultLanguage'),
        langTree = {};


    highed.getLocalizedStr = function (id) {
        if (langTree[currentLang]) {
            if (langTree[currentLang][id]) {
                return langTree[currentLang][id];
            }
        } else {
            // The current language is invalid, fall back to 'en'
            if (langTree.en[id]) {
                return langTree.en[id];
            }
        }

        // 404
        return 'bad localized string: ' + id;
    };


    highed.L = highed.getLocalizedStr;


    highed.installLanguage = function (translations) {
        if (translations && translations.language && translations.entries) {
            langTree[translations.language] = translations.entries;
        }
    };


    highed.installLanguageFromURL = function (url, fn) {
        highed.ajax({
            url: url,
            success: function (res) {
                if (res) {
                    if (highed.installLanguage(res)) {
                        return fn && fn(false);
                    }
                    return fn && fn(true);
                }
            },
            error: function (err) {
                return fn && fn(err);
            }
        });
    };


    highed.setLang = function (lang) {
        if (langTree[lang]) {
            currentLang = lang;
            return true;
        }
        return false;
    };
}());

/*

    en Language Pack for the Highcharts Editor

    This file was generated by tools/gen.localization.js from
    en.json, Thu Mar 15 2018 10:04:15 GMT+0100 (CET)

*/

// Install "en" translations
highed.installLanguage({
    language: 'en',
    entries: {
        confirmNewChart:
      'Are you sure you want to abandon the current chart and start over?',
        previewChart: 'Preview Chart',
        newChart: 'New Chart',
        saveProject: 'Save Project',
        loadProject: 'Load Project',
        exportPNG: 'Export as PNG',
        exportJPEG: 'Export as JPEG',
        exportSVG: 'Export as SVG',
        exportPDF: 'Export as PDF',
        loadCloud: 'Load From Cloud',
        saveCloud: 'Save To Cloud',
        help: 'Help',
        licenseInfo: 'License Information',
        stepDone: 'Done',
        stepStart: 'Start',
        stepImport: 'Import',
        stepTemplates: 'Templates',
        stepCustomize: 'Customize',
        stepExport: 'Export',
        stepData: 'Data',
        doneCaption: 'Close & Generate Chart',
        dgDeleteRow: 'Really delete the selected rows?',
        dgWithSelected: 'With Selection:',
        dgImportBtn: 'IMPORT',
        dgExportBtn: 'EXPORT DATA',
        dgNewBtn: 'Clear',
        dgAddRow: 'ADD ROW',
        dgDataImported: 'Data imported',
        dgDataImporting: 'Importing data',
        dgNewCol: 'New Column',
        dgSortAsc: 'Sort Ascending',
        dgSortDec: 'Sort Descending',
        dgSortAscMonth: 'Sort as Month Names Ascending',
        dgSortDecMonth: 'Sort as Month Names Decending',
        dgDelCol: 'Delete Column',
        dgDelColConfirm: 'Really delete the column?',
        dgInsColBefore: 'Insert Column Before',
        dgInsColAfter: 'Insert Column After',
        customizeSimple: 'SIMPLE',
        customizeAdvanced: 'ADVANCED',
        customizeCustomCode: 'CUSTOM CODE',
        customizePreview: 'PREVIEW OPTIONS',
        'option.cat.title': 'Titles',
        'option.cat.chart': 'Chart',
        'option.subcat.dimension': 'Dimensions',
        'option.subcat.title': 'Title',
        'option.subcat.appearance': 'Appearance',
        'option.subcat.tooltip': 'Tooltip',
        'option.subcat.credit': 'Credits',
        'option.subcat.titles': 'Main titles',
        'option.cat.general': 'General',
        'option.subcat.size': 'Chart size',
        'option.subcat.interaction': 'Interaction',
        'option.cat.appearance': 'Appearance',
        'option.subcat.fonts': 'Fonts',
        'option.subcat.titlestyle': 'Title Style',
        'option.subcat.seriescolors': 'Series Colors',
        'option.subcat.chartarea': 'Chart Area',
        'option.subcat.plotarea': 'Plot Area',
        'option.cat.axes': 'Axes',
        'option.subcat.axessetup': 'Axes Setup',
        'option.subcat.xaxis': 'X Axis',
        'option.subcat.yaxis': 'Y Axis',
        'option.cat.series': 'Data Series',
        'option.cat.labels': 'Value Labels',
        'option.subcat.labels': 'Value Labels',
        'option.cat.legend': 'Legend',
        'option.subcat.general': 'General',
        'option.subcat.placement': 'Placement',
        'option.subcat.legendappearance': 'Appearance',
        'option.cat.tooltip': 'Tooltip',
        'option.subcat.colorborder': 'Color and Border',
        'option.cat.export': 'Export',
        'option.cat.exporting': 'Exporting',
        'option.cat.localization': 'Localization',
        'option.subcat.numberformat': 'Number formatting',
        'option.subcat.exportbutton': 'Exporting Menu',
        'option.subcat.zoombutton': 'Zoom button',
        'option.cat.credits': 'Credits',
        'option.series.label': 'Series Labels',
        'option.text.series.label.enabled': 'Series label',
        'option.tooltip.series.label.enabled':
      'Enable or disable the series label. Series labels are placed as close to the series as possible in a natural way, seeking to avoid other series. The goal of this feature is to make the chart more easily readable, like if a human designer placed the labels in the optimal position.',
        'option.text.series.label.style': 'Series label style',
        'options.tooltip.series.label.style': '',
        'option.text.title.text': 'Chart title',
        'option.tooltip.title.text': 'The main chart title.',
        'option.text.subtitle.text': 'Chart subtitle',
        'option.tooltip.subtitle.text':
      'The chart\'s subtitle, normally displayed with smaller fonts below the main title.',
        'option.text.yAxis.title.text': 'Y axis title',
        'option.tooltip.yAxis.title.text':
      'The Y axis title, normally displayed vertically along the Y axis.',
        'option.text.chart.width': 'Chart width',
        'option.tooltip.chart.width':
      'An explicit width for the chart. By default (when <code>null</code>) the width is calculated from the offset width of the containing element.',
        'option.text.chart.height': 'Chart height',
        'option.tooltip.chart.height':
      'An explicit height for the chart. By default (when <code>null</code>) the height is calculated from the offset height of the containing element, or 400 pixels if the containing element\'s height is 0.',
        'option.text.chart.zoomType': 'Allow zooming',
        'option.tooltip.chart.zoomType':
      'Decides in what dimensions the user can zoom by dragging the mouse. Can be one of <code>x</code>, <code>y</code> or <code>xy</code>.',
        'option.text.plotOptions.series.states.inactive.opacity': 'Series Dimming',
        'option.tooltip.plotOptions.series.states.inactive.opacity':
      'Opacity of series elements (dataLabels, line, area).',
        'option.text.chart.polar': 'Polar (radar) projection',
        'option.tooltip.chart.polar':
      'When true, cartesian charts like line, spline, area and column are transformed into the polar coordinate system. Requires <code>highcharts-more.js</code>.',
        'option.text.chart.style': 'Font family',
        'option.tooltip.chart.style': 'The font to use throughout the chart',
        'option.text.title.style': 'Main title style',
        'option.tooltip.title.style': 'Styling for the main chart title',
        'option.text.subtitle.style': 'Subtitle style',
        'option.tooltip.subtitle.style':
      'Styling for the chart\'s subtitle, normally displayed with smaller fonts below the main title',
        'option.text.colors': 'Colors',
        'option.tooltip.colors':
      'Default colors for the data series, or for individual points in a pie series or a column series with individual colors. Colors will be picked in succession. If a color is explicitly set for each series in the <em>Data series</em> view, that color will take precedence.',
        'option.text.chart.backgroundColor': 'Background color',
        'option.tooltip.chart.backgroundColor':
      'Background color for the full chart area',
        'option.text.chart.borderWidth': 'Border width',
        'option.tooltip.chart.borderWidth':
      'The pixel width of the outer chart border.',
        'option.text.chart.borderRadius': 'Border corner radius',
        'option.tooltip.chart.borderRadius':
      'The corner radius of the outer chart border.',
        'option.text.chart.borderColor': 'Border color',
        'option.tooltip.chart.borderColor': 'The color of the outer chart border.',
        'option.text.chart.plotBackgroundColor': 'Background color',
        'option.tooltip.chart.plotBackgroundColor':
      'Background color for the plot area, the area inside the axes',
        'option.text.chart.plotBackgroundImage': 'Background image URL',
        'option.tooltip.chart.plotBackgroundImage':
      'The online URL for an image to use as the plot area background',
        'option.text.chart.plotBorderWidth': 'Border width',
        'option.tooltip.chart.plotBorderWidth':
      'The pixel width of the plot area border.',
        'option.text.chart.plotBorderColor': 'Border color',
        'option.tooltip.chart.plotBorderColor':
      'The color of the inner chart or plot area border.',
        'option.text.chart.inverted': 'Inverted axes',
        'option.tooltip.chart.inverted':
      '<p>Whether to invert the axes so that the x axis is vertical and y axis is horizontal. When true, the x axis is <a href="#xAxis.reversed">reversed</a> by default. If a bar series is present in the chart, it will be inverted automatically.</p>\r\n\r\n<p>Inverting the chart doesn\'t have an effect if there are no cartesian series in the chart, or if the chart is <a href="#chart.polar">polar</a>.</p>',
        'option.text.xAxis.title.style': 'X axis title',
        'option.tooltip.xAxis.title.style': 'Styling and text for the X axis title',
        'option.text.xAxis.title.text': 'Text',
        'option.tooltip.xAxis.title.text':
      'The actual text of the axis title. It can contain basic HTML text markup like &lt;b&gt;, &lt;i&gt; and spans with style.',
        'option.text.xAxis.type': 'Type',
        'option.tooltip.xAxis.type': 'The type of axis',
        'option.text.xAxis.opposite': 'Opposite side of chart',
        'option.tooltip.xAxis.opposite':
      'Whether to display the axis on the opposite side of the normal. The normal is on the left side for vertical axes and bottom for horizontal, so the opposite sides will be right and top respectively. This is typically used with dual or multiple axes.',
        'option.text.xAxis.margin': 'Margin',
        'option.tooltip.xaxis.margin':
      'If there are multiple axes on the same side of the chart, the pixel margin between the axes.',
        'option.text.xAxis.reversed': 'Reversed direction',
        'option.tooltip.xAxis.reversed':
      'Whether to reverse the axis so that the highest number is closest to the origin. If the chart is inverted, the x axis is reversed by default.',
        'option.text.xAxis.labels.format': 'Axis labels format',
        'option.tooltip.xAxis.labels.format':
      '<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p><p><b>Units</b> can be added for example like <code>{value} USD</code>.</p><p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals, or <code>{value:%Y-%m-%d}</code> for a certain time format.',
        'option.text.yAxis.title.style': 'Y axis title style',
        'option.tooltip.yAxis.title.style': 'Styling and text for the X axis title',
        'option.text.yAxis.type': 'Type',
        'option.tooltip.yAxis.type': 'The type of axis',
        'option.text.yAxis.opposite': 'Opposite side of chart',
        'option.tooltip.yAxis.opposite':
      'Whether to display the axis on the opposite side of the normal. The normal is on the left side for vertical axes and bottom for horizontal, so the opposite sides will be right and top respectively. This is typically used with dual or multiple axes.',
        'option.text.yAxis.reversed': 'Reversed direction',
        'option.tooltip.yAxis.reversed':
      'Whether to reverse the axis so that the highest number is closest to the origin. If the chart is inverted, the x axis is reversed by default.',
        'option.text.yAxis.labels.format': 'Axis labels format',
        'option.tooltip.yAxis.labels.format':
      '<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p><p><b>Units</b> can be added for example like <code>{value} USD</code>.</p><p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals, or <code>{value:%Y-%m-%d}</code> for a certain time format.',
        'option.text.series.type': 'Series type',
        'option.tooltip.series.type': 'The type of series',
        'option.text.series.color': 'Color',
        'option.tooltip.series.color':
      'The main color of the series. If no color is given here, the color is pulled from the array of default colors as given in the "Appearance" section.',
        'option.text.series.negativeColor': 'Negative color',
        'option.tooltip.series.negativeColor':
      'The negative color of the series below the threshold. Threshold is default zero, this can be changed in the advanced settings.',
        'option.text.series.colorByPoint': 'Color by point',
        'option.tooltip.series.colorByPoint':
      'Use one color per point. Colors can be changed in the "Appearance" section.',
        'option.text.series.dashStyle': 'Dash style',
        'option.tooltip.series.dashStyle':
      'A name for the dash style to use for the graph. Applies only to series type having a graph, like <code>line</code>, <code>spline</code>, <code>area</code> and <code>scatter</code> in  case it has a <code>lineWidth</code>. The value for the <code>dashStyle</code> include:\r\n\t\t    <ul>\r\n\t\t    \t<li>Solid</li>\r\n\t\t    \t<li>ShortDash</li>\r\n\t\t    \t<li>ShortDot</li>\r\n\t\t    \t<li>ShortDashDot</li>\r\n\t\t    \t<li>ShortDashDotDot</li>\r\n\t\t    \t<li>Dot</li>\r\n\t\t    \t<li>Dash</li>\r\n\t\t    \t<li>LongDash</li>\r\n\t\t    \t<li>DashDot</li>\r\n\t\t    \t<li>LongDashDot</li>\r\n\t\t    \t<li>LongDashDotDot</li>\r\n\t\t    </ul>',
        'option.text.series.marker.enabled': 'Enable markers',
        'option.tooltip.series.marker.enabled':
      'Enable or disable the point marker. If <code>null</code>, the markers are hidden when the data is dense, and shown for more widespread data points.',
        'option.text.series.marker.symbol': 'Marker symbol',
        'option.tooltip.series.marker.symbol':
      '<p>A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are "circle", "square", "diamond", "triangle" and "triangle-down".</p>\r\n\r\n<p>Additionally, the URL to a graphic can be given on this form:  "url(graphic.png)". Note that for the image to be applied to exported charts, its URL needs to be accessible by the export server.</p>\r\n\r\n<p>Custom callbacks for symbol path generation can also be added to <code>Highcharts.SVGRenderer.prototype.symbols</code>. The callback is then used by its method name, as shown in the demo.</p>',
        'option.text.plotOptions.series.dataLabels.enabled':
      'Enable data labels for all series',
        'option.tooltip.plotOptions.series.dataLabels.enabled':
      'Show small labels next to each data value (point, column, pie slice etc)',
        'option.text.plotOptions.series.dataLabels.style': 'Text style',
        'option.tooltip.plotOptions.series.dataLabels.style':
      'Styles for the label.',
        'option.text.legend.enabled': 'Enable legend',
        'option.tooltip.legend.enabled': 'Enable or disable the legend.',
        'option.text.legend.layout': 'Item layout',
        'option.text.legend.labelFormat': 'Label Format',
        'option.tooltip.legend.labelFormat':
      'A format string for each legend label',
        'option.tooltip.legend.layout':
      'The layout of the legend items. Can be one of "horizontal" or "vertical".',
        'option.text.legend.align': 'Horizontal alignment',
        'option.tooltip.legend.align':
      '<p>The horizontal alignment of the legend box within the chart area. Valid values are <code>left</code>, <code>center</code> and <code>right</code>.</p>\r\n\r\n<p>In the case that the legend is aligned in a corner position, the <code>layout</code> option will determine whether to place it above/below or on the side of the plot area.</p>',
        'option.text.legend.x': 'Horizontal offset',
        'option.tooltip.legend.x':
      'The pixel offset of the legend relative to its alignment',
        'option.text.legend.verticalAlign': 'Vertical alignment',
        'option.tooltip.legend.verticalAlign':
      '<p>The vertical alignment of the legend box. Can be one of <code>top</code>, <code>middle</code> or  <code>bottom</code>. Vertical position can be further determined by the <code>y</code> option.</p>\r\n\r\n<p>In the case that the legend is aligned in a corner position, the <code>layout</code> option will determine whether to place it above/below or on the side of the plot area.</p>',
        'option.text.legend.y': 'Vertical offset',
        'option.tooltip.legend.y':
      'The pixel offset of the legend relative to its alignment',
        'option.text.legend.floating': 'Float on top of plot area',
        'option.tooltip.legend.floating':
      'When the legend is floating, the plot area ignores it and is allowed to be placed below it.',
        'option.text.legend.itemStyle': 'Text style',
        'option.tooltip.legend.itemStyle':
      'CSS styles for each legend item. Only a subset of CSS is supported, notably those options related to text.',
        'option.text.legend.itemHiddenStyle': 'Text style hidden',
        'option.tooltip.legend.itemHiddenStyle':
      'CSS styles for each legend item when the corresponding series or point is hidden. Only a subset of CSS is supported, notably those options related to text. Properties are inherited from <code>style</code> unless overridden here.',
        'option.text.legend.backgroundColor': 'Background color',
        'option.tooltip.legend.backgroundColor':
      'The background color of the legend.',
        'option.text.legend.borderWidth': 'Border width',
        'option.tooltip.legend.borderWidth':
      'The width of the drawn border around the legend.',
        'option.text.legend.borderRadius': 'Border corner radius',
        'option.tooltip.legend.borderRadius':
      'The border corner radius of the legend.',
        'option.text.legend.borderColor': 'Border color',
        'option.tooltip.legend.borderColor':
      'The color of the drawn border around the legend.',
        'option.text.tooltip.enabled': 'Enable tooltip',
        'option.tooltip.tooltip.enabled':
      'Enable or disable the tooltip. The tooltip is the information box that appears on mouse-over or touch on a point.',
        'option.text.tooltip.shared': 'Shared between series',
        'option.tooltip.tooltip.shared':
      'When the tooltip is shared, the entire plot area will capture mouse movement or touch events. Tooltip texts for series types with ordered data (not pie, scatter, flags etc) will be shown in a single bubble. This is recommended for single series charts and for tablet/mobile optimized charts.',
        'option.text.tooltip.backgroundColor': 'Background color',
        'option.tooltip.tooltip.backgroundColor':
      'The background color of the tooltip',
        'option.text.tooltip.valueSuffix': 'Value Suffix',
        'option.tooltip.tooltip.valueSuffix':
      'A string to append to each series y value',
        'option.text.tooltip.borderWidth': 'Border width',
        'option.tooltip.tooltip.borderWidth':
      '<p>The pixel width of the tooltip border.</p>\r\n\r\n<p>In <a href="https://www.highcharts.com/docs/chart-design-and-style/style-by-css">styled mode</a>, the stroke width is set in the <code>.highcharts-tooltip-box</code> class.</p>',
        'option.text.tooltip.borderRadius': 'Border corner radius',
        'option.tooltip.tooltip.borderRadius':
      'The radius of the rounded border corners.',
        'option.text.tooltip.borderColor': 'Border color',
        'option.tooltip.tooltip.borderColor':
      'The border color of the tooltip. If no color is given, the corresponding series color is used.',
        'option.text.exporting.enabled': 'Enable exporting',
        'option.tooltip.exporting.enabled':
      'Enable the context button on the top right of the chart, allowing end users to download image exports.',
        'option.text.exporting.sourceWidth': 'Exported width',
        'option.tooltip.exporting.sourceWidth':
      'The width of the original chart when exported. The pixel width of the exported image is then multiplied by the <em>Scaling factor</em>.',
        'option.text.exporting.scale': 'Scaling factor',
        'option.tooltip.exporting.scale':
      'The export scale. Note that this is overridden if width is set.',
        'option.text.exporting.offlineExporting': 'Offline Exporting',
        'option.tooltip.exporting.offlineExporting':
      'The offline-exporting module allows for image export of charts without sending data to an external server',
        'option.text.lang.decimalPoint': 'Decimal point',
        'option.tooltip.lang.decimalPoint':
      'The decimal point used for all numbers',
        'option.text.lang.thousandsSep': 'Thousands separator',
        'option.tooltip.lang.thousandsSep':
      'The thousands separator used for all numbers',
        'option.text.lang.contextButtonTitle': 'Context button title',
        'option.tooltip.lang.contextButtonTitle':
      'Exporting module menu. The tooltip title for the context menu holding print and export menu items.',
        'option.text.lang.printChart': 'Print chart',
        'option.tooltip.lang.printChart':
      'Exporting module only. The text for the menu item to print the chart.',
        'option.text.lang.downloadPNG': 'Download PNG',
        'option.tooltip.lang.downloadPNG':
      'Exporting module only. The text for the PNG download menu item.',
        'option.text.lang.downloadJPEG': 'Download JPEG',
        'option.tooltip.lang.downloadJPEG':
      'Exporting module only. The text for the JPEG download menu item.',
        'option.text.lang.downloadPDF': 'Download PDF',
        'option.tooltip.lang.downloadPDF':
      'Exporting module only. The text for the PDF download menu item.',
        'option.text.lang.downloadSVG': 'Download SVG',
        'option.tooltip.lang.downloadSVG':
      'Exporting module only. The text for the SVG download menu item.',
        'option.text.lang.resetZoom': 'Reset zoom button',
        'option.tooltip.lang.resetZoom':
      'The text for the label appearing when a chart is zoomed.',
        'option.text.credits.enabled': 'Enable credits',
        'option.tooltip.credits.enabled': 'Whether to show the credits text',
        'option.text.credits.text': 'Credits text',
        'option.tooltip.credits.text': 'The text for the credits label',
        'option.text.credits.href': 'Link',
        'option.tooltip.credits.href': 'The URL for the credits label'
    }
});

/** *****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.dom = {

    isVisible: function (node) {
        var style = window.getComputedStyle(node);
        return style.display !== 'none';
    },


    ap: function (target) {
        var children = Array.prototype.slice.call(arguments);
        children.splice(0, 1);

        target = highed.dom.get(target);

        if (!highed.isNull(target) && typeof target.appendChild !== 'undefined') {
            children.forEach(function (child) {
                if (highed.isArr(child)) {
                    child.forEach(function (sc) {
                        highed.dom.ap(target, sc);
                    });
                } else if (
                    typeof child !== 'undefined' &&
          typeof child.appendChild !== 'undefined'
                ) {
                    target.appendChild(child);
                } else if (child !== false) {
                    highed.log(1, 'child is not valid (highed.dom.ap)');
                }
            });
        } else {
            highed.log(1, 'target is not a valid DOM node (highed.dom.ap)');
        }

        return target;
    },


    options: function (select, options, selected) {
        if (highed.isNull(options)) { // nothing
        } else if (highed.isArr(options)) {
            options.forEach(function (option) {
                highed.dom.ap(select, highed.dom.cr('option', '', option, option));
            });

            if (selected) {
                select.selectedIndex = selected;
            }
        } else if (highed.isStr(options)) {
            try {
                highed.dom.options(select, JSON.parse(options));
            } catch (e) {
                highed.log(e + ' in highed.options (json parser)');
            }
        } else {
            Object.keys(options).forEach(function (key) {
                highed.dom.ap(select, highed.dom.cr('option', '', options[key], key));
            });
        }
    },

    showOnHover: function (parent, child) {
        if (highed.isArr(child)) {
            child.forEach(function (c) {
                highed.dom.showOnHover(parent, c);
            });
            return;
        }

        highed.dom.on(parent, 'mouseover', function () {
            highed.dom.style(child, {
                // display: 'block',
                opacity: 1,
                //  background: 'rgba(46, 46, 46, 0.85)',
                'pointer-events': 'auto'
            });
        });

        highed.dom.on(parent, 'mouseout', function () {
            highed.dom.style(child, {
                // display: 'none',
                opacity: 0,
                // background: 'rgba(0, 0, 0, 0)',
                'pointer-events': 'none'
            });
        });
    },


    cr: function (type, cssClass, innerHTML, id) {
        var res = false;

        if (typeof type !== 'undefined') {
            res = document.createElement(type);

            if (typeof cssClass !== 'undefined') {
                res.className = cssClass;
            }
            if (typeof innerHTML !== 'undefined' && typeof innerHTML !== 'object') {
                res.innerHTML = innerHTML;
            }

            if (typeof id !== 'undefined') {
                res.id = id;
            }
        } else {
            highed.log(1, 'no node type supplied (highed.dom.cr');
        }

        return res;
    },


    style: function (nodes, style) {
        if (highed.isArr(nodes)) {
            nodes.forEach(function (node) {
                highed.dom.style(node, style);
            });
            return nodes;
        }

        if (nodes && nodes.style) {
            Object.keys(style).forEach(function (p) {
                nodes.style[p] = style[p];
            });
            return nodes;
        }
        return false;
    },

    on: function (target, event, callback, context) {
        var s = [];

        if (!target) {
            return function () {};
        }

        if (highed.isArr(event)) {
            event.forEach(function (event) {
                s.push(highed.dom.on(target, event, callback, context));
            });

            return function () {
                s.forEach(function (f) {
                    f();
                });
            };
        }

        if (target === document.body && event === 'resize') {
            // Need some special magic here eventually.
        }

        if (target && target.forEach) {
            target.forEach(function (t) {
                s.push(highed.dom.on(t, event, callback));
            });
        }

        if (s.length > 0) {
            return function () {
                s.forEach(function (f) {
                    f();
                });
            };
        }

        function actualCallback() {
            if (highed.isFn(callback)) {
                return callback.apply(context, arguments);
            }

        }

        if (target.addEventListener) {
            target.addEventListener(event, actualCallback, false);
        } else {
            target.attachEvent('on' + event, actualCallback, false);
        }

        return function () {
            if (window.removeEventListener) {
                target.removeEventListener(event, actualCallback, false);
            } else {
                target.detachEvent('on' + event, actualCallback);
            }
        };
    },

    nodefault: function (e) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    },


    val: function (node, value) {
        if (node.tagName === 'SELECT') {
            if (node.selectedIndex >= 0) {
                if (!highed.isNull(value)) {
                    for (var i = 0; i < node.options.length; i++) {
                        if (node.options[i].id === value) {
                            node.selectedIndex = i;
                            break;
                        }
                    }
                }
                return node.options[node.selectedIndex].id;
            }
        } else if (node.tagName === 'INPUT') {
            if (node.type === 'checkbox') {
                if (!highed.isNull(value)) {
                    node.checked = highed.toBool(value);
                }
                return node.checked;
            }
            if (!highed.isNull(value)) {
                node.value = value;
            }
            return node.value;
        } else {
            if (!highed.isNull(value)) {
                node.innerHTML = value;
            }
            return node.innerText;
        }

        return false;
    },


    size: function (node) {
        return {
            w: node.clientWidth,
            h: node.clientHeight
        };
    },


    pos: function (node, abs) {
        var x = 0,
            y = 0;

        if (abs) {
            var b = node.getBoundingClientRect();

            return {
                x: b.left + (window.scrollX || 0),
                y: b.top + (window.scrollY || 0)
            };
        }

        return {
            x: node.offsetLeft,
            y: node.offsetTop
        };
    },


    get: function (node) {
        if (node && node.appendChild) {
            return node;
        }
        return document.getElementById(node) || false;
    }
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.events = function () {
    var callbacks = {},
        listenerCounter = 0;


    function on(event, callback, context) {
        var id = ++listenerCounter;

        if (highed.isArr(callback)) {
            return callback.forEach(function (cb) {
                on(event, cb, context);
            });
        }

        callbacks[event] = callbacks[event] || [];

        callbacks[event].push({
            id: id,
            fn: callback,
            context: context
        });

        return function () {
            callbacks[event] = callbacks[event].filter(function (e) {
                return e.id !== id;
            });
        };
    }

    return {
        on: on,


        emit: function (event) {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);

            if (typeof callbacks[event] !== 'undefined') {
                callbacks[event].forEach(function (event) {
                    if (highed.isFn(event.fn)) {
                        event.fn.apply(event.context, args);
                    }
                });

                return callbacks[event].length;
            }
            return 0;
        }
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

/**
 * @ignore
 */
highed.ready(function () {
    var uploader = highed.dom.cr('input'),
        cb = false;

    uploader.type = 'file';
    uploader.accept = '.csv';

    highed.dom.ap(document.body, uploader);

    highed.dom.style(uploader, {
        display: 'none'
    });


    highed.readLocalFile = function (props) {
        var p = highed.merge(
            {
                type: 'text',
                multiple: false,
                accept: '.csv'
            },
            props
        );

        uploader.accept = p.accept;

        if (highed.isFn(cb)) {
            return cb();
        }

        cb = highed.dom.on(uploader, 'change', function () {
            function crReader(file) {
                var reader = new FileReader();

                reader.onloadstart = function (evt) {
                    if (highed.isFn(p.progress)) {
                        p.progress(Math.round(evt.loaded / evt.total * 100));
                    }
                };

                reader.onload = function (event) {
                    var data = reader.result;

                    if (p.type === 'json') {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            if (highed.isFn(p.error)) {
                                p.error(e);
                            }
                        }
                    }

                    if (highed.isFn(p.success)) {
                        p.success({
                            filename: file.name,
                            size: file.size,
                            data: data
                        });
                    }
                };

                return reader;
            }

            for (var i = 0; i < uploader.files.length; i++) {
                if (!p.type || p.type === 'text' || p.type === 'json') {
                    crReader(uploader.files[i]).readAsText(uploader.files[i]);
                } else if (p.type === 'binary') {
                    // eslint-disable-next-line max-len
                    crReader(uploader.files[i]).readAsBinaryString(uploader.files[i]);
                } else if (p.type === 'b64') {
                    // eslint-disable-next-line max-len
                    crReader(uploader.files[i]).readAsDataURL(uploader.files[i]);
                }
            }
            // eslint-disable-next-line node/callback-return
            cb();
            uploader.value = '';
        });

        uploader.multiple = p.multiple;

        uploader.click();
    };
});

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.templates = {};

(function () {
    /* Templates */
    var templates = {},
        mostPopularTemplates = {};


    highed.templates.add = function (type, def) {
        var properties = highed.merge(
            {
                title: '',
                description: '',
                constructor: '',
                thumbnail: '',
                icon: '',
                sampleSets: [],
                validator: false,
                config: {}
            },
            def
        );

        if (!highed.isBasic(type)) {
            return false;
        }

        templates[type] = templates[type] || {
            description: '',
            icon: '',
            sampleData: [],
            templates: {}
        };

        if (properties.title.length) {
            if (properties.popular) {
                properties.parent = type;
                mostPopularTemplates[type] = properties;
            }

            if (properties.icon) {
                templates[type].icon = properties.icon;
            }
            templates[type].templates[properties.title] = properties;
            highed.log(4, '[templateman] - added template', properties.title);
            return true;
        }

        return false;
    };


    highed.templates.each = function (fn) {
        if (highed.isFn(fn)) {
            Object.keys(templates).forEach(function (cat) {
                Object.keys(templates[cat].templates).forEach(function (id) {
                    fn(cat, templates[cat].templates[id]);
                });
            });
        }
    };


    highed.templates.eachInCategory = function (cat, fn) {
        if (highed.isFn(fn) && templates[cat]) {
            Object.keys(templates[cat].templates).forEach(function (id) {
                fn(templates[cat].templates[id]);
            });
        }
    };


    highed.templates.getAllInCat = function (cat) {
        return templates[cat] ? templates[cat].templates : false;
    };


    highed.templates.getCatInfo = function (cat) {
        return highed.merge(
            {
                id: cat
            },
            templates[cat] || {}
        );
    };


    highed.templates.getMostPopular = function () {
        return mostPopularTemplates;
    };

    /**
     * Get a list of id/title pairs for templates
     */
    highed.templates.getCatArray = function () {
        return Object.keys(templates).map(function (cat) {
            return {
                id: cat,
                title: cat,
                icon: templates[cat].icon
            };
        });
    };


    highed.templates.addCategory = function (id, meta) {
        templates[id] = templates[id] || {
            templates: {}
        };

        highed.merge(templates[id], meta, false, { templates: 1 });
    };


    highed.templates.eachCategory = function (fn) {
        if (highed.isFn(fn)) {
            Object.keys(templates).forEach(function (id) {
                fn(id, templates[id]);
            });
        }
    };


    highed.templates.flush = function () {
        templates = {};
    };

    highed.templates.addType = function (type, title) {
        if (typeof templates === 'undefined') {
            templates = {};
        }

        if (typeof templates[type] === 'undefined') {
            templates[type] = {
                title: title,
                templates: {}
            };
        }
    };


    highed.templates.addMultiple = function (templates) {
        if (typeof templates === 'undefined') {
            templates = {};
        }

        if (highed.isArr(templates)) {
            templates.forEach(function (template) {
                if (template.type && template.template) {
                    highed.installTemplate(template.type, template.template);
                }
            });
        }
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

// There be dragons here...
(function () {
    var hasTransformedAdvanced = false;

    function mergeAdv(superset, dest, src, trigger) {
        var path = src.split('.'),
            current = superset,
            seriesNames = {
                pie: true,
                line: true
            };

        // console.log(
        //     'extending',
        //     (dest.meta.ns ? dest.meta.ns + '.' : '') + dest.meta.name,
        //     'with',
        //     src
        // );

        path.some(function (p) {
            if (current.subtree[p]) {
                current = current.subtree[p];
            } else {
                // console.log(
                //     'unable to resolve path for merge:',
                //     src,
                //     'from',
                //     dest.meta.name
                // );

                current = false;
                return true;
            }
        });

        // Stop from trying to extend this multiple times
        dest.meta.extends = dest.meta.extends.replace(src, '');

        if (current) {
            // Extend the source if needed
            extend(superset, current);

            // Unfortunatly we need to take series into special consideration
            // until we have a more robust way of handling its meta
            if (trigger && trigger.indexOf('series') === 0) {
                Object.keys(current.subtree || {}).forEach(function (key) {
                    dest.subtree[key] =
            dest.subtree[key] || highed.merge({}, current.subtree[key]);
                    dest.subtree[key].meta.validFor =
            dest.subtree[key].meta.validFor || {};

                    if (
                        dest.meta.excludes &&
            Object.keys(dest.meta.excludes).length > 0
                    ) {
                        // eslint-disable-next-line max-len
                        dest.subtree[key].meta.validFor[current.meta.name] = !dest.meta
                            .excludes[key];
                    } else {
                        dest.subtree[key].meta.validFor[current.meta.name] = 1;
                    }
                });

            } else if ((trigger && trigger.indexOf('plotOptions') === 0) || dest.meta.ns === undefined) {
                if (!dest.meta.validFor) {
                    dest.meta.validFor = {};
                }
                dest.meta.validFor[dest.meta.name] = 1;

                if (dest.meta.ns === undefined) {
                    // eslint-disable-next-line max-len
                    highed.merge(dest.subtree, current.subtree, false, dest.meta.excludes);
                } else {
                    Object.keys(current.subtree || {}).forEach(function (key) {
                        dest.subtree[key] =
              dest.subtree[key] || highed.merge({}, current.subtree[key]);
                        dest.subtree[key].meta.validFor =
              dest.subtree[key].meta.validFor || {};

                        if (
                            dest.meta.excludes &&
              Object.keys(dest.meta.excludes).length > 0
                        ) {
                            // eslint-disable-next-line max-len
                            dest.subtree[key].meta.validFor[current.meta.name] = !dest.meta
                                .excludes[key];
                        } else {
                            // eslint-disable-next-line max-len
                            dest.subtree[key].meta.validFor[current.meta.name] = 1;
                        }
                    });
                }

            } else {
                // Do actual extending
                // eslint-disable-next-line max-len
                highed.merge(dest.subtree, current.subtree, false, dest.meta.excludes);
            }
        }
    }


    function extend(superset, node, trigger) {
        if (trigger === undefined) {
            if (node.meta.ns && node.meta.ns === 'plotOptions') {
                trigger = 'plotOptions';
            }
        }
        if (node.meta.extends && node.meta.extends.length > 0) {
            node.meta.extends = node.meta.extends.replace('{', '').replace('}', '');
            if (trigger === 'series') {
                node.meta.extends += ',plotOptions.line';
            }

            node.meta.extends.split(',').forEach(function (part) {
                if (part && part.length > 0) {
                    mergeAdv(superset, node, part.trim(), trigger);
                }
            });
        }
    }


    function transformAdv(input, onlyOnce) {
        var res;

        if (onlyOnce && hasTransformedAdvanced) {
            return input;
        }

        function visit(node, pname) {
            var children = (node.subtree = node.subtree || {});

            node.meta = node.meta || {};
            // eslint-disable-next-line no-unused-expressions
            node.meta.default;
            node.meta.ns = pname;
            node.children = [];

            // Take care of merging
            extend(input, node, (pname ? pname + '.' : '') + node.meta.name);

            node.meta.hasSubTree = false;

            node.children = [];

            Object.keys(children).forEach(function (child) {
                if (Object.keys(children[child].subtree).length > 0) {
                    node.meta.hasSubTree = true;
                }

                node.children.push(
                    visit(
                        children[child],
                        (pname ? pname + '.' : '') + (node.meta.name || '')
                    )
                );
            });

            node.children.sort(function (a, b) {
                return a.meta.name.localeCompare(b.meta.name);
            });

            if (node.children.length === 0) {
                node.meta.leafNode = true;
            }

            return node;
        }

        // console.time('tree transform');
        res = visit(input);
        // console.timeEnd('tree transform');

        return res;
    }

    // Removes all empty objects and arrays from the input object
    function removeBlanks(input) {
        function rewind(stack) {
            if (!stack || stack.length === 0) {
                return;
            }

            var t = stack.pop();

            if (Object.keys(t).length === 0) {
                rewind(stack);
            } else {
                Object.keys(t || {}).forEach(function (key) {
                    var child = t[key];

                    if (key[0] === '_') {
                        delete t[key];
                    } else if (
                        child &&
            !highed.isBasic(child) &&
            !highed.isArr(child) &&
            Object.keys(child).length === 0
                    ) {
                        delete t[key];
                    } else if (highed.isArr(child) && child.length === 0) {
                        delete t[key];
                    } else if (highed.isArr(child)) {
                        child = child.map(function (sub) {
                            return removeBlanks(sub);
                        });
                    }
                });
            }

            rewind(stack);
        }

        function visit(node, parentStack) {
            parentStack = parentStack || [];

            if (node) {
                if (parentStack && Object.keys(node).length === 0) {
                    rewind(parentStack.concat([node]));
                } else {
                    Object.keys(node).forEach(function (key) {
                        var child = node[key];
                        if (key[0] === '_') {
                            rewind(parentStack.concat([node]));
                        // eslint-disable-next-line max-len
                        } else if (!highed.isBasic(child) && !highed.isArr(child)) {
                            visit(child, parentStack.concat([node]));
                        }
                    });
                }
            }
        }

        visit(input);
        return input;
    }

    highed.transform = {
        advanced: transformAdv,
        remBlanks: removeBlanks
    };
}());

/** *****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    // Samples, keyed on ID
    var samples = {};

    highed.samples = {

        add: function (sample) {
            var options = highed.merge(
                {
                    title: 'Untitled Sample',
                    description: 'Untitled Sample',
                    dataset: [],
                    suitableSeries: false,
                    products: false
                },
                sample
            );

            if (options.id && !samples[options.id]) {
                samples[options.id] = options;
                return true;
            }

            return false;
        },


        each: function (fn, productFilter, typeFilter) {
            if (highed.isFn(fn)) {
                Object.keys(samples).forEach(function (id) {
                    fn(samples[id]);
                });
            }
        },


        get: function (id) {
            return samples[id] || false;
        }
    };
}());

/** *****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

/* Keeps track of validations */

(function () {
    // Keyed on ID
    var validators = {};

    highed.validators = {

        add: function (id, fn) {
            if (id && !validators[id] && highed.isFn(fn)) {
                validators[id] = fn;
                return true;
            }

            return false;
        },


        validate: function (id, chart) {
            return validators[id] ? validators[id](chart) : true;
        }
    };
}());

/** *****************************************************************************

Copyright (c) 2017-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 *******************************************************************************/

// @format

(function () {
    var token = false,
        url = highed.option('cloudAPIURL');

    // Set up namespace for the cloud API
    highed.cloud = {};

    highed.cloud.isLoggedIn = function () {
        return token !== false;
    };

    highed.cloud.login = function (username, password, fn) {
        url = highed.option('cloudAPIURL');

        highed.ajax({
            url: url + 'login',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                if (data && data.token) {
                    token = data.token;
                }
                return highed.isFn(fn) && fn(typeof data.token === 'undefined', data);
            },
            error: function (err) {
                return highed.isFn(fn) && fn(err);
            }
        });
    };

    highed.cloud.getTeams = function (fn) {
        url = highed.option('cloudAPIURL');

        highed.ajax({
            url: url + 'teams',
            type: 'get',
            headers: {
                'X-Auth-Token': token
            },
            success: function (data) {
                if (data.error) {
                    return highed.snackBar(data.message);
                }
                return highed.isFn(fn) && fn(data);
            }
        });
    };

    highed.cloud.getCharts = function (teamID, fn, page) {
        url = highed.option('cloudAPIURL');

        highed.ajax({
            url: url + 'team/' + teamID + '/charts/?page=' + page,
            type: 'get',
            headers: {
                'X-Auth-Token': token
            },
            success: function (data) {
                if (data.error) {
                    return highed.snackBar(data.message);
                }
                return highed.isFn(fn) && fn(data.data, data);
            }
        });
    };

    highed.cloud.getChart = function (teamID, chartID, fn) {
        url = highed.option('cloudAPIURL');

        highed.ajax({
            url: url + 'team/' + teamID + '/chart/' + chartID,
            type: 'get',
            headers: {
                'X-Auth-Token': token
            },
            success: function (data) {
                if (data.error) {
                    return highed.snackBar(data.message);
                }
                return highed.isFn(fn) && fn(data);
            }
        });
    };

    highed.cloud.saveExistingChart = function (teamID, chartID, chart, fn) {
        url = highed.option('cloudAPIURL');

        highed.ajax({
            url: url + 'team/' + teamID + '/chart/' + chartID,
            type: 'post',
            headers: {
                'X-Auth-Token': token
            },
            data: {
                data: chart
            },
            success: function (data) {
                if (data.error) {
                    return highed.snackbar(data.message);
                }
                return highed.isFn(fn) && fn(data);
            }
        });
    };

    highed.cloud.saveNewChart = function (teamID, name, chart, fn) {
        url = highed.option('cloudAPIURL');

        highed.ajax({
            url: url + 'team/' + teamID + '/chart',
            type: 'post',
            headers: {
                'X-Auth-Token': token
            },
            data: {
                name: name,
                data: chart
            },
            success: function (data) {
                if (data.error) {
                    return highed.snackbar(data.message);
                }
                return highed.isFn(fn) && fn(data);
            }
        });
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var events = highed.events();
    highed.on = events.on;
    highed.emit = events.emit;
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {

    highed.showDimmer = function (fn, autohide, transparent, zIndex) {
        var dimmer = highed.dom.cr('div', 'highed-dimmer'),
            unbinder = false;

        highed.dom.ap(document.body, dimmer);

        highed.dom.style(dimmer, {
            opacity: 0.4,
            'pointer-events': 'auto',
            'z-index': 9999 + (zIndex || 0)
        });

        if (transparent) {
            highed.dom.style(dimmer, {
                opacity: 0
            });
        }

        function hide() {
            highed.dom.style(dimmer, {
                opacity: 0,
                'pointer-events': 'none'
            });

            if (highed.isFn(unbinder)) {
                unbinder();
                unbinder = false;
            }

            window.setTimeout(function () {
                if (dimmer.parentNode) {
                    dimmer.parentNode.removeChild(dimmer);
                }
            }, 300);
        }

        unbinder = highed.dom.on(dimmer, 'click', function (e) {
            if (highed.isFn(fn)) {
                fn();
            }

            if (autohide) {
                hide();
            }
        });

        return hide;
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.OverlayModal = function (contents, attributes) {
    var container = highed.dom.cr('div', 'highed-overlay-modal '),
        events = highed.events(),
        properties = highed.merge(
            {
                width: 200,
                height: 200,
                minWidth: 10,
                minHeight: 10,
                showOnInit: true,
                zIndex: 10000,
                showCloseIcon: false,
                cancelButton: false
            },
            attributes
        ),
        hideDimmer = false,
        visible = false;

    if (properties.class) {
        container.classList += properties.class;
    }

    // /////////////////////////////////////////////////////////////////////////


    function resize(width, height) {
        properties.minWidth = width;
        properties.minHeight = height;
    }

    function show() {
        if (visible) {
            return;
        }
        highed.dom.style(container, {
            width:
        properties.width +
        (properties.width.toString().indexOf('%') > 0 ? '' : 'px'),
            height:
        properties.height +
        (properties.height.toString().indexOf('%') > 0 ? '' : 'px'),
            opacity: 1,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            'pointer-events': 'auto',
            'min-width': properties.minWidth + 'px',
            'min-height': properties.minHeight + 'px',
            'z-index': properties.zIndex
        });

        highed.dom.style(document.body, {
            'overflow-x': 'hidden',
            'overflow-y': 'hidden'
        });

        if (properties.showCloseIcon) {
            const icon = highed.dom.cr('span', 'highed-overlaymodal-close', '<i class="fa fa-times" aria-hidden="true"></i>');
            highed.dom.on(icon, 'click', function () {
                hide();
            });
            highed.dom.ap(container, icon);
        }

        hideDimmer = highed.showDimmer(
            hide,
            true,
            false,
            properties.zIndex - 10000
        );

        window.setTimeout(function () {
            events.emit('Show');
        }, 300);

        visible = true;
    }


    function hide(suppress) {
        if (!visible) {
            return;
        }

        highed.dom.style(container, {
            width: '0px',
            height: '0px',
            opacity: 0,
            left: '-20000px',
            'pointer-events': 'none'
        });

        highed.dom.style(document.body, {
            'overflow-x': '',
            'overflow-y': ''
        });

        if (highed.isFn(hideDimmer)) {
            hideDimmer();
        }

        visible = false;

        if (!suppress) {
            events.emit('Hide');
        }
    }

    // /////////////////////////////////////////////////////////////////////////

    highed.ready(function () {
        highed.dom.ap(document.body, container);
    });

    if (contents) {
    // if (highed.isStr(contents)) {
    //    contents = highed.dom.cr('div', '', contents);
    // }
    // highed.dom.ap(container,
    //    contents
    // );
    }

    hide(true);

    // /////////////////////////////////////////////////////////////////////////

    // Public interface
    return {
        on: events.on,
        show: show,
        hide: hide,
        resize: resize,

        body: container
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.HSplitter = function (parent, attributes) {
    var properties = highed.merge(
            {
                leftWidth: 40,
                noOverflow: false,
                leftClasses: '',
                rightClasses: '',
                allowResize: false,
                responsive: false,
                leftMax: false,
                rightMax: false
            },
            attributes
        ),
        container = highed.dom.cr('div', 'highed-hsplitter'),
        left = highed.dom.cr(
            'div',
            'highed-scrollbar panel left ' + properties.leftClasses
        ),
        right = highed.dom.cr(
            'div',
            'highed-scrollbar panel right ' + properties.rightClasses
        ),
        leftBody = highed.dom.cr(
            'div',
            'highed-scrollbar highed-hsplitter-body ' + properties.leftClasses
        ),
        rightBody = highed.dom.cr(
            'div',
            'highed-scrollbar highed-hsplitter-body ' + properties.rightClasses
        ),
        resizeBar = highed.dom.cr('div', 'highed-hsplitter-resize-bar'),
        mover;

    if (properties.responsive) {
        left.className += ' highed-hsplitter-body-responsive';
    }

    // /////////////////////////////////////////////////////////////////////////

    function updateSizeFromMover(x) {
        var psize;

        if (properties.allowResize && highed.dom.isVisible(right)) {
            psize = highed.dom.size(container);
            x = x || highed.dom.pos(resizeBar).x;

            highed.dom.style(left, {
                width: x + 'px'
            });

            highed.dom.style(right, {
                width: psize.w - x + 'px'
            });

            highed.dom.style(resizeBar, {
                display: ''
            });
        }
    }


    function resize(w, h) {
        var s = highed.dom.size(parent),
            st,
            ps;

        // Check if the right side is visible
        if (!highed.dom.isVisible(right)) {
            highed.dom.style(left, {
                width: '100%'
            });

            highed.dom.style(resizeBar, {
                display: 'none'
            });
        } else {
            resetSize();
        }

        if (properties.responsive) {
            st = window.getComputedStyle(left);
            if (st.float === 'none') {
                highed.dom.style(right, {
                    width: '100%'
                });

                highed.dom.style(resizeBar, {
                    display: 'none'
                });
            } else {
                resetSize();
            }
        }

        highed.dom.style([left, right, container, resizeBar], {
            height: (h || s.h) + 'px'
        });

        if (properties.rightMax) {
            highed.dom.style(right, {
                'max-width': properties.rightMax + 'px'
            });
        }

        if (properties.leftMax) {
            highed.dom.style(left, {
                'max-width': properties.leftMax + 'px'
            });
        }

        // If we're at right max, we need to resize the left panel
        ps = highed.dom.size(left);
        if (ps.w === properties.leftMax) {
            highed.dom.style(right, {
                width: s.w - properties.leftMax - 1 + 'px'
            });
        }

        updateSizeFromMover();
    }

    function resetSize() {
        highed.dom.style(left, {
            width: properties.leftWidth + '%'
        });

        highed.dom.style(right, {
            width: (properties.rightWidth ? properties.rightWidth : 100 - properties.leftWidth) + '%'
        });
    }

    // /////////////////////////////////////////////////////////////////////////

    parent = highed.dom.get(parent);

    highed.dom.ap(
        highed.dom.get(parent),
        highed.dom.ap(
            container,
            highed.dom.ap(left, leftBody),
            highed.dom.ap(right, rightBody)
        )
    );

    resetSize();

    if (properties.noOverflow) {
        highed.dom.style([container, left, right], {
            'overflow-y': 'hidden'
        });
    }

    if (properties.allowResize) {
        highed.dom.ap(container, resizeBar);

        highed.dom.style(resizeBar, {
            left: properties.leftWidth + '%'
        });

        mover = highed.Movable(resizeBar, 'x').on('Moving', function (x) {
            updateSizeFromMover(x);
        });
    }

    // resize();

    // /////////////////////////////////////////////////////////////////////////

    // Public interface
    return {
        resize: resize,

        left: leftBody,

        right: rightBody
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.VSplitter = function (parent, attributes) {
    var properties = highed.merge(
            {
                topHeight: 40,
                noOverflow: false
            },
            attributes
        ),
        container = highed.dom.cr('div', 'highed-vsplitter'),
        top = highed.dom.cr('div', 'panel top highed-scrollbar'),
        bottom = highed.dom.cr('div', 'panel bottom highed-scrollbar'),
        topBody = highed.dom.cr('div', 'highed-vsplitter-body highed-scrollbar'),
        bottomBody = highed.dom.cr('div', 'highed-vsplitter-body highed-scrollbar');

    // /////////////////////////////////////////////////////////////////////////


    function resize(w, h) {
        var s = highed.dom.size(parent);

        highed.dom.style(container, {
            height: '100%'
        });

        if (!w && !h) {


            highed.dom.style(top, {
                height: (typeof properties.topHeight === 'string' ? properties.topHeight : properties.topHeight + '%')
            });
            if (bottom) {
                highed.dom.style(bottom, {
                    width: '100%',
                    height: (typeof properties.topHeight === 'string' ? 'calc(100% - ' + properties.topHeight + ')' : 100 - properties.topHeight + '%')
                });
            }
            return;
        }
        highed.dom.style(container, {
            width: (w || s.w) + 'px',
            height: ((h || s.h)) + 'px'
        });

        if (properties.topHeight.toString().indexOf('px') > 0) {
            highed.dom.style(top, {
                height: 'properties.topHeight'
            });

            highed.dom.style(bottom, {
                height: (h || s.h) - parseInt(properties.topHeight, 10) + 'px'
            });
        } else {
            highed.dom.style(top, {
                height: properties.topHeight + '%'
            });

            highed.dom.style(bottom, {
                height: 100 - properties.topHeight + '%'
            });
        }
    // highed.dom.style([top, bottom, container], {
    //    width: (w || s.w) + 'px'
    // });
    }

    // /////////////////////////////////////////////////////////////////////////

    highed.dom.ap(
        highed.dom.get(parent),
        highed.dom.ap(
            container,
            highed.dom.ap(top, topBody),
            highed.dom.ap(bottom, bottomBody)
        )
    );

    if (properties.noOverflow) {
        highed.dom.style([container, top, bottom], {
            'overflow-y': 'hidden'
        });
    }

    parent = highed.dom.get(parent);

    // /////////////////////////////////////////////////////////////////////////

    // Public interface
    return {
        resize: resize,

        top: topBody,

        bottom: bottomBody
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.TabControl = function (parent, noOverflow, extraPadding, skipTabs) {
    var container = highed.dom.cr('div', 'highed-tab-control'),
        paneBar = highed.dom.cr('div', (!skipTabs ? 'tabs' : '')), // Quck fix for now, will change once design finalised.
        body = highed.dom.cr('div', 'body'),
        indicator = highed.dom.cr('div', 'indicator'),
        more = highed.dom.cr('div', (!skipTabs ? 'highed-tab-control-more fa fa-chevron-right' : '')),
        events = highed.events(),
        selectedTab = false,
        tabs = [],
        ctx = highed.ContextMenu();

    // /////////////////////////////////////////////////////////////////////////

    // Build ctx menu
    function buildCTX() {
        ctx.build(
            tabs.map(function (tab) {
                return {
                    title: tab.title,
                    click: tab.focus,
                    selected: tab.selected
                };
            })
        );
    }

    highed.dom.on(more, 'click', function (e) {
        buildCTX();
        ctx.show(e.clientX, e.clientY);
    });


    function resize(w, h) {
        var cs = highed.dom.size(parent),
            width = 0;

        if (!skipTabs) {
            var ps = highed.dom.size(paneBar);
        }

        highed.dom.style(container, {
            height: (h || cs.h) + 'px'
        });

        highed.dom.style(body, {
            height: (h || cs.h) /* - ps.h*/ + 'px'
        });

        // Also re-focus the active tab
        if (selectedTab) {
            selectedTab.focus();
        }

        // clientWidth/scrollWidth doesn't produce what we need,
        // so let's check the accumulated width of the tabs.

        tabs.forEach(function (tab) {
            width += highed.dom.size(tab.node).w || 0;
        });

        if (!skipTabs) {
            if (width > paneBar.scrollWidth) {
                highed.dom.style(more, {
                    display: 'block'
                });
            } else {
                highed.dom.style(more, {
                    display: 'none'
                });
            }
        }


    }


    function selectFirst() {
        tabs.some(function (tab) {
            if (tab.visible()) {
                tab.focus();
                return true;
            }
        });
    }

    function select(index) {
        if (tabs[index] && tabs[index].visible()) {
            tabs[index].focus();
        }
    }


    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
    }


    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
    }

    function updateVisibility() {
        var c = tabs.filter(function (a) {
            return a.visible();
        }).length;

        if (!skipTabs) {
            if (c < 2) {
                highed.dom.style(paneBar, {
                    display: 'none'
                });
            } else {
                highed.dom.style(paneBar, {
                    display: ''
                });
            }
        }
    }

    /* Create and return a new tab
     * @memberof highed.TabControl
     * @name createTab
     * @properties - the properties for the tab:
     *   > title {string} - the title of the tab
     * @returns {object} - an interface to the tab
     *    > hide {function} - hide the tab
     *    > show {function} - show the tab
     *    > focus {function} - make the tab active
     *    > visible {function} - returns true if the tab is visible
     *    > body {domnode} - the tab body
     */
    function Tab(properties) {
        var tevents = highed.events(),
            tab = highed.dom.cr('div', 'tab', properties.title),
            tbody = highed.dom.cr('div', 'tab-body'),
            visible = true,
            texports = {
                selected: false
            };

        if (extraPadding) {
            tbody.className += ' tab-body-padded';
        }
        if (!skipTabs) {
            highed.dom.ap(paneBar, tab);
        }

        highed.dom.ap(body, tbody);

        function hide() {
            visible = false;
            highed.dom.style(tab, { display: 'none' });
            updateVisibility();
        }

        function show() {
            visible = true;
            highed.dom.style(tab, { display: '' });
            updateVisibility();
        }

        function resize(w, h) {
            highed.dom.style(container, { width: w + 'px', height: h + 'px' });
        }

        function focus() {
            var tsize = highed.dom.size(tab),
                tpos = highed.dom.pos(tab);
            if (!visible) {
                return;
            }

            if (selectedTab) {
                selectedTab.node.className = 'tab';
                selectedTab.selected = false;

                highed.dom.style(selectedTab.body, {
                    opacity: 0,
                    //                  'pointer-events': 'none',
                    display: 'none'
                });
            }

            if (!tsize || !tpos || !tsize.w) {
                // We're not ready yet..
            }

            highed.dom.style(indicator, {
                width: tsize.w + 'px',
                left: tpos.x + 'px'
            });

            tab.className = 'tab tab-selected';

            highed.dom.style(tbody, {
                opacity: 1,
                //                'pointer-events': 'auto',
                display: 'block'
            });

            selectedTab = texports;
            selectedTab.selected = true;
            tevents.emit('Focus');

            events.emit('Focus', texports);
        }

        highed.dom.on(tab, 'click', function () {
            focus();
            highed.emit('UIAction', 'TabControlNavigation', properties.title);
        });

        texports = {
            on: tevents.on,
            focus: focus,
            node: tab,
            body: tbody,
            hide: hide,
            show: show,
            resize: resize,
            title: properties.title,
            visible: function () {
                return visible;
            }
        };

        if (!selectedTab) {
            focus();
        }

        if (noOverflow) {
            highed.dom.style(tbody, {
                overflow: 'hidden'
            });
        }

        tabs.push(texports);

        resize();
        updateVisibility();

        return texports;
    }

    // /////////////////////////////////////////////////////////////////////////

    if (!highed.isNull(parent)) {
        highed.ready(function () {
            highed.dom.ap(
                parent,
                // eslint-disable-next-line max-len
                highed.dom.ap(container, highed.dom.ap(paneBar, more, indicator), body)
            );

            resize();
            updateVisibility();
        });
    }

    // /////////////////////////////////////////////////////////////////////////

    return {
        container: container,
        on: events.on,
        createTab: Tab,
        resize: resize,
        select: select,
        selectFirst: selectFirst,
        show: show,
        hide: hide,

        barSize: function () {
            return highed.dom.size(paneBar);
        }
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

/* Create a table, append to body, add a color picker to it.
 *  highed.dom.ap(document.body,
 *      highed.dom.ap(highed.dom.cr('table'),
 *          highed.InspectorField('color', '#FFF', {
 *              title: 'Set the color!'
 *          }, function (newValue) {
 *              highed.dom.style(document.body, {
 *                  backgroundColor: newValue
 *              });
 *          })
 *      )
 *  );
 *
 * @param planCode
 *  @param type {enum} - the type of widget to use
 *    > string
 *    > number
 *    > range
 *    > boolean
 *    > color
 *    > font
 *    > options
 *    > object
 *  @param value {anything} - the current value of the field
 *  @param properties {object} - the properties for the widget
 *  @param fn {function} - the function to call when the field is changed
 *     > {anything} - the changed value
 *  @param nohint {boolean} - if true, the help icon will be skipped
 *  @param fieldID {anything} - the id of the field
 *  @return {domnode} - a DOM node containing the field + label wrapped in a tr
 */
highed.InspectorField = function (type, value, properties, fn, nohint, fieldID, planCode) {

    var createReset = function (resetTo, callback) {
            var node = highed.dom.cr('div', 'highed-field-reset fa fa-undo');

            if (resetTo === 'null') {
                resetTo = null;
            }

            highed.dom.on(node, 'click', function () {
                if (highed.isFn(callback)) {
                    callback(properties.defaults || resetTo);
                }
            });

            return node;
        },
        fields = {
            string: function (val, callback) {
                var input = highed.dom.cr('input', 'highed-field-input', '', fieldID),
                    reset = createReset(properties.defaults || val || value, function (v) {
                        input.value = val = v;
                        tryCallback(callback, v);
                    });

                highed.dom.on(input, 'change', function (e) {
                    tryCallback(callback, input.value);
                    e.cancelBubble = true;
                });

                if (typeof (val || value || '') === 'string' &&
            (val || value || '').indexOf('\\u') > -1) {
                    input.value = decodeURIComponent(JSON.parse('"' + (val || value).replace(/\"/g, '\\"') + '"'));
                } else {
                    input.value = (val || value);
                }


                if (properties.warning && properties.warning.length > 0 && planCode && properties.warning.indexOf(planCode) > -1) {
                    input.disabled = true;
                }

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'), /*
          reset,*/
                    input
                );
            },
            header: function (val, callback) {
                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'), /*
          reset,*/
                    highed.dom.cr('div', 'highed-field-header', properties.header)
                );
            },
            number: function (val, callback) {
                var input = highed.dom.cr('input', 'highed-field-input', '', fieldID),
                    reset = createReset(properties.defaults || val || value, function (v) {
                        input.value = val = v;
                        tryCallback(callback, parseFloat(v));
                    });

                input.type = 'number';

                if (!highed.isNull(properties.custom)) {
                    input.step = properties.custom.step;
                    input.min = properties.custom.minValue;
                    input.max = properties.custom.maxValue;
                }

                highed.dom.on(input, 'change', function () {
                    tryCallback(callback, parseFloat(input.value));
                });

                input.value = val || value;

                if (properties.warning && properties.warning.length > 0 && planCode && properties.warning.indexOf(planCode) > -1) {
                    input.disabled = true;
                }

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'), /*
          reset,*/
                    input
                );
            },
            range: function (val, callback) {
                var slider = highed.Slider(false, {
                    min: properties.custom.minValue,
                    max: properties.custom.maxValue,
                    step: properties.custom.step,
                    value: val || value,
                    resetTo: properties.defaults
                });

                slider.on('Change', function (v) {
                    tryCallback(callback, v);
                });

                return slider.container;
            },
            boolean: function (val, callback) {
                var input = highed.dom.cr('input', '', '', fieldID),
                    reset = createReset(properties.defaults || val || value, function (v) {
                        input.checked = val = highed.toBool(v);
                        tryCallback(callback, val);
                    });

                input.type = 'checkbox';

                input.checked = highed.toBool(val || value);

                highed.dom.on(input, 'change', function () {
                    tryCallback(callback, input.checked);
                });

                if (properties.warning && properties.warning.length > 0 && planCode && properties.warning.indexOf(planCode) > -1) {
                    input.disabled = true;
                }

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'), /*
          reset,*/
                    input
                );
            },
            color: function (val, callback) {
                var box = highed.dom.cr('div', 'highed-field-colorpicker', '', fieldID),
                    reset = highed.dom.cr('div', 'highed-field-reset fa fa-undo'),
                    resetTo = val || value || properties.defaults;


                if (resetTo === 'null') {
                    resetTo = null;
                }

                function update(col, callback) {
                    if (
                        col &&
            col !== 'null' &&
            col !== 'undefined' &&
            typeof col !== 'undefined'
                    ) {
                        box.innerHTML = '';
                        // box.innerHTML = col;
                    } else {
                        box.innerHTML = 'auto';
                        col = '#FFFFFF';
                    }

                    highed.dom.style(box, {
                        background: col,
                        color: highed.getContrastedColor(col)
                    });
                }

                function fixVal() {
                    // This is very ugly
                    try {
                        val = JSON.parse(val);
                    } catch (e) {
                        // nothing
                    }

                    if (highed.isArr(val)) {
                        val = '#FFF';
                    }
                }

                fixVal();

                highed.dom.on(box, 'click', function (e) {
                    highed.pickColor(e.clientX, e.clientY, val || value, function (col) {
                        if (highed.isArr(val)) {
                            val = '#FFFFFF';
                        }

                        val = col;
                        update(col);
                        tryCallback(callback, col);
                    });
                });

                highed.dom.on(reset, 'click', function () {
                    val = resetTo;
                    fixVal();
                    update(val);
                    tryCallback(callback, val);
                });

                update(val || value);

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'),
                    box/* ,
          reset*/
                );
            },
            font: function (val, callback) {
                return fields.cssobject(val, callback);
            },
            configset: function (val, callback) {
                return fields.string(val, callback);
            },
            json: function (val, callback) {
                var textArea = highed.dom.cr(
                        'textarea',
                        'highed-field-input',
                        '',
                        fieldID
                    ),
                    errorBar = highed.dom.cr('div', 'highed-field-error'),
                    editor = false,
                    updateIt = function (v) {
                        if (editor) {
                            editor.setValue(JSON.stringify(v, undefined, '\t'));
                        } else {
                            textArea.value = JSON.stringify(v, undefined, '\t');
                        }
                    },
                    reset = createReset(properties.defaults || val || value, function (v) {
                        val = v;
                        updateIt(v);
                        tryCallback(callback, v);
                    }),
                    parent = highed.dom.ap(
                        highed.dom.cr('div', 'highed-field-container', '', fieldID + '_container'),
                        textArea,
                        /*
            reset,*/
                        errorBar
                    );

                function resizePoll() {
                    if (document.body && editor) {
                        if (document.getElementById(fieldID)) {
                            editor.refresh();
                        } else {
                            setTimeout(resizePoll, 10);
                        }
                    }
                }

                function callHome(v) {

                    try {
                        v = JSON.parse(v);
                        tryCallback(callback, v);
                        errorBar.innerHTML = '';
                        highed.dom.style(errorBar, { display: 'none', opacity: 0 });
                    } catch (e) {
                        // highed.snackBar('There\'s an error in your JSON: ' + e);
                        errorBar.innerHTML = 'Syntax error: ' + e;
                        highed.dom.style(errorBar, { display: 'block', opacity: 1 });
                    }
                }

                if (typeof window.CodeMirror !== 'undefined') {
                    editor = CodeMirror.fromTextArea(textArea, {
                        lineNumbers: true,
                        mode: 'application/json',
                        theme: highed.option('codeMirrorTheme')
                    });

                    updateIt(val || value || properties.defaults);

                    var timeout = null;
                    editor.on('change', function () {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            callHome(editor.getValue());
                        }, 1000);
                    });

                    resizePoll();
                } else {
                    updateIt(val || value || properties.defaults);

                    highed.dom.on(textArea, 'change', function () {
                        callHome(textArea.value);
                    });
                }

                return parent;
            },
            cssobject: function (val, callback) {
                var picker = highed.FontPicker(callback || fn, val || value),
                    reset = createReset(properties.defaults || val || value, function (v) {
                        val = v;
                        picker.set(val);

                        tryCallback(callback, v);
                    });

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'),
                    /* reset,*/
                    picker.container
                );
            },
            options: function (val, callback) {
                var ddown = highed.DropDown(),
                    reset = createReset(properties.defaults, function (v) {
                        val = v;
                        ddown.selectById(val);
                        tryCallback(callback, v);
                    });

                if (highed.isStr(properties.values)) {
                    try {
                        properties.values = JSON.parse(properties.values);
                    } catch (e) {
                        properties.values = properties.values.split(' ');
                    }
                }

                ddown.addItems(properties.values);
                ddown.addItem({ title: 'line', id: properties.defaults });

                ddown.selectById(val || value || properties.defaults);

                ddown.on('Change', function (selected) {
                    tryCallback(callback, selected.id());
                });

                return highed.dom.ap(
                    highed.dom.cr('div', 'highed-field-container'),
                    ddown.container/* ,
          reset*/
                );
            },
            object: function (val, callback) {
                // Create a sub-table of options
                var stable = highed.dom.cr(
                        'table',
                        'highed-customizer-table',
                        '',
                        fieldID
                    ),
                    wasUndefined = highed.isNull(val || value);

                val = val || value || {};

                if (highed.isStr(val)) {
                    try {
                        val = JSON.parse(val);
                    } catch (e) {
                        // nothing
                    }
                }

                if (properties && highed.isArr(properties.attributes)) {
                    properties.attributes.forEach(function (attr) {
                        val[attr.name || attr.id] =
              val[attr.name || attr.id] ||
              attr.defaults ||
              (attr.dataType.indexOf('object') >= 0 ? {} : '');

                        attr.title = highed.uncamelize(attr.title);

                        highed.dom.ap(
                            stable,
                            highed.InspectorField(
                                attr.dataType,
                                val[attr.name || attr.id] || attr.defaults,
                                attr,
                                function (nval) {
                                    val[attr.name || attr.id] = nval;
                                    tryCallback(callback, val);
                                }
                            )
                        );
                    });
                }

                if (wasUndefined) {
                    // tryCallback(callback, val);
                }

                return stable;
            },

            function: function (val, callback) {
                var container = highed.dom.cr(
                        'div',
                        'highed-field-container highed-field-code-container'
                    ),
                    field = highed.dom.cr('textarea', 'highed-field-code', '', fieldID),
                    editor = false,
                    reset = createReset(properties.defaults || val || value, function (v) {
                        val = v;
                        updateIt(v);
                        callHome(v);
                    });

                function updateIt(v) {
                    if (highed.isFn(v)) {
                        v = v.toString();
                    }

                    if (editor) {
                        editor.setValue(v);
                        editor.refresh();
                    } else {
                        field.value = v;
                    }
                }

                function callHome(v) {
                    var args = [];
                    var argStart = v.indexOf('(');
                    var argEnd = v.substr(argStart + 1).indexOf(')');
                    var body = '';
                    var balance = 0;
                    var parsing = false;

                    try {
                        args = v
                            .substr(argStart + 1, argEnd - 1)
                            .trim()
                            .split(',');

                        args = args.filter(function (b) {
                            return b && b.length > 0 && b.indexOf('/*') === -1;
                        });

                        for (var i = 0; i < v.length; i++) {
                            if (v[i] === '{') {
                                balance++;
                                parsing = true;
                            } else if (v[i] === '}') {
                                balance--;
                                if (balance === 0) {
                                    parsing = false;
                                }
                            } else if (parsing) {
                                body += v[i];
                            }
                        }

                        // eslint-disable-next-line no-new-func
                        v = new Function(args, body);
                    } catch (e) {
                        console.log(e);
                        return;
                    }
                    tryCallback(callback, v);
                }

                function resizePoll() {
                    if (editor && document.body) {
                        if (container.parentNode) {
                            editor.refresh();
                        } else {
                            setTimeout(resizePoll, 50);
                        }
                    }
                }

                highed.dom.ap(container, field);

                if (typeof window.CodeMirror !== 'undefined') {
                    editor = CodeMirror.fromTextArea(field, {
                        lineNumbers: true,
                        mode: 'javascript',
                        theme: highed.option('codeMirrorTheme')
                    });

                    editor.on('change', function () {
                        callHome(editor.getValue());
                    });

                    resizePoll();
                } else {
                    highed.dom.on(field, 'change', function () {
                        callHome(field.value);
                    });
                }

                updateIt(val || value || properties.defaults || function () {});

                return container;
            },

            array: function () {
                var container = highed.dom.cr('div', '', '', fieldID),
                    add = highed.dom.cr('span', 'highed-field-array-add fa fa-plus', ''),
                    itemsNode = highed.dom.cr('div', 'highed-inline-blocks'),
                    items = {},
                    itemCounter = 0,
                    itemTable = highed.dom.cr('table', 'highed-field-table');

                if (highed.isStr(value)) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        return container;
                    }
                }

                if (value && !highed.isArr(value) && !highed.isBasic(value)) {
                    // This is an object.
                    value = Object.keys(value).map(function (e) {
                        return value[e];
                    });
                }

                function addCompositeItem(val, suppressCallback) {
                    var item,
                        rem = highed.dom.cr('span', 'highed-icon fa fa-trash highed-trash-button'),
                        row = highed.dom.cr('div', 'color-row'), // tr
                        id = ++itemCounter;

                    function processChange(newVal) {
                        if (newVal) {
                            items[id].value = newVal;
                            doEmitCallback();
                        }
                    }

                    function doEmitCallback() {
                        if (highed.isFn(fn)) {
                            fn(
                                Object.keys(items).map(function (key) {
                                    return items[key].value;
                                })
                            );
                        }
                    }

                    if (highed.isArr(val)) {
                        val = val[id];
                    }

                    items[id] = {
                        id: id,
                        row: row,
                        value: val
                    };

                    item = fields[properties.subType] ?
                        fields[properties.subType](
                            val || value[id] || properties.defaults,
                            processChange
                        ) :
                        fields.string(val, processChange);

                    highed.dom.ap(
                        itemTable,
                        highed.dom.ap(
                            row,
                            highed.dom.ap(highed.dom.cr('div'), item), // td
                            highed.dom.ap(highed.dom.cr('div'), rem) // td
                        )
                    );

                    highed.dom.on(rem, 'click', function (e) {
                        delete items[id];
                        itemTable.removeChild(row);

                        doEmitCallback();

                        e.cancelBubble = true;
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        return false;
                    });

                    if (!suppressCallback) {
                        processChange();
                    }
                }

                highed.dom.ap(container, itemTable);

                highed.dom.on(add, 'click', function () {
                    addCompositeItem();
                });

                if (highed.isArr(value)) {
                    value.forEach(function (item) {
                        addCompositeItem(item, true);
                    });
                }

                highed.dom.ap(container, itemsNode, add);

                return container;
            }
        },
        help = highed.dom.cr(
            'span',
            'highed-icon highed-field-help fa fa-question-circle'
        ),
        helpTD = highed.dom.cr('div', 'highed-customizer-table-help'), // td
        widgetTD = highed.dom.cr('div', 'highed-field-table-widget-column'), // td
        titleCol = highed.dom.cr('div'), // td
        typeIndicator = highed.dom.cr('span', 'highed-customize-type');

    function tryCallback(cb, val) {
        cb = cb || fn;
        if (highed.isFn(cb)) {
            cb(val);
        }
    }

    function deduceObject() {
        if (
            (!properties.attributes || !properties.attributes.length) &&
      properties.defaults
        ) {
            properties.attributes = [];

            // There's no attributes but it's an object.
            // Check if there are default values we can use
            // to figure out the structure.
            if (properties.defaults) {
                try {
                    properties.defaults = JSON.parse(properties.defaults);
                    Object.keys(properties.defaults).forEach(function (k) {
                        var tp = 'string',
                            def = properties.defaults[k],
                            up = k.toUpperCase(),
                            vals;

                        // This is hackish.
                        if (highed.isNum(def)) {
                            tp = 'number';
                        }

                        if (
                            def.length &&
              def[0] === '#' &&
              (up.indexOf('BACKGROUND') >= 0 || up.indexOf('COLOR') >= 0)
                        ) {
                            tp = 'color';
                        }

                        properties.attributes.push({
                            id: k,
                            title: k,
                            dataType: tp,
                            defaults: properties.defaults[k],
                            tooltip: '',
                            values: vals
                        });
                    });
                } catch (e) {
                    highed.log(
                        3,
                        'property',
                        properties.id,
                        'skipped, no way to deduce the object members'
                    );

                }
            }
        } else {
            type = 'json';
            properties.defaults = properties.defaults || {};
        }
    }

    if (highed.isNull(value)) {
        value = '';
    }

    if (type === 'cssobject' || type === 'highcharts.cssobject') {
    // So there are more than one version of this thing - one of them
    // requires a font picker, the other is dynamic.
    // Figure out which one we're dealing with here.

        // properties = properties || {};
        // properties.attributes = [
        //     {name: 'x', title: 'x', title: 'X', values: '0', dataType: 'number'}

        // ];
        type = 'object';
    }

    // Choose a type
    if (type && type.indexOf('|') >= 0) {
        type = type.indexOf('object') >= 0 ? 'object' : type.split('|')[0];
    }

    if (
        !highed.isNull(properties.custom) &&
    !highed.isNull(properties.custom.minValue) &&
    !highed.isNull(properties.custom.maxValue) &&
    !highed.isNull(properties.custom.step)
    ) {
        type = 'range';
    }

    if (type && type.indexOf('array') === 0) {
        properties.subType = type.substr(6, type.length - 7);
        type = 'array';

        if (properties.subType === 'object') {
            deduceObject();
        }
    }

    if (type === 'object') {
        deduceObject();
    }

    if (!properties.tooltip && !properties.tooltipText) {
        nohint = true;
    } else {
    // properties.tooltip = properties.tooltip.replace(/\n/g, '<br/><br/>');
    }


    if (highed.onPhone()) {
        highed.dom.on(help, 'click', function () {
            var hide = highed.Tooltip(0, 0, properties.tooltip || properties.tooltipText, true);
            highed.dom.on([help], 'mouseout', hide);
        });
    } else {
        highed.dom.on([help], 'mouseover', function (e) {
            var hide = highed.Tooltip(
                e.clientX + 20,
                e.clientY,
                properties.tooltip || properties.tooltipText
            );

            highed.dom.on([help], 'mouseout', hide);
            // highed.showDimmer(highed.hideAllTooltips, true, true);
        });
    }

    if (nohint) {
        highed.dom.style(help, { display: 'none' });
        widgetTD.colSpan = 2;
    }

    typeIndicator.className += ' highed-customize-type-' + type;
    const parent = highed.dom.cr('div', 'highed-customizer-table-parent', '', fieldID + '_container');

    highed.dom.style(parent,
        {
            width: (properties.width || 100) + '%'
        });


    if (type === 'header') {

        return highed.dom.ap(
            highed.dom.ap(
                parent, // tr
                highed.dom.ap(widgetTD, fields[type] ? fields[type]() : fields.string())
            )
        );

    }
    if (type === 'boolean') {
        titleCol.className = 'highed-customize-field-boolean';
        return highed.dom.ap(
            highed.dom.ap(
                parent, // tr
                highed.dom.ap(widgetTD,
                    highed.dom.ap(fields[type] ? fields[type]() : fields.string(),
                        highed.dom.ap(
                            titleCol,
                            highed.dom.cr('span', 'highed-customize-field-label', properties.title),
                            !nohint ?
                                highed.dom.ap(
                                    helpTD,
                                    // highed.dom.cr('span', 'highed-field-tooltip', properties.tooltip)
                                    help
                                ) :
                                false
                        ))
                )
            )
        );
    }
    return highed.dom.ap(
        highed.dom.ap(
            parent, // tr
            highed.dom.ap(
                titleCol,
                highed.dom.cr('span', 'highed-customize-field-label', properties.title),
                !nohint ?
                    highed.dom.ap(
                        helpTD,
                        // highed.dom.cr('span', 'highed-field-tooltip', properties.tooltip)
                        help
                    ) :
                    false
            ),
            highed.dom.ap(widgetTD, fields[type] ? fields[type]() : fields.string())
        )
    );


};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.List = function (parent, responsive, props, planCode) {
    var container = highed.dom.cr('div', 'highed-list'),
        compactIndicator = highed.dom.cr('div', 'highed-list-compact', 'compact'),
        ctx = highed.ContextMenu(),
        selectedItem = false,
        events = highed.events(),
        items = [],
        dropdowns = {},
        properties = props;

    // /////////////////////////////////////////////////////////////////////////


    function addItem(item, children, chartPreview) {

        var node = highed.dom.cr('a', 'item', item.title),
            nodeArrow = highed.dom.cr('span', 'item-arrow', '<i class="fa fa-angle-right" aria-hidden="true"></i>'),
            nodeChildren = highed.dom.cr('span', 'highed-list-suboptions', ''),
            iexports = {};

        highed.dom.style(nodeChildren, {
            display: 'none'
        });

        highed.dom.ap(node, nodeArrow);

        (children || []).forEach(function (thing) {
            selectGroup(thing);
        });

        function shouldInclude(group) {
            var doInclude = false;

            if (Object.keys(properties.availableSettings || {}).length > 0) {
                if (highed.isArr(group)) {
                    group.forEach(function (sub) {
                        if (shouldInclude(sub)) {
                            doInclude = true;
                        }
                    });
                } else if (highed.isArr(group.options)) {
                    group.options.forEach(function (sub) {
                        if (shouldInclude(sub)) {
                            doInclude = true;
                        }
                    });
                } else if (
                    properties.availableSettings[group.id] ||
          properties.availableSettings[group.pid]
                ) {
                    doInclude = true;
                }

                return doInclude;
            }

            return true;
        }


        function applyFilter(detailIndex, filteredBy, filter) {
            var selected = selectedItem, // list.selected(),
                id = selected.id,
                entry = highed.meta.optionsExtended.options[id];

            if (!selected) {
                return false;
            }

            // body.innerHTML = '';

            entry.forEach(function (thing) {
                selectGroup(thing, false, false, detailIndex, filteredBy, filter);
            });

            highlighted = false;
        }
        // This function has mutated into a proper mess. Needs refactoring.
        function selectGroup(group, table, options, detailIndex, filteredBy, filter) {
            var master,
                vals,
                doInclude = true,
                container,
                masterNode,
                def;

            options = chartPreview.options.getCustomized(); // userOptions;//chartPreview.options.getCustomized();

            if (highed.isArr(group.options)) {
                table = highed.dom.cr('div', 'highed-customizer-table');
                warningContainer = highed.dom.cr('div', 'highed-customize-warning-container'),
                warning = highed.dom.cr('div', 'highed-customize-warning', 'You need to be on a paid plan for this to work in production');
                doInclude = shouldInclude(group);

                if (group.warning && group.warning.length > 0 &&
          planCode && group.warning.indexOf(planCode) > -1) {
                    highed.dom.ap(table, highed.dom.ap(warningContainer, warning));
                }

                if (!doInclude) {
                    return;
                }

                container = highed.dom.cr('div', 'highed-customize-group' + (group.dropdown ? ' highed-list-general-drop-down' : ' highed-list-normal'), null, 'highed-list-header-' + highed.L(group.text));
                masterNode = highed.dom.cr('div', 'highed-customize-master-dropdown');
                nodeHeading = highed.dom.cr(
                    'div',
                    'highed-customizer-table-heading' + (group.dropdown ? ' highed-list-general-drop-down-header' : ''),
                    highed.L(group.text)
                );

                if (group.dropdown) {
                    dropdowns[highed.L(group.text)] = container;
                    highed.dom.on(nodeHeading, 'click', function (e) {

                        if (e.target !== this) {
                            Object.keys(dropdowns).forEach(function (d) {
                                if (dropdowns[d] !== container) {
                                    dropdowns[d].classList.remove('active');
                                }
                            });

                            if (container.classList.contains('active')) {
                                container.classList.remove('active');
                            } else {
                                container.className += ' active';
                            }
                        }

                    });
                }


                highed.dom.ap(
                    nodeChildren,
                    highed.dom.ap(
                        container,
                        nodeHeading,
                        masterNode,
                        table
                    )
                );

                if (group.filteredBy) {
                    filter = highed.getAttr(options, group.filteredBy, detailIndex);
                }

                if (group.controlledBy) {
                    master = highed.DropDown();
                    highed.dom.style(masterNode, {
                        display: 'block'
                    });

                    if (highed.isStr(group.controlledBy.options)) {
                        vals = highed.getAttr(
                            options,
                            group.controlledBy.options,
                            detailIndex
                        );

                        if (highed.isArr(vals)) {

                            if (vals.length === 0) {
                                highed.dom.ap(
                                    parent,
                                    highed.dom.cr('i', '', 'No data to display..')
                                );
                                return;
                            }

                            master.addItems(
                                vals.map(function (t, i) {
                                    return (
                                        (group.controlledBy.optionsTitle ?
                                            t[group.controlledBy.optionsTitle] :
                                            '#' + (i + 1)) || '#' + (i + 1)
                                    );
                                })
                            );

                            master.selectByIndex(detailIndex || 0);

                            master.on('Change', function (selected) {

                                detailIndex = selected.index();

                                table.innerHTML = '';

                                group.options.forEach(function (sub) {
                                    if (group.filteredBy) {
                                        filter = highed.getAttr(
                                            options,
                                            group.filteredBy,
                                            detailIndex
                                        );
                                    }
                                    selectGroup(
                                        sub,
                                        table,
                                        options,
                                        detailIndex,
                                        group.filteredBy,
                                        filter
                                    );
                                });
                            });

                            highed.dom.ap(masterNode, master.container);
                            detailIndex = detailIndex || 0;
                        } else {
                            return;
                        }
                    }
                }

                // highed.dom.ap(body, table);

                group.options.forEach(function (sub) {
                    selectGroup(sub, table, options, detailIndex, group.filteredBy, filter);
                });
            } else if (typeof group.id !== 'undefined') {
                // Check if we should filter out this column
                if (filter && group.subType && group.subType.length) {
                    if (!highed.arrToObj(group.subType)[filter]) {
                        return;
                    }
                }

                if (Object.keys(properties.availableSettings || {}).length > 0) {
                    if (
                        !properties.availableSettings[group.id] &&
            !properties.availableSettings[group.pid]
                    ) {
                        return;
                    }
                }

                if (typeof group.dataIndex !== 'undefined') {
                    detailIndex = group.dataIndex;
                }

                def = highed.getAttr(options, group.id, detailIndex);

                // highed.dom.ap(sub, highed.dom.cr('span', '', referenced[0].returnType));

                highed.dom.ap(
                    table,
                    highed.InspectorField(
                        group.values ? 'options' : group.dataType,
                        typeof def !== 'undefined' ?
                            def :
                            filter && group.subTypeDefaults[filter] ?
                                group.subTypeDefaults[filter] :
                                group.defaults,
                        {
                            title: highed.L('option.text.' + group.pid),
                            tooltip: highed.L('option.tooltip.' + group.pid),
                            values: group.values,
                            custom: group.custom,
                            defaults: group.defaults,
                            width: group.width || 100,
                            attributes: group.attributes || [],
                            warning: group.warning || [],
                            header: highed.L(group.pid)
                        },
                        function (newValue) {
                            if (group.header) {
                                return;
                            }
                            if (group.plugins && group.plugins.length > 0) {
                                events.emit('TogglePlugins', group.id, newValue);
                            }

                            if (!group.noChange) {
                                events.emit('PropertyChange', group.id, newValue, detailIndex);
                            }

                            highed.emit(
                                'UIAction',
                                'SimplePropSet',
                                highed.L('option.text.' + group.pid),
                                newValue
                            );

                            if (group.id === filteredBy) {
                                // This is a master for the rest of the childs,
                                // which means that we need to rebuild everything
                                // here somehow and check their subType
                                nodeChildren.innerHTML = '';
                                applyFilter(detailIndex, filteredBy, newValue);
                            }
                        },
                        false,
                        group.id,
                        planCode
                    )
                );
            }
        }

        function select(e) {
            if (selectedItem) {
                selectedItem.selected = false;
                selectedItem.node.className = 'item';
                selectedItem.nodeArrow.innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
                highed.dom.style(selectedItem.nodeChildren, {
                    display: 'none'
                });
            }
            dropdowns = {};

            nodeArrow.innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>';
            nodeChildren.innerHTML = '';
            var entry = highed.meta.optionsExtended.options[item.id];
            (entry || []).forEach(function (thing) {
                selectGroup(thing);
            });

            highed.dom.style(nodeChildren, {
                display: 'block'
            });

            selectedItem = iexports;
            selectedItem.selected = true;
            node.className = 'item item-selected';
            events.emit('Select', item.id);
            compactIndicator.innerHTML =
        '<span class="icon fa fa-th-list"></span>' + item.title;

            if (highed.isFn(item.click)) {
                return item.click(e);
            }
        }

        if (!item.annotations) {
            highed.dom.on(node, 'click', item.onClick || select);
        }
        highed.dom.ap(container, node, nodeChildren);

        iexports = {
            id: item.id,
            title: item.title,
            node: node,
            nodeArrow: nodeArrow,
            nodeChildren: nodeChildren,
            select: select,
            selected: false
        };

        items.push(iexports);

        if (!selectedItem) {
            select();
        }

        return iexports;
    }


    function addItems(items) {
        if (highed.isArr(items)) {

            items.forEach(function (item) {
                addItem(item);
            });
        }
    }


    function clear() {
        container.innerHTML = '';
    }


    function resize() {
        var ps = highed.dom.size(parent),
            cs = highed.dom.size(container);

        if (responsive && ps.h < 50 && ps.h !== 0 && ps.h) {
            highed.dom.style(compactIndicator, {
                display: 'block'
            });
            highed.dom.style(container, {
                display: 'none'
            });
        } else if (responsive) {
            highed.dom.style(compactIndicator, {
                display: 'none'
            });
            highed.dom.style(container, {
                display: ''
            });
        }

    // highed.dom.style(container, {
    //     //height: ps.height + 'px'
    //     height: '100%'
    // });
    }


    function show() {
        highed.dom.style(container, {});
    }


    function hide() {}


    function selectFirst() {
        if (items.length > 0) {
            items[0].select();
        }
    }


    function select(which) {

        items.some(function (item) {
            if (which === item.title) {
                if (item.selected) {
                    return true;
                }
                item.select();
                return true;
            }
        });
    }

    function selectDropdown(dropdownKey) {


        if (dropdowns[dropdownKey].classList.contains('active')) {
            return true;
        }

        Object.keys(dropdowns).forEach(function (d) {
            if (dropdowns[d] !== dropdowns[dropdownKey]) {
                dropdowns[d].classList.remove('active');
            }
        });

        if (!dropdowns[dropdownKey].classList.contains('active')) {
            dropdowns[dropdownKey].className += ' active';
        }

    }


    function reselect() {
        if (selectedItem) {
            selectedItem.select();
        }
    }


    function countItems() {
        return items.length;
    }


    function selected() {
        return selectedItem;
    }
    // /////////////////////////////////////////////////////////////////////////

    highed.dom.on(compactIndicator, 'click', function (e) {
        ctx.build(
            items.map(function (item) {
                return {
                    title: item.title,
                    click: item.select,
                    selected: item.selected
                };
            })
        );
        ctx.show(e.clientX, e.clientY);
    });

    highed.dom.ap(parent, container, compactIndicator);

    // /////////////////////////////////////////////////////////////////////////

    // Public interface
    return {
        on: events.on,
        addItem: addItem,
        addItems: addItems,
        clear: clear,
        resize: resize,
        show: show,
        hide: hide,
        selectFirst: selectFirst,
        select: select,
        selectDropdown: selectDropdown,
        reselect: reselect,
        selected: selected,
        count: countItems,
        container: container
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var container = highed.dom.cr(
            'div',
            'highed-colorpicker highed-colorpicker-responsive'
        ),
        canvas = highed.dom.cr('canvas', 'picker'),
        closeBtn = highed.dom.cr('div', 'highed-ok-button', 'Close'),
        ctx = canvas.getContext('2d'),
        manualInput = highed.dom.cr('input', 'manual');

    // Attach the container to the document when the document is ready
    highed.ready(function () {
        highed.dom.ap(document.body, container);
    });

    function updatePickerBackground(current) {
        highed.dom.style(manualInput, {
            background: current,
            color: highed.getContrastedColor(current)
        });
    }

    highed.pickColor = function (x, y, current, fn) {
        var windowSize = highed.dom.size(document.body),
            containerSize = highed.dom.size(container),
            pickerSize = highed.dom.size(canvas),
            binder = false,
            pbinder = false,
            cbinder = false,
            dbinder = false;

        // /////////////////////////////////////////////////////////////////////

        /* Draws the color picker itself */
        function drawPicker() {
            // There's 14 hues per. color, 19 colors in total.
            var x,
                y,
                tx = Math.floor(pickerSize.w / 14),
                ty = Math.floor(pickerSize.h / 19),
                col = -1;

            canvas.width = pickerSize.w;
            canvas.height = pickerSize.h;

            // To avoid picking null
            ctx.fillStyle = '#FFF';
            ctx.fillRect(0, 0, pickerSize.w, pickerSize.h);

            for (y = 0; y < 19; y++) {
                for (x = 0; x < 15; x++) {
                    ctx.fillStyle = highed.meta.colors[++col]; // highed.meta.colors[x + y * tx];
                    ctx.fillRect(x * tx, y * ty, tx, ty);
                }
            }
        }

        /* Hide the picker */
        function hide() {
            highed.dom.style(container, {
                opacity: 0,
                left: '-20000px',
                'pointer-events': 'none'
            });
            binder();
            pbinder();
            cbinder();
            dbinder();
        }

        function rgbToHex(r, g, b) {
            var res = '#' + ((r << 16) | (g << 8) | b).toString(16);
            if (res.length === 5) {
                return res.replace('#', '#00');
            } if (res.length === 6) {
                return res.replace('#', '#0');
            }
            return res;
        }

        function pickColor(e) {
            var px = e.clientX || e.touches[0].clientX || 0,
                py = e.clientY || e.touches[0].clientY || 0,
                cp = highed.dom.pos(canvas),
                id = ctx.getImageData(px - cp.x - x, py - cp.y - y, 1, 1).data,
                col = rgbToHex(id[0] || 0, id[1], id[2]);

            manualInput.value = col;

            updatePickerBackground(col);

            if (highed.isFn(fn)) {
                fn(col);
            }

            e.cancelBubble = true;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }

        // /////////////////////////////////////////////////////////////////////

        // Make sure we're not off screen
        if (x > windowSize.w - containerSize.w) {
            x = windowSize.w - containerSize.w - 10;
        }

        if (y > windowSize.h - containerSize.h) {
            y = windowSize.h - containerSize.h - 10;
        }

        highed.dom.style(container, {
            left: x + 'px',
            top: y + 'px',
            opacity: 1,
            'pointer-events': 'auto'
        });

        dbinder = highed.showDimmer(hide, true, true, 5);

        cbinder = highed.dom.on(closeBtn, 'click', hide);

        binder = highed.dom.on(manualInput, 'keyup', function () {
            if (highed.isFn(fn)) {
                fn(manualInput.value);
            }
        });

        pbinder = highed.dom.on(canvas, ['mousedown', 'touchstart'], function (e) {
            var mover = highed.dom.on(canvas, ['mousemove', 'touchmove'], pickColor),
                cancel = highed.dom.on(
                    document.body,
                    ['mouseup', 'touchend'],
                    function () {
                        mover();
                        cancel();
                    }
                );

            pickColor(e);
        });

        manualInput.value = current;
        updatePickerBackground(current);

        drawPicker();

        // /////////////////////////////////////////////////////////////////////

        return {};
    };

    highed.dom.ap(container, canvas, manualInput, closeBtn);
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.Toolbar = function (parent, attributes) {
    var properties = highed.merge(
            {
                additionalCSS: []
            },
            attributes
        ),
        container = highed.dom.cr(
            'div',
            'highed-toolbar ' + properties.additionalCSS.join(' ')
        ),
        left = highed.dom.cr('div', 'highed-toolbar-left'),
        right = highed.dom.cr('div', 'highed-toolbar-right'),
        center = highed.dom.cr('div', 'highed-toolbar-center'),
        iconsRight = highed.dom.cr('div', 'icons');

    // /////////////////////////////////////////////////////////////////////////


    function addIcon(icon, where) {
        var i = highed.dom.cr('div', 'icon highed-icon fa ' + (icon.css || ''));

        highed.dom.on(i, 'click', function (e) {
            if (highed.isFn(icon.click)) {
                icon.click(e);
            }
        });

        i.title = icon.tooltip || icon.title;

        highed.dom.ap(where === 'left' ? left : right, i);
    }


    function addButton(icon, where) {
        var i = highed.dom.cr(
            'div',
            'highed-ok-button highed-toolbar-button',
            icon.title || ''
        );

        highed.dom.on(i, 'click', function (e) {
            if (highed.isFn(icon.click)) {
                icon.click(e);
            }
        });

        i.title = icon.tooltip;

        highed.dom.ap(where === 'left' ? left : right, i);
    }

    function addSeparator(where) {
        highed.dom.ap(
            where === 'left' ? left : right,
            highed.dom.cr('span', 'separator')
        );
    }

    // /////////////////////////////////////////////////////////////////////////

    highed.dom.ap(parent, highed.dom.ap(container, left, center, right));

    // /////////////////////////////////////////////////////////////////////////

    return {

        container: container,
        addIcon: addIcon,
        addButton: addButton,
        addSeparator: addSeparator,

        left: left,

        center: center,

        right: right
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {

    highed.FontPicker = function (fn, style) {
        var container = highed.dom.cr('div', 'highed-font-picker'),
            fontFamily = highed.DropDown(), // highed.dom.cr('select', 'font-family'),
            fontSize = highed.DropDown(null, 'highed-font-size'), // highed.dom.cr('select', 'font-size'),
            boldBtn = highed.PushButton(false, 'bold'),
            italicBtn = highed.PushButton(false, 'italic'),
            color = highed.dom.cr('span', 'font-color', '&nbsp;');

        if (highed.isStr(style)) {
            try {
                style = JSON.parse(style);
            } catch (e) {
                // nothing
            }
        }

        // /////////////////////////////////////////////////////////////////////

        function callback() {
            if (highed.isFn(fn)) {
                fn(style);
            }
        }

        function updateColor(ncol, suppressCallback) {
            highed.dom.style(color, {
                background: ncol
            });

            style.color = ncol;
            if (!suppressCallback) {
                callback();
            }
        }

        // /////////////////////////////////////////////////////////////////////


        function set(options) {
            if (highed.isStr(options)) {
                try {
                    options = JSON.parse(options);
                } catch (e) {
                    highed.log(0, 'Error in FontPicker::set');
                    return;
                }
            }

            style = highed.merge(
                {
                    fontFamily: 'Default', // '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                    color: '#333',
                    fontSize: '18px',
                    fontWeight: 'normal',
                    fontStyle: 'normal'
                },
                options
            );

            // Set the current values
            boldBtn.set(style.fontWeight === 'bold');
            italicBtn.set(style.fontStyle === 'italic');
            updateColor(style.color, true);
            fontFamily.selectById(style.fontFamily);
            fontSize.selectById(style.fontSize.replace('px', ''));
        }

        // Add fonts to font selector
        fontFamily.addItems(highed.meta.fonts);
        // Add font sizes
        fontSize.addItems([8, 10, 12, 14, 16, 18, 20, 22, 25, 26, 28, 30, 32, 34]);

        set(style);

        // Listen to font changes
        fontFamily.on('Change', function (selected) {

            if (selected.id() === 'Default') {
                style.fontFamily = '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif';
            } else {
                style.fontFamily = selected.id();
            }

            return callback();
        });

        // Listen to font size changes
        fontSize.on('Change', function (selected) {
            style.fontSize = selected.id() + 'px';
            return callback();
        });

        // Listen to bold changes
        boldBtn.on('Toggle', function (state) {
            style.fontWeight = state ? 'bold' : 'normal';
            callback();
        });

        // Listen to italic changes
        italicBtn.on('Toggle', function (state) {
            style.fontStyle = state ? 'italic' : 'normal';
            callback();
        });

        // Handle color picker
        highed.dom.on(color, 'click', function (e) {
            highed.pickColor(e.clientX, e.clientY, style.color, updateColor);
        });

        // Create DOM
        highed.dom.ap(
            container,
            fontFamily.container,
            fontSize.container,
            highed.dom.ap(
                highed.dom.cr('div', 'highed-font-picker-buttons'),
                highed.dom.ap(
                    highed.dom.cr('div', 'highed-font-style'),
                    boldBtn.button,
                    italicBtn.button
                ),
                color
            )
        );

        // /////////////////////////////////////////////////////////////////////

        return {
            set: set,
            container: container
        };
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/


/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format
highed.PushButton = function (parent, icon, state) {
    var button = highed.dom.cr('span', 'highed-pushbutton fa fa-' + icon),
        events = highed.events();

    function updateCSS() {
        if (state) {
            button.className += ' highed-pushbutton-active';
        } else {
            button.className = button.className.replace(
                ' highed-pushbutton-active',
                ''
            );
        }
    }


    function set(flag) {
        state = flag;
        updateCSS();
    }

    highed.dom.on(button, 'click', function () {
        state = !state;
        updateCSS();
        events.emit('Toggle', state);
    });

    if (!highed.isNull(parent) && parent !== false) {
        highed.dom.ap(parent, button);
    }

    updateCSS();

    return {
        set: set,

        button: button,
        on: events.on
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.Tree = function (parent) {
    var container = highed.dom.cr('div', 'highed-tree'),
        selectedNode = false,
        events = highed.events(),
        expands = {},
        expandState = {},
        selectedID = false,
        selectedPath = false,
        attachedData = {},
        filters = {
            // Filter the series properties based on the series.type property
            series: {
                controller: 'type',
                state: false,
                default: 'line'
            },
            plotOptions: {
                controller: 'type',
                state: false,
                default: 'line'
            }
        };

    // //////////////////////////////////////////////////////////////////////////

    function createNode(child, pnode, instancedData, productFilter, myIndex) {

        var id =  (child.meta.ns ? child.meta.ns + '.' : '') +
    (!isNaN(myIndex) ? '[' + myIndex + '].' : '') +
    child.meta.name;

        var node = highed.dom.cr(
                'div',
                'node',
                '',
                id
            ),
            title = highed.dom.cr(
                'div',
                'parent-title',
                highed.uncamelize(child.meta.title || child.meta.name)
            ),
            body = highed.dom.cr('div', 'parent-body'),
            icon = highed.dom.cr('div', 'exp-col-icon fa fa-folder-o'),
            rightIcons = highed.dom.cr('div', 'right-icons'),
            remIcon = highed.dom.cr('div', 'highed-icon fa fa-minus-square-o'),
            addIcon = highed.dom.cr('div', 'highed-icon fa fa-plus-square-o'),
            index =
        (child.meta.ns ? child.meta.ns + '.' : '') +
        (myIndex ? '[' + myIndex + '].' : '') +
        // (!isNaN(myIndex) ? '[' + myIndex + '].' : '') +
        child.meta.name,
            expanded = true;

        // child.meta.fullname = index;
        child.meta.fullname = (myIndex ? child.meta.name : index);

        function pushExpandState() {
            if (
                (!child.meta.types.array &&
          typeof expandState[index] !== 'undefined') ||
        expanded
            ) {
                expandState[index] = expanded;
            }
        }

        function select() {
            if (selectedNode) {
                selectedNode.className = 'parent-title';
            }

            selectedNode = title;
            selectedPath = index;

            title.className = 'parent-title parent-title-selected';
            events.emit(
                'Select',
                child,
                title.innerHTML,
                child.data,
                productFilter,
                filters[index] ? child.data[filters[index].controller] || filters[index].default : false
            );
        }

        function expand(noSelect, force) {
            if (
                (force || !expanded) &&
        child.children.length &&
        child.meta.hasSubTree
            ) {
                icon.className = 'exp-col-icon fa fa-folder-open-o';
                highed.dom.style(body, { display: 'block' });
                expanded = true;
                pushExpandState();
            }

            if (!noSelect) {
                select();
            }

            highed.emit(
                'UIAction',
                'AdvancedTreeNavigation',
                (child.meta.ns ? child.meta.ns + '.' : '') + child.meta.name
            );
        }

        function collapse(noSelect, noPush) {
            if (expanded && child.children.length && child.meta.hasSubTree) {
                icon.className = 'exp-col-icon fa fa-folder-o';
                highed.dom.style(body, { display: 'none' });
                expanded = false;
                if (!noPush) {
                    pushExpandState();
                }
            }

            if (!noSelect) {
                select();
            }
        }

        function toggle(e) {
            if (expanded) {
                collapse();
            } else {
                expand();
            }

            if (e) {
                return highed.dom.nodefault(e);
            }
        }

        function buildSubtree(activeFilter) {
            body.innerHTML = '';

            // Skip this element if it's not part of the current product
            if (
                productFilter &&
        Object.keys(child.meta.products || {}).length > 0 &&
        !child.meta.products[productFilter]
            ) {
                // return false;
            }

            if (child.meta.isArrayElement) {
                highed.dom.ap(node, highed.dom.ap(rightIcons, remIcon));

                highed.dom.on(remIcon, 'click', function (e) {
                    if (confirm('Really delete the element? This cannot be undone!')) {
                        var delIndex = false;

                        if (selectedNode === node) {
                            selectedNode.className = 'parent-title';
                            selectedNode = false;
                            selectedPath = false;
                            events.emit('ClearSelection');
                        }

                        body.parentNode.removeChild(body);
                        node.parentNode.removeChild(node);

                        // This is a bit convuluted, but we can't do a filter
                        child.meta.arrayData.some(function (a, i) {
                            if (a === child.data) {
                                delIndex = i;
                                return true;
                            }
                        });

                        child.meta.arrayData.splice(delIndex, 1);

                        events.emit('ForceSave', attachedData);

                        highed.snackBar(
                            'Removed element ' +
                delIndex +
                ' from ' +
                (child.meta.ns ? child.meta.ns + '.' : '') +
                child.meta.name
                        );
                    }

                    return highed.dom.nodefault(e);
                });
            }

            // This node contains an array of stuff
            if (child.meta.types.array) {
                highed.dom.ap(node, highed.dom.ap(rightIcons, addIcon));

                icon.className = 'exp-col-icon fa fa-th-list';
                // We need to create one child per. existing entry
                child.data = instancedData[child.meta.name] =
          instancedData[child.meta.name] || [];

                // Force it to be an array
                if (!highed.isArr(child.data)) {
                    child.data = instancedData[child.meta.name] = [
                        instancedData[child.meta.name]
                    ];
                }

                // eslint-disable-next-line no-inner-declarations
                function addArrayElementToList(data, i) {
                    var cat = {
                            meta: {
                                name: child.meta.name,
                                title: child.meta.name + '[' + i + ']',
                                hasSubTree: true,
                                arrayData: instancedData[child.meta.name],
                                isArrayElement: true,
                                types: {
                                    object: 1
                                }
                            },
                            data: data,
                            // We need to clone the children since the builders
                            // add data attributes to them.
                            // If we don't clone, all the sub-stuff will link to
                            // the last child data accross all instances.
                            children: highed.merge([], child.children)
                        },
                        node = createNode(cat, body, data, productFilter, i);
                    if (node) {
                        build(cat, node.body, data, productFilter, i);
                    }
                }

                highed.dom.on(addIcon, 'click', function () {
                    var newElement = {};

                    highed.snackBar('Added new element to ' + child.meta.name);
                    child.data.push(newElement);
                    addArrayElementToList(newElement, child.data.length - 1);

                    events.emit('ForceSave', attachedData);
                });

                child.data.forEach(addArrayElementToList);
            } else {
                // Only allow expanding on non-array parents
                highed.dom.on(node, 'click', function () {
                    expand();
                });

                highed.dom.on(icon, 'click', toggle);

                if (!child.meta.hasSubTree) {
                    icon.className = 'exp-col-icon fa fa-sliders';
                }

                // Add data instance
                if (!child.meta.isArrayElement) {
                    child.data = instancedData[child.meta.name] =
            instancedData[child.meta.name] || {};
                }

                // Collapsed by default
                if (!expandState[index]) {
                    collapse(true, true);
                } else {
                    expand(true, true);
                }

                if (index === selectedPath) {
                    select();
                }
            }
        }

        // //////////////////////////////////////////////////////////////////////

        highed.dom.ap(pnode, highed.dom.ap(node, icon, title), body);

        expands[index] = expand;

        buildSubtree();

        return {
            data: child.data,
            body: body,
            rebuild: buildSubtree
        };
    }


    function expandTo(id) {
        var prev = '';

        if (!id) {
            return;
        }

        id = id
            .replace(/\-\-/g, '.')
            .replace(/\-/g, '.')
            .split('.');

        id.forEach(function (seg) {
            seg = prev + seg;
            if (expands[seg]) {
                expands[seg]();
            }
            prev += seg + '.';
        });
    }


    function build(tree, pnode, instancedData, productFilter, myIndex) {
        if (!tree) {
            return;
        }


        // Handled in createNode, just skip.
        if (tree.meta.types.array) {
            return;
        }

        if (
            productFilter &&
      Object.keys(tree.meta.products || {}).length > 0 &&
      !tree.meta.products[productFilter]
        ) {
            // return;
        }

        if (highed.isArr(tree.children)) {
            tree.children.forEach(function (child) {
                var node, fstate;

                if (tree.meta.fullname && filters[tree.meta.fullname]) {

                    if (child.meta && child.meta.validFor) {

                        var customizedSeriesOption = productFilter.series;
                        if (myIndex) {
                            customizedSeriesOption = [customizedSeriesOption[myIndex]];
                        }

                        var found = false;
                        (customizedSeriesOption || []).forEach(function (serieOption) {
                            fstate = serieOption[filters[tree.meta.fullname].controller] || filters[tree.meta.fullname].default;
                            if (child.meta.validFor[fstate]) {
                                found = true;
                            }
                        });

                        if (!found) {
                            return;
                        }

                    }
                }

                if (!child.meta.leafNode) {
                    node = createNode(child, pnode, instancedData, productFilter);
                    if (node) {
                        build(child, node.body, node.data, productFilter);
                    }
                }
            });
        }
    }

    function getMasterData() {
        return attachedData;
    }

    function isFilterController(ns, name) {
        if (typeof filters[ns] !== 'undefined') {
            return filters[ns].controller === name;
        }
        return false;
    }

    // //////////////////////////////////////////////////////////////////////////

    highed.dom.ap(parent, container);

    // //////////////////////////////////////////////////////////////////////////

    return {
        on: events.on,
        expandTo: expandTo,
        getMasterData: getMasterData,
        isFilterController: isFilterController,
        build: function (tree, data) {
            attachedData = data;
            container.innerHTML = '';
            build(tree, container, data, data);
        }
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.ContextMenu = function (stuff) {
    var container = highed.dom.cr(
            'div',
            'highed-ctx-container-common highed-ctx-container'
        ),
        closeBtn = highed.dom.cr('div', 'highed-ctx-close-button', 'Close'),
        visible = false,
        dimHide = false;

    // /////////////////////////////////////////////////////////////////////////


    function addEntry(entry) {
        var item = highed.dom.cr(
                'div',
                'highed-ctx-item highed-ctx-item-responsive',
                entry.title
            ),
            right = highed.dom.cr('div', 'highed-ctx-child-icon fa fa-angle-right'),
            childCtx;

        if (entry === '-') {
            return highed.dom.ap(container, highed.dom.cr('div', 'highed-ctx-sep'));
        }

        highed.dom.on(item, 'click', function () {
            if (highed.isFn(entry.click)) {
                entry.click();
            }

            hide();
        });

        if (entry.selected) {
            item.className += ' highed-ctx-item-selected';
        }

        if (!highed.isNull(entry.children)) {
            childCtx = highed.ContextMenu(entry.children);

            highed.dom.on(item, 'mouseenter', function (e) {
                childCtx.show(e.clientX, e.clientY);
            });
        }

        highed.dom.ap(
            container,
            highed.dom.ap(
                item,
                entry.icon ?
                    highed.dom.cr(
                        'div',
                        'ctx-child-licon highed-ctx-child-licon-responsive fa fa-' +
                entry.icon
                    ) :
                    false,
                entry.children ? right : false
            )
        );
    }


    function show(x, y, noDimmer) {
        var psize = highed.dom.size(document.body),
            size = highed.dom.size(container);

        if (!noDimmer && visible) {
            return;
        }

        if (x > psize.w - size.w - 20) {
            x = psize.w - size.w - 20;
        }

        if (y > psize.h - size.h - 20) {
            y = psize.h - size.h - 20;
        }

        highed.dom.style(container, {
            'pointer-events': 'auto',
            opacity: 1,
            left: x + 'px',
            top: y + 'px'
        });

        visible = true;
        if (!noDimmer) {
            dimHide = highed.showDimmer(hide, true, true, 10);
        }
    }


    function hide() {
        if (!visible) {
            return;
        }

        highed.dom.style(container, {
            left: '-2000px',
            'pointer-events': 'none',
            opacity: 0
        });

        if (highed.isFn(dimHide)) {
            dimHide();
        }

        visible = false;
    }

    function build(def) {
        container.innerHTML = '';
        highed.dom.ap(container, closeBtn);

        if (highed.isArr(def)) {
            return def.forEach(addEntry);
        }

        Object.keys(def).forEach(function (key) {
            var entry = def[key];
            addEntry(highed.merge({ title: key }, entry));
        });
    }

    // /////////////////////////////////////////////////////////////////////////

    if (stuff) {
        build(stuff);
    }

    highed.dom.on(closeBtn, 'click', hide);

    highed.ready(function () {
        highed.dom.ap(document.body, container);
    });

    // /////////////////////////////////////////////////////////////////////////

    return {
        addEntry: addEntry,
        show: show,
        hide: hide,
        build: build
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var dropdownItems = highed.dom.cr(
        'div',
        'highed-dropdown-items highed-dropdown-items-responsive'
    );

    highed.ready(function () {
        highed.dom.ap(document.body, dropdownItems);
    });


    highed.DropDown = function (parent, extraClasses, icons) {
        var events = highed.events(),
            container = highed.dom.cr('div', 'highed-dropdown ' + extraClasses),
            body = highed.dom.cr('div', 'highed-dropdown-body'),
            arrow = highed.dom.cr('div', 'highed-dropdown-arrow fa fa-caret-down'),
            items = [],
            selectedItem = false,
            expanded = false,
            catcher = false;

        // //////////////////////////////////////////////////////////////////////

        // Build the DOM
        function buildDOM() {
            dropdownItems.innerHTML = '';

            items.forEach(function (item) {
                highed.dom.ap(dropdownItems, item.node);
                // IE fix
                item.node.innerHTML = ''; // item.title();

                const icon = highed.dom.cr('span', 'highed-icon-container');
                if (icons) {
                    highed.dom.ap(icon, highed.dom.style(highed.dom.cr('span'), {
                        'margin-left': '2px',
                        width: '15px',
                        height: '15px',
                        float: 'left',
                        display: 'inline-block',
                        'margin-right': '5px',
                        color: 'rgb(66, 200, 192)',
                        'background-position': 'left middle',
                        'background-size': 'auto 100%',
                        'background-repeat': 'no-repeat',
                        'background-image':
                'url("data:image/svg+xml;utf8,' +
                encodeURIComponent(icons[item.id().toLowerCase()]) +
                '")'
                    }));
                }

                highed.dom.ap(item.node, icon, highed.dom.style(highed.dom.cr('span', '', item.title() || ''), { position: 'relative', top: '3px' }));
            });
        }

        // Collapse the dropdown
        function collapse() {
            if (highed.isFn(catcher)) {
                catcher();
                catcher = false;
            }

            // Should update the container
            if (selectedItem) {
                body.innerHTML = '';
                if (icons) {
                    highed.dom.ap(body, highed.dom.style(highed.dom.cr('span'), {
                        'margin-left': '2px',
                        width: '15px',
                        height: '15px',
                        float: 'left',
                        display: 'inline-block',
                        'margin-right': '5px',
                        color: 'rgb(66, 200, 192)',
                        'background-position': 'left middle',
                        'background-size': 'auto 100%',
                        'background-repeat': 'no-repeat',
                        'background-image':
              'url("data:image/svg+xml;utf8,' +
              encodeURIComponent(icons[selectedItem.id().toLowerCase()]) +
            '")'
                    }));
                }
                body.innerHTML += selectedItem.title();
            }

            highed.dom.style(dropdownItems, {
                opacity: 0,
                left: '-20000px',
                'pointer-events': 'none'
            });

            expanded = false;
        }

        // Expand the dropdown
        function expand(e) {
            buildDOM();

            var pos = highed.dom.pos(container, true),
                s = highed.dom.size(container);

            // Quick hack for IE...
            if (!pos || !pos.x) {
                pos = {
                    x: 10,
                    y: 10
                };
            }

            if (!s || !s.w) {
                s = {
                    w: 200,
                    h: 200
                };
            }

            // Need to check the height + y to see if we need to move it

            highed.dom.style(dropdownItems, {
                opacity: 1,
                'pointer-events': 'auto',
                left: pos.x + 'px',
                top: pos.y + s.h + 4 + 'px',
                width: s.w - 1 + 'px',
                'min-height': s.h + 'px'
            });

            catcher = highed.showDimmer(collapse, true, true, 500);

            expanded = true;
        }

        // Toggle expansion
        function toggle(e) {
            expanded = !expanded;
            if (expanded) {
                return expand(e);
            }
            collapse();

            return expanded;
        }


        function addItem(item) {
            if (item && item.id) {
                if (!highed.isBasic(item.id)) {
                    item.id = '1234';
                }
            }

            if (highed.isBasic(item)) {
                item = {
                    id: item,
                    title: item
                };
            }

            if (
                items.filter(function (b) {
                    return b.id() === item.id;
                }).length > 0
            ) {
                return false;
            }

            var node = highed.dom.cr('div', 'highed-dropdown-item'),
                id = highed.uuid(),
                index = items.length,
                itemInstance = {
                    // The node
                    node: node,

                    // Get the index
                    index: function () {
                        return index;
                    },

                    // Get the ID
                    id: function () {
                        return id;
                    },

                    icon: function () {
                        return item.icon;
                    },

                    // Get the title
                    title: function () {
                        return highed.isStr(item) ? item : item.title || '';
                    },

                    // Unselect the item
                    unselect: function () {
                        node.className = 'highed-dropdown-item';
                    },

                    // Select the item
                    select: function (dontEmit) {
                        if (selectedItem) {
                            selectedItem.unselect();
                        }

                        node.className =
              'highed-dropdown-item highed-dropdown-item-selected';
                        selectedItem = itemInstance;

                        body.innerHTML = selectedItem.title();

                        if (!dontEmit) {
                            events.emit('Change', itemInstance);
                        }

                        if (item && highed.isFn(item.select)) {
                            item.select(itemInstance);
                        }

                        collapse();
                    },

                    updateOptions: function (updatedItem) {
                        item = updatedItem;
                    },

                    setId: function (newId) {
                        id = newId;
                    }
                };

            if (!item) {
                return false;
            }

            if (highed.isStr(item) || highed.isNum(item)) {
                node.innerHTML = item;
                id = item;
            } else {

                const icon = highed.dom.cr('span', 'highed-icon-container', (item.icon ? '<i class="fa fa-' + item.icon + '" />' : ''));

                highed.dom.style(icon, {
                    'margin-right': '5px',
                    color: 'rgb(66, 200, 192)'
                });

                highed.dom.ap(node, icon, highed.dom.cr('span', '', item.title || ''));
                id = item.id; // || id;

                if (item.selected) {
                    itemInstance.select();
                }
            }

            highed.dom.on(node, 'click', function (e) {
                itemInstance.select();
                e.cancelBubble = true;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            });

            items.push(itemInstance);

            return itemInstance;
        }


        function clear() {
            items = [];
        }


        function addItems(itemsToAdd) {
            if (highed.isArr(itemsToAdd)) {
                itemsToAdd.forEach(addItem);
            }
        }


        function selectById(id, dontEmit) {
            items.some(function (item) {
                // This is not a typo..
                if (item.id() === id) {
                    item.select(dontEmit);
                    return true;
                }
            });
        }

        function updateByIndex(index, details, newId) {
            items[index].updateOptions(details);
            if (newId) {
                items[index].setId(newId);
            }
        }


        function selectByIndex(index, dontEmit) {
            if (index >= 0 && index < items.length) {
                items[index].select(dontEmit);
            }
        }

        function selectAll() {
            return items;
        }

        function deleteByIndex(index) {
            items.splice(index, 1);
        }

        function sliceList(length) {
            items = items.slice(0, length);
        }

        function getSelectedItem() {
            return selectedItem;
        }

        // /////////////////////////////////////////////////////////////////////////

        if (parent) {
            parent = highed.dom.get(parent);
            highed.dom.ap(parent, container);
        }

        highed.dom.ap(container, body, arrow);

        highed.dom.on(container, 'click', toggle);

        return {
            container: container,
            selectById: selectById,
            selectByIndex: selectByIndex,
            selectAll: selectAll,
            updateByIndex: updateByIndex,
            deleteByIndex: deleteByIndex,
            sliceList: sliceList,
            addItems: addItems,
            getSelectedItem: getSelectedItem,
            addItem: addItem,
            clear: clear,
            on: events.on
        };
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.Movable = function (
    target,
    constrain,
    constrainParent,
    parentNode,
    min,
    doOffset
) {
    var events = highed.events(),
        moving = false;

    constrain = (constrain || 'XY').toUpperCase();
    target = highed.dom.get(target);

    if (target) {
        highed.dom.on(target, ['mousedown', 'touchstart'], function (e) {
            //   if (moving) return;

            moving = true;
            var cp = highed.dom.pos(target),
                ps = highed.dom.size(parentNode || target.parentNode),
                ns = highed.dom.size(target),
                x = cp.x,
                y = cp.y,
                offsetX = 0,
                offsetY = 0,
                mover = highed.dom.on(
                    document.body,
                    ['mousemove', 'touchmove'],
                    function (moveE) {
                        if (constrain === 'X' || constrain === 'XY') {
                            x =
                cp.x + ((moveE.clientX || moveE.touches[0].clientX) - offsetX);

                            if (constrainParent) {
                                if (x < 0) {
                                    x = 0;
                                }
                                if (x > ps.w - ns.w) {
                                    x = ps.w - ns.w;
                                }
                            }
                        }
                        if (constrain === 'Y' || constrain === 'XY') {
                            y =
                cp.y + ((moveE.clientY || moveE.touches[0].clientY) - offsetY);

                            if (constrainParent) {
                                if (y < 0) {
                                    y = 0;
                                }
                                if (y > ps.h - ns.h) {
                                    y = ps.h - ns.h;
                                }
                            }
                        }

                        if (min && x < min.x) {
                            x = min.x;
                        }
                        if (min && y < min.y) {
                            y = min.y;
                        }

                        highed.dom.style(target, {
                            left: x - (doOffset ? ns.w : 0) + 'px',
                            top: y + 'px'
                        });

                        events.emit('Moving', x, y);

                        moveE.cancelBubble = true;
                        moveE.preventDefault();
                        moveE.stopPropagation();
                        moveE.stopImmediatePropagation();
                        return false;
                    }
                ),
                upper = highed.dom.on(document.body, ['mouseup', 'touchend'], function (
                    upE
                ) {
                    // Detach the document listeners
                    upper();
                    mover();
                    moving = false;
                    document.body.className = document.body.className.replace(
                        ' highed-nosel',
                        ''
                    );
                    events.emit('EndMove', x, y);

                    upE.cancelBubble = true;
                    upE.preventDefault();
                    upE.stopPropagation();
                    upE.stopImmediatePropagation();
                    return false;
                });

            document.body.className += ' highed-nosel';
            offsetX = e.clientX || e.touches[0].clientX;
            offsetY = e.clientY || e.touches[0].clientY;
            events.emit('StartMove', cp.x, cp.y);

            e.cancelBubble = true;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        });
    }

    // //////////////////////////////////////////////////////////////////////////

    return {
        on: events.on
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.Slider = function (parent, attributes) {
    var properties = highed.merge(
            {
                max: 100,
                min: 1,
                step: 1,
                resetTo: 0,
                value: 0
            },
            attributes
        ),
        events = highed.events(),
        value = properties.value || properties.resetTo,
        container = highed.dom.cr('div', 'highed-slider'),
        indicator = highed.dom.cr('div', 'highed-slider-indicator'),
        textIndicator = highed.dom.cr('div', 'highed-slider-text-indicator'),
        sliderBackground = highed.dom.cr('div', 'highed-slider-background'),
        resetIcon = highed.dom.cr('div', 'highed-slider-reset fa fa-undo'),

        numberInput = highed.dom.cr('input', 'highed-slider-input'),
        mover = highed.Movable(indicator, 'x', true, sliderBackground);

    numberInput.type = 'number';
    numberInput.value = value;
    numberInput.max = properties.max;
    numberInput.min = 0;
    // //////////////////////////////////////////////////////////////////////////

    function updateText() {
        textIndicator.innerHTML = value;

        if (value === 'null' || value === null) {
            textIndicator.innerHTML = 'auto';
        }
        if (value === 'undefined' || typeof value === 'undefined') {
            textIndicator.innerHTML = 'auto';
        }
    }

    // Calculate the indicator X
    function calcIndicator() {
        var x = 0,
            s = highed.dom.size(sliderBackground),
            ms = highed.dom.size(indicator);

        if (!highed.isNum(value) || !value) {
            x = 0;
        } else {
            x =
        (value - properties.min) /
        (properties.max - properties.min) *
        (s.w - ms.w);
        }

        highed.dom.style(indicator, {
            left: x + 'px'
        });
    }

    // Waits until the slider is in the dom
    function tryUpdateIndicators() {
        updateText();
        if (container.parentNode) {
            calcIndicator();
        } else {
            window.setTimeout(tryUpdateIndicators, 10);
        }
    }


    function set(newValue) {
        value = highed.clamp(properties.min, properties.max, newValue);
        textIndicator.innerHTML = value;
        calcIndicator();
    }

    mover.on('Moving', function (x) {
        var s = highed.dom.size(sliderBackground),
            ms = highed.dom.size(indicator);

        // Set the value based on the new X
        value =
      properties.min +
      Math.round(x / (s.w - ms.w) * (properties.max - properties.min));

        numberInput.value = value;
        textIndicator.innerHTML = value;
        if (!highed.onPhone()) {
            events.emit('Change', value);
        }
    });

    highed.dom.on(numberInput, 'keyup', function (e) {

        if (e.target.value && !isNaN(e.target.value)) {
            if (parseInt(e.target.value, 10) > properties.max) {
                value = properties.max;
            } else {
                value = parseInt(e.target.value, 10);
            }

            textIndicator.innerHTML = value;
            calcIndicator();
            if (!highed.onPhone()) {
                events.emit('Change', value);
            }
        }

    });

    mover.on('StartMove', function () {
        if (highed.onPhone()) {
            textIndicator.className =
        'highed-slider-text-indicator highed-slider-text-indicator-popup';
        }
    });

    mover.on('EndMove', function () {
        if (highed.onPhone()) {
            textIndicator.className = 'highed-slider-text-indicator';
            // We're not emitting changes until done on mobile
            events.emit('Change', value);
        }
    });

    // //////////////////////////////////////////////////////////////////////////

    highed.dom.on(resetIcon, 'mouseover', function (e) {
    //  highed.Tooltip(e.clientX, e.clientY, 'Reset to initial value');
    });

    highed.dom.on(resetIcon, 'click', function () {
        value = properties.resetTo;
        calcIndicator();

        if (value === 'null') {
            value = null;
        }
        if (value === 'undefined') {
            value = undefined;
        }

        updateText();
        events.emit('Change', value);
    });

    if (parent) {
        parent = highed.dom.get(parent);
        highed.dom.ap(parent, container);
    }

    highed.dom.ap(
        container,
        sliderBackground,
        numberInput,
        resetIcon,
        highed.dom.ap(indicator, textIndicator)
    );

    tryUpdateIndicators();

    // Public interface
    return {
        on: events.on,
        set: set,
        container: container
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

function parseCSV(inData, delimiter) {
    var isStr = highed.isStr,
        isArr = highed.isArray,
        isNum = highed.isNum,
        csv = inData || '',
        result = [],
        options = {
            delimiter: delimiter
        },
        potentialDelimiters = {
            ',': true,
            ';': true,
            '\t': true
        },
        delimiterCounts = {
            ',': 0,
            ';': 0,
            '\t': 0
        };
    // The only thing CSV formats have in common..
    rows = (csv || '').replace(/\r\n/g, '\n').split('\n');
    // If there's no delimiter, look at the first few rows to guess it.

    if (!options.delimiter) {
        // eslint-disable-next-line array-callback-return
        rows.some(function (row, i) {
            if (i > 10) {
                return true;
            }

            var inStr = false,
                c,
                cn,
                cl,
                token = '';

            for (var j = 0; j < row.length; j++) {
                c = row[j];
                cn = row[j + 1];
                cl = row[j - 1];

                if (c === '"') {
                    if (inStr) {
                        if (cl !== '"' && cn !== '"') {
                            // The next non-blank character is likely the delimiter.

                            while (cn === ' ') {
                                cn = row[++j];
                            }

                            if (potentialDelimiters[cn]) {
                                delimiterCounts[cn]++;
                                return true;
                            }

                            inStr = false;
                        }
                    } else {
                        inStr = true;
                    }
                } else if (potentialDelimiters[c]) {
                    if (!isNaN(Date.parse(token))) {
                        // Yup, likely the right delimiter
                        token = '';
                        delimiterCounts[c]++;
                    } else if (!isNum(token) && token.length) {
                        token = '';
                        delimiterCounts[c]++;
                    }
                } else {
                    token += c;
                }
            }
        });

        options.delimiter = ';';

        if (
            delimiterCounts[','] > delimiterCounts[';'] &&
      delimiterCounts[','] > delimiterCounts['\t']
        ) {
            options.delimiter = ',';
        }

        if (
            delimiterCounts['\t'] >= delimiterCounts[';'] &&
      delimiterCounts['\t'] >= delimiterCounts[',']
        ) {
            options.delimiter = '\t';
        }
    }

    rows.forEach(function (row, rowNumber) {
        var cols = [],
            inStr = false,
            i = 0,
            j,
            token = '',
            guessedDel,
            c,
            cp,
            cn;

        function pushToken() {
            token = (token || '').replace(/\,/g, '');
            if (!token.length) {
                token = null;
                // return;
            }

            if (isNum(token)) {
                token = parseFloat(token);
            }

            cols.push(token);
            token = '';
        }

        for (i = 0; i < row.length; i++) {
            c = row[i];
            cn = row[i + 1];
            cp = row[i - 1];

            if (c === '"') {
                if (inStr) {
                    pushToken();
                } else {
                    inStr = false;
                }

                // Everything is allowed inside quotes
            } else if (inStr) {
                token += c;
                // Check if we're done reading a token
            } else if (c === options.delimiter) {
                pushToken();

                // Append to token
            } else {
                token += c;
            }

            // Push if this was the last character
            if (i === row.length - 1) {
                pushToken();
            }
        }

        result.push(cols);
    });
    return result;
}


highed.DataTable = function (parent, attributes) {
    var properties = highed.merge(
            {
                checkable: true,
                importer: {}
            },
            attributes
        ),
        events = highed.events(),
        container = highed.dom.cr('div', 'highed-dtable-container'),
        frame = highed.dom.cr('div', 'highed-dtable-table-frame highed-scrollbar'),
        movementBar = highed.dom.cr('div', 'highed-dtable-movement-bar', ''),
        table = highed.dom.cr('table', 'highed-dtable-table'),
        thead = highed.dom.cr('thead', 'highed-dtable-head'),
        tbody = highed.dom.cr('tbody', 'highed-dtable-body'),
        tableTail = highed.dom.cr(
            'div',
            'highed-dtable-table-tail',
            'Only the first 500 rows are shown.'
        ),
        colgroup = highed.dom.cr('colgroup'),
        leftBar = highed.dom.cr('div', 'highed-dtable-left-bar'),
        hideCellsDiv = highed.dom.cr('div', 'highed-dtable-hide-cells'),
        topBar = highed.dom.cr('div', 'highed-dtable-top-bar'),
        topLetterBar = highed.dom.cr('div', 'highed-dtable-top-letter-bar'),
        topColumnBar = highed.dom.cr('div', 'highed-dtable-top-column-bar'),
        topLeftPanel = highed.dom.cr('div', 'highed-dtable-top-left-panel'),
        // checkAll = highed.dom.cr('input'),
        mainInput = highed.dom.cr('textarea', 'highed-dtable-input'),
        cornerPiece = highed.dom.cr('div', 'highed-dtable-corner-piece'),
        weirdDataModal = highed.OverlayModal(false, {
            // zIndex: 20000,
            showOnInit: false,
            width: 300,
            height: 350
        }),
        weirdDataContainer = highed.dom.cr(
            'div',
            'highed-dtable-weird-data highed-box-size highed-errobar-body'
        ),
        weirdDataIgnore = highed.dom.cr(
            'button',
            'highed-ok-button',
            'No, this looks right'
        ),
        weirdDataFix = highed.dom.cr(
            'button',
            'highed-ok-button',
            'Yeah, this looks wrong'
        ),
        loadIndicator = highed.dom.cr(
            'div',
            'highed-dtable-load-indicator',
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> Loading'
        ),
        dropZone = highed.dom.cr(
            'div',
            'highed-dtable-drop-zone highed-transition'
        ),
        liveDataFrame = highed.dom.cr(
            'div',
            'highed-box-size highed-dtable-gsheet-frame'
        ),
        gsheetFrame = highed.dom.cr(
            'div',
            'highed-box-size highed-dtable-gsheet-frame'
        ),
        gsheetContainer = highed.dom.cr(
            'div',
            'highed-box-size highed-prettyscroll highed-dtable-gsheet'
        ),
        liveDataContainer = highed.dom.cr(
            'div',
            'highed-box-size highed-prettyscroll highed-dtable-gsheet'
        ),
        liveDataInput = highed.dom.cr('input', 'highed-imp-input-stretch'),
        liveDataIntervalInput = highed.dom.cr('input', 'highed-imp-input-stretch'),
        liveDataTypeSelect = highed.DropDown(),

        liveDataTypeContainer = highed.dom.cr('div', 'highed-customize-group'),
        liveDataTypeMasterNode = highed.dom.cr('div', 'highed-customize-master-dropdown'),

        gsheetID = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetWorksheetID = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetRefreshTime = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetStartRow = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetEndRow = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetStartCol = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetEndCol = highed.dom.cr(
            'input',
            'highed-box-size highed-dtable-gsheet-id'
        ),
        gsheetCancelButton = highed.dom.cr(
            'button',
            'highed-import-button green padded',
            'Detach Sheet From Chart'
        ),
        switchRowColumns = highed.dom.cr(
            'button',
            'switch-column-button highed-template-tooltip',
            '<i class="fa fa-refresh" aria-hidden="true"></i> <span class="highed-tooltip-text highed-template-tooltip-text-left">Switch Rows/Columns</span>'
        ),
        gsheetLoadButton = highed.dom.cr(
            'button',
            'highed-import-button green padded',
            'Load Spreadsheet'
        ),
        liveDataLoadButton = highed.dom.cr(
            'button',
            'highed-import-button green padded',
            'Load Live Data'
        ),
        liveDataCancelButton = highed.dom.cr(
            'button',
            'highed-import-button green padded',
            'Cancel'
        ),
        detailValue = 0,
        isInGSheetMode = false,
        isInLiveDataMode = false,
        mainInputCb = [],
        rawCSV = false,
        mainInputCloseCb = false,
        toolbar,
        importModal = highed.OverlayModal(false, {
            minWidth: 600,
            minHeight: 600
        }),
        importer = highed.DataImporter(importModal.body, properties.importer),
        rows = [],
        gcolumns = [],
        changeTimeout = false,
        dataModal,
        surpressChangeEvents = false,
        monthNumbers = {
            JAN: 1,
            FEB: 2,
            MAR: 3,
            APR: 4,
            MAY: 5,
            JUN: 6,
            JUL: 7,
            AUG: 8,
            SEP: 9,
            OCT: 10,
            NOV: 11,
            DEC: 12
        },
        selectedRowIndex = 0,
        keyValue = 'A',
        tempKeyValue = 'A',
        // checkAll.type = 'checkbox',
        selectedFirstCell = [],
        selectedEndCell = [],
        selectedCopyFirstCell = [],
        selectedCopyEndCell = [],
        lastSelectedCell = [null, null],
        allSelectedCells = [],
        allSelectedCopyCells = [],
        selectedHeaders = [],
        columnsToHighlight = [],
        dataFieldsUsed = [],
        inCopyOverCellMode = false;
    // eslint-disable-next-line no-sequences
    // eslint-disable-next-line no-unused-expressions
    moveToColumn = null,
    dragHeaderMode = false,
    globalContextMenu = highed.ContextMenu([
        {
            title: 'Insert Row Above',
            icon: 'plus',
            click: function () {
                events.emit('ColumnMoving');
                addRowBefore(selectedFirstCell[1]);
                highed.emit('UIAction', 'AddRowBeforeHighlight');
                events.emit('ColumnMoved');
            }
        },
        {
            title: 'Insert Row Below',
            icon: 'plus',
            click: function () {
                events.emit('ColumnMoving');
                addRowAfter(selectedEndCell[1]);
                highed.emit('UIAction', 'AddRowAfterHighlight');
                events.emit('ColumnMoved');
            }
        },
        '-',
        {
            title: 'Remove Row',
            icon: 'trash',
            click: function () {
                highed.emit('UIAction', 'BtnDeleteRow');

                if (!confirm(highed.L('dgDeleteRow'))) {
                    return;
                }

                highed.emit('UIAction', 'DeleteRowConfirm');

                rows.forEach(function (row, index) {
                    // if (row.isChecked()) {
                    if (row.number === selectedFirstCell[1]) {
                        row.destroy();
                        emitChanged();
                    }
                    // }
                });
                rebuildRows();
            }
        },
        {
            title: highed.L('dgDelCol'),
            icon: 'trash',
            click: function () {
                if (confirm(highed.L('dgDelColConfirm'))) {
                    events.emit('ColumnMoving');
                    delCol(selectedFirstCell[0]);
                    updateColumns();
                    events.emit('ColumnMoved');
                }
            }
        },
        '-',
        {
            title: highed.L('dgInsColBefore'),
            icon: 'plus',
            click: function () {
                events.emit('ColumnMoving');
                insertCol(selectedFirstCell[0]);
                events.emit('ColumnMoved');
            }
        },
        {
            title: highed.L('dgInsColAfter'),
            icon: 'plus',
            click: function () {
                events.emit('ColumnMoving');
                insertCol(selectedFirstCell[0] + 1);
                events.emit('ColumnMoved');
            }
        }
    ]);

    const DEFAULT_COLUMN = 9,
        DEFAULT_ROW = 20;


    highed.dom.ap(hideCellsDiv, switchRowColumns);

    highed.dom.on(mainInput, 'click', function (e) {
        return highed.dom.nodefault(e);
    });

    highed.dom.style(liveDataIntervalInput, {
        padding: '8px'
    });

    var mouseDown = false;
    document.body.onmousedown = function () {
        mouseDown = true;
    };
    document.body.onmouseup = function () {
        mouseDown = false;
    };

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
            allSelectedCells.forEach(function (cell) {
                cell.deleteContents();
            });
        }
    }, false);

    document.addEventListener('contextmenu', function (e) {
        if (e.path && e.path.indexOf(container) > -1) {
            globalContextMenu.show(e.clientX, e.clientY, true);
            return highed.dom.nodefault(e);
        }
    }, false);

    highed.dom.on(document.querySelector('body'), 'click', function () {
        globalContextMenu.hide();
    });

    highed.dom.on(cornerPiece, 'mousedown', function (e) {
        inCopyOverCellMode = true;
        deselectAllCells();
    });


    highed.dom.ap(frame, cornerPiece);
    // //////////////////////////////////////////////////////////////////////////

    // Handle drag 'n drop of files
    function handleFileUpload(f, cb) {
        if (f.type !== 'text/csv') {
            return highed.snackBar('The file is not a valid CSV file');
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            clear();
            // events.emit('ClearSeriesForImport');
            loadCSV({ csv: e.target.result }, null, true, cb);
        };

        reader.readAsText(f);
    }


    frame.ondrop = function (e) {
        e.preventDefault();

        var d = e.dataTransfer;
        var f;
        var i;

        if (d.items) {
            for (i = 0; i < d.items.length; i++) {
                f = d.items[i];
                if (f.kind === 'file') {
                    handleFileUpload(f.getAsFile());
                }
            }
        } else {
            for (i = 0; i < d.files.length; i++) {
                f = d.files[i];
                handleFileUpload(f);
            }
        }
    };

    frame.ondragover = function (e) {
        e.preventDefault();
    };

    // //////////////////////////////////////////////////////////////////////////

    function showDataImportError() {
        highed.dom.style(weirdDataContainer, {
            display: 'block'
        });
    }

    function hideDataImportError() {
        highed.dom.style(weirdDataContainer, {
            display: 'none'
        });
    }

    function emitChanged(noDelay) {
        window.clearTimeout(changeTimeout);

        if (isInGSheetMode) {
            return;
        }
        if (isInLiveDataMode) {
            return;
        }

        if (surpressChangeEvents) {
            return;
        }

        if (noDelay) {
            return events.emit('Change', getHeaderTextArr(), toData());
        }

        // We use an interval to stop a crazy amount of changes to be
        // emitted in succession when e.g. loading sets.
        changeTimeout = window.setTimeout(function () {
            if (!isInGSheetMode && !isInLiveDataMode) {
                events.emit('Change', getHeaderTextArr());
            }
        }, 1000);
    }

    function makeEditable(target, value, fn, keyup, close, dontFocus) {

        if (mainInputCb.length) {
            mainInputCb = mainInputCb.filter(function (fn) {
                fn();
                return false;
            });
        }

        if (mainInputCloseCb) {
            mainInputCloseCb();
        }

        mainInputCloseCb = close;

        mainInput.value = value;
        // mainInput.setSelectionRange(0, mainInput.value.length);

        mainInputCb.push(
            highed.dom.on(mainInput, 'keydown', function (e) {
                // (highed.isFn(fn) && fn(mainInput.value));
                if (highed.isFn(keyup)) {
                    return keyup(e);
                }
            })
        );

        mainInputCb.push(
            highed.dom.on(mainInput, 'keyup', function (e) {
                // Super hack to allow pasting CSV into cells
                var ps = highed.parseCSV(mainInput.value);
                if (ps.length > 1) { // TODO: Need to fix this...
                    if (
                        confirm(
                            'You are about to load CSV data. This will overwrite your current data. Continue?'
                        )
                    ) {
                        rawCSV = mainInput.value;
                        highed.emit('UIAction', 'PasteCSVAttempt');
                        loadCSV({
                            csv: rawCSV
                        }, null, true, function () {

                        });
                        /*
            return loadRows(ps, function() {
              if (rows.length > 0) rows[0].columns[0].focus();
              events.emit('InitLoaded');
              events.emit('AssignDataForFileUpload', rows[0].length);
            });*/
                    }
                    return;
                }

                return highed.isFn(fn) && fn(mainInput.value);
            })
        );

        highed.dom.ap(target, mainInput);

        if (!dontFocus) {
            mainInput.focus();
        }

    }

    // //////////////////////////////////////////////////////////////////////////
    function highlightLeft(colNumber) {
        columnsToHighlight.forEach(function (highlightedColumn) {
            highlightedColumn.element.classList.remove('highlight-right');
        });

        rows.forEach(function (row) {
            if (row.columns[colNumber].element.className.indexOf('highlight-right') === -1) {
                row.columns[colNumber].element.className += ' highlight-right';
                columnsToHighlight.push(row.columns[colNumber]);
            }
        });

        if (gcolumns[colNumber].header.className.indexOf('highlight-right') === -1) {
            gcolumns[colNumber].header.className += ' highlight-right';
            columnsToHighlight.push({
                element: gcolumns[colNumber].header
            });
        }

        if (gcolumns[colNumber].letter.className.indexOf('highlight-right') === -1) {
            gcolumns[colNumber].letter.className += ' highlight-right';
            columnsToHighlight.push({
                element: gcolumns[colNumber].letter
            });
            moveToColumn = colNumber;
        }
    }

    // //////////////////////////////////////////////////////////////////////////
    function Column(row, colNumber, val, keyVal) {

        var value = typeof val === 'undefined' || typeof val === 'object' || (val === 'null') ? null : val, // object check for ie11/edge
            col = highed.dom.cr('td', 'highed-dtable-cell'),
            colVal = highed.dom.cr('div', 'highed-dtable-col-val', value),
            input = highed.dom.cr('input'),
            exports = {};
        function goLeft() {
            if (colNumber >= 1) {
                row.columns[colNumber - 1].focus();
            } else {
                // Go up to the last column
                if (row.number - 1 >= 0) {
                    rows[row.number - 1].columns[
                        rows[row.number - 1].columns.length - 1
                    ].focus();
                }
            }
        }

        function goRight() {
            if (colNumber < row.columns.length - 1) {
                row.columns[colNumber + 1].focus();
            } else {
                // Go down on the first column
                if (row.number < rows.length - 1) {
                    rows[row.number + 1].columns[0].focus();
                }
            }
        }

        function goUp() {
            if (row.number > 0 && rows[row.number - 1].columns.length > colNumber) {
                rows[row.number - 1].columns[colNumber].focus();
            }
        }

        function goBelow() {
            if (
                row.number < rows.length - 1 &&
        rows[row.number + 1].columns.length > colNumber
            ) {
                rows[row.number + 1].columns[colNumber].focus();
            }
        }

        function handleKeyup(e) {
            // Go the the column to the left
            if (e.keyCode === 37) {
                goLeft();
                return highed.dom.nodefault(e);

                // Go to the column above
            } if (e.keyCode === 38) {
                goUp();
                return highed.dom.nodefault(e);

                // Go to the column to the right
            } if (e.keyCode === 39 || e.keyCode === 9) {
                goRight();
                return highed.dom.nodefault(e);

                // Go to the column below
            } if (e.keyCode === 40) {
                goBelow();
                return highed.dom.nodefault(e);

                // Go to next row
            } if (e.keyCode === 13) {
                // If we're standing in the last column of the last row,
                // insert a new row.
                if (row.number === rows.length - 1) {
                    // && colNumber === rows.columns.length - 1) {
                    events.emit('ColumnMoving');
                    addRow();
                    rows[row.number + 1].columns[0].focus();
                    events.emit('ColumnMoved');

                } else {
                    goBelow();
                }
                return highed.dom.nodefault(e);
            }
        }

        function selContents() {
            input.setSelectionRange(0, input.value.length);
        }

        function deleteContents() {
            colVal.innerHTML = '';
            mainInput.value = '';
            value = null;
            emitChanged();
        }

        function setValue(newValue) {
            colVal.innerHTML = newValue;
            mainInput.value = newValue;
            value = newValue;
            emitChanged();
        }

        function focus(dontFocus) {

            deselectAllCells();

            function checkNull(value) {
                return value === null || value === '';
            }
            mainInput.className = 'highed-dtable-input';
            mainInput.draggable = false;

            highed.dom.on(mainInput, 'dragstart', function (e) {
                highed.dom.nodefault(e);
                return false;
            });
            highed.dom.on(mainInput, 'ondrop', function (e) {
                highed.dom.nodefault(e);
                return false;
            });

            makeEditable(
                col,
                value,
                function (val) {
                    var changed = value !== val;
                    value = checkNull(val) ? null : val;
                    colVal.innerHTML = value;
                    if (changed) {
                        emitChanged();
                    }
                },
                handleKeyup,
                dontFocus
            );


            highed.dom.style(cornerPiece, {
                top: ((highed.dom.pos(col).y + highed.dom.size(col).h - 3)) + 'px',
                left: ((highed.dom.pos(col).x + highed.dom.size(col).w - 3)) + 'px',
                display: 'block'
            });

            row.select();
        }

        function deselectCell() {
            col.classList.remove('cell-selected');
        }

        function deselectCopyCell() {
            col.classList.remove('cell-copy-selected');
        }

        function selectCell() {
            if (col.className.indexOf('cell-selected') === -1) {
                col.className += ' cell-selected';
                if (allSelectedCells.indexOf(exports) === -1) {
                    allSelectedCells.push(exports);
                }
            }
        }

        function select() {
            selectedEndCell[0] = colNumber;
            selectedEndCell[1] = row.number;

            selectNewCells(selectedFirstCell, selectedEndCell);
        }

        function selectCellToCopy() {
            if (col.className.indexOf('cell-copy-selected') === -1) {
                col.className += ' cell-copy-selected';
                if (allSelectedCopyCells.indexOf(exports) === -1) {
                    allSelectedCopyCells.push(exports);
                }
            }
        }

        function destroy() {
            row.node.removeChild(col);
            col.innerHTML = '';
            colVal.innerHTML = '';
        }

        function getVal() {
            return value;
        }

        function addToDOM(me) {
            colNumber = me || colNumber;
            highed.dom.ap(row.node, highed.dom.ap(col, colVal));
        }

        highed.dom.on(col, 'mouseup', function (e) {
            if (inCopyOverCellMode) {
                inCopyOverCellMode = false;

                const newValue = rows[selectedCopyFirstCell[1]].columns[selectedCopyFirstCell[0]].value();
                allSelectedCopyCells.forEach(function (cell) {
                    cell.setValue(newValue);
                    cell.deselectCopyCell();
                });

                allSelectedCopyCells = [];

            } else if (selectedFirstCell[0] === selectedEndCell[0] &&
          selectedFirstCell[1] === selectedEndCell[1]) {
            // Have not dragged anywhere else on the grid. So the user has just clicked on a cell.

                lastSelectedCell[0] = colNumber;
                lastSelectedCell[1] = row.number;
                selectedCopyFirstCell[0] = selectedFirstCell[0];
                selectedCopyFirstCell[1] = selectedFirstCell[1];
                selectedCopyEndCell[1] = selectedEndCell[1];
                selectedCopyEndCell[0] = selectedEndCell[0];
                selectedHeaders = [];
                focus();
                globalContextMenu.hide();
            }
        });

        highed.dom.on([col, colVal], 'mouseover', function (e) {
            if (mouseDown) {
                if (inCopyOverCellMode) {

                    if (colNumber === selectedCopyEndCell[0]) {
                        selectedCopyEndCell[1] = row.number;
                        selectedCopyEndCell[0] = selectedCopyFirstCell[0];
                    } else if (selectedCopyEndCell[1] === row.number) {
                        selectedCopyEndCell[1] = selectedCopyFirstCell[1];
                        selectedCopyEndCell[0] = colNumber;
                    }

                    selectCellsToMove(selectedCopyFirstCell, selectedCopyEndCell);

                } else if (dragHeaderMode) {
                    highlightLeft(colNumber);
                } else {
                    select();
                }
            }
        });
        highed.dom.on(col, 'mousedown', function () {
            if (lastSelectedCell[0] !== colNumber && lastSelectedCell[1] !== row.number) {
                focus();
            }

            selectedFirstCell[0] = colNumber;// keyVal;
            selectedEndCell[0] = colNumber;// keyVal;
            selectedFirstCell[1] = row.number;
            selectedEndCell[1] = row.number;

            selectedCopyFirstCell[0] = selectedFirstCell[0];
            selectedCopyFirstCell[1] = selectedFirstCell[1];
            selectedCopyEndCell[1] = selectedEndCell[1];
            selectedCopyEndCell[0] = selectedEndCell[0];

        });

        if (rows.length <= 500) {
            addToDOM();
        }

        exports = {
            focus: focus,
            value: getVal,
            destroy: destroy,
            addToDOM: addToDOM,
            selectCell: selectCell,
            deleteContents: deleteContents,
            deselectCell: deselectCell,
            deselectCopyCell: deselectCopyCell,
            element: col,
            setValue: setValue,
            rowNumber: row.number,
            colNumber: colNumber,
            selectCellToCopy: selectCellToCopy,
            updateColNumber: function (i) {
                colNumber = i;
                exports.colNumber = i;
            }
        };

        return exports;
    }

    function deselectAllCells() {

        allSelectedCells.forEach(function (cells) {
            cells.deselectCell();
        });

        allSelectedCells = [];
        selectedEndCell[0] = null;
        selectedEndCell[1] = null;
        selectedFirstCell[0] = null;
        selectedFirstCell[1] = null;
    }

    function selectCellsToMove(firstCell, endCell) { // selectedCopyFirstCell, selectedCopyEndCell

        allSelectedCopyCells = allSelectedCopyCells.filter(function (cell) {
            if ((cell.rowNumber > endCell[1] || cell.colNumber > endCell[0]) || (cell.rowNumber < firstCell[1] || cell.colNumber < firstCell[0])) {
                cell.deselectCopyCell();
                return false;
            }

            return cell;
        });

        var tempColValue,
            lowCell,
            highCell,
            cell;

        if (firstCell[0] <= endCell[0]) {
            tempColValue = firstCell[0];
            cell = endCell;
        } else if (firstCell[0] > endCell[0]) {
            tempColValue = endCell[0];
            cell = firstCell;
        }

        lowCell = (firstCell[1] > endCell[1] ? endCell : firstCell);
        highCell = (firstCell[1] < endCell[1] ? endCell : firstCell);


        while (tempColValue <= cell[0]) {
            for (var i = lowCell[1]; i <= highCell[1]; i++) {
                if (rows[i]) {
                    rows[i].columns[tempColValue].selectCellToCopy();
                }
            }
            tempColValue++;
        }

    }

    function selectNewCells(firstCell, endCell) { // firstCell, endCell

        if (firstCell.length === 0 || endCell.length === 0 ||   // Weird bug when opening the console and hovering over cells
      (firstCell[0] === null || firstCell[1] === null)
        ) {
            return;
        }

        allSelectedCells = allSelectedCells.filter(function (cell) {
            if ((cell.rowNumber > endCell[1] || cell.colNumber > endCell[0]) || (cell.rowNumber < firstCell[1] || cell.colNumber < firstCell[0])) {
                cell.deselectCell();
                return false;
            }

            return cell;
        });

        var tempColValue,
            lowCell,
            highCell,
            cell;

        if (firstCell[0] <= endCell[0]) {
            tempColValue = firstCell[0];
            cell = endCell;
        } else if (firstCell[0] > endCell[0]) {
            tempColValue = endCell[0];
            cell = firstCell;
        }

        lowCell = (firstCell[1] > endCell[1] ? endCell : firstCell);
        highCell = (firstCell[1] < endCell[1] ? endCell : firstCell);

        while (tempColValue <= cell[0]) {
            for (var i = lowCell[1]; i <= highCell[1]; i++) {
                if (rows[i]) {
                    rows[i].columns[tempColValue].selectCell();
                }
            }
            tempColValue++;
        }
    }

    // //////////////////////////////////////////////////////////////////////////

    function Row(skipAdd) {
        var columns = [],
            row = highed.dom.cr('tr'),
            leftItem = highed.dom.cr('div', 'highed-dtable-left-bar-row', ''),
            checker = highed.dom.cr('div', 'highed-dtable-row'),
            checked = false,
            didAddHTML = false,
            exports = {};

        highed.dom.on(leftItem, 'mouseover', function (e) {
            if (mouseDown) {
                selectedEndCell[1] = checker.value;
                selectNewCells(selectedFirstCell, selectedEndCell);
            }
        });

        highed.dom.on(leftItem, 'mousedown', function (e) {
            // if (e.button === 2 && selectedFirstCell.length > 0 && selectedEndCell.length > 0 && selectedFirstCell[0] === 0 && selectedEndCell[0] === (rows[0].columns.length - 1)) {
            deselectAllCells();

            selectedFirstCell[0] = 0;
            selectedEndCell[0] = rows[0].columns.length - 1;
            selectedFirstCell[1] = e.target.value;
            selectedEndCell[1] = e.target.value;

            selectNewCells(selectedFirstCell, selectedEndCell);

        });

        function addCol(val, keyValue) {
            columns.push(Column(exports, columns.length, val, keyValue));
        }

        function insertCol(where) {
            var col = Column(exports, columns.length);
            columns.splice(where, 0, col);
        }

        function select() {

            var o = tbody.querySelector('.highed-dtable-body-selected-row');
            if (o) {
                o.className = '';
            }
            row.className = 'highed-dtable-body-selected-row';
            selectedRowIndex = exports.rowIndex;
        }

        function isChecked() {
            return checked;
        }

        function check(state) {
            checker.checked = checked = state;
        }

        function destroy() {
            if (didAddHTML) {
                leftBar.removeChild(leftItem);
                tbody.removeChild(row);
                row.innerHTML = '';
            }

            rows = rows.filter(function (b) {
                return b !== exports;
            });

            if (rows.length < 2) {
                showDropzone();
            }
        }

        function addToDOM(number) {
            didAddHTML = true;
            exports.number = number;
            checker.innerHTML = number + 1;
            checker.value = number;
            leftItem.value = number;
            highed.dom.ap(tbody, row);

            highed.dom.ap(leftBar, highed.dom.ap(leftItem, checker));
        }

        function rebuildColumns() {
            row.innerHTML = '';
            columns.forEach(function (col, i) {
                col.updateColNumber(i);
                col.addToDOM(i);
            });
        }

        function delCol(which) {
            if (which >= 0 && which < columns.length) {
                columns[which].destroy();
                columns.splice(which, 1);
            }
        }

        highed.dom.on(checker, 'change', function () {
            checked = checker.checked;
        });
        if (rows.length < 500) {
            addToDOM(rows.length);
        } else if (rows.length === 500) {
            highed.dom.style(tableTail, {
                display: 'block'
            });
        }

        exports = {
            destroy: destroy,
            select: select,
            columns: columns,
            number: rows.length,
            addCol: addCol,
            isChecked: isChecked,
            check: check,
            node: row,
            addToDOM: addToDOM,
            insertCol: insertCol,
            rebuildColumns: rebuildColumns,
            delCol: delCol,
            rowIndex: rows.length
        };

        if (!skipAdd) {
            rows.push(exports);
        }

        resize();

        return exports;
    }

    // //////////////////////////////////////////////////////////////////////////

    function rebuildRows() {
        rows.forEach(function (row, i) {
            if (rows.length < 500) {
                row.addToDOM(i);
            }
            row.rowIndex = i;
        });
        emitChanged();
    }

    function rebuildColumns() {
        rows.forEach(function (row) {
            row.rebuildColumns();
        });
    }

    function addRowBefore(index) {
        if (index > 0 && index < rows.length) {
            rows.splice(index - 0, 0, addRow(true, true));
            rebuildRows();
        }
    }

    function addRowAfter(index) {
        if (index >= 0 && index < rows.length) {
            rows.splice(index + 1, 0, addRow(true, true));
            rebuildRows();
        }
    }

    function init() {
        clear();
        surpressChangeEvents = true;

        setTimeout(function () {
            events.emit('InitLoaded');
        }, 10);

        for (var i = 0; i < DEFAULT_ROW; i++) {
            var r = Row(false, keyValue);
        }

        tempKeyValue = 'A';
        for (var j = 0; j < DEFAULT_COLUMN; j++) {
            addCol('Column ' + (j + 1));
        }
        highed.dom.ap(colgroup, highed.dom.cr('col'));
        resize();
        surpressChangeEvents = false;
    }

    function updateColumns() {
        colgroup.innerHTML = '';
        topColumnBar.innerHTML = '';
        topLetterBar.innerHTML = '';
        var resetLetters = 'A';

        gcolumns.forEach(function (col, i) {
            col.colNumber = i;
            col.setLetter(resetLetters);
            resetLetters = getNextLetter(resetLetters);
            col.addToDOM();

        });

        rebuildColumns();

        highed.dom.ap(colgroup, highed.dom.cr('col'));
        resize();
    }

    function getNextLetter(key) {
        if (key === 'Z' || key === 'z') {
            return String.fromCharCode(key.charCodeAt() - 25) + String.fromCharCode(key.charCodeAt() - 25);
        }
        var lastChar = key.slice(-1);
        var sub = key.slice(0, -1);
        if (lastChar === 'Z' || lastChar === 'z') {
            return getNextLetter(sub) + String.fromCharCode(lastChar.charCodeAt() - 25);
        }
        return sub + String.fromCharCode(lastChar.charCodeAt() + 1);


        // eslint-disable-next-line no-unreachable
        return key;
    }

    function addCol(value, where) {
    // The header columns control the colgroup
        var col = highed.dom.cr('col'),
            colNumber = gcolumns.length,
            header = highed.dom.cr('span', 'highed-dtable-top-bar-col'),
            letter = highed.dom.cr('span', 'highed-dtable-top-bar-letter'),
            headerTitle = highed.dom.cr('div', '', (typeof value === 'undefined' || value === 'null' ? null : value)),
            moveHandle = highed.dom.cr('div', 'highed-dtable-resize-handle'),
            options = highed.dom.cr(
                'div',
                'highed-dtable-top-bar-col-options fa fa-chevron-down'
            ),
            exports = {
                col: col,
                header: header,
                headerTitle: headerTitle,
                colNumber: gcolumns.length,
                letter: letter,
                test: true
            },
            mover = highed.Movable(
                moveHandle,
                'X',
                false,
                false,
                {
                    x: 20,
                    y: 0
                },
                true
            ),
            ctx = highed.ContextMenu([
                {
                    title: highed.L('dgSortAsc'),
                    icon: 'sort-amount-asc',
                    click: function () {
                        sortRows(exports.colNumber, 'asc');
                    }
                },
                {
                    title: highed.L('dgSortDec'),
                    icon: 'sort-amount-desc',
                    click: function () {
                        sortRows(exports.colNumber, 'desc');
                    }
                },
                '-',
                {
                    title: highed.L('dgSortAscMonth'),
                    icon: 'sort-amount-asc',
                    click: function () {
                        sortRows(exports.colNumber, 'asc', true);
                    }
                },
                {
                    title: highed.L('dgSortDecMonth'),
                    icon: 'sort-amount-desc',
                    click: function () {
                        sortRows(exports.colNumber, 'desc', true);
                    }
                },
                '-',
                {
                    title: highed.L('dgDelCol'),
                    icon: 'trash',
                    click: function () {
                        if (confirm(highed.L('dgDelColConfirm'))) {
                            delCol(exports.colNumber);
                        }
                    }
                },
                // {
                //     title: 'Clone Column',
                //     icon: 'clone'
                // },
                '-',
                {
                    title: highed.L('dgInsColBefore'),
                    icon: 'plus',
                    click: function () {

                        events.emit('ColumnMoving');
                        insertCol(exports.colNumber);
                        events.emit('ColumnMoved');
                    }
                },
                {
                    title: highed.L('dgInsColAfter'),
                    icon: 'plus',
                    click: function () {
                        events.emit('ColumnMoving');
                        insertCol(exports.colNumber + 1);
                        events.emit('ColumnMoved');
                    }
                }
            ]),
            ox,
            keyCell = highed.dom.cr('span', 'highed-dtable-cell-value', keyValue);

        // letter.innerHTML = keyValue;
        letter.value = highed.getLetterIndex(keyValue);

        exports.setLetter = function (str) {
            keyCell.innerHTML = str;
            letter.value = highed.getLetterIndex(str);
            // exports.colNumber = highed.getLetterIndex(str);
        };

        exports.hideColumns = function () {
            if (!col.classList.contains('cell-hide')) {
                col.classList.add('cell-hide');
                header.classList.add('cell-hide');
                letter.classList.add('cell-hide');
            }
        };

        exports.showColumns = function () {
            if (col.classList.contains('cell-hide')) {
                col.classList.remove('cell-hide');
                header.classList.remove('cell-hide');
                letter.classList.remove('cell-hide');
            }
        };

        highed.dom.on(letter, 'mouseover', function (e) {
            if (mouseDown && (e.target !== options && e.target !== moveHandle)) {
                if (dragHeaderMode) {
                    if (movementBar.className.indexOf('active') === -1) {
                        movementBar.className += ' active';
                        highed.dom.style(movementBar, {
                            width: 140 * ((selectedHeaders[0] < selectedHeaders[1] ? selectedHeaders[1] - selectedHeaders[0]  : selectedHeaders[0] - selectedHeaders[1]) + 1) + 'px'
                            // width: 140 * selectedHeaders.length + 'px'
                        });
                    }
                    highlightLeft(letter.value);

                    highed.dom.style(movementBar, {
                        left: (e.clientX - highed.dom.size(movementBar).w / 2) + 'px'
                    });
                } else {
                    selectedEndCell[0] = letter.value;
                    selectedHeaders[1] = letter.value;
                    selectNewCells(selectedFirstCell, selectedEndCell);
                }
            }
        });

        highed.dom.on(letter, 'mousedown', function (e) {

            deselectAllCells();

            if (selectedHeaders.length > 0 && (e.target.value >= selectedHeaders[0] && e.target.value <= selectedHeaders[1])) {
                // User is trying to drag headers left and right.
                dragHeaderMode = true;
            } else {
                // deselectAllCells();
                if (e.target !== options && e.target !== moveHandle) {
                    selectedHeaders = [];

                    selectedHeaders[0] = e.target.value;
                    selectedHeaders[1] = e.target.value;

                    selectedFirstCell[0] = e.target.value;
                    selectedEndCell[0] = e.target.value;
                    selectedFirstCell[1] = 0;
                    selectedEndCell[1] = rows.length - 1;
                    selectNewCells(selectedFirstCell, selectedEndCell);
                }
            }
        });

        highed.dom.on(container, 'mouseover', function (e) {
            if (dragHeaderMode) {
                highed.dom.style(movementBar, {
                    left: (e.clientX - highed.dom.size(movementBar).w / 2) + 'px'
                });
            }
        });

        function shuffleArray(arr, min, amount, moveTo) {
            var x = arr.splice(min, amount);
            var args = [moveTo, 0].concat(x);
            Array.prototype.splice.apply(arr, args);
        }

        function moveCells() {

            if (moveToColumn !== null) {
                events.emit('ColumnMoving');

                const min = selectedHeaders[0/* (moveToColumn < selectedHeaders[0] ? 1 : 0)*/],
                    max = (selectedHeaders[0] < selectedHeaders[1] ? selectedHeaders[1] - selectedHeaders[0]  : selectedHeaders[0] - selectedHeaders[1]) + 1,
                    total = (selectedHeaders[0] < selectedHeaders[1] ? selectedHeaders[1] - selectedHeaders[0]  : selectedHeaders[0] - selectedHeaders[1]);

                shuffleArray(gcolumns, min, max, (moveToColumn < selectedHeaders[0] ? moveToColumn + 1 : moveToColumn - total));

                rows.forEach(function (row) {
                    shuffleArray(row.columns, min, max, (moveToColumn < selectedHeaders[0] ? moveToColumn + 1 : moveToColumn - total));
                });

                if (rows.length > 0) {
                    rows[0].columns[0].focus();
                }
                updateColumns();
                emitChanged();
                events.emit('ColumnMoved');
            }
        }

        highed.dom.on(container, 'mouseup', function (e) {
            if (dragHeaderMode) {

                moveCells();
                selectedHeaders = [];
                dragHeaderMode = false;
                movementBar.classList.remove('active');
                columnsToHighlight.forEach(function (highlightedColumn) {
                    highlightedColumn.element.classList.remove('highlight-right');
                });
                columnsToHighlight = [];
                moveToColumn = null;
            }
            globalContextMenu.hide();
        });

        highed.dom.on(header, 'mouseover', function (e) {
            if (mouseDown) {
                if (dragHeaderMode) {
                    highlightLeft(exports.colNumber);
                }
            }
        });


        keyValue = getNextLetter(keyValue);
        // //////////////////////////////////////////////////////////////////////
        exports.addToDOM = function () {

            highed.dom.ap(colgroup, col);
            highed.dom.ap(
                topLetterBar,
                highed.dom.ap(letter, keyCell, options, moveHandle)
            );

            highed.dom.ap(
                topColumnBar,
                highed.dom.ap(header, headerTitle)
            );
        };

        exports.destroy = function () {
            colgroup.removeChild(col);
            topColumnBar.removeChild(header);
            topLetterBar.removeChild(letter);

            gcolumns = gcolumns.filter(function (b) {
                return b !== exports;
            });

        };

        // //////////////////////////////////////////////////////////////////////

        exports.addToDOM();

        // highed.dom.showOnHover(header, options);

        col.width = 140;
        highed.dom.style([col, header, letter], {
            width: col.width + 'px',
            'max-width': col.width + 'px'
        });

        mover.on('StartMove', function (x) {
            ox = x;

            if (!header.classList.contains('no-transition')) {
                header.classList += ' no-transition';
                letter.classList += ' no-transition';
                col.classList += ' no-transition';
            }

            if (rows.length > 0) {
                rows[0].columns[0].focus();
            }
            highed.dom.style(cornerPiece, {
                display: 'none'
            });

            highed.dom.style(document.body, {
                cursor: 'ew-resize'
            });
        });

        mover.on('Moving', function (x) {
            col.width = x;

            highed.dom.style(cornerPiece, {
                display: 'none'
            });

            highed.dom.style([col, header, letter], {
                width: x + 'px',
                'max-width': x + 'px'
            });

            moveHandle.className =
        'highed-dtable-resize-handle highed-dtable-resize-handle-moving';
        });

        mover.on('EndMove', function (x) {
            highed.dom.style(document.body, {
                cursor: ''
            });

            if (header.classList.contains('no-transition')) {
                header.classList.remove('no-transition');
                letter.classList.remove('no-transition');
                col.classList.remove('no-transition');
            }

            moveHandle.className = 'highed-dtable-resize-handle';
            if (rows.length > 0) {
                rows[0].columns[0].focus();
            }
        });

        highed.dom.on(options, 'click', function (e) {

            ctx.show(e.clientX, e.clientY);
            return highed.dom.nodefault(e);
        });

        highed.dom.on(header, 'click', function (e) {

            // Ugly.
            mainInput.className = 'highed-dtable-input highed-dtable-input-header';
            // Spawn an edit box in the node

            highed.dom.style(cornerPiece, {
                display: 'none'
            });
            deselectAllCells();

            makeEditable(
                header,
                value,
                function (val) {
                    headerTitle.innerHTML = value = val;
                    emitChanged();
                },
                function (e) {
                    if (e.keyCode === 13) {
                        mainInput.className = 'highed-dtable-input';
                        header.removeChild(mainInput);
                    }
                }
            );
        });

        rows.forEach(function (row) {
            if (where) {
                row.insertCol(where);
            } else {
                row.addCol(null, tempKeyValue);
            }

            tempKeyValue = getNextLetter(tempKeyValue);
        });

        if (!isNaN(where)) {
            gcolumns.splice(where, 0, exports);
        } else {
            gcolumns.push(exports);
        }

        emitChanged();
    }

    function showDropzone() {
        highed.dom.style(dropZone, {
            opacity: 1
        });
    }

    function hideDropzone() {
        highed.dom.style(dropZone, {
            opacity: 0
        });
    }

    // //////////////////////////////////////////////////////////////////////////
    // PUBLIC FUNCTIONS FOLLOW


    function sortRows(column, direction, asMonths) {
        tbody.innerHTML = '';

        direction = (direction || '').toUpperCase();
        // eslint-disable-next-line array-callback-return
        rows.sort(function (a, b) {
            var ad = a.columns[column].value(),
                bd = b.columns[column].value();

            if ((highed.isNum(ad) && highed.isNum(bd)) || asMonths) {
                if (asMonths) {
                    ad = monthNumbers[ad.toUpperCase().substr(0, 3)] || 13;
                    bd = monthNumbers[bd.toUpperCase().substr(0, 3)] || 13;
                } else {
                    ad = parseFloat(ad);
                    bd = parseFloat(bd);
                }

                if (direction === 'ASC') {
                    return ad - bd;
                }
                return bd < ad ? -1 : bd > ad ? 1 : 0;
            }

            if (direction === 'ASC') {
                if (!ad) {
                    return bd;
                }
                return ad.localeCompare(bd);
            }

            if (bd) {
                if (!ad) {
                    return bd;
                }
                return bd.localeCompare(ad);
            }

            if (ad) {
                return ad.localeCompare(bd);
            }


        });

        rebuildRows();

        if (rows.length > 0) {
            rows[0].columns[column].focus();
        }
        emitChanged();
    }


    function clear(noWait) {
        rows = rows.filter(function (row) {
            row.destroy();
            return false;
        });

        gcolumns = gcolumns.filter(function (row) {
            // Destroy col here
            return false;
        });

        tbody.innerHTML = '';
        leftBar.innerHTML = '';
        topColumnBar.innerHTML = '';
        topLetterBar.innerHTML = '';
        colgroup.innerHTML = '';
        keyValue = 'A';

        highed.dom.style(tableTail, {
            display: ''
        });

        events.emit('ClearData', true);

        emitChanged(noWait);
        showDropzone();
    }


    function addRow(supressChange, skipAdd) {
        var r = Row(skipAdd);

        gcolumns.forEach(function () {
            r.addCol();
        });

        if (!supressChange) {
            emitChanged();
        }
        if (rows.length > 1) {
            hideDropzone();
        }

        return r;
    }


    function insertCol(where) {
        if (where === null) {
            where = gcolumns.length;
        }
        if (where <= 0) {
            where = 0;
        }
        if (where >= gcolumns.length) {
            where = gcolumns.length;
        }
        // Insert into gcolumns and on each row, then call updateColumns()
        addCol(highed.L('dgNewCol'), where);

        updateColumns();
    }


    function delCol(which) {
        if (which >= 0 && which < gcolumns.length) {
            rows.forEach(function (row) {
                row.delCol(which);
            });

            gcolumns[which].destroy();

            updateColumns();
            emitChanged();
        }
    }


    function resize() {
        var ps = highed.dom.size(parent),
            hs = highed.dom.size(topBar);
        // tb = highed.dom.size(toolbar.container);

        highed.dom.style(frame, {
            height: ps.h - hs.h - 55 - 17 + 'px' // 55 is padding from top for data column and letter
        });

        highed.dom.style([container, gsheetFrame, liveDataFrame], {
            height: ps.h - hs.h - 22 /* - tb.h*/ + 'px'
        });


        highed.dom.style(table, {
            width: ps.w + 'px'
        });

    }


    function getHeaderTextArr(quoteStrings, section) {

        var columnNames = [];


        function cleanData(data) {
            var title = data && data.headerTitle.innerHTML.length ?
                data.headerTitle.innerHTML :
                null;

            if (quoteStrings) {
                title = '"' + title + '"';
            }

            columnNames.push(title);
        }

        if (section) {
            // Add in label data first
            // cleanData(gcolumns[section.labelColumn]);
        }

        gcolumns.reduce(function (result, item, index) {

            if (section && !checkSections(section, index)) {
                return;
            }

            cleanData(item);

        }, []);

        return columnNames;
    }

    function checkSections(sections, index) {
        return (sections || []).some(function (section) {
            return (section.dataColumns.indexOf(index) > -1 || section.extraColumns.indexOf(index) > -1 || section.labelColumn === index);
        });
    }


    function toData(quoteStrings, includeHeaders, section) {
        var data = [];
        if (includeHeaders) {
            data.push(getHeaderTextArr(quoteStrings, section));
        }
        dataFieldsUsed = [];

        function addData(column, arr) {

            if (quoteStrings && !highed.isNum(column) && highed.isStr(column)) {
                column = '"' + column.replace(/\"/g, '"') + '"';
            }

            if (highed.isNum(column)) {
                column = parseFloat(column);
            }

            if (highed.isStr(column) && Date.parse(column) !== NaN) {
                // v = (new Date(v)).getTime();
            }

            arr.push(column);
        }

        rows.forEach(function (row) {
            var rarr = [],
                hasData = false;

            if (section) {
                // Add in label data first
                // addData(row.columns[section[0].labelColumn].value(), rarr);
            }

            row.columns.forEach(function (col, index) {
                if (section && !checkSections(section, index)) {
                    return;
                }

                var v = col.value();

                if (v) {
                    hasData = true;
                }

                if (dataFieldsUsed.indexOf(index) === -1) {
                    dataFieldsUsed.push(index);
                    if (!v) {
                        hasData = true;
                        v = undefined;
                    }
                }

                addData(v, rarr);

            });

            if (hasData) {
                data.push(rarr);
            }
        });
        return data;
    }


    function toDataSeries(ignoreFirst) {
        var res = {
            categories: [],
            series: []
        };

        gcolumns.forEach(function (item, i) {
            if (i > 0) {
                res.series.push({
                    name: item.headerTitle.innerHTML.length ?
                        item.headerTitle.innerHTML :
                        null,
                    data: []
                });
            }
        });

        rows.forEach(function (row, i) {
            row.columns.forEach(function (col, ci) {
                var v = col.value();

                if (!ci) {
                    if (v && highed.isStr(v) && Date.parse(v) !== NaN) {
                        // v = new Date(v);
                    }

                    res.categories.push(v);
                    return;
                }

                ci--;

                if (v && highed.isNum(v)) {
                    v = parseFloat(v);
                }

                if (v && highed.isStr(v) && Date.parse(v)  !== NaN) {
                    // v = (new Date(v)).getTime();
                }

                res.series[ci].data.push(v);
            });
        });

        return res;
    }


    function toCSV(delimiter, quoteStrings, section) {
        delimiter = delimiter || ',';
        return toData(quoteStrings, true, section)
            .map(function (cols) {
                return cols.join(delimiter);
            })
            .join('\n');
    }

    function loadRows(rows, done) {
        var sanityCounts = {};
        clear();

        if (rows.length > 1) {
            hideDropzone();
        }

        // Do a sanity check on rows.
        // If the column count varries between rows, there may be something wrong.
        // In those cases we should pop up a dialog allow to specify what the
        // delimiter should be manually.

        rows.some(function (row, i) {
            var count = row.length;
            sanityCounts[count] =
        typeof sanityCounts[count] === 'undefined' ? 0 : sanityCounts[count];
            ++sanityCounts[count];
            return i > 20;
        });

        if (Object.keys(sanityCounts).length > 4) {
            // Four or more rows have varrying amounts of columns.
            // Something is wrong.
            showDataImportError();
        }

        highed.dom.style(loadIndicator, {
            opacity: 1
        });

        highed.dom.style(hideCellsDiv, {
            opacity: 0
        });

        setTimeout(function () {

            if (rows[0] && rows.length < DEFAULT_ROW) {
                var counter = DEFAULT_ROW - rows.length,
                    length = (rows[0].length > DEFAULT_COLUMN ? rows[0].length : DEFAULT_COLUMN);

                rows.forEach(function (row) {
                    if (row.length < DEFAULT_COLUMN) {
                        const len = DEFAULT_COLUMN - row.length;
                        for (var i = 0; i < len; i++) {
                            row.push(null);
                        }
                    }
                });

                for (var i = 0; i < counter; i++) {
                    rows.push(Array(length).fill(null, 0));
                }
            }

            rows.forEach(function (cols, i) {
                var row;

                if (i) {
                    row = Row();
                }
                tempKeyValue = 'A';
                cols.forEach(function (c) {
                    if (i === 0) {
                        addCol(c);
                    } else {
                        row.addCol(c, tempKeyValue);
                    }
                    tempKeyValue = getNextLetter(tempKeyValue);
                });
            });

            highed.dom.ap(colgroup, highed.dom.cr('col'));

            // highed.snackBar(highed.L('dgDataImported'));
            resize();

            highed.dom.style(loadIndicator, {
                opacity: 0
            });
            highed.dom.style(hideCellsDiv, {
                opacity: 1
            });

            if (highed.isFn(done)) {
                done();
            }
        }, 10);
    }

    function loadLiveDataPanel(params) {
        // loadRows(params.csv);

        isInLiveDataMode = true;
        highed.dom.style(gsheetFrame, {
            display: 'none'
        });
        highed.dom.style(container, {
            display: 'none'
        });
        highed.dom.style(liveDataFrame, {
            display: 'block'
        });

        liveDataInput.value = params.columnsURL || params.rowsURL || params.csvURL;
        liveDataIntervalInput.value = params.dataRefreshRate || '';
        liveDataTypeSelect.selectById((params.columnsURL ? 'columnsURL' : (params.rowsURL ? 'rowsURL' : 'csvURL')));
    }

    function loadLiveDataFromURL(url, interval, type) {
        isInLiveDataMode = true;
        events.emit('LoadLiveData', {
            url: url,
            interval: interval,
            type: type
        });
    }


    function loadCSV(data, surpressEvents, updateAssignData, cb) {
        var rows;
        console.log(data);

        if (isInGSheetMode) {
            isInGSheetMode = false;
            isInLiveDataMode = false;

            highed.dom.style(gsheetFrame, {
                display: 'none'
            });

            highed.dom.style(liveDataFrame, {
                display: 'none'
            });

            highed.dom.style(container, {
                display: 'block'
            });
        }

        // highed.snackBar(highed.L('dgDataImporting'));
        importModal.hide();

        surpressChangeEvents = true;

        rawCSV = data.csv;

        console.log(data.csv);

        if (data && data.csv) {
            console.log('true');
            rows = parseCSV(data.csv, data.delimiter);
            if (updateAssignData && rows[0].length < DEFAULT_COLUMN) {
                events.emit('AssignDataForFileUpload', rows[0].length);
            }

            if (rows[0] && rows.length < DEFAULT_ROW) {
                var counter = DEFAULT_ROW - rows.length,
                    length = (rows[0].length > DEFAULT_COLUMN ? rows[0].length : DEFAULT_COLUMN);

                rows.forEach(function (row) {
                    if (row.length < DEFAULT_COLUMN) {
                        const len = DEFAULT_COLUMN - row.length;
                        for (var i = 0; i < len; i++) {
                            row.push(null);
                        }
                    }
                });

                for (var i = 0; i < counter; i++) {
                    rows.push(Array(length).fill(null, 0));
                }
            }
            loadRows(rows, function () {
                if (updateAssignData && rows[0].length > DEFAULT_COLUMN) {
                    events.emit('AssignDataForFileUpload', rows[0].length);
                }
                if (cb) {
                    cb();
                }
            });
        } else {
            // surpressChangeEvents = false;
            // if (!surpressEvents) {
            //   emitChanged(true);
            // }
        }
        surpressChangeEvents = false;
        if (!surpressEvents) {
            emitChanged(true);
        }
    }
    // const csv = document.getElementById('csv').innerHTML;
    //   loadCSV(csv);

    function initGSheet(
        id,
        worksheet,
        startRow,
        endRow,
        startColumn,
        endColumn,
        skipLoad,
        dataRefreshRate
    ) {
        gsheetID.value = id;
        gsheetWorksheetID.value = worksheet || '';
        gsheetRefreshTime.value = dataRefreshRate || '';
        gsheetStartRow.value = startRow || 0;
        gsheetEndRow.value = (endRow === Number.MAX_VALUE ? '' : endRow) || '';
        gsheetStartCol.value = startColumn || 0;
        gsheetEndCol.value =  (endColumn === Number.MAX_VALUE ? '' : endColumn) || '';

        isInGSheetMode = true;
        isInLiveDataMode = false;

        highed.dom.style(gsheetFrame, {
            display: 'block'
        });

        highed.dom.style(container, {
            display: 'none'
        });

        highed.dom.style(liveDataFrame, {
            display: 'none'
        });

        if (!skipLoad) {

            events.emit('LoadGSheet', {
                googleSpreadsheetKey: gsheetID.value,
                googleSpreadsheetWorksheet: gsheetWorksheetID.value || false,
                dataRefreshRate: gsheetRefreshTime.value || false,
                enablePolling: (parseInt(gsheetRefreshTime.value, 10) !== 0),
                startRow: gsheetStartRow.value || 0,
                endRow: gsheetEndRow.value || undefined,
                startColumn: gsheetStartCol.value || 0,
                endColumn: gsheetEndCol.value || undefined
            });
        }
    }

    function showDataTableError() {
        highed.dom.style(container, {
            border: '1px solid #aa5555'
        });
    }

    function hideDataTableError() {
        highed.dom.style(container, {
            border: 'initial'
        });
    }

    function addImportTab(tabOptions) {
        importer.addImportTab(tabOptions);
    }

    function hideImportModal() {
        importModal.hide();
    }

    function showImportModal(index) {
        importModal.show();
        if (!isNaN(index)) {
            importer.selectTab(index);
        }

        events.emit('initExporter', importer.exporter);
        importer.resize();
    }

    function showLiveData(skipConfirm) {
        if (
            skipConfirm ||
      rows.length <= 1 ||
      confirm('This will clear your existing data. Continue?')
        ) {
            clear(true);
            events.emit('ClearSeries');

            liveDataInput.value = '';
            liveDataIntervalInput.value = '';
            liveDataTypeSelect.selectByIndex(0);

            highed.dom.style(gsheetFrame, {
                display: 'none'
            });

            highed.dom.style(container, {
                display: 'none'
            });

            highed.dom.style(liveDataFrame, {
                display: 'block'
            });
            importModal.hide();

            isInGSheetMode = false;
            isInLiveDataMode = true;
        }
    }

    function showGSheet(skipConfirm) {
        if (
            skipConfirm ||
      rows.length <= 1 ||
      confirm('This will clear your existing data. Continue?')
        ) {
            clear(true);
            events.emit('ClearSeries');

            gsheetID.value = '';
            gsheetWorksheetID.value = '';
            gsheetRefreshTime.value = '';
            highed.dom.style(gsheetFrame, {
                display: 'block'
            });

            highed.dom.style(container, {
                display: 'none'
            });

            highed.dom.style(liveDataFrame, {
                display: 'none'
            });

            importModal.hide();
            isInGSheetMode = true;
            isInLiveDataMode = false;
        }
    }

    function hideLiveData() {
        if (
            !liveDataInput.value ||
      confirm('Are you sure you want to remove your live data?')
        ) {
            // Should emit a gsheet clear

            events.emit('LoadLiveData', {
                url: ''
            });

            highed.dom.style(gsheetFrame, {
                display: 'none'
            });

            highed.dom.style(container, {
                display: 'block'
            });


            highed.dom.style(liveDataFrame, {
                display: 'none'
            });

            isInLiveDataMode = false;

            init();
        }
    }

    function hideGSheet() {
        if (
            !gsheetID.value ||
      confirm('Are you sure you want to detach the current spreadsheet?')
        ) {
            // Should emit a gsheet clear
            events.emit('LoadGSheet', {
                googleSpreadsheetKey: '',
                googleSpreadsheetWorksheet: false
            });

            highed.dom.style(gsheetFrame, {
                display: 'none'
            });

            highed.dom.style(container, {
                display: 'block'
            });

            highed.dom.style(liveDataFrame, {
                display: 'none'
            });
            isInGSheetMode = false;

            init();

            highed.emit('UIAction', 'DetachGoogleSheet');
        }
    }

    // //////////////////////////////////////////////////////////////////////////
    importer.on('ExportComma', function (data) {
        highed.emit('UIAction', 'ExportComma');
        highed.download('data.csv', toCSV(','), 'application/csv');
        events.emit('EnableAssignDataPanel');
        importModal.hide();
    });

    importer.on('ExportSemiColon', function (data) {
        highed.emit('UIAction', 'ExportSemiColon');
        highed.download('data.csv', toCSV(';'), 'application/csv');
        events.emit('EnableAssignDataPanel');
        importModal.hide();
    });

    importer.on('ImportCSV', function (data, cb) {
        highed.emit('UIAction', 'ImportCSV');
        events.emit('EnableAssignDataPanel');
        loadCSV(data, null, true, cb);
    });

    importer.on('ImportGoogleSpreadsheet', function () {
        highed.emit('UIAction', 'BtnGoogleSheet');
        events.emit('DisableAssignDataPanel');
        showGSheet();
    });

    importer.on('ImportLiveData', function (data) {
        isInLiveDataMode = true;
        events.emit('DisableAssignDataPanel');
        showLiveData();
    // loadLiveDataFromURL(data.url);
    });

    importer.on('ImportChartSettings', function (settings, format) {
    // Do something with the data here
        events.emit('ImportChartSettings', settings, format);
        importModal.hide();
    });

    highed.dom.on(switchRowColumns, 'click', function () {
        selectSwitchRowsColumns();
    });

    highed.dom.on(gsheetCancelButton, 'click', function () {
        hideGSheet();
        events.emit('CancelDataInput');
        events.emit('EnableAssignDataPanel');
    });

    highed.dom.on(liveDataCancelButton, 'click', function () {
        hideLiveData();
        events.emit('CancelDataInput');
        events.emit('EnableAssignDataPanel');
    });

    highed.dom.on(liveDataLoadButton, 'click', function () {
        loadLiveDataFromURL('https://demo-live-data.highcharts.com/time-data.csv', 1, detailValue || 'columnsURL');
    });


    highed.dom.on(gsheetLoadButton, 'click', function () {

        var value = parseInt(gsheetRefreshTime.value, 10);
        events.emit('LoadGSheet', {
            googleSpreadsheetKey: gsheetID.value,
            googleSpreadsheetWorksheet: gsheetWorksheetID.value || false,
            dataRefreshRate: (!isNaN(value) && value !== 0 ? value : false),
            enablePolling: (!isNaN(value) && value !== 0),
            startRow: gsheetStartRow.value || 0,
            endRow: gsheetEndRow.value || Number.MAX_VALUE,
            startColumn: gsheetStartCol.value || 0,
            endColumn: gsheetEndCol.value || Number.MAX_VALUE
        });
    });

    highed.dom.on(weirdDataIgnore, 'click', hideDataImportError);

    highed.dom.on(weirdDataFix, 'click', function () {
    // Pop open a modal with the option of supplying a delimiter manually.
        var dropdownParent = highed.dom.cr('div'),
            dropdown = highed.DropDown(dropdownParent),
            okBtn = highed.dom.cr('button', 'highed-ok-button', 'Rerun Import'),
            nevermindBtn = highed.dom.cr('button', 'highed-ok-button', 'Nevermind'),
            selectedDelimiter;

        weirdDataModal.body.innerHTML = '';
        weirdDataModal.show();

        dropdown.addItems([
            {
                title: 'Tab',
                id: 'tab',
                select: function () {
                    selectedDelimiter = '\t';
                }
            },
            {
                title: 'Comma',
                id: 'comma',
                select: function () {
                    selectedDelimiter = ',';
                }
            },
            {
                title: 'Semicolon',
                id: 'semicolon',
                select: function () {
                    selectedDelimiter = ';';
                }
            }
        ]);

        dropdown.selectByIndex(0);

        highed.dom.ap(
            weirdDataModal.body,
            highed.dom.cr('h3', '', 'Data Import Fixer'),
            highed.dom.cr(
                'div',
                'highed-dtable-weird-data-body',
                [
                    'We could not properly determine how your columns are separated.',
                    '<br/><br/>',
                    'Usually this is caused by commas as thousand separators,',
                    'or something similar. Please choose which delimiter you want to use,',
                    'and click the Rerun button.<br/><br/>'
                ].join(' ')
            ),
            dropdownParent,
            highed.dom.style(okBtn, {
                marginRight: '5px'
            }),
            nevermindBtn
        );

        highed.dom.on(nevermindBtn, 'click', weirdDataModal.hide);

        highed.dom.on(okBtn, 'click', function () {
            weirdDataModal.hide();
            hideDataImportError();

            loadCSV({
                csv: rawCSV,
                delimiter: selectedDelimiter
            }, null, true);
        });
    });

    // //////////////////////////////////////////////////////////////////////////

    dropZone.innerHTML =
    // 'Drop CSV files here.<br/>' +
    // '<span class="highed-dtable-drop-zone-small">You can also paste CSV or Excel data into any cell</span>';

  table.cellPadding = 0;
    table.cellSpacing = 0;

    highed.dom.on(frame, 'scroll', function (e) {
        leftBar.style.top = -frame.scrollTop + 'px';
        topBar.style.left = -frame.scrollLeft + 40 + 'px';
    });

    parent = highed.dom.get(parent);
    highed.dom.ap(
        parent,
        gsheetFrame,
        liveDataFrame,
        highed.dom.ap(
            container,
            highed.dom.ap(
                frame,
                highed.dom.ap(table, colgroup, thead, tbody),
                tableTail,
                dropZone,
                movementBar
            ),
            hideCellsDiv,
            leftBar,
            highed.dom.ap(topBar, topLetterBar, topColumnBar)
            // highed.dom.ap(topLeftPanel, checkAll)
        ),
        highed.dom.ap(
            weirdDataContainer,
            highed.dom.cr(
                'div',
                'highed-dtable-weird-data-body',
                [
                    'Uh-oh! It looks like our data importer may have had some issues',
                    'processing your data.',
                    'Usually this means that we were unable to deduce how the columns',
                    'are separated.'
                ].join(' ')
            ),
            weirdDataIgnore,
            weirdDataFix
        ),

        loadIndicator
    );

    gsheetID.placeholder = 'Spreadsheet ID';
    gsheetWorksheetID.placeholder = 'Worksheet (leave blank for first)';
    gsheetRefreshTime.placeholder = 'Refresh Time (leave blank for no refresh)';

    highed.dom.ap(
        gsheetFrame,
        highed.dom.ap(
            gsheetContainer,
            highed.dom.cr(
                'div',
                'highed-dtable-gsheet-heading',
                'Link Google Spreadsheet'
            ),
            highed.dom.ap(
                highed.dom.cr('div', 'highed-dtable-gsheet-inner'),
                // highed.dom.cr('div', 'highed-dtable-gsheet-centered', 'You have loaded a Google Spreadsheet.'),
                // highed.dom.cr(
                //   'div',
                //   'highed-dtable-gsheet-desc',
                //   [
                //     'Google Spreadsheets are referenced, meaning that the data is imported',
                //     'on the fly. When viewing the chart, the latest version of your sheet',
                //     'will always be used!<br/><br/>'
                //   ].join(' ')
                // ),
                highed.dom.cr(
                    'div',
                    'highed-dtable-gsheet-label',
                    'Google Spreadsheet ID'
                ),
                highed.dom.ap(highed.dom.cr('div'), gsheetID),
                highed.dom.ap(
                    highed.dom.cr('table', 'highed-stretch'),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Worksheet'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Refresh Time (Seconds)')
                    ),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.ap(highed.dom.cr('td', '', ''), gsheetWorksheetID),
                        highed.dom.ap(highed.dom.cr('td', '', ''), gsheetRefreshTime)
                    ),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Start Row'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'End Row')
                    ),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.ap(highed.dom.cr('td', '', ''), gsheetStartRow),
                        highed.dom.ap(highed.dom.cr('td', '', ''), gsheetEndRow)
                    ),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Start Column'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'End Column')
                    ),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.ap(highed.dom.cr('td', '', ''), gsheetStartCol),
                        highed.dom.ap(highed.dom.cr('td', '', ''), gsheetEndCol)
                    )
                ),
                highed.dom.ap(
                    highed.dom.cr('div', 'highed-gsheet-btn-container'),
                    gsheetLoadButton,
                    gsheetCancelButton
                ),
                highed.dom.cr(
                    'div',
                    'highed-gsheet-text',
                    [
                        'When using Google Spreadsheet, Highcharts references the sheet directly.<br/><br/>',
                        'This means that the published chart always loads the latest version of the sheet.<br/><br/>',

                        'For more information on how to set up your spreadsheet, visit',
                        '<a target="_blank" href="https://cloud.highcharts.com/docs/#/google-spread-sheet-setting">the documentation</a>.'
                    ].join(' ')
                )
            )
        )
    );

    liveDataTypeSelect.addItems([
        { id: 'columnsURL', title: 'JSON (Column Ordered)' },
        { id: 'rowsURL', title: 'JSON (Row Ordered)' },
        { id: 'csvURL', title: 'CSV' }
    ]
    );

    liveDataTypeSelect.on('Change', function (selected) {
    // detailIndex = selected.index();
        detailValue = selected.id();
    // liveDataTypeSelect.selectById(detailValue || 'json');
    });

    highed.dom.ap(liveDataTypeMasterNode, liveDataTypeSelect.container);
    highed.dom.style(liveDataTypeMasterNode, {
        display: 'block'
    });

    highed.dom.ap(
        liveDataFrame,
        highed.dom.ap(
            liveDataContainer,
            highed.dom.cr(
                'div',
                'highed-dtable-gsheet-heading',
                'Live Data'
            ),
            highed.dom.ap(
                highed.dom.cr('div', 'highed-dtable-gsheet-inner'),
                // highed.dom.cr('div', 'highed-dtable-gsheet-centered', 'You have loaded a Google Spreadsheet.'),
                // highed.dom.cr(
                //   'div',
                //   'highed-dtable-gsheet-desc',
                //   [
                //     'Google Spreadsheets are referenced, meaning that the data is imported',
                //     'on the fly. When viewing the chart, the latest version of your sheet',
                //     'will always be used!<br/><br/>'
                //   ].join(' ')
                // ),
                highed.dom.cr(
                    'div',
                    'highed-dtable-gsheet-label',
                    'URL'
                ),
                highed.dom.ap(highed.dom.cr('div'), liveDataInput),

                highed.dom.ap(
                    highed.dom.cr('table', 'highed-stretch'),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Chart Refresh Time (Seconds)'),
                        highed.dom.cr('td', 'highed-dtable-gsheet-label', 'Data Type')
                    ),
                    highed.dom.ap(
                        highed.dom.cr('tr'),
                        highed.dom.ap(highed.dom.cr('td', '', ''), liveDataIntervalInput),
                        highed.dom.ap(highed.dom.cr('td', '', ''), liveDataTypeMasterNode)
                    )
                ),

                highed.dom.ap(
                    highed.dom.cr('div', 'highed-gsheet-btn-container'),
                    liveDataLoadButton,
                    liveDataCancelButton
                ),
                highed.dom.cr('div', 'highed-gsheet-text', [
                    'Live data needs a url to your JSON data to reference.<br/><br/>',
                    'This means that the published chart always loads the latest version of your data.<br/><br/>'
                ].join(' '))
            )
        )
    );

    function selectSwitchRowsColumns() {
        var csvData = rowsToColumns(highed.parseCSV(toCSV()))
            .map(function (cols) {
                return cols.join(';');
            }).join('\n');

        clearData();
        loadCSV({
            csv: csvData
        }, null, true);
    }

    function rowsToColumns(rows) {
        var row,
            rowsLength,
            col,
            colsLength,
            columns;

        if (rows) {
            columns = [];
            rowsLength = rows.length;
            for (row = 0; row < rowsLength; row++) {
                colsLength = rows[row].length;
                for (col = 0; col < colsLength; col++) {
                    if (!columns[col]) {
                        columns[col] = [];
                    }
                    columns[col][row] = rows[row][col];
                }
            }
        }
        return columns;
    }


    function getRawCSV() {
        return rawCSV;
    }

    function clearData() {
        highed.emit('UIAction', 'FlushDataConfirm');
        init();
        emitChanged();
        if (rows.length > 0) {
            rows[0].columns[0].focus();
        }
    }
    function colorHeader(values, color) {
        var tempValue = values[0];
        if (values.length > 0) {
            while (tempValue <= values[values.length - 1]) {
                if (gcolumns[tempValue]) {
                    highed.dom.style(gcolumns[tempValue].letter, {
                        'background-color': color.light,
                        'border-left': '1px double ' + color.dark,
                        'border-top': '1px double ' + color.dark,
                        'border-bottom': '1px double ' + color.dark,
                        'border-right': '1px double ' + color.dark
                    });
                    highed.dom.style(gcolumns[tempValue].header, {
                        'background-color': color.light,
                        'border-left': '1px double ' + color.dark,
                        'border-right': '1px double ' + color.dark,
                        'border-bottom': '1px double ' + color.dark
                    });
                }
                tempValue++;
            }
        }
    }

    function colorCells(values, color) {
        if (values.length > 0) {
            rows.forEach(function (row) {
                var tempValue = values[0];
                while (tempValue <= values[values.length - 1]) {
                    if (row.columns[tempValue]) {
                        highed.dom.style(row.columns[tempValue].element, {
                            'background-color': color.light
                        });
                    }
                    tempValue++;
                }
            });
        }
    }

    function outlineCell(values, color) {
        values.forEach(function (value, index) {
            rows.forEach(function (row) {
                if (row.columns[value]) {
                    highed.dom.style(row.columns[value].element, {
                        'border-right': (index === (values.length - 1) ? '1px double ' + color.dark : ''),
                        'border-left': (index === 0 ? '1px double ' + color.dark : '')
                    });
                }
            });
        });
    }

    function decolorCells(previousValues) {
        if (previousValues && previousValues.length > 0) {

            rows.forEach(function (row) {
                var tempValue = previousValues[0];
                if (previousValues.length > 0) {
                    while (tempValue <= previousValues[previousValues.length - 1]) {
                        if (row.columns[tempValue]) {
                            highed.dom.style(row.columns[tempValue].element, {
                                'background-color': ''
                            });
                        }
                        tempValue++; // = getNextLetter(tempValue);
                    }
                }
            });
        }
    }

    function decolorHeader(previousValues) {
        if (previousValues && previousValues.length > 0) {
            var tempValue = previousValues[0];
            if (previousValues.length > 0) {
                while (tempValue <= previousValues[previousValues.length - 1]) {
                    if (gcolumns[tempValue]) {
                        highed.dom.style([gcolumns[tempValue].letter, gcolumns[tempValue].header], {
                            'background-color': '',
                            border: ''
                        });
                    }
                    tempValue++; // = getNextLetter(tempValue);
                }
            }
        }
    }

    function removeOutlineFromCell(values) {
        (values || []).forEach(function (value) {
            (rows || []).forEach(function (row) {
                if (row.columns[value]) { // May have been deleted on startup
                    highed.dom.style(row.columns[value].element, {
                        'border-right': '',
                        'border-left': ''
                    });
                }
            });
        });
    }

    function removeCellColoring(previousValues) {
        removeOutlineFromCell(previousValues);
        decolorHeader(previousValues);
        decolorCells(previousValues);
    }

    function colorFields(values, color) {
        outlineCell(values, color);
        colorCells(values, color);
        colorHeader(values, color);
    }

    function highlightCells(previousValues, values, input, newOptions) {
        removeCellColoring(previousValues);
        colorFields(values, input.colors);
    // events.emit('AssignDataChanged', input, newOptions);
    }

    function removeAllCellsHighlight(previousValues, values, input, newOptions) {
        removeCellColoring(values);
    }

    function toggleUnwantedCells(values, toggle) {

        var found = false;

        gcolumns.forEach(function (col, index) {
            if (!values.indexOf(index) === -1) {
                // eslint-disable-next-line no-unused-expressions
                toggle ? col.hideColumns() : col.showColumns();
            } else {
                col.showColumns();

                if (!found && rows[0]) {
                    rows[0].columns[index].focus();
                    found = true;
                }

            }
        });
    }

    function getColumnLength() {
        return (rows[0] && rows[0].columns ? rows[0].columns.length : 2);
    }

    function areColumnsEmpty(colNumber) {
        return !rows.some(function (row) {
            return row.columns[colNumber].value() !== null;
        });
    }

    function areRowsEmpty(rowNumber) {
        return !rows[rowNumber].columns.some(function (column) {
            return column.value() !== null;
        });
    }

    function getDataFieldsUsed() {
        return dataFieldsUsed;
    }

    function isInCSVMode() {
        return (!isInGSheetMode && !isInLiveDataMode);
    }

    // Getting kinda long, probably need to move this all out of here to createchartpage
    function createTableInputs(inputs, maxColSpan, extraClass) {

        var table = highed.dom.cr('table', 'highed-createchartwizard-table'),
            // eslint-disable-next-line no-redeclare
            maxColSpan = maxColSpan,
            currentColSpan = maxColSpan,
            tr;

        inputs.forEach(function (input) {
            if (currentColSpan >= maxColSpan) {
                tr = highed.dom.cr('tr', extraClass);
                highed.dom.ap(table, tr);
                currentColSpan = 0;
            }

            currentColSpan += input.colspan;
            input.element = {};

            if (input.type && input.type === 'select') {
                input.element.dropdown = highed.DropDown(null, 'highed-wizard-dropdown-container');
                input.element.dropdown.addItems([
                    { id: 'columnsURL', title: 'JSON (Column Ordered)' },
                    { id: 'rowsURL', title: 'JSON (Row Ordered)' },
                    { id: 'csvURL', title: 'CSV' }
                ]);
                input.element.dropdown.selectByIndex(0);
                input.element.dropdown.on('Change', function (selected) {
                    detailValue = selected.id();
                });

                input.element.input = input.element.dropdown.container;

            } else {
                input.element.input = highed.dom.cr('input', 'highed-imp-input-stretch');
            }
            if (input.placeholder) {
                input.element.input.placeholder = input.placeholder;
            }
            input.element.label = highed.dom.cr('span', '', input.label);

            const tdLabel = highed.dom.ap(highed.dom.cr('td', 'highed-modal-label'), input.element.label),
                tdInput = highed.dom.ap(highed.dom.cr('td', ''), input.element.input);

            tdLabel.colSpan = 1;
            tdInput.colSpan = input.colspan - 1;

            highed.dom.ap(tr, tdLabel, tdInput);
        });
        return table;
    }

    function createCancelBtn() {
        cancel = highed.dom.cr('button', 'highed-ok-button highed-import-button grey', 'Cancel');
        highed.dom.on(cancel, 'click', function () {
            dataModal.hide();
        });
        return cancel;
    }

    function createLiveDataContainer(toNextPage) {
        const container = highed.dom.cr('div', 'highed-modal-container'),
            inputs = [
                { label: 'URL', placeholder: 'Spreadsheet ID', colspan: 2, linkedTo: liveDataInput },
                { label: 'Refresh Time in Seconds', placeholder: 'Refresh time  (leave blank for no refresh)', colspan: 2, linkedTo: liveDataIntervalInput },
                { label: 'Type', colspan: 2, linkedTo: liveDataTypeSelect, type: 'select' }],
            table = createTableInputs(inputs, 2, 'highed-live-data'),
            importData = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Import Data'),
            cancel = createCancelBtn();

        highed.dom.on(importData, 'click', function () {
            showLiveData(true);
            dataModal.hide();
            inputs.forEach(function (input) {
                if (input.type && input.type === 'select') {
                    input.linkedTo.selectByIndex(input.element.dropdown.getSelectedItem().index());
                } else {
                    input.linkedTo.value = input.element.input.value;
                }
            });
            liveDataLoadButton.click();
            toNextPage();
        });
        highed.dom.ap(container,
            highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', 'Import Live Data'),
            highed.dom.ap(highed.dom.cr('div'),
                highed.dom.cr('div', 'highed-modal-text', 'Live data needs a url to your JSON data to reference.'),
                highed.dom.cr('div', 'highed-modal-text', 'This means that the published chart always loads the latest version of your data.')),
            highed.dom.ap(highed.dom.cr('div', 'highed-table-container'), table),
            highed.dom.ap(highed.dom.cr('div', 'highed-button-container'), importData, cancel));

        return container;
    }

    function createGSheetContainer(toNextPage) {
        const container = highed.dom.cr('div', 'highed-modal-container');
        // eslint-disable-next-line no-unused-expressions
        inputs = [
            { label: 'Google Spreadsheet ID', placeholder: 'Spreadsheet ID', colspan: 4, linkedTo: gsheetID },
            { label: 'Worksheet', placeholder: 'Worksheet (leave blank for first)', colspan: 4, linkedTo: gsheetWorksheetID },
            { label: 'Refresh Time in Seconds', placeholder: 'Refresh time  (leave blank for no refresh)', colspan: 4, linkedTo: gsheetRefreshTime },
            { label: 'Start Row', colspan: 2, linkedTo: gsheetStartRow },
            { label: 'End Row', colspan: 2, linkedTo: gsheetEndRow },
            { label: 'Start Column', colspan: 2, linkedTo: gsheetStartCol },
            // eslint-disable-next-line no-sequences
            { label: 'End Column', colspan: 2, linkedTo: gsheetEndCol }],
        table = createTableInputs(inputs, 4),
        connectSheet = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Connect Sheet');
        cancel = createCancelBtn();

        highed.dom.on(connectSheet, 'click', function () {
            showGSheet(true);
            dataModal.hide();
            inputs.forEach(function (input) {
                input.linkedTo.value = input.element.input.value;
            });
            gsheetLoadButton.click();
            toNextPage();
        });

        highed.dom.ap(container,
            highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', 'Connect Google Sheet'),
            highed.dom.ap(highed.dom.cr('div'),
                highed.dom.cr('div', 'highed-modal-text', 'When using Google Spreadsheet, Highcharts references the sheet directly.'),
                highed.dom.cr('div', 'highed-modal-text', 'This means that the published chart always loads the latest version of the sheet.'),
                highed.dom.cr('div', 'highed-modal-text', 'For more information on how to set up your spreadsheet, visit the documentation.')),
            highed.dom.ap(highed.dom.cr('div', 'highed-table-container'), table),
            highed.dom.ap(highed.dom.cr('div', 'highed-button-container'), connectSheet, cancel));

        return container;
    }

    function createCutAndPasteContainer(toNextPage) {
        const container = highed.dom.cr('div', 'highed-modal-container');
        importData = highed.dom.cr('button', 'highed-ok-button highed-import-button negative', 'Import Data');
        // eslint-disable-next-line no-unused-expressions
        // eslint-disable-next-line no-sequences
        input = highed.dom.cr('textarea', 'highed-table-input'),
        cancel = createCancelBtn();

        highed.dom.on(importData, 'click', function () {
            importer.emitCSVImport(input.value);
            dataModal.hide();
            toNextPage();
        });

        highed.dom.ap(container,
            highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', 'Cut And Paste Data'),
            highed.dom.ap(
                highed.dom.cr('div'),
                highed.dom.cr('div', 'highed-modal-text', 'Paste CSV into the below box, or upload a file. Click Import to import your data.')
            ),
            highed.dom.ap(highed.dom.cr('div'), input),
            highed.dom.ap(highed.dom.cr('div', 'highed-button-container'), importData, cancel));

        return container;
    }

    function createSampleData(toNextPage, loading) {
        const container = highed.dom.cr('div', 'highed-modal-container'),
            buttonsContainer = highed.dom.cr('div', 'highed-modal-buttons-container');

        highed.samples.each(function (sample) {
            var data = sample.dataset.join('\n'),
                loadBtn = highed.dom.cr(
                    'button',
                    'highed-box-size highed-imp-button',
                    sample.title
                );

            highed.dom.style(loadBtn, { width: '99%' });

            highed.dom.on(loadBtn, 'click', function () {
                loading(true);
                dataModal.hide();
                importer.emitCSVImport(data, function () {
                    loading(false);
                    if (toNextPage) {
                        toNextPage();
                    }
                });
            });

            highed.dom.ap(
                buttonsContainer,
                // highed.dom.cr('div', '', name),
                // highed.dom.cr('br'),
                loadBtn,
                highed.dom.cr('br')
            );
        });

        highed.dom.ap(container, buttonsContainer);

        return container;
    }

    function createSimpleDataTable(toNextPage, loading) {
        var container = highed.dom.cr('div', 'highed-table-dropzone-container'),
            selectFile = highed.dom.cr('button', 'highed-ok-button highed-import-button', 'Select File'),
            buttonsContainer = highed.dom.cr('div'),
            modalContainer = highed.dom.cr('div', 'highed-table-modal'),
            gSheetContainer = createGSheetContainer(toNextPage),
            liveContainer = createLiveDataContainer(toNextPage),
            sampleDataContainer = createSampleData(toNextPage, loading);
        cutAndPasteContainer = createCutAndPasteContainer(toNextPage);

        var buttons = [{ title: 'Connect Google Sheet', linkedTo: gSheetContainer },
            { title: 'Import Live Data', linkedTo: liveContainer, height: 321 },
            { title: 'Cut and Paste Data', linkedTo: cutAndPasteContainer, height: 448, width: 518 },
            { title: 'Load Sample Data', linkedTo: sampleDataContainer }];

        buttons.forEach(function (buttonProp) {
            const button = highed.dom.cr('button', 'highed-ok-button highed-import-button', buttonProp.title);
            highed.dom.on(button, 'click', function () {
                dataModal.resize(buttonProp.width || 530, buttonProp.height || 530);
                modalContainer.innerHTML = '';
                highed.dom.ap(modalContainer, buttonProp.linkedTo);
                dataModal.show();
            });
            highed.dom.ap(buttonsContainer, button);
        });


        highed.dom.on(selectFile, 'click', function () {
            highed.readLocalFile({
                type: 'text',
                accept: '.csv',
                success: function (info) {
                    highed.snackBar('File uploaded');
                    importer.emitCSVImport(info.data);
                    // events.emit("AssignDataForFileUpload", info.data); - Does this later in loadCSV
                    toNextPage();
                }
            });
        });

        dataModal = highed.OverlayModal(false, {
            minWidth: 530,
            minHeight: 530,
            showCloseIcon: true
        });

        highed.dom.ap(dataModal.body, modalContainer);

        container.ondragover = function (e) {
            e.preventDefault();
        };

        container.ondrop = function (e) {
            e.preventDefault();

            var d = e.dataTransfer;
            var f;
            var i;

            if (d.items) {
                for (i = 0; i < d.items.length; i++) {
                    f = d.items[i];
                    if (f.kind === 'file') {
                        handleFileUpload(f.getAsFile(), function () {
                            highed.snackBar('File uploaded');
                            toNextPage();
                        });
                    }
                }
            } else {
                for (i = 0; i < d.files.length; i++) {
                    f = d.files[i];
                    handleFileUpload(f, function () {
                        highed.snackBar('File uploaded');
                        toNextPage();
                    });
                }
            }

            // events.emit('AssignDataForFileUpload');
            // toNextPage();
        };

        highed.dom.ap(container,
            highed.dom.ap(
                highed.dom.cr('div', 'highed-table-dropzone'),
                highed.dom.cr('div', 'highed-table-dropzone-title', 'Drop CSV files here'),
                highed.dom.cr('div', 'highed-table-dropzone-subtitle', 'or'),
                highed.dom.ap(
                    highed.dom.cr('div', 'highed-table-dropzone-button'),
                    selectFile
                ),
                highed.dom.cr('div', 'highed-table-dropzone-subtitle highed-table-dropzone-message', 'You can also:'),
                buttonsContainer
            )
        );

        return container;
    }

    // //////////////////////////////////////////////////////////////////////////

    highed.ready(function () {
        init();
    });

    // //////////////////////////////////////////////////////////////////////////

    return {
        toolbar: toolbar,
        sortRows: sortRows,
        clear: clear,
        addRow: addRow,
        insCol: insertCol,
        delCol: delCol,
        loadCSV: loadCSV,
        getRawCSV: getRawCSV,
        toData: toData,
        toCSV: toCSV,
        toDataSeries: toDataSeries,
        getHeaderTextArr: getHeaderTextArr,
        addImportTab: addImportTab,
        hideImportModal: hideImportModal,
        showImportModal: showImportModal,
        initGSheet: initGSheet,
        on: events.on,
        resize: resize,
        loadLiveDataFromURL: loadLiveDataFromURL,
        loadLiveDataPanel: loadLiveDataPanel,
        isInCSVMode: isInCSVMode,
        // highlightSelectedFields: highlightSelectedFields,
        highlightCells: highlightCells,
        removeAllCellsHighlight: removeAllCellsHighlight,
        toggleUnwantedCells: toggleUnwantedCells,
        getColumnLength: getColumnLength,
        getDataFieldsUsed: getDataFieldsUsed,
        createSimpleDataTable: createSimpleDataTable,
        areColumnsEmpty: areColumnsEmpty,
        clearData: clearData,
        showDataTableError: showDataTableError,
        hideDataTableError: hideDataTableError,
        selectSwitchRowsColumns: selectSwitchRowsColumns
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.DataPage = function (parent, options, chartPreview, chartFrame, props) {
    var events = highed.events(),
        // Main properties
        properties = highed.merge(
            {
                defaultChartOptions: {},
                useHeader: true,
                features: [
                    'data',
                    'templates',
                    'customize',
                    'customcode',
                    'advanced',
                    'export'
                ],
                importer: {},
                dataGrid: {},
                customizer: {},
                toolbarIcons: []
            },
            options
        ),
        container = highed.dom.cr(
            'div',
            'highed-transition highed-toolbox highed-box-size'
        ),
        title = highed.dom.cr('div', 'highed-dtable-title'),
        chartTitle = highed.dom.cr('div', 'highed-toolbox-body-chart-title'),
        chartTitleInput = highed.dom.cr('input', 'highed-toolbox-chart-title-input'),
        contents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-inner-body'
        ),
        userContents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-user-contents highed-toolbox-dtable'
        ),
        helpIcon = highed.dom.cr(
            'div',
            'highed-toolbox-help highed-icon fa fa-question-circle'
        ),
        iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon,
        icon = highed.dom.cr('div', iconClass),
        helpModal = highed.HelpModal(props.help || []),
        // Data table
        dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
        body = highed.dom.cr(
            'div',
            'highed-toolbox-body highed-datapage-body highed-box-size highed-transition'
        ),
        dataTable = highed.DataTable(
            dataTableContainer,
            highed.merge(
                {
                    importer: properties.importer
                },
                properties.dataGrid
            )
        ),
        addRowInput = highed.dom.cr('input', 'highed-field-input highed-add-row-input'),
        addRowBtn = highed.dom.cr('button', 'highed-import-button highed-ok-button highed-add-row-btn small', 'Add'),
        addRowDiv = highed.dom.ap(highed.dom.cr('div', 'highed-dtable-extra-options'),
            highed.dom.ap(highed.dom.cr('div', 'highed-add-row-container'),
                highed.dom.cr('span', 'highed-add-row-text highed-hide-sm', 'Add Rows'),
                addRowInput,
                addRowBtn
            )
        ),
        assignDataPanel = highed.AssignDataPanel(parent, dataTable),
        dataImportBtn = highed.dom.cr(
            'button',
            'highed-import-button highed-ok-button highed-sm-button',
            'Import');
    dataExportBtn = highed.dom.cr(
        'button',
        'highed-import-button highed-ok-button highed-hide-sm',
        'Export Data');
    // eslint-disable-next-line no-unused-expressions
    dataClearBtn = highed.dom.cr(
        'button',
        'highed-import-button highed-ok-button highed-sm-button',
        // eslint-disable-next-line no-sequences
        highed.L('dgNewBtn')),
    blacklist = [
        'candlestick',
        'bubble',
        'pie'
    ];

    dataImportBtn.innerHTML += ' <span class="highed-hide-sm">Data</span>';
    dataClearBtn.innerHTML += ' <span class="highed-hide-sm">Data</span>';

    addRowInput.value = 1;
    highed.dom.on(addRowBtn, 'click', function (e) {

        assignDataPanel.getFieldsToHighlight(dataTable.removeAllCellsHighlight, true);
        for (var i = 0; i < addRowInput.value; i++) {
            dataTable.addRow();
        }
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    });

    // eslint-disable-next-line no-unused-expressions
    highed.dom.on(dataImportBtn, 'click', function () {
        dataTable.showImportModal(0);
    }),
    highed.dom.on(dataExportBtn, 'click', function () {
        dataTable.showImportModal(1);
    }),

    highed.dom.on(dataClearBtn, 'click', function () {
        if (confirm('Start from scratch?')) {
            dataTable.clearData();
            assignDataPanel.init();
        }
    }),

    iconsContainer = highed.dom.cr('div', 'highed-toolbox-icons'),
    isVisible = true;

    function init() {

        if (!highed.onPhone()) {
            highed.dom.ap(iconsContainer, addRowDiv, dataClearBtn, dataImportBtn, dataExportBtn);
        } else {
            highed.dom.ap(iconsContainer, dataImportBtn);
        }

        highed.dom.ap(contents, highed.dom.ap(title, highed.dom.ap(chartTitle, chartTitleInput), iconsContainer), userContents);
        highed.dom.ap(body, contents);

        highed.dom.ap(userContents, dataTableContainer);
        dataTable.resize();

        if (highed.onPhone()) {
            highed.dom.style(body, {
                top: '47px',
                position: 'relative'
            });
        }

        highed.dom.ap(parent, highed.dom.ap(container, body));

        assignDataPanel.init(dataTable.getColumnLength());

        expand();
        resizeChart();
    }

    function afterResize(func) {
        var timer;
        return function (event) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, 100, event);
        };
    }
    function resize() {
        if (isVisible) {
            resizeChart();
            setTimeout(function () {
                expand();
            }, 100);
        // expand();
        }
    }

    highed.dom.on(window, 'resize', afterResize(function (e) {
        resize();
    }));


    function showHelp() {
        helpModal.show();
    }

    function expand() {
        // var bsize = highed.dom.size(bar);

        var newWidth = props.widths.desktop;
        if (highed.onTablet() && props.widths.tablet) {
            newWidth = props.widths.tablet;
        } else if (highed.onPhone() && props.widths.phone) {
            newWidth = props.widths.phone;
        }

        if (props.iconOnly) {
            return;
        }

        // console.log(bsize.h);
        highed.dom.style(body, {
            width: 100 + '%',
            // height: //(bsize.h - 55) + 'px',
            opacity: 1
        });

        if (!highed.onPhone()) {
        // (highed.dom.pos(assignDataPanel.getElement(), true).x - highed.dom.pos(dataTableContainer, true).x) - 10
            highed.dom.style(container, {
                // width: newWidth + '%'
                width: ((highed.dom.pos(assignDataPanel.getElement(), true).x - highed.dom.pos(dataTableContainer, true).x) + 14) + 'px'
            });
        }

        events.emit('BeforeResize', newWidth);

        function resizeBody() {
            var bsize = highed.dom.size(body),
                tsize = highed.dom.size(title),
                size = {
                    w: bsize.w,
                    h: (window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight) - highed.dom.pos(body, true).y
                };

            highed.dom.style(contents, {
                width: '100%',
                height: ((size.h - 16)) + 'px'
            });

            dataTable.resize();
            if (!highed.onPhone()) {
                assignDataPanel.resize(newWidth, highed.dom.pos(chartFrame, true).y - highed.dom.pos(body, true).y);
            }
        }

        setTimeout(resizeBody, 300);
        highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
        assignDataPanel.show();
        isVisible = true;
        resizeChart();
        resize();
    }

    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
        assignDataPanel.hide();
        isVisible = false;
    }

    function destroy() {}

    function addImportTab(tabOptions) {
        dataTable.addImportTab(tabOptions);
    }

    function hideImportModal() {
        dataTable.hideImportModal();
    }

    assignDataPanel.on('RemoveSeries', function (length) {
        clearSeriesMapping();
        chartPreview.data.deleteSeries(length);

        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

        chartPreview.data.csv({
            csv: data
        }, null, false, function () {


            var chartOptions = chartPreview.options.getCustomized();
            var assignDataOptions = assignDataPanel.getAllOptions();

            if (chartOptions && chartOptions.series) {
                if (chartOptions.series.length < assignDataOptions.length) {
                    var optionsLength = chartOptions.series.length;
                    var assignDataOptionsLength = assignDataOptions.length;
                    var type;

                    if (chartOptions.series.length !== 0) {
                        type = chartOptions.series[chartOptions.series.length - 1].type;
                    }
                    if (blacklist.includes(type)) {
                        type = null;
                    }

                    for (var i = optionsLength; i < assignDataOptionsLength; i++) {
                        chartPreview.options.addBlankSeries(i, type);
                    }
                }
            }

            setSeriesMapping(assignDataPanel.getAllOptions());
        });
    });

    function changeAssignDataTemplate(newTemplate, loadTemplateForEachSeries, cb) {

        if (dataTable.isInCSVMode()) {

            clearSeriesMapping();

            var seriesIndex = [];
            assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength(), null, null, true);
            if (loadTemplateForEachSeries) {
                const length = assignDataPanel.getAllOptions().length;

                for (var i = 0; i < length; i++) {
                    seriesIndex.push(i);
                    assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength(), null, i, true, i + 1);
                }
            } else {
                seriesIndex = [assignDataPanel.getActiveSerie()];
            }

            chartPreview.loadTemplateForSerie(newTemplate, seriesIndex);

            const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

            chartPreview.data.csv({
                csv: data
            }, null, false, function () {
                setSeriesMapping(assignDataPanel.getAllOptions());
                redrawGrid(true);
                if (cb) {
                    cb();
                }
            });
        } else {
            chartPreview.loadTemplate(newTemplate);
        }

    // assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    }

    function getIcons() {
        return null;
    }

    function setChartTitle(title) {
        chartTitleInput.value = title;
    }

    function showDataTableError() {
        dataTable.showDataTableError();
    }
    function hideDataTableError() {
        dataTable.hideDataTableError();
    }

    function getChartTitle() {
        return chartTitleInput.value;
    }

    function clearSeriesMapping() {

        var chartOptions = chartPreview.options.getCustomized();
        if (chartOptions.data && chartOptions.data.seriesMapping) {
            // Causes an issue when a user has added a assigndata input with seriesmapping, so just clear and it will add it in again later
            chartOptions.data.seriesMapping = null;
            chartPreview.options.setAll(chartOptions);
        }

    }
    function setSeriesMapping(allOptions) {

        var tempOption = [],
            chartOptions = chartPreview.options.getCustomized(),
            dataTableFields = dataTable.getDataFieldsUsed(),
            hasLabels = false;

        var dataValues  = allOptions.data,
            series = allOptions.length;

        for (var i = 0; i < series; i++) {
            var serieOption = {};
            // eslint-disable-next-line no-loop-func
            Object.keys(allOptions[i]).forEach(function (key) {
                const option = allOptions[i][key];
                if (option.value !== '') {
                    if (option.isData) { // (highed.isArr(option)) { // Data assigndata
                        if (dataTableFields.indexOf(option.rawValue[0]) > -1) {
                            serieOption[option.linkedTo] = dataTableFields.indexOf(option.rawValue[0]);
                        }
                    } else {
                        if (option.linkedTo === 'label') {
                            hasLabels = true;
                        }
                        if (dataTableFields.indexOf(option.rawValue[0]) > -1) {
                            serieOption[option.linkedTo] = dataTableFields.indexOf(option.rawValue[0]);
                        }
                        // serieOption[option.linkedTo] = option.rawValue[0];
                    }
                }
            });
            tempOption.push(serieOption);
        }

        if (tempOption.length > 0) {
            if (hasLabels) {
                const dataLabelOptions = {
                    dataLabels: {
                        enabled: true,
                        format: '{point.label}'
                    }
                };

                if (chartOptions.plotOptions) {
                    const seriesPlotOptions = chartOptions.plotOptions.series;
                    highed.merge(seriesPlotOptions, dataLabelOptions);
                    chartPreview.options.setAll(chartOptions);
                } else {
                    chartPreview.options.setAll(highed.merge({
                        plotOptions: {
                            series: dataLabelOptions
                        }
                    }, chartOptions));
                }
            }

            if (chartOptions.data) {
                chartOptions.data.seriesMapping = tempOption;
                chartPreview.options.setAll(chartOptions);
            }
        }
    }

    function redrawGrid(clearGridFirst) {
        if (clearGridFirst) {
            var columns = [];
            for (var i = 0; i < dataTable.getColumnLength(); i++) {
                columns.push(i);
            }
            dataTable.removeAllCellsHighlight(null, columns);
        }

        assignDataPanel.checkToggleCells();

        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true, true);
        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
    }

    function loadProject(projectData, aggregated) {

        if (projectData.settings && projectData.settings.dataProvider && projectData.settings.dataProvider.csv) {
            dataTable.loadCSV({
                csv: projectData.settings.dataProvider.csv
            }, null, null, function () {

                assignDataPanel.enable();

                assignDataPanel.setAssignDataFields(projectData, dataTable.getColumnLength(), true, null, true, true, aggregated);
                assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
                chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData()));
            });

            // chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
        }
    }

    // ////////////////////////////////////////////////////////////////////////////

    assignDataPanel.on('GoToTemplatePage', function () {
        events.emit('GoToTemplatePage');
    });

    assignDataPanel.on('AddSeries', function (index, type) {
        chartPreview.options.addBlankSeries(index, type);
    });

    assignDataPanel.on('GetLastType', function () {
        var chartOptions = chartPreview.options.getCustomized();
        var type = chartOptions.series[chartOptions.series.length - 1].type;

        if (blacklist.includes(type)) {
            type = null;
        }

        assignDataPanel.setColumnLength(dataTable.getColumnLength());
        assignDataPanel.addNewSerie(type);

    });

    chartPreview.on('LoadProjectData', function (csv) {
        dataTable.loadCSV(
            {
                csv: csv
            },
            true
        );
    });

    chartPreview.on('ChartChange', function (newData) {
        events.emit('ChartChangedLately', newData);
    });

    assignDataPanel.on('DeleteSeries', function (index) {
        clearSeriesMapping();
        chartPreview.data.deleteSerie(index);

        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        chartPreview.data.csv({
            csv: data
        }, null, false, function () {
            setSeriesMapping(assignDataPanel.getAllOptions());
        });

    });

    assignDataPanel.on('SeriesChanged', function (index) {
        events.emit('SeriesChanged', index);
    });

    assignDataPanel.on('ToggleHideCells', (options, toggle) => {
        var userActiveCells = Object.keys(options).filter(function (key) {
            if (options[key].rawValue && options[key].rawValue.length > 0) {
                return true;
            }
        }).map(function (key) {
            return options[key].rawValue[0];
        });

        dataTable.toggleUnwantedCells(userActiveCells, toggle);

    });

    assignDataPanel.on('AssignDataChanged', function () {

        clearSeriesMapping();
        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        chartPreview.data.csv({
            csv: data
        }, null, false, function () {
            setSeriesMapping(assignDataPanel.getAllOptions());
        });

        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());

    // dataTable.highlightSelectedFields(input);
    });

    assignDataPanel.on('RedrawGrid', function (clearGridFirst) {
        redrawGrid(clearGridFirst);
    });

    assignDataPanel.on('ChangeData', function (allOptions) {
    // Series map all of the "linkedTo" options
        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());

        chartPreview.data.csv({
            csv: data
        }, null, false, function () {
            setSeriesMapping(allOptions);
        });
    });

    dataTable.on('DisableAssignDataPanel', function () {
        assignDataPanel.disable();
    });

    dataTable.on('EnableAssignDataPanel', function () {
        assignDataPanel.enable();
    });

    dataTable.on('ColumnMoving', function () {
    // assignDataPanel.resetValues();
        assignDataPanel.getFieldsToHighlight(dataTable.removeAllCellsHighlight, true);
    });

    dataTable.on('ColumnMoved', function () {
    // assignDataPanel.resetValues();
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    });

    dataTable.on('InitLoaded', function () {
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    // dataTable.highlightSelectedFields(assignDataPanel.getOptions());
    });

    dataTable.on('initExporter', function (exporter) {
        exporter.init(
            chartPreview.export.json(),
            chartPreview.export.html(),
            chartPreview.export.svg(),
            chartPreview
        );
    });

    dataTable.on('AssignDataForFileUpload', function (rowsLength) {

        if (!rowsLength) {
            rowsLength = dataTable.getColumnLength();
        } // Remove first column for the categories, and second as its already added
        assignDataPanel.setColumnLength(rowsLength);
        rowsLength -= 2;

        var chartOptions = chartPreview.options.getCustomized();
        var type = chartOptions.series[chartOptions.series.length - 1].type;

        if (!blacklist.includes(type)) {
            assignDataPanel.addSeries(rowsLength, type);
        }
    });

    dataTable.on('AssignDataChanged', function (input, options) {
        chartOptions = chartPreview.toProject().options;
        if (chartOptions.data && chartOptions.data.seriesMapping) {
            // Causes an issue when a user has added a assigndata input with seriesmapping, so just clear and it will add it in again later
            chartOptions.data.seriesMapping = null;
            chartPreview.options.setAll(chartOptions);
        }

        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
        return chartPreview.data.csv({
            csv: dataTable.toCSV(';', true, options)
        });
    });

    dataTable.on('LoadLiveData', function (settings) {
    // chartPreview.data.live(settings);

        const liveDataSetting = {};

        liveDataSetting[settings.type] = settings.url;
        if (settings.interval && settings.interval > 0) {
            liveDataSetting.enablePolling = true;
            liveDataSetting.dataRefreshRate = settings.interval;
        }
        chartPreview.data.live(liveDataSetting);
    });

    /*
  dataTable.on('UpdateLiveData', function(p){
    chartPreview.data.liveURL(p);
  });
*/

    dataTable.on('LoadGSheet', function (settings) {
        assignDataPanel.disable();
        chartPreview.data.gsheet(settings);
    });

    dataTable.on('Change', function (headers, data) {

        chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true));

        chartPreview.data.csv({
            csv: dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData())
        }, null, true, function () {
            setSeriesMapping(assignDataPanel.getAllOptions()); // Not the most efficient way to do this but errors if a user just assigns a column with no data in.
        });
    });

    dataTable.on('ClearData', function () {
        chartPreview.data.clear();
    });

    dataTable.on('ClearSeriesForImport', function () {
        var options = chartPreview.options.getCustomized();
        options.series = [];
        assignDataPanel.restart();
    });

    dataTable.on('ClearSeries', function () {
        var options = chartPreview.options.getCustomized();
        options.series = [];
    });

    chartPreview.on('ProviderGSheet', function (p) {
        assignDataPanel.disable();
        dataTable.initGSheet(
            p.id || p.googleSpreadsheetKey,
            p.worksheet || p.googleSpreadsheetWorksheet,
            p.startRow,
            p.endRow,
            p.startColumn,
            p.endColumn,
            true,
            p.dataRefreshRate
        );
    });

    chartPreview.on('ProviderLiveData', function (p) {
        assignDataPanel.disable();
        dataTable.loadLiveDataPanel(p);
    });


    function createSimpleDataTable(toNextPage, cb) {
        return dataTable.createSimpleDataTable(toNextPage, cb);
    }

    function selectSwitchRowsColumns() {
        dataTable.selectSwitchRowsColumns();
    }

    function resizeChart(newWidth) {
        highed.dom.style(chartFrame, {
            /* left: newWidth + 'px',*/
            width: '99%',
            height: '45%',
            right: 0,
            left: 0,
            top: '278px'
        });
        chartPreview.resize();

        setTimeout(function () {
            chartPreview.resize();
        }, 200);
    }
    chartPreview.on('SetResizeData', function () {
    // setToActualSize();
    });


    return {
        on: events.on,
        destroy: destroy,
        addImportTab: addImportTab,
        hideImportModal: hideImportModal,
        chart: chartPreview,
        resize: resize,
        data: {
            on: dataTable.on,
            showLiveStatus: function () {}, // toolbox.showLiveStatus,
            hideLiveStatus: function () {}// toolbox.hideLiveStatus
        },
        hide: hide,
        show: show,
        dataTable: dataTable,
        isVisible: function () {
            return isVisible;
        },
        init: init,
        setChartTitle: setChartTitle,
        getChartTitle: getChartTitle,
        getIcons: getIcons,
        changeAssignDataTemplate: changeAssignDataTemplate,
        createSimpleDataTable: createSimpleDataTable,
        loadProject: loadProject,
        showDataTableError: showDataTableError,
        hideDataTableError: hideDataTableError,
        selectSwitchRowsColumns: selectSwitchRowsColumns
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.SimpleDataPage = function (parent, assignDataParent, options, chartPreview, chartFrame, props) {
    var events = highed.events(),
        // Main properties
        properties = highed.merge(
            {
                defaultChartOptions: {},
                useHeader: true,
                features: [
                    'data',
                    'templates',
                    'customize',
                    'customcode',
                    'advanced',
                    'export'
                ],
                importer: {},
                dataGrid: {},
                customizer: {},
                toolbarIcons: []
            },
            options
        ),
        container = highed.dom.cr(
            'div',
            'highed-transition highed-toolbox highed-simple-toolbox highed-box-size'
        ),
        title = highed.dom.cr('div', 'highed-dtable-title'),
        chartTitle = highed.dom.cr('div', 'highed-toolbox-body-chart-title'),
        chartTitleInput = highed.dom.cr('input', 'highed-toolbox-chart-title-input'),
        contents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-inner-body'
        ),
        userContents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-user-contents highed-toolbox-dtable'
        ),
        helpIcon = highed.dom.cr(
            'div',
            'highed-toolbox-help highed-icon fa fa-question-circle'
        ),
        iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon,
        icon = highed.dom.cr('div', iconClass),
        helpModal = highed.HelpModal(props.help || []),
        // Data table
        dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
        body = highed.dom.cr(
            'div',
            'highed-toolbox-body highed-simple-toolbox-body highed-datapage-body highed-box-size highed-transition'
        ),
        dataTable = highed.DataTable(
            dataTableContainer,
            highed.merge(
                {
                    importer: properties.importer
                },
                properties.dataGrid
            )
        ),
        addRowInput = highed.dom.cr('input', 'highed-field-input highed-add-row-input'),
        addRowBtn = highed.dom.cr('button', 'highed-import-button highed-ok-button highed-add-row-btn small', 'Add'),
        addRowDiv = highed.dom.ap(highed.dom.cr('div', 'highed-dtable-extra-options'),
            highed.dom.ap(highed.dom.cr('div', 'highed-add-row-container'),
                highed.dom.cr('span', 'highed-add-row-text highed-hide-sm', 'Add Rows'),
                addRowInput,
                addRowBtn
            )
        ),
        assignDataPanel = highed.AssignDataPanel(assignDataParent, dataTable, 'simple'),
        dataImportBtn = highed.dom.cr(
            'button',
            'highed-import-button highed-ok-button highed-sm-button',
            'Import');
    dataExportBtn = highed.dom.cr(
        'button',
        'highed-import-button highed-ok-button highed-hide-sm',
        'Export Data');
    // eslint-disable-next-line no-unused-expressions
    dataClearBtn = highed.dom.cr(
        'button',
        'highed-import-button highed-ok-button highed-sm-button',
        highed.L('dgNewBtn')),
    blacklist = [
        'candlestick',
        'bubble',
        'pie'
    ];

    dataImportBtn.innerHTML += ' <span class="highed-hide-sm">Data</span>';
    dataClearBtn.innerHTML += ' <span class="highed-hide-sm">Data</span>';

    addRowInput.value = 1;
    highed.dom.on(addRowBtn, 'click', function (e) {

        assignDataPanel.getFieldsToHighlight(dataTable.removeAllCellsHighlight, true);
        for (var i = 0; i < addRowInput.value; i++) {
            dataTable.addRow();
        }
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    });

    highed.dom.on(dataImportBtn, 'click', function () {
        dataTable.showImportModal(0);
    }),
    highed.dom.on(dataExportBtn, 'click', function () {
        dataTable.showImportModal(1);
    }),

    highed.dom.on(dataClearBtn, 'click', function () {
        if (confirm('Start from scratch?')) {
            dataTable.clearData();
            assignDataPanel.init();
        }
    }),

    iconsContainer = highed.dom.cr('div', 'highed-toolbox-icons'),
    isVisible = true;

    function init() {

        if (!highed.onPhone()) {
            highed.dom.ap(iconsContainer, addRowDiv, dataClearBtn, dataImportBtn, dataExportBtn);
        } else {
            highed.dom.ap(iconsContainer, dataImportBtn);
        }

        highed.dom.ap(contents, highed.dom.ap(title, highed.dom.ap(chartTitle, chartTitleInput), iconsContainer), userContents);
        highed.dom.ap(body, contents);

        highed.dom.ap(userContents, dataTableContainer);
        dataTable.resize();

        if (highed.onPhone()) {
            highed.dom.style(body, {
                top: '47px',
                position: 'relative'
            });
        }

        highed.dom.ap(parent, highed.dom.ap(container, body));

        assignDataPanel.init(dataTable.getColumnLength());

        expand();
    }

    function afterResize(func) {
        var timer;
        return function (event) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, 100, event);
        };
    }
    function resize() {
        if (isVisible) {
            setTimeout(function () {
                expand();
            }, 100);
        // expand();
        }
    }

    highed.dom.on(window, 'resize', afterResize(function (e) {
        resize();
    }));


    function showHelp() {
        helpModal.show();
    }

    function expand() {
        // var bsize = highed.dom.size(bar);

        var newWidth = 100;

        if (!highed.onPhone()) {
        // (highed.dom.pos(assignDataPanel.getElement(), true).x - highed.dom.pos(dataTableContainer, true).x) - 10
            highed.dom.style(container, {
                // width: newWidth + '%'
                width: '100%'
            });
        }

        events.emit('BeforeResize', newWidth);

        function resizeBody() {
            var bsize = highed.dom.size(body),
                tsize = highed.dom.size(title),
                size = {
                    w: bsize.w,
                    h: (window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight) - highed.dom.pos(body, true).y
                };

            highed.dom.style(contents, {
                width: '100%',
                height: ((size.h - 16)) + 'px'
            });

            dataTable.resize();
            if (!highed.onPhone()) {
                assignDataPanel.resize(newWidth, highed.dom.pos(chartFrame, true).y - highed.dom.pos(body, true).y);
            }
        }

        setTimeout(resizeBody, 300);
        highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
        assignDataPanel.show();
        isVisible = true;
        resize();
    }

    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
        assignDataPanel.hide();
        isVisible = false;
    }

    function destroy() {}

    function addImportTab(tabOptions) {
        dataTable.addImportTab(tabOptions);
    }

    function hideImportModal() {
        dataTable.hideImportModal();
    }

    assignDataPanel.on('RemoveSeries', function (length) {
        clearSeriesMapping();
        chartPreview.data.deleteSeries(length);

        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

        chartPreview.data.csv({
            csv: data
        }, null, false, function () {


            var chartOptions = chartPreview.options.getCustomized();
            var assignDataOptions = assignDataPanel.getAllOptions();

            if (chartOptions && chartOptions.series) {
                if (chartOptions.series.length < assignDataOptions.length) {
                    var optionsLength = chartOptions.series.length;
                    var assignDataOptionsLength = assignDataOptions.length;
                    var type;

                    if (chartOptions.series.length !== 0) {
                        type = chartOptions.series[chartOptions.series.length - 1].type;
                    }
                    if (blacklist.includes(type)) {
                        type = null;
                    }

                    for (var i = optionsLength; i < assignDataOptionsLength; i++) {
                        chartPreview.options.addBlankSeries(i, type);
                    }
                }
            }

            setSeriesMapping(assignDataPanel.getAllOptions());
        });
    });

    function changeAssignDataTemplate(newTemplate, loadTemplateForEachSeries, cb) {

        if (dataTable.isInCSVMode()) {

            clearSeriesMapping();

            var seriesIndex = [];
            assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength(), null, null, true);
            if (loadTemplateForEachSeries) {
                const length = assignDataPanel.getAllOptions().length;

                for (var i = 0; i < length; i++) {
                    seriesIndex.push(i);
                    assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength(), null, i, true, i + 1);
                }
            } else {
                seriesIndex = [assignDataPanel.getActiveSerie()];
            }

            chartPreview.loadTemplateForSerie(newTemplate, seriesIndex);

            const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

            chartPreview.data.csv({
                csv: data
            }, null, false, function () {
                setSeriesMapping(assignDataPanel.getAllOptions());
                redrawGrid(true);
                if (cb) {
                    cb();
                }
            });
        } else {
            chartPreview.loadTemplate(newTemplate);
        }

    // assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    }

    function getIcons() {
        return null;
    }

    function setChartTitle(title) {
        chartTitleInput.value = title;
    }

    function showDataTableError() {
        dataTable.showDataTableError();
    }
    function hideDataTableError() {
        dataTable.hideDataTableError();
    }

    function getChartTitle() {
        return chartTitleInput.value;
    }

    function clearSeriesMapping() {

        var chartOptions = chartPreview.options.getCustomized();
        if (chartOptions.data && chartOptions.data.seriesMapping) {
            // Causes an issue when a user has added a assigndata input with seriesmapping, so just clear and it will add it in again later
            chartOptions.data.seriesMapping = null;
            chartPreview.options.setAll(chartOptions);
        }

    }
    function setSeriesMapping(allOptions) {

        var tempOption = [],
            chartOptions = chartPreview.options.getCustomized(),
            dataTableFields = dataTable.getDataFieldsUsed(),
            hasLabels = false;

        var dataValues  = allOptions.data,
            series = allOptions.length;

        for (var i = 0; i < series; i++) {
            var serieOption = {};
            // eslint-disable-next-line no-loop-func
            Object.keys(allOptions[i]).forEach(function (key) {
                const option = allOptions[i][key];
                if (option.value !== '') {
                    if (option.isData) { // (highed.isArr(option)) { // Data assigndata
                        if (dataTableFields.indexOf(option.rawValue[0]) > -1) {
                            serieOption[option.linkedTo] = dataTableFields.indexOf(option.rawValue[0]);
                        }
                    } else {
                        if (option.linkedTo === 'label') {
                            hasLabels = true;
                        }
                        if (dataTableFields.indexOf(option.rawValue[0]) > -1) {
                            serieOption[option.linkedTo] = dataTableFields.indexOf(option.rawValue[0]);
                        }
                        // serieOption[option.linkedTo] = option.rawValue[0];
                    }
                }
            });
            tempOption.push(serieOption);
        }

        if (tempOption.length > 0) {
            if (hasLabels) {
                const dataLabelOptions = {
                    dataLabels: {
                        enabled: true,
                        format: '{point.label}'
                    }
                };

                if (chartOptions.plotOptions) {
                    const seriesPlotOptions = chartOptions.plotOptions.series;
                    highed.merge(seriesPlotOptions, dataLabelOptions);
                    chartPreview.options.setAll(chartOptions);
                } else {
                    chartPreview.options.setAll(highed.merge({
                        plotOptions: {
                            series: dataLabelOptions
                        }
                    }, chartOptions));
                }
            }

            if (chartOptions.data) {
                chartOptions.data.seriesMapping = tempOption;
                chartPreview.options.setAll(chartOptions);
            }
        }
    }

    function redrawGrid(clearGridFirst) {
        if (clearGridFirst) {
            var columns = [];
            for (var i = 0; i < dataTable.getColumnLength(); i++) {
                columns.push(i);
            }
            dataTable.removeAllCellsHighlight(null, columns);
        }
        assignDataPanel.checkToggleCells();
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
    }

    function loadProject(projectData, aggregated) {

        if (projectData.settings && projectData.settings.dataProvider && projectData.settings.dataProvider.csv) {
            dataTable.loadCSV({
                csv: projectData.settings.dataProvider.csv
            }, null, null, function () {

                assignDataPanel.enable();

                assignDataPanel.setAssignDataFields(projectData, dataTable.getColumnLength(), true, null, true, true, aggregated);
                assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
                chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData()));
            });

            // chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
        }
    }

    // ////////////////////////////////////////////////////////////////////////////

    assignDataPanel.on('GoToTemplatePage', function () {
        events.emit('GoToTemplatePage');
    });

    assignDataPanel.on('AddSeries', function (index, type) {
        chartPreview.options.addBlankSeries(index, type);
    });

    assignDataPanel.on('GetLastType', function () {
        var chartOptions = chartPreview.options.getCustomized();
        var type = chartOptions.series[chartOptions.series.length - 1];

        if (type) {
            type = type.type;
        }

        if (blacklist.includes(type)) {
            type = null;
        }

        assignDataPanel.setColumnLength(dataTable.getColumnLength());
        assignDataPanel.addNewSerie(type);

    });

    chartPreview.on('LoadProjectData', function (csv) {
        dataTable.loadCSV(
            {
                csv: csv
            },
            true
        );
    });

    chartPreview.on('ChartChange', function (newData) {
        events.emit('ChartChangedLately', newData);
    });

    assignDataPanel.on('DeleteSeries', function (index) {
        clearSeriesMapping();
        chartPreview.data.deleteSerie(index);

        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        chartPreview.data.csv({
            csv: data
        }, null, false, function () {
            setSeriesMapping(assignDataPanel.getAllOptions());
        });

    });

    assignDataPanel.on('SeriesChanged', function (index) {
        events.emit('SeriesChanged', index);
    });

    assignDataPanel.on('ToggleHideCells', function (options, toggle) {
        var userActiveCells = Object.keys(options).filter(function (key) {
            if (options[key].rawValue && options[key].rawValue.length > 0) {
                return true;
            }
        }).map(function (key) {
            return options[key].rawValue[0];
        });

        dataTable.toggleUnwantedCells(userActiveCells, toggle);

    });

    assignDataPanel.on('AssignDataChanged', function () {

        clearSeriesMapping();
        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        chartPreview.data.csv({
            csv: data
        }, null, false, function () {
            setSeriesMapping(assignDataPanel.getAllOptions());
        });

        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());

    // dataTable.highlightSelectedFields(input);
    });

    assignDataPanel.on('RedrawGrid', function (clearGridFirst) {
        redrawGrid(clearGridFirst);
    });

    assignDataPanel.on('ChangeData', function (allOptions) {
    // Series map all of the "linkedTo" options
        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());

        chartPreview.data.csv({
            csv: data
        }, null, false, function () {
            setSeriesMapping(allOptions);
        });
    });

    dataTable.on('DisableAssignDataPanel', function () {
        assignDataPanel.disable();
    });

    dataTable.on('EnableAssignDataPanel', function () {
        assignDataPanel.enable();
    });

    dataTable.on('ColumnMoving', function () {
    // assignDataPanel.resetValues();
        assignDataPanel.getFieldsToHighlight(dataTable.removeAllCellsHighlight, true);
    });

    dataTable.on('ColumnMoved', function () {
    // assignDataPanel.resetValues();
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    });

    dataTable.on('InitLoaded', function () {
        assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    // dataTable.highlightSelectedFields(assignDataPanel.getOptions());
    });

    dataTable.on('initExporter', function (exporter) {
        exporter.init(
            chartPreview.export.json(),
            chartPreview.export.html(),
            chartPreview.export.svg(),
            chartPreview
        );
    });

    dataTable.on('AssignDataForFileUpload', function (rowsLength) {

        if (!rowsLength) {
            rowsLength = dataTable.getColumnLength();
        } // Remove first column for the categories, and second as its already added
        assignDataPanel.setColumnLength(rowsLength);
        rowsLength -= 2;

        var chartOptions = chartPreview.options.getCustomized();
        var type = chartOptions.series[chartOptions.series.length - 1].type;

        if (!blacklist.includes(type)) {
            assignDataPanel.addSeries(rowsLength, type);
        }
    });

    dataTable.on('AssignDataChanged', function (input, options) {
        chartOptions = chartPreview.toProject().options;
        if (chartOptions.data && chartOptions.data.seriesMapping) {
            // Causes an issue when a user has added a assigndata input with seriesmapping, so just clear and it will add it in again later
            chartOptions.data.seriesMapping = null;
            chartPreview.options.setAll(chartOptions);
        }

        chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
        return chartPreview.data.csv({
            csv: dataTable.toCSV(';', true, options)
        });
    });

    dataTable.on('LoadLiveData', function (settings) {
    // chartPreview.data.live(settings);

        const liveDataSetting = {};

        liveDataSetting[settings.type] = settings.url;
        if (settings.interval && settings.interval > 0) {
            liveDataSetting.enablePolling = true;
            liveDataSetting.dataRefreshRate = settings.interval;
        }
        chartPreview.data.live(liveDataSetting);
    });
    /*
  dataTable.on('UpdateLiveData', function(p){
    chartPreview.data.liveURL(p);
  });
*/

    dataTable.on('LoadGSheet', function (settings) {
        assignDataPanel.disable();
        chartPreview.data.gsheet(settings);
    });

    dataTable.on('Change', function (headers, data) {

        chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true));

        chartPreview.data.csv({
            csv: dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData())
        }, null, true, function () {
            setSeriesMapping(assignDataPanel.getAllOptions()); // Not the most efficient way to do this but errors if a user just assigns a column with no data in.
        });
    });

    dataTable.on('ClearData', function () {
        chartPreview.data.clear();
    });

    dataTable.on('ClearSeriesForImport', function () {
        var options = chartPreview.options.getCustomized();
        options.series = [];
        assignDataPanel.restart();
    });

    dataTable.on('ClearSeries', function () {
        var options = chartPreview.options.getCustomized();
        options.series = [];
    });

    chartPreview.on('ProviderGSheet', function (p) {
        assignDataPanel.disable();
        dataTable.initGSheet(
            p.id || p.googleSpreadsheetKey,
            p.worksheet || p.googleSpreadsheetWorksheet,
            p.startRow,
            p.endRow,
            p.startColumn,
            p.endColumn,
            true,
            p.dataRefreshRate
        );
    });

    chartPreview.on('ProviderLiveData', function (p) {
        assignDataPanel.disable();
        dataTable.loadLiveDataPanel(p);
    });


    function createSimpleDataTable(toNextPage, cb) {
        return dataTable.createSimpleDataTable(toNextPage, cb);
    }

    function selectSwitchRowsColumns() {
        dataTable.selectSwitchRowsColumns();
    }

    function resizeChart(newWidth) {
        highed.dom.style(chartFrame, {
            /* left: newWidth + 'px',*/
            width: '28%',
            height: '38%'
        });
        chartPreview.resize();

        setTimeout(function () {
            chartPreview.resize();
        }, 200);
    }
    chartPreview.on('SetResizeData', function () {
    // setToActualSize();
    });


    return {
        on: events.on,
        destroy: destroy,
        addImportTab: addImportTab,
        hideImportModal: hideImportModal,
        chart: chartPreview,
        resize: resize,
        data: {
            on: dataTable.on,
            showLiveStatus: function () {}, // toolbox.showLiveStatus,
            hideLiveStatus: function () {}// toolbox.hideLiveStatus
        },
        hide: hide,
        show: show,
        dataTable: dataTable,
        isVisible: function () {
            return isVisible;
        },
        init: init,
        setChartTitle: setChartTitle,
        getChartTitle: getChartTitle,
        getIcons: getIcons,
        changeAssignDataTemplate: changeAssignDataTemplate,
        createSimpleDataTable: createSimpleDataTable,
        loadProject: loadProject,
        showDataTableError: showDataTableError,
        hideDataTableError: hideDataTableError,
        selectSwitchRowsColumns: selectSwitchRowsColumns
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.CreateChartPage = function (parent, userOptions, props) {
    var events = highed.events(),
        builtInOptions = [
            {
                id: 1,
                title: 'Choose Template',
                permission: 'templates',
                create: function (body) {
                    highed.dom.ap(body, templateContainer);
                }
            },
            {
                id: 2,
                title: 'Title Your Chart',
                create: function (body) {
                    highed.dom.ap(body, titleContainer);
                }
            },
            {
                id: 3,
                title: 'Import Data',
                create: function (body) {
                    highed.dom.ap(body, dataTableContainer);
                }
            },
            {
                id: 4,
                title: 'Customize',
                permission: 'customize',
                hideTitle: true,
                create: function (body) {
                    highed.dom.ap(body, customizerContainer);
                }
            }
        ],
        container = highed.dom.cr(
            'div',
            'highed-transition highed-toolbox wizard highed-box-size '
        ),
        title = highed.dom.cr('div', 'highed-toolbox-body-title'),
        contents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-inner-body'
        ),
        userContents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-user-contents test-test'
        ),
        body = highed.dom.cr(
            'div',
            'highed-toolbox-body highed-box-size highed-transition'
        ),
        listContainer = highed.dom.cr('div', 'highed-toolbox-createchart-list'),
        isVisible = false,
        customizerContainer = highed.dom.cr('div', 'highed-toolbox-customise'),
        titleContainer = highed.dom.cr('div', 'highed-toolbox-title'),
        templateContainer = highed.dom.cr('div', 'highed-toolbox-template'),
        dataTableContainer = highed.dom.cr('div', 'highed-toolbox-data'),
        // toolbox = highed.Toolbox(userContents),
        options = [];

    function init(dataPage, templatePage, customizePage) {

        var counter = 1;
        toolbox = highed.Toolbox(userContents);
        builtInOptions.forEach(function (option, index) {
            if (option.permission && userOptions.indexOf(option.permission) === -1) {
                return;
            }

            var o = toolbox.addEntry({
                title: option.title,
                number: counter, // option.id,
                onClick: manualSelection,
                hideTitle: option.hideTitle
            });

            if (highed.isFn(option.create)) {
                option.create(o.body);
            }

            options.push(o);
            counter++;

        });
        options[0].expand();

        createTitleSection();
        createImportDataSection(dataPage);
        createTemplateSection(templatePage);
        createCustomizeSection();

        highed.dom.ap(contents, userContents);
        highed.dom.ap(body, contents);

        // highed.dom.ap(userContents, listContainer);

        highed.dom.ap(parent, highed.dom.ap(container, body));

        expand();
    }


    function createTitleSection() {

        var titleInput = highed.dom.cr('input', 'highed-imp-input'),
            subtitleInput = highed.dom.cr('input', 'highed-imp-input'),
            nextButton = highed.dom.cr(
                'button',
                'highed-ok-button highed-import-button negative',
                'Next'
            ),
            skipAll = highed.dom.cr('span', 'highed-toolbox-skip-all', 'Skip All');

        titleInput.placeholder = 'Enter chart title';
        subtitleInput.placeholder = 'Enter chart subtitle';

        titleInput.value = '';
        subtitleInput.value = '';

        highed.dom.on(nextButton, 'click', function () {

            if (userOptions && (userOptions.indexOf('templates') === -1)) {
                options[1].expand();
            } else {
                options[2].expand();
            }
            events.emit('SimpleCreateChangeTitle', {
                title: titleInput.value,
                subtitle: subtitleInput.value
            });
        });

        highed.dom.on(skipAll, 'click', function () {
            events.emit('SimpleCreateChartDone', true);
        });

        highed.dom.ap(titleContainer,
            highed.dom.cr(
                'table'
            ),
            highed.dom.ap(
                highed.dom.cr('tr', 'highed-toolbox-input-container'),
                highed.dom.cr(
                    'td',
                    'highed-toolbox-label',
                    'Chart Title'
                ),
                highed.dom.ap(highed.dom.cr('td'), titleInput)
            ),
            highed.dom.ap(
                highed.dom.cr('tr', 'highed-toolbox-input-container'),
                highed.dom.cr(
                    'td',
                    'highed-toolbox-label',
                    'Subtitle'
                ),
                highed.dom.ap(highed.dom.cr('td'), subtitleInput)
            ),
            highed.dom.ap(
                highed.dom.cr('tr'),
                highed.dom.cr('td'),
                highed.dom.ap(
                    highed.dom.cr('td', 'highed-toolbox-button-container'),
                    skipAll,
                    nextButton
                )
            )
        );
    }

    function createImportDataSection(dataPage) {

        var nextButton = highed.dom.cr(
                'button',
                'highed-ok-button highed-import-button negative',
                'No thanks, I will enter my data manually'
            ),
            loader = highed.dom.cr('span', 'highed-wizard-loader', '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>'),
            dataTableDropzoneContainer = dataPage.createSimpleDataTable(function () {
                if (userOptions && (userOptions.indexOf('templates') === -1)) {
                    options[2].expand();
                } else if (userOptions && (userOptions.indexOf('customize') === -1)) {
                    events.emit('SimpleCreateChartDone', true);
                } else {
                    options[3].expand();
                }

            }, function (loading) {
                if (loading) {
                    loader.classList += ' active';
                } else {
                    loader.classList.remove('active');
                }
            });

        highed.dom.on(nextButton, 'click', function () {
            if (userOptions && (userOptions.indexOf('templates') === -1)) {
                options[2].expand();
            } else if (userOptions && (userOptions.indexOf('customize') === -1)) {
                events.emit('SimpleCreateChartDone', true);
            } else {
                options[3].expand();
            }
        });
        highed.dom.ap(dataTableContainer,
            highed.dom.ap(dataTableDropzoneContainer,
                highed.dom.ap(
                    highed.dom.cr('div', 'highed-toolbox-button-container'),
                    loader,
                    nextButton
                )
            )
        );
    }

    function createTemplateSection(templatePage) {

        var nextButton = highed.dom.cr(
                'button',
                'highed-ok-button highed-import-button negative',
                'Choose A Template Later'
            ),
            skipAll = highed.dom.ap(highed.dom.cr('div', 'highed-toolbox-skip-all'), highed.dom.cr('span', '', 'Skip All'));
        loader = highed.dom.cr('span', 'highed-wizard-loader ', '<i class="fa fa-spinner fa-spin fa-1x fa-fw a"></i>'),
        templatesContainer = templatePage.createMostPopularTemplates(function () {
            setTimeout(function () {
                options[1].expand();
            }, 200);
        }, function (loading) {
            if (loading) {
                loader.classList += ' active';
            } else {
                loader.classList.remove('active');
            }
        });

        highed.dom.on(skipAll, 'click', function () {
            events.emit('SimpleCreateChartDone', true);
        });

        highed.dom.on(nextButton, 'click', function () {
            options[1].expand();
        });

        highed.dom.ap(templateContainer,
            highed.dom.ap(highed.dom.cr('div', 'highed-toolbox-template-body'),
                highed.dom.ap(
                    highed.dom.cr('div', 'highed-toolbox-text'),
                    highed.dom.cr('div', 'highed-toolbox-template-text', 'Pick a basic starter template. You can change it later.'),
                    highed.dom.cr('div', 'highed-toolbox-template-text', 'If you\'re not sure, just hit Choose A Template Later.')
                ),
                highed.dom.ap(
                    highed.dom.cr('div', 'highed-toolbox-extras'),
                    nextButton,
                    highed.dom.ap(
                        skipAll,
                        loader
                    )
                )
            ),
            templatesContainer
        );
    }

    function createCustomizeSection() {

        var nextButton = highed.dom.cr(
            'button',
            'highed-ok-button highed-import-button negative',
            'Customize Your Chart'
        );// ,
        // dataTableDropzoneContainer = dataPage.createSimpleDataTable();

        highed.dom.on(nextButton, 'click', function () {
            events.emit('SimpleCreateChartDone');
        });

        highed.dom.ap(customizerContainer,
            highed.dom.cr('div', 'highed-toolbox-customize-header', 'You\'re Done!'),
            highed.dom.ap(
                highed.dom.cr('div', 'highed-toolbox-button-container'),
                nextButton
            )
        );
    }

    function manualSelection(number) {
        options.forEach(function (option, i) {
            if (i + 1 <= number) {
                option.disselect();
            } else {
                option.removeCompleted();
            }
        });
    }

    function resize() {
        if (isVisible) {
            expand();
        }
    }

    highed.dom.on(window, 'resize', resize);

    function expand() {
        // var bsize = highed.dom.size(bar);

        var newWidth = props.widths.desktop;
        if (highed.onTablet() && props.widths.tablet) {
            newWidth = props.widths.tablet;
        } else if (highed.onPhone() && props.widths.phone) {
            newWidth = props.widths.phone;
        }

        highed.dom.style(body, {
            width: 100 + '%',
            // height: //(bsize.h - 55) + 'px',
            opacity: 1
        });

        highed.dom.style(container, {
            width: newWidth + '%'
        });

        events.emit('BeforeResize', newWidth);

        function resizeBody() {
            var bsize = highed.dom.size(body),
                tsize = highed.dom.size(title),
                size = {
                    w: bsize.w,
                    h: (window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) - highed.dom.pos(body, true).y
                };

            highed.dom.style(contents, {
                width: size.w + 'px',
                height: ((size.h - 16)) + 'px'
            });
        }

        setTimeout(resizeBody, 300);
        highed.emit('UIAction', 'ToolboxNavigation', props.title);

    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
        isVisible = true;
        // expand();

    }
    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
        isVisible = false;
    }

    function destroy() {}

    function getIcons() {
        return null;
    }

    // ////////////////////////////////////////////////////////////////////////////

    return {
        on: events.on,
        destroy: destroy,
        hide: hide,
        show: show,
        isVisible: function () {
            return isVisible;
        },
        init: init,
        getIcons: getIcons
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.CustomizePage = function (parent, options, chartPreview, chartFrame, props, chartContainer, planCode) {
    var events = highed.events(),
        // Main properties
        container = highed.dom.cr(
            'div',
            'highed-transition highed-toolbox highed-box-size'
        ),
        title = highed.dom.cr('div', 'highed-toolbox-body-title'),
        customizeTitle,
        contents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-inner-body'
        ),
        userContents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-user-contents test'
        ),
        helpIcon = highed.dom.cr(
            'div',
            'highed-toolbox-help highed-icon fa fa-question-circle'
        ),
        width,
        chartWidth = 68,
        iconClass,
        autoAppearanceTab = true,
        icon = highed.dom.cr('div', iconClass),
        helpModal,
        // Data table
        customizerContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
        customizer,
        body = highed.dom.cr(
            'div',
            'highed-toolbox-body highed-box-size highed-transition'
        ),
        iconsContainer = highed.dom.cr('div', 'highed-icons-container'),
        annotationContainer,
        activeAnnotation = null,
        annotationOptions = [{
            tooltip: 'Add Circle',
            icon: 'circle',
            value: 'circle',
            draggable: true
        }, {
            tooltip: 'Add Square',
            icon: 'stop',
            value: 'rect',
            draggable: true
        }, {
            tooltip: 'Add Annotations',
            icon: 'comment',
            value: 'label',
            draggable: true
        }, {
            tooltip: 'Move',
            icon: 'arrows',
            value: 'drag'
        }, {
            tooltip: 'Remove',
            icon: 'trash',
            value: 'delete'
        }, {
            tooltip: 'Close',
            icon: 'times',
            onClick: function () {
                annotationOptions.forEach(function (o) {
                    o.element.classList.remove('active');
                });

                chartPreview.setIsAnnotating(false);
                annotationContainer.classList.remove('active');
            }
        }],
        buttons = [
            {
                tooltip: 'Basic',
                onClick: function () {
                    reduceSize(customizer.showSimpleEditor);
                },
                icon: 'cog'
            },
            {
                tooltip: 'Advanced',
                noPermission: options.noAdvanced,
                onClick: function () {
                    customizer.showAdvancedEditor();
                },
                icon: 'cogs'
            },
            {
                tooltip: 'Custom Code',
                noPermission: options.noCustomCode,
                onClick: function () {
                    reduceSize(customizer.showCustomCode);
                },
                icon: 'code'
            },
            {
                tooltip: 'Preview Options',
                noPermission: options.noPreview,
                onClick: function () {

                    reduceSize(customizer.showPreviewOptions);

                },
                icon: 'eye'
            }
        ],

        isVisible = false,
        searchAdvancedOptions = highed.SearchAdvancedOptions(parent),
        resolutionSettings = highed.dom.cr('span', 'highed-resolution-settings'),
        phoneIcon = highed.dom.cr('span', '', '<i class="fa fa-mobile" aria-hidden="true"></i>');
    tabletIcon = highed.dom.cr('span', '', '<i class="fa fa-tablet" aria-hidden="true"></i>'),
    tabletIcon = highed.dom.cr('span', '', '<i class="fa fa-tablet" aria-hidden="true"></i>'),
    stretchToFitIcon = highed.dom.cr('span', '', '<i class="fa fa-laptop" aria-hidden="true"></i>'),
    chartSizeText = highed.dom.cr('span', 'text', 'Chart Size:'),
    resWidth = highed.dom.cr('input', 'highed-res-number'),
    resHeight = highed.dom.cr('input', 'highed-res-number'),
    resolutions = [
        {
            iconElement: phoneIcon,
            width: 414,
            height: 736
        },
        {
            iconElement: tabletIcon,
            width: 1024,
            height: 768
        }
    ],
    overlayAddTextModal = highed.OverlayModal(false, {
        // zIndex: 20000,
        showOnInit: false,
        width: 300,
        height: 350,
        class: ' highed-annotations-modal'
    }),
    activeColor = 'rgba(0, 0, 0, 0.75)',
    addTextModalContainer = highed.dom.cr('div', 'highed-add-text-popup'),
    addTextModalInput = highed.dom.cr('textarea', 'highed-imp-input-stretch'),
    colorDropdownParent = highed.dom.cr('div'),
    typeDropdownParent = highed.dom.cr('div'),
    addTextModalHeader = highed.dom.cr('div', 'highed-modal-header', 'Add Annotation'),
    addTextModalColorSelect = highed.DropDown(colorDropdownParent),
    addTextModalTypeOptions = [{
        text: 'Callout',
        icon: 'comment-o',
        value: 'callout'
    }, {
        text: 'Connector',
        icon: 'external-link',
        value: 'connector'
    }, {
        text: 'Circle',
        icon: 'circle-o',
        value: 'circle'
    }],
    addTextModalTypeValue = 'callout',
    addTextModalColorValue = '#000000',
    addTextModalColorContainer = highed.dom.cr('div', 'highed-modal-color-container'),
    addTextModalColorInput = highed.dom.cr('input', 'highed-color-input'),
    box = highed.dom.cr('div', 'highed-field-colorpicker', ''),
    addTextModalBtnContainer = highed.dom.cr('div', 'highed-modal-button-container'),
    addTextModalSubmit = highed.dom.cr('button', 'highed-ok-button highed-import-button mini', 'Save'),
    addTextModalCancel = highed.dom.cr('button', 'highed-ok-button highed-import-button grey negative mini', 'Cancel'),
    addLabelX = null,
    addLabelY = null;

    resWidth.placeholder = 'W';
    resHeight.placeholder = 'H';

    addTextModalColorSelect.addItems([
        {
            title: 'Black',
            id: 'black',
            select: function () {
                activeColor = 'rgba(0, 0, 0, 0.75)';
            }
        },
        {
            title: 'Red',
            id: 'red',
            select: function () {
                activeColor = 'rgba(255, 0, 0, 0.75)';
            }
        },
        {
            title: 'Blue',
            id: 'blue',
            select: function () {
                activeColor = 'rgba(0, 0, 255, 0.75)';
            }
        }
    ]);

    addTextModalColorSelect.selectByIndex(0);

    addTextModalColorInput.value = addTextModalColorValue;

    highed.dom.on(addTextModalCancel, 'click', function () {
        overlayAddTextModal.hide();
    });

    highed.dom.style(box, {
        background: addTextModalColorValue,
        color: highed.getContrastedColor(addTextModalColorValue)
    });

    addTextModalTypeOptions.forEach(function (option) {

        var container = highed.dom.cr('div', 'highed-annotation-modal-container ' + (addTextModalTypeValue === option.value ? ' active' : '')),
            icon = highed.dom.cr('div', 'highed-modal-icon fa fa-' + option.icon),
            text = highed.dom.cr('div', 'highed-modal-text', option.text);
        option.element = container;

        highed.dom.on(container, 'click', function () {
            addTextModalTypeOptions.forEach(function (o) {
                if (o.element.classList.contains('active'))  {
                    o.element.classList.remove('active');
                }
            });
            option.element.classList += ' active';
            addTextModalTypeValue = option.value;
        });

        highed.dom.ap(typeDropdownParent, highed.dom.ap(container, icon, text));
    });

    addTextModalInput.placeholder = 'Write annotation here';


    function update(col) {
        if (
            col &&
        col !== 'null' &&
        col !== 'undefined' &&
        typeof col !== 'undefined'
        ) {
            box.innerHTML = '';
        // box.innerHTML = col;
        } else {
            box.innerHTML = 'auto';
            col = '#FFFFFF';
        }

        highed.dom.style(box, {
            background: col,
            color: highed.getContrastedColor(col)
        });

    }

    var timeout = null;
    highed.dom.on(addTextModalColorInput, 'change', function (e) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            addTextModalColorValue = addTextModalColorInput.value;
            update(addTextModalColorValue);
        }, 500);
    });

    highed.dom.on(box, 'click', function (e) {
        highed.pickColor(e.clientX, e.clientY, addTextModalColorValue, function (col) {
            if (highed.isArr(addTextModalColorValue)) {
                addTextModalColorValue = '#000000';
            }

            addTextModalColorValue = col;
            addTextModalColorInput.value = addTextModalColorValue;
            update(col);
        });
    });

    highed.dom.ap(overlayAddTextModal.body,
        highed.dom.ap(addTextModalContainer,
            addTextModalHeader,
            addTextModalInput,
            highed.dom.cr('div', 'highed-add-text-label', 'Type:'),
            typeDropdownParent,
            highed.dom.cr('div', 'highed-add-text-label', 'Color:'),
            // colorDropdownParent,
            highed.dom.ap(addTextModalColorContainer, box, addTextModalColorInput),
            highed.dom.ap(addTextModalBtnContainer,
                addTextModalSubmit,
                addTextModalCancel
            )
        )
    );

    highed.dom.on(addTextModalSubmit, 'click', function () {
        overlayAddTextModal.hide();
        chartPreview.addAnnotationLabel(addLabelX, addLabelY, addTextModalInput.value.replace('\n', '<br/>'), addTextModalColorValue, addTextModalTypeValue);
        addTextModalInput.value = '';

    });

    function usingSafari() {
        return (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Mac') !== -1 && navigator.userAgent.indexOf('Chrome') === -1);
    }

    function init() {

        width = props.width,
        customizeTitle = highed.dom.cr('div', 'highed-customize-title'/* , props.title*/),
        iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon;

        customizerContainer.innerHTML = '';

        customizer = highed.ChartCustomizer(
            customizerContainer,
            options,
            chartPreview,
            planCode
        ),
        helpModal = highed.HelpModal(props.help || []);

        customizer.on('PropertyChange', chartPreview.options.set);
        customizer.on('PropertySetChange', chartPreview.options.setAll);
        customizer.on('TogglePlugins', chartPreview.options.togglePlugins);

        customizer.on('AdvancedBuilt', function () {

            var bsize = highed.dom.size(body),
                size = {
                    w: bsize.w,
                    h: (window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) - highed.dom.pos(body, true).y
                };

            searchAdvancedOptions.resize(width, (size.h - highed.dom.size(chartFrame).h) - 15);

            searchAdvancedOptions.setOptions(customizer.getAdvancedOptions());
        });

        customizer.on('AnnotationsClicked', function () {
            chartPreview.options.togglePlugins('annotations', 1);
        });

        customizer.on('AdvanceClicked', function () {

            width = 66;
            if (highed.onTablet()) {
                width = 64;
            }

            chartWidth = 28;
            highed.dom.style(backIcon, {
                display: 'inline-block'
            });

            expand();
            resizeChart(300);

            setTimeout(chartPreview.resize, 1000);
            searchAdvancedOptions.show();
        });

        highed.dom.ap(resolutionSettings, chartSizeText, stretchToFitIcon, tabletIcon, phoneIcon, resWidth, resHeight);

        title.innerHTML = '';

        iconsContainer.innerHTML = '';

        if (!highed.onPhone()) {
            buttons.forEach(function (button, i) {
                if (button.noPermission) {
                    return;
                }

                button.element = highed.dom.cr('span', 'highed-toolbox-custom-code-icon highed-template-tooltip ' + (i === 0 ? ' active' : ''), '<i class="fa fa-' + button.icon + '" aria-hidden="true"></i><span class="highed-tooltip-text">' + button.tooltip + '</span>');

                highed.dom.on(button.element, 'click', function () {
                    buttons.forEach(function (b) {
                        if (!b.noPermission)  {
                            b.element.classList.remove('active');
                        }
                    });
                    button.element.classList.add('active');
                    button.onClick();
                });
                highed.dom.ap(iconsContainer, button.element);
            });
        }

        var annotationButton = highed.dom.cr('span', 'highed-template-tooltip annotation-buttons ' + (usingSafari() ? ' usingsafari ' : ''), '<i class="fa fa-commenting" aria-hidden="true"></i><span class="highed-tooltip-text">Annotations</span>');

        highed.dom.on(annotationButton, 'click', function () {
            if (annotationContainer.classList.contains('active')) {
                annotationContainer.classList.remove('active');
            } else {
                annotationContainer.classList.add('active');
            }

        });

        if (!annotationContainer) {
            annotationContainer = highed.dom.cr('div', 'highed-transition highed-annotation-container');

            highed.dom.ap(annotationContainer, annotationButton);

            annotationOptions.forEach(function (option) {
                var btn = highed.dom.cr('span', 'highed-template-tooltip annotation-buttons ' + (usingSafari() ? ' usingsafari ' : ''), '<i class="fa fa-' + option.icon + '" aria-hidden="true"></i><span class="highed-tooltip-text">' + option.tooltip + '</span>');
                if (option.onClick || !option.draggable) {
                    highed.dom.on(btn, 'click', function () {

                        if (option.onClick) {
                            option.onClick();
                        } else {
                            var isAnnotating = !(option.element.className.indexOf('active') > -1);

                            annotationOptions.forEach(function (o) {
                                o.element.classList.remove('active');
                            });

                            chartPreview.setIsAnnotating(isAnnotating);
                            if (isAnnotating) {
                                chartPreview.options.togglePlugins('annotations', 1);
                                chartPreview.setAnnotationType(option.value);
                                option.element.className += ' active';
                            }
                        }
                    });
                } else {
                    highed.dom.on(btn, 'mousedown', function (e) {

                        activeAnnotation = highed.dom.cr('div', 'highed-active-annotation fa fa-' + option.icon);

                        highed.dom.ap(document.body, activeAnnotation);
                        function moveAt(pageX, pageY) {
                            highed.dom.style(activeAnnotation, {
                                left: pageX - (btn.offsetWidth / 2 - 10) + 'px',
                                top: pageY - (btn.offsetHeight / 2 - 10) + 'px'
                            });
                        }
                        moveAt(e.pageX, e.pageY);

                        function onMouseMove(event) {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            }
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                            moveAt(event.pageX, event.pageY);
                        }

                        document.addEventListener('mousemove', onMouseMove);

                        highed.dom.on(activeAnnotation, 'mouseup', function (e) {
                            e = chartPreview.options.all().pointer.normalize(e);
                            document.removeEventListener('mousemove', onMouseMove);
                            activeAnnotation.onmouseup = null;
                            activeAnnotation.remove();
                            activeAnnotation = null;

                            chartPreview.options.togglePlugins('annotations', 1);
                            chartPreview.setAnnotationType(option.value);
                            chartPreview.addAnnotation(e);
                        });
                    });
                }


                option.element = btn;
                highed.dom.ap(annotationContainer, btn);
            });
        }


        highed.dom.ap(iconsContainer, annotationContainer);

        highed.dom.ap(contents, userContents);
        highed.dom.ap(body, contents);

        highed.dom.ap(userContents, customizerContainer);
        highed.dom.ap(parent, highed.dom.ap(container, body));

        // customizer.resize();

        expand();
        hide();
    }

    function getResolutionContainer() {
        return resolutionSettings;
    }

    function afterResize(func) {
        var timer;
        return function (event) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, 100, event);
        };
    }

    function reduceSize(fn) {
        width = props.widths.desktop;
        if (highed.onTablet() && props.widths.tablet) {
            width = props.widths.tablet;
        } else if (highed.onPhone() && props.widths.phone) {
            width = props.widths.phone;
        }

        chartWidth = 68;

        expand();
        setTimeout(function () {
            if (fn) {
                fn();
            }
            resizeChart(((window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
        }, 200);
    }

    function resize() {
        if (isVisible) {
            expand();
            setTimeout(function () {

                resizeChart((((window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) - highed.dom.pos(body, true).y) - 16));
            }, 500);
            // expand();
        }
    }

    if (!highed.onPhone()) {
        highed.dom.on(window, 'resize', afterResize(function (e) {
            resize();
        }));
    }

    resolutions.forEach(function (res) {
        highed.dom.on(res.iconElement, 'click', function () {
            sizeChart(res.width, res.height);

            resWidth.value = res.width;
            resHeight.value = res.height;
        });
    });

    highed.dom.on(stretchToFitIcon, 'click', function () {

        resWidth.value = '';
        resHeight.value = '';
        highed.dom.style(chartContainer, {
            width: '100%',
            height: '100%'
        });
        setTimeout(chartPreview.resize, 300);
    }),
    backIcon = highed.dom.cr('div', 'highed-back-icon', '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>');


    highed.dom.style(backIcon, {
        display: 'none'
    });


    highed.dom.on(backIcon, 'click', function () {

        width = props.widths.desktop;
        if (highed.onTablet() && props.widths.tablet) {
            width = props.widths.tablet;
        } else if (highed.onPhone() && props.widths.phone) {
            width = props.widths.phone;
        }

        chartWidth = 68;

        highed.dom.style(backIcon, {
            display: 'none'
        });
        searchAdvancedOptions.hide();

        expand();
        resizeChart(((window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);

        setTimeout(customizer.showSimpleEditor, 200);
    });

    function expand() {

        var newWidth = width; // props.width;

        highed.dom.style(body, {
            width: 100 + '%',
            opacity: 1
        });


        if (!highed.onPhone()) {
            const windowWidth = highed.dom.size(parent).w;
            const percentage = ((100 - chartWidth) / 100);

            var styles =  window.getComputedStyle(chartFrame);
            var containerStyles =  window.getComputedStyle(container);
            var chartMargin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight),
                containerMargin = parseFloat(containerStyles.marginLeft) + parseFloat(containerStyles.marginRight);

            highed.dom.style(container, {
                width: ((windowWidth * percentage) - (chartMargin + containerMargin + 35) - 3 /* padding*/) + 'px'
            });
        }

        events.emit('BeforeResize', newWidth);

        function resizeBody() {
            var bsize = highed.dom.size(body),
                tsize = highed.dom.size(title),
                size = {
                    w: bsize.w,
                    h: (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight) - highed.dom.pos(body, true).y
                };

            highed.dom.style(contents, {
                width: '100%',
                height: ((size.h - 16)) + 'px'
            });

            customizer.resize(size.w, (size.h - 17) - tsize.h);

            return size;
        }

        setTimeout(resizeBody, 300);
        highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
        expand();
        resizeChart(((window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
        isVisible = true;
        highed.dom.style(resolutionSettings, {
            display: 'block'
        });


        if (autoAppearanceTab) {
            setTimeout(function () {
                if (!document.getElementById('highed-list-header-Appearance').classList.contains('active')) {
                    document.getElementById('highed-list-header-Appearance').children[0].click();
                }
            }, 300);
        }

    }

    function hide() {

        customizer.showSimpleEditor();

        width = props.widths.desktop;
        if (highed.onTablet() && props.widths.tablet) {
            width = props.widths.tablet;
        } else if (highed.onPhone() && props.widths.phone) {
            width = props.widths.phone;
        }

        chartWidth = 68;

        highed.dom.style(backIcon, {
            display: 'none'
        });
        searchAdvancedOptions.hide();

        expand();

        highed.dom.style(container, {
            display: 'none'
        });
        isVisible = false;
        searchAdvancedOptions.hide();

        if (resolutionSettings) {
            highed.dom.style(resolutionSettings, {
                display: 'none'
            });
        }

        if (!highed.onPhone()) {
            buttons.forEach(function (button, i) {

                if (button.noPermission) {
                    return;
                }
                if (button.element) {
                    button.element.classList.remove('active');
                }
                if (i === 0) {
                    button.element.classList += ' active';
                }
            });
        }

        resHeight.value = '';
        resWidth.value = '';
    }

    function selectOption(event, x, y) {
        customizer.focus(event, x, y);
    }

    function setTabBehaviour(behaviour) {
        autoAppearanceTab = behaviour;
    }

    function destroy() {}

    function showError(title, message) {
        highed.dom.style(errorBar, {
            opacity: 1,
            'pointer-events': 'auto'
        });

        errorBarHeadline.innerHTML = title;
        errorBarBody.innerHTML = message;
    }

    function sizeChart(w, h) {
        if ((!w || w.length === 0) && (!h || h.length === 0)) {
            fixedSize = false;
            resHeight.value = '';
            resWidth.value = '';
            resizeChart();
        } else {
            var s = highed.dom.size(chartFrame);

            // highed.dom.style(chartFrame, {
            //   paddingLeft: (s.w / 2) - (w / 2) + 'px',
            //   paddingTop: (s.h / 2) - (h / 2) + 'px'
            // });

            fixedSize = {
                w: w,
                h: h
            };

            w = (w === 'auto' ?  s.w : w || s.w - 100);
            h = (h === 'auto' ?  s.h : h || s.h - 100);

            highed.dom.style(chartContainer, {
                width: w + 'px',
                height: h + 'px'
            });

            // chartPreview.chart.setWidth();

            chartPreview.resize(w, h);
        }
    }

    highed.dom.on([resWidth, resHeight], 'change', function () {
        sizeChart(parseInt(resWidth.value, 10), parseInt(resHeight.value, 10));
    });


    chartPreview.on('ShowTextDialog', function (chart, x, y) {
        addLabelX = x;
        addLabelY = y;
        addTextModalInput.focus();

        overlayAddTextModal.show();

    });

    chartPreview.on('ChartChange', function (newData) {
        events.emit('ChartChangedLately', newData);
    });

    function getIcons() {
        return iconsContainer;
    }

    function resizeChart(newHeight) {

        highed.dom.style(chartFrame, {
            /* left: newWidth + 'px',*/
            width: '60%', // '68%',
            height: 440 + 'px' || '100%',
            top: 55 + 'px',
            left: '39%'
        });
        /*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

        setTimeout(chartPreview.resize, 200);
    }


    chartPreview.on('SetResizeData', function () {
    // setToActualSize();
    });

    return {
        on: events.on,
        destroy: destroy,
        hide: hide,
        show: show,
        resize: resize,
        isVisible: function () {
            return isVisible;
        },
        init: init,
        getIcons: getIcons,
        selectOption: selectOption,
        getResolutionContainer: getResolutionContainer,
        setTabBehaviour: setTabBehaviour
    // toolbar: toolbar
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.Toolbox = function (parent, attr) {
    var events = highed.events(),
        container = highed.dom.cr(
            'div',
            'highed-transition highed-toolbox highed-wizard highed-box-size'
        ),
        bar = highed.dom.cr('div', 'highed-toolbox-bar highed-box-size highed-wizard-title-container'),
        body = highed.dom.cr(
            'div',
            'highed-toolbox-body highed-toolbox-body-no-border highed-box-size highed-transition highed-wizard-body'
        ),
        activeTimeout,
        expanded = false,
        activeItem = false,
        properties = highed.merge(
            {
                animate: true
            },
            attr
        );

    function addEntry(def) {
        var props = highed.merge(
                {
                    number: 0,
                    title: 'Title Missing'
                },
                def
            ),
            entryEvents = highed.events(),
            title = highed.dom.cr('div', 'highed-toolbox-body-title wizard', props.hideTitle ? '' : props.title),
            contents = highed.dom.cr(
                'div',
                'highed-box-size highed-toolbox-inner-body'
            ),
            userContents = highed.dom.cr(
                'div',
                'highed-box-size highed-toolbox-user-contents highed-createchart-body-container'
            ),
            iconClass = 'highed-toolbox-list-item-container',
            icon = highed.dom.cr('div', iconClass),
            resizeTimeout,
            exports = {},
            circle = highed.dom.cr('div', 'highed-toolbox-list-circle', props.number);

        highed.dom.on(circle, 'click', function () {
            props.onClick(props.number);
            expand();

        });

        highed.dom.ap(icon, circle, highed.dom.cr('div', 'highed-toolbox-list-title', props.title));
        highed.dom.on(icon, 'click', function () {
            entryEvents.emit('Click');
        });

        function resizeBody() {
            var bsize = highed.dom.size(body),
                tsize = highed.dom.size(title),
                size = {
                    w: bsize.w,
                    h: bsize.h - tsize.h - 55
                };
            /*
      highed.dom.style(contents, {
        width: size.w + 'px',
        height: size.h + 'px'
      });
*/
            return size;
        }

        function expand() {
            var bsize = highed.dom.size(bar);

            var newWidth = props.width;

            if (expanded && activeItem === exports) {
                return;
            }

            if (props.iconOnly) {
                return;
            }

            if (activeItem) {
                activeItem.disselect();
            }

            entryEvents.emit('BeforeExpand');

            body.innerHTML = '';
            highed.dom.ap(body, contents);

            highed.dom.style(body, {
                height: (bsize.h - 55) + 'px',
                opacity: 1
            });

            highed.dom.style(container, {
                width: newWidth + '%'
            });

            events.emit('BeforeResize', newWidth);

            expanded = true;

            setTimeout(function () {
                var height = resizeBody().h;

                events.emit('Expanded', exports, newWidth);
                entryEvents.emit('Expanded', newWidth, height - 20);
            }, 300);

            if (props.iconOnly) {
                activeItem = false;
            } else {
                icon.className = iconClass + ' active';
                activeItem = exports;
            }

            highed.emit('UIAction', 'ToolboxNavigation', props.title);
        }

        function collapse() {
            var newWidth = highed.dom.size(bar).w;

            if (expanded) {
                highed.dom.style(body, {
                    width: '0px',
                    opacity: 0.1
                });

                highed.dom.style(container, {
                    width: newWidth + '%'
                });

                events.emit('BeforeResize', newWidth);

                disselect();
                expanded = false;
                activeItem = false;

            }
        }

        function toggle() {
            expand();
        }

        function disselect() {
            icon.className = iconClass + ' completed';
        }

        function removeCompleted() {
            setTimeout(function () {
                icon.classList.remove('completed');
            }, 50);
        }

        // highed.dom.on(icon, 'click', toggle);
        highed.dom.ap(bar, icon);
        highed.dom.ap(contents, title, userContents);

        function reflowEverything() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                highed.dom.style(body, { height: '' });
                if (expanded) {
                    var height = resizeBody().h;
                    entryEvents.emit('Expanded', highed.dom.size(bar), height - 20);
                }
            }, 100);
        }

        highed.dom.on(window, 'resize', reflowEverything);

        exports = {
            on: entryEvents.on,
            expand: expand,
            collapse: collapse,
            body: userContents,
            removeCompleted: removeCompleted,
            disselect: disselect
        };
        return exports;
    }

    function width() {
        var bodySize = highed.dom.size(body),
            barSize = highed.dom.size(bar);

        return bodySize.w + barSize.w;
    }

    function clear() {
        bar.innerHTML = '';
        body.innerHTML = '';
    }

    highed.dom.ap(parent, highed.dom.ap(container, bar, body));

    return {
        clear: clear,
        on: events.on,
        addEntry: addEntry,
        width: width
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.OptionsPanel = function (parent, attr) {
    var events = highed.events(),
        container = highed.dom.cr(
            'div',
            'highed-transition highed-optionspanel highed-box-size'
        ),
        body = highed.dom.cr(
            'div',
            'highed-box-size highed-transition'
        ),
        prev,
        options = {},
        currentOption = null;

    highed.dom.ap(parent, highed.dom.ap(container, highed.dom.ap(body, highed.dom.cr('div', '', 'Workspace View:'))));

    function setDefault(option) {
        prev = option;
    }

    function addOption(option, id) {
        var btn = highed.dom.cr(
            'a',
            'highed-optionspanel-button ' + (id === 'data' ? 'active' : ''),
            option.text + '&nbsp;<i class="fa fa-' + option.icon + '"></i>'
        );

        (option.onClick || []).forEach(function (click) {
            highed.dom.on(btn, 'click', function () {
                Object.keys(options).forEach(function (o) {
                    options[o].classList.remove('active');
                });
                currentOption = option;
                btn.classList.add('active');

                click(prev, option);
            });
        });

        options[id] = btn;

        highed.dom.ap(body, btn);
    }

    function clearOptions() {
        body.innerHTML = '';
        highed.dom.ap(body, highed.dom.cr('div', 'highed-optionspanel-header', 'Workspace View:'));
    }

    function getPrev() {
        return prev;
    }

    function getOptions() {
        return options;
    }

    function getCurrentOption() {
        return currentOption;
    }

    return {
        on: events.on,
        addOption: addOption,
        setDefault: setDefault,
        getPrev: getPrev,
        clearOptions: clearOptions,
        getOptions: getOptions,
        getCurrentOption: getCurrentOption
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.AssignDataPanel = function (parent, dataTable, extraClass) {

    var defaultOptions = {
            labels: {
                name: 'Categories',
                desc: 'Choose a column for the category types. Can be names or a date.',
                default: 'A',
                value: 'A',
                rawValue: [0],
                previousValue: null,
                linkedTo: 'x',
                mandatory: true,
                colors: {
                    light: 'rgba(66, 200, 192, 0.2)',
                    dark: 'rgb(66, 200, 192)'
                }
            },
            values: {
                name: 'Values',
                desc: 'Enter column with the values you want to chart.',
                default: 'B',
                linkedTo: 'y',
                isData: true,
                value: 'B',
                rawValue: [1],
                previousValue: null,
                mandatory: true,
                colors: {
                    light: 'rgba(145, 151, 229, 0.2)',
                    dark: 'rgb(145, 151, 229)'
                }
            },
            label: {
                name: 'Label',
                desc: 'The name of the point as shown in the legend, tooltip, data label etc.',
                default: '',
                value: '',
                rawValue: null,
                previousValue: null,
                mandatory: false,
                linkedTo: 'label',
                colors: {
                    light: 'rgba(229, 145, 145, 0.2)',
                    dark: 'rgb(229, 145, 145)'
                },
                noNulls: true
            }
        },
        options = [],
        toggled = false,
        columnLength = 0,
        index = 0,
        maxColumnLength = 1,
        showCells = false,
        disabled = false;

    var events = highed.events(),
        container = highed.dom.cr(
            'div',
            'highed-transition highed-assigndatapanel highed-box-size ' + extraClass
        ),
        bar = highed.dom.cr('div', 'highed-assigndatapanel-bar highed-box-size ' + extraClass),
        body = highed.dom.cr(
            'div',
            'highed-assigndatapanel-body highed-box-size highed-transition ' + extraClass
        ),
        headerToggle = highed.dom.cr('span', '', '<i class="fa fa-chevron-down highed-assigndatapanel-toggle" aria-hidden="true"></i>'),
        header = highed.dom.ap(
            highed.dom.cr('div', 'highed-assigndatapanel-header-container'),
            highed.dom.ap(highed.dom.cr('h3', 'highed-assigndatapanel-header', 'Assign columns for this chart'), headerToggle)),
        labels = highed.dom.cr('div', 'highed-assigndatapanel-data-options'),
        selectContainer = highed.dom.cr('div', 'highed-assigndatapanel-select-container'),
        changeSeriesTypeContainer = highed.dom.cr('div', 'highed-assigndatapanel-change-series-type'),
        changeSeriesTypeLink = highed.dom.cr('a', 'highed-assigndatapanel-change-series-type-link', 'Click here to change series template type'),
        inputContainer = highed.dom.cr('div', 'highed-assigndatapanel-inputs-container'),
        addNewSeriesBtn = highed.dom.cr('button', 'highed-assigndatapanel-add-series', '<i class="fa fa-plus"/>'),
        deleteSeriesBtn = highed.dom.cr('button', 'highed-assigndatapanel-add-series', '<i class="fa fa-trash"/>'),
        toggleHideCellsBtn = highed.dom.cr('button', 'highed-assigndatapanel-add-series', '<i class="fa fa-eye-slash"/>'),
        seriesTypeSelect = highed.DropDown(selectContainer, ' highed-assigndatapanel-series-dropdown'),
        hidden = highed.dom.cr('div', 'highed-assigndatapanel-hide');

    highed.dom.style(hidden, {
        display: 'none'
    });
    addSerie();
    Object.keys(defaultOptions).forEach(function (key) {
        defaultOptions[key].colors = null;
    });

    function init(colLength) {
        columnLength = colLength;

        highed.dom.ap(body, labels);
        resetDOM();
        highed.dom.ap(parent, highed.dom.ap(container, bar, body));
        if (!disabled) {
            events.emit('AssignDataChanged', options[index]);
        }
    }

    function resetValues() {
        Object.keys(options[index]).forEach(function (key) {
            options[index][key].previousValue = null;
            options[index][key].value = options[index][key].default;
        });
    }

    function getAssignDataFields() {

        var all = [];

        options.forEach(function (option) {
            var arr = {};
            Object.keys(option).forEach(function (key) {
                if (option[key].value === '' || option[key].value === null) {
                    return;
                }
                arr[key] = option[key].value;
            });
            all.push(highed.merge({}, arr));
        });

        return all;
    }

    function restart() {

        defaultOptions.labels.colors = {
            light: 'rgba(66, 200, 192, 0.2)',
            dark: 'rgb(66, 200, 192)'
        };

        defaultOptions.values.colors = {
            light: 'rgba(145, 151, 229, 0.2)',
            dark: 'rgb(145, 151, 229)'
        };

        defaultOptions.label.colors = {
            light: 'rgba(229, 145, 145, 0.2)',
            dark: 'rgb(229, 145, 145)'
        };

        index = 0,
        columnLength = 0,
        maxColumnLength = 1;

        options = [];
        addSerie();
        Object.keys(defaultOptions).forEach(function (key) {
            defaultOptions[key].colors = null;
        });

        resetDOM();
    }

    function getMergedLabelAndData() {
        var arr = {},
            extraColumns = [],
            values = [];

        Object.keys(options[index]).forEach(function (optionKeys) {
            if (optionKeys === 'labels') {
                arr.labelColumn = highed.getLetterIndex(options[index][optionKeys].value.charAt(0));
            } else if (options[index][optionKeys].isData) { // (highed.isArr(options[index][optionKeys])) {

                const allData = options[index][optionKeys];
                values.push(allData.rawValue[0]);
                arr.dataColumns = values;
                arr.dataColumns.sort();
            } else {
                // Check for any extra fields, eg. Name
                const extraValue = options[index][optionKeys];
                if (extraValue.value !== '') {
                    extraColumns.push(highed.getLetterIndex(extraValue.value));
                }
            }
        });

        arr.extraColumns = extraColumns.sort();

        return arr; // arr.concat(values);
    }

    function getAllMergedLabelAndData() {
        var seriesValues = [];
        options.forEach(function (serie, i) {
            var arr = {},
                extraColumns = [],
                values = [];
            Object.keys(serie).forEach(function (optionKeys) {
                if (optionKeys === 'labels') {
                    arr.labelColumn = highed.getLetterIndex(options[i][optionKeys].value.charAt(0));
                } else if (options[i][optionKeys].isData) { // (highed.isArr(options[i][optionKeys])) {
                    const allData = options[i][optionKeys];
                    /*
            allData.forEach(function(data) {
              values.push(data.rawValue[0]);
              arr.dataColumns = values;
            });*/
                    values.push(allData.rawValue[0]);
                    arr.dataColumns = values;
                    arr.dataColumns.sort();
                } else {
                    // Check for any extra fields, eg. Name
                    const extraValue = options[i][optionKeys];
                    if (extraValue.value !== '') {
                        extraColumns.push(highed.getLetterIndex(extraValue.value));
                    }
                }
            });
            arr.extraColumns = extraColumns.sort();
            seriesValues.push(highed.merge({}, arr));
        });
        return seriesValues;
    }

    function getLetterIndex(char) {
        return char.charCodeAt() - 65;
    }

    function getLetterFromIndex(num) {
        return String.fromCharCode(num + 65);
    }

    function getActiveSerie() {
        return index;
    }

    function processField(input, overrideCheck, cb) {

        input.value = input.value.toUpperCase();
        var newOptions = [];

        var previousValues = [],
            values = [];

        if (!overrideCheck) {
            if (input.previousValue === input.value || (input.value === '' && input.previousValue === null)) {
                return;
            }
        }

        values = [input.value.charAt(0)];
        if (input.previousValue) {
            previousValues = [input.previousValue];
        }

        if (!input.mandatory && input.value === '') {
            values = [];
        }

        newOptions = getMergedLabelAndData();
        // else newOptions.push(highed.getLetterIndex(input.value.charAt(0)));

        input.previousValue = input.value.toUpperCase();
        input.rawValue = values.map(function (x) {
            return highed.getLetterIndex(x);
        });

        cb(previousValues.map(function (x) {
            return highed.getLetterIndex(x);
        }), input.rawValue, input, newOptions);

    }

    function getFieldsToHighlight(cb, overrideCheck, dontEmit) {
        if (!options[index]) {
            return;
        }
        Object.keys(options[index]).forEach(function (key) {
            var input = options[index][key];
            processField(input, overrideCheck, cb);
        });
        if (!disabled && !dontEmit) {
            events.emit('ChangeData', options);
        }
    }

    function generateColors() {
        const hue = Math.floor(Math.random() * (357 - 202 + 1) + 202), // Want a blue/red/purple colour
            saturation =  Math.floor(Math.random() * 100),
            lightness =  60,
            alpha = 0.5;

        return {
            light: 'hsla(' + hue + ', ' + saturation + '%, ' + (lightness + 20) + '%, ' + alpha + ')',
            dark: 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)'
        };
    }

    function addSeries(length, type) {
        if (length + 1 < options.length) {
            // Need to do some culling
            options = options.slice(0, length + 1);
            events.emit('RemoveSeries', length + 1);
            seriesTypeSelect.sliceList(length + 1);
            resetDOM();
        } else {
            for (var i = options.length - 1; i < length; i++) {
                addSerie(type);
            }
        }

        seriesTypeSelect.selectByIndex(0);
    }

    function getOptions() {
        return options[index];
    }

    function getAllOptions() {
        return options;
    }

    function resize(w, h) {

        highed.dom.style(container, {
            height: (h - 3) + 'px'
        });
    }

    function addSerie(seriesType, redrawDOM, skipSelect) {
        var type = seriesType;
        if (!type) {
            type = 'line';
        }

        seriesTypeSelect.addItems([{
            id: options.length,
            title: 'Series ' + (options.length + 1) + ' - ' + capitalizeFirstLetter(type)
        }]);
        if (maxColumnLength + 1 < columnLength) {
            maxColumnLength++;
        }

        const newOptions = highed.merge({}, defaultOptions);

        highed.merge(newOptions, highed.meta.charttype[type]);
        clean(newOptions);
        if (newOptions.values) {
            newOptions.values.rawValue = [maxColumnLength]; // TODO: Change later
            newOptions.values.value = getLetterFromIndex(maxColumnLength);
        }

        options.push(highed.merge({}, newOptions));
        if (!skipSelect) {
            seriesTypeSelect.selectById(options.length - 1);
        }
        if (redrawDOM) {
            resetDOM();
        }

        events.emit('AddSeries', options.length - 1, seriesType);
    }

    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
    }


    function disable() {
        highed.dom.style(hidden, {
            display: 'block'
        });
        disabled = true;
    }

    function enable() {
        highed.dom.style(hidden, {
            display: 'none'
        });
        disabled = false;
    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
    }

    function getValues(input) {
        const delimiter = (input.indexOf('-') > -1 ? '-' : ',');
        const output = input.split(delimiter).sort();

        output.forEach(function (value, index) {
            output[index] = getLetterIndex(value);
        });

        return output;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function clean(obj) {
        Object.keys(obj).forEach(function (key) {
            if (highed.isNull(obj[key])) {
                delete obj[key];
            }
        });
    }

    function getSeriesType(data, index, aggregatedOptions) {
    // Change this in future, data should handle 99% of cases but have had to use aggregatedoptions due to users setting chart type through custom code
    // Looks messy using both atm
        if (data.config) {
            return data.config.chart.type;
        }

        if (data.options && data.options.series && data.options.series[index] && data.options.series[index].type) {
            return data.options.series[index].type;
        }
        if (data.template && data.template.chart && data.template.chart.type) {
            return data.template.chart.type;
        }
        if (data.options && data.options.chart && data.options.chart.type) {
            return data.options.chart.type;
        }
        if (data.theme && data.theme.options.chart && data.theme.options.chart.type) {
            return data.theme.options.chart.type;
        }
        if (aggregatedOptions && aggregatedOptions.chart && aggregatedOptions.chart.type) {
            return aggregatedOptions.chart.type;
        }
        return 'line';

    }


    function setAssignDataFields(data, maxColumns, init, seriesIndex, skipEmit, serieValue, aggregatedOptions) {
        if (!data || disabled) {
            return;
        }
        columnLength = maxColumns;
        var seriesType = getSeriesType(data, 0, aggregatedOptions),
            previousValues = null;

        seriesTypeSelect.updateByIndex(seriesIndex || index, {
            title: 'Series ' + ((seriesIndex || index) + 1) + ' - ' + capitalizeFirstLetter(seriesType)
        });
        seriesTypeSelect.selectByIndex(index);

        chartTypeOptions = highed.meta.charttype[seriesType.toLowerCase()];

        if (options[seriesIndex || index] && options[seriesIndex || index].values) {
            previousValues = options[seriesIndex || index].values;
        }

        options[seriesIndex || index] = null;
        options[seriesIndex || index] = highed.merge({}, defaultOptions);

        if (!isNaN(serieValue)) {
            if (options[seriesIndex || index].values) {
                options[seriesIndex || index].values.value = getLetterFromIndex(serieValue);
                options[seriesIndex || index].values.rawValue = [serieValue];
            }
        }

        if (previousValues && options[seriesIndex || index] && options[seriesIndex || index].values) {
            highed.merge(options[seriesIndex || index].values, previousValues);
        }
        /*
    if (chartTypeOptions && chartTypeOptions.data) {
      options[seriesIndex || index].data = null;
    }*/


        highed.merge(options[seriesIndex || index], highed.meta.charttype[seriesType]);
        clean(options[seriesIndex || index]);

        if (init) {

            if (data.settings && data.settings.dataProvider && data.settings.dataProvider.assignDataFields) {
                const dataFields = data.settings.dataProvider.assignDataFields;
                dataFields.forEach(function (option, index) {
                    const seriesType = getSeriesType(data, index);
                    if (!options[index]) {
                        addSerie(seriesType);
                    }
                    Object.keys(option).forEach(function (key) {
                        if (options[index][key]) {
                            options[index][key].value = option[key];
                            options[index][key].rawValue = [getLetterIndex(option[key])];
                        }
                    });
                });
            } else {
                // Probably a legacy chart, change values to equal rest of chart

                var length = maxColumns - 1;
                if (data && data.options && data.options.series) {
                    length = data.options.series.length;
                }

                for (var i = 1; i < length; i++) {
                    const seriesType = getSeriesType(data, i, aggregatedOptions);
                    if (!options[i]) {
                        addSerie(seriesType, null, true);
                    }

                    options[i].labels.rawValue = [0];
                    options[i].labels.value = 'A';
                    options[i].values.rawValue[0] = i + 1;
                    options[i].values.value = getLetterFromIndex(i + 1);
                }
            }
            seriesTypeSelect.selectByIndex(0);
        }

        resetDOM();
        if (!disabled && !skipEmit) {
            events.emit('ChangeData', options);
        }
    }

    function checkValues(newValue, prevValue) {
        values = getValues(newValue);
        values2 = getValues(prevValue);
        if (Math.max(values[values.length - 1], values2[values2.length - 1]) - Math.min(values[0], values2[0]) <= (values[values.length - 1] - values[0]) + (values2[values2.length - 1] - values2[0])) {
            return true;
        }
        return false;
    }

    function valuesMatch(newValue, objectKey) {

        var found = false;
        // eslint-disable-next-line no-unused-expressions
        values = [],
        values2 = [];
        Object.keys(options[index]).some(key => {
            if (objectKey === key || found) {
                return;
            }
            /*
            if (highed.isArr(options[index][key])) {

            (options[index][key]).some(function(o) {
              if (object.id === o.id || found) return;
              found = checkValues(newValue, o.value);
              if (found) return false;
            });
            } else {*/
            found = checkValues(newValue, options[index][key].value);
            if (found) {
                return false;
            }
            // }
        });
        return found;

    }

    function generateInputs(option, key) {

        var labelInput,
            valueContainer = highed.dom.cr('div', 'highed-assigndatapanel-input-container');

        labelInput = highed.DropDown(valueContainer, 'highed-assigndata-dropdown');
        if (!option.mandatory) {
            labelInput.addItem({
                id: '',
                title: ''
            });
        }
        for (var i = 0; i < columnLength; i++) {
            labelInput.addItem({
                id: getLetterFromIndex(i),
                title: getLetterFromIndex(i)
            });
        }

        labelInput.selectById(option.value);

        labelInput.on('Change', function (selected) {
            // detailIndex = selected.index();
            detailValue = selected.id();

            if (valuesMatch(detailValue, key)) {
                option.value = option.previousValue;
                labelInput.selectById(option.previousValue, true);
                alert('This column has already been assigned a value. Please select a different column');
                return;
            }

            if (detailValue !== '' && option && option.noNulls) {
                if (dataTable.areColumnsEmpty(getLetterIndex(detailValue))) {
                    option.value = option.previousValue;
                    labelInput.selectById(option.previousValue, true);
                    alert('This column does not have any data. Please select a column with data in it');
                    return;
                }
            }

            option.value = detailValue;
            option.rawValue = [getLetterIndex(option.value.toUpperCase())];
            if (getLetterIndex(option.value.toUpperCase()) > maxColumnLength) {
                maxColumnLength = getLetterIndex(option.value.toUpperCase());
            }


            if (showCells) {
                events.emit('ToggleHideCells', options[index], showCells);
            }
            if (!disabled) {
                events.emit('AssignDataChanged', options[index], option, getLetterIndex(detailValue.toUpperCase()), key);
            }
            // liveDataTypeSelect.selectById(detailValue || 'json');
        });

        var colors = option.colors || generateColors();
        option.colors = colors;

        labelInput.value = option.value;
        const colorDiv = highed.dom.cr('div', 'highed-assigndatapanel-color');

        highed.dom.style(colorDiv, {
            'background-color': option.colors.light,
            border: '1px solid ' + option.colors.dark
        });

        var label = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'),
            colorDiv,
            highed.dom.ap(highed.dom.cr('p', '', option.name + ':'),
                highed.dom.cr('span', 'highed-assigndatapanel-data-mandatory', option.mandatory ? '*' : '')),
            valueContainer,
            highed.dom.cr('div', 'highed-assigndatapanel-data-desc', option.desc));

        highed.dom.ap(inputContainer, label);
    }

    function resetDOM() {
        inputContainer.innerHTML = '';
        if (options[index]) {
            Object.keys(options[index]).forEach(function (key) {
                var option = options[index][key];
                generateInputs(option, key);
            });
        }
    }

    function toggleCells() {
        if (showCells) {
            showCells = false;
            toggleHideCellsBtn.innerHTML = '<i class="fa fa-eye-slash">';
        } else {
            showCells = true;
            toggleHideCellsBtn.innerHTML = '<i class="fa fa-eye"/>';
        }
        events.emit('ToggleHideCells', options[index], showCells);
    }

    function checkToggleCells() {
        if (showCells) {
            events.emit('ToggleHideCells', options[index], showCells);
        }
    }

    function getStatus() {
        return disabled;
    }

    function addNewSerie(lastType) {
        addSerie(lastType, true);
        events.emit('AssignDataChanged');
    }

    function getElement() {
        return container;
    }

    function setColumnLength(length) {
        columnLength = length;
    }

    // //////////////////////////////////////////////////////////////////////////////

    highed.dom.ap(selectContainer, addNewSeriesBtn, deleteSeriesBtn, toggleHideCellsBtn);
    highed.dom.ap(changeSeriesTypeContainer, changeSeriesTypeLink);

    highed.dom.on(changeSeriesTypeLink, 'click', function () {
        events.emit('GoToTemplatePage');
    });

    highed.dom.on(toggleHideCellsBtn, 'click', function () {
        toggleCells();
    });

    highed.dom.on(deleteSeriesBtn, 'click', function () {

        if (index === 0) {
            highed.snackBar('Cannot delete this series');
            return;
        }

        if (confirm('Are you sure you want to delete this series?')) {
            options.splice(index, 1);
            seriesTypeSelect.deleteByIndex(index);
            const allSeries = seriesTypeSelect.selectAll();

            events.emit('DeleteSeries', index);
            setTimeout(function () {
                events.emit('AssignDataChanged');
            }, 1000);

            for (var i = index; i < options.length; i++) {
                seriesTypeSelect.updateByIndex(i, {
                    title: 'Series ' + (i + 1) + ' -' + allSeries[i].title().split('-')[1]
                }, i);
            }

            seriesTypeSelect.selectByIndex(index - 1);
            highed.snackBar('Series ' + (index + 2) + ' Deleted');
        }

    });

    highed.dom.on(addNewSeriesBtn, 'click', function () {
        events.emit('GetLastType');
    });

    seriesTypeSelect.on('Change', function (selected) {
        if (index !== selected.id()) {
            index = selected.id();
            resetDOM();

            if (showCells) {
                events.emit('ToggleHideCells', options[index], showCells);
            }
            if (!disabled) {
                events.emit('RedrawGrid', true);
                events.emit('SeriesChanged', index);
            }
        }
    });

    highed.dom.on(headerToggle, 'click', function () {

        const height = (toggled ? '48px' : 'initial');
        const overflow = (toggled ? 'hidden' : 'auto');

        highed.dom.style(container, {
            height: height,
            overflow: overflow
        });

        toggled = !toggled;
    });

    seriesTypeSelect.addItems([{
        id: 0,
        title: 'Series ' + (options.length) + ' - Line'
    }]);

    seriesTypeSelect.selectById(0);

    highed.dom.ap(body, header);
    highed.dom.ap(labels, selectContainer, changeSeriesTypeContainer, inputContainer);

    highed.dom.ap(body, hidden);

    return {
        on: events.on,
        hide: hide,
        show: show,
        getOptions: getOptions,
        resetValues: resetValues,
        resize: resize,
        getFieldsToHighlight: getFieldsToHighlight,
        getMergedLabelAndData: getMergedLabelAndData,
        getAllMergedLabelAndData: getAllMergedLabelAndData,
        setAssignDataFields: setAssignDataFields,
        getAssignDataFields: getAssignDataFields,
        getAllOptions: getAllOptions,
        getActiveSerie: getActiveSerie,
        addNewSerie: addNewSerie,
        addSeries: addSeries,
        setColumnLength: setColumnLength,
        checkToggleCells: checkToggleCells,
        init: init,
        enable: enable,
        disable: disable,
        getStatus: getStatus,
        getElement: getElement,
        restart: restart
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.DefaultPage = function (parent, options, chartPreview, chartFrame) {
    var events = highed.events(),
        // Main properties
        container = highed.dom.cr(
            'div',
            'highed-transition highed-toolbox highed-box-size'
        ),
        title = highed.dom.cr('div', 'highed-toolbox-body-title'),
        customizeTitle,
        contents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-inner-body'
        ),
        userContents = highed.dom.cr(
            'div',
            'highed-box-size highed-toolbox-user-contents highed-toolbox-defaultpage'
        ),
        width,
        chartWidth = '68%',
        iconClass,
        icon = highed.dom.cr('div', iconClass),
        // Data table
        iconsContainer = highed.dom.cr('div', 'highed-icons-container'),
        body = highed.dom.cr(
            'div',
            'highed-toolbox-body highed-box-size highed-transition'
        ),
        isVisible = false;

    function init() {

        width = options.widths.desktop;
        if (highed.onTablet() && options.widths.tablet) {
            width = options.widths.tablet;
        } else if (highed.onPhone() && options.widths.phone) {
            width = options.widths.phone;
        }

        customizeTitle = highed.dom.cr('div', 'highed-customize-title'/* , options.title*/),
        iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + options.icon;

        title.innerHTML = '';

        if (options.create && highed.isFn(options.create)) {
            options.create(userContents, chartPreview, iconsContainer);
        }

        highed.dom.ap(contents, /* highed.dom.ap(title,backIcon, customizeTitle, highed.dom.ap(iconsContainer,helpIcon)),*/ userContents);
        highed.dom.ap(body, contents);

        highed.dom.ap(parent, highed.dom.ap(container, body));

        expand();
        hide();
    }


    function afterResize(func) {
        var timer;
        return function (event) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, 100, event);
        };
    }

    function resize() {
        if (isVisible) {
            expand();
            setTimeout(function () {
                resizeChart((((window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) - highed.dom.pos(body, true).y) - 16));
            }, 1000);
            // expand();
        }
    }

    if (!highed.onPhone()) {
        highed.dom.on(window, 'resize', afterResize(function (e) {
            resize();
        }));
    }

    function getIcons() {
        return iconsContainer;
    }

    function expand() {

        var newWidth = width; // props.width;

        highed.dom.style(body, {
            width: 100 + '%',
            opacity: 1
        });

        if (!highed.onPhone()) {
            const windowWidth = highed.dom.size(parent).w;
            const percentage = ((100 - 68) / 100);


            var styles =  window.getComputedStyle(chartFrame);
            var containerStyles =  window.getComputedStyle(container);
            var chartMargin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight),
                containerMargin = parseFloat(containerStyles.marginLeft) + parseFloat(containerStyles.marginRight);

            highed.dom.style(container, {
                width: ((windowWidth * percentage) - (chartMargin + containerMargin + 35) - 3/* margin*/ /* padding*/) + 'px'
            });
        }
        events.emit('BeforeResize', newWidth);

        // expanded = true;

        function resizeBody() {
            var bsize = highed.dom.size(body),
                tsize = highed.dom.size(title),
                size = {
                    w: bsize.w,
                    h: (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight) - highed.dom.pos(body, true).y
                };

            highed.dom.style(contents, {
                width: '100%',
                height: ((size.h - 16)) + 'px'
            });

            highed.dom.style(userContents, {
                width: size.w + 'px',
                height: ((size.h - 16)) + 'px'
            });

            // customizer.resize(newWidth, (size.h - 17) - tsize.h);

            return size;
        }

        setTimeout(resizeBody, 300);
        highed.emit('UIAction', 'ToolboxNavigation', options.title);
    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });

        expand();
        setTimeout(function () {
            resizeChart(((window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
        }, 200);

        isVisible = true;
    }

    function hide() {

        // customizer.showSimpleEditor();

        width = options.widths.desktop;
        if (highed.onTablet() && options.widths.tablet) {
            width = options.widths.tablet;
        } else if (highed.onPhone() && options.widths.phone) {
            width = options.widths.phone;
        }
        chartWidth = '68%';

        highed.dom.style(backIcon, {
            display: 'none'
        });
        // searchAdvancedOptions.hide();

        expand();

        highed.dom.style(container, {
            display: 'none'
        });

        isVisible = false;
    }

    function destroy() {}

    chartPreview.on('ChartChange', function (newData) {
        events.emit('ChartChangedLately', newData);
    });


    // ////////////////////////////////////////////////////////////////////////////

    function resizeChart(newHeight) {
        highed.dom.style(chartFrame, {
            /* left: newWidth + 'px',*/
            width: chartWidth, // '68%',
            height: newHeight + 'px' || '100%'
        });
        /*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

        setTimeout(chartPreview.resize, 200);
    }

    return {
        on: events.on,
        destroy: destroy,
        chart: chartPreview,
        hide: hide,
        show: show,
        resize: resize,
        isVisible: function () {
            return isVisible;
        },
        init: init,
        getIcons: getIcons
    // toolbar: toolbar
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.SearchAdvancedOptions = function (parent, attr) {

    var timeout = null,
        advancedOptions = null,
        filters = {
        // Filter the series properties based on the series.type property
            series: {
                controller: 'type',
                state: false,
                default: 'line'
            },
            plotOptions: {
                controller: 'type',
                state: false,
                default: 'line'
            }
        };

    function resize(w, h) {

        highed.dom.style(container, {
            height: (h - 5) + 'px'
        });
    }

    function setOptions(options) {
        advancedOptions = options;
    /*
    advancedOptions = (options.series || []).map(function(serie) {
      return serie.type || 'line';
    });*/
    }

    var events = highed.events(),
        container = highed.dom.cr(
            'div',
            'highed-transition highed-assigndatapanel highed-searchadvancedoptions highed-box-size'
        ),
        bar = highed.dom.cr('div', 'highed-searchadvancedoptions-bar highed-box-size'),
        body = highed.dom.cr(
            'div',
            'highed-searchadvancedoptions-body highed-box-size highed-transition'
        ),
        header = highed.dom.ap(
            highed.dom.cr('div', 'highed-searchadvancedoptions-header-container'),
            highed.dom.cr('h3', 'highed-searchadvancedoptions-header', 'Search'),
            highed.dom.cr('p', 'highed-searchadvancedoptions-header-desc')),
        labels = highed.dom.cr('div', 'highed-searchadvancedoptions-data-options'),
        searchResultContainer = highed.dom.cr('div', 'highed-searchadvancedoptions-results'),
        inputContainer = highed.dom.cr('div', 'highed-searchadvancedoptions-inputs-container'),
        searchInput = highed.dom.cr('input', 'highed-searchadvancedoptions-search highed-field-input'),
        loading = highed.dom.cr(
            'div',
            'highed-customizer-adv-loader highed-searchadvancedoptions-loading',
            '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> Loading');

    highed.dom.style(loading, {
        opacity: 0
    });
    var searchResults = [];


    function compareValues(str, queryArr) {
        var foundCount = 0;

        queryArr.forEach(function (q) {
            if (str.indexOf(q) > -1) {
                foundCount++;
            }
        });

        return foundCount;
    }

    function search(node, parent, str) {

        if (parent && parent.meta.fullname && filters[parent.meta.fullname]) {
            if (node.meta && node.meta.validFor) {

                var customizedSeriesOption = advancedOptions.series;
                var found = false;
                customizedSeriesOption.forEach(function (serieOption) {
                    fstate = serieOption[filters[parent.meta.fullname].controller] || filters[parent.meta.fullname].default;
                    if (node.meta.validFor[fstate]) {
                        found = true;
                    }
                });

                if (!found) {
                    return;
                }
            }
        }

        if (highed.isArr(node)) {
            node.forEach(function (child) {
                search(child, parent, str);
            });
        } else {

            if (Object.keys(node.meta.types)[0] === 'function' || (
                node.meta.products &&
        Object.keys(node.meta.products) > 0)) {
                return;
            }

            var foundCount = compareValues(highed.uncamelize(node.meta.name).toLowerCase(), str);
            foundCount += compareValues(highed.uncamelize(node.meta.ns).toLowerCase(), str);
            if (node.meta.description) {
                foundCount += compareValues(highed.uncamelize(node.meta.description).toLowerCase(), str);
            }

            if (foundCount > 0) {
                searchResults.push({
                    name: highed.uncamelize(node.meta.name),
                    rawName: node.meta.name,
                    parents: (node.meta.ns.split('.')).map(function (e) {
                        return highed.uncamelize(e);
                    }),
                    rawParent: (parent === null ? node.meta.name : parent.meta.ns + parent.meta.name),
                    foundCount: foundCount,
                    ns: node.meta.ns
                });
            }
            if (node.children && node.children.length > 0) {
                search(node.children, node, str);
            }
        }
    }

    highed.dom.on(searchInput, 'keyup', function (e) {
        highed.dom.style(loading, {
            opacity: 1
        });
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            const optionsAdvanced = highed.meta.optionsAdvanced.children,
                searchArray = searchInput.value.toLowerCase().split(' ');

            searchResults = [];
            optionsAdvanced.forEach(function (child) {
                search(child, null, searchArray);
            });

            resetDOM();
        }, 500);
    });

    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
    }

    function show() {
        highed.dom.style(container, {
            display: 'block'
        });
    }

    highed.dom.ap(body, header);

    function firstToLowerCase(str) {
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    }


    function highlight(input) {
        input.classList += ' active-highlight';
        setTimeout(function () {
            if (input) {
                input.classList.remove('active-highlight');
            }
        }, 2000);
    }

    function resetDOM() {
        searchResultContainer.innerHTML = '';
        searchResults.sort(function (a, b) {
            return (a.foundCount < b.foundCount) ? 1 : ((b.foundCount < a.foundCount) ? -1 : 0);
        });
        searchResults.forEach(function (result, i) {
            if (i > 50) {
                return;
            }
            const resultContainer = highed.dom.cr('div', 'highed-searchadvancedoptions-result-container'),
                resultTitle = highed.dom.cr('div', 'highed-searchadvancedoptions-result-title', result.name),
                resultParents = highed.dom.cr('div', 'highed-searchadvancedoptions-result-parents', result.parents.join(' <i class="fa fa-circle highed-parent-splitter" aria-hidden="true"></i> '));

            highed.dom.on(resultContainer, 'click', function () {

                const parents = result.parents,
                    time = 500;
                var link = '';

                for (var i = 0; i < parents.length; i++) {
                    // eslint-disable-next-line no-loop-func
                    setTimeout(function (parent) {
                        link += (link !== '' ? '.' : '') + firstToLowerCase(parent).replace(' ', '');
                        var element = document.getElementById(link);
                        if (element) {
                            element.click();
                        }
                    }, time * i, parents[i]);
                }

                setTimeout(function (parent) {
                    var input = document.getElementById(parent.rawName + '_container');
                    if (input) {
                        input.scrollIntoView({
                            block: 'end'
                        });
                        highlight(input);
                    } else {
                        // Probably a menu option
                        input = document.getElementById(link + '.' + parent.rawName);
                        if (input) {
                            highlight(input);
                        }
                    }
                }, (time * parents.length) + 100, result);
            });

            highed.dom.ap(resultContainer, resultTitle, resultParents);
            highed.dom.ap(searchResultContainer, resultContainer);
        });

        highed.dom.style(loading, {
            opacity: 0
        });

    }

    highed.dom.ap(inputContainer, searchInput);
    highed.dom.ap(body, labels, inputContainer, searchResultContainer);

    highed.dom.ap(body, loading);

    highed.dom.ap(parent, highed.dom.ap(container, bar, body));

    return {
        on: events.on,
        hide: hide,
        show: show,
        resize: resize,
        setOptions: setOptions
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.HelpModal = function (items) {
    var active = false,
        nav = highed.dom.cr('div', 'highed-help-nav'),
        body = highed.dom.cr('div'),
        counter = highed.dom.cr('div', 'highed-help-counter'),
        modal = highed.OverlayModal(false, {
            width: 600,
            height: 600
        });

    items.forEach(function (item, i) {
        var container = highed.dom.cr('div'),
            heading = highed.dom.cr('div', 'highed-modal-title highed-help-toolbar', item.title),
            gif = highed.dom.cr('div', 'highed-help-gif'),
            desc = highed.dom.cr('div', 'highed-scrollbar highed-help-desc'),
            activate = highed.dom.cr('span', 'highed-icon fa fa-circle-o');

        if (highed.isArr(item.description)) {
            item.description = item.description.join(' ');
        }

        desc.innerHTML = item.description;
        if (item.gif) {
            item.gif = highed.option('helpImgPath') + item.gif;

            highed.dom.style(gif, {
                'background-image': 'url("' + item.gif + '")'
            });
        } else {
            highed.dom.style(gif, { display: 'none' });
        }

        function makeActive() {
            if (active) {
                active.className = 'highed-icon fa fa-circle-o';
            }

            body.innerHTML = '';
            activate.className = 'highed-icon fa fa-circle';
            highed.dom.ap(body, container);
            active = activate;

            counter.innerHTML = i + 1 + '/' + items.length;
        }

        highed.dom.on(activate, 'click', makeActive);

        highed.dom.ap(container, heading, gif, desc);

        highed.dom.ap(nav, activate);

        if (i === 0) {
            makeActive();
        }
    });

    if (items.length < 2) {
        highed.dom.style([nav, counter], {
            display: 'none'
        });
    }

    highed.dom.ap(modal.body, body, nav, counter);

    return {
        show: modal.show
    };
};

/*

Highcharts Editor v<%= version %>

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// @format

highed.meta.optionsExtended = {
    options: {
        'option.cat.chart': [
            // {
            //   text: 'option.subcat.dimension',
            //   dropdown: true,
            //   group: 1,
            //   options: [
            //     {
            //       id: 'chart--width',
            //       custom: {
            //         minValue: 50,
            //         maxValue: 5000,
            //         step: 10
            //       },
            //       pid: 'chart.width',
            //       dataType: 'number',
            //       context: 'General',
            //       defaults: 'null',
            //       parent: 'chart'
            //     },
            //     {
            //       id: 'chart--height',
            //       custom: {
            //         minValue: 50,
            //         maxValue: 5000,
            //         step: 10
            //       },
            //       pid: 'chart.height',
            //       dataType: 'number',
            //       context: 'General',
            //       defaults: 'null',
            //       parent: 'chart'
            //     }
            //   ]
            // },
            {
                text: 'option.subcat.title',
                dropdown: true,
                group: 1,
                options: [
                    {
                        id: 'title--text',
                        pid: 'title.text',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Chart title',
                        parent: 'title',
                        width: 50
                    },
                    {
                        id: 'subtitle--text',
                        pid: 'subtitle.text',
                        dataType: 'string',
                        context: 'General',
                        parent: 'subtitle',
                        width: 50
                    },
                    {
                        id: 'title--style',
                        dataType: 'font',
                        pid: 'title.style',
                        context: 'General',
                        defaults: '{ "color": "#333333", "fontSize": "18px" }',
                        parent: 'title'
                    },
                    {
                        id: 'subtitle--style',
                        dataType: 'font',
                        pid: 'subtitle.style',
                        context: 'General',
                        defaults: '{ "color": "#666666", "fontSize": "12px" }',
                        parent: 'subtitle'
                    }
                ]
            },
            {
                text: 'option.subcat.appearance',
                dropdown: true,
                options: [
                    {
                        header: true,
                        pid: 'option.subcat.chartarea',
                        width: 100,
                        id: 'chartarea-header',
                        dataType: 'header'
                    },
                    {
                        id: 'chart--backgroundColor',
                        pid: 'chart.backgroundColor',
                        dataType: 'color',
                        context: 'General',
                        defaults: '#FFFFFF',
                        parent: 'chart',
                        width: 50
                    },
                    {
                        id: 'chart--borderColor',
                        pid: 'chart.borderColor',
                        dataType: 'color',
                        context: 'General',
                        defaults: '#335cad',
                        parent: 'chart',
                        width: 50
                    },
                    {
                        id: 'chart--borderWidth',
                        custom: {
                            minValue: 0
                        },
                        pid: 'chart.borderWidth',
                        dataType: 'number',
                        context: 'General',
                        defaults: '0',
                        parent: 'chart',
                        width: 50
                    },
                    // {
                    //   id: 'chart--borderRadius',
                    //   custom: {
                    //     minValue: 0
                    //   },
                    //   pid: 'chart.borderRadius',
                    //   dataType: 'number',
                    //   context: 'General',
                    //   defaults: '0',
                    //   parent: 'chart',
                    //   width: 50
                    // },
                    {
                        header: true,
                        pid: 'option.subcat.plotarea',
                        width: 100,
                        id: 'plotarea-header',
                        dataType: 'header'
                    },
                    // {
                    //   id: 'chart--plotBackgroundColor',
                    //   pid: 'chart.plotBackgroundColor',
                    //   dataType: 'color',
                    //   context: 'General',
                    //   parent: 'chart',
                    //   width: 38
                    // },
                    // {
                    //   id: 'chart--plotBorderWidth',
                    //   pid: 'chart.plotBorderWidth',
                    //   dataType: 'number',
                    //   context: 'General',
                    //   defaults: '0',
                    //   parent: 'chart',
                    //   width: 31
                    // },
                    // {
                    //   id: 'chart--plotBorderColor',
                    //   pid: 'chart.plotBorderColor',
                    //   dataType: 'color',
                    //   context: 'General',
                    //   defaults: '#cccccc',
                    //   parent: 'chart',
                    //   width: 31
                    // },
                    {
                        id: 'chart--plotBackgroundImage',
                        pid: 'chart.plotBackgroundImage',
                        dataType: 'string',
                        context: 'General',
                        parent: 'chart'
                    },
                    {
                        id: 'colors',
                        pid: 'colors',
                        dataType: 'array<color>',
                        context: 'General',
                        defaults:
              '["#8087E8", "#A3EDBA", "#F19E53", "#6699A1", "#E1D369", "#87B4E7", "#DA6D85", "#BBBAC5"]'
                    }
                ]
            },
            {
                text: 'option.subcat.tooltip',
                dropdown: true,
                options: [
                    {
                        id: 'tooltip--enabled',
                        pid: 'tooltip.enabled',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'true',
                        parent: 'tooltip',
                        width: 50
                    },
                    {
                        id: 'tooltip--shared',
                        pid: 'tooltip.shared',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'tooltip',
                        width: 50
                    },
                    {
                        id: 'tooltip--backgroundColor',
                        pid: 'tooltip.backgroundColor',
                        dataType: 'color',
                        context: 'General',
                        defaults: 'rgba(247,247,247,0.85)',
                        parent: 'tooltip',
                        width: 50
                    },
                    {
                        id: 'tooltip--borderWidth',
                        custom: {
                            minValue: 0
                        },
                        pid: 'tooltip.borderWidth',
                        dataType: 'number',
                        context: 'General',
                        defaults: '1',
                        parent: 'tooltip',
                        width: 50
                    },
                    {
                        id: 'tooltip--borderRadius',
                        custom: {
                            minValue: 0
                        },
                        pid: 'tooltip.borderRadius',
                        dataType: 'number',
                        context: 'General',
                        defaults: '3',
                        parent: 'tooltip',
                        width: 50
                    },
                    {
                        id: 'tooltip--borderColor',
                        pid: 'tooltip.borderColor',
                        dataType: 'color',
                        context: 'General',
                        defaults: 'null',
                        parent: 'tooltip',
                        width: 50
                    },
                    {
                        id: 'tooltip--valueSuffix',
                        pid: 'tooltip.valueSuffix',
                        dataType: 'string',
                        context: 'General',
                        defaults: '',
                        parent: 'tooltip',
                        width: 98
                    }
                ]
            },
            {
                text: 'option.subcat.interaction',
                dropdown: true,
                group: 2,
                options: [
                    {
                        id: 'chart--zoomType',
                        pid: 'chart.zoomType',
                        dataType: 'string',
                        context: 'General',
                        parent: 'chart',
                        values: '[null, "x", "y", "xy"]'
                    },
                    {
                        id: 'chart--polar',
                        pid: 'chart.polar',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'chart'
                    },
                    {
                        id: 'plotOptions--series--states--inactive--opacity',
                        pid: 'plotOptions.series.states.inactive.opacity',
                        dataType: 'number',
                        context: 'General',
                        defaults: '0.2',
                        parent: 'chart'
                    }
                ]
            },
            {
                text: 'option.subcat.credit',
                dropdown: true,
                group: 2,
                warning: [1],
                options: [
                    {
                        id: 'credits--enabled',
                        pid: 'credits.enabled',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'true',
                        parent: 'credits',
                        warning: [1]
                    },
                    {
                        id: 'credits--text',
                        pid: 'credits.text',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Highcharts.com',
                        parent: 'credits',
                        warning: [1]
                    },
                    {
                        id: 'credits--href',
                        pid: 'credits.href',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'https://www.highcharts.com',
                        parent: 'credits',
                        warning: [1]
                    }
                ]
            }
        ],
        'option.cat.axes': [
            {
                text: 'option.subcat.xaxis',
                dropdown: true,
                options: [
                    {
                        id: 'xAxis-title--style',
                        dataType: 'font',
                        dataIndex: 0,
                        pid: 'xAxis.title.style',
                        context: 'General',
                        defaults: '{ "color": "#666666" }',
                        parent: 'xAxis-title'
                    },
                    {
                        id: 'xAxis-title--text',
                        dataIndex: 0,
                        pid: 'xAxis.title.text',
                        dataType: 'string',
                        context: 'General',
                        parent: 'xAxis-title',
                        width: 50
                    },
                    {
                        id: 'xAxis-labels--format',
                        dataIndex: 0,
                        pid: 'xAxis.labels.format',
                        dataType: 'string',
                        context: 'General',
                        defaults: '{value}',
                        parent: 'xAxis-labels',
                        width: 50
                    },
                    {
                        id: 'xAxis--type',
                        dataIndex: 0,
                        pid: 'xAxis.type',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'linear',
                        parent: 'xAxis',
                        values: '["linear", "logarithmic", "datetime", "category"]'
                    },
                    {
                        id: 'xAxis--opposite',
                        dataIndex: 0,
                        pid: 'xAxis.opposite',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'xAxis',
                        width: 50
                    },
                    {
                        id: 'xAxis--reversed',
                        dataIndex: 0,
                        pid: 'xAxis.reversed',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'xAxis',
                        width: 50
                    }

                ]
            },
            {
                text: 'option.subcat.yaxis',
                dropdown: true,
                options: [
                    {
                        id: 'yAxis-title--style',
                        dataType: 'font',
                        dataIndex: 0,
                        pid: 'yAxis.title.style',
                        context: 'General',
                        defaults: '{ "color": "#666666" }',
                        parent: 'yAxis-title'
                    },
                    {
                        id: 'yAxis-title--text',
                        dataIndex: 0,
                        pid: 'yAxis.title.text',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Values',
                        parent: 'yAxis-title',
                        width: 50
                    },
                    {
                        id: 'yAxis--type',
                        dataIndex: 0,
                        pid: 'yAxis.type',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'linear',
                        parent: 'yAxis',
                        values: '["linear", "logarithmic", "datetime", "category"]',
                        width: 50
                    },
                    {
                        id: 'yAxis-labels--format',
                        dataIndex: 0,
                        pid: 'yAxis.labels.format',
                        dataType: 'string',
                        context: 'General',
                        defaults: '{value}',
                        parent: 'yAxis-labels',
                        width: 100
                    },
                    {
                        id: 'yAxis--opposite',
                        dataIndex: 0,
                        pid: 'yAxis.opposite',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'yAxis',
                        width: 50
                    },
                    {
                        id: 'yAxis--reversed',
                        dataIndex: 0,
                        pid: 'yAxis.reversed',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'yAxis',
                        width: 50
                    }
                ]
            }
        ],
        'option.cat.series': [
            {
                id: 'series',
                array: true,
                text: 'option.cat.series',
                controlledBy: {
                    title: 'Select Series',
                    options: 'series',
                    optionsTitle: 'name'
                },
                filteredBy: 'series--type',
                options: [
                    {
                        id: 'series--type',
                        pid: 'series.type',
                        dataType: 'string',
                        context: 'General',
                        parent: 'series<treemap>',
                        values:
              '[null, "line", "spline", "column", "area", "areaspline", "pie", "arearange", "areasplinerange", "boxplot", "bubble", "columnrange", "errorbar", "funnel", "gauge", "scatter", "waterfall"]',
                        subType: [
                            'treemap',
                            'scatter',
                            'line',
                            'gauge',
                            'heatmap',
                            'spline',
                            'funnel',
                            'areaspline',
                            'area',
                            'bar',
                            'bubble',
                            'areasplinerange',
                            'boxplot',
                            'pie',
                            'arearange',
                            'column',
                            'waterfall',
                            'columnrange',
                            'pyramid',
                            'polygon',
                            'solidgauge',
                            'errorbar'
                        ],
                        subTypeDefaults: {},
                        width: 50
                    },

                    {
                        id: 'series--dashStyle',
                        pid: 'series.dashStyle',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Solid',
                        parent: 'series<areasplinerange>',
                        values:
              '["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]',
                        subType: [
                            'areasplinerange',
                            'polygon',
                            'areaspline',
                            'spline',
                            'scatter',
                            'area',
                            'bubble',
                            'arearange',
                            'waterfall',
                            'line'
                        ],
                        subTypeDefaults: {
                            polygon: 'Solid',
                            areaspline: 'Solid',
                            spline: 'Solid',
                            scatter: 'Solid',
                            area: 'Solid',
                            bubble: 'Solid',
                            arearange: 'Solid',
                            waterfall: 'Dot',
                            line: 'Solid'
                        },
                        width: 50
                    },
                    {
                        id: 'series--color',
                        pid: 'series.color',
                        dataType: 'color',
                        context: 'General',
                        defaults: 'null',
                        parent: 'series<boxplot>',
                        subType: [
                            'boxplot',
                            'column',
                            'waterfall',
                            'columnrange',
                            'heatmap',
                            'area',
                            'scatter',
                            'bar',
                            'treemap',
                            'arearange',
                            'bubble',
                            'errorbar',
                            'spline',
                            'polygon',
                            'line',
                            'gauge',
                            'areaspline',
                            'areasplinerange'
                        ],
                        subTypeDefaults: {
                            heatmap: 'null',
                            treemap: 'null',
                            errorbar: '#000000'
                        },
                        width: 18
                    },
                    {
                        id: 'series--negativeColor',
                        pid: 'series.negativeColor',
                        dataType: 'color',
                        context: 'General',
                        defaults: 'null',
                        parent: 'series<gauge>',
                        subType: [
                            'gauge',
                            'arearange',
                            'areasplinerange',
                            'line',
                            'errorbar',
                            'boxplot',
                            'areaspline',
                            'spline',
                            'bar',
                            'scatter',
                            'polygon',
                            'bubble',
                            'area',
                            'column'
                        ],
                        subTypeDefaults: {
                            arearange: 'null',
                            areasplinerange: 'null',
                            line: 'null',
                            errorbar: 'null',
                            boxplot: 'null',
                            areaspline: 'null',
                            spline: 'null',
                            bar: 'null',
                            scatter: 'null',
                            polygon: 'null',
                            bubble: 'null',
                            area: 'null',
                            column: 'null'
                        },
                        width: 33
                    },
                    {
                        id: 'series-marker--symbol',
                        pid: 'series.marker.symbol',
                        dataType: 'string',
                        context: 'General',
                        parent: 'series<bubble>-marker',
                        values:
              '[null, "circle", "square", "diamond", "triangle", "triangle-down"]',
                        subType: [
                            'bubble',
                            'polygon',
                            'line',
                            'scatter',
                            'spline',
                            'area',
                            'areaspline'
                        ],
                        subTypeDefaults: {},
                        width: 49
                    },
                    {
                        id: 'series--colorByPoint',
                        pid: 'series.colorByPoint',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'series<treemap>',
                        subType: [
                            'treemap',
                            'heatmap',
                            'column',
                            'errorbar',
                            'columnrange',
                            'boxplot',
                            'bar',
                            'waterfall'
                        ],
                        subTypeDefaults: {
                            heatmap: 'false',
                            column: 'false',
                            errorbar: 'false',
                            columnrange: 'false',
                            boxplot: 'false',
                            bar: 'false',
                            waterfall: 'false'
                        },
                        width: 50
                    },
                    {
                        id: 'series-marker--enabled',
                        pid: 'series.marker.enabled',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'null',
                        parent: 'series<bubble>-marker',
                        subType: [
                            'bubble',
                            'area',
                            'scatter',
                            'areaspline',
                            'spline',
                            'polygon',
                            'line'
                        ],
                        subTypeDefaults: {
                            area: 'null',
                            scatter: 'null',
                            areaspline: 'null',
                            spline: 'null',
                            polygon: 'null',
                            line: 'null'
                        },
                        width: 50
                    },

                    {
                        id: 'series-label--enabled',
                        pid: 'series.label.enabled',
                        defaults: 'true',
                        dataType: 'boolean',
                        subType: [
                            'line',
                            'spline',
                            'area',
                            'arearange',
                            'areaspline',
                            'waterfall',
                            'areasplinerange'
                        ],
                        subTypeDefaults: {}
                    },

                    {
                        id: 'series-label--style',
                        pid: 'series.label.style',
                        dataType: 'font'
                    }
                ]
            }
        ],
        'option.cat.export': [
            {
                text: 'option.cat.exporting',
                dropdown: true,
                options: [
                    {
                        id: 'exporting--enabled',
                        pid: 'exporting.enabled',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'true',
                        parent: 'exporting',
                        width: 50
                    },
                    {
                        id: 'exporting--offlineExporting',
                        pid: 'exporting.offlineExporting',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'exporting',
                        width: 50,
                        plugins: [
                            'modules/offline-exporting.js'
                        ],
                        noChange: true
                    },
                    {
                        id: 'exporting--sourceWidth',
                        custom: {
                            minValue: 10,
                            maxValue: 2000,
                            step: 10
                        },
                        pid: 'exporting.sourceWidth',
                        dataType: 'number',
                        context: 'General',
                        parent: 'exporting',
                        values: ''
                    },
                    {
                        id: 'exporting--scale',
                        custom: {
                            minValue: 1,
                            maxValue: 4
                        },
                        pid: 'exporting.scale',
                        dataType: 'number',
                        context: 'General',
                        defaults: '2',
                        parent: 'exporting',
                        values: ''
                    }
                ]
            }
        ],
        'option.cat.legend': [
            {
                text: 'option.subcat.general',
                dropdown: true,
                group: 1,
                options: [
                    {
                        id: 'legend--enabled',
                        pid: 'legend.enabled',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'true',
                        parent: 'legend'
                    },
                    {
                        id: 'legend--layout',
                        pid: 'legend.layout',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'horizontal',
                        width: 50,
                        parent: 'legend',
                        values: '["horizontal", "vertical"]'
                    },
                    {
                        id: 'legend--labelFormat',
                        pid: 'legend.labelFormat',
                        dataType: 'string',
                        context: 'General',
                        defaults: '{name}',
                        width: 50,
                        parent: 'legend'
                    }
                ]
            },
            {
                text: 'option.subcat.placement',
                dropdown: true,
                group: 1,
                options: [
                    {
                        id: 'legend--align',
                        pid: 'legend.align',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'center',
                        parent: 'legend',
                        values: '["left", "center", "right"]',
                        width: 50
                    },
                    {
                        id: 'legend--verticalAlign',
                        pid: 'legend.verticalAlign',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'bottom',
                        parent: 'legend',
                        values: '["top", "middle", "bottom"]',
                        width: 50
                    },
                    {
                        id: 'legend--floating',
                        pid: 'legend.floating',
                        dataType: 'boolean',
                        context: 'General',
                        defaults: 'false',
                        parent: 'legend'
                    }
                ]
            },
            {
                text: 'option.subcat.legendappearance',
                dropdown: true,
                options: [
                    {
                        id: 'legend--itemStyle',
                        dataType: 'font',
                        pid: 'legend.itemStyle',
                        context: 'General',
                        defaults:
              '{ "color": "#333333", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold" }',
                        parent: 'legend'
                    },
                    {
                        id: 'legend--backgroundColor',
                        pid: 'legend.backgroundColor',
                        dataType: 'color',
                        context: 'General',
                        parent: 'legend',
                        width: 50
                    },
                    {
                        id: 'legend--borderColor',
                        pid: 'legend.borderColor',
                        dataType: 'color',
                        context: 'General',
                        defaults: '#999999',
                        parent: 'legend',
                        width: 50
                    },
                    {
                        id: 'legend--borderWidth',
                        pid: 'legend.borderWidth',
                        dataType: 'number',
                        context: 'General',
                        defaults: '0',
                        parent: 'legend',
                        width: 50
                    },
                    {
                        id: 'legend--borderRadius',
                        pid: 'legend.borderRadius',
                        dataType: 'number',
                        context: 'General',
                        defaults: '0',
                        parent: 'legend',
                        width: 50
                    }
                ]
            }
        ],
        'option.cat.localization': [
            {
                text: 'option.subcat.numberformat',
                dropdown: true,
                group: 1,
                options: [
                    {
                        id: 'lang--decimalPoint',
                        pid: 'lang.decimalPoint',
                        dataType: 'string',
                        context: 'General',
                        defaults: '.',
                        parent: 'lang',
                        width: 50
                    },
                    {
                        id: 'lang--thousandsSep',
                        pid: 'lang.thousandsSep',
                        dataType: 'string',
                        context: 'General',
                        defaults: ' ',
                        parent: 'lang',
                        width: 50
                    }
                ]
            },
            {
                text: 'option.subcat.zoombutton',
                dropdown: true,
                group: 1,
                options: [
                    {
                        id: 'lang--resetZoom',
                        pid: 'lang.resetZoom',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Reset zoom',
                        parent: 'lang'
                    }
                ]
            },
            {
                text: 'option.subcat.exportbutton',
                dropdown: true,
                options: [
                    {
                        id: 'lang--contextButtonTitle',
                        pid: 'lang.contextButtonTitle',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Chart context menu',
                        parent: 'lang',
                        values: '',
                        width: 50
                    },
                    {
                        id: 'lang--printChart',
                        pid: 'lang.printChart',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Print chart',
                        parent: 'lang',
                        values: '',
                        width: 50
                    },
                    {
                        id: 'lang--downloadPNG',
                        pid: 'lang.downloadPNG',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Download PNG image',
                        parent: 'lang',
                        width: 50
                    },
                    {
                        id: 'lang--downloadJPEG',
                        pid: 'lang.downloadJPEG',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Download JPEG image',
                        parent: 'lang',
                        width: 50
                    },
                    {
                        id: 'lang--downloadPDF',
                        pid: 'lang.downloadPDF',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Download PDF document',
                        parent: 'lang',
                        width: 50
                    },
                    {
                        id: 'lang--downloadSVG',
                        pid: 'lang.downloadSVG',
                        dataType: 'string',
                        context: 'General',
                        defaults: 'Download SVG vector image',
                        parent: 'lang',
                        width: 50
                    }
                ]
            }
        ]
    }
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.meta.charttype = {
    arearange: {
        low: {
            name: 'Low',
            desc: 'The low or minimum value for each data point.',
            default: 'B',
            value: 'B',
            mandatory: true,
            linkedTo: 'low',
            rawValue: [1]
        },
        values: null,
        high: {
            name: 'High',
            desc: 'The high or maximum value for each data point.',
            default: 'C',
            value: 'C',
            isData: true,
            mandatory: true,
            linkedTo: 'high',
            rawValue: [2]
        }
    },
    boxplot: {
        low: {
            name: 'Low',
            desc: 'The low value for each data point, signifying the lowest value in the sample set. The bottom whisker is drawn here.',
            default: 'B',
            value: 'B',
            isData: true,
            mandatory: true,
            linkedTo: 'low',
            rawValue: [1]
        },
        values: null,
        high: {
            name: 'High',
            desc: 'The rank for this points data label in case of collision. If two data labels are about to overlap, only the one with the highest labelrank will be drawn.',
            default: 'C',
            value: 'C',
            isData: true,
            mandatory: true,
            linkedTo: 'high',
            rawValue: [2]
        },
        median: {
            name: 'Median',
            desc: 'The median for each data point. This is drawn as a line through the middle area of the box.',
            default: 'D',
            value: 'D',
            mandatory: true,
            isData: true,
            linkedTo: 'median',
            rawValue: [3]
        },
        q1: {
            name: 'Q1',
            desc: 'The lower quartile for each data point. This is the bottom of the box.',
            default: 'E',
            value: 'E',
            mandatory: true,
            multipleValues: false,
            isData: true,
            previousValue: null,
            linkedTo: 'q1',
            rawValue: [4]
        },
        q3: {
            name: 'Q3',
            desc: 'The higher quartile for each data point. This is the top of the box.',
            default: 'F',
            value: 'F',
            mandatory: true,
            isData: true,
            linkedTo: 'q3',
            rawValue: [4]
        }
    },
    candlestick: {
        values: null,
        close: {
            name: 'Close',
            desc: 'The closing value of each data point.',
            default: 'B',
            value: 'B',
            mandatory: true,
            linkedTo: 'close',
            isData: true,
            rawValue: [1]
        },
        open: {
            name: 'Open',
            desc: 'The opening value of each data point.',
            default: 'C',
            value: 'C',
            mandatory: true,
            isData: true,
            linkedTo: 'open',
            rawValue: [2]
        },
        low: {
            name: 'Low',
            desc: 'The low or minimum value for each data point.',
            default: 'D',
            value: 'D',
            multipleValues: false,
            previousValue: null,
            mandatory: true,
            isData: true,
            linkedTo: 'low',
            rawValue: [3]
        },
        high: {
            name: 'High',
            desc: 'The high or maximum value for each data point.',
            default: 'E',
            value: 'E',
            mandatory: true,
            isData: true,
            linkedTo: 'high',
            rawValue: [4]
        }
    },
    bubble: {
        values: null,
        y: {
            name: 'Y',
            desc: 'Y Position',
            default: 'B',
            value: 'B',
            mandatory: true,
            isData: true,
            linkedTo: 'y',
            rawValue: [1]
        },
        z: {
            name: 'Z',
            desc: 'Z Position.',
            default: 'C',
            value: 'C',
            mandatory: true,
            isData: true,
            linkedTo: 'z',
            rawValue: [2]
        }
    },
    columnrange: {
        values: null,
        low: {
            name: 'Low',
            desc: 'The low or minimum value for each data point.',
            default: 'B',
            value: 'B',
            mandatory: true,
            isData: true,
            linkedTo: 'low',
            rawValue: [1]
        },
        high: {
            name: 'High',
            desc: 'The high or maximum value for each data point.',
            default: 'C',
            value: 'C',
            mandatory: true,
            isData: true,
            linkedTo: 'high',
            rawValue: [2]
        }
    }
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.meta.colors = [
    // Red
    '#F44336',
    '#FFEBEE',
    '#FFCDD2',
    '#EF9A9A',
    '#E57373',
    '#EF5350',
    '#F44336',
    '#E53935',
    '#D32F2F',
    '#C62828',
    '#B71C1C',
    '#FF8A80',
    '#FF5252',
    '#FF1744',
    '#D50000',
    // Pink
    '#E91E63',
    '#FCE4EC',
    '#F8BBD0',
    '#F48FB1',
    '#F06292',
    '#EC407A',
    '#E91E63',
    '#D81B60',
    '#C2185B',
    '#AD1457',
    '#880E4F',
    '#FF80AB',
    '#FF4081',
    '#F50057',
    '#C51162',
    // Purple
    '#9C27B0',
    '#F3E5F5',
    '#E1BEE7',
    '#CE93D8',
    '#BA68C8',
    '#AB47BC',
    '#9C27B0',
    '#8E24AA',
    '#7B1FA2',
    '#6A1B9A',
    '#4A148C',
    '#EA80FC',
    '#E040FB',
    '#D500F9',
    '#AA00FF',
    // Deep Purple
    '#673AB7',
    '#EDE7F6',
    '#D1C4E9',
    '#B39DDB',
    '#9575CD',
    '#7E57C2',
    '#673AB7',
    '#5E35B1',
    '#512DA8',
    '#4527A0',
    '#311B92',
    '#B388FF',
    '#7C4DFF',
    '#651FFF',
    '#6200EA',
    // Indigo
    '#3F51B5',
    '#E8EAF6',
    '#C5CAE9',
    '#9FA8DA',
    '#7986CB',
    '#5C6BC0',
    '#3F51B5',
    '#3949AB',
    '#303F9F',
    '#283593',
    '#1A237E',
    '#8C9EFF',
    '#536DFE',
    '#3D5AFE',
    '#304FFE',
    // Blue
    '#2196F3',
    '#E3F2FD',
    '#BBDEFB',
    '#90CAF9',
    '#64B5F6',
    '#42A5F5',
    '#2196F3',
    '#1E88E5',
    '#1976D2',
    '#1565C0',
    '#0D47A1',
    '#82B1FF',
    '#448AFF',
    '#2979FF',
    '#2962FF',
    // Light Blue
    '#03A9F4',
    '#E1F5FE',
    '#B3E5FC',
    '#81D4FA',
    '#4FC3F7',
    '#29B6F6',
    '#03A9F4',
    '#039BE5',
    '#0288D1',
    '#0277BD',
    '#01579B',
    '#80D8FF',
    '#40C4FF',
    '#00B0FF',
    '#0091EA',
    // Cyan
    '#00BCD4',
    '#E0F7FA',
    '#B2EBF2',
    '#80DEEA',
    '#4DD0E1',
    '#26C6DA',
    '#00BCD4',
    '#00ACC1',
    '#0097A7',
    '#00838F',
    '#006064',
    '#84FFFF',
    '#18FFFF',
    '#00E5FF',
    '#00B8D4',
    // Teal
    '#009688',
    '#E0F2F1',
    '#B2DFDB',
    '#80CBC4',
    '#4DB6AC',
    '#26A69A',
    '#009688',
    '#00897B',
    '#00796B',
    '#00695C',
    '#004D40',
    '#A7FFEB',
    '#64FFDA',
    '#1DE9B6',
    '#00BFA5',
    // Green
    '#4CAF50',
    '#E8F5E9',
    '#C8E6C9',
    '#A5D6A7',
    '#81C784',
    '#66BB6A',
    '#4CAF50',
    '#43A047',
    '#388E3C',
    '#2E7D32',
    '#1B5E20',
    '#B9F6CA',
    '#69F0AE',
    '#00E676',
    '#00C853',
    // Light Green
    '#8BC34A',
    '#F1F8E9',
    '#DCEDC8',
    '#C5E1A5',
    '#AED581',
    '#9CCC65',
    '#8BC34A',
    '#7CB342',
    '#689F38',
    '#558B2F',
    '#33691E',
    '#CCFF90',
    '#B2FF59',
    '#76FF03',
    '#64DD17',
    // Lime
    '#CDDC39',
    '#F9FBE7',
    '#F0F4C3',
    '#E6EE9C',
    '#DCE775',
    '#D4E157',
    '#CDDC39',
    '#C0CA33',
    '#AFB42B',
    '#9E9D24',
    '#827717',
    '#F4FF81',
    '#EEFF41',
    '#C6FF00',
    '#AEEA00',
    // Yellow
    '#FFEB3B',
    '#FFFDE7',
    '#FFF9C4',
    '#FFF59D',
    '#FFF176',
    '#FFEE58',
    '#FFEB3B',
    '#FDD835',
    '#FBC02D',
    '#F9A825',
    '#F57F17',
    '#FFFF8D',
    '#FFFF00',
    '#FFEA00',
    '#FFD600',
    // Amber
    '#FFC107',
    '#FFF8E1',
    '#FFECB3',
    '#FFE082',
    '#FFD54F',
    '#FFCA28',
    '#FFC107',
    '#FFB300',
    '#FFA000',
    '#FF8F00',
    '#FF6F00',
    '#FFE57F',
    '#FFD740',
    '#FFC400',
    '#FFAB00',
    // Orange
    '#FF9800',
    '#FFF3E0',
    '#FFE0B2',
    '#FFCC80',
    '#FFB74D',
    '#FFA726',
    '#FF9800',
    '#FB8C00',
    '#F57C00',
    '#EF6C00',
    '#E65100',
    '#FFD180',
    '#FFAB40',
    '#FF9100',
    '#FF6D00',
    // Deep Orange
    '#FF5722',
    '#FBE9E7',
    '#FFCCBC',
    '#FFAB91',
    '#FF8A65',
    '#FF7043',
    '#FF5722',
    '#F4511E',
    '#E64A19',
    '#D84315',
    '#BF360C',
    '#FF9E80',
    '#FF6E40',
    '#FF3D00',
    '#DD2C00',
    // Brown
    '#795548',
    '#EFEBE9',
    '#D7CCC8',
    '#BCAAA4',
    '#A1887F',
    '#8D6E63',
    '#795548',
    '#6D4C41',
    '#5D4037',
    '#4E342E',
    '#3E2723',
    '#3E2723',
    '#3E2723',
    '#3E2723',
    '#3E2723',
    // Grey
    '#9E9E9E',
    '#FAFAFA',
    '#F5F5F5',
    '#EEEEEE',
    '#E0E0E0',
    '#BDBDBD',
    '#9E9E9E',
    '#757575',
    '#616161',
    '#424242',
    '#212121',
    '#212121',
    '#212121',
    '#212121',
    // Blue Grey
    '#607D8B',
    '#ECEFF1',
    '#CFD8DC',
    '#B0BEC5',
    '#90A4AE',
    '#78909C',
    '#607D8B',
    '#546E7A',
    '#455A64',
    '#37474F',
    '#37474F',
    '#37474F',
    '#37474F',
    '#263238'
];

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.meta.fonts = [
    'Default',
    // '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
    'Courier',
    'Arial',
    'Verdana',
    'Georgia',
    'Palatino Linotype',
    'Times New Roman',
    'Comic Sans MS',
    'Impact',
    'Lucida Sans Unicode',
    'Tahoma',
    'Lucida Console',
    'Courier New',
    'Monaco',
    'Monospace'
];

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

highed.highchartsErrors = {
    // Plotting zero or subzero value on a log axis
    10: {
        title: 'Can\'t plot zero or subzero values on a logarithmic axis',
        text:
      'This error occurs in the following situations:<ul><li>If a zero or subzero data value is added to a logarithmic axis</li><li>If the minimum of a logarithimic axis is set to 0 or less</li><li>If the threshold is set to 0 or less</li></ul>As of Highcharts 5.0.8 it is possible to bypass this error message by setting <code>Axis.prototype.allowNegativeLog</code> to<code>true</code> and add custom conversion functions. <ahref="https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/samples/highcharts/yaxis/type-log-negative/">View live demo</a>.'
    },
    // Can't link axes of different types
    11: { title: 'Can\'t link axes of different type', text: 'This error occurs if you are using the linkedTo option to link two axes of different types, for example a logarithmic axis to a linear axis.' },
    // series.data needs to be arrays or numbers when in turbo mode
    12: {
        title:
      'Highcharts expects point configuration to be numbers or arrays in turbo mode',
        text: 'This error occurs if the series data option contains object configurations and the number of points exceeds the turboThreshold. It can be fixed by either setting the turboThreshold option to a higher value'
    },
    // Rendering div not found
    13: { title: 'Rendering div not found', text: 'Highcharts cannot find a parent to render to' },
    // Expected number, got string
    14: { title: 'String value sent to series.data, expected Number', text: 'Highcharts expects there to be a number in the column you just entered. Please change this to a number to continue' },
    // Expected sorted data, got non-sorted
    15: {
        title: 'Highcharts expects data to be sorted',
        text: 'The data passed to your chart needs to be sorted. If you\'re using the datagrid, you can sort your data by clicking the arrow in the x-axis column header, and selecting "Sort Ascending".'
    },
    // Highcharts already defined
    16: { title: 'Highcharts already defined in the page', text: 'Highcharts has already been defined in the page. Keep in mind that all features of Highcharts are included in Highstock' },
    // Requested type doesn't exist
    17: { title: 'The requested series type does not exist', text: 'This error happens when you are setting chart.type or series.type to a series type that isnt defined in Highcharts.' },
    // Requested axis doesn't exist
    18: {
        title: 'The requested axis does not exist',
        text:
      'Make sure that your only references existing axis in the series properties.'
    },
    // Too many ticks (use bug spray) <- ¬_¬
    19: { title: 'Too many ticks', text: 'This error happens when you try to apply too many ticks to an axis, specifically when you add more ticks than the axis pixel length.' },
    // Can't add point config to a long data series
    20: {
        title: 'Can\'t add object point configuration to a long data series',
        text: 'In Highstock, if you try to add a point using the object literal configuration syntax, it works only when the number of data points is below the series turboThreshold. Instead of the object syntax, use the Array syntax.'
    },
    // Can't find Proj4js library
    21: { title: 'Can\'t find Proj4js library', text: 'Using latitude/longitude functionality with pre-projected GeoJSON in Highcharts Maps requires the Proj4js library to be loaded. It is recommended to utilize TopoJSON for Highcharts v10 and above, as built-in projection support is included and no third-party library is required. For more information, see the <a href=\"https://www.highcharts.com/blog/tutorials/highcharts-now-prefers-topojson-maps\">Highcharts now prefers topojson maps</a>.' },
    // Map does not support lat/long
    22: { title: 'Map does not support latitude/longitude', text: 'The loaded map does not support latitude/longitude functionality. This is only supported with maps from the official Highmaps map collection from version 1.1.0 onwards. If you are using a custom map, consider using the Proj4js library to convert between projections.' },
    // Unsupported color format used for color
    23: {
        title: 'Unsupported color format used for color interpolation',
        text: 'Highcharts supports three color formats primarily: hex (#FFFFFF), rgb (rgba(255,255,255) and rgba (rgba(255,255,255,1).'
    },
    // Cannot run Point.update on a grouped point
    24: { title: 'Cannot run Point.update on a grouped point', text: 'This happens in Highstock when a point is grouped by data grouping, so there is no reference to the raw points.' },
    // Can't find moment.js
    25: { title: 'Can\'t find Moment.js library', text: 'Using the global.timezone option requires the Moment.js library to be loaded.' },
    // WebGL not supported
    26: {
        title: 'WebGL not supported, and no fallback module included',
        text: 'This happens when your browser does not support WebGL, and the canvas fallback module (boost-canvas.js) has not been included OR if the fallback module was included after the boost module.'
    },
    // Browser does not support SVG
    27: { title: 'This browser does not support SVG.', text: 'This happens in old IE when the oldie.js module is not loaded.' }
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.DefaultContextMenu = function (chartPreview) {
    var events = highed.events(),
        cmenu = highed.ContextMenu([
            {
                title: highed.getLocalizedStr('previewChart'),
                icon: 'bar-chart',
                click: function () {
                    chartPreview.expand();
                }
            },
            '-',
            {
                title: highed.getLocalizedStr('newChart'),
                icon: 'file-o',
                click: function () {
                    if (window.confirm(highed.getLocalizedStr('confirmNewChart'))) {
                        chartPreview.new();
                        events.emit('NewChart');
                    }
                }
            },
            '-',
            {
                title: highed.getLocalizedStr('saveProject'),
                icon: 'floppy-o',
                click: function () {
                    highed.download('chart.json', chartPreview.toProjectStr());
                }
            },
            {
                title: highed.getLocalizedStr('loadProject'),
                icon: 'folder-open-o',
                click: function () {
                    highed.readLocalFile({
                        type: 'text',
                        accept: '.json',
                        success: function (file) {
                            try {
                                file = JSON.parse(file.data);
                            } catch (e) {
                                return highed.snackBar('Error loading JSON: ' + e);
                            }

                            chartPreview.loadProject(file);
                        }
                    });
                }
            },
            '-',
            {
                title: 'Save to Cloud',
                icon: 'upload',
                click: function () {
                    highed.cloud.save(chartPreview);
                }
            },
            {
                title: highed.getLocalizedStr('loadCloud'),
                icon: 'cloud',
                click: function () {
                    highed.cloud.showUI(chartPreview);
                }
            },
            '-',
            {
                title: highed.getLocalizedStr('exportPNG'),
                icon: 'file-image-o',
                click: function () {
                    chartPreview.data.export({});
                }
            },
            {
                title: highed.getLocalizedStr('exportJPEG'),
                icon: 'file-image-o',
                click: function () {
                    chartPreview.data.export({ type: 'image/jpeg' });
                }
            },
            {
                title: highed.getLocalizedStr('exportSVG'),
                icon: 'file-image-o',
                click: function () {
                    chartPreview.data.export({ type: 'image/svg+xml' });
                }
            },
            {
                title: highed.getLocalizedStr('exportPDF'),
                icon: 'file-pdf-o',
                click: function () {
                    chartPreview.data.export({ type: 'application/pdf' });
                }
            },
            '-',
            {
                title: highed.getLocalizedStr('help'),
                icon: 'question-circle',
                click: function () {
                    window.open(highed.option('helpURL'));
                }
            } // ,
            // {
            //     title: highed.getLocalizedStr('licenseInfo'),
            //     icon: 'key',
            //     click: function () {
            //         highed.licenseInfo.show();
            //     }
            // }
        ]);

    return {
        on: events.on,
        show: cmenu.show
    };
};

/** ****************************************************************************

Copyright (c) 2016-2017, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.ChartCustomizer = function (parent, attributes, chartPreview, planCode) {
    var properties = highed.merge(
            {
                noAdvanced: false,
                noCustomCode: false,
                noPreview: false,
                availableSettings: []
            },
            attributes
        ),
        events = highed.events(),
        advancedLoader = highed.dom.cr(
            'div',
            'highed-customizer-adv-loader',
            '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> Loading'
        ),
        tabs = highed.TabControl(parent, false, null, true), // Quck fix for now, will change once design finalised.
        simpleTab = tabs.createTab({
            title: highed.getLocalizedStr('customizeSimple')
        }),
        advancedTab = tabs.createTab({
            title: highed.getLocalizedStr('customizeAdvanced')
        }),
        customCodeTab = tabs.createTab({
            title: highed.getLocalizedStr('customizeCustomCode')
        }),
        outputPreviewTab = tabs.createTab({
            title: highed.getLocalizedStr('customizePreview')
        }),
        previewEditor = highed.dom.cr(
            'textarea',
            'highed-custom-code highed-box-size highed-stretch'
        ),
        previewCodeMirror = false,
        splitter = highed.dom.cr('div', 'highed-box-simple-container'),
        allOptions,
        /*
    splitter = highed.HSplitter(simpleTab.body, {
      leftWidth: 100,
      rightWidth: 100,
      responsive: true
    }),
    */
        list = highed.List(splitter, true, properties, planCode),
        body = highed.dom.cr('div'), // splitter.right,
        advSplitter = highed.HSplitter(advancedTab.body, {
            leftWidth: 30
        }),
        advBody = advSplitter.right,
        advTree = highed.Tree(advSplitter.left),
        flatOptions = {},
        chartOptions = {},
        customCodeSplitter = highed.VSplitter(customCodeTab.body, {
            topHeight: 90
        }),
        customCodeDebug = highed.dom.cr('pre', 'highed-custom-debug'),
        codeMirrorBox = false,
        customCodeBox = highed.dom.cr(
            'textarea',
            'highed-custom-code highed-box-size highed-stretch'
        ),
        highlighted = false;

    // If we're on mobile, completely disable the advanced view
    if (highed.onPhone()) {
        properties.noAdvanced = true;
        properties.noCustomCode = true;
        properties.noPreview = true;
    }

    body.className += ' highed-customizer-body';

    properties.availableSettings = highed.arrToObj(properties.availableSettings);
    highed.dom.ap(simpleTab.body, splitter);
    highed.dom.ap(parent, advancedLoader);
    highed.dom.ap(outputPreviewTab.body, previewEditor);

    // /////////////////////////////////////////////////////////////////////////

    advancedTab.on('Focus', function () {
        buildTree();
    });

    outputPreviewTab.on('Focus', function () {
        var prev = chartPreview.options.getPreview();

        if (!previewCodeMirror && typeof window.CodeMirror !== 'undefined') {
            previewCodeMirror = CodeMirror.fromTextArea(previewEditor, {
                lineNumbers: true,
                mode: 'application/javascript',
                theme: highed.option('codeMirrorTheme'),
                readOnly: true
            });

            previewCodeMirror.setSize('100%', '100%');
        }

        if (previewCodeMirror) {
            previewCodeMirror.setValue(prev);
        } else {
            previewEditor.readonly = true;
            previewEditor.value = prev;
        }
    });

    function loadCustomCode() {
        var code;

        if (chartPreview) {
            code = chartPreview.getCustomCode() || '';
            if (codeMirrorBox) {
                codeMirrorBox.setValue(code);
            } else {
                customCodeBox.value = code;
            }
        }
    }

    /**
     * Init the custom code stuff
     */
    function initCustomCode() {
    // Build the custom code tab
        highed.dom.ap(customCodeSplitter.top, customCodeBox);
        highed.dom.ap(customCodeSplitter.bottom, customCodeDebug);

        function setCustomCode() {
            highed.emit('UIAction', 'CustomCodeUpdate');
            customCodeDebug.innerHTML = '';
            if (chartPreview) {

                chartPreview.on('LoadCustomCode', function (options) {
                    var code;

                    if (chartPreview) {
                        code = chartPreview.getCustomCode() || '';
                        if (codeMirrorBox) {
                            codeMirrorBox.setValue(code);
                        } else {
                            customCodeBox.value = code;
                        }
                    }
                });

                chartPreview.on('UpdateCustomCode', function () {
                    chartPreview.setCustomCode(
                        codeMirrorBox ? codeMirrorBox.getValue() : customCodeBox.value,
                        function (err) {
                            customCodeDebug.innerHTML = err;
                        }
                    );
                });

                chartPreview.setCustomCode(
                    codeMirrorBox ? codeMirrorBox.getValue() : customCodeBox.value,
                    function (err) {
                        customCodeDebug.innerHTML = err;
                    }
                );
            }
        }

        var timeout = null;

        if (typeof window.CodeMirror !== 'undefined') {
            codeMirrorBox = CodeMirror.fromTextArea(customCodeBox, {
                lineNumbers: true,
                mode: 'application/javascript',
                theme: highed.option('codeMirrorTheme')
            });
            codeMirrorBox.setSize('100%', '100%');
            codeMirrorBox.on('change', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setCustomCode();
                }, 500);
            });
        } else {
            highed.dom.on(customCodeBox, 'change', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    setCustomCode();
                }, 500);
            });
        }
    }


    function resize(w, h) {
        var bsize, lsize;
        tabs.resize(w, h);
        bsize = tabs.barSize();

        list.resize(w, h - bsize.h);
        // splitter.resize(w, h - bsize.h - 10);

        // The customize body needs to have a min-height of the list height
        lsize = highed.dom.size(list.container);

        highed.dom.style(body, {
            minHeight: lsize.h + 'px'
        });
        customCodeSplitter.resize(w, h);

        if (codeMirrorBox) {
            codeMirrorBox.refresh();
        }
    }


    function init(foptions, coptions, chartp) {
        flatOptions = coptions || {};
        chartOptions = highed.merge({}, foptions || {});
        list.reselect();
        // buildTree();
        chartPreview = chartp || chartPreview;

        customCodeSplitter.resize();
        loadCustomCode();
    }

    function shouldInclude(group) {
        var doInclude = false;

        if (Object.keys(properties.availableSettings || {}).length > 0) {
            if (highed.isArr(group)) {
                group.forEach(function (sub) {
                    if (shouldInclude(sub)) {
                        doInclude = true;
                    }
                });
            } else if (highed.isArr(group.options)) {
                group.options.forEach(function (sub) {
                    if (shouldInclude(sub)) {
                        doInclude = true;
                    }
                });
            } else if (
                properties.availableSettings[group.id] ||
        properties.availableSettings[group.pid]
            ) {
                doInclude = true;
            }

            return doInclude;
        }

        return true;
    }

    function buildTree() {

        if (properties.noAdvanced) {
            return;
        }

        highed.dom.style(advancedLoader, {
            opacity: 1
        });

        if (properties.noAdvanced || highed.isNull(highed.meta.optionsAdvanced)) {
            advancedTab.hide();
        } else {

            setTimeout(function () {

                highed.meta.optionsAdvanced = highed.transform.advanced(
                    highed.meta.optionsAdvanced,
                    true
                );

                const series = chartPreview.options.all().series;
                allOptions = highed.merge({}, chartPreview.options.full);// highed.merge({}, chartPreview.options.getCustomized());
                if (series && series.length > 0) {
                    series.forEach(function (serie, i) {
                        if (allOptions.series && allOptions.series[i]) {
                            highed.merge(allOptions.series[i], {
                                type: serie.type || 'line'
                            });
                        }
                    });
                    advTree.build(
                        highed.meta.optionsAdvanced,
                        allOptions
                    );

                    highed.dom.style(advancedLoader, {
                        opacity: 0
                    });
                    events.emit('AdvancedBuilt');
                }

            }, 10);
        }
    }

    function build() {
        Object.keys(highed.meta.optionsExtended.options).forEach(function (key) {
            if (!shouldInclude(highed.meta.optionsExtended.options[key])) {
                return;
            }
            list.addItem({
                id: key,
                title: highed.L(key)
            },
            highed.meta.optionsExtended.options[key],
            chartPreview);
        });
        /*
    list.addItem({
      id: "Annotations",
      annotations: true,
      title: "Annotations ",
      onClick: function() {
        events.emit("AnnotationsClicked");
      }
    }, null, chartPreview);*/

    // buildTree();
    }

    // Highlight a node
    function highlightNode(n, x, y) {
        if (!n) {
            return;
        }

        var p = highed.dom.pos(n);

        if (!simpleTab.selected) {
            simpleTab.focus();
        }

        n.focus();
        /*
    n.scrollIntoView({
      inline: 'nearest'
    });*/

        // Draw a dot where the item was clicked

        var attention = highed.dom.cr('div', 'highed-attention');
        highed.dom.style(attention, {
            width: '10px',
            height: '10px',
            left: x - 5 + 'px',
            top: y - 5 + 'px',
            borderRadius: '50%'
        });
        highed.dom.ap(document.body, attention);

        // Animate it to the corresponding element
        var pos = Highcharts.offset(n);

        var bgColor = n.style.backgroundColor;

        highed.dom.style(attention, {
            width: n.clientWidth + 'px',
            height: n.clientHeight + 'px',
            borderRadius: 0,
            left: pos.left + 'px',
            top: pos.top + 'px'
        });


        window.setTimeout(function () {
            highed.dom.style(n, {
                backgroundColor: window.getComputedStyle(attention).backgroundColor,
                transition: '1s ease background-color'
            });

            attention.parentNode.removeChild(attention);
            attention = null;

            window.setTimeout(function () {
                highed.dom.style(n, {
                    backgroundColor: bgColor
                });
            }, 250);
        }, 350);
    }

    // ////////////////////////////////////////////////////////////////////////////
    // P U B L I C  F U N S


    function highlightField(id, x, y) {
        if (id.indexOf('-') >= 0) {
            var n = advSplitter.left.querySelector(
                '#' + id.substr(0, id.indexOf('-'))
            );

            highlightNode(simpleTab.body.querySelector('#' + id), x, y);
            highlightNode(advSplitter.right.querySelector('#' + id));

            if (n) {
                n.scrollIntoView({
                    block: 'end'
                });
            }
        }
    }


    function focus(thing, x, y) {
        var n;
        list.select(thing.tab);
        list.selectDropdown(thing.dropdown);

        advTree.expandTo(thing.id);
        highlightField(thing.id, x, y);
    }

    // /////////////////////////////////////////////////////////////////////////

    list.on('PropertyChange', function (groupId, newValue, detailIndex) {
        events.emit('PropertyChange', groupId, newValue, detailIndex);
    });

    list.on('TogglePlugins', function (groupId, newValue) {
        events.emit('TogglePlugins', groupId, newValue);
    });

    list.on('Select', function (id) {
        var entry = highed.meta.optionsExtended.options[id];
        body.innerHTML = '';
        entry.forEach(function (thing) {
            // selectGroup(thing);
        });
        highlighted = false;
        highed.emit('UIAction', 'SimplePropCatChoose', id);
    });

    function buildAdvTree(item, selected, instancedData, filter, propFilter) {
        var table = highed.dom.cr('table', 'highed-customizer-table'),
            componentCount = 0;

        advBody.innerHTML = '';

        if (properties.noAdvanced) {
            return;
        }

        item.children.forEach(function (entry) {
            if (!entry.meta.leafNode) {
                return;
            }

            // Skip functions for now
            if (Object.keys(entry.meta.types)[0] === 'function') {
                return;
            }

            if (propFilter && entry.meta.validFor) {
                if (!entry.meta.validFor[propFilter]) {
                    // console.log('filtered', entry.meta.name, 'based on', propFilter);
                    return false;
                }
            }

            if (
                filter &&
        entry.meta.products &&
        Object.keys(entry.meta.products) > 0 &&
        !entry.meta.products[filter]
            ) {
                return;
            }

            componentCount++;
            entry.values = entry.meta.enumValues;
            highed.dom.ap(
                table,
                highed.InspectorField(
                    entry.values ?
                        'options' :
                        Object.keys(entry.meta.types)[0] || 'string',
                    typeof instancedData[entry.meta.name] !== 'undefined' ?
                        instancedData[entry.meta.name] :
                        entry.meta.default, // (highed.getAttr(chartOptions, entry.id)  || entry.defaults),
                    {
                        title: highed.uncamelize(entry.meta.name),
                        tooltip: entry.meta.description,
                        values: entry.meta.enumValues,
                        defaults: entry.meta.default,
                        custom: {},
                        attributes: entry.attributes || []
                    },
                    function (newValue) {
                        if (typeof newValue === 'string') {
                            newValue = newValue.replace('<\/script>', '<\\/script>');
                        } // Bug in cloud
                        highed.emit(
                            'UIAction',
                            'AdvancedPropSet',
                            (entry.meta.ns ? entry.meta.ns + '.' : '') + highed.uncamelize(entry.meta.name),
                            newValue
                        );
                        instancedData[entry.meta.name] = newValue;
                        events.emit('PropertySetChange', advTree.getMasterData());
                        if (advTree.isFilterController(entry.meta.ns, entry.meta.name)) {
                            buildTree();
                        }
                    },
                    false,
                    entry.meta.name,
                    planCode
                )
            );
        });

        highed.dom.ap(
            advBody,
            highed.dom.ap(
                highed.dom.cr('div', 'highed-customize-group highed-customize-advanced'),
                highed.dom.cr('div', 'highed-customizer-table-heading', selected),
                table
            )
        );
    }

    advTree.on('ForceSave', function (data) {
        events.emit('PropertySetChange', data);
    });

    advTree.on('ClearSelection', function () {
        advBody.innerHTML = '';
    });

    advTree.on('Select', buildAdvTree);

    advTree.on('DataUpdate', function (path, data) {
        events.emit('PropertyChange', path, data);
    });

    advTree.on('Dirty', function () {
        init(flatOptions, chartOptions);
    });

    tabs.on('Focus', function () {
        init(flatOptions, chartOptions);
    });

    build();
    initCustomCode();

    if (properties.noCustomCode) {
        customCodeTab.hide();
    }

    if (properties.noAdvanced) {
        advancedTab.hide();
    }

    if (properties.noPreview) {
        outputPreviewTab.hide();
    }

    function showCustomCode() {
        customCodeTab.focus();
    }

    function showSimpleEditor() {
        simpleTab.focus();
    }

    function showPreviewOptions() {
        outputPreviewTab.focus();
    }

    function showAdvancedEditor() {
        events.emit('AdvanceClicked');
        advancedTab.focus();
    }

    function getAdvancedOptions() {
        return allOptions;
    }
    return {
    /* Listen to an event */
        on: events.on,
        resize: resize,
        init: init,
        focus: focus,
        reselect: list.reselect,
        highlightField: highlightField,
        showCustomCode: showCustomCode,
        showSimpleEditor: showSimpleEditor,
        showAdvancedEditor: showAdvancedEditor,
        showPreviewOptions: showPreviewOptions,
        getAdvancedOptions: getAdvancedOptions
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var webImports = {};

    highed.plugins.import = {

        install: function (name, defintion) {
            if (highed.isNull(webImports[name])) {
                webImports[name] = highed.merge(
                    {
                        title: false,
                        description: '',
                        treatAs: 'csv',
                        fetchAs: 'json',
                        defaultURL: '',
                        dependencies: [],
                        options: {},
                        filter: function () {}
                    },
                    defintion
                );

                if (webImports[name].dependencies) {
                    webImports[name].dependencies.forEach(function (d) {
                        highed.include(d);
                    });
                }
            } else {
                highed.log(
                    1,
                    'tried to register an import plugin which already exists:',
                    name
                );
            }
        }
    };


    highed.DataImporter = function (parent, attributes) {
        var events = highed.events(),
            properties = highed.merge(
                {
                    options: ['csv', 'plugins', 'samples', 'export'],
                    plugins: ['CSV', 'JSON', 'Difi', 'Socrata', 'Google Spreadsheets']
                },
                attributes
            ),
            tabs = highed.TabControl(parent, false, true),
            csvTab = tabs.createTab({ title: 'Import' }),
            exportTab = tabs.createTab({ title: 'Export' }),
            jsonTab = tabs.createTab({ title: 'JSON' }),
            webTab = tabs.createTab({ title: 'Plugins' }),
            samplesTab = tabs.createTab({ title: 'Sample Data' }),
            csvPasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
            csvImportBtn = highed.dom.cr(
                'button',
                'highed-imp-button highed-imp-pasted-button',
                'Import Pasted Data'
            ),
            liveDataImportBtn = highed.dom.cr('button', 'highed-imp-button', 'Live Data'),
            csvImportFileBtn = highed.dom.cr(
                'button',
                'highed-imp-button',
                'Import File'
            ),
            delimiter = highed.dom.cr('input', 'highed-imp-input'),
            dateFormat = highed.dom.cr('input', 'highed-imp-input'),
            decimalPoint = highed.dom.cr('input', 'highed-imp-input'),
            firstAsNames = highed.dom.cr('input', 'highed-imp-input'),
            jsonPasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
            jsonImportBtn = highed.dom.cr('button', 'highed-imp-button', 'Import'),
            jsonImportFileBtn = highed.dom.cr(
                'button',
                'highed-imp-button',
                'Upload & Import File'
            ),
            spreadsheetImportBtn = highed.dom.cr(
                'button',
                'highed-imp-button',
                'Google Spreadsheet'
            ),
            commaDelimitedBtn = highed.dom.cr(
                'button',
                'highed-imp-button highed-export-btn',
                'Export comma delimited'
            ),
            semicolonDelimitedBtn = highed.dom.cr(
                'button',
                'highed-imp-button highed-export-btn',
                'Export semi-colon delimited'
            ),
            webSplitter = highed.HSplitter(webTab.body, { leftWidth: 30 }),
            webList = highed.List(webSplitter.left);

        jsonPasteArea.value = JSON.stringify({}, undefined, 2);

        setDefaultTabSize(600, 600, [csvTab, exportTab, jsonTab, webTab, samplesTab]);
        // /////////////////////////////////////////////////////////////////////////

        highed.dom.style(samplesTab.body, { overflow: 'hidden' });

        properties.options = highed.arrToObj(properties.options);
        properties.plugins = highed.arrToObj(properties.plugins);

        // Remove referenced un-installed plugins.
        Object.keys(properties.plugins).forEach(function (plugin) {
            if (highed.isNull(webImports[plugin])) {
                delete properties.plugins[plugin];
            }
        });

        function setDefaultTabSize(w, h, tabs) {
            tabs.forEach(function (tab) {
                tab.on('Focus', function () {
                    highed.dom.style(parent, { width: 600 + 'px', height: 600 + 'px' });
                    tab.resize(600 - 10, 600 - 10);
                });
            });
        }

        function updateOptions() {
            if (!properties.options.csv) {
                csvTab.hide();
            }

            if (!properties.options.export) {
                exportTab.hide();
            }

            // Always disable json options..

            // eslint-disable-next-line no-self-compare
            if (1 === 1 || !properties.options.json) {
                jsonTab.hide();
            }

            if (
                Object.keys(properties.plugins).length === 0 ||
        !properties.options.plugins
            ) {
                webTab.hide();
            }

            if (!properties.options.samples) {
                samplesTab.hide();
            }

            tabs.selectFirst();
        }

        function buildWebTab() {
            Object.keys(webImports).forEach(function (name) {
                if (!properties.plugins[name]) {
                    return;
                }

                function buildBody() {
                    var options = webImports[name],
                        url = highed.dom.cr('input', 'highed-imp-input-stretch'),
                        urlTitle = highed.dom.cr('div', '', 'URL'),
                        importBtn = highed.dom.cr(
                            'button',
                            'highed-imp-button',
                            'Import ' + name + ' from URL'
                        ),
                        dynamicOptionsContainer = highed.dom.cr(
                            'table',
                            'highed-customizer-table'
                        ),
                        dynamicOptions = {};

                    url.value = options.defaultURL || '';

                    Object.keys(options.options || {}).forEach(function (name) {
                        dynamicOptions[name] = options.options[name].default;

                        highed.dom.ap(
                            dynamicOptionsContainer,
                            highed.InspectorField(
                                options.options[name].type,
                                options.options[name].default,
                                {
                                    title: options.options[name].label
                                },
                                function (nval) {
                                    dynamicOptions[name] = nval;
                                },
                                true
                            )
                        );
                    });

                    if (options.surpressURL) {
                        highed.dom.style([url, urlTitle], {
                            display: 'none'
                        });
                    }

                    url.placeholder = 'Enter URL';

                    highed.dom.on(importBtn, 'click', function () {
                        highed.snackBar('Importing ' + name + ' data');

                        if (highed.isFn(options.request)) {
                            return options.request(url.value, dynamicOptions, function (
                                err,
                                chartProperties
                            ) {
                                if (err) {
                                    return highed.snackBar('import error: ' + err);
                                }
                                events.emit(
                                    'ImportChartSettings',
                                    chartProperties,
                                    options.newFormat
                                );
                            });
                        }

                        highed.ajax({
                            url: url.value,
                            type: 'get',
                            dataType: options.fetchAs || 'text',
                            success: function (val) {
                                options.filter(val, highed.merge({}, dynamicOptions), function (
                                    error,
                                    val
                                ) {
                                    if (error) {
                                        return highed.snackBar('import error: ' + error);
                                    }
                                    if (options.treatAs === 'csv') {
                                        csvTab.focus();
                                        csvPasteArea.value = val;
                                        emitCSVImport(val);
                                    } else {
                                        processJSONImport(val);
                                    }
                                });
                            },
                            error: function (err) {
                                highed.snackBar('import error: ' + err);
                            }
                        });
                    });

                    webSplitter.right.innerHTML = '';

                    highed.dom.ap(
                        webSplitter.right,
                        highed.dom.ap(
                            highed.dom.cr('div', 'highed-plugin-details'),
                            highed.dom.cr(
                                'div',
                                'highed-customizer-table-heading',
                                options.title || name
                            ),
                            highed.dom.cr('div', 'highed-imp-help', options.description),
                            urlTitle,
                            url,
                            Object.keys(options.options || {}).length ?
                                dynamicOptionsContainer :
                                false,
                            highed.dom.cr('br'),
                            importBtn
                        )
                    );
                }

                webList.addItem({
                    id: name,
                    title: webImports[name].title || name,
                    click: buildBody
                });
            });

            webList.selectFirst();
        }

        function buildSampleTab() {
            samplesTab.innerHTML = '';

            highed.samples.each(function (sample) {
                var data = sample.dataset.join('\n'),
                    loadBtn = highed.dom.cr(
                        'button',
                        'highed-box-size highed-imp-button',
                        sample.title
                    );

                highed.dom.style(loadBtn, { width: '99%' });

                highed.dom.on(loadBtn, 'click', function () {
                    emitCSVImport(data);
                    csvPasteArea.value = data;
                    csvTab.focus();
                });

                highed.dom.ap(
                    samplesTab.body,
                    // highed.dom.cr('div', '', name),
                    // highed.dom.cr('br'),
                    loadBtn,
                    highed.dom.cr('br')
                );
            });
        }

        function emitCSVImport(csv, cb) {
            events.emit('ImportCSV', {
                itemDelimiter: delimiter.value,
                firstRowAsNames: firstAsNames.checked,
                dateFormat: dateFormat.value,
                csv: csv || csvPasteArea.value,
                decimalPoint: decimalPoint.value
            }, cb);
        }

        function loadCSVExternal(csv) {
            csvPasteArea.value = csv;
            emitCSVImport();
        }

        function processJSONImport(jsonString) {
            var json = jsonString;
            if (highed.isStr(json)) {
                try {
                    json = JSON.parse(jsonString);
                } catch (e) {
                    highed.snackBar('Error parsing json: ' + e);
                    return false;
                }
            }
            events.emit('ImportJSON', json);
            highed.snackBar('imported json');
        }


        function resize(w, h) {
            var bsize,
                ps = highed.dom.size(parent);

            tabs.resize(w || ps.w, h || ps.h);
            bsize = tabs.barSize();
            webSplitter.resize(w || ps.w, (h || ps.h) - bsize.h - 20);
            webList.resize(w || ps.w, (h || ps.h) - bsize.h);

            exporter.resize(null, 300);
        }


        function show() {
            tabs.show();
        }


        function hide() {
            tabs.hide();
        }

        function addImportTab(tabOptions) {
            var newTab = tabs.createTab({ title: tabOptions.name || 'Features' });

            if (highed.isFn(tabOptions.create)) {
                tabOptions.create(newTab.body);
            }
            if (tabOptions.resize) {
                newTab.on('Focus', function () {
                    highed.dom.style(parent, { width: tabOptions.resize.width + 'px', height: tabOptions.resize.height + 'px' });
                    newTab.resize(tabOptions.resize.width - 10, tabOptions.resize.height - 10);
                });
            }
        }

        function selectTab(index) {
            tabs.select(index);
        }
        // /////////////////////////////////////////////////////////////////////////

        highed.dom.ap(
            exportTab.body,
            commaDelimitedBtn,
            semicolonDelimitedBtn,
            highed.dom.cr('hr', 'highed-imp-hr')
        );


        var exporter = highed.Exporter(exportTab.body);
        exporter.resize(null, 300);

        highed.dom.ap(
            csvTab.body,
            spreadsheetImportBtn,
            liveDataImportBtn,
            csvImportFileBtn,
            highed.dom.cr('hr', 'highed-imp-hr'),
            highed.dom.cr(
                'div',
                'highed-imp-help',
                'Paste CSV into the below box, or upload a file. Click Import to import your data.'
            ),
            csvPasteArea,

            // highed.dom.cr('span', 'highed-imp-label', 'Delimiter'),
            // delimiter,
            // highed.dom.cr('br'),

            // highed.dom.cr('span', 'highed-imp-label', 'Date Format'),
            // dateFormat,
            // highed.dom.cr('br'),

            // highed.dom.cr('span', 'highed-imp-label', 'Decimal Point Notation'),
            // decimalPoint,
            // highed.dom.cr('br'),

            // highed.dom.cr('span', 'highed-imp-label', 'First Row Is Series Names'),
            // firstAsNames,
            // highed.dom.cr('br'),

            csvImportBtn
        );

        highed.dom.ap(
            jsonTab.body,
            highed.dom.cr(
                'div',
                'highed-imp-help',
                'Paste JSON into the below box, or upload a file. Click Import to import your data. <br/><b>The JSON is the data passed to the chart constructor, and may contain any of the valid <a href="https://api.highcharts.com/highcharts/" target="_blank">options</a>.</b>'
            ),
            jsonPasteArea,
            jsonImportFileBtn,
            jsonImportBtn
        );

        highed.dom.on(commaDelimitedBtn, 'click', function () {
            events.emit('ExportComma');
        });

        highed.dom.on(semicolonDelimitedBtn, 'click', function () {
            events.emit('ExportSemiColon');
        });

        highed.dom.on(spreadsheetImportBtn, 'click', function () {
            events.emit('ImportGoogleSpreadsheet');
        });

        highed.dom.on(csvImportBtn, 'click', function () {
            emitCSVImport();
        });

        highed.dom.on(liveDataImportBtn, 'click', function () {
            events.emit('ImportLiveData', {
                //  url: liveDataInput.value
            });
        });

        highed.dom.on(csvPasteArea, 'keyup', function (e) {
            if (e.keyCode === 13 || ((e.metaKey || e.ctrlKey) && e.key === 'z')) {
                emitCSVImport(csvPasteArea.value);
            }
        });

        highed.dom.on(csvImportFileBtn, 'click', function () {
            highed.readLocalFile({
                type: 'text',
                accept: '.csv',
                success: function (info) {
                    csvPasteArea.value = info.data;
                    highed.snackBar('File uploaded');
                    emitCSVImport();
                }
            });
        });

        highed.dom.on(jsonImportBtn, 'click', function () {
            processJSONImport(jsonPasteArea.value);
        });

        highed.dom.on(jsonImportFileBtn, 'click', function () {
            highed.readLocalFile({
                type: 'text',
                accept: '.json',
                success: function (info) {
                    jsonPasteArea.value = info.data;
                    processJSONImport(info.data);
                }
            });
        });

        buildSampleTab();
        buildWebTab();
        updateOptions();

        delimiter.value = ',';
        // dateFormat.value = 'YYYY-mm-dd';
        firstAsNames.type = 'checkbox';
        decimalPoint.value = '.';
        firstAsNames.checked = true;

        // Should hide the web tab if running where cross-origin is an issue

        resize();

        // /////////////////////////////////////////////////////////////////////////

        return {
            on: events.on,
            loadCSV: loadCSVExternal,
            resize: resize,
            show: show,
            hide: hide,
            addImportTab: addImportTab,
            exporter: exporter,
            selectTab: selectTab,
            emitCSVImport: emitCSVImport
        };
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var exportPlugins = {};

    highed.plugins.export = {

        install: function (name, definition) {
            if (highed.isNull(exportPlugins[name])) {
                exportPlugins[name] = highed.merge(
                    {
                        description: '',
                        options: {},
                        title: false,
                        downloadOutput: false
                    },
                    definition
                );

                if (exportPlugins[name].dependencies) {
                    highed.include(exportPlugins[name].dependencies);
                }
            } else {
                highed.log(
                    1,
                    'tried to register an export plugin which already exists:',
                    name
                );
            }
        }
    };


    highed.Exporter = function (parent, attributes) {
        var // splitter = highed.HSplitter(parent, {leftWidth: 50, noOverflow: true}),
            properties = highed.merge(
                {
                    options: 'svg html json plugins',
                    plugins: 'beautify-js beautify-json'
                },
                attributes
            ),
            tctrl = highed.TabControl(parent, false, true),
            htmlTab = tctrl.createTab({ title: 'HTML' }),
            jsonTab = tctrl.createTab({ title: 'JSON' }),
            svgTab = tctrl.createTab({ title: 'SVG' }),
            pluginTab = tctrl.createTab({ title: 'Plugins' }),
            pluginSplitter = highed.HSplitter(pluginTab.body, { leftWidth: 30 }),
            pluginList = highed.List(pluginSplitter.left),
            exportJSON = highed.dom.cr('a', 'highed-imp-button highed-imp-pasted-button', 'Download'), // highed.dom.cr('a', '', 'Download'),
            exportHTML = highed.dom.cr('a', 'highed-imp-button highed-imp-pasted-button', 'Download'),
            exportSVG = highed.dom.cr('a', 'highed-imp-button highed-imp-pasted-button', 'Download'),
            jsonValue = highed.dom.cr(
                'textarea',
                'highed-imp-pastearea highed-scrollbar'
            ),
            htmlValue = highed.dom.cr(
                'textarea',
                'highed-imp-pastearea highed-scrollbar'
            ),
            svgValue = highed.dom.cr(
                'textarea',
                'highed-imp-pastearea highed-scrollbar'
            ),
            currentChartPreview = false,
            hasBuiltPlugins = false,
            hasBeenVisible = false,
            pluginData = {},
            activePlugins = {},
            activePlugin = false;

        properties.options = highed.arrToObj(properties.options);
        properties.plugins = highed.arrToObj(properties.plugins);

        // /////////////////////////////////////////////////////////////////////////

        // Hides unwanted stuff
        function updateOptions() {
            if (!properties.options.html) {
                htmlTab.hide();
            }
            if (!properties.options.json) {
                jsonTab.hide();
            }
            if (!properties.options.svg) {
                svgTab.hide();
            }
            if (!properties.options.plugins) {
                pluginTab.hide();
            }
            if (Object.keys(properties.plugins) === 0) {
                pluginTab.hide();
            }

            tctrl.selectFirst();
        }

        // Build plugin panel
        function buildPlugins() {
            if (hasBuiltPlugins) {
                return;
            }
            hasBuiltPlugins = true;

            Object.keys(exportPlugins).forEach(function (name) {
                var options = exportPlugins[name];

                pluginData[name] = { options: {} };

                if (!properties.plugins[name]) {
                    return false;
                }

                function buildBody() {
                    var container = highed.dom.cr('div', 'highed-plugin-details'),
                        executeBtn = highed.dom.cr(
                            'button',
                            'highed-imp-button',
                            options.exportTitle || 'Export'
                        ),
                        dynamicOptionsContainer = highed.dom.cr(
                            'table',
                            'highed-customizer-table'
                        ),
                        additionalUI = highed.dom.cr('div'),
                        dynamicOptions = pluginData[name].options;

                    // pluginSplitter.right.innerHTML = '';

                    Object.keys(options.options || {}).forEach(function (pname) {
                        dynamicOptions[pname] = options.options[pname].default;

                        highed.dom.ap(
                            dynamicOptionsContainer,
                            highed.InspectorField(
                                options.options[pname].type,
                                options.options[pname].default,
                                {
                                    title: options.options[pname].label
                                },
                                function (nval) {
                                    dynamicOptions[pname] = nval;

                                    if (highed.isFn(options.show)) {
                                        options.show.apply(pluginData[name], [currentChartPreview]);
                                    }
                                },
                                true
                            )
                        );
                    });

                    function doExport() {
                        if (highed.isFn(options.export) && currentChartPreview) {
                            options.export.apply(pluginData[name], [
                                dynamicOptions,
                                currentChartPreview,
                                function (err, data, filename) {
                                    if (err) {
                                        return highed.snackBar('Export error: ' + err);
                                    }

                                    if (options.downloadOutput) {
                                        highed.download(filename, data);
                                    }

                                    highed.snackBar((options.title || name) + ' export complete');
                                },
                                additionalUI
                            ]);
                        }
                    }

                    highed.dom.on(executeBtn, 'click', doExport);

                    highed.dom.ap(pluginSplitter.right, container);

                    highed.dom.style(container, { display: 'none' });

                    highed.dom.ap(
                        container,
                        highed.dom.cr(
                            'div',
                            'highed-customizer-table-heading',
                            options.title || name
                        ),
                        highed.dom.cr('div', 'highed-imp-help', options.description),
                        Object.keys(options.options || {}).length ?
                            dynamicOptionsContainer :
                            false,
                        additionalUI,
                        options.export ? executeBtn : false
                    );

                    if (highed.isFn(options.create)) {
                        options.create.apply(pluginData[name], [
                            currentChartPreview,
                            additionalUI
                        ]);
                    }

                    activePlugins[name] = {
                        export: doExport,
                        show: function () {
                            if (activePlugin) {
                                activePlugin.hide();
                            }
                            highed.dom.style(container, { display: '' });
                            options.show.apply(pluginData[name], [currentChartPreview]);
                            activePlugin = activePlugins[name];
                        },
                        hide: function () {
                            highed.dom.style(container, { display: 'none' });
                        }
                    };
                }

                buildBody();

                pluginList.addItem({
                    id: name,
                    title: options.title || name,
                    click: activePlugins[name].show
                });
            });
        }


        function init(chartData, chartHTML, chartSVG, chartPreview) {
            var title = '_export';

            if (chartData.title && chartData.title.text) {
                title = chartData.title.text.replace(/\s/g, '_') + title;
            } else {
                title = 'untitled' + title;
            }

            jsonValue.value = JSON.stringify(chartData);
            exportJSON.href = 'data:application/octet-stream,' + encodeURIComponent(jsonValue.value);

            htmlValue.value = chartHTML;
            exportHTML.href =
        'data:application/octet-stream,' + encodeURIComponent(chartHTML);

            svgValue.value = chartSVG;
            exportSVG.href =
        'data:application/octet-stream,' + encodeURIComponent(chartSVG);

            exportJSON.download = title + '.json';
            exportHTML.download = title + '.html';
            exportSVG.download = title + '.svg';

            highed.dom.on(exportJSON, 'click', function () {
                highed.events('UIAction', 'BtnDownloadJSON');
            });

            highed.dom.on(exportHTML, 'click', function () {
                highed.events('UIAction', 'BtnDownloadHTML');
            });

            highed.dom.on(exportSVG, 'click', function () {
                highed.events('UIAction', 'BtnDownloadSVG');
            });

            currentChartPreview = chartPreview;

            buildPlugins();

            // Object.keys(activePlugins).forEach(function (name) {
            //     activePlugins[name].show();
            // });

            if (activePlugin) {
                activePlugin.show();
            }

            hasBeenVisible = true;
        }


        function resize(w, h) {
            var bsize;

            // splitter.resize(w, h);
            tctrl.resize(w, h);
            bsize = tctrl.barSize();

            pluginSplitter.resize(w, h - bsize.h - 20);
            pluginList.resize(w, h - bsize.h);
        }

        function doSelectOnClick(thing, id) {
            highed.dom.on(thing, 'click', function () {
                thing.focus();
                thing.select();
                highed.emit('UIAction', 'Copy' + id);
            });
        }

        // /////////////////////////////////////////////////////////////////////////

        highed.dom.ap(
            htmlTab.body,
            // highed.dom.cr('div', 'highed-imp-headline', 'Export HTML'),
            highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'), htmlValue),
            exportHTML
        );

        highed.dom.ap(
            jsonTab.body,
            // highed.dom.cr('div', 'highed-imp-headline', 'Export JSON'),
            highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'), jsonValue),
            exportJSON
        );

        highed.dom.ap(
            svgTab.body,
            // highed.dom.cr('div', 'highed-imp-headline', 'Export JSON'),
            highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'), svgValue),
            exportSVG
        );

        resize();
        updateOptions();

        doSelectOnClick(jsonValue, 'JSON');
        doSelectOnClick(htmlValue, 'HTML');
        doSelectOnClick(svgValue, 'SVG');

        // /////////////////////////////////////////////////////////////////////////

        return {
            init: init,
            resize: resize,
            buildPluginUI: buildPlugins
        };
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

highed.ChartPreview = function (parent, attributes) {
    var properties = highed.merge(
            {
                defaultChartOptions: {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: 'Chart Title'
                    },
                    scrolling: {
                        enabled: false
                    },
                    subtitle: {
                        text: ''
                    },
                    exporting: {
                        //   url: 'https://127.0.0.1:7801'
                    }
                },
                expandTo: parent
            },
            attributes
        ),
        events = highed.events(),
        customizedOptions = {},
        aggregatedOptions = {},
        flatOptions = {},
        templateOptions = [],
        chartOptions = {},
        themeOptions = {},
        themeCustomCode = '',
        themeMeta = {},
        exports = {},
        chartPlugins = {},
        customCodeDefault = [
            '/*',
            '// Sample of extending options:',
            'Highcharts.merge(true, options, {',
            '    chart: {',
            '        backgroundColor: "#bada55"',
            '    },',
            '    plotOptions: {',
            '        series: {',
            '            cursor: "pointer",',
            '            events: {',
            '                click: function(event) {',
            '                    alert(this.name + " clicked\\n" +',
            '                          "Alt: " + event.altKey + "\\n" +',
            '                          "Control: " + event.ctrlKey + "\\n" +',
            '                          "Shift: " + event.shiftKey + "\\n");',
            '                }',
            '            }',
            '        }',
            '    }',
            '});',
            '*/'
        ].join('\n'),
        customCode = '',
        customCodeStr = '',
        lastLoadedCSV = false,
        lastLoadedSheet = false,
        lastLoadedLiveData = false,
        throttleTimeout = false,
        chart = false,
        preExpandSize = false,
        dataTableCSV = null,
        assignDataFields = null,
        templateSettings = {},
        toggleButton = highed.dom.cr(
            'div',
            'highed-icon highed-chart-preview-expand fa fa-external-link-square'
        ),
        expanded = false,
        constr = ['Chart'],
        wysiwyg = {
            'g.highcharts-legend': { tab: 'Legend', dropdown: 'General', id: 'legend--enabled' },
            'text.highcharts-title': { tab: 'Chart',  dropdown: 'Title', id: 'title--text' },
            'text.highcharts-subtitle': { tab: 'Chart', dropdown: 'Title', id: 'subtitle--text' },
            '.highcharts-yaxis-labels': { tab: 'Axes', dropdown: 'Y Axis', id: 'yAxis-labels--format' },
            '.highcharts-xaxis-labels': { tab: 'Axes', dropdown: 'X Axis', id: 'xAxis-labels--format' },
            '.highcharts-xaxis .highcharts-axis-title': {
                tab: 'Axes',
                dropdown: 'X Axis',
                id: 'xAxis-title--text'
            },
            '.highcharts-yaxis .highcharts-axis-title': {
                tab: 'Axes',
                dropdown: 'Y Axis',
                id: 'yAxis-title--text'
            },
            'rect.highcharts-background': {
                tab: 'Chart',
                dropdown: 'Appearance',
                id: 'chart--backgroundColor'
            },
            '.highcharts-series': { tab: 'Data series', id: 'series' },
            'g.highcharts-tooltip': { tab: 'Chart', dropdown: 'Tooltip', id: 'tooltip--enabled' }
        },
        isAnnotating = false,
        annotationType = false;

    // /////////////////////////////////////////////////////////////////////////

    function attachWYSIWYG() {

        Object.keys(wysiwyg).forEach(function (key) {
            highed.dom.on(parent.querySelector(key), 'click', function (e) {
                if (isAnnotating) {
                    return;
                }
                events.emit('RequestEdit', wysiwyg[key], e.clientX, e.clientY);
                e.cancelBubble = true;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            });
        });
    }

    function stringifyFn(obj, tabs) {
        return JSON.stringify(
            obj,
            function (key, value) {
                if (highed.isFn(value)) {
                    return value.toString();
                }

                return value;
            },
            tabs
        );
    }

    /* Get the chart if it's initied */
    function gc(fn) {
        if (highed.isFn(fn)) {
            if (chart !== false) {
                return fn(chart);
            }
            return fn(init());
        }
        return false;
    }

    /* Emit change events */
    function emitChange() {
        events.emit('ChartChange', aggregatedOptions);

        // Throttled event - we use this when doing server stuff in the handler
        // since e.g. using the color picker can result in quite a lot of updates
        // within a short amount of time
        window.clearTimeout(throttleTimeout);
        throttleTimeout = window.setTimeout(function () {
            events.emit('ChartChangeLately', aggregatedOptions);
        }, 200);
    }

    function addShape(chart, type, x, y) {
        var options = {
            id: 'shape_' + customizedOptions.annotations.length, // customizedOptions.annotations[0].shapes.length,
            type: type,
            point: {
                x: x,
                y: y,
                xAxis: 0,
                yAxis: 0
            },
            x: 0,
            y: 0
        };

        if (type === 'circle') {
            options.r = 10;
        } else if (type === 'rect') {
            options.width = 20;
            options.height = 20;
            options.x = -10;
            options.y = -10;
        }


        var annotation = chart.addAnnotation({
            id: 'shape_' + customizedOptions.annotations.length, // customizedOptions.annotations[0].shapes.length,
            shapes: [options],
            type: type
        });

        // eslint-disable-next-line no-redeclare
        var annotation = chart.addAnnotation({
            id: 'shape_' + customizedOptions.annotations.length, // customizedOptions.annotations[0].shapes.length,
            shapes: [options],
            type: type
        });

        customizedOptions.annotations.push({
            id: 'shape_' + customizedOptions.annotations.length,
            shapes: [annotation.options.shapes[0]]
        });
    // customizedOptions.annotations[0].shapes.push(annotation.options.shapes[0]);
    }

    /* Init the chart */
    function init(options, pnode, noAnimation) {
        var i;

        // We want to work on a copy..
        options = options || aggregatedOptions;

        if (highed.isArr(constr)) {
            // eslint-disable-next-line no-self-assign
            constr = constr;
        } else {
            constr = ['Chart'];
        }

        // options = highed.merge({}, options || aggregatedOptions);

        // if (aggregatedOptions && aggregatedOptions.series) {
        //     options = aggregatedOptions.series;
        // }

        if (noAnimation) {
            highed.setAttr(options, 'plotOptions--series--animation', false);
        }

        if (typeof window.Highcharts === 'undefined') {
            highed.snackBar('Highcharts.JS must be included to use the editor');
            return;
        }

        // (pnode || parent).innerHTML = 'Chart not loaded yet';

        // options.chart = options.chart || {};
        // options.chart.width = '100%';
        // options.chart.height = '100%';

        // if (options && options.chart) {
        //   delete options.chart.width;
        //   delete options.chart.height;
        // }


        if (chart && chart.annotations) {
            var annotations = chart.annotations || [];
            // eslint-disable-next-line no-redeclare
            for (var i = annotations.length - 1; i > -1; --i) {
                if (annotations[i].options) {
                    chart.removeAnnotation(annotations[i].options.id);
                }
            }
            chart.annotations.length = 0;
        }

        try {
            const chartConstr = (constr.some(function (a) {
                return a === 'StockChart';
            }) ? 'StockChart' : 'Chart');

            chart = new Highcharts[chartConstr](pnode || parent, options);

            // This is super ugly.
            // customizedOptions.series = customizedOptions.series || [];
            //  customizedOptions.series = chart.options.series || [];
            // highed.merge(customizedOptions.series, chart.options.series);
            // updateAggregated();

            if (chart && chart.options) {
                highed.clearObj(chartOptions);
                highed.merge(chartOptions, chart.options);
            }

            attachWYSIWYG();

            if (chart && chart.reflow) {
                // chart.reflow();
            }

            Highcharts.error = function (code, stopLoading) {
                if (stopLoading) {
                    throw code;
                } else {
                    setTimeout(function () {
                        events.emit('Error', {
                            code: code,
                            url: (code ? 'https://www.highcharts.com/errors/' + code : ''),
                            warning: true
                        });
                    }, 200);
                }
            };

            // eslint-disable-next-line no-inner-declarations
            function setupAnnotationEvents(eventName, type) {
                Highcharts.wrap(Highcharts.Annotation.prototype, eventName, function (proceed, shapeOptions) {
                    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                    var annotation = this[type][this[type].length - 1];

                    (annotation.element).addEventListener('click', function (e) {
                        highed.dom.nodefault(e);
                        if (isAnnotating && annotationType === 'delete') {
                            var optionIndex = customizedOptions.annotations.findIndex(function (element) {
                                return element.id === annotation.options.id;
                            });

                            chart.removeAnnotation(annotation.options.id);
                            customizedOptions.annotations.splice(optionIndex, 1);

                        }
                    });

                    (annotation.element).addEventListener('mousedown', function (e) {
                        if (!chart.activeAnnotation && (isAnnotating && annotationType === 'drag')) {
                            if (type === 'shapes') {
                                chart.activeAnnotationOptions = highed.merge({}, annotation.options);
                                if (annotation.type === 'rect') {
                                    chart.activeAnnotationOptions.width = 20;
                                    chart.activeAnnotationOptions.height = 20;
                                }
                            } else {
                                chart.activeAnnotationOptions = {
                                    id: annotation.options.id,
                                    text: annotation.options.text,
                                    point: {
                                        x: annotation.options.point.x,
                                        y: annotation.options.point.y,
                                        xAxis: 0,
                                        yAxis: 0
                                    },
                                    backgroundColor: annotation.options.backgroundColor,
                                    shape: annotation.options.shape,
                                    borderWidth: annotation.options.borderWidth,
                                    x: 0,
                                    y: 0
                                };
                            }
                            annotation.id = annotation.options.id;
                            chart.activeAnnotation = annotation;
                            chart.annotationType = type;
                        }
                    });
                });
            }

            setupAnnotationEvents('initLabel', 'labels');
            setupAnnotationEvents('initShape', 'shapes');


            Highcharts.addEvent(document, 'mousemove', function (e) {
                if (!chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
                    return;
                }

                if (chart.activeAnnotationOptions && (isAnnotating && annotationType === 'drag')) {
                    var s = chart.pointer.normalize(e),
                        prevOptions = chart.activeAnnotationOptions,
                        prevAnn = chart.activeAnnotation;

                    prevOptions.point.x = chart.xAxis[0].toValue(s.chartX);
                    prevOptions.point.y = chart.yAxis[0].toValue(s.chartY);

                    if (prevAnn && prevAnn.id) {
                        chart.removeAnnotation(prevAnn.id);
                    }

                    var newAnnotation;
                    if (chart.annotationType === 'shapes') {
                        newAnnotation = chart.addAnnotation({
                            id: prevOptions.id,
                            shapes: [prevOptions]
                        });
                    } else {
                        newAnnotation = chart.addAnnotation({
                            id: prevOptions.id,
                            labels: [prevOptions]
                        });
                    }
                    newAnnotation.id = prevOptions.id;
                    chart.activeAnnotation = newAnnotation;
                }
            });

            Highcharts.addEvent(document, 'mouseup', function (e) {
                if (chart.activeAnnotation && (isAnnotating && annotationType === 'drag')) {

                    chart.removeAnnotation(chart.activeAnnotationOptions.id);

                    if (chart.annotationType === 'shapes') {

                        chart.activeAnnotation = chart.addAnnotation({
                            id: chart.activeAnnotationOptions.id,
                            shapes: [chart.activeAnnotationOptions]
                        });

                        customizedOptions.annotations.some(function (ann) {
                            if (ann.shapes && ann.shapes[0].id === chart.activeAnnotationOptions.id) {
                                ann.shapes[0].point.x = chart.activeAnnotation.options.shapes[0].point.x;
                                ann.shapes[0].point.y = chart.activeAnnotation.options.shapes[0].point.y;
                                return true;
                            }
                        });

                    } else {
                        chart.activeAnnotation = chart.addAnnotation({
                            id: chart.activeAnnotationOptions.id,
                            labels: [chart.activeAnnotationOptions]
                        });

                        customizedOptions.annotations.some(function (ann) {
                            if (ann.labels && ann.labels[0].id === chart.activeAnnotationOptions.id) {
                                ann.labels[0].point.x = chart.activeAnnotation.options.labels[0].point.x;
                                ann.labels[0].point.y = chart.activeAnnotation.options.labels[0].point.y;
                                return true;
                            }
                        });
                    }
                    chart.activeAnnotation = null;
                    chart.activeAnnotationOptions = null;
                    chart.annotationType = null;
                }
            });

            Highcharts.addEvent(chart, 'click', function (e) {
                if (isAnnotating) {
                    // events.emit('SetAnnotate', e);

                    if (!customizedOptions.annotations) {
                        customizedOptions.annotations = [];
                    } // [{}];
                    // if (!customizedOptions.annotations[0].shapes) customizedOptions.annotations[0].shapes = [];

                    if (annotationType === 'label') {
                        events.emit('ShowTextDialog', this, e.xAxis[0].value, e.yAxis[0].value);
                    } else if (annotationType === 'delete' || annotationType === 'drag') {
                        // nothing
                    } else {
                        addShape(this, annotationType, e.xAxis[0].value, e.yAxis[0].value);
                    }
                }
            });

            Highcharts.addEvent(chart, 'afterPrint', function () {
                events.emit('RequestResize');
                // highed.dom.ap(pnode || parent, toggleButton);
            });

            events.emit('ChartRecreated');
        } catch (code) {
            events.emit('Error', {
                code: code,
                url: (code ? 'https://www.highcharts.com/errors/' + code : '')
            });

            highed.emit('UIAction', 'UnsuccessfulChartGeneration');

            (pnode || parent).innerHTML = '';

            chart = false;
        }

        return chart;
    }


    function resize(width, height) {
        gc(function (chart) {

            if (chart && chart.reflow) {
                // && chart.options) {
                try {
                    if (width && height) {
                        chart.setSize(width, height, true);
                        chart.options.chart.width = null;
                        chart.options.chart.height = null;
                    } else {
                        chart.setSize(undefined, undefined, false);
                        chart.reflow();
                    }
                } catch (e) {
                    // No idea why this keeps failing
                }
            }
        });
    }


    function clearTheme(theme, skipEmit) {
        themeOptions = false;

        if (!skipEmit) {
            updateAggregated();
            init(aggregatedOptions);
            emitChange();
            events.emit('SetResizeData');
        }

        return true;
    }

    function assignTheme(theme, skipEmit) {
        if (highed.isStr(theme)) {
            return assignTheme(JSON.parse(theme));
        }
        themeMeta = {};

        if (highed.isBasic(theme) || highed.isArr(theme)) {
            return false;
        }

        if (Object.keys(theme).length === 0) {
            return false;
        }

        if (theme && theme.options && theme.id) {
            // Assume that this uses the new format
            themeMeta = {
                id: theme.id,
                name: theme.name || theme.id
            };

            themeOptions = highed.merge({}, theme.options);
            themeCustomCode = theme.customCode || '';
        } else {
            themeMeta = {
                id: highed.uuid(),
                name: 'Untitled Theme'
            };

            themeOptions = highed.merge({}, theme);
        }

        if (!skipEmit) {
            events.emit('UpdateCustomCode');
            updateAggregated();
            init(aggregatedOptions);
            emitChange();
            events.emit('SetResizeData');
        }

        return true;
    }

    function updateAggregated(noCustomCode) {
    // customizedOptions.plotOptions = customizedOptions.plotOptions || {};
    // customizedOptions.plotOptions.series = customizedOptions.plotOptions.series || [];
    //  customizedOptions.series = customizedOptions.series || [];

        if (
            customizedOptions &&
      !highed.isArr(customizedOptions.yAxis) &&
      customizedOptions.yAxis
        ) {
            customizedOptions.yAxis = [customizedOptions.yAxis || {}];
        }

        if (
            customizedOptions &&
      !highed.isArr(customizedOptions.xAxis) &&
      customizedOptions.xAxis
        ) {
            customizedOptions.xAxis = [customizedOptions.xAxis || {}];
        }

        // templateOptions = templateOptions || {};
        templateOptions = templateOptions || [];
        var aggregatedTemplate = {};


        // Merge fest

        highed.clearObj(aggregatedOptions);

        highed.merge(aggregatedOptions, properties.defaultChartOptions);

        // Apply theme first
        if (themeOptions && Object.keys(themeOptions).length) {
            highed.merge(
                aggregatedOptions,
                highed.merge(highed.merge({}, themeOptions))
            );
        }

        templateOptions.forEach(function (arr) {
            if (arr) {
                if (arr.yAxis && !highed.isArr(arr.yAxis)) {
                    arr.yAxis = [arr.yAxis];
                }

                if (arr.xAxis && !highed.isArr(arr.xAxis)) {
                    arr.xAxis = [arr.xAxis];
                }

                aggregatedTemplate = highed.merge(aggregatedTemplate, arr);
            }
        });

        highed.merge(
            aggregatedOptions,
            highed.merge(highed.merge({}, aggregatedTemplate), customizedOptions)
        );

        if (!aggregatedOptions.yAxis && customizedOptions.yAxis) {
            aggregatedOptions.yAxis = customizedOptions.yAxis;
        }

        if (!aggregatedOptions.xAxis && customizedOptions.xAxis) {
            aggregatedOptions.xAxis = customizedOptions.xAxis;
        }

        // This needs to be cleaned up
        if (aggregatedOptions.yAxis && aggregatedTemplate.yAxis) {
            aggregatedOptions.yAxis.forEach(function (obj, i) {
                if (i < aggregatedTemplate.yAxis.length) {
                    highed.merge(obj, aggregatedTemplate.yAxis[i]);
                }
            });
        }

        if (aggregatedOptions.xAxis && aggregatedTemplate.xAxis && highed.isArr(aggregatedOptions.xAxis)) {
            (aggregatedOptions.xAxis).forEach(function (obj, i) {
                if (i < aggregatedTemplate.xAxis.length) {
                    highed.merge(obj, aggregatedTemplate.xAxis[i]);
                }
            });
        }

        if (themeOptions && themeOptions.xAxis) {
            themeOptions.xAxis = highed.isArr(themeOptions.xAxis) ?
                themeOptions.xAxis :
                [themeOptions.xAxis];

            if (highed.isArr(aggregatedOptions.xAxis)) {
                (aggregatedOptions.xAxis).forEach(function (obj, i) {
                    if (i < themeOptions.xAxis.length) {
                        highed.merge(obj, themeOptions.xAxis[i]);
                    }
                });
            }
        }

        if (themeOptions && themeOptions.yAxis) {
            themeOptions.yAxis = highed.isArr(themeOptions.yAxis) ?
                themeOptions.yAxis :
                [themeOptions.yAxis];

            if (highed.isArr(aggregatedOptions.yAxis)) {
                aggregatedOptions.yAxis.forEach(function (obj, i) {
                    if (i < themeOptions.yAxis.length) {
                        highed.merge(obj, themeOptions.yAxis[i]);
                    }
                });
            }
        }

        // Temporary hack
        // aggregatedOptions.series = customizedOptions.series;\
        aggregatedOptions.series = [];
        if (highed.isArr(customizedOptions.series)) {
            customizedOptions.series.forEach(function (obj, i) {
                var mergeTarget = {};

                if (themeOptions && highed.isArr(themeOptions.series)) {
                    if (i < themeOptions.series.length) {
                        mergeTarget = highed.merge({}, themeOptions.series[i]);
                    }
                }

                aggregatedOptions.series.push(highed.merge(mergeTarget, obj));
            });
        }

        if (aggregatedTemplate.series) {
            aggregatedOptions.series = aggregatedOptions.series || [];

            aggregatedTemplate.series.forEach(function (obj, i) {
                if (i < aggregatedOptions.series.length) {
                    highed.merge(aggregatedOptions.series[i], obj);
                } else {
                    aggregatedOptions.series.push(highed.merge({}, obj));
                }
            });
        }

        highed.merge(
            aggregatedOptions,
            highed.merge({}, customizedOptions)
        );


        if (themeOptions && themeOptions.series) {
            if (aggregatedOptions.series) {
                aggregatedOptions.series.forEach(function (serie, i) {
                    if (!serie.type && themeOptions.series[i] && themeOptions.series[i].type) {
                        serie.type = themeOptions.series[i].type;
                    }
                });
            }
        }


        if (aggregatedOptions.yAxis && !highed.isArr(aggregatedOptions.yAxis)) {
            aggregatedOptions.yAxis = [aggregatedOptions.yAxis];
        }

        if (aggregatedOptions.xAxis && !highed.isArr(aggregatedOptions.xAxis)) {
            aggregatedOptions.xAxis = [aggregatedOptions.xAxis];
        }

        highed.merge(aggregatedOptions, highed.option('stickyChartProperties'));

        // Finally, do custom code
        if (!noCustomCode && highed.isFn(customCode)) {
            customCode(aggregatedOptions);
        }

    }


    function deleteSeries(length) {
        if (customizedOptions && customizedOptions.series) {
            customizedOptions.series = customizedOptions.series.slice(0, length);
            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        }
    }

    function deleteSerie(index) {

        if (customizedOptions.series && customizedOptions.series[index]) {
            customizedOptions.series.splice(index, 1);
            delete templateSettings[index];
        }

        updateAggregated();
        init(aggregatedOptions);
    }

    function loadTemplateForSerie(template, seriesIndex) {
        const type = template.config.chart.type;
        delete template.config.chart.type;

        constr[seriesIndex] = template.constructor || 'Chart';

        seriesIndex.forEach(function (index) {

            if (!templateSettings[index]) {
                templateSettings[index] = {};
            }

            templateSettings[index].templateTitle = template.title;
            templateSettings[index].templateHeader = template.header;

            if (customizedOptions.series[index]) {
                customizedOptions.series[index].type = type; // template.config.chart.type;
            } else {
                customizedOptions.series[index] = {
                    type: type, // template.config.chart.type,
                    turboThreshold: 0,
                    _colorIndex: customizedOptions.series.length,
                    _symbolIndex: 0,
                    compare: undefined
                };
            }
        });

        // templateOptions = highed.merge({}, template.config || {});
        templateOptions[seriesIndex] = highed.merge({}, template.config || {});

        updateAggregated();
        init(aggregatedOptions);
        // loadSeries();
        emitChange();
    }


    function loadTemplate(template) {
        if (!template || !template.config) {
            return highed.log(
                1,
                'chart preview: templates must be an object {config: {...}}'
            );
        }

        constr = [template.constructor || 'Chart'];

        // highed.clearObj(templateOptions);

        if (customizedOptions.xAxis) {
            delete customizedOptions.xAxis;
        }

        if (customizedOptions.yAxis) {
            delete customizedOptions.yAxis;
        }

        // highed.setAttr(customizedOptions, 'series', []);
        gc(function (chart) {
            // templateOptions = highed.merge({}, template.config || {});

            templateOptions = [highed.merge({}, template.config || {})];

            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        });
    }


    function loadSeriesFromDataSource() {
        if (
            !gc(function (chart) {
                if (chart.options && chart.options.series) {
                    customizedOptions.series = chart.options.series;
                }
                return true;
            })
        ) {
            customizedOptions.series = [];
        }
        updateAggregated();
    }

    function loadSeries() { /*
    if (
      !gc(function(chart) {
        if (chart.options && chart.options.series) {
          customizedOptions.series = chart.options.series;
        }
        return true;
      })
    ) {
      customizedOptions.series = [];
    }
    updateAggregated();*/
    }


    function loadCSVData(data, emitLoadSignal, bypassClearSeries, cb) {
        var mergedExisting = false,
            seriesClones = [];
        if (!data || !data.csv) {
            if (highed.isStr(data)) {
                data = {
                    csv: data
                    // itemDelimiter: ';',
                };
            } else {
                return highed.log(1, 'chart load csv: data.csv is required');
            }
        }

        lastLoadedCSV = data.csv;
        lastLoadedSheet = false;
        lastLoadedLiveData = false;
        gc(function (chart) {
            var axis;

            // highed.setAttr(customizedOptions, 'series', []);
            // highed.setAttr(aggregatedOptions, 'series', []);

            // highed.setAttr(customizedOptions, 'plotOptions--series--animation', true);
            // highed.setAttr(customizedOptions, 'data--csv', data.csv);
            // highed.setAttr(customizedOptions, 'data--googleSpreadsheetKey', undefined);
            // highed.setAttr(customizedOptions, 'data--itemDelimiter', data.itemDelimiter);
            // highed.setAttr(customizedOptions, 'data--firstRowAsNames', data.firstRowAsNames);
            // highed.setAttr(customizedOptions, 'data--dateFormat', data.dateFormat);
            // highed.setAttr(customizedOptions, 'data--decimalPoint', data.decimalPoint);

            if (customizedOptions && customizedOptions.series) {
                (highed.isArr(customizedOptions.series) ?
                    customizedOptions.series :
                    [customizedOptions.series]
                ).forEach(function (series) {
                    seriesClones.push(
                        highed.merge({}, series, false, {
                            data: 1,
                            name: 1
                        })
                    );
                });
            }

            customizedOptions.series = [];

            if (customizedOptions.xAxis) {
                (highed.isArr(customizedOptions.xAxis) ?
                    customizedOptions.xAxis :
                    [customizedOptions.xAxis]
                ).forEach(function (axis) {
                    if (axis.categories) {
                        axis.categories = [];
                    }
                });
            }

            if (customizedOptions.yAxis) {
                (highed.isArr(customizedOptions.yAxis) ?
                    customizedOptions.yAxis :
                    [customizedOptions.yAxis]
                ).forEach(function (axis) {
                    if (axis.categories) {
                        axis.categories = [];
                    }
                });
            }

            highed.merge(customizedOptions, {
                plotOptions: {
                    series: {
                        animation: false
                    }
                },
                data: {
                    csv: data.csv,
                    itemDelimiter: data.itemDelimiter,
                    firstRowAsNames: data.firstRowAsNames,
                    dateFormat: data.dateFormat,
                    decimalPoint: data.decimalPoint,
                    googleSpreadsheetKey: undefined,
                    url: data.url
                }
            });

            updateAggregated();

            init(aggregatedOptions);
            loadSeries();
            emitChange();

            if (highed.isArr(seriesClones)) {
                (seriesClones || []).forEach(function (series, i) {
                    mergedExisting = true;
                    if (!customizedOptions.series[i]) {
                        addBlankSeries(i);
                    }
                    highed.merge(customizedOptions.series[i], series);
                });
            }

            if (mergedExisting) {
                updateAggregated();
                init(aggregatedOptions);
                loadSeries();
                emitChange();
            }

            if (emitLoadSignal) {
                events.emit('LoadProjectData', data.csv);
            }

            if (cb) {
                cb();
            }

        });

    // setTimeout(function () {
    // gc(function (chart) {
    //   if (chart && highed.isArr(chart.xAxis) && chart.xAxis.length > 0) {
    //     customizedOptions.xAxis = customizedOptions.xAxis || [];
    //     chart.xAxis.forEach(function (a, i) {
    //       customizedOptions.xAxis[i] = customizedOptions.xAxis[i] || {};
    //       if (a.isDatetimeAxis) {
    //         customizedOptions.xAxis[i].type = 'datetime';
    //       } else if (a.categories) {
    //         customizedOptions.xAxis[i].type = 'categories';
    //       } else {
    //         // customizedOptions.xAxis[i].type = 'linear';
    //       }
    //     });
    //   }
    //   console.log(chart);
    // });
    // }, 1000);
    }


    function loadProject(projectData) {
        var hasData = false,
            htmlEntities = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>'
            };

        highed.emit('UIAction', 'LoadProject');

        lastLoadedCSV = false;
        lastLoadedSheet = false;
        lastLoadedLiveData = false;

        if (highed.isStr(projectData)) {
            try {
                return loadProject(JSON.parse(projectData));
            } catch (e) {
                highed.snackBar('Invalid project');
            }
        }

        if (projectData) {
            templateOptions = [{}];
            if (projectData.template) {
                if (highed.isArr(projectData.template)) {
                    templateOptions = projectData.template;
                } else {
                    templateOptions = [projectData.template];
                }
            }

            customizedOptions = {};
            if (projectData.options) {
                customizedOptions = projectData.options;
            }

            // highed.merge(customizedOptions, {
            //   data: {
            //     csv: undefined
            //   }
            // });

            // if (customizedOptions && customizedOptions.data) {
            //   customizedOptions.data.csv = undefined;
            // }

            if (customizedOptions.lang) {
                Highcharts.setOptions({
                    lang: customizedOptions.lang
                });
            }

            if (typeof projectData.theme !== 'undefined') {
                assignTheme(projectData.theme, true);
            }

            if (customizedOptions && customizedOptions.series) {
                customizedOptions.series = highed.isArr(customizedOptions.series) ?
                    customizedOptions.series :
                    [customizedOptions.series];

                customizedOptions.series.forEach(function (series) {
                    // eslint-disable-next-line no-underscore-dangle
                    if (typeof series._colorIndex !== 'undefined') {
                        // eslint-disable-next-line no-underscore-dangle
                        delete series._colorIndex;
                    }
                });
            }

            setCustomCode(
                projectData.customCode,
                function (err) {
                    highed.snackBar('Error in custom code: ' + err);
                },
                true
            );

            events.emit('LoadCustomCode');

            constr = ['Chart'];

            // Support legacy format
            if (projectData.settings && projectData.settings.templateView) {
                if (projectData.settings.templateView.activeSection === 'stock') {
                    constr = ['StockChart'];
                }
            }

            if (projectData.settings && projectData.settings.template) {
                templateSettings = projectData.settings.template;
            }

            if (projectData.settings && projectData.settings.plugins) {
                chartPlugins = projectData.settings.plugins;
            }

            if (
                projectData.settings &&
        highed.isStr(projectData.settings.constructor)
            ) {
                constr = [projectData.settings.constructor];
            }

            if (
                projectData.settings &&
        highed.isArr(projectData.settings.constructor)
            ) {
                constr = projectData.settings.constructor;
            }

            if (projectData.settings && projectData.settings.dataProvider) {
                if (projectData.settings.dataProvider.seriesMapping) {
                    highed.merge(customizedOptions, {
                        data: {
                            seriesMapping: projectData.settings.dataProvider.seriesMapping
                        }
                    });

                }

                if (projectData.settings.dataProvider.assignDataFields) {
                    assignDataFields = projectData.settings.dataProvider.assignDataFields;
                }

                if (projectData.settings.dataProvider.googleSpreadsheet) {
                    var provider = projectData.settings.dataProvider;
                    var sheet = provider.googleSpreadsheet;

                    if (customizedOptions.data) {
                        sheet.startRow =
              provider.startRow || customizedOptions.data.startRow;
                        sheet.endRow = provider.endRow || customizedOptions.data.endRow;
                        sheet.startColumn =
              provider.startColumn || customizedOptions.data.startColumn;
                        sheet.endColumn =
              provider.endColumn || customizedOptions.data.endColumn;
                        if (provider.dataRefreshRate && provider.dataRefreshRate > 0) {
                            sheet.dataRefreshRate =
                provider.dataRefreshRate ||
                customizedOptions.data.dataRefreshRate;
                            sheet.enablePolling = true;
                        }
                    }

                    events.emit(
                        'ProviderGSheet',
                        projectData.settings.dataProvider.googleSpreadsheet
                    );

                    loadGSpreadsheet(sheet);

                    hasData = true;
                } else if (projectData.settings.dataProvider.liveData) {
                    // eslint-disable-next-line no-redeclare
                    var provider = projectData.settings.dataProvider;
                    var live = provider.liveData;

                    loadLiveData(provider.liveData);
                } else if (projectData.settings.dataProvider.csv) {
                    // We need to fix potential html-entities as they will mess up separators
                    Object.keys(htmlEntities).forEach(function (ent) {
                        projectData.settings.dataProvider.csv = projectData.settings.dataProvider.csv.replace(
                            new RegExp(ent, 'g'),
                            htmlEntities[ent]
                        );
                    });
                    hasData = true;
                }
            }

            // Not sure if this should be part of the project files yet
            // if (projectData.editorOptions) {
            //     Object.keys(projectData.editorOptions, function (key) {
            //         highed.option(key, projectData.editorOptions[key]);
            //     });
            // }

            updateAggregated();

            if (!hasData) {
                init(aggregatedOptions);
            }
            emitChange();

            events.emit('LoadProject', projectData, aggregatedOptions);
        }
    }

    function loadLiveData(settings) {

        lastLoadedLiveData = settings;

        lastLoadedCSV = false;
        lastLoadedSheet = false;

        highed.merge(customizedOptions, {
            data: lastLoadedLiveData
        });

        events.emit('ProviderLiveData', settings);
        updateAggregated();
        init(aggregatedOptions);

        loadSeries();
        emitChange();

        // The sheet will be loaded async, so we should listen to the load event.
        gc(function (chart) {
            var found = Highcharts.addEvent(chart, 'load', function () {
                loadSeriesFromDataSource();
                found();
            });
        });

    }

    function loadGSpreadsheet(options) {
        var key;

        lastLoadedCSV = false;
        lastLoadedSheet = options;

        lastLoadedSheet.googleSpreadsheetKey =
      lastLoadedSheet.googleSpreadsheetKey || lastLoadedSheet.id;
        lastLoadedSheet.googleSpreadsheetWorksheet =
      lastLoadedSheet.googleSpreadsheetWorksheet || lastLoadedSheet.worksheet;

        if (options && (options.googleSpreadsheetKey || '').indexOf('http') === 0) {
            // Parse out the spreadsheet ID
            // Located between /d/ and the next slash after that
            key = options.googleSpreadsheetKey;
            key = key.substr(key.indexOf('/d/') + 3);
            key = key.substr(0, key.indexOf('/'));

            options.googleSpreadsheetKey = key;
        }

        highed.merge(customizedOptions, {
            data: lastLoadedSheet
        });


        updateAggregated();
        init(aggregatedOptions);
        loadSeries();
        emitChange();
        // The sheet will be loaded async, so we should listen to the load event.
        gc(function (chart) {
            var found = Highcharts.addEvent(chart, 'load', function () {
                loadSeriesFromDataSource();
                // loadSeries();
                found();
            });
        });
    }

    function getCleanOptions(source) {
        return source;

        // return highed.merge(highed.merge({}, source), {
        //   data: {
        //     csv: false
        //   }
        // });

        // var clone = highed.merge({}, source || customizedOptions);

        // if (!highed.isArr(clone.yAxis)) {
        //   clone.yAxis = [clone.yAxis];
        // }

        // (clone.yAxis || []).forEach(function (axis) {
        //   if (axis.series) {
        //     delete axis.series.data;
        //   }
        // });

    // return clone;
    }


    function toProject() {
        var loadedCSVRaw = false,
            gsheet = lastLoadedSheet,
            livedata = lastLoadedLiveData,
            themeData = false,
            seriesMapping = false;
        if (
            (chart &&
      chart.options &&
      chart.options.data &&
      chart.options.data.csv) ||
      dataTableCSV !== null
        ) {
            loadedCSVRaw = dataTableCSV || (chart.options.data ? chart.options.data.csv : '');

            if (chart.options.data && chart.options.data.seriesMapping) {
                seriesMapping = chart.options.data.seriesMapping;
            }
        }

        if (
            chart &&
      chart.options &&
      chart.options.data &&
      chart.options.data.googleSpreadsheetKey
        ) {
            gsheet = {
                googleSpreadsheetKey: chart.options.data.googleSpreadsheetKey,
                googleSpreadsheetWorksheet:
          chart.options.data.googleSpreadsheetWorksheet
            };
            assignDataFields = false;
        }

        if (chart &&
        chart.options &&
        chart.options.data &&
        chart.options.data.url
        ) {
            livedata = {
                url: chart.options.data.url,
                interval: chart.options.data.interval,
                type: chart.options.data.type
            };
            assignDataFields = false;
        }

        if (themeMeta && themeMeta.id && themeOptions) {
            themeData = {
                id: themeMeta.id,
                name: themeMeta.name,
                options: themeOptions || {},
                customCode: themeCustomCode || ''
            };
        }

        if (chart && chart.options && chart.options.annotations) {
            chartPlugins.annotations = 1;
        }

        return {
            template: templateOptions,
            options: getCleanOptions(customizedOptions),
            customCode: highed.isFn(customCode) ? customCodeStr : '',
            theme: themeData,
            settings: {
                constructor: constr,
                template: templateSettings,
                plugins: chartPlugins, // getPlugins(),
                dataProvider: {
                    csv: !gsheet && !livedata ? loadedCSVRaw || lastLoadedCSV : false,
                    googleSpreadsheet: gsheet,
                    liveData: livedata,
                    assignDataFields: assignDataFields,
                    seriesMapping: seriesMapping
                }
            }
            // editorOptions: highed.serializeEditorOptions()
        };
    }

    function getTemplateSettings() {
        return templateSettings;
    }

    function clearData(skipReinit) {
        lastLoadedCSV = false;
        lastLoadedSheet = false;
        lastLoadedLiveData = false;

        if (customizedOptions && customizedOptions.data) {
            customizedOptions.data = {};
        }

        if (customizedOptions.series) {
            customizedOptions.series = highed.isArr(customizedOptions.series) ?
                customizedOptions.series :
                [customizedOptions.series];


            customizedOptions.series.forEach(function (series) {
                if (series.data) {
                    delete series.data;
                }
            });
        }

        if (!skipReinit) {
            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        }
    }

    function toProjectStr(tabs) {
        return stringifyFn(toProject(), tabs);
    }


    function loadJSONData(data) {
        lastLoadedCSV = false;

        gc(function (chart) {
            if (highed.isStr(data)) {
                try {
                    loadJSONData(JSON.parse(data));
                } catch (e) {
                    highed.snackBar('invalid json: ' + e);
                }
            } else if (highed.isBasic(data)) {
                highed.snackBar('the data is not valid json');
            } else {
                templateOptions = [{}];
                highed.clearObj(customizedOptions);
                highed.merge(customizedOptions, highed.merge({}, data));

                if (!highed.isNull(data.series)) {
                    customizedOptions.series = data.series;
                }

                updateAggregated();
                init(customizedOptions);
                loadSeries();
                emitChange();
            }
        });
    }

    /**
     * Set Data table CSV as user could have unused columns that need saving too.
     */

    function setDataTableCSV(csv) {
        dataTableCSV = csv;
    }

    /**
     * Set Assign Data fields from datatable
     */

    function setAssignDataFields(fields) {
        assignDataFields = fields;
    }


    /**
     * Add/Remove a module from the charts config
     */

    function togglePlugins(groupId, newValue) {
        if (newValue) {
            chartPlugins[groupId] = 1;
        } else {
            delete chartPlugins[groupId];
        }
    }


    function getPlugins() {
        var arr = [];

        Object.keys(chartPlugins).filter(function (key) {
            chartPlugins[key].forEach(function (object) {
                if (arr.indexOf(object) === -1) {
                    arr.push(object);
                }
            });
        });

        return arr;
    }

    function setChartOptions(options) {
        function emitWidthChange() {
            events.emit('AttrChange', {
                id: 'chart.width'
            });
        }

        function emitHeightChange() {
            events.emit('AttrChange', {
                id: 'chart.height'
            });
        }

        var doEmitHeightChange = false,
            doEmitWidthChange = false;

        // Temp. hack to deal with actual sizing
        if (options && options.chart) {
            if (typeof options.chart.width !== 'undefined') {
                if (
                    !customizedOptions.chart ||
          typeof customizedOptions.chart === 'undefined'
                ) {
                    doEmitWidthChange = true;
                } else if (customizedOptions.chart.width !== options.chart.width) {
                    doEmitWidthChange = true;
                }
            }

            if (typeof options.chart.height !== 'undefined') {
                if (
                    !customizedOptions.chart ||
          typeof customizedOptions.chart === 'undefined'
                ) {
                    doEmitHeightChange = true;
                } else if (customizedOptions.chart.height !== options.chart.height) {
                    doEmitHeightChange = true;
                }
            }
        }

        // console.time('remblanks');
        customizedOptions = highed.transform.remBlanks(
            highed.merge({}, options, false)
        );
        // console.timeEnd('remblanks');

        if (customizedOptions && customizedOptions.lang) {
            Highcharts.setOptions({
                lang: customizedOptions.lang
            });
        }

        if (options && options.global) {
            // nothing
        }

        // This is nasty
        if (options && options.data && options.data.googleSpreadsheetKey) {
            events.emit('LoadedGoogleSpreadsheet');
        }

        updateAggregated();
        init(aggregatedOptions, false, true);
        emitChange();

        if (doEmitHeightChange) {
            emitHeightChange();
        }

        if (doEmitWidthChange) {
            emitWidthChange();
        }
    }


    function loadChartSettings(settings) {
        gc(function (chart) {
            Object.keys(settings || {}).forEach(function (key) {
                highed.setAttr(customizedOptions, key, settings[key]);
            });

            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        });
    }

    function loadSeriesData(seriesArr) {
        if (!highed.isArr(seriesArr)) {
            return;
        }
        customizedOptions.series = customizedOptions.series || [];

        if (seriesArr.length < customizedOptions.series.length) {
            // Need to delete some series
            customizedOptions.series.splice(
                seriesArr.length,
                customizedOptions.series.length - seriesArr.length
            );
        }

        seriesArr.forEach(function (s, i) {
            if (s.name) {
                set('series-name', s.name, i);
            }
            if (s.data) {
                set('series-data', s.data, i);
            }
        });
    }


    function set(id, value, index) {
        gc(function (chart) {
            // highed.setAttr(chart.options, id, value, index);
            highed.setAttr(
                chart.options,
                'plotOptions--series--animation',
                false,
                index
            );
        });

        // We want to be able to set the customized options even if the chart
        // doesn't exist
        highed.setAttr(customizedOptions, id, value, index);

        flatOptions[id] = value;

        if (id.indexOf('lang--') === 0 && customizedOptions.lang) {
            Highcharts.setOptions({
                lang: customizedOptions.lang
            });
        }

        updateAggregated();
        init(aggregatedOptions, false, true);
        emitChange();

        events.emit('AttrChange', {
            id: id.replace(/\-\-/g, '.').replace(/\-/g, '.'),
            value: value
        });
    }


    function getEmbeddableJSON(noCustomCode) {
        var r;
        updateAggregated(noCustomCode);
        r = getCleanOptions(highed.merge({}, aggregatedOptions));

        // This should be part of the series
        if (!highed.isNull(r.data)) {
            // Don't delete spreadsheet stuff
            if (!r.data.googleSpreadsheetKey) {
                r.data = undefined;
            }
            // delete r['data'];
        }

        if (r && highed.isArr(r.series)) {
            r.series = r.series.map(function (s) {
                var cloned = highed.merge({}, s);
                delete s.data;
                return s;
            });
        }

        if (lastLoadedSheet) {
            highed.merge(r, {
                data: lastLoadedSheet
            });
        } else if (lastLoadedLiveData) {
            highed.merge(r, {
                data: lastLoadedLiveData,
                googleSpreadsheetKey: false,
                googleSpreadsheetWorksheet: false
            });
        } else if (lastLoadedCSV) {
            highed.merge(r, {
                data: {
                    csv: lastLoadedCSV,
                    googleSpreadsheetKey: false,
                    googleSpreadsheetWorksheet: false
                }
            });
        }

        return r;
    }


    function toString(tabs) {
        return stringifyFn(getEmbeddableJSON(), tabs);
    }


    function getEmbeddableSVG() {
        return gc(function (chart) {
            return highed.isFn(chart.getSVG) ? chart.getSVG() : '';
        });
    }


    function getEmbeddableJavaScript(id) {
        return gc(function (chart) {
            var cdnIncludes = [
                    'https://code.highcharts.com/stock/highstock.js',
                    'https://code.highcharts.com/highcharts-more.js',
                    'https://code.highcharts.com/highcharts-3d.js',
                    'https://code.highcharts.com/modules/data.js',
                    'https://code.highcharts.com/modules/exporting.js',
                    'https://code.highcharts.com/modules/funnel.js',
                    'https://code.highcharts.com/6.0.2/modules/annotations.js',
                    'https://code.highcharts.com/modules/accessibility.js',
                    'https://code.highcharts.com/modules/solid-gauge.js'
                ],
                cdnIncludesArr = [],
                title =
          chart.options && chart.options.title ?
              chart.options.title.text || 'untitled chart' :
              'untitled chart';

            id = id || '';

            /*
                This magic code will generate an injection script that will
                check if highcharts is included, and include it if not.
                Afterwards, it will create the chart, and insert it into the page.

                It's quite messy, could to client-side templating or something,
                but it works.
            */

            if (highed.option('includeCDNInExport')) {
                cdnIncludesArr = [
                    'var files = ',
                    JSON.stringify(cdnIncludes),
                    ',',
                    'loaded = 0; ',
                    'if (typeof window["HighchartsEditor"] === "undefined") {',
                    'window.HighchartsEditor = {',
                    'ondone: [cl],',
                    'hasWrapped: false,',
                    'hasLoaded: false',
                    '};',
                    'include(files[0]);',
                    '} else {',
                    'if (window.HighchartsEditor.hasLoaded) {',
                    'cl();',
                    '} else {',
                    'window.HighchartsEditor.ondone.push(cl);',
                    '}',
                    '}',
                    'function isScriptAlreadyIncluded(src){',
                    'var scripts = document.getElementsByTagName("script");',
                    'for (var i = 0; i < scripts.length; i++) {',
                    'if (scripts[i].hasAttribute("src")) {',
                    'if ((scripts[i].getAttribute("src") || "").indexOf(src) >= 0 || (scripts[i].getAttribute("src") === "https://code.highcharts.com/highcharts.js" && src === "https://code.highcharts.com/stock/highstock.js")) {',
                    'return true;',
                    '}',
                    '}',
                    '}',
                    'return false;',
                    '}',
                    'function check() {',
                    'if (loaded === files.length) {',
                    'for (var i = 0; i < window.HighchartsEditor.ondone.length; i++) {',
                    'try {',
                    'window.HighchartsEditor.ondone[i]();',
                    '} catch(e) {',
                    'console.error(e);',
                    '}',
                    '}',
                    'window.HighchartsEditor.hasLoaded = true;',
                    '}',
                    '}',

                    'function include(script) {',
                    'function next() {',
                    '++loaded;',
                    'if (loaded < files.length) {',
                    'include(files[loaded]);',
                    '}',
                    'check();',
                    '}',
                    'if (isScriptAlreadyIncluded(script)) {',
                    'return next();',
                    '}',
                    'var sc=document.createElement("script");',
                    'sc.src = script;',
                    'sc.type="text/javascript";',
                    'sc.onload=function() { next(); };',
                    'document.head.appendChild(sc);',
                    '}',

                    'function each(a, fn){',
                    'if (typeof a.forEach !== "undefined"){a.forEach(fn);}',
                    'else{',
                    'for (var i = 0; i < a.length; i++){',
                    'if (fn) {fn(a[i]);}',
                    '}',
                    '}',
                    '}',

                    'var inc = {},incl=[]; each(document.querySelectorAll("script"), function(t) {inc[t.src.substr(0, t.src.indexOf("?"))] = 1; ',
                    '});'
                ];
            }

            const chartConstr = (constr.some(function (a) {
                return a === 'StockChart';
            }) ? 'StockChart' : 'Chart');

            return (
                '\n' +
        [
            '(function(){ ',

            cdnIncludesArr.join(''),

            ' function cl() {',
            'if(typeof window["Highcharts"] !== "undefined"){', // ' && Highcharts.Data ? ',

            !customizedOptions.lang ?
                '' :
                'Highcharts.setOptions({lang:' +
              JSON.stringify(customizedOptions.lang) +
              '});',
            'var options=',
            stringifyFn(getEmbeddableJSON(true)),
            ';',
            highed.isFn(customCode) ? customCodeStr : '',
            'new Highcharts.' + chartConstr + '("',
            id,
            '", options);',
            '}',
            '}',
            '})();'
        ].join('') +
        '\n'
            );
        });
    }

    function getCodePreview() {
        var options = getEmbeddableJSON(true);

        if (highed.isFn(customCode) && customCodeStr) {
            customCode(options);
        }

        return stringifyFn(options, '  ');
    }


    function getEmbeddableHTML(placehold) {
        return gc(function (chart) {
            var id = 'highcharts-' + highed.uuid();
            return (
                '\n' +
        [
            '<div id="',
            id,
            '">',
            placehold ? getEmbeddableSVG() : '',
            '</div>'
        ].join('') +
        // eslint-disable-next-line no-useless-concat
        '<scr' + 'ipt>' +
        getEmbeddableJavaScript(id) +
        // eslint-disable-next-line no-useless-concat
        '</scr' + 'ipt>'
            );
        });
    }

    function expand() {
        gc(function (chart) {
            if (!expanded) {
                highed.dom.style(properties.expandTo, {
                    width: '100%',
                    display: 'block'
                });

                preExpandSize = highed.dom.size(parent);
                init(chart.options, properties.expandTo);
                expanded = true;

                toggleButton.className =
          'highed-icon highed-chart-preview-expand fa fa-times-circle';
            }
        });
    }


    function collapse() {
        gc(function (chart) {
            if (preExpandSize && expanded) {
                highed.dom.style(properties.expandTo, {
                    width: '0px',
                    display: 'none'
                });

                toggleButton.className =
          'highed-icon highed-chart-preview-expand fa fa-external-link-square';

                init(chart.options, parent);
                expanded = false;
            }
        });
    }


    function newChart() {
        highed.cloud.flush();

        templateOptions = [];
        highed.clearObj(customizedOptions);
        highed.clearObj(flatOptions);

        customCode = false;

        // highed.merge(customizedOptions, properties.defaultChartOptions);

        updateAggregated();

        init(aggregatedOptions);

        emitChange();
        events.emit('New');
    }


    function exportChart(options) {
        gc(function (chart) {
            chart.exportChart(options, aggregatedOptions);
        });
    }


    function changeParent(newParent) {
        parent = newParent;
        init();
    }


    function getConstructor() {
        return (constr.some(function (a) {
            return a === 'StockChart';
        }) ? 'StockChart' : 'Chart');
    }

    function getTheme() {
        return {
            id: themeMeta.id,
            name: themeMeta.name,
            options: themeOptions
        };
    }

    function getCustomCode() {
        return customCodeStr && customCodeStr.length ?
            customCodeStr :
            customCodeDefault;

    // return highed.isFn(customCode) ?
    // customCodeStr || customCodeDefault :
    // customCode || customCodeDefault;
    }

    function setCustomCode(newCode, errFn, skipEmit) {
        var fn;

        if (!newCode) {
            customCode = false;
            customCodeStr = '';
        }

        try {
            // eval('(var options = {};' + newCode + ')');
            // eslint-disable-next-line no-new-func
            customCode = new Function(
                'options',
                [
                    'if (options.yAxis && options.yAxis.length === 1) options.yAxis = options.yAxis[0];',
                    'if (options.xAxis && options.xAxis.length === 1) options.xAxis = options.xAxis[0];',
                    'if (options.zAxis && options.zAxis.length === 1) options.zAxis = options.zAxis[0];',
                    'if (!options.series || options.series.length === 0) return;',
                    'var encodedUrl = "";',
                    themeCustomCode
                ].join('') + newCode
            );
            customCodeStr = newCode;
        } catch (e) {
            customCode = false;
            customCodeStr = newCode;
            return highed.isFn(errFn) && errFn(e);
        }

        if (!skipEmit) {
            updateAggregated();

            if (!customizedOptions.data || (customizedOptions &&
         customizedOptions.data &&
         !customizedOptions.data.googleSpreadsheetKey)) {
                init(aggregatedOptions);
            }

            emitChange();
        }
    }

    function setIsAnnotating(isAnnotate) {
        isAnnotating = isAnnotate;
    }

    function setAnnotationType(type) {
        annotationType = type;
    }

    function addLabel(x, y, text, color, type) {
        if (chart) {

            if (!customizedOptions.annotations) {
                customizedOptions.annotations = [];
            }
            var annotation = chart.addAnnotation({
                id: 'label_' + customizedOptions.annotations.length,
                labels: [{
                    id: 'label_' + customizedOptions.annotations.length,
                    text: text,
                    point: {
                        x: x,
                        y: y,
                        xAxis: 0,
                        yAxis: 0
                    },
                    backgroundColor: color,
                    shape: type,
                    borderWidth: type !== 'connector' ? 0 : 1,
                    x: 0,
                    y: type === 'circle' ? 0 : -16
                }]
            });

            customizedOptions.annotations.push({
                id: 'label_' + customizedOptions.annotations.length,
                labels: [annotation.options.labels[0]]
            });
        }
    }


    function addAnnotationLabel(x, y, text, color, type) {
        addLabel(x, y, text, color, type);
    }
    // /////////////////////////////////////////////////////////////////////////

    // Init the initial chart
    updateAggregated();
    init();

    highed.dom.on(toggleButton, 'click', function () {
        return expanded ? collapse() : expand();
    });

    function addBlankSeries(index, type) {

        if (!customizedOptions.series[index]) {
            customizedOptions.series[index] = {
                data: [],
                turboThreshold: 0,
                _colorIndex: index,
                _symbolIndex: 0,
                compare: undefined
            };
        }

        if (type) {
            customizedOptions.series[index].type = type;
        }

        // Init the initial chart
        updateAggregated();
        init();
    }

    function addAnnotation(e) {
        var xValue = chart.xAxis[0].toValue(e.chartX),
            yValue = chart.yAxis[0].toValue(e.chartY);


        if (!chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
            return;
        }

        if (!customizedOptions.annotations) {
            customizedOptions.annotations = [];
        } // [{}];

        if (annotationType === 'label') {
            events.emit('ShowTextDialog', chart, xValue, yValue);
        } else if (annotationType === 'delete') {
            // nothing
        } else {
            addShape(chart, annotationType, xValue, yValue/* e.chartX - this.plotLeft, e.chartY - this.plotTop*/);
        }
    }
    // /////////////////////////////////////////////////////////////////////////

    exports = {
        assignTheme: assignTheme,
        clearTheme: clearTheme,
        getTheme: getTheme,
        getConstructor: getConstructor,
        on: events.on,
        expand: expand,
        collapse: collapse,
        new: newChart,
        changeParent: changeParent,

        getHighchartsInstance: gc,

        loadTemplate: loadTemplate,
        loadTemplateForSerie: loadTemplateForSerie,
        loadSeries: loadSeriesData,
        resize: resize,

        setCustomCode: setCustomCode,
        getCustomCode: getCustomCode,

        toProject: toProject,
        toProjectStr: toProjectStr,
        loadProject: loadProject,

        toString: toString,
        setIsAnnotating: setIsAnnotating,
        setAnnotationType: setAnnotationType,
        addAnnotationLabel: addAnnotationLabel,
        addAnnotation: addAnnotation,

        options: {
            set: set,
            setAll: setChartOptions,
            customized: customizedOptions,
            getCustomized: function () {
                return customizedOptions;
            },
            full: aggregatedOptions,
            flat: flatOptions,
            chart: chartOptions,
            getPreview: getCodePreview,
            all: function () {
                return chart;
            },
            addBlankSeries: addBlankSeries,
            togglePlugins: togglePlugins,
            getTemplateSettings: getTemplateSettings
        },

        data: {
            csv: loadCSVData,
            json: loadJSONData,
            settings: loadChartSettings,
            export: exportChart,
            gsheet: loadGSpreadsheet,
            clear: clearData,
            live: loadLiveData,
            setDataTableCSV: setDataTableCSV,
            setAssignDataFields: setAssignDataFields,
            deleteSerie: deleteSerie,
            deleteSeries: deleteSeries
        },

        export: {
            html: getEmbeddableHTML,
            json: getEmbeddableJSON,
            svg: getEmbeddableSVG,
            js: getEmbeddableJavaScript
        }
    };

    return exports;
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var modal = highed.OverlayModal(false, {
        showOnInit: false,
        zIndex: 11000,
        width: 300,
        height: 400
    });

    highed.dom.ap(
        modal.body,
        highed.dom.cr('span', '', 'License info goes here')
    );

    highed.licenseInfo = {

        show: modal.show
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    var flatOptions = {};

    function dive(tree) {
        if (tree) {
            if (highed.isArr(tree)) {
                tree.forEach(dive);
            } else if (tree.options) {
                if (highed.isArr(tree.options)) {
                    tree.options.forEach(dive);
                } else {
                    Object.keys(tree.options).forEach(function (key) {
                        dive(tree.options[key]);
                    });
                }
            } else if (tree.id) {
                flatOptions[tree.id] = tree;
            }
        }
    }

    dive(highed.meta.optionsExtended);


    highed.SimpleCustomizer = function (parent, attributes) {
        var events = highed.events(),
            container = highed.dom.cr('div', 'highed-simple-customizer'),
            table = highed.dom.cr('table', 'highed-customizer-table'),
            properties = highed.merge(
                {
                    availableSettings: [
                        'title--text',
                        'subtitle--text',
                        'colors',
                        'chart--backgroundColor',
                        'yAxis-title--style',
                        'yAxis--type',
                        'yAxis--opposite',
                        'yAxis--reversed',
                        'yAxis-labels--format'
                    ]
                },
                attributes
            );

        // //////////////////////////////////////////////////////////////////////


        function build(options) {
            table.innerHTML = '';

            properties.availableSettings.forEach(function (name) {
                var group = highed.merge(
                    {
                        text: name.replace(/\-/g, ' '),
                        id: name,
                        tooltipText: false,
                        dataType: 'string',
                        defaults: false,
                        custom: {},
                        values: false
                    },
                    flatOptions[name]
                );

                highed.dom.ap(
                    table,
                    highed.InspectorField(
                        group.values ? 'options' : group.dataType,
                        highed.getAttr(options, group.id, 0) || group.defaults,
                        {
                            title: group.text,
                            tooltip: group.tooltipText,
                            values: group.values,
                            custom: group.custom,
                            defaults: group.defaults,
                            attributes: group.attributes || []
                        },
                        function (newValue) {
                            events.emit('PropertyChange', group.id, newValue, 0);
                        },
                        false,
                        group.id
                    )
                );
            });
        }

        function highlightNode(n) {
            if (!n) {
                return;
            }

            highed.dom.style(n, {
                border: '2px solid #33aa33'
            });

            n.focus();
            n.scrollIntoView(true);

            window.setTimeout(function () {
                highed.dom.style(n, {
                    border: ''
                });
            }, 2000);
        }


        function focus(thing, x, y) {
            var id = thing.id;
            if (id.indexOf('-') >= 0) {
                highlightNode(table.querySelector('#' + id));
            }
        }

        // //////////////////////////////////////////////////////////////////////

        highed.ready(function () {
            highed.dom.ap(
                parent,
                highed.dom.ap(
                    container,
                    highed.dom.cr('div', 'highed-customizer-table-heading', 'Edit Chart'),
                    table
                )
            );
        });

        return {
            focus: focus,
            on: events.on,
            build: build
        };
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

(function () {
    function createTeamDropDown(target) {
        var dropdown = highed.DropDown(target);

        function refresh() {
            dropdown.clear();

            highed.cloud.getTeams(function (teamCollection) {
                teamCollection.forEach(function (team) {
                    dropdown.addItem({
                        id: team.id,
                        title: team.name
                    });
                });

                dropdown.selectByIndex(0);
            });
        }

        return {
            refresh: refresh,
            dropdown: dropdown
        };
    }

    var chartPreview = false,
        modal = highed.OverlayModal(document.body, {
            // eslint-disable-line no-undef
            showOnInit: false,
            width: '90%',
            height: '90%',
            zIndex: 10001
        }),
        mainContainer = highed.dom.cr('div'),
        charts = highed.dom.cr('div', 'highed-cloud-chart-container'),
        teams = createTeamDropDown(mainContainer),
        pageNavigation = highed.dom.cr('div', 'highed-cloud-paging'),
        activeTeam,
        activeChart,
        saveNewModal = highed.OverlayModal(document.body, {
            // eslint-disable-line no-undef
            showOnInt: false,
            width: 400,
            height: 300,
            zIndex: 10001
        }),
        saveNewTeamsContainer = highed.dom.cr('div'),
        saveNewTeams = createTeamDropDown(saveNewTeamsContainer),
        saveNewName = highed.dom.cr('input', 'highed-field-input'),
        saveNewBtn = highed.dom.cr('button', 'highed-ok-button', 'Save to cloud'),
        loginForm = false;

    highed.dom.ap(
        saveNewModal.body,
        highed.dom.cr('h2', 'highed-titlebar', 'Save to Cloud'),
        highed.dom.cr('div', '', 'Team'),
        saveNewTeamsContainer,
        highed.dom.cr('br'),
        highed.dom.cr('div', '', 'Chart Name'),
        saveNewName,
        saveNewBtn
    );

    highed.dom.on(saveNewBtn, 'click', function () {
        saveNewBtn.disabled = true;
        saveNewBtn.innerHTML = 'SAVING TO CLOUD...';

        highed.cloud.saveNewChart(
            activeTeam,
            saveNewName.value,
            JSON.stringify(chartPreview.toProject()),
            function (data) {
                saveNewBtn.disabled = false;
                if (!data.error && data) {
                    activeChart = data;
                    saveNewModal.hide();
                    saveNewBtn.innerHTML = 'SAVE TO CLOUD';
                    highed.snackBar('SAVED TO CLOUD');
                } else {
                    highed.snackBar('Error saving to cloud');
                }
            }
        );
    });

    saveNewTeams.dropdown.on('Change', function (item) {
        activeTeam = item.id();
    });

    function addChart(chart) {
        var container = highed.dom.cr('div', 'highed-cloud-chart'),
            thumbnail = highed.dom.cr('div', 'highed-cloud-thumbnail');

        highed.dom.ap(
            charts,
            highed.dom.ap(
                container,
                thumbnail,
                highed.dom.cr('div', 'highed-cloud-chart-title', chart.name)
            )
        );

        highed.dom.style(thumbnail, {
            'background-image':
        'url(' + chart.thumbnail_url + '?t=' + new Date().getTime() + ')'
        });

        highed.dom.on(thumbnail, 'click', function () {
            if (chartPreview) {
                highed.cloud.getChart(chart.team_owner, chart.id, function (data) {
                    try {
                        chartPreview.loadProject(JSON.parse(data.data));
                        activeChart = chart.id;
                        activeTeam = chart.team_owner;
                        modal.hide();
                    } catch (e) {
                        highed.snackbar(e);
                    }
                });
            }
        });
    }

    highed.dom.ap(
        modal.body,
        highed.dom.cr(
            'h2',
            'highed-titlebar',
            'Load project from Highcharts Cloud'
        ),
        highed.dom.ap(mainContainer, charts, pageNavigation)
    );

    function getCharts(page, teamID) {
    // Load charts here
        charts.innerHTML = 'Loading Charts';
        highed.cloud.getCharts(
            teamID,
            function (chartCollection, full) {
                charts.innerHTML = '';
                pageNavigation.innerHTML = '';

                if (full.pageCount > 1) {
                    for (var i = 1; i <= full.pageCount; i++) {
                        // eslint-disable-next-line no-loop-func
                        (function (pageIndex) {
                            var item = highed.dom.cr('span', 'highed-cloud-paging-item', i);

                            if (pageIndex === page) {
                                item.className += ' selected';
                            }

                            highed.dom.on(item, 'click', function () {
                                getCharts(pageIndex, teamID);
                            });

                            highed.dom.ap(pageNavigation, item);
                        }(i));
                    }
                }

                chartCollection.forEach(addChart);
            },
            page
        );
    }

    teams.dropdown.on('Change', function (item) {
        getCharts(false, item.id());
    });

    highed.cloud.flush = function () {
        activeChart = false;
        activeTeam = false;
    };

    highed.cloud.save = function (chartp) {
        highed.cloud.loginForm(function () {
            saveNewName.value = '';
            saveNewName.focus();
            chartPreview = chartp || chartPreview;
            if (activeChart && activeTeam) {
                // Save project
                highed.cloud.saveExistingChart(
                    activeTeam,
                    activeChart,
                    JSON.stringify(chartPreview.toProject()),
                    function () {
                        highed.snackbar('CHART SAVED TO CLOUD');
                    }
                );
            } else {
                // Show save as new UI
                saveNewModal.show();
                saveNewTeams.refresh();
            }
        });
    };

    highed.cloud.showUI = function (preview) {
        highed.cloud.loginForm(function () {
            chartPreview = preview;
            modal.show();
            teams.refresh();
        });
    };

    function createLoginForm() {
        var body = highed.dom.cr('div', 'highed-cloud-login-container'),
            username = highed.dom.cr('input', 'highed-cloud-input'),
            password = highed.dom.cr('input', 'highed-cloud-input'),
            btn = highed.dom.cr('button', 'highed-ok-button', 'LOGIN'),
            notice = highed.dom.cr('div', 'highed-cloud-login-error'),
            loginCallback = false,
            modal = highed.OverlayModal(false, {
                height: 300,
                width: 250,
                zIndex: 10001
            });

        username.name = 'cloud-username';
        password.name = 'cloud-password';

        username.placeholder = 'E-Mail';
        password.placeholder = 'Your password';
        password.type = 'password';

        highed.dom.ap(
            modal.body,
            highed.dom.ap(
                body,
                highed.dom.cr('h3', '', 'Login to Highcharts Cloud'),
                notice,
                username,
                password,
                btn,
                highed.dom.cr(
                    'div',
                    'highed-cloud-login-notice',
                    'Requires a Highcharts Cloud account'
                )
            )
        );

        highed.dom.on(btn, 'click', function () {
            btn.disabled = true;
            highed.dom.style(notice, { display: 'none' });

            highed.cloud.login(username.value, password.value, function (err, res) {
                btn.disabled = false;

                if (err || !res || typeof res.token === 'undefined') {
                    notice.innerHTML =
            'Error: Check username/password (' + (err || res.message) + ')';
                    highed.dom.style(notice, { display: 'block' });
                } else {
                    modal.hide();
                    if (highed.isFn(loginCallback)) {
                        loginCallback();
                    }
                }
            });
        });

        return function (fn) {
            loginCallback = fn || function () {};
            if (highed.cloud.isLoggedIn()) {
                loginCallback();
            } else {
                modal.show();
            }
        };
    }

    highed.cloud.loginForm = function (fn) {
        if (!loginForm) {
            loginForm = createLoginForm();
        }
        loginForm(fn);
    };
}());

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format


highed.DrawerEditor = function (parent, options, planCode) {
    var events = highed.events(),
        // Main properties
        properties = highed.merge(
            {
                defaultChartOptions: {},
                useHeader: true,
                features: [
                    'data',
                    'templates',
                    'customize',
                    'customcode',
                    'advanced',
                    'export'
                ],
                importer: {},
                dataGrid: {},
                customizer: {},
                toolbarIcons: []
            },
            options
        ),
        errorBar = highed.dom.cr(
            'div',
            'highed-errorbar highed-box-size highed-transition'
        ),
        errorBarHeadlineContainer = highed.dom.cr(
            'div',
            'highed-errorbar-headline'
        ),
        errorBarHeadline = highed.dom.cr(
            'div',
            'highed-errorbar-headline-text',
            'This is an error!'
        ),
        errorBarClose = highed.dom.cr(
            'div',
            'highed-errorbar-close',
            '<i class="fa fa-times"/>'
        ),
        errorBarBody = highed.dom.cr(
            'div',
            'highed-errorbar-body highed-scrollbar',
            'Oh noes! something is very wrong!'
        ),
        lastSetWidth = false,
        fixedSize = false,
        splitter = highed.VSplitter(parent, {
            topHeight: properties.useHeader ? '60px' : '0px',
            noOverflow: true
        }),
        builtInOptions = {
            data: {
                icon: 'fa-table',
                title: 'Data',
                widths: {
                    desktop: 66,
                    tablet: 64,
                    phone: 100
                },
                nav: {
                    icon: 'table',
                    text: 'Data',
                    onClick: []
                },
                help: [
                    {
                        title: 'Manually Add/Edit Data',
                        gif: 'dataImport.gif',
                        description: [
                            'Click a cell to edit its contents.<br/><br/>',
                            'The cells can be navigated using the arrow keys.<br/><br/>',
                            'Pressing Enter creates a new row, or navigates to the row directly below the current row.'
                        ]
                    },
                    {
                        title: 'Setting headings',
                        gif: 'dataImport.gif',
                        description: [
                            'The headings are used as the series titles.<br/><br/>',
                            'They can be edited by left clicking them.<br/><br/>',
                            'Click the arrow symbol in the header to access column properties.'
                        ]
                    },
                    {
                        title: 'Importing Data',
                        gif: 'import.gif',
                        description: [
                            'To import data, simply drag and drop CSV files onto the table, or paste CSV/Excel data into any cell.<br/><br/>',
                            'For more advanced data import, click the IMPORT DATA button.'
                        ]
                    }
                ],
                showLiveStatus: true
            },
            templates: {
                icon: 'fa-bar-chart',
                widths: {
                    desktop: 26,
                    tablet: 24,
                    phone: 100
                },
                title: 'Templates',
                nav: {
                    icon: 'bar-chart',
                    text: 'Templates',
                    onClick: []
                },
                help: [
                    {
                        title: 'Templates',
                        description: [
                            'Templates are pre-defined bundles of configuration.<br/><br/>',
                            'Start by choosing the template category in the list to the left,',
                            'then pick a suitable template for your data and use case in the',
                            'template list.'
                        ]
                    }
                ]
            },
            customize: {
                icon: 'fa-sliders',
                title: 'Customize Chart',
                nav: {
                    icon: 'pie-chart',
                    text: 'Customize',
                    onClick: []
                },
                widths: {
                    desktop: 27,
                    tablet: 24,
                    phone: 100
                },
                help: [
                    {
                        title: 'Customize',
                        description: [
                            'The customize pane lets you customize your chart.<br/><br/>',
                            'The customizer has three different sections:<br/>',
                            '<li>Simple: A simple customizer with the most used options</li>',
                            '<li>Advanced: All options available in Highcharts/Highstock can be set here</li>',
                            '<li>Custom code: Here, properties can be overridden programatically</li>'
                        ]
                    }
                ]
            }
        },
        workspaceBody = highed.dom.cr(
            'div',
            'highed-optionspanel-body highed-box-size highed-transition'
        ),
        workspaceButtons = highed.dom.cr(
            'div',
            'highed-optionspanel-buttons highed-optionspanel-cloud highed-box-size highed-transition'
        ),
        smallScreenWorkspaceButtons = highed.dom.cr(
            'div',
            'highed-xs-workspace-buttons highed-optionspanel-xs-cloud highed-box-size highed-transition'
        ),
        workspaceRes = highed.dom.cr(
            'div',
            'highed-optionspanel-buttons highed-optionspanel-res highed-box-size highed-transition'
        ),
        defaultPage,
        panel = highed.OptionsPanel(workspaceBody),
        toolbar = highed.Toolbar(splitter.top),
        // Chart preview
        highedChartContainer = highed.dom.cr('div', 'highed-chart-container highed-transition'),
        chartFrame = highed.dom.cr(
            'div',
            'highed-transition highed-box-size highed-chart-frame highed-scrollbar'
        ),
        showChartSmallScreen = highed.dom.cr(
            'div',
            'highed-transition highed-box-size highed-show-chart-xs',
            '<i class="fa fa-area-chart"/>'
        ),
        chartContainer = highed.dom.cr(
            'div',
            'highed-box-size highed-chart-frame-body'
        ),
        chartPreview = highed.ChartPreview(chartContainer, {
            defaultChartOptions: properties.defaultChartOptions
        }),
        suppressWarning = false,
        dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
        customizePage = highed.CustomizePage(
            splitter.bottom,
            highed.merge(
                {
                    importer: properties.importer
                },
                properties.customizer
            ),
            chartPreview,
            highedChartContainer,
            builtInOptions.customize,
            chartFrame,
            planCode
        ),
        dataPage = highed.DataPage(
            splitter.bottom,
            highed.merge(
                {
                    importer: properties.importer
                },
                properties.dataGrid
            ),
            chartPreview,
            highedChartContainer,
            builtInOptions.data
        );
    createChartPage = highed.CreateChartPage(
        splitter.bottom,
        properties.features,
        {
            title: 'Create Chart',
            widths: {
                desktop: 95
            }
        }
    ),


    // Customizer
    customizerContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    customizer = highed.ChartCustomizer(
        customizerContainer,
        properties.customizer,
        chartPreview
    ),
    // Toolbar buttons
    toolbarButtons = [
        {
            title: highed.L('newChart'),
            css: 'fa-file',
            click: function () {
                if (window.confirm(highed.getLocalizedStr('confirmNewChart'))) {
                    chartPreview.new();
                }
            }
        },
        {
            title: highed.L('saveProject'),
            css: 'fa-floppy-o',
            click: function () {
                var name;

                if (chartPreview.options.full.title) {
                    name = chartPreview.options.full.title.text;
                }

                name = (name || 'chart').replace(/\s/g, '_');

                highed.download(name + '.json', chartPreview.toProjectStr());
            }
        },
        {
            title: highed.L('openProject'),
            css: 'fa-folder-open',
            click: function () {
                highed.readLocalFile({
                    type: 'text',
                    accept: '.json',
                    success: function (file) {
                        try {
                            file = JSON.parse(file.data);
                        } catch (e) {
                            return highed.snackBar('Error loading JSON: ' + e);
                        }

                        chartPreview.loadProject(file);
                    }
                });
            }
        },
        '-',
        {
            title: highed.L('saveCloud'),
            css: 'fa-cloud-upload',
            click: function () {
                highed.cloud.save(chartPreview);
            }
        },
        {
            title: highed.L('loadCloud'),
            css: 'fa-cloud-download',
            click: function () {
                highed.cloud.showUI(chartPreview);
            }
        },
        '-',
        {
            title: 'Help',
            css: 'fa-question-circle',
            click: function () {
                window.open(highed.option('helpURL'));
            }
        }
    ].concat(properties.toolbarIcons),
    // Custom toolbox options
    customOptions = {},
    // The toolbox options

    helpIcon = highed.dom.cr(
        'div',
        'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    titleHeader = highed.dom.cr('h3', '', 'Data'),
    iconContainer = highed.dom.cr('div', ''),
    titleContainer = highed.dom.ap(highed.dom.cr('div', 'highed-page-title'), titleHeader, helpIcon, iconContainer),
    helpModal = highed.HelpModal(builtInOptions.data.help || []);

    highed.dom.on(helpIcon, 'click', showHelp);
    highed.dom.ap(splitter.bottom, highed.dom.ap(workspaceBody, workspaceRes, workspaceButtons));

    highed.dom.ap(splitter.bottom, titleContainer, smallScreenWorkspaceButtons);
    if (!properties.useHeader) {
        highed.dom.style(splitter.top.parentNode, {
            display: 'none'
        });
    }

    highed.dom.on(showChartSmallScreen, 'click', function () {
        if (highedChartContainer.classList.contains('active')) {
            highedChartContainer.classList.remove('active');
        } else {
            setTimeout(function () {
                chartPreview.resize();
            }, 200);
            highedChartContainer.classList += ' active';
        }
    });

    // Alias import to data
    builtInOptions.import = builtInOptions.data;
    panel.setDefault(dataPage);
    dataPage.show();
    /**
     * Creates the features defined in property.features
     * Call this after changing properties.features to update the options.
     */
    function createFeatures() {
        var addedOptions = {};
        panel.clearOptions();

        properties.features = highed.isArr(properties.features) ?
            properties.features :
            properties.features.split(' ');

        function addOption(option, id) {

            if (!option || !option.icon || !option.nav) {
                return;
            }

            console.log(id);


            if (id === 'data') {
                option.nav.page = dataPage;
                dataPage.init();
                document.querySelector('.highed-toolbox').classList.add('data');
                option.nav.onClick.push(
                    function () {
                        document.querySelector('.highed-toolbox').classList.add('data');
                        document.querySelector('.highed-chart-container').classList.remove('data');
                        highed.dom.style([highedChartContainer, chartContainer, chartFrame], {
                            width: '100%',
                            height: '100%'
                        });
                    }
                );
            }  else if (id === 'customize') {
                option.nav.page = customizePage;
                // document.querySelector('.highed-chart-container').classList.add('customize');
                // document.querySelector('.highed-chart-container').classList.remove('data');
                customizePage.init();

                option.nav.onClick.push(
                    function () {
                        // document.querySelector('.highed-chart-container').classList.add('data');
                        document.querySelector('.highed-chart-container').classList.remove('data');
                        highed.dom.style([highedChartContainer, chartContainer, chartFrame], {
                            width: '100%',
                            height: '100%'
                        });
                    }
                );
                // highed.dom.ap(workspaceRes, customizePage.getResolutionContainer());

            } else {
                // Create page
                defaultPage = highed.DefaultPage(splitter.bottom, option, chartPreview, highedChartContainer);
                defaultPage.init();
                option.nav.page = defaultPage;
            }


            var func = function (prev, newOption) {
                prev.hide();
                newOption.page.show();
                panel.setDefault(newOption.page);
                titleHeader.innerHTML = newOption.text;
                helpModal = (option.help ? highed.HelpModal(option.help  || []) : null);

                highed.dom.style(helpIcon, {
                    display: (helpModal ? 'inline' : 'none')
                });

                iconContainer.innerHTML = '';
                if (newOption.page.getIcons()) {
                    highed.dom.ap(iconContainer, newOption.page.getIcons());
                }

                highed.dom.style(iconContainer, {
                    display: (newOption.page.getIcons() ? 'inline' : 'none')
                });

            };


            // if (id == 'customize') {
            //   option.nav.onClick = [func];
            // } else {
            option.nav.onClick.push(func);
            // }


            panel.addOption(option.nav, id);
            addedOptions[id] = id;

        }

        // toolbox.clear();
        resize();

        properties.features.forEach(function (feature) {
            addOption(
                builtInOptions[feature] || customOptions[feature] || false,
                feature
            );
        });
        toolboxEntries = addedOptions;
    // resizeChart(toolbox.width());
    }

    function showHelp() {
        helpModal.show();
    }

    /**
     * Create toolbar
     */
    function createToolbar() {
        toolbarButtons.forEach(function (b) {
            if (b === '-') {
                toolbar.addSeparator();
            } else {
                toolbar.addIcon(b);
            }
        });
    }

    function showCreateChartPage() {

        createChartPage.init(dataPage, customizePage);

        highed.dom.style([workspaceBody, showChartSmallScreen, smallScreenWorkspaceButtons], {
            opacity: 0
        });
        panel.getPrev().hide();
        createChartPage.show();
        highed.dom.style([chartFrame, titleContainer], {
            opacity: '0'
        });

        if (highed.onPhone()) {
            highed.dom.style(titleContainer, {
                display: 'none'
            });
        }

        createChartPage.on('SimpleCreateChartDone', function (goToDataPage) {
            createChartPage.hide();
            highed.dom.style([chartFrame, titleContainer], {
                opacity: '1'
            });
            highed.dom.style([workspaceBody, showChartSmallScreen, smallScreenWorkspaceButtons], {
                opacity: 1
            });

            if (highed.onPhone()) {
                highed.dom.style(titleContainer, {
                    display: 'block'
                });
            }

            if (goToDataPage) {
                dataPage.show();
                panel.setDefault(dataPage);
                dataPage.resize();
            } else {

                const customize = panel.getOptions().customize;

                if (customize) {
                    customizePage.setTabBehaviour(true);
                    customize.click();
                }
                /*
        titleHeader.innerHTML = builtInOptions.customize.title;
        customizePage.show();
        panel.setDefault(customizePage);*/
            }
        });

        createChartPage.on('SimpleCreateChangeTitle', function (options) {
            chartPreview.options.set('title--text', options.title);
            chartPreview.options.set('subtitle--text', options.subtitle);
            setChartTitle(options.title);
        });
    }


    function resizeChart(newWidth) {
        var psize = highed.dom.size(splitter.bottom);

        lastSetWidth = newWidth;

        highed.dom.style(highedChartContainer, {
            /* left: newWidth + 'px',*/
            width: '28%',
            height: '37%'
        });

        if (fixedSize) {
            // Update size after the animation is done
            setTimeout(function () {
                sizeChart(fixedSize.w, fixedSize.h);
            }, 400);
            return;
        }
        /*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

        chartPreview.resize();
    }

    function sizeChart(w, h) {
        if ((!w || w.length === 0) && (!h || h.length === 0)) {
            fixedSize = false;
            resHeight.value = '';
            resWidth.value = '';
            resizeChart(lastSetWidth);
        } else {
            var s = highed.dom.size(highedChartContainer);

            // highed.dom.style(chartFrame, {
            //   paddingLeft: (s.w / 2) - (w / 2) + 'px',
            //   paddingTop: (s.h / 2) - (h / 2) + 'px'
            // });

            fixedSize = {
                w: w,
                h: h
            };

            w = w || s.w - 100;
            h = h || s.h - 100;
            /*
      highed.dom.style(chartContainer, {
        width: w + 'px',
        height: h + 'px'
      });
*/
            chartPreview.resize();
        }
    }

    /**
     * Resize everything
     */
    function resize() {
        splitter.resize();
        panel.getPrev().resize();
    // resizeChart(toolbox.width());
    }

    function setEnabledFeatures(feats) {
        properties.features = feats;
        createFeatures();
    }

    function addFeature(name, feat) {
        customOptions[name] = feat;
        // addPage(feat);
        createFeatures();
    }

    function addToWorkspace(options) {

        const btn = highed.dom.cr('button', 'highed-import-button green action-btn', 'Action <i class=\'fa fa-chevron-down\'/>');
        const btn2 = highed.dom.cr('button', 'highed-import-button green action-btn', 'Action <i class=\'fa fa-chevron-down\'/>');

        highed.dom.on(btn, 'click', function () {
            highed.dom.style(workspaceButtons, {
                overflow: (workspaceButtons.style.overflow === '' || workspaceButtons.style.overflow === 'hidden' ? 'unset' : 'hidden')
            });
        });

        highed.dom.on(btn2, 'click', function () {
            highed.dom.style(smallScreenWorkspaceButtons, {
                overflow: (smallScreenWorkspaceButtons.style.overflow === '' || smallScreenWorkspaceButtons.style.overflow === 'hidden' ? 'unset' : 'hidden')
            });
        });

        highed.dom.ap(workspaceButtons, btn);
        highed.dom.ap(smallScreenWorkspaceButtons, btn2);

        options.forEach(function (option, index) {
            const btn = highed.dom.cr('button', 'highed-import-button green highed-sm-dropdown-button' + (!index ? ' highed-btn-dropdown-first' : ''), option.text);
            highed.dom.on(btn, 'click', option.onClick);

            const btn2 = highed.dom.cr('button', 'highed-import-button green highed-sm-dropdown-button' + (!index ? ' highed-btn-dropdown-first' : ''), option.text);
            highed.dom.on(btn2, 'click', option.onClick);

            highed.dom.ap(workspaceButtons, btn);
            highed.dom.ap(smallScreenWorkspaceButtons, btn2);


        });
    }

    function destroy() {}

    function setChartTitle(title) {
        dataPage.setChartTitle(title);
    }

    function addImportTab(tabOptions) {
        dataPage.addImportTab(tabOptions);
    }

    function hideImportModal() {
    // dataTable.hideImportModal();
    }

    function showError(title, message, warning, code) {
        if (warning) {
            if (suppressWarning) {
                return;
            }

            highed.dom.style(errorBarClose, {
                display: 'inline-block'
            });

            if (!errorBar.classList.contains('highed-warningbar')) {
                errorBar.classList += ' highed-warningbar';
            }
        } else {
            highed.dom.style(errorBarClose, {
                display: 'none'
            });

            errorBar.classList.remove('highed-warningbar');
        }

        highed.dom.style(errorBar, {
            opacity: 1,
            'pointer-events': 'auto'
        });

        errorBarHeadline.innerHTML = title;
        errorBarBody.innerHTML = message;

        if (code === 14) {
            dataPage.showDataTableError();
        }
    }

    function hideError() {
        highed.dom.style(errorBar, {
            opacity: 0,
            'pointer-events': 'none'
        });
        dataPage.hideDataTableError();
    }

    // ////////////////////////////////////////////////////////////////////////////
    // Event attachments

    dataPage.on('GoToTemplatePage', function () {
        const templates = panel.getOptions().templates;
        if (templates) {
            templates.click();
        }
    });

    dataPage.on('SeriesChanged', function (index) {
        if ((!options && !options.features) || (options.features && options.features.indexOf('templates') > -1)) {
            // templatePage.selectSeriesTemplate(index, chartPreview.options.getTemplateSettings());
        }
    });

    chartPreview.on('LoadProject', function (projectData, aggregated) {
        dataPage.loadProject(projectData, aggregated);
        // templatePage.selectSeriesTemplate(0, projectData);
    });

    chartPreview.on('ChartChange', function (newData) {
        events.emit('ChartChangedLately', newData);
    });

    chartPreview.on('RequestEdit', function (event, x, y) {
        const customize = panel.getOptions().customize;
        if (!panel.getCurrentOption() || panel.getCurrentOption().text !== 'Customize') {
            if (customize) {
                customizePage.setTabBehaviour(false);
                customize.click();
            }
        }
        setTimeout(function () {
            customizePage.selectOption(event, x, y);
        }, 500);
    });


    chartPreview.on('Error', function (e) {
        if (e && e.code && highed.highchartsErrors[e.code]) {

            var item = highed.highchartsErrors[e.code],
                url = '';

            if (e.url >= 0) {
                url =
          '<div class="highed-errorbar-more"><a href="https://' +
          e.substr(e.url) +
          '" target="_blank">Click here for more information</a></div>';
            }

            return showError(
                (item.title || 'There\'s a problem with your chart') + '!',
                (item.text) + url,
                e.warning,
                e.code
            );
        }

        showError('There\'s a problem with your chart!', e);
    });

    chartPreview.on('ChartRecreated', hideError);

    highed.dom.on(window, 'resize', resize);

    // ////////////////////////////////////////////////////////////////////////////

    highed.dom.ap(
        toolbar.left,
        highed.dom.style(highed.dom.cr('span'), {
            'margin-left': '2px',
            width: '200px',
            height: '60px',
            float: 'left',
            display: 'inline-block',
            'background-position': 'left middle',
            'background-size': 'auto 100%',
            'background-repeat': 'no-repeat',
            'background-image':
        'url("data:image/svg+xml;utf8,' +
        encodeURIComponent(highed.resources.logo) +
        '")'
        })
    );

    highed.dom.on(errorBarClose, 'click', function () {
        hideError();
        suppressWarning = true;
    });

    highed.dom.ap(
        splitter.bottom,
        highed.dom.ap(
            highedChartContainer,
            highed.dom.ap(chartFrame, chartContainer)
        ),
        showChartSmallScreen,
        highed.dom.ap(errorBar, highed.dom.ap(errorBarHeadlineContainer, errorBarHeadline, errorBarClose), errorBarBody)
    );


    // Create the features
    createFeatures();
    createToolbar();

    resize();

    function setToActualSize() {
        resWidth.disabled = resHeight.disabled = 'disabled';
        chartPreview.getHighchartsInstance(function (chart) {
            var w, h;

            if (!chart || !chart.options || !chart.options.chart) {
                h = 400;
            } else {
                w = chart.options.chart.width;
                h = chart.options.chart.height || 400;
            }

            resWidth.value = w;
            resHeight.value = h;

            sizeChart(w, h);
        });
        /*
    highed.dom.style(chartFrame, {
      'overflow-x': 'auto'
    });*/
    }

    chartPreview.on('AttrChange', function (option) {
        if (option.id === 'chart.height' || option.id === 'chart.width') {
            // resQuickSel.selectByIndex(0);
            // setToActualSize();
        }
    });

    chartPreview.on('SetResizeData', function () {
        setToActualSize();
    });
    return {
        on: events.on,
        resize: resize,
        destroy: destroy,
        /* Get embeddable javascript */
        getEmbeddableHTML: chartPreview.export.html,
        /* Get embeddable json */
        getEmbeddableJSON: chartPreview.export.json,
        /* Get embeddable SVG */
        getEmbeddableSVG: chartPreview.export.svg,
        addImportTab: addImportTab,
        hideImportModal: hideImportModal,
        setEnabledFeatures: setEnabledFeatures,
        addFeature: addFeature,
        chart: chartPreview,
        toolbar: toolbar,
        getChartTitle: dataPage.getChartTitle,
        setChartTitle: setChartTitle,
        showCreateChartPage: showCreateChartPage,
        addToWorkspace: addToWorkspace,
        data: {
            on: function () {}, // dataTable.on,
            showLiveStatus: function () {}, // toolbox.showLiveStatus,
            hideLiveStatus: function () {} // toolbox.hideLiveStatus
        }
        // dataTable: dataTable,
    };
};

/** ****************************************************************************

Copyright (c) 2016-2018, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 ******************************************************************************/

// @format

// Alias to drawer editor
highed.Editor = highed.DrawerEditor;

(function () {
    var instanceCount = 0,
        installedPlugins = {},
        activePlugins = {},
        pluginEvents = highed.events(),
        stepPlugins = {};

    // /////////////////////////////////////////////////////////////////////////


    function install(name, definition) {
        var properties = highed.merge(
            {
                meta: {
                    version: 'unknown',
                    author: 'unknown',
                    homepage: 'unknown'
                },
                dependencies: [],
                options: {}
            },
            definition
        );

        console.error('Warning: editor plugins are no longer supported.');

        properties.dependencies.forEach(highed.include);

        if (!highed.isNull(installedPlugins[name])) {
            return highed.log(1, 'plugin -', name, 'is already installed');
        }

        installedPlugins[name] = properties;
    }

    function use(name, options) {
        var plugin = installedPlugins[name],
            filteredOptions = {};

        console.error('Warning: editor plugins are no longer supported.');

        if (!highed.isNull(plugin)) {
            if (activePlugins[name]) {
                return highed.log(2, 'plugin -', name, 'is already active');
            }

            // Verify options
            Object.keys(plugin.options).forEach(function (key) {
                var option = plugin.options[key];
                if (highed.isBasic(option) || highed.isArr(option)) {
                    highed.log(
                        2,
                        'plugin -',
                        name,
                        'unexpected type definition for option',
                        key,
                        'expected object'
                    );
                } else {
                    filteredOptions[key] =
            options[key] || plugin.options[key].default || '';

                    if (option.required && highed.isNull(options[key])) {
                        highed.log(1, 'plugin -', name, 'option', key, 'is required');
                    }
                }
            });

            activePlugins[name] = {
                definition: plugin,
                options: filteredOptions
            };
            filteredOptions;

            if (highed.isFn(plugin.activate)) {
                activePlugins[name].definition.activate(filteredOptions);
            }

            pluginEvents.emit('Use', activePlugins[name]);
        } else {
            highed.log(2, 'plugin -', name, 'is not installed');
        }
    }

    // Public interface
    highed.plugins.editor = {
        install: install,
        use: use
    };

    // UI plugin interface
    highed.plugins.step = {
        install: function (def) {
            stepPlugins[def.title] = def;
        }
    };
}());

highed.ready(function () {
    highed.Editor(document.body, {
        features: 'data customize'
    });

});