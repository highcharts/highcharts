/* eslint-disable */
// Element.dispatchEvent
(function () {
    if (!Element.prototype.dispatchEvent) {
        Element.prototype.dispatchEvent = Element.prototype.fireEvent;
    }
    if (typeof Event !== 'function') {
        var originalEvent = Event;
        Event = function () {
            var evt = document.createEvent('Event');
            evt.initEvent(
                arguments[0],
                (arguments[1] || false),
                (arguments[2] || false)
            );
            return evt;
        };
        for (var key in originalEvent) {
            Event[key] = originalEvent[key];
        }
    }
}());
// Element.remove
(function () {
    function remove() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    }
    if (!Element.prototype.remove) {
        Element.prototype.remove = remove;
    }
    if (Text && !Text.prototype.remove) {
        Text.prototype.remove = remove;
    }
}());
