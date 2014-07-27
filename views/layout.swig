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

<script src="http://connect.soundcloud.com/sdk.js"></script>
<script src="https://w.soundcloud.com/player/api.js"></script>
<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-52792740-1', 'auto');
        ga('send', 'pageview');

    </script>
</head>

<body data-spy="scroll" data-target=".bs-docs-sidebar" data-twttr-rendered="true" ng-controller="RootCtrl">
    <!-- Navbar
    ================================================== -->
   <header class="navbar navbar-default navbar-static-top" ng-controller="DropdownCtrl" >
    <div class="navbar-inner">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse" ng-click="isCollapsed = !isCollapsed">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand visible-xs" href="/">strimsplayer</a>
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
                        <ul class="dropdown-menu" roles="menu">
                            <li ng-repeat="choice in strims">
                                    <a href="/#s/[[choice.slug]]">[[ choice.name ]] </a>
                              </li>
                        </ul>
                    </li>
                    <li><a href="/dodaj/strim">Dodaj strim</a></li>
                </ul>
            </nav>
            <nav class="visible-xs" collapse="!isCollapsed">
            <ul class="nav navbar-nav navbar-collapse" collapse="!isCollapsed">
                    <li class="dropdown" >
                    <a role="button" class="dropdown-toggle">
                            Strims <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu" roles="menu">
                            <li ng-repeat="choice in strims">
                                    <a href="/#s/[[choice.slug]]">[[ choice.name ]] </a>
                              </li>
                        </ul>
                    </li>
                    <li> <a href="/dodaj/strim">Dodaj strim</a></li>
                </ul>
            </nav>
        </div>
    </div>
</header>

    <div ng-repeat="alert in alerts" ng-show="showInfo" class="container">
        <alert type="[[alert.type]]" close="closeAlert($index)">[[alert.msg]]</alert>
    </div>
{% block content %}
<div class="container page-header" ng-controller="PlayerCtrl">
    <div class="container  video-holder" >
        <div id="videoP" class="col-lg-7">
            <div class="video-holder"> 
                <video id="video_player" src="" class="video-js vjs-default-skin" controls preload="auto"   data-setup='{ "techOrder": [ "soundcloud", "youtube", "dailymotion", "vimeo"], 
                 "soundcloudClientId": "6132bb5a168d685a9bb97f4efc5f8e18",
                "src": "" }'>
                </video>
            </div>
        </div>

        <ng-view>
        </ng-view>
    </div>
</div>
{% endblock %}
    <!-- Footer
    ================================================== -->
    <footer class="footer">
      <div class="container">
      &copy 2014 <a href="http://strims.pl/u/Aldor">Aldor</a>
      </div>
    </footer>


<!--SCRIPTS-->
<script src="/min/production.min.js"></script>
<!--SCRIPTS END-->
{% block javascript %}{% endblock %}

</body>

</html>
