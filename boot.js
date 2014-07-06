var pager = require('page');
var async = require('async');
var dust = require('dust')();
var serand = require('serand');
var layout = require('./layout');

var page = function (path, fn) {
    pager(path, (fn ? function (ctx) {
        serand.emit('boot', 'page', ctx);
        fn(ctx);
    } : null));
};

var comps = JSON.parse(require('./component.json'));
comps.local.forEach(function (comp) {
    require(comp);
});

var current = function (path) {
    var ctx = new pager.Context(window.location.pathname + window.location.search);
    var route = new pager.Route(path);
    route.match(ctx.path, ctx.params);
    return ctx;
};

page('/', function (ctx) {
    layout('two-column')
        .area('#header')
        .add('navigation')
        .add('breadcrumb')
        .area('#right')
        .add('auto-search')
        .area('#middle')
        .add('auto-listing')
        .render();
});

page('/vehicles/:id', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('navigation')
        .add('breadcrumb')
        .area('#middle')
        .add('auto-details', {
            id: ctx.params.id
        })
        .render();
});

page('/login', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('navigation')
        .area('#middle')
        .add('user-login')
        .render();
});

page('/register', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('navigation')
        .area('#middle')
        .add('user-register')
        .render();
});

page('/add', function (ctx) {
    layout('single-column')
        .area('#header')
        .add('navigation')
        .area('#middle')
        .add('auto-add')
        .render();
});

pager();

serand.on('user', 'login', function (data) {
    var ctx = current('/:action?val=?');
    console.log(ctx);
    pager('/');
});

serand.on('user', 'logout', function (data) {
    pager('/');
});

serand.emit('boot', 'init');