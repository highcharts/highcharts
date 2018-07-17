/**
 * @fileoverview ESLint rules for the Highcharts project
 * @author Torstein
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var path = require('path');
var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(path.join(__dirname, "/rules"));


// import processors
module.exports.processors = {

    // add your processors here
};

