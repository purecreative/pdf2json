var nodeUtil = require("util"),
    _ = require("underscore"),
    PDFUnit = require('./pdfunit.js');

var PDFLine = (function PFPLineClosure() {
    'use strict';
    // private static
    var _nextId = 1;
    var _name = 'PDFLine';

    // constructor
    var cls = function (x1, y1, x2, y2, lineWidth) {
        // private
        var _id = _nextId++;

        // public (every instance will have their own copy of these methods, needs to be lightweight)
        this.get_id = function() { return _id; };
        this.get_name = function() { return _name + _id; };

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.lineWidth = lineWidth || 1.0;
    };

    // public static
    cls.get_nextId = function () {
        return _name + _nextId;
    };

    var _setStartPoint = function(oneLine, x, y) {
        oneLine.x = PDFUnit.toFormX(x);
        oneLine.y = PDFUnit.toFormY(y);
    };

    // public (every instance will share the same method, but has no access to private fields defined in constructor)
    cls.prototype.processLine = function (targetData) {
        var xDelta = Math.abs(this.x2 - this.x1);
        var yDelta = Math.abs(this.y2 - this.y1);

        var oneLine = {x:0, y:0, w:this.lineWidth, l:0};

        if (yDelta < 0.5) { //HLine
            oneLine.l = PDFUnit.toFormX(xDelta);
            if (this.x1 > this.x2)
                _setStartPoint.call(this, oneLine, this.x2, this.y2);
            else
                _setStartPoint.call(this, oneLine, this.x1, this.y1);
            targetData.HLines.push(oneLine);
        }
        else if (xDelta < 0.5) {//VLine
            oneLine.l = PDFUnit.toFormY(yDelta);
            if (this.y1 > this.y2)
                _setStartPoint.call(this, oneLine, this.x2, this.y2);
            else
                _setStartPoint.call(this, oneLine, this.x1, this.y1);
            targetData.VLines.push(oneLine);
        }
    };

    return cls;
})();

module.exports = PDFLine;

