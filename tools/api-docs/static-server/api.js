var hapi = {
    versionLocation: '/versions.json'
};

var htmlExtension = '';
var isLocal = window.location.hostname === 'localhost';

// Support legacy links
if (location.pathname.indexOf('class-reference') === -1 && location.hash) {
    var hash = location.hash.replace(/^#/, '').replace(/%23/g, '.');

    // Options: https://api.highcharts.com/highcharts#title.text
    if (/^[a-z]/.test(hash)) {
        location.href = '/' + (window.product || 'highcharts').toLowerCase() + '/' + hash + htmlExtension;

        // Object members: https://api.highcharts.com/highcharts#Series.update()
    } else if (/^[A-Z]/.test(hash)) {
        hash = hash
            .replace('Highcharts.', '')
            .replace('.', '#')
            .replace('()', '');
        location.href = '/class-reference/Highcharts.' + hash + htmlExtension;
    }
}

// Only have one index
if (
    !isLocal &&
    location.pathname.indexOf('index.html') === location.pathname.length - 10
) {
    location.href = (
        location.pathname.substring(0, location.pathname.length - 10) +
        (location.hash.length > 1 ? location.hash : '')
    );
}

hapi.ajax = function (p) {
    var props = {
        url: p.url || false,
        type: p.type || 'GET',
        dataType: p.dataType || 'json',
        headers: p.headers || {},
        success: p.success || function () { },
        error: p.error || function (error) {
            console.error(error);
        }
    },
        mime = {
            json: 'application/json',
            xml: 'application/xml',
            text: 'text/plain',
            octet: 'application/octet-stream'
        },
        r = new XMLHttpRequest();

    if (!props.url) return false;

    r.open(props.type, props.url, true);

    if (typeof props.headers['Content-Type'] === 'undefined') {
        props.headers['Content-Type'] = (
            mime[props.dataType] ||
            mime.text
        );
    }

    for (var header in props.headers) {
        r.setRequestHeader(header, props.headers[header]);
    }

    r.onreadystatechange = function () {
        if (r.readyState !== 4) {
            return;
        }
        if (r.status === 429) {
            let retryAfter = parseInt(r.getResponseHeader('Retry-After'));
            window.setTimeout(hapi.ajax, ((retryAfter || 1) * 1000), p);
            return;
        }
        if (props.dataType === 'json') {
            var json;
            try {
                json = JSON.parse(r.responseText);
            } catch (e) {
                props.error(e, r.responseText);
                return;
            }
            props.success(json);
        } else if (r.status === 200) {
            props.success(r.responseText);
        } else {
            props.error(r.responseURL + ' ' + r.statusText, r.responseText);
        }
    };

    r.send(true);
};




(function () {

    var clearSearch,
        contentNode,
        sidebar,
        splashNode;

    function tx(text, asHTML) {
        return document.createTextNode(text);
    }

    function cr(name, props, inner, asHTML) {
        var el = document.createElement(name);
        if (props) {
            if (typeof props === 'object') {
                for (var attr in props) {
                    el.setAttribute(attr, props[attr]);
                }
            } else {
                el.setAttribute('class', props);
            }
        }
        el[asHTML ? 'innerHTML' : 'innerText'] = inner || '';
        return el;
    }

    function on(target, event, callback, bubble) {
        if (!target) {
            return;
        }
        if (target.addEventListener) {
            target.addEventListener(event, callback, (bubble === true));
        } else {
            target.attachEvent('on' + event, callback, (bubble === true));
        }
    }

    function ap(target) {
        var children = (Array.prototype.slice.call(arguments));
        children.splice(0, 1);

        if (target && typeof target.appendChild !== 'undefined') {
            children.forEach(function (child) {
                if (typeof child !== 'undefined' && typeof child.appendChild !== 'undefined') {
                    target.appendChild(child);
                }
            });
        }
        return target;
    }

    function addClass(target, cls) {
        if (target.className.indexOf(cls) < 0) {
            target.className += ' ' + cls;
        }
    }

    function removeClass(target, cls) {
        if (target.className) {
            target.className = target.className.replace(' ' + cls, '');
        }
    }

    function encodeHTML(html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function defined(variable, stringCheck) {
        var defined = typeof variable !== 'undefined' && variable !== null;
        if (defined && stringCheck) {
            defined = variable !== 'undefined' && variable !== 'null';
        }
        return defined;
    }

    function pluralize(value, singular, plural) {
        return (value.toString() + (value === 1 ? singular : plural));
    }

    function autolinks(s) {
        return s
            .replace(/(styled mode)/i, function (match, p1) {
                return '<a href="https://www.highcharts.com/docs/chart-design-and-style/style-by-css">' + p1 + '</a>';
            })
            .replace(
                /href="#([\w\.]+)"/g,
                'href="../' + product.toLowerCase() + '/$1' + htmlExtension + '"'
            );
    }

    function getDefault(def) {
        if (
            typeof def.default === 'boolean' ||
            typeof def.default === 'number' ||
            (defined(def.default, true) && def.default.length) ||
            def.default === null ||
            typeof def.default !== 'undefined'
        ) {
            if (def.default === null) {
                return 'null';
            }
            return encodeHTML(def.default.toString());
        }
        return 'undefined';
    }

    function hideContent() {
        if (!splashNode) {
            return;
        }
        splashNode.style.display = contentNode.style.display = 'none';
    }

    function showContent() {
        if (!splashNode) {
            return;
        }
        splashNode.style.display = contentNode.style.display = '';
    }

    function scrollTo(container, target, duration) {
        var targetY = target.getBoundingClientRect().top,
            startingY = window.pageYOffset,
            diff = targetY - startingY - container.getBoundingClientRect().top,
            start;
        function step(timestamp) {
            if (!start) {
                start = timestamp;
            }
            var time = timestamp - start,
                percent = Math.min(time / duration, 1);

            window.scrollTo(0, startingY + diff * percent - 100);

            if (time < duration) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateTitle(member, product) {
        return document.title = member + ' | ' + product + ' API Reference';
    }

    function historyEnabled() {
        return defined(window.history) && defined(window.history.pushState);
    }

    function updateHistory(def, product) {
        var title,
            currentURL = location.pathname,
            newURL = '/' + product.toLowerCase() + '/' + def.fullname + htmlExtension;
        if (currentURL !== newURL) {
            title = updateTitle(def.fullname, product);
            if (historyEnabled()) {
                history.pushState({
                    product: product,
                    member: def.fullname,
                    hasChildren: !def.isLeaf
                }, title, def.fullname + htmlExtension);
            }
        }
    }

    function buildBody(current, isParent, callback) {
        hapi.createBody('#body', current, isParent, callback);
    }

    function highlight(targetClass, containerClass, resetClass) {
        var container = document.querySelector(containerClass),
            target = container.querySelector(targetClass),
            resets = resetClass && document.querySelectorAll(resetClass);
        if (resets) {
            // IE does not support forEach on querySelectorAll returns
            for (var i = 0; i < resets.length; i++) {
                removeClass(resets[i], 'highlighted');
            }
        }
        if (target) {
            addClass(target, 'highlighted');
            scrollTo(container, target, 300);
        }
    }

    function toClassName(optionFullName) {
        return 'option-' + (optionFullName || '').replace(/\./g, '-').replace(/\>/g, '-').replace(/\</g, '-');
    }

    function createNode(parent, def, state, origState, product) {
        var isCurrent = def.fullname === origState,
            optionClass = toClassName(def.fullname),
            node = cr('div', 'node collapsed ' + optionClass),
            arrow,
            title = cr('a', 'title', def.name + ':'),
            postfix,
            startBracket,
            dots,
            children,
            endBracket1,
            endBracket2,
            expanded = false,
            hasNext = false;

        title.href = def.fullname + htmlExtension

        node.className += def.isLeaf ? ' leaf' : ' parent';

        if (def.deprecated) {
            node.className += ' deprecated';
        }

        if (def.isLeaf) {
            console.log(def);
            postfix = cr(
                'span',
                'default type-' + (
                    defined(def.default, true) &&
                    def.typeList &&
                    def.typeList.names &&
                    def.typeList.names[0] ?
                        def.typeList.names[0]
                            .toLowerCase()
                            .replace(/[\.\<\>]+/g, '-') :
                        'undefined'
                ),
                getDefault(def),
                true
            );

        } else {

            arrow = cr('i', 'fa fa-caret-right');
            children = cr('div', 'children');
            dots = cr('span', 'dots', '...');

            if (def.supportsArray) {
                startBracket = cr('span', 'bracket start', '[{');
                endBracket1 = cr('span', 'bracket end first', '}]');
                endBracket2 = cr('span', 'bracket end second', '}]');
            } else {
                startBracket = cr('span', 'bracket start', '{');
                endBracket1 = cr('span', 'bracket end first', '}');
                endBracket2 = cr('span', 'bracket end second', '}');
            }

            if (/^series\.[a-z0-9]+$/.test(def.fullname)) {
                title.innerHTML = '{ <span class="type-item">type: "' + def.name + '",</span>';
                startBracket.innerHTML = '';
                endBracket1.innerHTML = ' }';
            }

        }

        ap(parent,
            ap(node,
                ap(
                    title,
                    arrow
                ),
                postfix,
                startBracket,
                dots,
                endBracket1,
                children,
                endBracket2
            )
        );

        function getNext(callback) {
            hapi.ajax({
                url: 'nav/' + def.fullname + '.json',
                dataType: 'json',
                success: function (data) {
                    data.children.forEach(function (def) {
                        createNode(children, def, state, origState, product);
                    });
                    hasNext = true;

                    if (callback) {
                        callback();
                    }
                }
            })
        }

        function expand() {

            function getChildrenEmHeight(children) {
                var height = (children.childNodes.length * 1.5) + 0.5;

                function child(childNode) {
                    var childrenOfChild = childNode.querySelector('.children');
                    if (childrenOfChild) {
                        height += getChildrenEmHeight(childrenOfChild);
                    }
                };

                // IE does not support forEach on childNodes
                for (var i = 0; i < children.childNodes.length; i++) {
                    child(children.childNodes[i]);
                }

                return height;
            }
            function slideDown() {
                node.className = node.className.replace(
                    'collapsed',
                    'expanded'
                );
                children.style.maxHeight = getChildrenEmHeight(children) + 'em';
                setTimeout(
                    function () {
                        children.style.maxHeight = 'none';
                    },
                    1000 * parseFloat(
                        getComputedStyle(children)['transitionDuration']
                    )
                );
            }

            if (!def.isLeaf) {
                if (!hasNext) {
                    getNext(slideDown);
                } else {
                    slideDown();
                }
            }

            updateTitle(def.fullname, product);

            expanded = true;
        }

        function collapse() {
            node.className = node.className.replace(
                'expanded',
                'collapsed'
            );

            if (children) {
                children.style.maxHeight = children.clientHeight + 'px';
            }

            expanded = false;


            if (children) {
                /*setTimeout(
                  function() {
        
                  },
                  1000 * parseFloat(
                    getComputedStyle(children)['transitionDuration']
                  )
                );*/

                children.style.maxHeight = 0;
            }

        }

        function toggle(e) {
            expanded = !expanded;
            if (expanded) return expand();
            collapse();
        }

        function loadNode() {
            if (dots) {
                dots.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            }
            highlight('.node.' + optionClass, '.sidebar', '.node');
            updateTitle(def.fullname, product);
            buildBody(def.fullname, !def.isLeaf, function () {
                if (dots) {
                    dots.innerHTML = '...';
                }
                highlight('.option.' + optionClass, 'body', '.option');
            });
        }

        on(title, 'click', function (e) {
            e.preventDefault();
            sidebar.setAttribute('expanded', false);
            loadNode();
            toggle();
            updateHistory(def, product);
        });

        if (state && state.length && state[0] === def.name) {
            expand();
            state.shift();
        }
        if (isCurrent) {
            loadNode();
        }
    }

    function getClassReferenceUrl(type) {
        var url = (
            (/(?:\<|\, )(Highcharts\..+?)[\,\>]/.exec(type) || [])[1] || type
        );
        if (url.indexOf('Highcharts.') !== 0) {
            return;
        }
        if (/(?:Array|Dictionary|Function|Options|String|Type|Value)$/.test(url)) {
            url = url.replace('Highcharts.', 'Highcharts#.');
        }
        return '/class-reference/' + url
            .replace(/\<.*\>/g, '<T>')
            .replace(/[^\w\.\#]+|\.\</gi, '_');
    }

    function getRequireList(def, parentDef) {
        var defRequires = (def.requires || []).slice();
        if (parentDef && parentDef.requires) {
            parentDef.requires.forEach(function (req) {
                if (defRequires.indexOf(req) === -1) {
                    defRequires.push(req);
                }
            });
        }
        if (defRequires.length === 0) {
            return;
        }
        requires = cr('div', 'requires');
        requireList = cr('ul');
        ap(requires,
            cr('h4', undefined, 'Requires'),
            requireList
        );
        defRequires.forEach(function (requirement) {
            ap(requireList,
                ap(
                    cr('li'),
                    cr('a', { href: ('https://code.highcharts.com/' + requirement + '.js') }, requirement)
                )
            );
        });
        return requires;
    }

    function getSampleList(def) {
        var samples,
            sampleList;
        if (def.samples) {
            samples = cr('div', 'samples');
            sampleList = cr('ul');
            ap(samples,
                cr('h4', null, 'Try it'),
                sampleList
            );
            def.samples.forEach(function (sample) {
                var a = cr('a', null, sample.name),
                    aLocal;
                a.href = 'https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/' +
                    sample.value;
                a.target = '_blank';

                if (isLocal) {
                    aLocal = cr('a', null, ' [local]');
                    aLocal.target = '_blank';
                    aLocal.href = 'http://utils.highcharts.local/samples/#view/' +
                        sample.value.replace(/\/$/, '')
                }
                ap(sampleList,
                    ap(cr('li', 'sample'),
                        a,
                        aLocal
                    )
                );
            });
        }
        return samples;
    }

    function createOption(target, def, parentDef, state, origState) {
        var option = cr('div', 'option ' + toClassName(def.fullname)),
            title = cr('h2', 'title'),
            titleLink,
            titleText = cr('span', null, def.name),
            typeHTML,
            typeHTMLClass,
            typeHTMLPath,
            types,
            defaultvalue,
            description,
            context,
            extend,
            inheritedFrom,
            deprecated,
            since,
            samples,
            see,
            seeList,
            editLink,
            defaultHTML = getDefault(def);

        description = (def.description || '') +
            (def.productdesc ? def.productdesc.value : '');
        description = cr('p', 'description', autolinks(description), true);

        if (def.isLeaf) {

            if (def.typeList) {
                types = cr('span', 'type-list', ': ');
                def.typeList.names.forEach(function (type, index) {
                    if (index) {
                        ap(types, tx(', '));
                    }
                    typeHTMLClass = (
                        'type type-' + type.toLowerCase().replace(/[\.\<\>]+/g, '-')
                    );
                    typeHTMLPath = getClassReferenceUrl(type);
                    if (typeHTMLPath) {
                        typeHTML = cr('a', { 'class': typeHTMLClass, href: typeHTMLPath }, type);
                    } else {
                        typeHTML = cr('span', typeHTMLClass, type);
                    }
                    ap(types, typeHTML);
                });
            }

            if (typeof defaultHTML !== 'undefined') {
                defaultvalue = cr(
                    'span',
                    'default type-' + (
                        def.typeList &&
                        def.typeList.names &&
                        def.typeList.names[0] ?
                            def.typeList.names[0]
                                .toLowerCase()
                                .replace(/[\.\<\>]+/g, '-') :
                            'undefined'
                    ),
                    'Defaults to <code>' + defaultHTML + '</code>.',
                    true
                );
            }

        } else {

            titleLink = cr('a');
            titleLink.href = def.fullname + htmlExtension;
            titleText = ap(titleLink, titleText);

            if (def.typeList) {
                def.typeList.names.forEach(function (type) {
                    typeHTMLPath = getClassReferenceUrl(type);
                    if (typeHTMLPath) {
                        def.see = (def.see || []);
                        def.see.push(cr('a', { href: typeHTMLPath }, type));
                    }
                });
            }

        }

        if (def.context) {
            context = cr('p', 'context', (
                'Context: <a href="/class-reference/' +
                (def.context.indexOf('.') === -1 ? 'Highcharts.' : '') + def.context +
                htmlExtension + '">' + def.context + '</a>.'
            ), true);
        }
        /*
        if (def.extends) {
          extend = cr('p', 'extends', 'Extends: ' + def.extends);
        }
        */

        if (def.inheritedFrom) {
            inheritedFrom = cr('p', 'inherited-from', 'Inherited from ' + def.inheritedFrom);
        }

        if (def.deprecated) {
            deprecated = cr('p', 'deprecated', 'Deprecated' + (
                def.deprecated === true ? '' : ' ' + def.deprecated
            ));
            option.setAttribute(
                'class', option.getAttribute('class') + ' deprecated'
            );
        }
        else if (def.since) {
            since = cr('p', 'since', 'Since ' + def.since);
        }

        samples = getSampleList(def);

        if (def.see) {
            see = cr('div', 'see');
            seeList = cr('ul');
            ap(see,
                cr('h4', null, 'See also'),
                seeList
            );
            def.see.forEach(function (seeItem) {
                if (typeof seeItem === 'object') {
                    ap(seeList,
                        ap(cr('li', 'see-item'), seeItem)
                    );
                } else {
                    ap(seeList, cr('li', 'see-item', autolinks(seeItem), true));
                }
            });
        }

        if (def.filename) {
            var fileName = def.filename;
            editLink = cr('a', 'edit', '<i class="fa fa-edit"></i>', true);
            editLink.setAttribute(
                'title',
                'Defined in ' + fileName
            )
            editLink.href = 'https://github.com/highcharts/highcharts/blob/v' +
                def.version + '/' + // TODO: version (see dumpNav() version param in index.js)
                fileName;
        }


        ap(target,
            ap(option,
                ap(title,
                    titleText,
                    types
                ),
                editLink,
                deprecated,
                since,
                description,
                defaultvalue,
                context,
                extend,
                inheritedFrom,
                getRequireList(def, parentDef),
                samples,
                see
            )
        );
    }

    hapi.createNavigation = function (options, globals, state, product) {
        globals = document.querySelector(globals);
        options = document.querySelector(options);

        function explodeState(state) {
            state = state.replace(/</g, '.').replace(/>\./g, '.');
            return state.split('.');
        }

        function build(data) {
            if (globals) {
                globals.innerHTML = '';
            }
            options.innerHTML = '';
            data.children.forEach(function (def) {
                if (globals && ['global', 'lang'].indexOf(def.fullname) >= 0) {
                    createNode(globals, def, explodeState(state), state, product);
                } else {
                    createNode(options, def, explodeState(state), state, product);
                }
            });
        }

        hapi.ajax({
            url: 'nav/index.json',
            success: function (data) {
                build(data);
            }
        });

        /**
         * TODO: Update the versions on api.highcharts.com and fix the version
         * selector. Then remove the following code.
         *
        var elSelect = document.querySelector('#version-selector');
        var elLink = elSelect.children[0];
        var removeElements = [{
          parent: elLink,
          el: elLink.children[0]
        }, {
          parent: elSelect,
          el: elSelect.children[1]
        }];
        removeElements.forEach(function (x) {
          if (x.el && x.parent) {
            x.parent.removeChild(x.el);
          }
        });
         */
    };

    hapi.createBody = function (target, state, hasChildren, callback) {
        target = document.querySelector(target);

        contentNode = document.getElementById('option-list');
        splashNode = document.getElementById('splashText');

        if (state.length > 0) {
            var origState = state;
            if (!hasChildren) {
                if (state.indexOf('.') >= 0) {
                    state = state.substr(0, state.lastIndexOf('.'));
                } else {
                    state = 'index';
                }
            }

            function build(def) {
                var optionList = document.getElementById('option-list'),
                    option = cr('div', 'option option-header ' + toClassName(state)),
                    title = cr('h1', 'title'),
                    deprecated,
                    description = def.description && cr(
                        'p',
                        'description',
                        autolinks(def.description + (def.productdesc ? def.productdesc.value : '')),
                        true
                    ),
                    see,
                    seeList,
                    typeHTMLPath;

                if (def.deprecated) {
                    deprecated = cr('p', 'deprecated', 'Deprecated' + (
                        def.deprecated === true ? '' : ' ' + def.deprecated
                    ));
                    option.setAttribute(
                        'class', option.getAttribute('class') + ' deprecated'
                    );
                }

                state.split('.').forEach(function (titlePart, i) {
                    ap(title,
                        cr('span', null, (i > 0 ? '.' : '') + titlePart)
                    );
                });

                optionList.innerHTML = '';
                clearSearch();
                addClass(target, 'loaded');

                if (def.typeList) {
                    def.typeList.names.forEach(function (type) {
                        typeHTMLPath = getClassReferenceUrl(type);
                        if (hasChildren && typeHTMLPath) {
                            def.see = (def.see || []);
                            def.see.push(cr('a', { href: typeHTMLPath }, type));
                        }
                    });
                }

                if (def.see) {
                    see = cr('div', 'see');
                    seeList = cr('ul');
                    ap(see,
                        cr('h4', null, 'See also:'),
                        seeList
                    );
                    def.see.forEach(function (seeItem) {
                        if (typeof seeItem === 'object') {
                            ap(seeList,
                                ap(cr('li', 'see-item'), seeItem)
                            );
                        } else {
                            ap(seeList, cr('li', 'see-item', autolinks(seeItem), true));
                        }
                    });
                }

                ap(target,
                    ap(optionList,
                        ap(option,
                            title,
                            deprecated,
                            description,
                            getRequireList(def),
                            getSampleList(def),
                            see
                        )
                    )
                );

                def.children.forEach(function (def) {
                    createOption(optionList, def, def, state, origState);
                });
                if (typeof callback === 'function') {
                    callback();
                }
            }

            hapi.ajax({
                url: 'nav/' + state + '.json', //undefined.json
                success: build
            });
        } else {
            removeClass(target, 'loaded');
        }
    };

    hapi.initializeDropdowns = function (dropdownQ, linkQ) {
        var dropdowns = document.querySelectorAll(dropdownQ);

        function create(dropdown) {
            var link = dropdown.querySelector(linkQ),
                expanded = false;

            dropdown.setAttribute('expanded', expanded);

            on(link, 'click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                expanded = !expanded;
                dropdown.setAttribute('expanded', expanded);
            });

            on(document, 'click', function (e) {
                expanded = false;
                dropdown.setAttribute('expanded', expanded);
            });
        }

        // IE does not support foreach on querySelectorAll results
        for (var i = 0; i < dropdowns.length; i++) {
            create(dropdowns[i]);
        }

    };

    hapi.initializeSidebar = function (sidebarQ, linkQ) {
        var link = document.querySelector(linkQ),
            expanded = false;

        sidebar = document.querySelector(sidebarQ);
        sidebar.setAttribute('expanded', expanded);

        on(link, 'click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            expanded = !expanded;
            sidebar.setAttribute('expanded', expanded);
        });

        on(sidebar, 'click', function (e) {
            e.stopPropagation();
        });

        on(window, 'click', function () {
            expanded = false;
            sidebar.setAttribute('expanded', expanded);
        });
    };

    hapi.initializeSearchBar = function (
        searchFieldQ, searchButtonQ, resultsQ, textResultsQ, indexUrl, minLength,
        maxElements
    ) {
        var searchField = document.querySelector(searchFieldQ),
            searchButton = document.querySelector(searchButtonQ),
            sideResults = indexUrl && resultsQ && document.querySelector(resultsQ),
            textResults = document.querySelector(textResultsQ),
            minLength = minLength || 2,
            maxElements = maxElements || 15,
            members = [],
            query = '',
            productPath = '/' + location.pathname.split('/')[1] + '/',
            webSearch = (
                typeof HighsoftWebSearch !== 'undefined' ?
                    new HighsoftWebSearch.Search('../websearch/') :
                    undefined
            );

        if (location.pathname.lastIndexOf('/') == (location.pathname.length - 1)) {
            searchField.focus();
        }

        function navigateSearch(e) { // listen to keyboard events

            var key = e.keyCode,
                escape = 27,
                space = 32,
                pageUp = 33,
                pageDown = 34,
                arrowUp = 38,
                arrowDown = 40,
                active = document.activeElement,
                previous = active.parentNode.previousSibling,
                next = active.parentNode.nextSibling,
                first = sideResults.firstChild;

            if (key === space && active === searchField) {
                key = (e.shiftKey ? pageUp : pageDown);
            }

            switch (key) {
                case escape:
                    e.preventDefault();
                    clearSearch();
                    break;
                case pageUp:
                case arrowUp:
                    e.preventDefault();
                    if (previous && previous.firstChild) {
                        previous.firstChild.focus();
                    } else {
                        searchField.focus();
                    }
                    break;
                case pageDown:
                case arrowDown:
                    e.preventDefault();
                    if (active === searchField && first && first.firstChild) {
                        first.firstChild.focus();
                    } else if (next && next.firstChild) {
                        next.firstChild.focus();
                    }
                    break;
            }
        }

        function searchSide(e) {
            if (members.length === 0) {
                hapi.ajax({
                    url: indexUrl,
                    success: function (data) {
                        members = data;
                        searchSide();
                    }
                });
                return;
            }
            query = searchField.value;
            if (query.length >= minLength) {
                showSideResults();
            } else {
                clearSideResults();
                clearTextResults();
                loadSideSuggestions();
            }
        }

        function searchText(e) {
            query = searchField.value;
            if (
                typeof webSearch === 'undefined' || (
                    e.keyCode !== 13 &&
                    typeof page === 'undefined'
                )) {
                return;
            }
            webSearch
                .find(query)
                .then(function (entries) {
                    return entries.filter(function (entry) {
                        return (
                            entry.url.indexOf('index.html') === -1 &&
                            (
                                entry.url.indexOf('/class-reference/') !== -1 ||
                                entry.url.indexOf(productPath) !== -1
                            )
                        );
                    });
                })
                .then(function (entries) {
                    clearTextResults();
                    showTextResults(entries);
                })
                .catch(console.error);
        }

        function clearSideResults() {
            if (!sideResults) {
                return;
            }
            sideResults.innerHTML = '';
            sideResults.style.display = 'none';
        }

        function showSideResults() {
            if (!sideResults) {
                return;
            }
            var a,
                marker = new RegExp(query, 'gi'),
                member,
                queryLC = query.toLowerCase();
            sideResults.innerHTML = '';
            for (var i = 0, ie = members.length; i < ie; ++i) {
                member = members[i];
                if (member.toLowerCase().indexOf(queryLC) >= 0) {
                    a = cr('a', null, member.replace(
                        marker, '<span class="sub-match">$&</span>'
                    ), true);
                    a.setAttribute('href', member + htmlExtension);
                    ap(sideResults, ap(cr('li', 'match'), a));
                    if (sideResults.childElementCount >= maxElements) {
                        break;
                    }
                }
            }
            if (sideResults.hasChildNodes()) {
                stopSideSuggestions();
                sideResults.style.display = 'block';
                sideResults.scrollTo(1, 0);
            } else {
                sideResults.style.display = 'none';
                loadSideSuggestions();
            }
        }

        var loadSideSuggestionsTimeout;

        function stopSideSuggestions() {
            window.clearTimeout(loadSideSuggestionsTimeout);
        }

        function loadSideSuggestions() {
            stopSideSuggestions();
            if (!sideResults || query === '') {
                return;
            }
            loadSideSuggestionsTimeout = window.setTimeout(hapi.ajax, 500, {
                dataType: 'json',
                url: (
                    'https://api.highcharts.com/search/include/js_suggest/suggest.php' +
                    '?q=' + encodeURIComponent(query) +
                    '&type=query'
                ),
                success: function (json) {
                    if (json &&
                        json.length > 0
                    ) {
                        showSideSuggestions(json);
                    }
                },
                error: function () { }
            });
        }

        function showSideSuggestions(suggestions) {
            if (!sideResults) {
                return;
            }

            var a,
                suggestion;

            for (var i = 0, ie = suggestions.length; i < ie; ++i) {
                suggestion = suggestions[i][0];
                a = cr('a', null, suggestion);
                a.setAttribute('href', '#');
                on(a, 'click', function (e) {
                    e.preventDefault();
                    sidebar.setAttribute('expanded', false);
                    query = this.innerText;
                    clearSearch();
                    searchText(e);
                });
                ap(sideResults, ap(cr('li', 'match'), a));
                if (sideResults.childElementCount >= maxElements) {
                    break;
                }
            }
            if (sideResults.hasChildNodes()) {
                sideResults.style.display = 'block';
                sideResults.scrollTo(1, 0);
            } else {
                sideResults.style.display = 'none';
            }
        }

        function clearTextResults() {
            textResults.innerHTML = '';
            textResults.style.display = 'none';
            showContent();
        }

        function showTextResults(entries, skip) {
            skip = ((skip || 0) + 10);
            stopSideSuggestions();
            var a,
                div,
                pageEntries = entries.slice((skip - 10), skip),
                entry,
                name,
                total = entries.length,
                url;
            for (var i = 0, ie = pageEntries.length; i < ie && i < maxElements; ++i) {
                entry = pageEntries[i];
                name = (entry.title || '');
                url = (entry.url || '/');
                if (name.indexOf('|') > -1) {
                    name = name.substr(0, name.indexOf('|'));
                }
                if (name.indexOf('Highcharts') === 0) {
                    name = name.substr(11);
                }
                if (name.indexOf(':') === -1) {
                    name = 'Option: ' + name;
                }
                var snippet = cr('p');
                webSearch.preview(entry).then(function (text) {
                    if (text.indexOf('Welcome') === 0 ||
                        text.indexOf('<b>') === -1
                    ) {
                        text = '';
                    }
                    snippet.innerHTML = text;
                }).catch(console.error);
                a = cr('a', null, name, true);
                a.setAttribute('href', url);
                a.setAttribute('title', 'Go to ' + url.substr(url.indexOf('//') + 2));
                div = cr('div', 'match');
                ap(textResults,
                    ap(div,
                        ap(
                            cr('h2'),
                            a
                        ),
                        snippet,
                    )
                );
            }
            if (!textResults.firstChild ||
                textResults.firstChild.nodeName !== 'SPAN'
            ) {
                textResults.insertBefore(
                    cr('h1', 'title', 'Search results for "' + encodeHTML(query) + '"'),
                    textResults.firstChild
                );
                a = cr('span', 'close', 'Close results');
                on(a, 'click', function (e) {
                    e.preventDefault();
                    clearTextResults();
                });
                textResults.insertBefore(a, textResults.firstChild);
                textResults.style.display = 'block';
                scrollTo(textResults, textResults.firstChild, 200);
            }
            var foundText = 'Found ' + pluralize(total, ' result', ' results');
            if (skip < total) {
                var divOptions = cr('div', 'options')
                var aClose = cr('span', 'close', 'Close results');
                on(aClose, 'click', function (e) {
                    e.preventDefault();
                    clearTextResults();
                });
                var aMore = cr('span', 'more', 'Show more results');
                aMore.setAttribute('title', foundText);
                on(aMore, 'click', function (e) {
                    e.preventDefault();
                    textResults.removeChild(divOptions);
                    showTextResults(entries, skip);
                });
                ap(
                    textResults,
                    ap(
                        divOptions,
                        aClose,
                        aMore
                    )
                );
            } else {
                ap(
                    textResults,
                    cr('p', null, foundText)
                );
            }
            hideContent();
        }

        clearSearch = function () {
            if (sideResults) {
                searchField.value = '';
            }
            clearSideResults();
            clearTextResults();
        }

        on(searchField, 'keydown', searchText);
        on(searchButton, 'click', searchText);

        if (sideResults) {
            on(searchField.parentNode, 'keydown', navigateSearch, true);
            on(searchField, 'input', searchSide);
        }
    };

    /**
     * Adds simulation of history navigation by detecting changes to the history
     * state.
     *
     * @return [undefined] - nothing
     */
    hapi.simulateHistory = function () {

        if (historyEnabled()) {
            /**
             * Updates the history with memberClick().
             *
             * If it is stored in the history state, the page will be used to
             * update. If not, the global PAGE variable will be used.
             *
             * @param e - the event that triggered the history update
             */
            window.onpopstate = function (e) {
                var state = e.state;
                if (state !== undefined &&
                    state !== null &&
                    typeof state.member !== 'undefined' &&
                    typeof state.product !== 'undefined'
                ) {
                    hapi.createNavigation('#options', '#global-options', state.member, state.product);
                }
            }
        }
    };

    hapi.populateVersions = function () {
        var body = document.getElementById('version-selector-body'),
            vselector = document.getElementById('version-selector')
            ;

        body.innerHTML = 'Loading..';

        function addGroup(oname) {
            var gnode = cr('ul', 'group-list'),
                name
                ;

            // Make sure the it's capitalized. Could do it with CSS,
            // but text-transform support is a bit iffy sometimes.
            name = oname[0].toUpperCase() + oname.substr(1);

            function addChild(version) {
                var inode = cr('li', 'version'),
                    link = cr('a', '', version)
                    ;

                link.href = '/' + oname + '/' + version;

                on(link, 'click', function () {
                    hapi.switchVersion(this);
                });

                ap(gnode, ap(inode, link));

                return {
                    node: inode
                };
            }

            ap(body,
                ap(cr('li', 'group'),
                    cr('p', '', name),
                    gnode
                )
            );

            return {
                node: gnode,
                addChild: addChild
            };
        }

        function load(data) {
            vselector.style.display = '';
            body.innerHTML = '';
            Object.keys(data).forEach(function (group) {
                var groupIns = addGroup(group);
                data[group].forEach(function (version) {
                    groupIns.addChild(version);
                });
            });
        }

        vselector.style.display = 'none';

        hapi.ajax({
            url: hapi.versionLocation,
            success: load
        });
    };

})();
