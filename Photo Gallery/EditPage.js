function EditPage(){
	//variables declaration
	var albums = [];


	//variables defination


	//Function defination
	function setEditPage(){

		var hash = location.hash;
		var albumId = parseInt( hash.substring( hash.indexOf('/') + 1 ) );
		
		var albumTitle;
		var footerHTML;

		for(var i = 0 ; i < albums.length ; i++){
			if(albumId === albums[i].id){
				albumTitle = albums[i].title;
				break;
			}

		}
		var headerHTML = $('#albumHeader').html();
		headerHTML = headerHTML.replace( '{{AlbumTitle}}' , albumTitle );

		$('#header').html(headerHTML);


		//Code to set content
		$("#content").html('');

		var photos = albums[i].photos;


		for( var i = 0 ; i < photos.length ; i++ ){
			var photoHTML = $('#photoTemplate').html();

			photoHTML = photoHTML.replace( '{{url}}' , photos[i].url);
			photoHTML = photoHTML.replace( '{{albumId}}' , photos[i].albumId);
			photoHTML = photoHTML.replace( '{{id}}' , photos[i].id);
			photoHTML = photoHTML.replace( '{{edit}}' , '#editPhoto/'+albumId +'/' +photos[i].id);
			photoHTML = photoHTML.replace( '{{delete}}' , '#deletePhoto/'+albumId +'/' +photos[i].id);
			photoHTML = photoHTML.replace( '{{title}}' , photos[i].title);

			$('#content').append(photoHTML);
		}
		var $fabAdd = $('<a />').attr("href", '#addPhoto/'+albumId).attr('id' , 'fabAdd').html('+');
		$('#content').append($fabAdd);


		footerHTML = $('#footerTemplate').html();
		footerHTML = footerHTML.replace( '{{saveChanges}}' , '#saveAlbum/'+albumId);
		footerHTML = footerHTML.replace( '{{cancelChanges}}' , '#cancelAlbum/'+albumId);
		$('#footer').css({
			'position':'fixed',
			'height' : '60px',
			'width' : '100%',
			'bottom' : '0px',
			'left' : '0px',
			'visibility' : 'visible'
		}).html(footerHTML);


	}

	/*Function to handle delete of a image in edit page*/
	function deletePhoto(albumId , photoId){
		
		var i,j;
		var choice;


		
		for( i = 0 ; i < albums.length ; i++ ){
			if(albumId === albums[i].id){
				for( j = 0 ; j < albums[i].photos.length ; j++){
					if(photoId === albums[i].photos[j].id){
						//confirming before delete
						choice = confirm('Are u sure that u want to delete ' + albums[i].photos[j].title);
						if(choice){
							//to remove photo from memory array albums
							albums[i].photos.splice(j,1);

							//to persist
							//localStorage.setItem("Albums" , JSON.stringify(albums));

							//to change the view
							location.hash = '#editAlbum/'+albumId;
						}else{
							location.hash = '#editAlbum/'+albumId +'/'+photoId;
						}
						break;
					}
				}
			}
		}

	}

	/*Function to show popup with a form to enter new values of 
	image selected */
	function editPhoto(albumId , photoId){
		var i,j;
		var $popupHTML;


		
		for( i = 0 ; i < albums.length ; i++ ){
			if(albumId === albums[i].id){
				for( j = 0 ; j < albums[i].photos.length ; j++){
					if(photoId === albums[i].photos[j].id){
						$('#overlay').css( {
							'height' : '100%',
							'width' : '100%'
						} );
						$('#popup').css( {
							'height' : '50%',
							'width' : '50%'
						} );

						$popupHTML = $('#editPhotoTemplate').html();
						$popupHTML = $popupHTML.replace( "{{photoTitle}}" , albums[i].photos[j].title );
						$popupHTML = $popupHTML.replace( "{{photoURL}}" , albums[i].photos[j].url );
						$popupHTML = $popupHTML.replace( "{{update}}" , '#updatePhoto/'+albumId +'/' +albums[i].photos[j].id );
						$popupHTML = $popupHTML.replace( "{{cancel}}" , '#cancelPhoto/'+albumId +'/' +albums[i].photos[j].id);

						$('#popup').html($popupHTML);
						break;
					}
				}
			}

		}
	}

	/*Function to handle click on cancel from popup
	when edit album is clicked.*/
	function cancelHandle( albumId , photoId ){
		$('#popup').css( {
			'height' : '0%',
			'width' : '0%'
		} ).html('');
		$('#overlay').css( {
			'height' : '0%',
			'width' : '0%'
		} );
		window.location.hash = '#editAlbum/'+albumId +'/'+photoId;
		
	}

	/*Function to update photo after getting new values from popup*/
	function updatePhoto(albumId , photoId){
		var i,j;
		var $newTitle;
		var $newURL;

		//variable defination
		$newTitle = $('#photoTitleInput').val();
		$newURL = $('#photoURLInput').val();

		if( $newTitle === ''){
			cancelHandle(albumId , 0);
			alert("Title blank . Unable to add");
			return;
		}
		if( $newURL === ''){
			cancelHandle(albumId , 0);
			alert("URL blank . Unable to add");
			return;
		}

		
		for( i = 0 ; i < albums.length ; i++ ){
			if(albumId === albums[i].id){
				for( j = 0 ; j < albums[i].photos.length ; j++){
					if(photoId === albums[i].photos[j].id){


						
						//Update to memory array
						albums[i].photos[j].url = $newURL;
						albums[i].photos[j].title = $newTitle;

						//update to localstorage
						//localStorage.setItem("Albums" , JSON.stringify(albums));

						//update to ui
						cancelHandle(albumId , photoId);


						
						break;
					}
				}
			}

		}
	}


	/*Function to add a photo to album*/
	/*Display popup to get ttile and url*/
	function addPhoto(albumId){
		var i,j;
		var $popupHTML;


		
		for( i = 0 ; i < albums.length ; i++ ){
			if(albumId === albums[i].id){
				$('#overlay').css( {
					'height' : '100%',
					'width' : '100%'
				} );
				$('#popup').css( {
					'height' : '50%',
					'width' : '50%'
				} );

				$popupHTML = $('#editPhotoTemplate').html();
				$popupHTML = $popupHTML.replace( "{{photoTitle}}" , 'Enter Title' );
				$popupHTML = $popupHTML.replace( "{{photoURL}}" , 'Enter URL' );
				$popupHTML = $popupHTML.replace( "{{update}}" , '#saveNewPhoto/'+albumId );
				$popupHTML = $popupHTML.replace( "{{cancel}}" , '#cancelPhoto/'+albumId );

				$('#popup').html($popupHTML);
				break;
					
				
			}

		}	
	}

	/*Function to get values from popup
	match with other values
	add photo
	removes popup*/
	function saveNewPhoto(albumId){

		var i,j;
		var $newTitle;
		var $newURL;
		var photo = {};

		//variable defination

		//Getting values from popup textbox
		$newTitle = $('#photoTitleInput').val();
		$newURL = $('#photoURLInput').val();

		if( $newTitle === ''){
//			cancelHandle(albumId , 0);
			alert("Title blank . Unable to add");
			return;
		}
		if( $newURL === ''){
			//cancelHandle(albumId , 0);
			alert("URL blank . Unable to add");
			return;
		}

		for(var i = 0 ; i < albums.length ; i++){
			if(albumId == albums[i].id){
				for(j=0 ; j < albums[i].photos.length ; j++ ){
					if(albums[i].photos[j].title === $newTitle){
						//cancelHandle(albumId , 0);
						alert("Title already exixt . Unable to add");
						return;

					}
				}
				if( albums[i].photos.length === 0){
					photo.id = 1;
				}else{
					photo.id = albums[i].photos[ albums[i].photos.length - 1 ].id +1;
				}
				break;


			}
		}
		photo.url = $newURL;
		photo.albumId = albumId;
		photo.title = $newTitle;
		photo.thumbnailUrl = '';

		//update to memory array
		albums[i].photos.push(photo);

		//update to localStorage
		//localStorage.setItem("Albums" , JSON.stringify(albums));

		//update to ui
		cancelHandle(albumId , 0);

	}

	/*Function to save changes to albumdata*/
	function saveAlbum(albumId){
		//to persist
		localStorage.setItem("Albums" , JSON.stringify(albums));

		//to change the view
		location.hash = '#editAlbum/'+albumId;
	}

	/*Function to save changes to albumdata*/
	function cancelAlbum(albumId){
		//to get Data from Local Storage
		albums = JSON.parse(localStorage.getItem("Albums"));

		//to change the view
		location.hash = '#albums';
	}

	/*Function to handle hashchange in edit page*/
	function editHashChangeHandler(){
		var hash = location.hash;
		var albumId;
		var photoId;
		var indexOfFirstSlash;

		if(hash.indexOf("deletePhoto")>=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );
			photoId = parseInt( hash.substring( hash.indexOf('/' , indexOfFirstSlash +1 ) + 1 ) );

			deletePhoto(albumId , photoId);
		}else if(hash.indexOf("editPhoto")>=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );
			photoId = parseInt( hash.substring( hash.indexOf('/' , indexOfFirstSlash +1 ) + 1 ) );

			editPhoto(albumId , photoId);
		}else if(hash.indexOf("cancelPhoto")>=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );
			photoId = parseInt( hash.substring( hash.indexOf('/' , indexOfFirstSlash +1 ) + 1 ) );
			cancelHandle( albumId , photoId );
		}else if(hash.indexOf("updatePhoto") >=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );
			photoId = parseInt( hash.substring( hash.indexOf('/' , indexOfFirstSlash +1 ) + 1 ) );
			updatePhoto( albumId , photoId );
		}else if(hash.indexOf("addPhoto") >=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );

			addPhoto(albumId);
		}else if(hash.indexOf("saveNewPhoto") >=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );

			saveNewPhoto(albumId);
		}else if(hash.indexOf("saveAlbum") >=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );

			saveAlbum(albumId);

		}else if(hash.indexOf("cancelAlbum") >=0){
			indexOfFirstSlash = hash.indexOf('/');

			albumId = parseInt( hash.substring( indexOfFirstSlash + 1 ) );

			cancelAlbum(albumId);

		}
	}


	// init defination
	function init(){

		window.addEventListener('hashchange' , editHashChangeHandler);
		if(albums.length === 0){
			albums = JSON.parse(localStorage.getItem('Albums'));
		}
		setEditPage();


	}


	//making public

	this.init = init;
}