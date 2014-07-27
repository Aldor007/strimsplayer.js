//videojs-playlists.js
function playList(options,arg){
  var player = this;
  player.pl = player.pl || {};
  var index = parseInt(options,10);

  player.pl._guessVideoType = function(videosrc, video){
    var videoTypes, extension;
    if (video.techOrder !== undefined) {
        extension = video.techOrder;
        videoTypes = {
            'youtube' : 'video/youtube',
            'vimeo' : 'video/vimeo',
            'soundcloud': 'audio/soundcloud'
        };

    }
    else {
        videoTypes = {
          'webm' : 'video/webm',
          'mp4' : 'video/mp4',
          'ogv' : 'video/ogg'
        };
         extension = videosrc.split('.').pop();
     }
    return videoTypes[extension] || '';
  };

  player.pl.init = function(videos, options) {
    options = options || {};
    player.pl.videos = [];
    player.pl.current = 0;
    player.on('ended', player.pl._videoEnd);

    if (options.getVideoSource) {
      player.pl.getVideoSource = options.getVideoSource;
    }

    player.pl._addVideos(videos);
  };


  player.pl._addVideos = function(videos){
    for (var i = 0, length = videos.length; i < length; i++){

    if (typeof videos[i].src === 'string') {

          videos[i].src = {
              type : player.pl._guessVideoType(null, videos[i]),
              src : videos[i].src
          };
          player.pl.videos.push(videos[i]);
    }
    else {
        throw new Error('unuported');
        }
    }
  };

  player.pl._nextPrev = function(func){
    var comparison, addendum;

    if (func === 'next'){
      comparison = player.pl.videos.length -1;
      addendum = 1;
    }
    else {
      comparison = 0;
      addendum = -1;
    }

    if (player.pl.current !== comparison){
      var newIndex = player.pl.current + addendum;
      player.pl._setVideo(newIndex);
      player.trigger(func, [player.pl.videos[newIndex]]);
    }
  };

  player.pl._setVideo = function(index){
    if (index < player.pl.videos.length){
      player.pl.current = index;
      player.pl.currentVideo = player.pl.videos[index];

      if (!player.paused()){
        player.pl._resumeVideo();
      }

      if (player.pl.getVideoSource) {
        player.pl.getVideoSource(player.pl.videos[index], function(src, poster) {
          player.pl._setVideoSource(src, poster);
        });
      } else {
        player.pl._setVideoSource(player.pl.videos[index].src, player.pl.videos[index].poster);
      }
    }
  };

  player.pl._setVideoSource = function(src, poster) {
    player.src(src);
  };

  player.pl._resumeVideo = function(){
    player.one('loadstart',function(){
      player.play();
    });
  };

  player.pl._videoEnd = function(){
    if (player.pl.current === player.pl.videos.length -1){
      player.trigger('lastVideoEnded');
    }
    else {
      player.pl._resumeVideo();
      player.next();
    }
  };

  player.pl._removeVideo = function(index){
      if (index !== player.pl.current) {
          player.pl.videos.splice(index, 1);
      }
      if (player.pl.current > index) {
          player.pl.current += -1;
      }
  };

  if (options instanceof Array){
    player.pl.init(options, arg);
    player.pl._setVideo(0);
    return player;
  }
  else if (index === index){ // NaN
    player.pl._setVideo(index);
    return player;
  }
  else if (typeof options === 'string' && typeof player.pl[options] !== 'undefined'){
    player.pl[options].apply(player);
    return player;
  }
}

videojs.Player.prototype.next = function(){
  this.pl._nextPrev('next');
  return this;
};
videojs.Player.prototype.prev = function(){
  this.pl._nextPrev('prev');
  return this;
};
videojs.Player.prototype.clearEvents = function () {
    if(this.pl)
        this.off('ended');
};
videojs.Player.prototype.addVideosEx = function(videos) {
    this.pl._addVideos(videos);
};
videojs.Player.prototype.removeVideo = function(index) {
    this.pl._removeVideo(index);
}

videojs.plugin('playList', playList);
