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
                var roomIds = MeetingSvc.findAllIds();
                $scope.data.noOfRooms = 0;
                $scope.data.noOfParticipants = 0;
                $scope.data.noOfCommentRequests = 0;
                $scope.data.noOfOpenMicrophones = 0;
                var sipCalls = 0;
                
                angular.forEach(MeetingSvc.findAllIds(), function(id) {
                   var room = MeetingSvc.findRoom(id);
                   if(!$scope.areaCode || room.countryCallingCode === $scope.areaCode) {
                       $scope.data.noOfRooms++;
                       angular.forEach(room.participants, function(participant) {
                          if(participant.host === false) {
                              $scope.data.noOfParticipants++;
                              
                              if(!participant.muted) {
                                  $scope.data.noOfOpenMicrophones++;
                              }
                              
                              if(participant.commentRequested) {
                                  $scope.data.noOfCommentRequests++;
                              }
                              
                              if(participant.type === 'Sip') {
                                  sipCalls++;
                              }
                          } 
                       });
                   }
                });
                $scope.data.noOfParticipantsPerRoom = $scope.data.noOfRooms === 0 || $scope.data.noOfParticipants === 0 ? 0 : $scope.data.noOfParticipants / $scope.data.noOfRooms;

                $scope.data.sipPercentage = sipCalls === 0 ? 0.0 : (sipCalls / $scope.data.noOfParticipants) * 100;
                $scope.data.phonePercentage = $scope.data.noOfParticipants === 0 ? 0.0 : 100 - $scope.data.sipPercentage;
            };

            $scope.resolveActiveAreas = function() {
                var areas = ['All'];
                
                angular.forEach(MeetingSvc.findAllIds(), function(id) {
                   var room = MeetingSvc.findRoom(id);
                   if(areas.indexOf(room.countryCallingCode)<0) {
                       areas.push(room.countryCallingCode);
                   }
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
                }).then(function(result) {
                    $scope.areaCode = result !== 'All' ? result : undefined;
                    $scope.buildData();
                });
                function DialogController(scope, $mdDialog, items) {
                    scope.items = items;
                    
                    scope.select = function(item) {
                        $mdDialog.hide(item);
                    };
                    
                    scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                }
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
                $interval.cancel($scope.systemInfoTimerPromise);
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

            $scope.systemInfoTimerPromise = $interval($scope.updateSystemInfo, 5000);
            $scope.updateSystemInfo();
        });
