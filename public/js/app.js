/*global angular*/
var app = angular.module('pinterest', ['ui.bootstrap']);

app.controller('MainCtrl',['$scope', '$modal', '$log', function($scope, $modal, $log){
    $scope.showForm = function () {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);
        var modalInstance = $modal.open({
            templateUrl: '/newpin',
            controller: ModalInstanceCtrl,
            scope: $scope,
            size: 'lg',
            resolve: {
                userForm: function () {
                    return $scope.userForm;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, userForm, $http) {
    $scope.form = {};
    $scope.master = {};
    $scope.submitForm = function(pin) {
        if ($scope.form.userForm.$valid) {
            $scope.master = angular.copy(pin);
            $http({
                method: 'POST',
                url: '/api/pin/new',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {imagelink: $scope.master.imagelink,
                optlink: $scope.master.optlink,
                title: $scope.master.title,
                tag: $scope.master.tag,
                desc: $scope.master.desc}
            }).success(function () {
                console.log('yup');
            });
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};