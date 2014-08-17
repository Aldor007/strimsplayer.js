describe('strimsplayer homepage', function() {
    var header = element(by.css('.navbar'));
    var dropdown = header.element(by.css('.hidden-xs .dropdown'));
    var player = element(by.css('#video_player'));
    var playlist = element(by.css('#block_with_scroll'));
    var playlistComponents = element(by.css('.playlist-components'));
    var playlistHeder = element(by.css('#strimheader h1'));

    beforeEach(function() {
        browser.get('http://localhost:1337');
        browser.driver.manage().window().setPosition(0, 0);
        browser.driver.manage().window().setSize(1280, 700);
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
    it('should have a playlist header', function() {
        expect(playlistHeder.getText()).toEqual('Wszystkie strimy');
    });
    it('should change the playlist header depending on chosen strim', function () {
        var logo = element(by.css('a.navbar-brand'));
        var firstStrim = dropdown.element(by.css('.dropdown-menu')).all(by.tagName('li')).first().element(by.tagName('a'));
        var firstStrimName = firstStrim.getInnerHtml();
        firstStrimName.then(function(strimTxt){
            strimTxt = strimTxt.replace(/\s+?/, '');
            dropdown.click();
            firstStrim.click();
            playlistHeder.getText().then(function(headerTxt) {
                expect(headerTxt.toLowerCase()).toEqual(strimTxt.toLowerCase());

                browser.navigate().back()
                expect(playlistHeder.getText()).toEqual('Wszystkie strimy');
            });
        });

    });
    it('song info should match selected item', function(){
        var selected = playlist.element(by.css('li.active a.song-title'));
        var songInfo = element(by.css('h3.songtitle'));
        selected.getInnerHtml().then(function(selTxt){
            expect(songInfo.getText()).toEqual(selTxt);
        });
        dropdown.click();
        dropdown.element(by.css('.dropdown-menu')).all(by.tagName('li')).first().element(by.tagName('a')).click();
        selected = playlist.element(by.css('li.active a.song-title'));
        songInfo = element(by.css('h3.songtitle'));
        selected.getInnerHtml().then(function(selTxt){
            expect(songInfo.getText()).toEqual(selTxt);
        });
    });
    it('clicking "next" and "prev" should change selected song', function(){
        var next = playlistComponents.element(by.css('#next'));
        var prev = playlistComponents.element(by.css('#prev'));
        var selected;// = playlist.element(by.css('li.active a.song-title'));
        var songInfo;// = element(by.css('h3.songtitle'));

        next.click();
        selected = playlist.element(by.css('li.active a.song-title'));
        songInfo = element(by.css('h3.songtitle'));
        selected.getInnerHtml().then(function(selTxt){
            expect(songInfo.getText()).toEqual(selTxt);
        });

        prev.click();
        selected = playlist.element(by.css('li.active a.song-title'));
        songInfo = element(by.css('h3.songtitle'));
        selected.getInnerHtml().then(function(selTxt){
            expect(songInfo.getText()).toEqual(selTxt);
        });
    });
});
