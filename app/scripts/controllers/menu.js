'use strict';

/**
 * @ngdoc function
 * @name blacktiger-app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blacktiger-app
 */
angular.module('blacktiger-controllers')
        .controller('MenuCtrl', function ($scope, LoginSvc, $rootScope, translateFilter, $window) {
            $scope.system = null;
    
            $scope.logout = function() {
                LoginSvc.deauthenticate();
            };
            
            $rootScope.$on('PushEventSvc.Lost_Connection', function () {
                $window.alert(translateFilter('GENERAL.LOST_CONNECTION'));
            });

        });
