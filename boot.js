var pager = require('page');
var dust = require('dust')();

var serand = require('serand');
var page = serand.page;
var redirect = serand.redirect;
var current = serand.current;
var layout = serand.layout(require);

//registering jquery, bootstrap etc. plugins
require('upload');
//init app
serand.init(require);

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
    layout('one-column')
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
    layout('one-column')
        .area('#header')
        .add('navigation')
        .area('#middle')
        .add('user-login')
        .render();
});

page('/register', function (ctx) {
    layout('one-column')
        .area('#header')
        .add('navigation')
        .area('#middle')
        .add('user-register')
        .render();
});

page('/add', function (ctx) {
    layout('one-column')
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
    redirect('/');
});

serand.on('user', 'logout', function (data) {
    redirect('/');
});

serand.emit('boot', 'init');