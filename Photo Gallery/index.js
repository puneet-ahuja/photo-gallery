(function(){

	//variable declaration
	var header;
	var albums;
	var albumTemplate;
	var content;
	var editPage;

	//variable definantion
	header = document.getElementById("header");
	albums=[];
	albumTemplate = document.getElementById("albumTemplate");
	// content = document.getElementById('content');

	//function defination

	function FunA(){
		FunA.data = arguments[0];
		persistAlbumData();
	}

	function FunP(){
    	FunP.data = arguments[0];
    	persistAlbumData();
	}


	/*Function to store data to localStorage*/
	function persistAlbumData(){
		if(FunA.data && FunP.data){
			console.log(FunA.data);
			console.log(FunP.data);

			//main logic here
			var albumData = FunA.data;
			var photoData = FunP.data;

			albumData.map(function(album){
				var rv = photoData.filter(function(photo){
					return album.id === photo.albumId;
				});
				album.photos = rv;
			});
			
			//To store data to local storage
			localStorage.setItem("Albums" , JSON.stringify(albumData));

			//TO store values in array of objects for prog
			albums = albumData;
			

			FunA.data = undefined;
			FunP.data = undefined;
		}
	}

	/*Function to display all the albums from localStorage to screen*/
	function displayAlbums(){
		for (var i = 0 ; i < albums.length ; i++ ){
			var templateData = albumTemplate.innerHTML;
			album = albums[i];
			templateData = templateData.replace('{{src}}' , album.photos[0].url);
			templateData = templateData.replace('{{id}}' , album.id);

			$('#content').append(templateData);
		}

		

	}

	/*Function to add a album
	Triggered from add button in header of main page*/
	function addAlbumHandler(){
		alert('You clicked on Add Album Button');
		//TO DO
		$('#overlay').css( {
			'height' : '100%',
			'width' : '100%'
		} );
		$('#popup').css( {
			'height' : '50%',
			'width' : '50%'
		} );
		$('#popup').html($('#addAlbumTemplate').html());
	}

	function setHomePage(){

		albums = JSON.parse(localStorage.getItem("Albums"));
		$('#header').html($('#albumsHeader').html());
		$('#content').html('');
		for(var i = 0 ; i < albums.length ; i++){
			var albumTemplate = $('#albumTemplate').html();
			if(albums[i].photos.length > 0){
				albumTemplate = albumTemplate.replace( '{{url}}', albums[i].photos[0].url);
			}else{
				albumTemplate = albumTemplate.replace( '{{url}}', 'http://www.fsxaddons.com/static/img/no-preview.jpg');
			}
			albumTemplate = albumTemplate.replace( '{{id}}', albums[i].id );
			albumTemplate = albumTemplate.replace( '{{title}}', albums[i].title );
			albumTemplate = albumTemplate.replace( '{{noOfImages}}', albums[i].photos.length);
			albumTemplate = albumTemplate.replace( '{{hash}}' , '#editAlbum/' + albums[i].id );
			albumTemplate = albumTemplate.replace( '{{delete}}' , '#deleteAlbum/' + albums[i].id );

			$('#content').append(albumTemplate);

		}

		//code to add html for content area
		$('#footer').css('visibility','hidden').html('');
	}

	function hashChangeHandler(){
		var hash = location.hash;


		if(hash === '#albums'){
			//Case to load home page 
			setHomePage();
		}else if(hash === '#createAlbum'){
			//Case to handle creation of new album
			addAlbumHandler();
		}else if(hash.indexOf("deleteAlbum") >=0){
			deleteAlbumHandle();
		}else if(hash.indexOf("editAlbum") >=0){
			if(editPage === undefined){
			 editPage = new EditPage();
			}
			editPage.init();
		}
		
	}

	/*Function to handle delete of album*/
	/*Album can only be deleted only if it has 0 photos*/
	function deleteAlbumHandle(){
		alert('Delete Key Pressed');
		var hash = location.hash;
		var albumId = parseInt( hash.substring( hash.indexOf('/') + 1 ) );

		//to check no of photos
		for(var i = 0 ; i < albums.length ; i++){
			if( albumId === albums[i].id){
				if(albums[i].photos.length === 0 ){
					//To remove from array
					albums.splice(i,1);

					//To remove from localStorage
					localStorage.setItem("Albums" ,JSON.stringify(albums));
				}else{
					alert('Photos Available . Unable to delete album ');
				}
				location.hash = '#albums'

			}
		}
		//ToDo
	}

	/*Function to handle click of edit */
	function editAlbumHandle(){
		alert('Edit Key Pressed');
		//ToDo
	}

	function cancelButtonHandle(){
		$('#popup').css( {
			'height' : '0%',
			'width' : '0%'
		} ).html('');
		$('#overlay').css( {
			'height' : '0%',
			'width' : '0%'
		} );
		window.location.hash = '#albums';
	}


	
	/*Function to handle click on save button to add album*/
	function saveButtonHandle(){
		var newTitle = $('#albumTitleInput').val();
		if (newTitle === ''){
			alert('Unable to add album. Name Title is  blank ');
				cancelButtonHandle();
				return;
		}

		for(var i = 0 ; i < albums.length ; i++){
			if(newTitle === albums[i].title){
				alert('Unable to add album. Name Title already Exixt ');
				cancelButtonHandle();
				return;
			}
		}

		var album = {};
		album.userId = -1;
		if ( i === 0){
			album.id = 1;
		}
		else{
			album.id = albums[i-1].id + 1;
		}
		album.title = newTitle;
		album.photos = [];

		//Update data to ablums
		albums.push(album);

		//Update data to localStorage
		localStorage.setItem("Albums" , JSON.stringify(albums));

		//to redirect to albus page and remove popup
		cancelButtonHandle();



	}

	function init(){


	
		window.addEventListener( 'hashchange' , hashChangeHandler );
		

		//$('#header').on('click' , '#buttonAdd' , addAlbumHandler);
		//$('#content').on('click' , '#edit' , editAlbumHandle);
		//$('#content').on('click' , '#delete' , deleteAlbumHandle );
		$('#popup').on('click' , '#cancelButton' , cancelButtonHandle );
		$("#popup").on('click' , '#saveAlbumButton' , saveButtonHandle );

		if(localStorage.getItem("Albums") === null){
			//Async Ajax call to albums
			$.ajax({
				url:	'https://jsonplaceholder.typicode.com/albums' ,
				success: FunA
			});


			//Async Ajax call to photos of albums
			$.ajax({
				url:	'https://jsonplaceholder.typicode.com/photos' ,
				success: FunP
			});
		}

		

		setHomePage();

		var hash = location.hash;
		location.hash = '';
		location.hash = hash;

		//Function to display albums data to 
		//displayAlbums();



	}

	init();
})();