const disallowedChars = /[":<>|?*\\]/;
const isHTTP = /^https?:\/\//;

const helpers = {
    encodeNameSafe (name) {
        if (!name) {
            throw new Error("No name given");
        }
        if (disallowedChars.test(name)) {
            throw new Error("Disallowed characters in path");
        }

        name = name.replace(/^\/\//, "/");

        return (name);
    },
    encodePathComponents (path) {
        path = helpers.encodeNameSafe(path)
        return path.split("/").map(encodeURIComponent).join("/").replace(/#/g,"%23");
        //TODO: handle special chars not covered by this.
    },
    normalizeEgnyteDomain (domain) {
        domain = helpers.normalizeURL(domain)
        if(!isHTTP.test(domain)) {
            domain = "https://" + domain
        }
        return domain;
    },
    normalizeURL(url) {
        return (url).replace(/\/*$/, "");
    },
    hintDeveloper(hint, err){
        //TODO: make this optinal, by configuration or dev build
        console && console.warn(hint, err)
    }
}


module.exports = helpers;