(function() {
  var _debug = function () {} ;//console.log.bind(console);

  /*
   * Add a script to head with the given scriptUrl
   *
   * @param {String} scriptUrl
   */
  var addScriptTag = function(scriptUrl) {
    _debug("adding script " + scriptUrl);
    var tag = document.createElement('script');
    tag.src = scriptUrl;
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  };
  var srcValGl;
  /*
   * Soundcloud Media Controller - Wrapper for Soundcloud Media API
   * API SC.Widget documentation: http://developers.soundcloud.com/docs/api/html5-widget
   * API Track documentation: http://developers.soundcloud.com/docs/api/reference#tracks
   *
   * @param {videojs.Player} player
   * @param {Object} options
   * @param {Function} ready
   */
  videojs.Soundcloud = videojs.MediaTechController.extend({
    init: function(player, options, ready) {
      videojs.MediaTechController.call(this, player, options, ready);
      var key, _i, _len, _ref;
      _debug("initializing Soundcloud tech");
      this.features.fullscreenResize = true;
      this.features.volumeControl = true;
      videojs.MediaTechController.call(this, player, options, ready);
      this.player_ = player;
      this.player_el_ = this.player_.el();
      if (typeof options.source !== 'undefined') {
        _ref = options.source;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          this.player_.options()[key] = options.source[key];
        }
      }
      this.soundcloudSource = srcValGl || this.srcVal ||  this.player_.options().src || "";
      if (!this.canPlaySource(this.soundcloudSource))
      throw new Error("eee");
      this.scWidgetId = this.player_.id() + '_soundcloud_api';
      this.scWidgetElement = videojs.Component.prototype.createEl('iframe', {
        id: this.scWidgetId,
        className: 'vjs-tech',
        scrolling: 'no',
        marginWidth: 0,
        marginHeight: 0,
        frameBorder: 0,
        webkitAllowFullScreen: "true",
        mozallowfullscreen: "true",
        allowFullScreen: "true",
        style: "visibility: hidden;",
        src: "https://w.soundcloud.com/player/?url=" + this.soundcloudSource
      });
      this.player_el_.appendChild(this.scWidgetElement);
      this.player_el_.classList.add("backgroundContainer");
      _debug("added widget div");
      if (this.player_.options().autoplay) {
        this.playOnReady = true;
      }
      _debug("loading soundcloud");
      this.loadSoundcloud();
    }
  });

  /*
   * Destruct the tech and it's DOM elements
   */
  videojs.Soundcloud.prototype.dispose = function() {
    _debug("dispose");
    if (this.scWidgetElement) {
      this.scWidgetElement.remove();
      _debug("Removed widget Element");
      _debug(this.scWidgetElement);
    }
    this.player_.el().classList.remove("backgroundContainer");
    this.player_.el().style.backgroundImage = "";
    _debug("removed CSS");
    if (this.soundcloudPlayer) {
        delete this.soundcloudPlayer;
         this.isReady_ = false;
    }
  };

  videojs.Soundcloud.prototype.load = function(src) {
    _debug("loading");
    this.loadSoundcloud();
  };

  videojs.Soundcloud.prototype.src = function(src) {
    var _this = this;
    _debug("load a new source(" + src + ")");
    return this.soundcloudPlayer.load(src, {
      callback: function() {
        _this.onReady();
      }
    });
  };

  videojs.Soundcloud.prototype.updatePoster = function() {
    var _this = this;
    return this.soundcloudPlayer.getSounds(function(sounds) {
      var posterUrl, sound;
      if (sounds.length > 1) {
        return;
      }
      sound = sounds[0];
      if (!sound.artwork_url) {
        return;
      }
      _debug("Setting poster to " + sound.artwork_url);
      posterUrl = sound.artwork_url;
      _this.player_.el().style.backgroundImage = "url('" + posterUrl + "')";
    });
  };

  videojs.Soundcloud.prototype.play = function() {
    if (this.isReady_) {
      _debug("play");
      this.soundcloudPlayer.play();
    } else {
      _debug("to play on ready");
      this.playOnReady = true;
    }
  };

  /*
   * Toggle the playstate between playing and paused
   */
  videojs.Soundcloud.prototype.toggle = function() {
    _debug("toggle");
    if (this.player_.paused()) {
      this.player_.play();
    } else {
      this.player_.pause();
    }
  };

  videojs.Soundcloud.prototype.pause = function() {
    _debug("pause");
    this.soundcloudPlayer.pause();
  };

  videojs.Soundcloud.prototype.paused = function() {
    _debug("paused: " + this.paused_);
    return this.paused_;
  };

  /*
   * Get the track's current time in seconds
   *
   * @return {Number}
   */
  videojs.Soundcloud.prototype.currentTime = function() {
    _debug("currentTime " + (this.durationMilliseconds * this.playPercentageDecimal / 1000));
    return this.durationMilliseconds * this.playPercentageDecimal / 1000;
  };
  
  /*
   * Set the track's current time in seconds
   *
   * @param {Number} seconds
   */
  videojs.Soundcloud.prototype.setCurrentTime = function(seconds) {
    _debug("setCurrentTime");
    this.soundcloudPlayer.seekTo(seconds * 1000);
    this.player_.trigger('timeupdate');
  };

  /*
   * Get the track's duration in secondn
   *
   * @return {Number}
   */
  videojs.Soundcloud.prototype.duration = function() {
    return this.durationMilliseconds / 1000;
  };

  videojs.Soundcloud.prototype.buffered = function() {
    var timePassed;
    timePassed = this.duration() * this.loadPercentageDecimal;
    //_debug("buffered " + timePassed);
    return videojs.createTimeRange(0, timePassed);
  };

  videojs.Soundcloud.prototype.volume = function() {
    _debug("volume: " + this.volumeVal);
    return this.volumeVal;
  };

  videojs.Soundcloud.prototype.setVolume = function(percentAsDecimal) {
    _debug("setVolume(" + percentAsDecimal + ") from " + this.volumeVal);
    if (percentAsDecimal !== this.volumeVal) {
      this.volumeVal = percentAsDecimal;
      this.soundcloudPlayer.setVolume(this.volumeVal * 100);
      _debug("volume has been set");
      this.player_.trigger('volumechange');
    }
  };

  videojs.Soundcloud.prototype.muted = function() {
    _debug("muted: " + (this.volumeVal === 0));
    return this.volumeVal === 0;
  };

  /*
   * Soundcloud doesn't do muting so we need to handle that.
   * 
   * A possible pitfall is when this is called with true and the volume has been changed elsewhere.
   * We will use @unmutedVolumeVal
   * 
   * @param {Boolean} muted
   */
  videojs.Soundcloud.prototype.setMuted = function(muted) {
    _debug("setMuted(" + muted + ")");
    if (muted) {
      this.unmuteVolume = this.volumeVal;
      this.setVolume(0);
    } else {
      this.setVolume(this.unmuteVolume);
    }
  };

  /*
   * Take a wild guess ;)
   */
  videojs.Soundcloud.isSupported = function() {
    _debug("isSupported: " + true);
    return true;
  };

  videojs.Soundcloud.prototype.supportsFullScreen = function() {
    _debug("we support fullscreen!");
    return true;
  };
  
  /**
   * Enter fullscreen mode
   */
  videojs.Soundcloud.prototype.enterFullScreen = function() {
    _debug("enterfullscreen");
    this.scWidgetElement.webkitEnterFullScreen();
  };

  /**
   * Exit fullscreen mode
   */
  videojs.Soundcloud.prototype.exitFullScreen = function() {
    _debug("EXITfullscreen");
    this.scWidgetElement.webkitExitFullScreen();
  };

  /*
   * Simple URI host check of the given url to see if it's really a soundcloud url
   
   * @param url {String}
   */
  videojs.Soundcloud.prototype.isSoundcloudUrl = function(url) {
    if (url.indexOf('soundcloud') != -1)
        return true;
    return false;
  };

  /*
   * We expect "audio/soundcloud" or a src containing soundcloud
   */
  videojs.Soundcloud.prototype.canPlaySource = videojs.Soundcloud.canPlaySource = function(source) {
    var ret;
    if (typeof source === "string") {
      return videojs.Soundcloud.prototype.isSoundcloudUrl(source);
    } else {
      _debug("Can play source?");
      _debug(source);
      ret = (source.type === 'audio/soundcloud') || videojs.Soundcloud.prototype.isSoundcloudUrl(source.src);
        if (ret)  { 
            this.srcVal = source.src;
            srcValGl = source.src;
        }
      return ret;
    }
  };

  videojs.Soundcloud.prototype.currentSrc = function(){ return this.srcVal; };
  /*
   * Take care of loading the Soundcloud API
   */
  videojs.Soundcloud.prototype.loadSoundcloud = function() {
    if(window.SC) {
      this.initWidget();
    } else {
      if(!videojs.Soundcloud._scriptInserted) {
        videojs.Soundcloud._scriptInserted = true;
        addScriptTag("https://w.soundcloud.com/player/api.js");
      }
      
      var _this = this;
      this._scriptPollId = setInterval(function() {
        if(window.SC) {
          clearInterval(_this._scriptPollId);
          _this.initWidget();
        }
      });
    }
  };

  /*
   * It should initialize a soundcloud Widget, which will be our player
   * and which will react to events.
   */
  videojs.Soundcloud.prototype.initWidget = function() {
    var _this = this;
    _debug("Initializing the widget");
    this.soundcloudPlayer = SC.Widget(this.scWidgetElement);
    _debug("created widget");
    this.soundcloudPlayer.bind(SC.Widget.Events.READY, function() {
      _this.onReady();
    });
    _debug("attempted to bind READY");
    this.soundcloudPlayer.bind(SC.Widget.Events.PLAY_PROGRESS, function(eventData) {
      _this.onPlayProgress(eventData.relativePosition);
    });
    this.soundcloudPlayer.bind(SC.Widget.Events.LOAD_PROGRESS, function(eventData) {
      _debug("loading");
      _this.onLoadProgress(eventData.loadedProgress);
    });
    this.soundcloudPlayer.bind(SC.Widget.Events.ERROR, function(error) {
      _this.onError(error);
    });
    this.soundcloudPlayer.bind(SC.Widget.Events.PLAY, function() {
      _this.onPlay();
    });
    this.soundcloudPlayer.bind(SC.Widget.Events.PAUSE, function() {
      _this.onPause();
    });
    return this.soundcloudPlayer.bind(SC.Widget.Events.FINISH, function() {
      _this.onFinished();
    });
  };

  /*
   * Callback for soundcloud's READY event.
   */
  videojs.Soundcloud.prototype.onReady = function() {
    var _this = this;
    _debug("onReady");
    this.volumeVal = 0;
    this.durationMilliseconds = 1;
    this.loadPercentageDecimal = 0;
    this.playPercentageDecimal = 0;
    this.paused_ = true;
    this.soundcloudPlayer.getVolume(function(volume) {
      _this.unmuteVolume = volume / 100;
      _this.setVolume(_this.unmuteVolume);
    });
    this.soundcloudPlayer.getDuration(function(duration) {
      _this.durationMilliseconds = duration;
      _this.player_.trigger('durationchange');
      _this.player_.trigger("canplay");
    });
    this.updatePoster();
    this.triggerReady();
    this.isReady_ = true;
    if (this.playOnReady) {
      this.soundcloudPlayer.play();
    }
  };

  /*
   * Callback for Soundcloud's PLAY_PROGRESS event
   * It should keep track of how much has been played.
   * 
   * @param {Decimal= playPercentageDecimal} [0...1] How much has been played  of the sound in decimal from [0...1]
   */


  videojs.Soundcloud.prototype.onPlayProgress = function(playPercentageDecimal) {
    this.playPercentageDecimal = playPercentageDecimal;
    _debug("onPlayProgress");
    this.player_.trigger("playing");
  };

  /*
   * Callback for Soundcloud's LOAD_PROGRESS event.
   * It should keep track of how much has been buffered/loaded.
   *
   * @param {Decimal= loadPercentageDecimal} How much has been buffered/loaded of the sound in decimal from [0...1]
   */
  videojs.Soundcloud.prototype.onLoadProgress = function(loadPercentageDecimal) {
    this.loadPercentageDecimal = loadPercentageDecimal;
    _debug("onLoadProgress: " + this.loadPercentageDecimal);
    this.player_.trigger("timeupdate");
  };

  /*
   * Callback for Soundcloud's PLAY event.
   * It should keep track of the player's paused and playing status.
   */
  videojs.Soundcloud.prototype.onPlay = function() {
    _debug("onPlay");
    this.paused_ = false;
    this.playing = !this.paused_;
    this.player_.trigger("play");
  };

  /*
   * Callback for Soundcloud's PAUSE event.
   * It should keep track of the player's paused and playing status.
   */
  videojs.Soundcloud.prototype.onPause = function() {
    _debug("onPause");
    this.paused_ = true;
    this.playing = !this.paused_;
    this.player_.trigger("pause");
  };

  /*
   * Callback for Soundcloud's FINISHED event.
   * It should keep track of the player's paused and playing status.
   */
  videojs.Soundcloud.prototype.onFinished = function() {
    this.paused_ = false;
    this.playing = !this.paused_;
    this.player_.trigger("ended");
  };

  /*
   * Callback for Soundcloud's ERROR event.
   * Sadly soundlcoud doesn't send any information on what happened when using the widget API --> no error message.
   */
  videojs.Soundcloud.prototype.onError = function() {
    this.player_.error = "Soundcloud error";
    this.player_.trigger('error');
  };
  
  videojs.Soundcloud._scriptInserted = false;
  
}).call(this);
