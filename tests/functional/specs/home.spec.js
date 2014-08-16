describe('strimsplayer homepage', function() {
    var header = element(by.css('.navbar'));
    var dropdown = header.element(by.css('.dropdown'));
    var player = element(by.css('#video_player'));
    var playlist = element(by.css('#block_with_scroll'));
    var playlistComponents = element(by.css('.playlist-components'));

    beforeEach(function() {
        browser.get('http://localhost:1337');
    });
    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('strimsplayer.pl');
    });
    it('should have a navigation bar', function() {
        expect(header.element(by.css('.navbar-brand')).isPresent()).toBe(true);
        expect(header.getWebElement().getAttribute('ng-controller')).toEqual('DropdownCtrl');
        expect(dropdown.isPresent()).toBe(true);
        expect(dropdown.all(by.css('li')).count()).toBeGreaterThan(0);
    });
    it('should have a videoplayer', function() {
        var classes = player.getWebElement().getAttribute('class');
        var expectedClasses = ['video-js', 'vjs-paused', 'vjs-default-skin', 'vjs-light-theme-skin'];
        expect(player.isPresent()).toBe(true);
        classes.then(function(data) {
            data = data.replace(/\s+?/g, ' ').split(' ');
            expectedClasses.forEach(function(c) {
                expect(data).toContain(c);
            });
        });
    });
    it('should have a playlist', function() {
        expect(playlist.isPresent()).toBe(true);
        expect(playlist.getWebElement().getAttribute('class')).toEqual('playlist');
        expect(playlist.all(by.css('ul li')).count()).toBeGreaterThan(0);
        expect(playlistComponents.isPresent()).toBe(true);
        expect(playlistComponents.element(by.css('#prev')).isPresent()).toBe(true);
        expect(playlistComponents.element(by.css('#next')).isPresent()).toBe(true);
    });
});
