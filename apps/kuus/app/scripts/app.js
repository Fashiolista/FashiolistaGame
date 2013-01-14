define(['app'], function() {

var hasTouch = false;

if (("ontouchstart" in document.documentElement)) {
	document.documentElement.className += " touch";
	hasTouch = true;
}

/**
*
FASHIOLISTA GAME
*
*/

	var FLgame = {

		init : function() {

			/** THE USER CONSTRUCTOR *********************************/			
			function User(userData) {
			    this.id = userData.id;
				this.name = userData.display_name;
				this.image = userData.image;
				this.url = userData.url;
				this.websiteUrl = userData.website_url;
				this.blogUrl = userData.blog_url;
			}
			var users = new Array();


			// var sort_by = function(field, reverse, primer){
			//    var key = function (x) {return primer ? primer(x[field]) : x[field]};
			//    return function (a,b) {
			//        var A = key(a), B = key(b);
			//        return ((A < B) ? -1 :
			//                (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
			//    }
			// }


			/** TEMPLATE ENGINE SETUP *********************************/
			
			// increase performance using a document Fragment instead of normal append
			var frag = document.createDocumentFragment();

			// Template Chaching [from: http://stackoverflow.com/questions/9833312/how-do-i-properly-store-a-javascript-template-so-that-it-isnt-instantiated-mul/]
			TemplateCache = {
				get: function(selector){
					if (!this.templates){ this.templates = {}; }
					var template = this.templates[selector];
					if (!template){
						var tmpl = $(selector).html(); // better .text() or .html() ?
						template = doT.template(tmpl,undefined);

						this.templates[selector] = template;
					}
					return template;
				}
			}
			/** JSON CALL, FETCHING AND LOOP *********************************/
			$.ajaxSetup({
				cache:false
			});
			$.ajax({
				type: 'GET',
				url: 'items.json',
				cache: true,
				dataType: 'json',
				success: function(data) {
				
					//data.object_list.items.sort(sort_by('loves', false, parseInt));
				
					// detect if the user is logged in
					var userIsLoggedIn = (data.userToken) ? true: false;

					if(data.success){
						// create an array of User objects
						for (var x in data.object_list.users) {
						  	if(data.object_list.users.hasOwnProperty(x)) {
						    	var user = new User(data.object_list.users[x]);
						    	users.push(user);
							}
						};

						// loop through the object_list, create the singles object to output in the template
						for (var y in data.object_list.items) {
							var itemObj = data.object_list.items[y];
							var creator = jQuery.grep(users, function (a) { return a.id === itemObj.created_by });
							
							// properties took directly from the loop in the json object_list
							//  itemObj.id
							//  itemObj.name
							//  itemObj.created_by
							//  itemObj.redirect_url
							//  itemObj.site_domain
							//  itemObj.entity_url
							//  itemObj.created_by
							//  itemObj.id
							//  itemObj.image
							//  itemObj.loves
							
							// get the img src of the big size vesion of the image
								itemObj.imageBig = itemObj.image.replace('126x126','365x365');

							// format the date with jquuery timeago plugin
								itemObj.createdDateFormatted = $.timeago(new Date(
									itemObj.created_at.substr(0,10) // here I substring the date because to be read by 'timeago' it should be in the ISO 8601 format, and it isn't
								));
							
							// properties took from the users array
								itemObj.creator_id = itemObj.created_by; // creator[0].id
								itemObj.creator_name = creator[0].name;
								itemObj.creator_img = creator[0].image;
								itemObj.creator_url = creator[0].url;
								itemObj.creator_website = creator[0].website_url;
								itemObj.creator_blog = creator[0].blog_url;
							
							var dataTemplate = TemplateCache.get($('#view-item'));
							// append the list to the docFragment
							$(frag).append(dataTemplate(itemObj));
						}
						// append the fragment to the container and show
						$('#view').append(frag);
					}
				}
			});
		}
	}

	$(document).ready(function() {
		FLgame.init();

		// CACHING UI ELEMENTS
		var uiView = $('#view'),
			uiControls = $('#controls'),
			uiBackTop = $('#back-top'),
			uiStart = $('#start'),
			uiItemView = $('.item'),
			uiUserCard = $('.user-card');
			
		// START FIRE
		uiStart.toggle(
			function() {
				$(this).html('<i class="icon-up-hand special"></i> CLOSE');
				uiView.slideDown();
				uiControls.fadeToggle();
			}, function() {
				$(this).html('<i class="icon-down-hand special"></i> OPEN');
				uiView.slideUp();
				uiControls.fadeOut();
			}
		);

		// BACK TO TOP
		$(window).scroll(function() {
			if($(this).scrollTop() > 150) {
				uiBackTop.fadeIn();
			} else {

				uiBackTop.fadeOut();
			}
		});
		uiBackTop.click(function() {
			$('body,html').animate({scrollTop:0},400);
		});

		// FIT TEXT
		$('.fit').fitText();

		// TOOLTIP
		$(function() {
			uiItemView.live('mouseover click', function() {
				$(this).addClass('soften').find('.user-card').show();
				//var uiItemViewId = $(this).attr('rel');
				//$(".user-card[rel="+ uiItemViewId + "]").slideDown();
			});
			uiItemView.live('mouseout click', function() {
					$(this).removeClass('soften').find('.user-card').hide();
			});

			uiUserCard.mouseover(function() {
				$(this).show();
			});
			uiUserCard.mouseout(function() {
				$(this).hide();
			});
		});
			
	});
});
