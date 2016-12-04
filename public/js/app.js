/*global angular*/
var app = angular.module('pinterest', ['ui.bootstrap', 'angularGrid']);

app.service('imageService',['$q','$http',function($q,$http){
    this.loadImages = function(i){
        return $http.get("/api/mostrecent/"+i);
    };
    this.loadUserBoard = function(){
        return $http.get("/api/userboard");
    };
    this.loadCateBoard = function(cate, i){
        return $http.get("/api/cate/"+cate+'/'+i);
    };
}]);
    
app.service('pinService',['$q','$http',function($q,$http){
    this.repin = function(id) {
        return $http.post("/api/pin/"+id);
    };
}]);

app.controller('MainCtrl',['$scope', '$modal', '$log','imageService','pinService','angularGridInstance',
    function($scope, $modal, $log,imageService,pinService,angularGridInstance){
        /*START-init on most recent pins*/
        var page = 1;
        var cate = '';
        $scope.currentboard = 'Most Recent';
            imageService.loadImages(page).then(function(data){
                data.data.forEach(function(obj){
                    var matches = obj.optlink.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                    var domain = matches && matches[1]; 
                    obj.optlinkcut  = domain;
                });
                $scope.pics = data.data;
                page++;
            });
        /*END-init on most recent pins*/    
        
        $scope.loadMore = function() {
            if ($scope.currentboard == 'Personal Board') return;
            if ($scope.currentboard == 'Most Recent') {
                imageService.loadImages(page).then(function(nextPageImages){
                    nextPageImages.data.forEach(function(obj){
                        var matches = obj.optlink.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                        var domain = matches && matches[1]; 
                        obj.optlinkcut  = domain;
                    });
                    $scope.pics = $scope.pics.concat(nextPageImages.data);
                    page++;
                });
            } else {
                imageService.loadCateBoard(cate, page).then(function(nextPageImages){
                    nextPageImages.data.forEach(function(obj){
                        var matches = obj.optlink.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                        var domain = matches && matches[1]; 
                        obj.optlinkcut  = domain;
                    });
                    $scope.pics = $scope.pics.concat(nextPageImages.data);
                    page++;
                });
            }
        };
        
        $scope.loadRecent = function () {
            $scope.pics = {};
            $scope.currentboard = 'Most Recent';
            page = 1;
            imageService.loadImages(page).then(function(data){
                data.data.forEach(function(obj){
                    var matches = obj.optlink.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                    var domain = matches && matches[1]; 
                    obj.optlinkcut  = domain;
                });
                $scope.pics = data.data;
                page++;
            });
        };
        
        $scope.loadPersonal = function () {
            imageService.loadUserBoard().then(function(data){
                $scope.currentboard = 'Personal Board';
                $scope.pics = data.data;
                angularGridInstance.gallery.refresh();
            });            
        };
        
        $scope.loadCate = function(cate) {
            $scope.pics = {};
            $scope.currentboard = cate;
            page = 1;
            imageService.loadCateBoard(cate, 1).then(function(data){
                $scope.pics = data.data;
                angularGridInstance.gallery.refresh();
            });            
        };
        
        $scope.repin = function(id) {
            pinService.repin(id);    
        };
        
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