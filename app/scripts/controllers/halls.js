'use strict';

/**
 * @ngdoc function
 * @name blacktiger.controllers:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the blacktiger-admin interface
 */
angular.module('blacktiger-controllers')
        .controller('HallsCtrl', function ($scope, RoomSvc, $location) {
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

            $scope.editHall = function(hall) {
                $location.path('/halls/' + hall.id);
            };

            $scope.getCsvHeader = function() {
                return ['ID', 'NAME', 'PHONENUMBER', 'POSTALCODE', 'CITY', 'HALLNUMBER', 'CONTACTNAME', 'CONTACTPHONENUMBER', 'CONTACTEMAIL', 'CONTACTCOMMENT'];
            };

            $scope.getCsvData = function() {
                var result = [];
                angular.forEach($scope.halls, function(hall) {
                    result.push({
                        id: hall.id,
                        name:hall.name,
                        phoneNumber:hall.phoneNumber,
                        postalCode:hall.postalCode,
                        city:hall.city,
                        hallNumber:hall.hallNumber,
                        contactName:hall.contact.name,
                        contactPhoneNumber:hall.contact.phoneNumber,
                        contactEmail:hall.contact.email,
                        contactComment:hall.contact.comment
                    });
                });
                return result;
            };

            $scope.$watch(function() {
                return $scope.data.search;
            }, $scope.loadHalls);

            //$scope.loadHalls();
        });
