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
<link rel="stylesheet" href="/styles/main.css">
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
};
    function PlayerCtrl($scope, $http) {
        var that = $scope;
        $scope.player = videojs('video', {'techOrder': ['youtube'], 'autoplay': false, 'src': 'https://www.youtube.com/watch?v=eY49xEQGqMw'});
        $scope.player.on('next', function(e){
            $scope.activeIndex++;;
          $scope.player.playList($scope.activeIndex);
          $scope.updateActiveVideo();
          $scope.player.play();
      });
      $scope.player.on('prev', function(e){
          $scope.activeIndex--;;
            $scope.changeEvent++;
          $scope.player.playList($scope.activeIndex);
          $scope.updateActiveVideo();
          $scopet.player.play();
      });
      $scope.player.on('lastVideoEnded', function(e){
        console.log('Last video has finished');
      });
        $scope.activeIndex = 0;
        $http({
            url: "/song/last",
            dataType: "json",
            method: "GET",
            headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
        }).success(function(response){
            $scope.songs = response;
            var parseToPlay = function(data) {
                var result = []
                for (var i = 0, len = data.length; i<len; i++) {
                    result.push({
                        type: 'video/youtube',
                        src: data[i].domain_url,
                        techOrder: ['youtube'],
                        title: data[i].title
                    });
                }
                return result;
            };
            $scope.player.playList(parseToPlay(response));


    }).error(function(error){
        $scope.error = error;
        console.log('error' + error);
    });
    $scope.nextOrPrev  = function($event) {
        var clicked = $event.target;
        $scope.player[clicked.id]();
        $scope.updateActiveVideo();
        
     };
     $scope.select = function(id, $event){

      if (id != $scope.activeIndex) {
        $scope.player.playList(id);
        $scope.updateActiveVideo();
    }
        $scope.player.play();
    };
    
    $scope.updateActiveVideo = function() {
         // $scope.$apply(function () {
        $scope.activeIndex = $scope.player.pl.current;
        try {
         if (!$scope.$$phase) {
            $scope.$apply($scope.activeIndex);
        }
            } catch (err) {
         console.log(err);
         }
         // });
    
    };
    };
    

    </script>

</div> 
    
<div class='container'>


    {% block content %}{% endblock %}
    <div class="row">
    <header>
        <h1>VideoJS Playlists Demo</h1>
    </header>
    <div class="video-holder centered" ng-controller="PlayerCtrl">
        <video id="video" src="" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360"  data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }'>
  </video>
        <div class="playlist-components">
            <div class="playlist">
                <ul>
            <li ng-repeat="song in songs" ng-class="{'active':$index   == activeIndex}"  ng-click="select($index)" >
            <a href="#" data-videoplaylist="[[$index]]" song-id="[[song.domain_url]]" >[[song.title]] </a>
             </li>
                </ul>
            </div>
            <div class="button-holder">
                <a id="prev" alt="Previous video" src="img/Previous.png" ng-click="nextOrPrev($event)">Prev</a>
               <!-- <a id="shufle" ng-click="shufle()">Prev</a>
               <a id="shufle" ng-click="shufle()">AutoPlayv</a> -->
                <a id="next" alt="Next video" src="img/Next.png" ng-click="nextOrPrev($event)">NEXT</a>
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

<!-- Use Assetic -->
<!-- Placed at the end of the document so the pages load faster -->

<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
{% block javascript %}{% endblock %}

</body>

</html>
