'use strict';

app.controller('PlayerCtrl', ['$scope', '$window', '$routeParams', 'strimsplayer', 'alertService',
    function PlayerCtrl($scope, $window, $routeParams, strimsplayer, alertService) {
        $scope.songs = [];
        $scope.songData = {};
        $scope.activeIndex = 0;
        $scope.thereAreMoreSongs = true;
        $scope.playlistContainer = $("#block_with_scroll");
        // $scope.strimName = "Wszystkie strimy";
        $scope.player = videojs('video_player', {'techOrder': ['youtube', 'soundcloud', 'vimeo' ], 'autoplay': false, 'ytcontrols': false, 'src': 'https://www.youtube.com/watch?v=xIc1iFoVTv0'});
        /*** PLAYER ****/
        $scope.player.on('next', function(e){
          $scope.updateActiveVideo();
          $scope.player.play();
        });

        $scope.player.on('prev', function(e){
            $scope.updateActiveVideo();
            $scope.player.play();
        });
        $scope.player.on('error', function(event) {
            var messages = {
                        // MEDIA_ERR_ABORTED
                1: "The video download was cancelled",
                // MEDIA_ERR_NETWORK
                2: "The video connection was lost, please confirm you're connected to the internet",
                // MEDIA_ERR_DECODE
                3: "The video is bad or in a format that can't be played on your browser",
                // MEDIA_ERR_SRC_NOT_SUPPORTED
                4: "This video is either unavailable or not supported in this browser",
                // MEDIA_ERR_ENCRYPTED (Chrome)
                5: "The video you're trying to watch is encrypted and we don't know how to decrypt it",
                unknown: "An unanticipated problem was encountered, check back soon and try again"
            };
            var code, dialog, player;
            code = event.target.error ? event.target.error.code : event.code;
            alertService.setAlert('danger', messages[code] || messages['unknown']);
        });

        $scope.player.on('lastVideoEnded', function(e){
            console.log('Last video has finished');
            if ($scope.thereAreMoreSongs)
                $scope.getMoreSongs();
        });

        $scope.nextOrPrev  = function($event) {
            var clicked = $event.target;
            $scope.player[clicked.id]();
        };
    /**** END PLAYER  ***/

    $scope.removeFromPlaylist = function($id) {
        if ($scope.activeIndex > $id) {
            $scope.activeIndex += -1;
            $scope.saveApply($scope.activeIndex);
        }
        $scope.player.removeVideo($id);
        $scope.songs.splice($id, 1);
    };

    $scope.select = function(id, $event){
        $scope.player.pause();
        if (id != $scope.activeIndex) {
            $scope.player.playList(id);
            //we don't want the playlist to scroll when users click on the playlist item
            //they may find it a bit confusing
            $scope.updateActiveVideo(false);
        }
        $scope.player.ready(function () {
            $scope.player.play();
        });
    };

    $scope.updateActiveVideo = function(doScroll) {
        doScroll = doScroll === undefined ? true : doScroll;

        $scope.player.error_ = null;
        $scope.player.error(null);
        $scope.activeIndex = $scope.player.pl.current;
        $scope.songData = $scope.songs[$scope.activeIndex];
        $scope.saveApply($scope.activeIndex);
        if (doScroll === true) {
            $scope.updatePlaylistPosition();
        }
    };

    $scope.updatePlaylistPosition = function() {
        var selected = $scope.playlistContainer.find("ul li").eq($scope.activeIndex);
        var offset;
        if (selected.length > 0) {
            offset = selected.position().top + $scope.playlistContainer.scrollTop() - $scope.playlistContainer.position().top;
            $scope.playlistContainer.animate({scrollTop: offset}, 300);
        }
    };

    $scope.isActive = function(index) {
        return index === $scope.activeIndex;
    }

    $scope.saveApply = function(data) {

        saveApply($scope, data);

    };
    /* ------------------API----------------*/
    $scope.findSongs = function(strimName) {
        strimName = strimName || '';
        if ($scope.thereAreMoreSongs)
            strimsplayer.callApi({url: strimsplayer.API.LISTBYNAME_SONGS_IN_STRIM + strimName, paginate: true, method: 'POST'} , function(Songerr, songs, after) {
                if (Songerr) {  //server errrpr
                    alertService.setAlert('danger', alertService.SERVER_ERROR);
                    console.log('Error ' + Songerr);
                    return;
                }
                else if (!songs || songs.length === 0 && after === 0) {
                    alertService.setAlert('info', alertService.NO_SONGS);
                    return;
                }
                var parseToPlay = function(data) {
                    var result = []
                    for (var i = 0, len = data.length; i<len; i++) {
                        var domain = data[i].domain.split('.')[0];
                        if (domain.indexOf('youtu') != -1)
                            domain = 'youtube'
                        var tmp = {
                            type: 'video/' + domain,
                            src: data[i].domain_url,
                            techOrder: [domain],
                            title: data[i].title
                        };
                        if (domain == 'soundcloud') {
                            tmp.type = 'audio/soundcloud';
                            tmp.soundcloudClientId = '6132bb5a168d685a9bb97f4efc5f8e18';
                        }
                        result.push(tmp);
                        data[i].strim = {
                            id: data[i].strim,
                            slug:  (data[i].strims_url.split('/')[2]).toLowerCase(),
                            name:  (data[i].strims_url.split('/')[2])
                        };
                }
                return result;
            };
            $scope.songData = songs[0];
            if (after == 0) { //first run of funciton,
                $scope.songs = songs;
                if ($scope.player) {
                    // $scope.player.dispose();
                     // delete $scope.player;
                }
                // $scope.player = videojs('video_player', {'techOrder': ['youtube', 'soundcloud','vimeo' ], 'autoplay': false,  'src': 'https://www.youtube.com/watch?v=eY49xEQGqMw'});
                $scope.player.playList(parseToPlay(songs));
            } else {
                if (songs.length == 0 ) {
                    $scope.thereAreMoreSongs = false;
                    return;
                }
                for (var i = 0; i < songs.length; i++)
                    $scope.songs.push(songs[i]);
                $scope.player.addVideosEx(parseToPlay(songs));
            }

            $scope.saveApply($scope.songData);
            $scope.saveApply($scope.strimName);
            $scope.saveApply($scope.songs);
            $scope.saveApply($scope.player)

         });
    };
    $scope.getMoreSongs = function() {
        if ($routeParams.strim) {
            var currentRouteParam = $routeParams.strim.toLowerCase();
            if( currentRouteParam != $scope.strimName) {
                $scope.strimName = currentRouteParam;
                strimsplayer.after = 0;
                $scope.player.clearEvents();
                $scope.thereAreMoreSongs = true;
                alertService.reset();
                $scope.findSongs($scope.strimName);
            }
            else {
                $scope.findSongs($scope.strimName);
                return;
            }
        } else {
            if( 'Wszystkie strimy' != $scope.strimName) {
                strimsplayer.after = 0;
                $scope.player.clearEvents();
            }
            $scope.strimName = "Wszystkie strimy";
            $scope.findSongs(null);
        }
    };

}]);


