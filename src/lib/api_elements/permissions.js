var promises = require("q");
var helpers = require('../reusables/helpers');
var decorators = require("./decorators");




var permsEndpointFolder = "/perms/folder";

function Perms(requestEngine) {
    this.requestEngine = requestEngine;
    decorators.install(this);

    this.addDecorator("users", enlist("users"))
    this.addDecorator("groups", enlist("groups"))

}

function enlist(what) {
    return function (opts, data) {
        switch (opts.method) {
        case 'GET':
            opts.params || (opts.params = {});
            opts.params[what] = data.join("|");
            break;
        case 'POST':
            opts.json[what] = data;
            break;
        }
        return opts;
    }
}


var permsProto = {};

permsProto.disallow = function (pathFromRoot) {
    return this.allow(pathFromRoot, "None");
}
permsProto.allowView = function (pathFromRoot) {
    return this.allow(pathFromRoot, "Viewer");
}
permsProto.allowEdit = function (pathFromRoot) {
    return this.allow(pathFromRoot, "Editor");
}
permsProto.allowFullAccess = function (pathFromRoot) {
    return this.allow(pathFromRoot, "Full");
}
permsProto.allowOwnership = function (pathFromRoot) {
    return this.allow(pathFromRoot, "Owner");
}

permsProto.allow = function (pathFromRoot, permission) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
            var opts = {
                method: "POST",
                url: requestEngine.getEndpoint() + permsEndpointFolder + pathFromRoot,
                json: {
                    "permission": permission
                }
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.response;
        });
};

permsProto.getPerms = function (pathFromRoot) {
    var requestEngine = this.requestEngine;
    var decorate = this.getDecorator();

    return promises(true)
        .then(function () {
            pathFromRoot = helpers.encodeNameSafe(pathFromRoot) || "";
            var opts = {
                method: "GET",
                url: requestEngine.getEndpoint() + permsEndpointFolder + pathFromRoot
            };
            return requestEngine.promiseRequest(decorate(opts));
        }).then(function (result) { //result.response result.body
            return result.body;
        });
};


Perms.prototype = permsProto;

module.exports = Perms;