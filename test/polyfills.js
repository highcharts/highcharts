/* eslint-disable */
// Element.dispatchEvent
(function () {
    if (!Element.prototype.dispatchEvent) {
        Element.prototype.dispatchEvent = Element.prototype.fireEvent;
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