app.controller('DropdownCtrl', ['$scope',  'strimsplayer', 'alertService',
    function DropdownCtrl($scope, strimsplayer, alertService) {
    strimsplayer.callApi( {url: strimsplayer.API.LIST_STRIMS}, function (err, strimsMenuData) {
        if (err) {
            alertService.setAlert('danger', alertService.UNKNOW_EROR);
        }
        if (!strimsMenuData || strimsMenuData.length == 0) {
            alertService.setAlert('danger', alertService.UNKNOW_EROR);
        }
        $scope.strims = strimsMenuData;
        saveApply($scope, $scope.strims);
    });
    // $scope.isCollapsed = false;
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
}]);

app.controller('RootCtrl', ['$rootScope', 'alertService',
    function ($rootScope, alertService) {
        $rootScope.closeAlert = alertService.closeAlert;
}]);

app.controller('FormCtrl', ['$scope', '$http', 'strimsplayer', 'alertService',
    function($scope, $http,  strimsplayer, alertService) {

        $scope.submitForm = function(isValid) {
            if(isValid) {
                strimsplayer.callApi( {
                        url: strimsplayer.API.ADD_STRIM,
                        method: "POST",
                        data: {name: $scope.strimForm.name.$modelValue}
                }, function(err, response) {
                    if (err) {
                        return alertService.setAlert('danger', err);
                    }
                    alertService.setAlert('info', 'Strim dodany!');
                });

            }
        };

}]);
