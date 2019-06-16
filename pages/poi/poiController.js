
angular.module("myApp")
.controller("poiController", function ($scope, $http, $uibModal, sharedProperties, $rootScope, $window) {
   $scope.favoriteListSize = sharedProperties.getFavoriteArrSize();
   $scope.$on('change-favoritelist-event', function() {    
      $scope.favoriteListSize = sharedProperties.getFavoriteArrSize();
  });
   $scope.role = sharedProperties.getRole();
   $scope.$on('change-role-event', function() {    
      $scope.role = sharedProperties.getRole();
  });
   var arrPOIAttraction = new Array();
   var arrPOIMuseum = new Array();
   var arrPOIResturant = new Array();
   var arrPOIShopping = new Array();
   var arrSearchPOI = new Array();
   var arrPOIByCategory = new Array();
   var arrSortedPOI = new Array();
   $scope.poi_page = sharedProperties.getPoiPage();
   $scope.heart = 'empty';
   $scope.$on('change-poipage-event', function() {
      $scope.poi_page  = sharedProperties.getPoiPage();
  }); 
   $http({
       method: 'GET',
       url: 'http://localhost:3000/getPOIByCategory/attraction',
    }).then(function (response){
       var POIJsons = response.data
       for (var i=0; i<Object.keys(POIJsons).length; i++) {
         arrPOIAttraction.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false});
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
         arrPOIMuseum.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false});
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
         arrPOIResturant.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false});
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
         arrPOIShopping.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false});
      }
      $scope.shoppingPOI = arrPOIShopping;
   },function (error){
      alert(error);
   });

   $scope.detectEmpty = function() {
      if ($scope.search_input.trim().length === 0) {
         sharedProperties.setPoiPage('poi by categories');
         $rootScope.$broadcast('change-poipage-event');
         arrSearchPOI = new Array();
      }
   }

   $scope.submit = function () {
      $http({
         method: 'GET',
         url: 'http://localhost:3000/getPOIByName/'+ $scope.search_input,
      }).then(function (response){
         var POIJsons = response.data;
         if (Object.keys(POIJsons).length == 0) {
            alert("No POI Named " + $scope.search_input);
            sharedProperties.setPoiPage('poi by categories');
            $rootScope.$broadcast('change-poipage-event');
            arrSearchPOI = new Array();
         }
         else {
            sharedProperties.setPoiPage('search');
            $rootScope.$broadcast('change-poipage-event');
            for (var i=0; i<Object.keys(POIJsons).length; i++) {
               arrSearchPOI.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false});
            }
            $scope.searchPOI = arrSearchPOI;
         }
      },function (error){
         alert(error);
      });
     }

     $scope.filter = function () {
        arrPOIByCategory = new Array();
        if ($scope.category === '' || $scope.category === null || $scope.category === 'nofilter') {
         sharedProperties.setPoiPage('poi by categories');
         $rootScope.$broadcast('change-poipage-event');
        }
        else {
         sharedProperties.setPoiPage('poi by category');
         $rootScope.$broadcast('change-poipage-event');
         $http({
            method: 'GET',
            url: 'http://localhost:3000/getPOIByCategory/'+ $scope.category,
         }).then(function (response){
            var POIJsons = response.data;
            sharedProperties.setPoiPage('poi by category');
            $rootScope.$broadcast('change-poipage-event');
            for (var i=0; i<Object.keys(POIJsons).length; i++) {
               arrPOIByCategory.push({'id': POIJsons[i].poi_id, 'name': POIJsons[i].poi_name, 'pic': POIJsons[i].poi_pic, 'rank': POIJsons[i].poi_rank, 'favorite': false});
            }
            $scope.POI_by_category = arrPOIByCategory;
         },function (error){
            alert(error);
         });
        }
     }

     $scope.sortByRating = function () {
      sharedProperties.setPoiPage('poi sorted by rank');
      $rootScope.$broadcast('change-poipage-event');
      for (var i=0; i<Object.keys(arrPOIAttraction).length; i++) {
         arrSortedPOI.push(arrPOIAttraction[i]);
      }
      for (var i=0; i<Object.keys(arrPOIMuseum).length; i++) {
         arrSortedPOI.push(arrPOIMuseum[i]);
      }
      for (var i=0; i<Object.keys(arrPOIResturant).length; i++) {
         arrSortedPOI.push(arrPOIResturant[i]);
      }
      for (var i=0; i<Object.keys(arrPOIShopping).length; i++) {
         arrSortedPOI.push(arrPOIShopping[i]);
      }
      $scope.sorted_POI = arrSortedPOI;
   }
   $scope.saveFavoritePOI = function () {
      favorite_json = {'poi_list': sharedProperties.getFavoriteArr()};
      var req = {
         method: 'POST',
         url: 'http://localhost:3000/private/saveFavoriteList',
         headers: {
            'x-auth-token': $window.sessionStorage.getItem('token')
         },
         data: favorite_json
        }
      $http(req)
      .then(function (response){
         console.log(response.data)
         if (response.data === 'insert successfully') {
            alert("You have successfully saved your favorite POI");
         }
      },function (error){
         alert(error);
      });
      }
   $scope.detectEmpty = function() {
      if ($scope.search_input.trim().length === 0) {
         sharedProperties.setPoiPage('poi by categories');
         $rootScope.$broadcast('change-poipage-event');
         arrSearchPOI = new Array();
      }
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

    $scope.change = function(POI) {
       var favoriteArray = sharedProperties.getFavoriteArr();
       if (POI.favorite === true && !favoriteArray.includes(POI.id)){
         sharedProperties.addFavorite(POI.id);
       }
       if (POI.favorite === false && favoriteArray.includes(POI.id)) {
         var index = favoriteArray.indexOf(POI.id)
         sharedProperties.removeFavorite(index);
       }
       $rootScope.$broadcast('change-favoritelist-event');
    };

    $scope.addReview = function(param) {
      var modalInstance =  $uibModal.open({
        templateUrl: 'modalReview.html',
        controller: "ModalReviewCtrl",
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
.controller('ModalContentCtrl', function($scope, $http, $uibModalInstance, data, sharedProperties) {
   $scope.role = sharedProperties.getRole();
   $scope.$on('change-role-event', function() {    
      $scope.role = sharedProperties.getRole();
  });
   $http({
      method: 'GET',
      url: 'http://localhost:3000/getPOIDetails/'+ data
   }).then(function (response){
      var POIJsons = response.data[0];
      var reviewsJsons = response.data[1];
      var arrReviews = new Array();
      $scope.POI = POIJsons[0];
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

   $scope.change = function(POI) {
      var favoriteArray = sharedProperties.getFavoriteArr();
      if (POI.favorite === true && !favoriteArray.includes(POI.poi_id)){
        sharedProperties.addFavorite(POI.poi_id);
      }
      if (POI.favorite === false && favoriteArray.includes(POI.poi_id)) {
        var index = favoriteArray.indexOf(POI.poi_id);
        sharedProperties.removeFavorite(index);
      }
      console.log(favoriteArray);
   };
 });

 angular.module("myApp")
.controller('ModalReviewCtrl', function($scope, $http, $uibModalInstance, data, sharedProperties, $window) {
   $scope.ok = function(){
      if (!($scope.rank == 1 || $scope.rank == 2 || $scope.rank == 3 || $scope.rank == 4 || $scope.rank == 5)) {
         alert("You must choose a rank in order to add a review");
         return;
      }
      review_json = {'user_name': sharedProperties.getProperty(), 'poi_id': data, 'rank': $scope.rank, 'description': $scope.revDescription};
      var req = {
         method: 'POST',
         url: 'http://localhost:3000/private/insertPoiReview',
         headers: {
            'x-auth-token': $window.sessionStorage.getItem('token')
         },
         data: review_json
        }
      $http(req)
      .then(function (response){
         console.log(response.data)
         if (response.data === 'insert successfully') {
            alert("You have successfully added a review");
         }
      },function (error){
         alert(error);
      });
     $uibModalInstance.close("Ok");
   }
   $scope.cancel = function(){
      $uibModalInstance.close("Ok");
   }
 });