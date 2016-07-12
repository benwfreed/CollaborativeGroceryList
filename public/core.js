var groceries = angular.module('groceries', []);

groceries.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
});


groceries.controller('mainController', ['$scope', '$http', '$location', 'socket', function ($scope, $http, $location, socket) {	
	
	$scope.formData = {};
	
	var listId = $location.absUrl().split("/")[3];
	$scope.hasList = listId;
	
	socket.on('update', function (data) {
		$http.get('/api/list/'+listId)
			.then(function(data) {
				$scope.items = data.data.items;
			}, function(data) {
				console.log('Error:' +data);
			});
	});
	
	if(listId) {
		$http.get('/api/list/'+listId)
			.then(function(data) {
				$scope.items = data.data.items;
				//$scope.stuff = data.data;
				console.log(data.data.items);
				console.log($location.absUrl());
				console.log($location.absUrl().split("/")[3]);
			}, 
			function(data) {
				console.log('Error: '+data);
			});
	}

	
	
	$scope.createItem = function() {
		$http.post('/api/list/'+listId, $scope.formData)
			.then(function(data) {
				$scope.formData = {};
				$scope.items = data.data.items;
				console.log(data);
				socket.emit('update', {listhas: 'been changed'});
			},
			function(data) {
				console.log('Error: '+data);
			});
	};
	
	$scope.deleteItem = function(text) {
		$http.delete('/api/item/' + listId +'/' + text)
			.then(function(data) {
				$scope.items = data.data.items;
				console.log(data);
				socket.emit('update', {listhas: 'been changed'});
			},
			function(data) {
				console.log('Error: '+ data);
			});
	};
	
	$scope.getList = function(id) {
		$http.get('/api/list/' + id)
			.then(function(data) {
				$scope.items = data.data.items;
			},
			function(data) {
				console.log('Error: '+ data);
			});
	};
	

	
}]);