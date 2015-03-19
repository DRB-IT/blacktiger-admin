'use strict';

/**
 * @ngdoc function
 * @name blacktiger-app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Used by Admin
 */
angular.module('blacktiger-controllers')
        .controller('RealtimeCtrl', function ($scope, $mdDialog, SummarySvc, $interval) {
            $scope.system = {};
            $scope.data = {};
            $scope.areaCode = 'all';

            $scope.loadData = function () {
                SummarySvc.getSummary().then(function (data) {
                    $scope.data = data;
                });
            };

            $scope.participantsPerHall = function () {
                var data = $scope.data[$scope.areaCode];
                if (!data || !data.halls || data.halls === 0 || !data.participants || data.participants === 0) {
                    return 0.0;
                } else {
                    return data.participants / data.halls;
                }
            };

            $scope.participantPercentageViaSip = function () {
                var data = $scope.data[$scope.areaCode];
                if (!data || !data.participants || data.participants === 0) {
                    return 0.0;
                } else {
                    return data.participantsViaSip / data.participants * 100;
                }
            };

            $scope.participantPercentageViaPhone = function () {
                var data = $scope.data[$scope.areaCode];
                if (!data || !data.participants || data.participants === 0) {
                    return 0.0;
                } else {
                    return 100 - $scope.participantPercentageViaSip();
                }
            };


            $scope.resolveActiveAreas = function () {
                var areas = [];

                angular.forEach($scope.data, function (value, key) {
                    areas.push(key);
                });
                return areas;
            };

            $scope.selectArea = function ($event) {
                $mdDialog.show({
                    targetEvent: $event,
                    templateUrl: 'views/dialog-select-area.html',
                    locals: {
                        items: $scope.resolveActiveAreas()
                    },
                    controller: DialogController
                }).then(function (result) {
                    if (result) {
                        $scope.areaCode = result;
                    }
                });
                function DialogController(scope, $mdDialog, items) {
                    scope.items = items;

                    scope.select = function (item) {
                        $mdDialog.hide(item);
                    };

                    scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                }
            };

            $scope.$watch('data[areaCode]', function (area) {
                if (!area) {
                    $scope.areaCode = 'all';
                }
            })

            $scope.$on('$destroy', function () {
                $scope.stopLoad();
            });

            $scope.stopLoad = $interval($scope.loadData, 5000);
            $scope.loadData();



        });
