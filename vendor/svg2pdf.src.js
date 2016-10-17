/** @preserve
The MIT License (MIT)

Copyright (c) 2015 yWorks GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Renders an svg element to a jsPDF document.
 * For accurate results a DOM document is required (mainly used for text size measurement and image format conversion)
 * @param element {HTMLElement} The svg element, which will be cloned, so the original stays unchanged.
 * @param pdf {jsPDF} The jsPDF object.
 * @param options {object} An object that may contain render options. Currently supported are:
 *                         scale: The global factor by which everything is scaled.
 *                         xOffset, yOffset: Offsets that are added to every coordinate AFTER scaling (They are not
 *                            influenced by the scale attribute).
 */
(function (global) {
  var RGBColor;

  var _pdf; // jsPDF pdf-document

  var cToQ = 2 / 3; // ratio to convert quadratic bezier curves to cubic ones

  // pathSegList is marked deprecated in chrome, so parse the d attribute manually if necessary
  var getPathSegList = function (node) {
    var pathSegList = node.pathSegList;
    if (pathSegList) {
      return pathSegList;
    }

    pathSegList = [];

    var d = node.getAttribute("d");

    var regex = /([a-df-zA-DF-Z])([^a-df-zA-DF-Z]*)/g,
        match;
    while (match = regex.exec(d)) {
      var coords = parseFloats(match[2]);

      var type = match[1];
      var length = "zZ".indexOf(type) >= 0 ? 0 :
          "hHvV".indexOf(type) >= 0  ? 1 :
          "mMlLtT".indexOf(type) >= 0  ? 2 :
          "sSqQ".indexOf(type) >= 0  ? 4 :
          "cC".indexOf(type) >= 0  ? 6 : -1;

      var i = 0;
      do {
        var pathSeg = {pathSegTypeAsLetter: type};
        switch (type) {
          case "h":
          case "H":
            pathSeg.x = coords[i];
            break;

          case "v":
          case "V":
            pathSeg.y = coords[i];
            break;

          case "c":
          case "C":
            pathSeg.x1 = coords[i + length - 6];
            pathSeg.y1 = coords[i + length - 5];
          case "s":
          case "S":
            pathSeg.x2 = coords[i + length - 4];
            pathSeg.y2 = coords[i + length - 3];
          case "t":
          case "T":
          case "l":
          case "L":
          case "m":
          case "M":
            pathSeg.x = coords[i + length - 2];
            pathSeg.y = coords[i + length - 1];
            break;

          case "q":
          case "Q":
            pathSeg.x1 = coords[i];
            pathSeg.y1 = coords[i + 1];
            pathSeg.x = coords[i + 2];
            pathSeg.y = coords[i + 3];
            break;
            // TODO: a,A
        }

        pathSegList.push(pathSeg);
        i += length;
      } while(i < coords.length);
    }

    pathSegList.getItem = function (i) {
      return this[i]
    };
    pathSegList.numberOfItems = pathSegList.length;

    return pathSegList;
  };

  // returns an attribute of a node, either from the node directly or from css
  var getAttribute = function (node, propertyNode, propertyCss) {
    propertyCss = propertyCss || propertyNode;
    return node.getAttribute(propertyNode) || node.style[propertyCss];
  };

  var nodeIs = function (node, tagsString) {
    return tagsString.split(",").indexOf(node.tagName.toLowerCase()) >= 0;
  };

  var forEachChild = function (node, fn) {
    // copy list of children, as the original might be modified
    var children = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      var childNode = node.childNodes[i];
      if (childNode.nodeName.charAt(0) !== "#")
        children.push(childNode);
    }
    for (i = 0; i < children.length; i++) {
      fn(i, children[i]);
    }
  };

  var getAngle = function (from, to) {
    return Math.atan2(to[1] - from[1], to[0] - from[0]);
  };

  // mirrors p1 at p2
  var mirrorPoint = function (p1, p2) {
    var dx = p2[0] - p1[0];
    var dy = p2[1] - p1[1];

    return [p1[0] + 2 * dx, p1[1] + 2 * dy];
  };

  // transforms a cubic bezier control point to a quadratic one: returns from + (2/3) * (to - from)
  var toCubic = function (from, to) {
    return [cToQ * (to[0] - from[0]) + from[0], cToQ * (to[1] - from[1]) + from[1]];
  };

  // extracts a control point from a previous path segment (for t,T,s,S segments)
  var getControlPointFromPrevious = function (i, from, list, prevX, prevY) {
    var prev = list.getItem(i - 1);
    var p2;
    if (i > 0 && (prev.pathSegTypeAsLetter === "C" || prev.pathSegTypeAsLetter === "S")) {
      p2 = mirrorPoint([prev.x2, prev.y2], from);
    } else if (i > 0 && (prev.pathSegTypeAsLetter === "c" || prev.pathSegTypeAsLetter === "s")) {
      p2 = mirrorPoint([prev.x2 + prevX, prev.y2 + prevY], from);
    } else {
      p2 = [from[0], from[1]];
    }
    return p2;
  };

  // an id prefix to handle duplicate ids
  var SvgPrefix = function (prefix) {
    this.prefix = prefix;
    this.id = 0;
    this.nextChild = function () {
      return new SvgPrefix("_" + this.id++ + "_" + this.get());
    };
    this.get = function () {
      return this.prefix;
    }
  };

  // returns the node for the specified id or incrementally removes prefixes to search "higher" levels
  var getFromDefs = function (id, defs) {
    var regExp = /_\d+_/;
    while (!defs[id] && regExp.exec(id)) {
      id = id.replace(regExp, "");
    }
    return defs[id];
  };

  // replace any newline characters by space and trim
  var removeNewlinesAndTrim = function (str) {
    return str.replace(/[\n\s\r]+/, " ").trim();
  };

  // clones the defs object (or basically any object)
  var cloneDefs = function (defs) {
    var clone = {};
    for (var key in defs) {
      if (defs.hasOwnProperty(key)) {
        clone[key] = defs[key];
      }
    }
    return clone;
  };

  // computes the transform directly applied at the node (such as viewbox scaling and the "transform" atrribute)
  // x,y,cx,cy,r,... are omitted
  var computeNodeTransform = function (node) {
    var height, width, viewBoxHeight, viewBoxWidth, bounds, viewBox, y, x;
    var nodeTransform = _pdf.unitMatrix;
    if (nodeIs(node, "svg,g")) {
      x = parseFloat(node.getAttribute("x")) || 0;
      y = parseFloat(node.getAttribute("y")) || 0;

      // jquery doesn't like camelCase notation...
      viewBox = node.getAttribute("viewBox");
      if (viewBox) {
        bounds = parseFloats(viewBox);
        viewBoxWidth = bounds[2] - bounds[0];
        viewBoxHeight = bounds[3] - bounds[1];
        width = parseFloat(node.getAttribute("width")) || viewBoxWidth;
        height = parseFloat(node.getAttribute("height")) || viewBoxHeight;
        nodeTransform = new _pdf.Matrix(width / viewBoxWidth, 0, 0, height / viewBoxHeight, x - bounds[0], y - bounds[1]);
      } else {
        nodeTransform = new _pdf.Matrix(1, 0, 0, 1, x, y);
      }
    } else if (nodeIs(node, "marker")) {
      x = -parseFloat(node.getAttribute("refX")) || 0;
      y = -parseFloat(node.getAttribute("refY")) || 0;

      viewBox = node.getAttribute("viewBox");
      if (viewBox) {
        bounds = parseFloats(viewBox);
        viewBoxWidth = bounds[2] - bounds[0];
        viewBoxHeight = bounds[3] - bounds[1];
        width = parseFloat(node.getAttribute("markerWidth")) || viewBoxWidth;
        height = parseFloat(node.getAttribute("markerHeight")) || viewBoxHeight;

        var s = new _pdf.Matrix(width / viewBoxWidth, 0, 0, height / viewBoxHeight, 0, 0);
        var t = new _pdf.Matrix(1, 0, 0, 1, x, y);
        nodeTransform = _pdf.matrixMult(t, s);
      } else {
        nodeTransform = new _pdf.Matrix(1, 0, 0, 1, x, y);
      }
    }

    var transformString = node.getAttribute("transform");
    if (!transformString)
      return nodeTransform;
    else
      return _pdf.matrixMult(nodeTransform, parseTransform(transformString));
  };

  // parses the "points" string used by polygons and returns an array of points
  var parsePointsString = function (string) {
    var floats = parseFloats(string);
    var result = [];
    for (var i = 0; i < floats.length - 1; i += 2) {
      var x = floats[i];
      var y = floats[i + 1];
      result.push([x, y]);
    }
    return result;
  };

  // parses the "transform" string
  var parseTransform = function (transformString) {
    if (!transformString)
      return _pdf.unitMatrix;

    var mRegex = /^\s*matrix\(([^\)]+)\)\s*/,
        tRegex = /^\s*translate\(([^\)]+)\)\s*/,
        rRegex = /^\s*rotate\(([^\)]+)\)\s*/,
        sRegex = /^\s*scale\(([^\)]+)\)\s*/,
        sXRegex = /^\s*skewX\(([^\)]+)\)\s*/,
        sYRegex = /^\s*skewY\(([^\)]+)\)\s*/;

    var resultMatrix = _pdf.unitMatrix, m;

    while (transformString.length > 0) {
      var match = mRegex.exec(transformString);
      if (match) {
        m = parseFloats(match[1]);
        resultMatrix = _pdf.matrixMult(new _pdf.Matrix(m[0], m[1], m[2], m[3], m[4], m[5]), resultMatrix);
        transformString = transformString.substr(match[0].length);
      }
      match = rRegex.exec(transformString);
      if (match) {
        m = parseFloats(match[1]);
        var a = Math.PI * m[0] / 180;
        resultMatrix = _pdf.matrixMult(new _pdf.Matrix(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0), resultMatrix);
        if (m[1] && m[2]) {
          var t1 = new _pdf.Matrix(1, 0, 0, 1, m[1], m[2]);
          var t2 = new _pdf.Matrix(1, 0, 0, 1, -m[1], -m[2]);
          resultMatrix = _pdf.matrixMult(t2, _pdf.matrixMult(resultMatrix, t1));
        }
        transformString = transformString.substr(match[0].length);
      }
      match = tRegex.exec(transformString);
      if (match) {
        m = parseFloats(match[1]);
        resultMatrix = _pdf.matrixMult(new _pdf.Matrix(1, 0, 0, 1, m[0], m[1] || 0), resultMatrix);
        transformString = transformString.substr(match[0].length);
      }
      match = sRegex.exec(transformString);
      if (match) {
        m = parseFloats(match[1]);
        if (!m[1])
          m[1] = m[0];
        resultMatrix = _pdf.matrixMult(new _pdf.Matrix(m[0], 0, 0, m[1], 0, 0), resultMatrix);
        transformString = transformString.substr(match[0].length);
      }
      match = sXRegex.exec(transformString);
      if (match) {
        m = parseFloat(match[1]);
        resultMatrix = _pdf.matrixMult(new _pdf.Matrix(1, 0, Math.tan(m), 1, 0, 0), resultMatrix);
        transformString = transformString.substr(match[0].length);
      }
      match = sYRegex.exec(transformString);
      if (match) {
        m = parseFloat(match[1]);
        resultMatrix = _pdf.matrixMult(new _pdf.Matrix(1, Math.tan(m), 0, 1, 0, 0), resultMatrix);
        transformString = transformString.substr(match[0].length);
      }
    }
    return resultMatrix;
  };

  // parses a comma, sign and/or whitespace separated string of floats and returns the single floats in an array
  var parseFloats = function (str) {
    var floats = [], match,
        regex = /[+-]?(?:(?:\d+\.?\d*)|(?:\d*\.?\d+))(?:[eE][+-]?\d+)?/g;
    while(match = regex.exec(str)) {
      floats.push(parseFloat(match[0]));
    }
    return floats;
  };

  // extends RGBColor by rgba colors as RGBColor is not capable of it
  var parseColor = function (colorString) {
    var match = /\s*rgba\(((?:[^,\)]*,){3}[^,\)]*)\)\s*/.exec(colorString);
    if (match) {
      var floats = parseFloats(match[1]);
      var color = new RGBColor("rgb(" + floats.slice(0,3).join(",") + ")");
      color.a = floats[3];
      return color;
    } else {
      return new RGBColor(colorString);
    }
  };

  // multiplies a vector with a matrix: vec' = vec * matrix
  var multVecMatrix = function (vec, matrix) {
    var x = vec[0];
    var y = vec[1];
    return [
      matrix.a * x + matrix.c * y + matrix.e,
      matrix.b * x + matrix.d * y + matrix.f
    ];
  };

  // returns the untransformed bounding box [x, y, width, height] of an svg element (quite expensive for path and polygon objects, as
  // the whole points/d-string has to be processed)
  var getUntransformedBBox = function (node) {
    var i, minX, minY, maxX, maxY, viewBox, vb, boundingBox;
    var pf = parseFloat;

    if (nodeIs(node, "polygon")) {
      var points = parsePointsString(node.getAttribute("points"));
      minX = Number.POSITIVE_INFINITY;
      minY = Number.POSITIVE_INFINITY;
      maxX = Number.NEGATIVE_INFINITY;
      maxY = Number.NEGATIVE_INFINITY;
      for (i = 0; i < points.length; i++) {
        var point = points[i];
        minX = Math.min(minX, point[0]);
        maxX = Math.max(maxX, point[0]);
        minY = Math.min(minY, point[1]);
        maxY = Math.max(maxY, point[1]);
      }
      boundingBox = [
        minX,
        minY,
        maxX - minX,
        maxY - minY
      ];
    } else if (nodeIs(node, "path")) {
      var list = getPathSegList(node);
      minX = Number.POSITIVE_INFINITY;
      minY = Number.POSITIVE_INFINITY;
      maxX = Number.NEGATIVE_INFINITY;
      maxY = Number.NEGATIVE_INFINITY;
      var x = 0, y = 0;
      var prevX, prevY, newX, newY;
      var p2, p3, to;
      for (i = 0; i < list.numberOfItems; i++) {
        var seg = list.getItem(i);
        var cmd = seg.pathSegTypeAsLetter;
        switch (cmd) {
          case "H":
            newX = seg.x;
            newY = y;
            break;
          case "h":
            newX = seg.x + x;
            newY = y;
            break;
          case "V":
            newX = x;
            newY = seg.y;
            break;
          case "v":
            newX = x;
            newY = seg.y + y;
            break;
          case "C":
            p2 = [seg.x1, seg.y1];
            p3 = [seg.x2, seg.y2];
            to = [seg.x, seg.y];
            break;
          case "c":
            p2 = [seg.x1 + x, seg.y1 + y];
            p3 = [seg.x2 + x, seg.y2 + y];
            to = [seg.x + x, seg.y + y];
            break;
          case "S":
            p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p3 = [seg.x2, seg.y2];
            to = [seg.x, seg.y];
            break;
          case "s":
            p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p3 = [seg.x2 + x, seg.y2 + y];
            to = [seg.x + x, seg.y + y];
            break;
          case "Q":
            pf = [seg.x1, seg.y1];
            p2 = toCubic([x, y], pf);
            p3 = toCubic([seg.x, seg.y], pf);
            to = [seg.x, seg.y];
            break;
          case "q":
            pf = [seg.x1 + x, seg.y1 + y];
            p2 = toCubic([x, y], pf);
            p3 = toCubic([x + seg.x, y + seg.y], pf);
            to = [seg.x + x, seg.y + y];
            break;
          case "T":
            p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p2 = toCubic([x, y], pf);
            p3 = toCubic([seg.x, seg.y], pf);
            to = [seg.x, seg.y];
            break;
          case "t":
            pf = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p2 = toCubic([x, y], pf);
            p3 = toCubic([x + seg.x, y + seg.y], pf);
            to = [seg.x + x, seg.y + y];
            break;
          // TODO: A,a
        }
        if ("sScCqQtT".indexOf(cmd) >= 0) {
          prevX = x;
          prevY = y;
        }
        if ("MLCSQT".indexOf(cmd) >= 0) {
          x = seg.x;
          y = seg.y;
        } else if ("mlcsqt".indexOf(cmd) >= 0) {
          x = seg.x + x;
          y = seg.y + y;
        } else if ("zZ".indexOf(cmd) < 0) {
          x = newX;
          y = newY;
        }
        if ("CSQTcsqt".indexOf(cmd) >= 0) {
          minX = Math.min(minX, x, p2[0], p3[0], to[0]);
          maxX = Math.max(maxX, x, p2[0], p3[0], to[0]);
          minY = Math.min(minY, y, p2[1], p3[1], to[1]);
          maxY = Math.max(maxY, y, p2[1], p3[1], to[1]);
        } else {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
      boundingBox = [
        minX,
        minY,
        maxX - minX,
        maxY - minY
      ];
    } else if (nodeIs(node, "svg")) {
      viewBox = node.getAttribute("viewBox");
      if (viewBox) {
        vb = parseFloats(viewBox);
      }
      return [
        pf(node.getAttribute("x")) || (vb && vb[0]) || 0,
        pf(node.getAttribute("y")) || (vb && vb[1]) || 0,
        pf(node.getAttribute("width")) || (vb && vb[2]) || 0,
        pf(node.getAttribute("height")) || (vb && vb[3]) || 0
      ];
    } else if (nodeIs(node, "g")) {
      boundingBox = [0, 0, 0, 0];
      forEachChild(node, function (i, node) {
        var nodeBox = getUntransformedBBox(node);
        boundingBox = [
            Math.min(boundingBox[0], nodeBox[0]),
            Math.min(boundingBox[1], nodeBox[1]),
            Math.max(boundingBox[0] + boundingBox[2], nodeBox[0] + nodeBox[2]) - Math.min(boundingBox[0], nodeBox[0]),
            Math.max(boundingBox[1] + boundingBox[3], nodeBox[1] + nodeBox[3]) - Math.min(boundingBox[1], nodeBox[1])
        ];
      });
    } else if (nodeIs(node, "marker")) {
      viewBox = node.getAttribute("viewBox");
      if (viewBox) {
        vb = parseFloats(viewBox);
      }
      return [
        (vb && vb[0]) || 0,
        (vb && vb[1]) || 0,
        (vb && vb[2]) || pf(node.getAttribute("marker-width")) || 0,
        (vb && vb[3]) || pf(node.getAttribute("marker-height")) || 0
      ];
    } else if (nodeIs(node, "pattern")) {
      return [
          pf(node.getAttribute("x")) || 0,
          pf(node.getAttribute("y")) || 0,
          pf(node.getAttribute("width")) || 0,
          pf(node.getAttribute("height")) || 0
      ]
    } else {
      // TODO: check if there are other possible coordinate attributes
      var x1 = pf(node.getAttribute("x1")) || pf(node.getAttribute("x")) || pf((node.getAttribute("cx")) - pf(node.getAttribute("r"))) || 0;
      var x2 = pf(node.getAttribute("x2")) || (x1 + pf(node.getAttribute("width"))) || (pf(node.getAttribute("cx")) + pf(node.getAttribute("r"))) || 0;
      var y1 = pf(node.getAttribute("y1")) || pf(node.getAttribute("y")) || (pf(node.getAttribute("cy")) - pf(node.getAttribute("r"))) || 0;
      var y2 = pf(node.getAttribute("y2")) || (y1 + pf(node.getAttribute("height"))) || (pf(node.getAttribute("cy")) + pf(node.getAttribute("r"))) || 0;
      boundingBox = [
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.max(x1, x2) - Math.min(x1, x2),
        Math.max(y1, y2) - Math.min(y1, y2)
      ];
    }

    if (!nodeIs(node, "marker,svg,g")) {
      // add line-width
      var lineWidth = getAttribute(node, "stroke-width") || 1;
      var miterLimit = getAttribute(node, "stroke-miterlimit");
      // miterLength / lineWidth = 1 / sin(phi / 2)
      miterLimit && (lineWidth *= 0.5 / (Math.sin(Math.PI / 12)));
      return [
          boundingBox[0] - lineWidth,
          boundingBox[1] - lineWidth,
          boundingBox[2] + 2 * lineWidth,
          boundingBox[3] + 2 * lineWidth
      ];
    }

    return boundingBox;
  };

  // transforms a bounding box and returns a new rect that contains it
  var transformBBox = function (box, matrix) {
    var bl = multVecMatrix([box[0], box[1]], matrix);
    var br = multVecMatrix([box[0] + box[2], box[1]], matrix);
    var tl = multVecMatrix([box[0], box[1] + box[3]], matrix);
    var tr = multVecMatrix([box[0] + box[2], box[1] + box[3]], matrix);

    var bottom = Math.min(bl[1], br[1], tl[1], tr[1]);
    var left = Math.min(bl[0], br[0], tl[0], tr[0]);
    var top = Math.max(bl[1], br[1], tl[1], tr[1]);
    var right = Math.max(bl[0], br[0], tl[0], tr[0]);

    return [
      left,
      bottom,
      right - left,
      top - bottom
    ]
  };

  // draws a polygon
  var polygon = function (node, tfMatrix, colorMode, gradient, gradientMatrix) {
    var points = parsePointsString(node.getAttribute("points"));
    var lines = [{op: "m", c: multVecMatrix(points[0], tfMatrix)}];
    for (var i = 1; i < points.length; i++) {
      var p = points[i];
      var to = multVecMatrix(p, tfMatrix);
      lines.push({op: "l", c: to});
    }
    lines.push({op: "h"});
    _pdf.path(lines, colorMode, gradient, gradientMatrix);
  };

  // draws an image (converts it to jpeg first, as jsPDF doesn't support png or other formats)
  var image = function (node) {
    // convert image to jpeg
    var imageUrl = node.getAttribute("xlink:href") || node.getAttribute("href");
    var image = new Image();
    image.src = imageUrl;

    var canvas = document.createElement("canvas");
    var width = parseFloat(node.getAttribute("width")),
        height = parseFloat(node.getAttribute("height")),
        x = parseFloat(node.getAttribute("x") || 0),
        y = parseFloat(node.getAttribute("y") || 0);
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    var jpegUrl = canvas.toDataURL("image/jpeg");

    _pdf.addImage(jpegUrl,
        "jpeg",
        x,
        y,
        width,
        height
    );
  };

  // draws a path
  var path = function (node, tfMatrix, svgIdPrefix, colorMode, gradient, gradientMatrix) {
    var list = getPathSegList(node);
    var markerEnd = node.getAttribute("marker-end"),
        markerStart = node.getAttribute("marker-start"),
        markerMid = node.getAttribute("marker-mid");

    var getLinesFromPath = function (pathSegList, tfMatrix) {
      var x = 0, y = 0;
      var x0 = x, y0 = y;
      var prevX, prevY, newX, newY;
      var to, p, p2, p3;
      var lines = [];
      var markers = [];
      var op;
      var prevAngle = 0, curAngle;

      var addMarker = function (angle, anchor, type) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var tf;
        tf = new _pdf.Matrix(cos, sin, -sin, cos, anchor[0], anchor[1]);
        markers.push({type: type, tf: _pdf.matrixMult(tf, tfMatrix)});
      };

      for (var i = 0; i < list.numberOfItems; i++) {
        var seg = list.getItem(i);
        var cmd = seg.pathSegTypeAsLetter;
        switch (cmd) {
          case "M":
            x0 = x;
            y0 = y;
            to = [seg.x, seg.y];
            op = "m";
            break;
          case "m":
            x0 = x;
            y0 = y;
            to = [seg.x + x, seg.y + y];
            op = "m";
            break;
          case "L":
            to = [seg.x, seg.y];
            op = "l";
            break;
          case "l":
            to = [seg.x + x, seg.y + y];
            op = "l";
            break;
          case "H":
            to = [seg.x, y];
            op = "l";
            newX = seg.x;
            newY = y;
            break;
          case "h":
            to = [seg.x + x, y];
            op = "l";
            newX = seg.x + x;
            newY = y;
            break;
          case "V":
            to = [x, seg.y];
            op = "l";
            newX = x;
            newY = seg.y;
            break;
          case "v":
            to = [x, seg.y + y];
            op = "l";
            newX = x;
            newY = seg.y + y;
            break;
          case "C":
            p2 = [seg.x1, seg.y1];
            p3 = [seg.x2, seg.y2];
            to = [seg.x, seg.y];
            break;
          case "c":
            p2 = [seg.x1 + x, seg.y1 + y];
            p3 = [seg.x2 + x, seg.y2 + y];
            to = [seg.x + x, seg.y + y];
            break;
          case "S":
            p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p3 = [seg.x2, seg.y2];
            to = [seg.x, seg.y];
            break;
          case "s":
            p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p3 = [seg.x2 + x, seg.y2 + y];
            to = [seg.x + x, seg.y + y];
            break;
          case "Q":
            p = [seg.x1, seg.y1];
            p2 = toCubic([x, y], p);
            p3 = toCubic([seg.x, seg.y], p);
            to = [seg.x, seg.y];
            break;
          case "q":
            p = [seg.x1 + x, seg.y1 + y];
            p2 = toCubic([x, y], p);
            p3 = toCubic([x + seg.x, y + seg.y], p);
            to = [seg.x + x, seg.y + y];
            break;
          case "T":
            p2 = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p2 = toCubic([x, y], p);
            p3 = toCubic([seg.x, seg.y], p);
            to = [seg.x, seg.y];
            break;
          case "t":
            p = getControlPointFromPrevious(i, [x, y], list, prevX, prevY);
            p2 = toCubic([x, y], p);
            p3 = toCubic([x + seg.x, y + seg.y], p);
            to = [seg.x + x, seg.y + y];
            break;
          // TODO: A,a
          case "Z":
          case "z":
            x = x0;
            y = y0;
            lines.push({op: "h"});
            break;
        }

        var hasStartMarker = markerStart
            && (i === 1
            || ("mM".indexOf(cmd) < 0 && "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0));
        var hasEndMarker = markerEnd
            && (i === list.numberOfItems - 1
            || ("mM".indexOf(cmd) < 0 && "mM".indexOf(list.getItem(i + 1).pathSegTypeAsLetter) >= 0));
        var hasMidMarker = markerMid
            && i > 0
            && !(i === 1 && "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0);

        if ("sScCqQtT".indexOf(cmd) >= 0) {
          hasStartMarker && addMarker(getAngle([x, y], p2), [x, y], "start");
          hasEndMarker && addMarker(getAngle(p3, to), to, "end");
          if (hasMidMarker) {
            curAngle = getAngle([x, y], p2);
            curAngle = "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0 ?
                curAngle : .5 * (prevAngle + curAngle);
            addMarker(curAngle, [x, y], "mid");
          }

          prevAngle = getAngle(p3, to);

          prevX = x;
          prevY = y;
          p2 = multVecMatrix(p2, tfMatrix);
          p3 = multVecMatrix(p3, tfMatrix);
          p = multVecMatrix(to, tfMatrix);
          lines.push({
            op: "c", c: [
              p2[0], p2[1],
              p3[0], p3[1],
              p[0], p[1]
            ]
          });
        } else if ("lLhHvVmM".indexOf(cmd) >= 0) {
          curAngle = getAngle([x, y], to);
          hasStartMarker && addMarker(curAngle, [x, y], "start");
          hasEndMarker && addMarker(curAngle, to, "end");
          if (hasMidMarker) {
            var angle = "mM".indexOf(cmd) >= 0 ?
                prevAngle : "mM".indexOf(list.getItem(i - 1).pathSegTypeAsLetter) >= 0 ?
                curAngle : .5 * (prevAngle + curAngle);
            addMarker(angle, [x, y], "mid");
          }
          prevAngle = curAngle;

          p = multVecMatrix(to, tfMatrix);
          lines.push({op: op, c: p});
        }

        if ("MLCSQT".indexOf(cmd) >= 0) {
          x = seg.x;
          y = seg.y;
        } else if ("mlcsqt".indexOf(cmd) >= 0) {
          x = seg.x + x;
          y = seg.y + y;
        } else if ("zZ".indexOf(cmd) < 0) {
          x = newX;
          y = newY;
        }
      }

      return {lines: lines, markers: markers};
    };
    var lines = getLinesFromPath(list, tfMatrix);

    if (markerEnd || markerStart || markerMid) {
      for (var i = 0; i < lines.markers.length; i++) {
        var marker = lines.markers[i];
        var markerElement;
        switch (marker.type) {
          case "start":
            markerElement = svgIdPrefix.get() + /url\(#(\w+)\)/.exec(markerStart)[1];
            break;
          case "end":
            markerElement = svgIdPrefix.get() + /url\(#(\w+)\)/.exec(markerEnd)[1];
            break;
          case "mid":
            markerElement = svgIdPrefix.get() + /url\(#(\w+)\)/.exec(markerMid)[1];
            break;
        }
        _pdf.doFormObject(markerElement, marker.tf);
      }
    }

    if (lines.lines.length > 0) {
      _pdf.path(lines.lines, colorMode, gradient, gradientMatrix);
    }
  };

  // draws the element referenced by a use node, makes use of pdf's XObjects/FormObjects so nodes are only written once
  // to the pdf document. This highly reduces the file size and computation time.
  var use = function (node, tfMatrix, svgIdPrefix) {
    var url = (node.getAttribute("href") || node.getAttribute("xlink:href"));
    // just in case someone has the idea to use empty use-tags, wtf???
    if (!url)
      return;

    // get the size of the referenced form object (to apply the correct scaling)
    var formObject = _pdf.getFormObject(svgIdPrefix.get() + url.substring(1));

    // scale and position it right
    var x = node.getAttribute("x") || 0;
    var y = node.getAttribute("y") || 0;
    var width = node.getAttribute("width") || formObject.width;
    var height = node.getAttribute("height") || formObject.height;
    var t = new _pdf.Matrix(width / formObject.width || 0, 0, 0, height / formObject.height || 0, x, y);
    t = _pdf.matrixMult(t, tfMatrix);
    _pdf.doFormObject(svgIdPrefix.get() + url.substring(1), t);
  };

  // draws a line
  var line = function (node, tfMatrix) {
    var p1 = multVecMatrix([parseFloat(node.getAttribute('x1')), parseFloat(node.getAttribute('y1'))], tfMatrix);
    var p2 = multVecMatrix([parseFloat(node.getAttribute('x2')), parseFloat(node.getAttribute('y2'))], tfMatrix);
    _pdf.line(p1[0], p1[1], p2[0], p2[1]);
  };

  // draws a rect
  var rect = function (node, colorMode, gradient, gradientMatrix) {
    _pdf.roundedRect(
        parseFloat(node.getAttribute('x')) || 0,
        parseFloat(node.getAttribute('y')) || 0,
        parseFloat(node.getAttribute('width')),
        parseFloat(node.getAttribute('height')),
        parseFloat(node.getAttribute('rx')) || 0,
        parseFloat(node.getAttribute('ry')) || 0,
        colorMode,
        gradient,
        gradientMatrix
    );
  };

  // draws an ellipse
  var ellipse = function (node, colorMode, gradient, gradientMatrix) {
    _pdf.ellipse(
        parseFloat(node.getAttribute('cx')) || 0,
        parseFloat(node.getAttribute('cy')) || 0,
        parseFloat(node.getAttribute('rx')),
        parseFloat(node.getAttribute('ry')),
        colorMode,
        gradient,
        gradientMatrix
    );
  };

  // draws a circle
  var circle = function (node, colorMode, gradient, gradientMatrix) {
    var radius = parseFloat(node.getAttribute('r')) || 0;
    _pdf.ellipse(
        parseFloat(node.getAttribute('cx')) || 0,
        parseFloat(node.getAttribute('cy')) || 0,
        radius,
        radius,
        colorMode,
        gradient,
        gradientMatrix
    );
  };

  // applies text transformations to a text node
  var transformText = function (node, text) {
    var textTransform = getAttribute(node, "text-transform");
    switch (textTransform) {
      case "uppercase": return text.toUpperCase();
      case "lowercase": return text.toLowerCase();
      default: return text;
      // TODO: capitalize, full-width
    }
  };

  // draws a text element and its tspan children
  var text = function (node, tfMatrix, hasFillColor, fillRGB) {
    _pdf.saveGraphicsState();
    setTextProperties(node, fillRGB);

    var getTextOffset = function (textAnchor, width) {
      var xOffset = 0;
      switch (textAnchor) {
        case 'end':
          xOffset = width;
          break;
        case 'middle':
          xOffset = width / 2;
          break;
        case 'start':
          break;
      }
      return xOffset;
    };

    /**
     * Convert em, px and bare number attributes to pixel values
     */
    var toPixels = function (value, pdfFontSize) {
      var match;

      // em
      match = value && value.toString().match(/^([\-0-9.]+)em$/);
      if (match) {
        return parseFloat(match[1]) * pdfFontSize;
      }

      // pixels
      match = value && value.toString().match(/^([\-0-9.]+)(px|)$/);
      if (match) {
        return parseFloat(match[1]);
      }
      return 0;
    };

    // creates an svg element and append the text node to properly measure the text size
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(node);
    svg.setAttribute("visibility", "hidden");
    document.body.appendChild(svg);

    var box = node.getBBox();
    var x, y, xOffset = 0;
    var textAnchor = getAttribute(node, "text-anchor");
    if (textAnchor) {
      xOffset = getTextOffset(textAnchor, box.width);
    }

    var pdfFontSize = _pdf.getFontSize();
    var textX = toPixels(node.getAttribute('x'), pdfFontSize);
    var textY = toPixels(node.getAttribute('y'), pdfFontSize);
    var m = _pdf.matrixMult(new _pdf.Matrix(1, 0, 0, 1, textX, textY), tfMatrix);

    x = toPixels(node.getAttribute("dx"), pdfFontSize);
    y = toPixels(node.getAttribute("dy"), pdfFontSize);

    // when there are no tspans draw the text directly
    if (node.childElementCount === 0) {
      _pdf.text(
          (x - xOffset),
          y,
          transformText(node, removeNewlinesAndTrim(node.textContent)),
          void 0,
          m
      );
    } else {
      // otherwise loop over tspans and position each relative to the previous one
      forEachChild(node, function (i, tSpan) {
        _pdf.saveGraphicsState();
        var tSpanColor = getAttribute(tSpan, "fill");
        setTextProperties(tSpan, tSpanColor && new RGBColor(tSpanColor));
        var extent = tSpan.getExtentOfChar(0);
        _pdf.text(
            extent.x - textX,//x - xOffset,
            extent.y + extent.height * 0.7 - textY, // 0.7 roughly mimicks the text baseline
            transformText(node, removeNewlinesAndTrim(tSpan.textContent)),
            void 0,
            m
        );

        _pdf.restoreGraphicsState();
      });

    }

    document.body.removeChild(svg);
    _pdf.restoreGraphicsState();
  };

  // As defs elements are allowed to appear after they are referenced, we search for them first
  var findAndRenderDefs = function (node, tfMatrix, defs, svgIdPrefix, withinDefs) {
    forEachChild(node, function (i, child) {
      if (child.tagName.toLowerCase() === "defs") {
        renderNode(child, tfMatrix, defs, svgIdPrefix, withinDefs);
        // prevent defs from being evaluated twice // TODO: make this better
        child.parentNode.removeChild(child);
      }
    });
  };

  // processes a svg node
  var svg = function (node, tfMatrix, defs, svgIdPrefix, withinDefs) {
    // create a new prefix and clone the defs, as defs within the svg should not be visible outside
    var newSvgIdPrefix = svgIdPrefix.nextChild();
    var newDefs = cloneDefs(defs);
    findAndRenderDefs(node, tfMatrix, newDefs, newSvgIdPrefix, withinDefs);
    renderChildren(node, tfMatrix, newDefs, newSvgIdPrefix, withinDefs);
  };

  // renders all children of a node
  var renderChildren = function (node, tfMatrix, defs, svgIdPrefix, withinDefs) {
    forEachChild(node, function (i, node) {
      renderNode(node, tfMatrix, defs, svgIdPrefix, withinDefs);
    });
  };

  // adds a gradient to defs and the pdf document for later use, type is either "axial" or "radial"
  // opacity is only supported rudimentary by averaging over all stops
  // transforms are applied on use
  var putGradient = function (node, type, coords, defs, svgIdPrefix) {
    var colors = [];
    var opacitySum = 0;
    var hasOpacity = false;
    var gState;
    forEachChild(node, function (i, element) {
      // since opacity gradients are hard to realize, average the opacity over the control points
      if (element.tagName.toLowerCase() === "stop") {
        var color = new RGBColor(getAttribute(element, "stop-color"));
        colors.push({
          offset: parseFloat(element.getAttribute("offset")),
          color: [color.r, color.g, color.b]
        });
        var opacity = getAttribute(element, "stop-opacity");
        if (opacity && opacity != 1) {
          opacitySum += parseFloat(opacity);
          hasOpacity = true;
        }
      }
    });

    if (hasOpacity) {
      gState = new _pdf.GState({opacity: opacitySum / coords.length});
    }

    var pattern = new _pdf.ShadingPattern(type, coords, colors, gState);
    var id = svgIdPrefix.get() + node.getAttribute("id");
    _pdf.addShadingPattern(id, pattern);
    defs[id] = node;
  };

  var pattern = function (node, defs, svgIdPrefix) {
    var id = svgIdPrefix.get() + node.getAttribute("id");
    defs[id] = node;

    // the transformations directly at the node are written to the pattern transformation matrix
    var bBox = getUntransformedBBox(node);
    var pattern = new _pdf.TilingPattern([bBox[0], bBox[1], bBox[0] + bBox[2], bBox[1] + bBox[3]], bBox[2], bBox[3],
        null, computeNodeTransform(node));

    _pdf.beginTilingPattern(pattern);
    // continue without transformation
    renderChildren(node, _pdf.unitMatrix, defs, svgIdPrefix, false);
    _pdf.endTilingPattern(id, pattern);
  };

  function setTextProperties(node, fillRGB) {
    var fontFamily = getAttribute(node, "font-family");
    if (fontFamily) {
      _pdf.setFont(fontFamily);
    }

    if (fillRGB && fillRGB.ok) {
      _pdf.setTextColor(fillRGB.r, fillRGB.g, fillRGB.b);
    }

    var fontType;
    var fontWeight = getAttribute(node, "font-weight");
    if (fontWeight) {
      if (fontWeight === "bold") {
        fontType = "bold";
      }
    }

    var fontStyle = getAttribute(node, "font-style");
    if (fontStyle) {
      if (fontStyle === "italic") {
        fontType += "italic";
      }
    }
    _pdf.setFontType(fontType);

    var pdfFontSize = 16;
    var fontSize = getAttribute(node, "font-size");
    if (fontSize) {
      pdfFontSize = parseFloat(fontSize);
      _pdf.setFontSize(pdfFontSize);
    }
  }


  /**
   * Renders a svg node.
   * @param node The svg element
   * @param contextTransform The current transformation matrix
   * @param defs The defs map holding all svg nodes that can be referenced
   * @param svgIdPrefix The current id prefix
   * @param withinDefs True iff we are top-level within a defs node, so the target can be switched to an pdf form object
   */
  var renderNode = function (node, contextTransform, defs, svgIdPrefix, withinDefs) {
    var tfMatrix,
        hasFillColor = false,
        fillRGB = null,
        colorMode = null,
        fillUrl = null,
        fillData = null,
        bBox;

    //
    // Decide about the render target and set the correct transformation
    //

    // if we are within a defs node, start a new pdf form object and draw this node and all children on that instead
    // of the top-level page
    var targetIsFormObject = withinDefs && !nodeIs(node, "lineargradient,radialgradient,pattern");
    if (targetIsFormObject) {

      // the transformations directly at the node are written to the pdf form object transformation matrix
      tfMatrix = computeNodeTransform(node);
      bBox = getUntransformedBBox(node);

      _pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], tfMatrix);

      // continue without transformation and set withinDefs to false to prevent child nodes from starting new form objects
      tfMatrix = _pdf.unitMatrix;
      withinDefs = false;

    } else {
      tfMatrix = _pdf.matrixMult(computeNodeTransform(node), contextTransform);
      _pdf.saveGraphicsState();
    }

    //
    // extract fill and stroke mode
    //

    // fill mode
    if (nodeIs(node, "g,path,rect,text,ellipse,line,circle,polygon")) {
      function setDefaultColor() {
        fillRGB = new RGBColor("rgb(0, 0, 0)");
        hasFillColor = true;
        colorMode = "F";
      }

      var fillColor = getAttribute(node, "fill");
      if (fillColor) {
        var url = /url\(#(\w+)\)/.exec(fillColor);
        if (url) {
          // probably a gradient (or something unsupported)
          fillUrl = svgIdPrefix.get() + url[1];
          var fill = getFromDefs(fillUrl, defs);
          if (fill && nodeIs(fill, "lineargradient,radialgradient")) {

            // matrix to convert between gradient space and user space
            // for "userSpaceOnUse" this is the current transformation: tfMatrix
            // for "objectBoundingBox" or default, the gradient gets scaled and transformed to the bounding box
            var gradientUnitsMatrix = tfMatrix;
            if (!fill.hasAttribute("gradientUnits")
                || fill.getAttribute("gradientUnits").toLowerCase() === "objectboundingbox") {
              bBox || (bBox = getUntransformedBBox(node));
              gradientUnitsMatrix = new _pdf.Matrix(bBox[2], 0, 0, bBox[3], bBox[0], bBox[1]);

              var nodeTransform = computeNodeTransform(node);
              gradientUnitsMatrix = _pdf.matrixMult(gradientUnitsMatrix, nodeTransform);
            }

            // matrix that is applied to the gradient before any other transformations
            var gradientTransform = parseTransform(fill.getAttribute("gradientTransform"));

            fillData = _pdf.matrixMult(gradientTransform, gradientUnitsMatrix);
          } else if (fill && nodeIs(fill, "pattern")) {
            var fillBBox, y, width, height, x;
            fillData = {};

            var patternUnitsMatrix = _pdf.unitMatrix;
            if (!fill.hasAttribute("patternUnits")
                || fill.getAttribute("patternUnits").toLowerCase() === "objectboundingbox") {
              bBox || (bBox = getUntransformedBBox(node));
              patternUnitsMatrix = new _pdf.Matrix(1, 0, 0, 1, bBox[0], bBox[1]);

              // TODO: slightly inaccurate (rounding errors? line width bBoxes?)
              fillBBox = getUntransformedBBox(fill);
              x = fillBBox[0] * bBox[0];
              y = fillBBox[1] * bBox[1];
              width = fillBBox[2] * bBox[2];
              height = fillBBox[3] * bBox[3];
              fillData.boundingBox = [x, y, x + width, y + height];
              fillData.xStep = width;
              fillData.yStep = height;
            }

            var patternContentUnitsMatrix = _pdf.unitMatrix;
            if (fill.hasAttribute("patternContentUnits")
                && fill.getAttribute("patternContentUnits").toLowerCase() === "objectboundingbox") {
              bBox || (bBox = getUntransformedBBox(node));
              patternContentUnitsMatrix = new _pdf.Matrix(bBox[2], 0, 0, bBox[3], 0, 0);

              fillBBox = fillData.boundingBox || getUntransformedBBox(fill);
              x = fillBBox[0] / bBox[0];
              y = fillBBox[1] / bBox[1];
              width = fillBBox[2] / bBox[2];
              height = fillBBox[3] / bBox[3];
              fillData.boundingBox = [x, y, x + width, y + height];
              fillData.xStep = width;
              fillData.yStep = height;
            }

            fillData.matrix = _pdf.matrixMult(
                _pdf.matrixMult(patternContentUnitsMatrix, patternUnitsMatrix), tfMatrix);

            colorMode = "F";
          } else {
            // unsupported fill argument (e.g. patterns) -> fill black
            fillUrl = fill = null;
            setDefaultColor();
          }
        } else {
          // plain color
          fillRGB = parseColor(fillColor);
          if (fillRGB.ok) {
            hasFillColor = true;
            colorMode = 'F';
          } else {
            colorMode = null;
          }
        }
      } else {
        // if no fill attribute is provided the default fill color is black
        setDefaultColor();
      }

      // opacity is realized via a pdf graphics state
      var opacity = 1.0;
      var nodeOpacity = node.getAttribute("opacity") || node.getAttribute("fill-opacity");
      if (nodeOpacity) {
        opacity *= parseFloat(nodeOpacity);
      }
      if (fillRGB && typeof fillRGB.a === "number") {
        opacity *= fillRGB.a;
      }
      _pdf.setGState(new _pdf.GState({opacity: opacity}));
    }

    if (nodeIs(node, "g,path,rect,ellipse,line,circle,polygon")) {
      // text has no fill color, so don't apply it until here
      if (hasFillColor) {
        _pdf.setFillColor(fillRGB.r, fillRGB.g, fillRGB.b);
      }

      // stroke mode
      var strokeColor = node.getAttribute('stroke');
      if (strokeColor) {
        var strokeWidth;
        if (node.hasAttribute("stroke-width")) {
          strokeWidth = Math.abs(parseFloat(node.getAttribute('stroke-width')));
          _pdf.setLineWidth(strokeWidth);
        }
        var strokeRGB = new RGBColor(strokeColor);
        if (strokeRGB.ok) {
          _pdf.setDrawColor(strokeRGB.r, strokeRGB.g, strokeRGB.b);
          if (strokeWidth !== 0) {
            // pdf spec states: "A line width of 0 denotes the thinnest line that can be rendered at device resolution:
            // 1 device pixel wide". SVG, however, does not draw zero width lines.
            colorMode = (colorMode || "") + "D";
          }
        }
        if (node.hasAttribute("stroke-linecap")) {
          _pdf.setLineCap(node.getAttribute("stroke-linecap"));
        }
        if (node.hasAttribute("stroke-linejoin")) {
          _pdf.setLineJoin(node.getAttribute("stroke-linejoin"));
        }
        if (node.hasAttribute("stroke-dasharray")) {
          _pdf.setLineDashPattern(
              parseFloats(node.getAttribute("stroke-dasharray")),
              parseInt(node.getAttribute("stroke-dashoffset")) || 0
          );
        }
        if (node.hasAttribute("stroke-miterlimit")) {
          _pdf.setLineMiterLimit(parseFloat(node.getAttribute("stroke-miterlimit")));
        }
      }
    }

    setTextProperties(node, fillRGB);

    // do the actual drawing
    switch (node.tagName.toLowerCase()) {
      case 'svg':
        svg(node, tfMatrix, defs, svgIdPrefix, withinDefs);
        break;
      case 'g':
        findAndRenderDefs(node, tfMatrix, defs, svgIdPrefix, withinDefs);
      case 'a':
      case "marker":
        renderChildren(node, tfMatrix, defs, svgIdPrefix, withinDefs);
        break;

      case 'defs':
        renderChildren(node, tfMatrix, defs, svgIdPrefix, true);
        break;

      case 'use':
        use(node, tfMatrix, svgIdPrefix);
        break;

      case 'line':
        line(node, tfMatrix);
        break;

      case 'rect':
        _pdf.setCurrentTransformationMatrix(tfMatrix);
        rect(node, colorMode, fillUrl, fillData);
        break;

      case 'ellipse':
        _pdf.setCurrentTransformationMatrix(tfMatrix);
        ellipse(node, colorMode, fillUrl, fillData);
        break;

      case 'circle':
        _pdf.setCurrentTransformationMatrix(tfMatrix);
        circle(node, colorMode, fillUrl, fillData);
        break;
      case 'text':
        text(node, tfMatrix, hasFillColor, fillRGB);
        break;

      case 'path':
        path(node, tfMatrix, svgIdPrefix, colorMode, fillUrl, fillData);
        break;

      case 'polygon':
        polygon(node, tfMatrix, colorMode, fillUrl, fillData);
        break;

      case 'image':
        _pdf.setCurrentTransformationMatrix(tfMatrix);
        image(node);
        break;

      case "lineargradient":
        putGradient(node, "axial", [
          node.getAttribute("x1"),
          node.getAttribute("y1"),
          node.getAttribute("x2"),
          node.getAttribute("y2")
        ], defs, svgIdPrefix);
        break;

      case "radialgradient":
        putGradient(node, "radial", [
          node.getAttribute("fx") || node.getAttribute("cx"),
          node.getAttribute("fy") || node.getAttribute("cy"),
          0,
          node.getAttribute("cx") || 0,
          node.getAttribute("cy") || 0,
          node.getAttribute("r") || 0
        ], defs, svgIdPrefix);
        break;

      case "pattern":
        pattern(node, defs, svgIdPrefix);
        break;
    }

    // close either the formObject or the graphics context
    if (targetIsFormObject) {
      _pdf.endFormObject(svgIdPrefix.get() + node.getAttribute("id"));
    } else {
      _pdf.restoreGraphicsState();
    }
  };

  // the actual svgToPdf function (see above)
  var svg2pdf = function (element, pdf, options) {
    _pdf = pdf;

    var k = options.scale || 1.0,
        xOffset = options.xOffset || 0.0,
        yOffset = options.yOffset || 0.0;

    // set offsets and scale everything by k
    _pdf.saveGraphicsState();
    _pdf.setCurrentTransformationMatrix(new _pdf.Matrix(k, 0, 0, k, xOffset, yOffset));

    renderNode(element.cloneNode(true), _pdf.unitMatrix, {}, new SvgPrefix(""), false);

    _pdf.restoreGraphicsState();

    return _pdf;
  };

  if (typeof define === "function" && define.amd) {
    define(["rgbcolor"], function (rgbcolor) {
      RGBColor = rgbcolor;
      return svg2pdf;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    RGBColor = require("./rgbcolor.js");
    module.exports = svg2pdf;
  } else {
    RGBColor = global.RGBColor;
    global.svg2pdf = svg2pdf;
    // for compatibility reasons
    global.svgElementToPdf = svg2pdf;
  }
  return svg2pdf;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this));
