var pager = require('page');
var dust = require('dust')();

var serand = require('serand');
var page = serand.page;
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