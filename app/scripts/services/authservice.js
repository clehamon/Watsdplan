'use strict';

/**
 * @ngdoc service
 * @name eventifyApp.AuthService
 * @description
 * # AuthService
 * Factory in the eventifyApp.
 */
angular.module('eventifyApp')
  .factory('AuthService', function ($auth, $location) {

    var currentUser = null;

    // Public API here
    return {

      login: function(user) {

          var httpConfig = {
            url: 'http://clementhamon.com/IDP/public/auth/login'
          };

          $auth.login(user, httpConfig)
          .then(function(response) {
                // Redirect user here after a successful log in.
                // console.log(response);
                currentUser = response.data;
                // $window.location.href = '#/overview';
                $location.path( '/overview' );
          })
          .catch(function(response) {
                // Handle errors here, such as displaying a notification
                // for invalid email and/or password.
                console.log(response);
          });
      },
      logout: function() {
            currentUser = null;
      },
      isLoggedIn: function() {
        return (currentUser !== null);
      },
      currentUser: function() { 
        return currentUser; 
      }
    };
  });
