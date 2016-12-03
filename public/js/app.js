/*global angular*/
var app = angular.module('pinterest', ['ui.bootstrap', 'angularGrid']);

app.service('imageService',['$q','$http',function($q,$http){
        this.loadImages = function(i){
            console.log("/api/mostrecent/"+i);
            return $http.get("/api/mostrecent/"+i);
        };
    }]);

app.controller('MainCtrl',['$scope', '$modal', '$log','imageService','angularGridInstance',
    function($scope, $modal, $log,imageService,angularGridInstance){
        
        /*Page of API call for infinite scroll*/
        var page = 1;
        imageService.loadImages(page).then(function(data){
            $scope.pics = data.data;
            page++;
        });
        $scope.loadMore = function(){
            imageService.loadImages(page).then(function(nextPageImages){
                $scope.pics = $scope.pics.concat(nextPageImages.data);
                page++;
            });
        };
        /*
        $scope.loadRecent = function () {
            imageService.loadImages().then(function(data){
                data.data.forEach(function(obj){
                    obj.actualHeight  = 'auto';
                    obj.actualWidth = 'auto';
                });
                $scope.pics = data.data;
            });
            $scope.refresh = function(){
                angularGridInstance.gallery.refresh();
            };
        };
        $scope.loadRecent();
        */
        
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

var ModalInstanceCtrl = function (angularGridInstance, imageService, $scope, $modalInstance, userForm, $http) {
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
                //$scope.loadRecent();
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