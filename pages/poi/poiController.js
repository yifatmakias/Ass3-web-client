// login controller
angular.module("myApp")
.controller("poiController", function ($scope, $http, $uibModal, sharedProperties, $rootScope) {
   var arrPOIAttraction = new Array();
   var arrPOIMuseum = new Array();
   var arrPOIResturant = new Array();
   var arrPOIShopping = new Array();
   var arrSearchPOI = new Array();
   $scope.poi_page = sharedProperties.getPoiPage();
   $scope.$on('change-poipage-event', function() {
      $scope.poi_page  = sharedProperties.getPoiPage();
  }); 
   $http({
       method: 'GET',
       url: 'http://localhost:3000/getPOIByCategory/attraction',
    }).then(function (response){
       var POIJsons = response.data
       for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrPOIAttraction.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
       }
       $scope.attractionPOI = arrPOIAttraction;
    },function (error){
       alert(error);
    });

    $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIByCategory/museum',
   }).then(function (response){
      var POIJsons = response.data
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrPOIMuseum.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
      }
      $scope.museumPOI = arrPOIMuseum;
   },function (error){
      alert(error);
   });

   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIByCategory/resturant',
   }).then(function (response){
      var POIJsons = response.data
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrPOIResturant.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
      }
      $scope.resturantPOI = arrPOIResturant;
   },function (error){
      alert(error);
   });

   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIByCategory/shopping',
   }).then(function (response){
      var POIJsons = response.data
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrPOIShopping.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
      }
      $scope.shoppingPOI = arrPOIShopping;
   },function (error){
      alert(error);
   });

   $scope.detectEmpty = function() {
      if ($scope.search_input.trim().length === 0) {
         sharedProperties.setPoiPage('poi by category');
         $rootScope.$broadcast('change-poipage-event');
         arrSearchPOI = new Array();
      }
   }

   $scope.submit = function (event) {
      $http({
         method: 'GET',
         url: 'http://localhost:3000/getPOIByName/'+ $scope.search_input,
      }).then(function (response){
         var POIJsons = response.data;
         if (Object.keys(POIJsons).length == 0) {
            alert("No POI Named " + $scope.search_input);
            sharedProperties.setPoiPage('poi by category');
            $rootScope.$broadcast('change-poipage-event');
            arrSearchPOI = new Array();
         }
         else {
            sharedProperties.setPoiPage('search');
            $rootScope.$broadcast('change-poipage-event');
            for (var i=0; i<Object.keys(POIJsons).length; i++) {
               arrSearchPOI.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic});
            }
            $scope.searchPOI = arrSearchPOI;
         }
         event.preventDefault();
      },function (error){
         alert(error);
      });
     }

   $scope.open = function(param) {
      var modalInstance =  $uibModal.open({
        templateUrl: 'modalContent.html',
        controller: "ModalContentCtrl",
        size: '',
        backdrop: 'static',
        resolve: {
           data: function () {
              return param;
           }
        }
      });
    };
});

angular.module("myApp")
.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, data) {
   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIDetails/'+ data
   }).then(function (response){
      var POIJsons = response.data[0];
      var reviewsJsons = response.data[1];
      var arrReviews = new Array();
      for (var i=0; i<Object.keys(POIJsons).length; i++) {
         $scope.name = POIJsons[i].poi_name;
         $scope.category = POIJsons[i].poi_category;
         $scope.desc = POIJsons[i].poi_desc;
         $scope.rank = POIJsons[i].poi_rank/5 * 100;
         $scope.num_of_viewers = POIJsons[i].num_of_viewers;
      }
      for (var i=0; i<Object.keys(reviewsJsons).length; i++) {
         arrReviews.push({
            'name': reviewsJsons[i].user_name, 
            'date': reviewsJsons[i].review_date,
            'rank': reviewsJsons[i].review_rank,
            'desc': reviewsJsons[i].review_description
         })
      }
      $scope.reviews = arrReviews;

   },function (error){
      alert(error);
   });
   $scope.ok = function(){
     $uibModalInstance.close("Ok");
   }
 });