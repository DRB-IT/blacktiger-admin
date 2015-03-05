'use strict';

/**
 * @ngdoc function
 * @name blacktiger-app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the blacktiger-app
 */
angular.module('blacktiger-controllers')
        .controller('LoginCtrl', function ($scope, LoginSvc, $mdToast, translateFilter, $mdDialog, $timeout) {
            $scope.username = '';
            $scope.password = '';
            $scope.rememberMe = false;
            $scope.status = null;

            $scope.showLogin = function () {
                $mdDialog.show({
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    templateUrl: 'views/login.html',
                    controller: function ($scope, $mdDialog) {
                        $scope.login = function () {
                            LoginSvc.authenticate($scope.username, $scope.password, $scope.rememberMe).then(function () {
                                $scope.status = 'success';
                                $mdDialog.hide(true);
                            }, function (rejection) {
                                if (rejection.status === 0) {
                                    $mdToast.show($mdToast.simple().position('bottom right').content(translateFilter('GENERAL.UNABLE_TO_CONNECT')));
                                    $scope.status = 'no-connect';
                                } else {
                                    $mdToast.show($mdToast.simple().position('bottom right').content(translateFilter('LOGIN.INVALID_CREDENTIALS')));
                                    $scope.status = 'invalid';
                                }
                            });
                        };
                        
                    }
                });
            }


            $timeout($scope.showLogin, 100);
        });
