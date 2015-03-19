'use strict';

/**
 * @ngdoc function
 * @name blacktiger-app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blacktiger-app
 */
angular.module('blacktiger-controllers')
        .controller('MenuCtrl', function ($scope, LoginSvc, $rootScope, translateFilter, $window, $interval, SystemSvc) {
            $scope.system = null;
    
            $scope.logout = function() {
                LoginSvc.deauthenticate();
            };
            
            $scope.updateSystemInfo = function () {
                SystemSvc.getSystemInfo().then(function (data) {
                    //SystemSvc does not reject propery on error
                    //See https://github.com/DRB-IT/blacktigerjs/issues/14
                    // Check is the object is not an error beofre using it.
                    if(!angular.isDefined(data.message)) {
                        $scope.system = data;
                    }
                });
            };
            
            $scope.$on('$destroy', function () {
                $interval.cancel($scope.systemInfoTimerPromise);
            });
            
            
            
            
            $rootScope.$on('PushEventSvc.Lost_Connection', function () {
                $window.alert(translateFilter('GENERAL.LOST_CONNECTION'));
            });
            
            $scope.$on('login', function () {
                $scope.systemInfoTimerPromise = $interval($scope.updateSystemInfo, 5000);
                $scope.updateSystemInfo();
            });
        });
