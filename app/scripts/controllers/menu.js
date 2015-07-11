'use strict';

/**
 * @ngdoc function
 * @name blacktiger-app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blacktiger-app
 */
angular.module('blacktiger-controllers')
        .controller('MenuCtrl', function ($scope, LoginSvc, $location) {
            $scope.system = null;

            $scope.logout = function() {
                LoginSvc.deauthenticate();
            };

            $scope.goto = function(path) {
                $location.path(path);
            };

        });
