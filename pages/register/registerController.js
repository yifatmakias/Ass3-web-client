// register controller
angular.module("myApp")
.controller("registerController", function ($scope) {
    $scope.submit = function(){
        $scope.answer = "Submitted! you entered: " + $scope.uname
    };
});