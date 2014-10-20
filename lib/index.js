'use strict';

var Hoek = require('hoek');
var fluent = require('fluent-logger');
var GoodReporter = require('good-reporter');


var internals = {
    defaults: {
        host: 'localhost',
        port: 24224,
        timeout: 5000
    }
};


module.exports = internals.GoodFluent = function GoodFluent(options) {
    var settings;

    Hoek.assert(this instanceof internals.GoodFluent, 'GoodFluent must be created with new');

    options = Hoek.clone(options || {});
    settings = Hoek.applyToDefaults(internals.defaults, options);

    fluent.configure('good', settings);
    GoodReporter.call(this, settings);
};

Hoek.inherits(internals.GoodFluent, GoodReporter);


internals.GoodFluent.prototype.start = function (emitter, callback) {
    emitter.on('report', this._handleEvent.bind(this));
    callback();
};


internals.GoodFluent.prototype.stop = function () {

};


internals.GoodFluent.prototype._report = function (event, eventData) {
    this._eventQueue.push(eventData);

    if (this._eventQueue.length >= this._settings.threshold) {
        this._flush();
    }
};