/* global window, document */

(function () {
    function initializeVisualSetup() {
        if (typeof window === 'undefined' || !window.Highcharts) {
            return false;
        }

        var Highcharts = window.Highcharts;

        function deepClone(obj, seen) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }

            seen = seen || new WeakMap();

            if (seen.has(obj)) {
                return seen.get(obj);
            }

            if (Array.isArray(obj)) {
                var arr = [];
                seen.set(obj, arr);
                for (var i = 0; i < obj.length; i++) {
                    arr[i] = deepClone(obj[i], seen);
                }
                return arr;
            }

            var clone = {};
            seen.set(obj, clone);

            var keys = Object.keys(obj);
            for (var k = 0; k < keys.length; k++) {
                var key = keys[k];
                var value = obj[key];
                clone[key] = typeof value === 'function' ?
                    value :
                    deepClone(value, seen);
            }

            var allKeys = Reflect.ownKeys(obj);
            for (var j = 0; j < allKeys.length; j++) {
                var ownKey = allKeys[j];
                if (
                    !Object.prototype.hasOwnProperty.call(clone, ownKey) &&
                    Object.prototype.hasOwnProperty.call(obj, ownKey)
                ) {
                    clone[ownKey] = obj[ownKey];
                }
            }

            return clone;
        }

        Highcharts.useSerialIds(true);

        if (!Highcharts.clonedDefaultOptions) {
            Highcharts.clonedDefaultOptions =
                deepClone(Highcharts.defaultOptions);
        }
        if (!Highcharts.callbacksRaw) {
            Highcharts.callbacksRaw =
                Highcharts.Chart.prototype.callbacks.slice(0);
        }
        if (!Highcharts.radialDefaultOptionsRaw) {
            Highcharts.radialDefaultOptionsRaw = JSON.stringify(
                Highcharts.RadialAxis.radialDefaultOptions
            );
        }
        if (!Highcharts.defaultOptionsRaw) {
            Highcharts.defaultOptionsRaw =
                JSON.stringify(Highcharts.defaultOptions);
        }

        var cleanupMode = 'fast';
        var protoSnapshots = null;

        function createPrototypeSnapshot() {
            var snapshots = {};
            var keys = Object.keys(Highcharts);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var candidate = Highcharts[key];

                if (typeof candidate === 'function' && candidate.prototype) {
                    var source = candidate.prototype;
                    var snapshot = {};
                    var sourceKeys = Object.keys(source);

                    for (var j = 0; j < sourceKeys.length; j++) {
                        var prop = sourceKeys[j];
                        var value = source[prop];

                        if (
                            typeof value !== 'object' &&
                            value
                        ) {
                            snapshot[prop] = value;
                        }
                    }

                    if (Object.keys(snapshot).length) {
                        snapshots[key] = snapshot;
                    }
                }
            }

            return snapshots;
        }

        function ensurePrototypeSnapshots() {
            if (!protoSnapshots) {
                protoSnapshots = createPrototypeSnapshot();
            }
        }

        var wrappedFunctions = [];
        var origWrap = Highcharts.wrap;
        Highcharts.wrap = function (ob, prop, fn) {
            wrappedFunctions.push([ob, prop, ob[prop]]);
            origWrap(ob, prop, fn);
        };

        var addedEvents = [];
        var origAddEvent = Highcharts.addEvent;
        Highcharts.addEvent = function (el, type, fn, options) {
            var unbinder = origAddEvent(el, type, fn, options);
            if (typeof el === 'function' && el.prototype) {
                addedEvents.push(unbinder);
            }
            return unbinder;
        };

        var origSetOptions = Highcharts.setOptions;
        var optionsDirty = false;
        var ignoreNextSetOptions = 0;

        Highcharts.setOptions = function (...args) {
            var result = origSetOptions.apply(this, args);
            if (ignoreNextSetOptions > 0) {
                ignoreNextSetOptions--;
            } else {
                optionsDirty = true;
            }
            return result;
        };

        function markOptionsClean() {
            optionsDirty = false;
            ignoreNextSetOptions = 0;
        }

        function restorePrototypes() {
            var keys = Object.keys(protoSnapshots);

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var snapshot = protoSnapshots[key];
                var constructor = Highcharts[key];

                if (!constructor || !constructor.prototype) {
                    continue;
                }

                var target = constructor.prototype;
                var snapshotKeys = Object.keys(snapshot);

                for (var j = 0; j < snapshotKeys.length; j++) {
                    var prop = snapshotKeys[j];
                    target[prop] = snapshot[prop];
                }
            }
        }

        function restoreWrappedFunctions() {
            while (wrappedFunctions.length) {
                var args = wrappedFunctions.pop();
                var obj = args[0];
                var prop = args[1];
                var fn = args[2];

                obj[prop] = fn;
            }
        }

        function restoreAddedEvents() {
            while (addedEvents.length) {
                addedEvents.pop()();
            }
        }
        const containerSelector = 'div[data-test-container]';

        function cleanupCharts() {
            var container = document.querySelector(containerSelector);
            if (container) {
                var containerStyle = container.style;
                containerStyle.display = '';
                containerStyle.float = '';
                containerStyle.width = '';
                containerStyle.maxWidth = '';
                containerStyle.minWidth = '';
                containerStyle.height = '';
                containerStyle.maxHeight = '';
                containerStyle.minHeight = '';
                containerStyle.position = '';
                containerStyle.bottom = '';
                containerStyle.left = '';
                containerStyle.right = '';
                containerStyle.top = '';
                containerStyle.zIndex = '';
            }

            var charts = Highcharts.charts;

            for (var i = 0; i < charts.length; i++) {
                const currentChart = charts[i];

                if (
                    currentChart &&
                    currentChart.destroy &&
                    currentChart.renderer
                ) {
                    currentChart.destroy();
                }
            }

            Highcharts.charts.length = 0;

            var svgs = document.getElementsByTagName('svg');
            for (var j = svgs.length - 1; j >= 0; j--) {
                var svg = svgs[j];
                if (!svg.isTemplate && svg.parentNode) {
                    svg.parentNode.removeChild(svg);
                }
            }

            Highcharts.Chart.prototype.callbacks =
                Highcharts.callbacksRaw.slice(0);
        }

        function resetDefaultOptionsIfNeeded() {
            if (!optionsDirty) {
                return;
            }

            var defaultOptionsClonedFromOriginal = deepClone(
                Highcharts.clonedDefaultOptions
            );

            function deleteAddedProperties(copy, original) {
                Highcharts.objectEach(copy, function (value, key) {
                    if (
                        Highcharts.isObject(value, true) &&
                        Highcharts.isObject(original[key], true) &&
                        !Highcharts.isClass(value) &&
                        !Highcharts.isDOMElement(value)
                    ) {
                        deleteAddedProperties(copy[key], original[key]);
                    } else if (
                        typeof value !== 'function' &&
                        !(key in original)
                    ) {
                        delete copy[key];
                    }
                });
            }

            deleteAddedProperties(
                Highcharts.defaultOptions,
                defaultOptionsClonedFromOriginal
            );

            delete Highcharts.defaultOptions.global.getTimezoneOffset;
            delete Highcharts.defaultOptions.time.getTimezoneOffset;

            ignoreNextSetOptions++;
            origSetOptions.call(Highcharts, Highcharts.merge(
                defaultOptionsClonedFromOriginal
            ));
            ignoreNextSetOptions = Math.max(0, ignoreNextSetOptions - 1);

            Highcharts.RadialAxis.radialDefaultOptions = JSON.parse(
                Highcharts.radialDefaultOptionsRaw
            );

            Highcharts.time = new Highcharts.Time(Highcharts.merge(
                Highcharts.defaultOptions.global,
                Highcharts.defaultOptions.time
            ));

            markOptionsClean();
        }

        window.setHCStyles = function (chart) {
            var styleElementID = 'test-hc-styles';
            var styleElement = document.getElementById(styleElementID);

            if (!chart.styledMode) {
                if (styleElement) {
                    styleElement.remove();
                }
                return;
            }

            if (chart.boosted) {
                return;
            }

            if (!styleElement && window.highchartsCSS) {
                styleElement = document.createElement('style');
                styleElement.id = styleElementID;
                styleElement.appendChild(
                    document.createTextNode(window.highchartsCSS)
                );
                document.head.appendChild(styleElement);
            }
        };

        Highcharts.prepareShot = function (chart) {
            if (!chart || !chart.series || !chart.series[0]) {
                return;
            }

            var points = chart.series[0].nodes ||
                chart.series[0].points || [];
            var i = points.length;

            while (i--) {
                var point = points[i];
                if (
                    point &&
                    point.visible &&
                    !point.isNull &&
                    !(
                        point.shapeArgs &&
                        point.shapeArgs.d &&
                        point.shapeArgs.d.length === 0
                    ) &&
                    typeof point.onMouseOver === 'function'
                ) {
                    point.onMouseOver();
                    break;
                }
            }

            var foreignObjects = chart.container.querySelectorAll('foreignObject br');
            Array.prototype.forEach.call(foreignObjects, function (br) {
                var div = document.createElement('div');
                br.parentNode.replaceChild(div, br);
            });

            var images = chart.container.querySelectorAll('foreignObject img');
            Array.prototype.forEach.call(images, function (img) {
                var div = document.createElement('div');
                div.style.width = '16px';
                div.style.height = '16px';
                div.style.position = 'inline-block';
                div.style.backgroundColor = '#ddd';
                img.parentNode.replaceChild(div, img);
            });

            const description = document.querySelector('.highcharts-description');
            if (description) {
                description.style.display = 'none';
            }

        };

        var randomValues = [
            0.14102989272214472, 0.0351817375048995, 0.10094573209062219,
            0.35990892769768834, 0.7690574480220675, 0.16634021210484207,
            0.3944594960194081, 0.7656398438848555, 0.27706647920422256,
            0.5681763959582895, 0.513730650767684, 0.26344996923580766,
            0.09001278411597013, 0.2977627406362444, 0.6982127586379647,
            0.9593012358527631, 0.8456065070349723, 0.26248381356708705,
            0.12872424302622676, 0.25530692492611706, 0.9969052199739963,
            0.09259856841526926, 0.9022860133554786, 0.3393681487068534,
            0.41671016393229365, 0.10582929337397218, 0.1322793234139681,
            0.595869708340615, 0.050670077092945576, 0.8613549116998911,
            0.17356411134824157, 0.16447093593887985, 0.44514468451961875,
            0.15736589767038822, 0.8677479331381619, 0.30932203005068004,
            0.6120233973488212, 0.001859797164797783, 0.7689258102327585,
            0.7421043077483773, 0.7548440918326378, 0.9667320610024035,
            0.13654314493760467, 0.6277681242208928, 0.002858637133613229,
            0.6877673089038581, 0.44036358245648444, 0.3101970909629017,
            0.013212101766839623, 0.7115063068922609, 0.2931885647121817,
            0.5031651991885155, 0.8921459852717817, 0.547999506117776,
            0.010382920736446977, 0.9862914837431163, 0.9629317701328546,
            0.07685352209955454, 0.2859949553385377, 0.5578324059024453,
            0.7765828191768378, 0.1696563793811947, 0.34366130153648555,
            0.11959927808493376, 0.8898638435639441, 0.8963573810178787,
            0.332408863119781, 0.27137733018025756, 0.3066735703032464,
            0.2789501305669546, 0.4567076754756272, 0.09539463231340051,
            0.9158625246491283, 0.2145260546822101, 0.8913846455980092,
            0.22340057184919715, 0.09033847553655505, 0.49042539740912616,
            0.4070818084292114, 0.5827512110117823, 0.1993762720376253,
            0.9264022477436811, 0.3290765874553472, 0.07792594563215971,
            0.7663758248090744, 0.4329648329876363, 0.10257583996281028,
            0.8170149670913815, 0.41387700103223324, 0.7504217880778015,
            0.08603733032941818, 0.17256441875360906, 0.4064991301856935,
            0.829071992309764, 0.6997416105587035, 0.2686419754754752,
            0.36025605257600546, 0.6014082923065871, 0.9787689209915698,
            0.016065671807155013
        ];

        Math.randomCursor = 0;
        Math.random = function () {
            var value = randomValues[Math.randomCursor % randomValues.length];
            Math.randomCursor++;
            return value;
        };

        function configure(options) {
            options = options || {};
            var nextMode = typeof options.mode === 'string' ?
                options.mode.toLowerCase() :
                cleanupMode;

            if (nextMode !== 'fast' && nextMode !== 'strict') {
                nextMode = cleanupMode;
            }

            var previousMode = cleanupMode;
            cleanupMode = nextMode;

            if (cleanupMode === 'strict' && previousMode !== 'strict') {
                protoSnapshots = createPrototypeSnapshot();
            } else if (cleanupMode !== 'strict') {
                protoSnapshots = null;
            }

            if (window.HCVisualSetup) {
                window.HCVisualSetup.mode = cleanupMode;
            }

            return cleanupMode;
        }

        window.HCVisualSetup = {
            beforeSample() {
                Math.randomCursor = 0;
                ignoreNextSetOptions++;
                if (cleanupMode === 'strict') {
                    ensurePrototypeSnapshots();
                }
            },
            afterSample() {
                restoreWrappedFunctions();
                restoreAddedEvents();
                if (cleanupMode === 'strict') {
                    restorePrototypes();
                }
                cleanupCharts();
                resetDefaultOptionsIfNeeded();
                markOptionsClean();
            },
            markOptionsClean,
            configure,
            deepClone,
            mode: cleanupMode,
            initialized: true
        };

        return true;
    }

    function attemptInitialization(attempt) {
        if (initializeVisualSetup()) {
            return;
        }

        if (attempt > 20) {
            if (
                typeof window !== 'undefined' &&
                window.console &&
                typeof window.console.warn === 'function'
            ) {
                window.console.warn(
                    '[visual-setup] Highcharts not ready for initialization'
                );
            }
            return;
        }

        setTimeout(function () {
            attemptInitialization(attempt + 1);
        }, 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            attemptInitialization(0);
        });
    } else {
        attemptInitialization(0);
    }
}());
