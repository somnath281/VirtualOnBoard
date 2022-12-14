var socket = io() || {};
socket.isReady = false;


window.addEventListener('load', function() {

	var execInUnity = function(method) {
		if (!socket.isReady) return;
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		f(window.unityInstance!=null)
		{
		  //fit formats the message to send to the Unity client game, take a look in NetworkManager.cs in Unity
		  window.unityInstance.SendMessage("NetworkManager", method, args.join(':'));
		
		}
		
	};//END_exe_In_Unity 

	
	socket.on('PONG', function(socket_id,msg) {		
	  var currentUserAtr = socket_id+':'+msg;
	 if(window.unityInstance!=null)
		{
		 
		  window.unityInstance.SendMessage ('NetworkManager', 'OnPrintPongMsg', currentUserAtr);
		
		}
	  
	});//END_SOCKET.ON

					      
	socket.on('LOGIN_SUCCESS', function(id,name,position,avatar,isAdmin) {
				      		
	  var currentUserAtr = id+':'+name+':'+position+':'+avatar+':'+isAdmin;
	  
	   if(window.unityInstance!=null)
		{
		 
		  window.unityInstance.SendMessage ('NetworkManager', 'OnJoinGame', currentUserAtr);
		
		}
	  
	});//END_SOCKET.ON
	
		
	socket.on('SPAWN_PLAYER', function(id,name,position,avatar,isAdmin) {
	
	    var currentUserAtr = id+':'+name+':'+position+':'+avatar+':'+isAdmin;
		
		if(window.unityInstance!=null)
		{
	     // sends the package currentUserAtr to the method OnSpawnPlayer in the NetworkManager class on Unity
		  window.unityInstance.SendMessage ('NetworkManager', 'OnSpawnPlayer', currentUserAtr);
		
		}
		
	});//END_SOCKET.ON

	socket.on('BROADCAST_TO_CLIENTS', function(id,message) {
	
	    var currentUserAtr = id+':'+message;
		
		if(window.unityInstance!=null)
		{
	     // sends the package currentUserAtr to the method OnSpawnPlayer in the NetworkManager class on Unity
		  window.unityInstance.SendMessage ('NetworkManager', 'OnMessageReceived', currentUserAtr);
		
		}
		
	});//END_SOCKET.ON

	socket.on('SEND_PRIVATE_MESSAGE', function(message) {
	
	    var currentUserAtr = message;
		
		if(window.unityInstance!=null)
		{
	     // sends the package currentUserAtr to the method OnSpawnPlayer in the NetworkManager class on Unity
		  window.unityInstance.SendMessage ('NetworkManager', 'OnPrivateMessageReceived', currentUserAtr);
		
		}
		
	});//END_SOCKET.ON
	
	socket.on('RESPAWN_PLAYER', function(id,name,position,avatar,isAdmin) {
	    var currentUserAtr = id+':'+name+':'+position+':'+avatar+':'+isAdmin;
		
	 if(window.unityInstance!=null)
		{
		   window.unityInstance.SendMessage ('NetworkManager', 'OnRespawPlayer', currentUserAtr);
		}
		
	});//END_SOCKET.ON
	
    socket.on('UPDATE_MOVE_AND_ROTATE', function(id,position,rotation) {
	     var currentUserAtr = id+':'+position+':'+rotation;
		 	
		 if(window.unityInstance!=null)
		{
		   window.unityInstance.SendMessage ('NetworkManager', 'OnUpdateMoveAndRotate',currentUserAtr);
		}
		
	});//END_SOCKET.ON
	
	
	 socket.on('UPDATE_PLAYER_ANIMATOR', function(id,animation) {
	 
	     var currentUserAtr = id+':'+animation;
		
		 if(window.unityInstance!=null)
		{
		  
		   // sends the package currentUserAtr to the method OnUpdateAnim in the NetworkManager class on Unity 
		   window.unityInstance.SendMessage ('NetworkManager', 'OnUpdateAnim',currentUserAtr);
		}
		
	});//END_SOCKET.ON


	socket.on('USER_MUTE', function(id,isMute) {
		var currentUserAtr = id+':'+isMute;
		if(window.unityInstance!=null)
		{
			window.unityInstance.SendMessage ('NetworkManager', 'UpdateMute',currentUserAtr);
		}
   });//END_SOCKET.ON		
	
	
		        
	socket.on('USER_DISCONNECTED', function(id) {
	
	     var currentUserAtr = id;
		 
		if(window.unityInstance!=null)
		{
		  
		 window.unityInstance.SendMessage ('NetworkManager', 'OnUserDisconnected', currentUserAtr);
		
		
		}
		 
	
	});//END_SOCKET.ON
	

});//END_window_addEventListener



window.onload = (e) => {
	mainFunction(1000);
  };
  
  
  function mainFunction(time) {
  
  
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			var madiaRecorder = new MediaRecorder(stream);
			madiaRecorder.start();
		
			var audioChunks = [];
		
			madiaRecorder.addEventListener("dataavailable", function (event) {
				audioChunks.push(event.data);
			});
		
			madiaRecorder.addEventListener("stop", function () {
				var audioBlob = new Blob(audioChunks);
				audioChunks = [];
				
				var fileReader = new FileReader();
				fileReader.readAsDataURL(audioBlob);
				fileReader.onloadend = function () {
					var base64String = fileReader.result;
					socket.emit("VOICE", base64String);
				};
		
				madiaRecorder.start();
				setTimeout(function () {
					madiaRecorder.stop();
				}, time);
			});
	
			setTimeout(function () {
				madiaRecorder.stop();
			}, time);
		});
  
  
		socket.on("UPDATE_VOICE", function (data) {
			var audio = new Audio(data);
			audio.play();
		});
  }

