'use strict';

/**
 * @ngdoc function
 * @name eventifyApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the eventifyApp
 */
angular.module('eventifyApp')
  .controller('EventCtrl', function ($scope, EventService, $routeParams, AuthService) {

    $scope.linkID = $routeParams.linkID;
    $scope.editing = false;

    $scope.Spotify = "";

    $scope.isLogged = AuthService.isLoggedIn();

    $scope.user = AuthService.currentUser();

    $scope.SpotifyURI = "";

    $scope.isAttending = function () {
      var attending = false;
      for (var i = 0; i < $scope.event.attendee.length; i++) {
        if ($scope.event.attendee[i].id == $scope.user.id) {
          attending = true;
        }
      }
      return attending;
    }

    //this name should be changed
    $scope.getEventByID = function () {
      $scope.eventStatus = true;
      EventService.Event.get({
        eventId: $scope.linkID
      }, function (data) {
        console.log(data);
        $scope.event = data;

        if ($scope.isLogged) {
          $scope.eventAdmin = ($scope.user.id === $scope.event.admin);
        }
        //checking spotify playlist for ng-show

        //setting bg picture
        $scope.bgStyle = {
          'background-image': 'url(' + $scope.event.coverPicture + ')'
        };

        //not sure if this should be in MapCtrl
        $scope.mapCenter = {
          latitude: data.locationLat,
          longitude: data.locationLong
        };

        //This is required by the directive
        $scope.markerCenter = {
          latitude: data.locationLat,
          longitude: data.locationLong
        };

        //couldn't make "{{event.id}}" work directly in the HTML

        $scope.id = data.id;
        $scope.Spotify = data.spotifyPlaylist;

        console.log(data.spotifyPlaylist);

        $scope.checkPlaylist = function () {
          if (data.spotifyPlaylist) {
            return true;
          } else {
            return false;
          }
        };

        $scope.SpotifyURI = 'https://embed.spotify.com/?uri=' + $scope.Spotify;

        $scope.attendees = data.attendee;

        $scope.eventStatus = false;

        //finally save data to service
        EventService.setEventData(data);

      }, function (data) {
        console.log(data);
      });
    };

    $scope.getUserByID = function (ID) {
      var user;
      $scope.attendees.forEach(function (attendee) {
        if (attendee.id === ID) {
          user = attendee;
        }
      });
      return user;
    };

  });
