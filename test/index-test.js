var assert = require('chai').assert;
const whatssappAuto = require("../whatssappAuto");
var browser = new whatssappAuto(false);

describe('Puppeteer Test.', function () {
    it('Check that puppeteer runs proprely', (done) => {     
        assert(browser.launchBrowser().then((callback) => { browser.close()}) ,true);
        done();
    });

});
