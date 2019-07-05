# SCSS Variables

## Introduction

This feature contains a complete list of SCSS-variables used to create and modify the Style Sheets for Highcharts when used in [Styled mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css) and is a addition to [Custom themes in styled mode](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode)


Compared to previous versions all the properties is now associated to a individual scss-variable

It allows you to alter any part of the Style Sheets with your own values or using values from other packages

All variable-names are prefixed with `$highcharts-` to prevent error when mixed with SCSS-files from other packages


## Setting up

See [Custom themes in styled mode](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode) on how to create your own version of the Style Sheets for Highcharts 

In this feature there are tree scss-files in the `/css` directory:
- `_variables.scss` Contain declaration of all variables and there default values
- `_style.scss` Contain declaration of all variables and there default values
- `_variables_original.scss` Converts the old variable-names to the new ones

The `highcharts.css` is build from `highcharts.scss` who just contain two `@import` of `_variables.scss` and `_style.scss`

## Use Cases

### Use Case 1: Simple use
To include the Highcharts style in your scss-file just add

    @import "/./bower_components/highcharts/css/highcharts";

### Use Case 2: Adjust default values
To change any any the default values use alter them before including the variables

    $highcharts-background-color: red; 

    @import "/./bower_components/highcharts/css/highcharts";
    
### Use Case 3: Adjust default values using original variable-names
To change any any the default values using the original variable-names just also include `_variables_original.scss`

    $background-color: red; 

    @import "/./bower_components/highcharts/css/variables_original";

    @import "/./bower_components/highcharts/css/highcharts";
    
### Use Case 4: Adjust default values to match another packages
To change any any the default values to match another packages (eg. [Bootstrap](https://getbootstrap.com/)) import variables for the other packages before including the variables

    //Import Bootstrap variables
    @import "../bower_components/bootstrap/scss/functions";
    @import "../bower_components/bootstrap/scss/variables";

    //Eq.: Use Bootstrap's colors for tooltips
    $highcharts-tooltip-text-color        : $tooltip-color;
    $highcharts-tooltip-background        : $tooltip-bg;
    $highcharts-tooltip-background-opacity: $tooltip-opacity;

    //Import Highcharts variables and style
    @import "/./bower_components/highcharts/css/highcharts";
    