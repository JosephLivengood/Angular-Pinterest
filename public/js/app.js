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

var ModalInstanceCtrl = function ($scope, $modalInstance, userForm) {
    $scope.form = {};
    $scope.submitForm = function () {
        if ($scope.form.userForm.$valid) {
            console.log('user form is in scope');
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};