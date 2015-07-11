'use strict';

/**
 * @ngdoc function
 * @name blacktiger.controllers:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the blacktiger-admin interface
 */
angular.module('blacktiger-controllers')
        .controller('HallsCtrl', function ($scope, RoomSvc) {
            $scope.halls = [];
            $scope.data = {search: ''};
            $scope.mode = '';

            $scope.changeMode = function(mode) {
                $scope.mode = mode;
                $scope.data.search = '';
            };

            $scope.loadHalls = function() {
                $scope.halls = RoomSvc.query(null, $scope.data.search);
            };

            $scope.$watch(function() {
                return $scope.data.search;
            }, $scope.loadHalls);

            //$scope.loadHalls();
        });
