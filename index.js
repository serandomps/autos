var dust = require('dust')();

var serand = require('serand');
var auth = require('auth');
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

var author = require('./controllers/auth');

var can = function (permission) {
    return function (ctx, next) {
        next();
    };
};

page('/signin', author.signin);

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
        .add('model-vehicles:recent')
        .area('#middle')
        .add('autos-client:home')
        .add('model-vehicles:featured')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles', function (ctx, next) {
    var o = utils.fromQuery(ctx.query);
    o.count = o.count || 30;
    layout('two-column-left')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#left')
        .add('model-vehicles:filter', {query: o.query})
        .area('#middle')
        .add('model-vehicles:search', {
            loadable: true,
            query: o
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/create-vehicles', can('vehicle:create'), function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        .area('#middle')
        .add('model-vehicles:create')
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
        .add('model-vehicles:findone', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles/:id/edit', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-vehicles:create', {
            id: ctx.params.id
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/:model/:about/report', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-messages:create', {
            model: ctx.params.model,
            about: ctx.params.about
        })
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

page('/vehicles/:id/delete', function (ctx, next) {
    layout('one-column')
        .area('#header')
        .add('autos-client:navigation')
        //.add('breadcrumb')
        .area('#middle')
        .add('model-vehicles:remove', {
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
        .add('model-vehicles:mine')
        .area('#footer')
        .add('footer')
        .render(ctx, next);
});

utils.on('user', 'login', function (location) {
    if (!location) {
        location = serand.path();
    }
    serand.store('state', {
        location: location
    });

    auth.authenticator({
        type: 'serandives',
        location: loginUri
    }, function (err, uri) {
        if (err) {
            return console.error(err);
        }
        redirect(uri);
    });
});

utils.on('user', 'logged in', function (token) {
    var state = serand.store('state', null);
    redirect(state && state.location || '/');
});

utils.on('user', 'logged out', function (usr) {
    var state = serand.store('state', null);
    redirect(state && state.location || '/');
});

utils.emit('serand', 'ready');
