var async = require('async');
var dust = require('dust')();
var serand = require('serand');

var callbacks = [];

var Layout = function (layout) {
    this.sel = null;
    this.stack = [];
    this.layout = layout;
};

Layout.prototype.render = function (fn) {
    var stack = this.stack;
    dust.renderSource(require('./' + this.layout), {}, function (err, html) {
        var tasks = [];
        var el = $(html);
        stack.forEach(function (o) {
            tasks.push(function (fn) {
                var comp = require(o.comp);
                comp($(o.sel, el), fn, o.opts);
            });
        });
        async.parallel(tasks, function (err, results) {
            callbacks.forEach(function (callback) {
                callback();
            });
            callbacks = results;
            $('#content').html(el);
            if (fn) {
                fn(err, results);
            }
        });
    });
    return this;
};

Layout.prototype.area = function (sel) {
    this.sel = sel;
    return this;
};

Layout.prototype.add = function (comp, opts) {
    this.stack.push({
        sel: this.sel,
        comp: comp,
        opts: opts
    });
    return this;
};

module.exports = function (layout) {
    var ly = new Layout(layout);
    serand.emit('boot', 'layout', ly);
    return ly;
};