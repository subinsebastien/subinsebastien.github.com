var tumblr_api_read = null;
$(document).ready(function() {	
	$.tumblr = {};
	$.tumblr.url = "http://subinsebastien.tumblr.com/api/read/json?callback=?";
	$.tumblr.numPostsToDisplay = 3;
	$.tumblr.postMaxDescriptionLength = -1;
	$.tumblr.videoWidth='200';
	$.tumblr.videoHeight='163';
	$.tumblr.imagePath = 'http://chris-tran.com/images/tumblr/';	
	$.tumblr.postCount = 0;
	reloadTumblr();
});		
  
function reloadTumblr(){  	
	$("#tumblrFeed").empty();
	$("#tumblrFeed").append("<div class='body'>Loading latest blog posts   <img class='icon' src='" + $.tumblr.imagePath + "small_red.gif'/></div>");
  	$.ajax({
		url: $.tumblr.url, dataType: 'script', timeout: 10000,
			success:function()	{
				$("#tumblrFeed").empty();
				if ((tumblr_api_read == undefined) || (tumblr_api_read == null))	{
					$("#tumblrFeed").append("<div class='title' href='#'>unable to load Tumblr</div>");
					$("#tumblrFeed").append("<div class='body'><a href=\"#\" onclick=\"javascript:reloadTumblr();\">[retry]</a></div>");    			
				} else {
					//$("#tumblrFeed").append("<div class='body'><a href=\"#\" style=\"float:right\" onclick=\"javascript:reloadTumblr();\">[refresh]</a></div>");
					$.tumblr.postCount = 0;
					$.each(tumblr_api_read.posts.slice(0, 10),
						function(i,post)	{
							if ($.tumblr.postCount >= $.tumblr.numPostsToDisplay)	{
								return;
							}    			
							parseTumblrJSON(post);
							$.tumblr.postCount++;
						}
					);
					if (postMaxDescriptionLength > -1)	{
						$('div.expandable').expander({slicePoint:postMaxDescriptionLength, expandText:'[more]', userCollapseText: '[^]'});					    			
					}
				}
			},
			error:function (xhr, statusTxt, errorTxt)	{
				$("#tumblrFeed").append("<a class='title' href='#'>Tumblr Parse Error</a>");
				$("#tumblrFeed").append("<div class='body'>" + errorTxt + "<br/>" + xhr.responseText + "</div>");
			} 					      
		}
	);  	
}
	
function formatDate(d)	{
	return d.toString('dd-MMM-yyyy / hh:mm tt')
}

function processResponse() {}

function parseTumblrJSON(post) {
	var d = Date.parse(post["date-gmt"]);
	var dateFmt = formatDate(d);
	switch(post.type)	{		    	
    	case "regular":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "regular.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
			$("#tumblrFeed").append("<a class='title' href='" + post.url + "' target='_blank'>" + post["regular-title"] + "</a>");
			$("#tumblrFeed").append("<div class='body expandable'>" + post["regular-body"] + "</div>");
			break;
		}
		case "link":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "link.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
			$("#tumblrFeed").append("<a class='title' href='" + post["link-url"] + "' target='_blank'>" + post["link-text"] + "</a>");
			$("#tumblrFeed").append("<div class='body expandable'>" + post["link-description"] + "</div>");
    		break;
    	}		    	
    	case "quote":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "quote.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
			$("#tumblrFeed").append("<div class='body'>" + "<div class='quote expandable'>" + post["quote-text"] + "</div>" + "<div class='quotesrc'>" + post["quote-source"] + "</div>" + "</div>");
			break;
		}		    	
		case "photo":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "photo.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
			$("#tumblrFeed").append("<div class='body'>" + "<a class='title' href='" + post.url + "'>" + "<img src='" + post["photo-url-100"] + "'/></a><br/>" + post["photo-caption"] + "</div>");
			break;
		}
    	case "conversation":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "conversation.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
			var html = '';
			$("#tumblrFeed").append("<a class='title' href='" + post.url + "' target='_blank'>" + post["conversation-title"] + "</a>");
			for(var i = 0; i < post["conversation"].length; i++)	{
				var conv = post["conversation"][i];	
				html += "<div class='convlabel'>" + conv.label + "</div>";
				html += "<div class='convtext expandable'>" + conv.phrase + "</div>";
			}	    		
			$("#tumblrFeed").append("<div class='body'>" + html + "</div>");
			break;
		}
    	case "audio":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "audio.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
			$("#tumblrFeed").append("<a class='title' href='" + post.url + "' target='_blank'>" + post["audio-caption"] + "</a>");
			$("#tumblrFeed").append("<div class='body'>" + post["audio-player"] + "</div>");
			break;
    	}
    	case "video":	{
			$("#tumblrFeed").append("<table style='width: 100%;'><tr><td width='18px'>" + "<a href='" + post.url + "' target='_blank'>" + "<img class='icon' src='" + $.tumblr.imagePath + "video.gif'/></a></td><td><div class='date'>" + dateFmt + "</div></td></table>");
    		$("#tumblrFeed").append("<a class='title' href='" + post.url + "' target='_blank'>" + post["video-caption"] + "</a>");
    		var vdo = post["video-player"];
    		var re = new RegExp('width=\"([a-zA-Z0-9]*)\"', 'g');
    		vdo = vdo.replace(re, 'width="' + $.tumblr.videoWidth + '"');
    		re = new RegExp('height=\"([a-zA-Z0-9]*)\"', 'g');
    		vdo = vdo.replace(re, 'height="' + $.tumblr.videoHeight + '"');    		
    		re = new RegExp('400,320', 'g');
    		vdo = vdo.replace(re, $.tumblr.videoWidth + ',' + $.tumblr.videoHeight);
    		re = new RegExp('400,250', 'g');
    		vdo = vdo.replace(re, $.tumblr.videoWidth + ',' + $.tumblr.videoHeight);
    		$("#tumblrFeed").append("<div class='body'>" + vdo + "</div>");
    		break;
    	}		    	
    	default:
    		break;
    }
	$("#tumblrFeed").append("<div class='clear'>&nbsp;</div>");
}	
	

