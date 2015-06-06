'use strict';

/**
 * @ngdoc function
 * @name blacktiger.controllers:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the blacktiger-admin interface
 */
angular.module('blacktiger-controllers')
        .controller('LoginCtrl', function ($scope, LoginSvc, $mdToast, translateFilter, $mdDialog, $timeout) {
            $scope.username = '';
            $scope.password = '';
            $scope.rememberMe = false;
            $scope.status = null;

            $scope.login = function () {
                LoginSvc.authenticate($scope.username, $scope.password, $scope.rememberMe).then(function () {
                    $scope.status = 'success';
                }, function (rejection) {
                    if (rejection.status === 0) {
                        $mdToast.show($mdToast.simple().position('top right').content(translateFilter('GENERAL.UNABLE_TO_CONNECT')));
                        $scope.status = 'no-connect';
                    } else {
                        $mdToast.show($mdToast.simple().position('top right').content(translateFilter('LOGIN.INVALID_CREDENTIALS')));
                        $scope.status = 'invalid';
                    }
                });
            };


        });
