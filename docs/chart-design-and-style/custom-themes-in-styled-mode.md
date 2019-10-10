Custom themes in styled mode
===

Highcharts allows you to create your own custom charts’ theme using native CSS rules or SASS (Syntactically Awesome Style Sheets).

The default CSS file for [styled mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css) is available as /css/highcharts.css on the root of code.highcharts.com as well as under version folders. This CSS is in turn based on a SCSS file, [highcharts.scss](https://github.com/highcharts/highcharts/blob/master/css/highcharts.scss).

Remark
------

Highcharts offers by default three different themes. There are available as CSS files at code.highcharts.com/css/themes :

*   [dark-unica.css](https://code.highcharts.com/css/themes/dark-unica.css)
    
*   [sand-signika.css](https://code.highcharts.com/css/themes/sand-signika.css)
    
*   [grid-light.css](https://code.highcharts.com/css/themes/grid-light.css)
    

All these CSS files are generated from SCSS.

How to create your own theme
----------------------------

### A. Custom theme using CSS Rules

Follow the steps below to create a custom theme using CSS rules:

1.  Create a CSS file
    
2.  Use import to load all default highcharts styles
    
3.  Declare all classes which should be modified and adapt them by colors, fonts etc.
    
4.  Use the yourtheme.css file on a website.
    

Example of yourtheme.css

    
    @import 'https://code.highcharts.com/css/highcharts.css';
     
    .highcharts-color-0 {
      fill: #f45b5b;
      stroke: #f45b5b;
    }
     
    /* Titles */
    .highcharts-title {
      fill: black;
      font-size: 26px;
      font-weight: bold;
    }

### B. Custom theme using SASS

Here are the steps to create a simple custom theme:

1.  Create a SCSS file
    
2.  Declare variables which applies your styles
    
3.  Add additional classes which should be modified and adapt them by colors, fonts etc
    
4.  Use import to load all default highcharts styles
    

Example of yourtheme.scss

    
    // Colors for data series and points.
    $colors: #7cb5ec #f7a35c #90ee7e #7798BF #aaeeee #ff0066 #eeaaee #55BF3B #DF5353 #7798BF #aaeeee;
     
    // Neutral colors
    $neutral-color-100: #404048;
    $neutral-color-80: #000;
     
    // Title
    .highcharts-title, .highcharts-subtitle, .highcharts-yaxis .highcharts-axis-title {
    text-transform: uppercase;
    }
     
    @import 'highcharts';

[View the live demo](https://codepen.io/Blacklabel/pen/wmZyLN)

  
  

Remark

Sass is an extension of CSS that allows you to use variables, nested rules and inline imports in stylesheet.

In the [highcharts.scss](https://github.com/highcharts/highcharts/blob/master/css/highcharts.scss) file, there are declared variables which define the most important and popular elements of charts. Use them to easy style the chart in the customs theme. As a result, there is no need to overwrite all CSS classes.

[View more about SASS](https://sass-lang.com/guide)

Here are the list of all available variables:

    
    // Colors for data series and points.
    $colors: #7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1 !default;
     
    // Chart background, point stroke for markers and columns etc
    $background-color: #ffffff !default;
     
    // Neutral colors, grayscale by default. The default colors are defined by mixing the background-color with neutral, with a weight corresponding to the number in the name.
    $neutral-color-100: #000000 !default; // Strong text.
    $neutral-color-80: #333333 !default; // Main text and some strokes.
    $neutral-color-60: #666666 !default; // Axis labels, axis title, connector fallback.
    $neutral-color-40: #999999 !default; // Credits text, export menu stroke.
    $neutral-color-20: #cccccc !default; // Disabled texts, button strokes, crosshair etc.
    $neutral-color-10: #e6e6e6 !default; // Grid lines etc.
    $neutral-color-5: #f2f2f2 !default; // Minor grid lines etc.
    $neutral-color-3: #f7f7f7 !default; // Tooltip backgroud, button fills, map null points.
     
    // Colored, shades of blue by default
    $highlight-color-100: #003399 !default; // Drilldown clickable labels, color axis max color.
    $highlight-color-80: #335cad !default; // Selection marker, menu hover, button hover, chart border, navigator series.
    $highlight-color-60: #6685c2 !default; // Navigator mask fill.
    $highlight-color-20: #ccd6eb !default; // Ticks and axis line.
    $highlight-color-10: #e6ebf5 !default; // Pressed button, color axis min color.
     
    // Fonts
    $font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif !default;
    $title-font-size: 1.5em !default;
    $subtitle-font-size: 1em !default;
    $legend-font-size: 1em !default;
    $axis-labels-font-size: 0.9em !default;
     
    // Tooltip
    $tooltip-border: 1px !default;
    $tooltip-background: $neutral-color-3 !default;
     
    // Axes
    $xaxis-grid-line: 0px !default;
     
    // Range-selector
    $range-selector-button-border: 0px !default;
    $range-selector-input-text: $neutral-color-80 !default;
    $range-selector-input-border: $neutral-color-20 !default;
     
    // Data-labels
    $data-label-color: $neutral-color-80 !default;
     
    // Buttons
    $context-button-background: $background-color !default;
     
    $highcharts-button-background: $neutral-color-3 !default;
    $highcharts-button-border: $neutral-color-20 !default;
    $highcharts-button-text:  $neutral-color-80 !default;
     
    $highcharts-button-pressed-background: $highlight-color-10 !default;
    $highcharts-button-pressed-border: $neutral-color-20 !default;
    $highcharts-button-pressed-text:  $neutral-color-80 !default;
     
    $highcharts-button-hover-background: $neutral-color-10 !default;
    $highcharts-button-hover-border: $neutral-color-20 !default;
    $highcharts-button-hover-text:  $neutral-color-80 !default;
     
    // Navigator
    $navigator-series-fill: $highlight-color-80 !default;
    $navigator-series-border: $highlight-color-80 !default;
     
    // Scrollbar
    $scrollbar-track-background: $neutral-color-5 !default;
    $scrollbar-track-border: $neutral-color-5 !default;

  
  
  

COMPILATION
-----------

You can install Sass on the command line and you'll be able to run the sass executable to compile .sass and .scss files to .css files.

View more about [setting up SASS](https://sass-lang.com/install).

It is easy to create a custom CSS theme of your own. Feel free to share your own experience about the creation of themes in the comment section below.
