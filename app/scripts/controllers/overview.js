'use strict';

/**
 * @ngdoc function
 * @name eventifyApp.controller:OverviewCtrl
 * @description
 * # OverviewCtrl
 * Controller of the eventifyApp
 */
angular.module('eventifyApp')
    .controller('OverviewCtrl', function ($scope, UserService, EventService, $rootScope, AuthService, $location) {

        var userId;

        $scope.limitItems = 3;
        $scope.loadEvents = false;

        if (AuthService.isLoggedIn()) {
            userId = AuthService.currentUser().id;
        } else {
            $location.path('#/');
        }

        $scope.getEvents = function () {
            $scope.loadEvents = true;
            UserService.UserEvents.query({
                id: userId
            }, function (data) {
                console.log(data);
                angular.forEach(data, function (event) {

                    if (event.coverPicture) {
                        event.bgStyle = 'background: linear-gradient( rgba(0, 0, 0,0.5), rgba(0, 0, 0,0.5) ), url(' + event.coverPicture + ') no-repeat center center;';
                    }
                });
                $scope.loadEvents = false;
                $scope.events = data;

            }, function (data) {
                console.log(data);
                $scope.loadEvents = false;
            });
        };

        $scope.updateAttendance = function (event, going) {

            EventService.updateAttendance.update({}, {
                event: event.id,
                user: userId,
                going: going,
            }, function (data) {
                console.log(data);
                if (going) {

                }
            }, function (data) {
                console.log(data);
            });
        };

        //Upcoming : boolean, if true show the upcoming event if false the past event
        $scope.dateRangeFilter = function (property, upcoming) {
            return function (item) {
                if (item[property] === null) {
                    return true;
                }


                //Convert the date from a DD/MM/YYYY format to a js Date object
                var dateArray = item[property].split('-');
                var itemDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                var itemTimestamp = itemDate.getTime();
                var currentDate = Date.now();

                if ((upcoming && itemTimestamp >= currentDate) || (!upcoming && itemTimestamp < currentDate)) {
                    return true;
                }
                return false;
            };
        };

    });