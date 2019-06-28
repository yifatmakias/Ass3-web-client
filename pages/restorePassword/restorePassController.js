// restore password controller
angular.module("myApp")
.controller("restorePassController", function ($scope, $http) {
    $scope.submit = function () {
        var restorePass_json = {user_name: $scope.username,
                        question: $scope.question,
                        answer: $scope.answer }
        console.log(restorePass_json);
      $http.post('http://localhost:3000/restorePassword', restorePass_json)
      .then(function (response){
         console.log(response.data)
         if (response.data === '') {
             alert("One or more of the parameters are not valid. Try again.")
         }
         else {
             alert("Your password was successfully restored.")
             $scope.restored_password = "Your password is: " + response.data;
         }
      },function (error){
         alert(error);
      });
     }
});