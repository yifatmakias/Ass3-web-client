// login controller
angular.module("myApp")
.controller("loginController", function ($scope) {
    $scope.submit = function(){
        $scope.answer = "Submitted! you entered: " + $scope.uname
    };
});