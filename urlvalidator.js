module.exports = class UrlValidator {
    constructor() {
        this.protocol = "https?://";
        const subdomain = "[a-zA-Z0-9-]+";
        const domain = "[a-zA-Z0-9-]+";
        const topDomain = "[a-zA-Z0-9-]+";
        const query = "[a-zA-Z0-9-]+=[a-zA-Z0-9-]+";
        this.queryList = `\\?${query}(&${query})*`;
        const subdir = "/[a-zA-Z0-9-]+"
        this.subdirectories = `${subdir}(${subdir})*`;

        this.regex =
            new RegExp(`^${this.protocol}(${subdomain}\.)?${domain}\.${topDomain}(${this.subdirectories})?/?(${this.queryList})?$`);
    }
    test(url) {
      return this.regex.test(url);
    }
    getDomain(url){
        return url.replace(new RegExp(this.protocol),"").replace(new RegExp("^(.*?)[/\?].*?$"),"$1");
    }
  }
//export {UrlValidator};
//console.log(new RegExp(`\\?asdf`).test("?asdf"))
//console.log(new UrlValidator().test("https://www.google.com/asdf/asdf/?asdf=1&asdf=2"));
//console.log(new UrlValidator().getDomain("https://www.google.com"));