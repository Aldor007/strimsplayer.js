describe('strimsplayer "Dodaj strim" page', function() {
    var header = element(by.css('.navbar'));
    var dropdown = header.element(by.css('.dropdown'));
    var container = element(by.css('[ng-controller=FormCtrl]'));
    var form = container.element(by.tagName('form'));
    var input = form.element(by.tagName('input'));
    var submit = form.all(by.css('[type=submit]'));


    beforeEach(function() {
        browser.get('http://localhost:1337/dodaj/strim');
    });
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Dodaj strim | strimsplayer.pl');
    });
    it('should have a navigation bar', function() {
        expect(header.element(by.css('.navbar-brand')).isPresent()).toBe(true);
        expect(header.getWebElement().getAttribute('ng-controller')).toEqual('DropdownCtrl');
        expect(dropdown.isPresent()).toBe(true);
        expect(dropdown.all(by.css('li')).count()).toBeGreaterThan(0);
    });
    it('should have container', function() {
        expect(container.isPresent()).toBe(true);
        expect(form.isPresent()).toBe(true);
        expect(form.getWebElement().getAttribute('name')).toEqual('strimForm');
        expect(submit.count()).toEqual(1);
        expect(input.isPresent()).toBe(true);
    });
});
