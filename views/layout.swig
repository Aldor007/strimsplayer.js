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
                                    <a href="!#/s/[[choice.slug]]">[[ choice.name ]] </a>
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
    url: "/api/strims/list",
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

    </script>

</div> 
    


{% block content %}{% endblock %}
<div class="container page-header" ng-controller="PlayerCtrl">
    <div ng-repeat="alert in alerts" ng-show="showInfo" class="row">
        <alert type="[[alert.type]]" close="closeAlert($index)">[[alert.msg]]</alert>
    </div>
    <div class="container page-header video-holder" >
        <div class="col-lg-7">
            <div class="video-holder"> 
                <header>
                    <h1>[[strimName]]</h1>
                </header>
                <video id="video" src="" class="video-js vjs-default-skin" controls preload="auto" width="640" height="360"  data-setup='{ "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ" }'>
                </video>
            </div>
        </div>

        <ng-view>
        </ng-view>
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
<script src="/js/dependencies/angular/angular.min.js"></script>
<script src="/js/dependencies/angular/zangular-route.min.js"></script>
<script src="/js/dependencies/ui-bootstrap.min.js"></script>
<script src="/js/dependencies/videojs/video.js"></script>
<script src="/js/dependencies/videojs/videojs-playlists.js"></script>
<script src="/js/dependencies/videojs/youtube.js"></script>
<script src="/js/dependencies/zzui-bootstrap-tpls.js"></script>
<script src="/js/app.js"></script>
<!--SCRIPTS END-->
{% block javascript %}{% endblock %}

</body>

</html>
