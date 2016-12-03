/*global angular*/
var app = angular.module('login', []);

app.controller('LoginCtrl',['$scope', function($scope){
    
    
    //TODO: Move [admittedly fake] visuals to vanilla JS, keep controllers for business logic only.
    $scope.github = function() {
        /*global $*/
        $('.login').fadeOut(700, function() {
            $('#github-icon').fadeIn(700, function() {
                window.location.href = '/auth/github';
            });
        });
    };
    
}]);