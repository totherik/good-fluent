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


module.exports = internals.GoodFluent = function GoodFluent(label, options) {
    var settings;

    Hoek.assert(this instanceof internals.GoodFluent, 'GoodFluent must be created with new');
    Hoek.assert(typeof label === 'string', 'label must be a string');

    options = Hoek.clone(options || {});
    settings = Hoek.applyToDefaults(internals.defaults, options);
    this._sender = fluent.createFluentSender(label, settings);

    GoodReporter.call(this, settings);
};

Hoek.inherits(internals.GoodFluent, GoodReporter);


internals.GoodFluent.prototype.start = function (emitter, callback) {
    emitter.on('report', this._handleEvent.bind(this));
    callback();
};


internals.GoodFluent.prototype.stop = function () {
    // noop
};


internals.GoodFluent.prototype._report = function (event, eventData) {
    this._sender.emit(event, eventData, eventData.timestamp);
};