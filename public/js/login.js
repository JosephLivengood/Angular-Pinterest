/*global angular*/
var app = angular.module('login', []);

app.controller('LoginCtrl',['$scope', function($scope){
    
    $scope.github = function() {
        /*global $*/
        $('.login').fadeOut(1000, function() {
            $('#github-icon').fadeIn(1000, function() {
                window.location.href = '/auth/github';
            });
        });
    };
    
}]);