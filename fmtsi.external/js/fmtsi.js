/*******************************************
*
*  The core JavaScript file for the project.
*  It should be loaded after jquery script
*  and before jquery mobile script.
*
*******************************************/

// This universal function gives basic navigation based on the radio selection
// The radio group name and target names should be set correctly before calling this.
function choosePage()	{
	var val = $('input[name=radio-choice]:checked').val();
	$.mobile.changePage("#" + val);
}

// This is a complete toast function
// Can provide an "Android" like toast message.
var toast = function(msg){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
	.css({ display: "block", 
		opacity: 0.90, 
		position: "fixed",
		padding: "7px",
		"text-align": "center",
		width: "270px",
		left: ($(window).width() - 284)/2,
		top: $(window).height()/2})
	.appendTo( $.mobile.pageContainer ).delay( 2000 )
	.fadeOut( 400, function(){
		$(this).remove();
	});
}

$(document).bind('mobileinit',function(){
	$.mobile.defaultPageTransition = "slide";
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.page.prototype.options.backBtnText = "Back";
	$.mobile.page.prototype.options.backBtnTheme = "a";
});

$('#login-btn').bind('click', function(e)	{
	e.preventDefault();
	var username = $('#username').val();
	var password = $('#password').val();
	$.ajax({
		type       : 'post',
		url        : 'http://api.xprtly.dev.2amigos.us/public/login',
		data       : ({username : username, password : password}),
		dataType   : 'json',
		beforeSend : function()	{$.mobile.loading('show');},
		complete   : function() {$.mobile.loading('hide');},
		success    : function(data){
			console.error(JSON.stringify(data));
			if(data && data.login === true){
				$.mobile.changePage( "index.html#splash", {
					changeHash: true
				});
			}	else	{
				toast(data.message);
			}
		}
	});
});

$("#btn-camera").bind('click', function()	{
	navigator.camera.getPicture(onCameraSuccess, onCameraFail, { quality: 10, destinationType: Camera.DestinationType.FILE_URI });
});

function onCameraSuccess(imageURI)	{
	$("#snaps").append('<img src="' + imageURI + '" width="50" height"50"/>');
}

function onCameraFail(message)	{
	toast(message);
}