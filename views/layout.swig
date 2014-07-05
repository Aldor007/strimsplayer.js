<!DOCTYPE html>
<html ng-app="app">
<head>
<meta charset="utf-8">
<title>{% block title %}strimsplayer.pl{% endblock %}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="author" content="Aldor">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--STYLES-->
<link rel="stylesheet" href="/styles/importer.css">
<link rel="stylesheet" href="/styles/video-js.css">
<!--STYLES END-->
<!--SCRIPTS-->
<script src="/js/dependencies/sails.io.js"></script>
<script src="/js/angular/aangular.min.js"></script>
<script src="/js/angular/angular-sails.io.js"></script>
<script src="/js/app.js"></script>
<script src="/js/controllers/restCtrl.js"></script>
<script src="/js/controllers/sailsSocketCtrl.js"></script>
<script src="/js/controllers/todoCtrl.js"></script>
<script src="/js/services/sailsSocket.js"></script>
<script src="/js/ui-bootstrap.min.js"></script>
<script src="/js/videojs-playlists.js"></script>
<script src="/js/videojs/video.dev.js"></script>
<script src="/js/videojs/videojs-playlists.js"></script>
<script src="/js/videojs/youtube.js"></script>
<!--SCRIPTS END-->
{% block stylesheet %}{% endblock %}
  {% block extra_head %}{% endblock %}


</head>

<body data-spy="scroll" data-target=".bs-docs-sidebar" data-twttr-rendered="true">
    <!-- Navbar
    ================================================== -->
   <div ng-controller="DropdownCtrl">
    <!-- Single button -->
    <div class="btn-group" dropdown is-open="status.isopen">
      <button type="button" class="btn btn-primary dropdown-toggle" ng-disabled="disabled">
        Button dropdown <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" role="menu">
        <li ng-repeat="choice in strims">
                <a href="/s/[[choice.slug]]">[[ choice.name ]] </a>
          </li>
      </ul>
    </div>
   <script>function DropdownCtrl($scope, $http) {
    $http({
    url: "/strim/list",
    dataType: "json",
    method: "GET",
    headers: {
    "Content-Type": "application/json; charset=utf-8"
    }
    }).success(function(response){
        console.log(response);
        $scope.strims = response;
    }).error(function(error){
        $scope.error = error;
        console.log('error' + error);
    });


    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
    };
    }
    </script>

</div> 
    
<div class='container'>


    {% block content %}{% endblock %}
    <div class="row">
      <a href="https://github.com/Belelros/videojs-playLists"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
    <header>
        <h1>VideoJS Playlists Demo</h1>
    </header>
    <div class="video-holder centered">
        <video id="video" class="video-js vjs-default-skin"
               controls preload="auto" width="640" height="264"
               data-setup='{}'>
        </video>
        <div class="playlist-components">
            <div class="playlist">
                <ul></ul>
            </div>
            <div class="button-holder">
                <img id="prev" alt="Previous video" src="img/Previous.png">
                <img id="next" alt="Next video" src="img/Next.png">
            </div>
        </div>
    </div>
</div>
    <!-- Footer
    ================================================== -->
    <footer class="footer">
      <div class="container">
      &copy 2013 <a href="http://strims.pl/u/Aldor">Aldor</a>
        <p class="pull-right"><a href="#">Back to top</a></p>
      </div>
    </footer>

  <video id="vid1" src="" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360" data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }'>
  </video>
<!-- Use Assetic -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<!-- Placed at the end of the document so the pages load faster -->

<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
{% block javascript %}{% endblock %}

<script>
(function($){
  var videos = [
    {
    techOrder: ['youtube'], 
    src: 'http://www.youtube.com/watch?v=xjS6SftYQaQ',
      title : 'Video 1'
    },
    {
    src: 'http://www.youtube.com/watch?v=xjS6SftYQaQ',
      title : 'Video 2'
    },
    {
    src: 'http://www.youtube.com/watch?v=xjS6SftYQaQ',
      title : 'Video 3'
    }
  ];


  var demoModule = {
    init : function(){
      this.els = {};
      this.cacheElements();
      this.initVideo();
      this.createListOfVideos();
      this.bindEvents();
      this.overwriteConsole();
    },
    overwriteConsole : function(){
      console._log = console.log;
      console.log = this.log;
    },
    log : function(string){
      demoModule.els.log.append('<p>' + string + '</p>');
      console._log(string);
    },
    cacheElements : function(){
      this.els.$playlist = $('div.playlist > ul');
      this.els.$next = $('#next');
      this.els.$prev = $('#prev');
      this.els.log = $('div.panels > pre');
    },
    initVideo : function(){
      this.player = videojs('video');
      this.player.playList(videos);
    },
    createListOfVideos : function(){
      var html = '';
      for (var i = 0, len = this.player.pl.videos.length; i < len; i++){
        html += '<li data-videoplaylist="'+ i +'">'+
                  '<span class="number">' + (i + 1) + '</span>'+
                  '<span class="poster"><img src="'+ videos[i].poster +'"></span>' +
                  '<span class="title">'+ videos[i].title +'</span>' +
                '</li>';
      }
      this.els.$playlist.empty().html(html);
      this.updateActiveVideo();
    },
    updateActiveVideo : function(){
      var activeIndex = this.player.pl.current;

      this.els.$playlist.find('li').removeClass('active');
      this.els.$playlist.find('li[data-videoplaylist="' + activeIndex +'"]').addClass('active');
    },
    bindEvents : function(){
      var self = this;
      this.els.$playlist.find('li').on('click', $.proxy(this.selectVideo,this));
      this.els.$next.on('click', $.proxy(this.nextOrPrev,this));
      this.els.$prev.on('click', $.proxy(this.nextOrPrev,this));
      this.player.on('next', function(e){
        console.log('Next video');
        self.updateActiveVideo.apply(self);
      });
      this.player.on('prev', function(e){
        console.log('Previous video');
        self.updateActiveVideo.apply(self);
      });
      this.player.on('lastVideoEnded', function(e){
        console.log('Last video has finished');
      });
    },
    nextOrPrev : function(e){
      var clicked = $(e.target);
      this.player[clicked.attr('id')]();
    },
    selectVideo : function(e){
      var clicked = e.target.nodeName === 'LI' ? $(e.target) : $(e.target).closest('li');

      if (!clicked.hasClass('active')){
        console.log('Selecting video');
        var videoIndex = clicked.data('videoplaylist');
        this.player.playList(videoIndex);
        this.updateActiveVideo();
      }
    }
  };

  demoModule.init();
})(jQuery);
</script>
</body>

</html>
