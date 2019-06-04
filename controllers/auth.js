var serand = require('serand');
var utils = require('utils');
var auth = require('auth');
var redirect = serand.redirect;

var base = utils.resolve('accounts://');
var loginUri = utils.resolve('autos:///auth');

module.exports.signin = function (ctx, next) {
    var location = ctx.query.redirect_uri

    serand.store('state', {
        location: location
    });

    auth.authenticator({
        type: 'serandives',
        location: loginUri
    }, function (err, uri) {
        if (err) {
            return next(err);
        }
        redirect(uri);
    });
};

module.exports.force = function (ctx, next) {
    if (ctx.token) {
        return next();
    }
    var path = ctx.path;
    var self = utils.resolve('accounts://');
    if (path.indexOf(self) === 0) {
        path = path.substring(self.length);
    }
    serand.store('state', {
        path: path
    });
    redirect('/signin');
};
