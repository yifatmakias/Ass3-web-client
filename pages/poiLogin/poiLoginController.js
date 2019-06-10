// login controller

angular.module("myApp")
.controller("poiLoginController", function ($scope, $http, $window) {
   var arrPOINames = new Array();
   var arrPOICategory = new Array();
   var arrPOISrcImg = new Array();
   var arrPOINames2 = new Array();
   var arrPOISrcImg2 = new Array();
   $http({
       method: 'GET',
       url: 'http://localhost:3000/private/getRecomendedPOI',
       headers: {
          'x-auth-token': $window.localStorage.getItem('token')
       }
    }).then(function (response){
       var POIJsonsList = response.data
       for (var i=0; i<Object.keys(POIJsonsList).length; i++) {
           arrPOINames.push(POIJsonsList[i].poi_name);
           arrPOICategory.push(POIJsonsList[i].poi_category);
           arrPOISrcImg.push(POIJsonsList[i].poi_pic);
       }
       $scope.recomendedPOINames = arrPOINames;
       $scope.recomendedPOICategory = arrPOICategory;
       $scope.recomendedPOImges = arrPOISrcImg;
    },function (error){
       alert(error);
    });

    $http({
      method: 'GET',
      url: 'http://localhost:3000/private/getSavedPOI',
      headers: {
         'x-auth-token': $window.localStorage.getItem('token')
      }
   }).then(function (response){
      var POIJsonsList = response.data
      for (var i=0; i<Object.keys(POIJsonsList).length; i++) {
          arrPOINames2.push(POIJsonsList[i].poi_name);
          arrPOISrcImg2.push(POIJsonsList[i].poi_pic);
      }
      $scope.favoritePOINames = arrPOINames2;
      $scope.favoritePOImges = arrPOISrcImg2;
   },function (error){
      alert(error);
   });
});