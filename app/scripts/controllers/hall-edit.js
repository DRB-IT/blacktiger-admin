'use strict';

/**
 * @ngdoc function
 * @name blacktiger.controllers:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the blacktiger-admin interface
 */
angular.module('blacktiger-controllers')
        .controller('HallEditCtrl', function ($scope, RoomSvc, $routeParams, $window) {
            RoomSvc.get($routeParams.id).$promise.then(function(hall) {
                $scope.hall = hall;
                $scope.orgHall = angular.copy(hall);
            });

            $scope.isChanged = function() {
                return !angular.equals($scope.hall, $scope.orgHall);
            };

            $scope.save = function() {
                RoomSvc.save($scope.hall).$promise.then(function() {
                    $window.history.back();
                });
            };
        });
