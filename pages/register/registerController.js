// register controller
angular.module("myApp")
.controller("registerController", function ($scope, $http, $location) {
    var arrCountries = new Array();
    $http({
        method: 'GET',
        url: 'http://localhost:3000/countries'
     }).then(function (response){
        var countriesJsons = response.data.Countries.Country
        for (var i=0; i<Object.keys(countriesJsons).length; i++) {
         arrCountries.push(countriesJsons[i].Name)
        }
        $scope.countriesList = arrCountries;
     },function (error){
        alert(error);
     });

     $scope.submit = function () {
        var user_json = {user_name: $scope.username,
                        password: $scope.password,
                        first_name:  $scope.firstname,
                        last_name: $scope.lastname, 
                        city: $scope.city,
                        country: $scope.country[0],
                        email: $scope.email,
                        question1: $scope.question1,
                        answer1: $scope.answer1, 
                        question2: $scope.question2,
                        answer2: $scope.answer2,
                        category_interest: $scope.categories}
      console.log(user_json);
      $http.post('http://localhost:3000/insert/user', user_json)
      .then(function (response){
         console.log(response.data)
         if (response.data === 'insert successfully') {
            alert("You have successfully registered!");
            $location.path('pages/login/login.html');
         }
      },function (error){
         alert(error);
      });
     }
});