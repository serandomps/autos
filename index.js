var dust = require('dust')();

var serand = require('serand');
var utils = require('utils');
var uready = require('uready');
var page = serand.page;
var redirect = serand.redirect;
var current = serand.current;

var app = serand.app({
    self: 'autos',
    from: 'serandomps'
});

var layout = serand.layout(app);

var loginUri = utils.resolve('autos:///auth');

var auth = require('./controllers/auth');

var can = function (permission) {
    return function (ctx, next) {
        next();
    };
};

page(function (ctx, next) {
    utils.loading();
    next();
});

page('/signin', auth.signin);

page('/signup', function (ctx, next) {
    var query = ctx.query | {};
    utils.emit('user', 'login', query.dest || '/');
});

page('/auth', function (ctx, next) {
    var el = $('#content');
    var o = {
        tid: sera.tid,
        username: sera.username,
        access: sera.access,
        expires: sera.expires,
        refresh: sera.refresh
    };
    if (o.username) {
        return utils.emit('user', 'initialize', o);
    }
    utils.emit('user', 'logged out');
});

page('/', function (ctx, next) {
    layout('two-column-right')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#right')
        .add('vehicles:recent')
        .area('#middle')
        .add('autos-client:home')
        .add('vehicles:featured')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles', function (ctx, next) {
    layout('two-column-left')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#left')
        .add('vehicles:filter', {query: ctx.query})
        .area('#middle')
        .add('vehicles:search', {query: ctx.query})
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/create-vehicles', can('vehicle:create'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        .area('#middle')
        .add('vehicles:create')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles/:id', can('vehicle:read'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('vehicles:findone', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles/:id/edit', can('vehicle:update'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('vehicles:create', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles/:id/delete', can('vehicle:update'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('vehicles:remove', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/mine', can('user'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        .area('#middle')
        .add('vehicles:mine')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

//TODO: redirect user to login page when authentication is needed
//TODO: basically a front controller pattern
utils.on('user', 'login', function (path) {
    var ctx;
    if (!path) {
        ctx = serand.current();
        path = ctx.path;
    }
    serand.store('state', {
        path: path
    });
    utils.emit('user', 'authenticator', {
        type: 'serandives',
        location: loginUri
    }, function (err, uri) {
        redirect(uri);
    });
});

utils.on('user', 'logged in', function (token) {
    var state = serand.store('state', null);
    redirect(state && state.path || '/');
});

utils.on('user', 'logged out', function (usr) {
    var state = serand.store('state', null);
    redirect(state && state.path || '/');
});

utils.emit('serand', 'ready');
