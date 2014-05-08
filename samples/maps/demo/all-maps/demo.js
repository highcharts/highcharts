// The following code is based on the jQuery UI combobox demo from
// http://jqueryui.com/autocomplete/#combobox
(function ($) {
    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>")
                .addClass("custom-combobox")
                .insertAfter(this.element);
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function () {
            var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "",
                inputElement;
           
            inputElement = this.input = $("<input>")
                    .appendTo(this.wrapper)
                    .val(value)
                    .attr("title", "")
                    .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                    .autocomplete({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy(this, "_source")
                    })
                    .tooltip({
                        tooltipClass: "ui-state-highlight"
                    });

            // Update input text if underlying select changes
            this.element.change(function () {
                inputElement.val($("option:selected", this).text());
            });            
            
            this._on(this.input, {
                // Clear on click
                click: function () {
                    this.input.val('');
                },
                
                autocompleteselect: function (event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option
                    });
                    this.element.change(); // Trigger change event of underlying select
                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function () {
            var input = this.input,
                wasOpen = false;

            $("<a>")
                .attr("tabIndex", -1)
                .attr("title", "Show all items")
                .tooltip()
                .appendTo(this.wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .mousedown(function () {
                    wasOpen = input.autocomplete("widget").is(":visible");
                })
                .click(function () {
                    input.focus();
    
                    // Close if already visible
                    if (wasOpen) {
                        return;
                    }
    
                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                });
        },

        _source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function () {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text))) {
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
                }
            }));
        },

        _removeIfInvalid: function (event, ui) {

            // Selected an item, nothing to do
            if (ui.item) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children("option").each(function () {
                if ($(this).text().toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if (valid) {
                return;
            }

            // Remove invalid value
            this.input.val("")
                .attr("title", value + " didn't match any item")
                .tooltip("open");
            this.element.val("");
            this._delay(function () {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.data("ui-autocomplete").term = "";
        },

        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        }
    });
}(jQuery));
// --------------- end of combobox plugin code ---------------------------------------


$(function () {

    // Base path to maps
    var baseMapPath = "http://code.highcharts.com/mapdata/1.0.0/",
        showDataLabels = true, // Switch for data labels enabled/disabled
        categoryOptions = '',
        mapOptions = '';
        
    // Populate dropdown menus and turn into jQuery UI widgets
    $.each(Highcharts.mapDataIndex, function (mapGroup, maps) {
        categoryOptions += '<option>' + mapGroup + '</option>';
        if(!mapOptions) {
            $.each(maps, function (desc, path) {
                mapOptions += '<option value="' + path + '">' + desc + '</option>';
            });        
        }
    });
    $("#catDropdown").append(categoryOptions).combobox();
    $("#mapDropdown").append(mapOptions).combobox();

    // Re-populate map list when changing category
    $("#catDropdown").change(function () {        
        $("#mapDropdown").empty();
        var mapOptions = '';
        $.each(Highcharts.mapDataIndex[$("option:selected", this).text()], function (desc, path) {
            mapOptions += '<option value="' + path + '">' + desc + '</option>';            
        });
        $("#mapDropdown").append(mapOptions).change();
    });
    
    // Change map when item selected in dropdown 
    $("#mapDropdown").change(function () {
        var mapDesc = $("option:selected", this).text(),
            mapKey = this.value.slice(0, -3),
            svgPath = baseMapPath + mapKey + '.svg',
            geojsonPath = baseMapPath + mapKey + '.geo.json',
            javascriptPath = baseMapPath + this.value;

        // Get map from server
        $.getScript(javascriptPath, function () {
            var mapGeoJSON = Highcharts.maps[mapKey],
                data = [];
            
            // Update info box download links
            $("#download").html('<a target="_blank" href="' + svgPath + '">SVG</a> <a target="_blank" href="' + geojsonPath + '">GeoJSON</a> <a target="_blank" href="' + javascriptPath + '">Javascript</a>');

            // Generate random data for the map            
            $.each(mapGeoJSON.features, function (index, feature) {
                data.push({
                    code: feature.properties.code,
                    value: Math.floor(Math.random() * 1001)
                });
            });
            
            // Instantiate chart
            $("#container").highcharts('Map', {
               
                title: {
                    text: 'Map Choice Demo'
                },

                subtitle: {
                    text: mapDesc
                },

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                colorAxis: {
                    min: 0,
                    max: 1000
                },
                
                series: [{
                    data: data,
                    mapData: Highcharts.geojson(mapGeoJSON, 'map'),
                    joinBy: 'code',
                    name: 'Random data',
                    states: {
                        hover: {
                            color: '#BADA55'
                        }
                    },                    
                    dataLabels: {
                        enabled: showDataLabels,
                        format: null, // Workaround for bug, fixed in latest version
                        formatter: function () {
                            var props = this.point.properties;
                            if (!props) {
                                return 'NULL';
                            }
                            return props['postal-code'] && props['postal-code'] !== 'NULL' ? props['postal-code'] : props.code;
                        }
                    }
                }, {
                    type: 'mapline',
                    name: "Separators",
                    data: Highcharts.geojson(mapGeoJSON, 'mapline'),
                    color: 'black',
                    showInLegend: false,
                    enableMouseTracking: false
                }]
            });
        });
    });

    // Toggle data labels - Note: Reloads map with new random data
    $("#chkDataLabels").change(function () {
        showDataLabels = !showDataLabels;
        $("#mapDropdown").change();
    });
    
    // Switch to previous map on button click
    $("#btnPrevMap").click(function () {
        $("#mapDropdown option:selected").prev("option").prop("selected", true).change();
    });

    // Switch to next map on button click
    $("#btnNextMap").click(function () {
        $("#mapDropdown option:selected").next("option").prop("selected", true).change();
    });

    // Switch to previous category on button click
    $("#btnPrevCat").click(function () {
        $("#catDropdown option:selected").prev("option").prop("selected", true).change();
    });

    // Switch to next category on button click
    $("#btnNextCat").click(function () {
        $("#catDropdown option:selected").next("option").prop("selected", true).change();
    });

    // Trigger change event to load map on startup
    $("#mapDropdown").change();

});
