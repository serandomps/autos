var dust = require('dust')();

var serand = require('serand');
var utils = require('utils');
var uready = require('uready');
var page = serand.page;
var direct = serand.direct;
var current = serand.current;

var app = serand.app({
    self: 'autos',
    from: 'serandomps'
});

var layout = serand.layout(app);

var loginUri = utils.resolve('autos:///auth');

var can = function (permission) {
    return function (ctx, next) {
        if (ctx.user) {
            return next();
        }
        serand.emit('user', 'login', ctx.path);
    };
};

// page(uready);

page('/signin', function (ctx, next) {
    var query = ctx.query | {};
    serand.emit('user', 'login', query.dest || '/');
});

page('/signup', function (ctx, next) {
    var query = ctx.query | {};
    serand.emit('user', 'login', query.dest || '/');
});

page('/auth', function (ctx, next) {
    var el = $('#content');
    var usr = {
        tid: el.data('tid'),
        username: el.data('username'),
        access: el.data('access'),
        expires: el.data('expires'),
        refresh: el.data('refresh')
    };
    if (usr.username) {
        return serand.emit('user', 'logged in', usr);
    }
    serand.emit('user', 'logged out');
});

page('/', function (ctx, next) {
    layout('two-column-right')
        .area('#header')
        .add('autos-navigation')
        //.add('breadcrumb')
        .area('#right')
        .add('vehicles-find-recent')
        .area('#middle')
        .add('autos-home')
        .add('vehicles-find-featured')
        .render(ctx, next);
});

page('/vehicles', function (ctx, next) {
    layout('two-column-left')
        .area('#header')
        .add('autos-navigation')
        //.add('breadcrumb')
        .area('#left')
        .add('vehicles-search', ctx.query)
        .area('#middle')
        .add('vehicles-find-search', ctx.query)
        .render(ctx, next);
});

page('/vehicles/:id', can('vehicle:read'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('vehicles-findone', {
            id: ctx.params.id
        })
        .render(ctx, next);
});

page('/vehicles/:id/edit', can('vehicle:update'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('vehicles-create', {
            id: ctx.params.id
        })
        .render(ctx, next);
});

page('/vehicles/:id/delete', can('vehicle:update'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('vehicles-remove', {
            id: ctx.params.id
        })
        .render(ctx, next);
});

page('/add', can('vehicle:create'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-navigation')
        .area('#middle')
        .add('vehicles-create')
        .render(ctx, next);
});

page('/mine', can('user'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-navigation')
        .area('#middle')
        .add('vehicles-find-mine')
        .render(ctx, next);
});

//TODO: redirect user to login page when authentication is needed
//TODO: basically a front controller pattern
serand.on('user', 'login', function (path) {
    var ctx;
    if (!path) {
        ctx = serand.current();
        path = ctx.path;
    }
    serand.store('state', {
        path: path
    });
    serand.emit('user', 'authenticator', {
        type: 'serandives',
        location: loginUri
    }, function (err, uri) {
        direct(uri);
    });
});

serand.on('user', 'logged in', function (usr) {
    var state = serand.store('state', null);
    direct(state ? state.path : '/');
});

serand.on('user', 'logged out', function (usr) {
    var state = serand.store('state', null);
    direct(state ? state.path : '/');
});

serand.emit('serand', 'ready');
