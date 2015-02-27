'use strict';

/**
 * @ngdoc function
 * @name blacktiger-app.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Used by Admin
 */
angular.module('blacktiger-controllers')
        .controller('RealtimeCtrl', function ($scope, SystemSvc, MeetingSvc, $interval, $mdDialog) {
            $scope.system = {};
            $scope.data = {};

            $scope.buildData = function () {
                $scope.data.noOfRooms = MeetingSvc.getTotalRooms();
                $scope.data.noOfParticipants = MeetingSvc.getTotalParticipants();
                $scope.data.noOfCommentRequests = MeetingSvc.getTotalParticipantsByCommentRequested(true);
                $scope.data.noOfOpenMicrophones = MeetingSvc.getTotalParticipantsByMuted(false);
                $scope.data.noOfParticipantsPerRoom = $scope.data.noOfRooms === 0 || $scope.data.noOfParticipants === 0 ? 0 : $scope.data.noOfParticipants / $scope.data.noOfRooms;

                var count = MeetingSvc.getTotalParticipantsByType('Sip');
                $scope.data.sipPercentage = count === 0 ? 0.0 : (count / $scope.data.noOfParticipants) * 100;
                $scope.data.phonePercentage = $scope.data.noOfParticipants === 0 ? 0.0 : 100 - $scope.data.sipPercentage;
            };

            $scope.reload = function (event) {
                $mdDialog.show(
                        $mdDialog.alert()
                        .title('Attention')
                        .content('This is not yet implemented')
                        .ok('Close')
                        .targetEvent(event)
                );
            };

            $scope.updateSystemInfo = function () {
                SystemSvc.getSystemInfo().then(function (data) {
                    $scope.system = data;
                });
            };

            $scope.$on('$destroy', function () {
                $timeout.cancel($scope.systemInfoTimerPromise);
            });

            /** WATCHES START **/
            $scope.$watch(MeetingSvc.getTotalRooms, $scope.buildData);
            $scope.$watch(MeetingSvc.getTotalParticipants, $scope.buildData);
            $scope.$watch(function () {
                return MeetingSvc.getTotalParticipantsByCommentRequested(true);
            }, $scope.buildData);
            $scope.$watch(function () {
                return MeetingSvc.getTotalParticipantsByMuted(false);
            }, $scope.buildData)
            /** WATCHES END **/

            $interval($scope.updateSystemInfo, 5000);
            $scope.updateSystemInfo();
        });
