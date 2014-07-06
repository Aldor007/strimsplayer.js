<!DOCTYPE html>
<html ng-app="app">
<head>
<meta charset="utf-8">
<title>{% block title %}strimsplayer.pl{% endblock %}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="author" content="Aldor">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--STYLES-->
<link rel="stylesheet" href="/min/production.min.css">
<!--STYLES END-->
{% block stylesheet %}{% endblock %}
  {% block extra_head %}{% endblock %}


</head>

<body data-spy="scroll" data-target=".bs-docs-sidebar" data-twttr-rendered="true">
    <!-- Navbar
    ================================================== -->
   <header class="navbar navbar-default" ng-controller="DropdownCtrl" >
    <div class="navbar-inner">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-3" ng-click="isCollapsed = !isCollapsed">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand visible-xs" href="#">UI Bootstrap</a>
            </div>
            <nav class="hidden-xs">
                <ul class="nav navbar-nav">
                    <a href="/" role="button" class="navbar-brand">
                        strimsplayer.pl
                    </a>
                    <li class="dropdown">
                        <a role="button" class="dropdown-toggle">
                            Strims <b class="caret"></b>
                        </a>
                        <
                        <ul class="dropdown-menu" roles="menu">
                            <li ng-repeat="choice in strims">
                                    <a href="/s/[[choice.slug]]">[[ choice.name ]] </a>
                              </li>
                        </ul>
                    </li>
                    <li><a href="#getting_started">Getting started</a></li>
                </ul>
            </nav>
            <nav class="visible-xs" collapse="!isCollapsed">
                <ul class="nav navbar-nav">
                    <li><a href="#getting_started" ng-click="isCollapsed = !isCollapsed">Getting started</a></li>
                    <li><a href="#directives_small" ng-click="isCollapsed = !isCollapsed">Directives</a></li>
                </ul>
            </nav>
        </div>
    </div>
</header>
<div class="header-placeholder"></div>
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
        $scope.songs = [];
        $scope.songData = {};
        $scope.strimName = "Wszystkie stirmy";
        $scope.player = videojs('video', {'techOrder': ['youtube'], 'autoplay': false, 'src': 'https://www.youtube.com/watch?v=eY49xEQGqMw'});
        $scope.player.on('next', function(e){
            $scope.activeIndex++;;
          $scope.player.playList($scope.activeIndex);
          $scope.updateActiveVideo();
          $scope.player.play();
      });
      $scope.player.on('prev', function(e){
          $scope.activeIndex--;;
          $scope.player.playList($scope.activeIndex);
          $scope.updateActiveVideo();
          $scopet.player.play();
      });
      $scope.player.on('lastVideoEnded', function(e){
        console.log('Last video has finished');
    });
        {% block angularSongsList %}
        $scope.activeIndex = 0;
        $http({
            url: "/song/list",
            dataType: "json",
            method: "GET",
            headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
        {% endblock %}
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
                    data[i].strim = {
                        slug:  (data[i].strims_url.split('/')[2]).toLowerCase(),
                        name:  (data[i].strims_url.split('/')[2])
                    };
                }
                return result;
            };
            $scope.songData = $scope.songs[0];
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
             $scope.songData = $scope.songs[$scope.activeIndex];
             
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
    


{% block content %}{% endblock %}
    <div class="container page-header video-holder" ng-controller="PlayerCtrl">
        <div class="col-lg-7">
            <div class="video-holder"> 
                <header>
                    <h1>[[strimName]]</h1>
                </header>
                <video id="video" src="" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360"  data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }'>
                </video>
            </div>
        </div>
        <div class="col-lg-5">
            <div class="row">
                <div class="playlist-components">
                    <div class="playlist">
                            <ul>
                                <li ng-repeat="song in songs" ng-class="{'active':$index   == activeIndex}"  ng-click="select($index)" >
                                    <a href="#" data-videoplaylist="[[$index]]" song-id="[[song.domain_url]]" >[[song.title]] </a>
                                </li>
                            </ul>
                    </div>
                    <div class="button-holder row">
                        <a id="prev" alt="Previous video" src="img/Previous.png" ng-click="nextOrPrev($event)">Prev</a>
                       <!-- <a id="shufle" ng-click="shufle()">Prev</a>
                       <a id="shufle" ng-click="shufle()">AutoPlayv</a> -->
                        <a id="next" alt="Next video" src="img/Next.png" ng-click="nextOrPrev($event)">Next</a>
                    </div>
                </div>
            </div>
            <div class="row songinfo">
                <div class="row">
                    <div class="content_voting">
                        <div class="content_voting">
                            <div class="content_vote_wrapper">
                                <span class="content_vote_count">[[songData.upvotes]]</span>
                            </div>
                            <div class=content_vote_wrapper>
                                <span class="content_vote_count">[[songData.downvotes]]</span>
                            </div>
                        </div>
                    </div>
                        <h3 class="songtitle">[[songData.title]]</h3>
                </div>
                <div class="row content_inner">
                        <span class="user"><a href="http://strims.pl/u/[[songData.user]]">@[[songData.user]]</a></span>
                        <span class="date">Dodane  [[songData.date| date:'dd MM yyyy o hh:mm']]</span> do strim
                        <span class="strimname"><a href="http://strims.pl/s/[[songData.strim.slug]]"> [[songData.strim.name]]</a>.</span>
                        <span class="strimlink"><a href="http://strims.pl[[songData.strims_url]]">Zobacz na strimse </a></span>
                 </div>
                    
             </div>
        </div>
   </div>
    <!-- Footer
    ================================================== -->
    <footer class="footer">
      <div class="container">
      &copy 2014 <a href="http://strims.pl/u/Aldor">Aldor</a>
      </div>
    </footer>

<!-- Use Assetic -->
<!-- Placed at the end of the document so the pages load faster -->

<!--SCRIPTS-->
<script src="/min/production.min.js"></script>
<!--SCRIPTS END-->
{% block javascript %}{% endblock %}

</body>

</html>
