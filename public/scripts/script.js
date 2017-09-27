"use strict";
$(document).ready(function() {
	$(".edit-button").click( function(){
		var temp =$(this).parent().parent();
		temp.find(".showed-form").toggleClass("hidden");
		temp.find(".hidden-form").toggleClass("hidden");
		temp.find(".hidden-form").children().focus();
	});
	$("#plus").click( function(){
		$("#new-row").slideToggle(500, function() {
			$("#new").focus();
		});
	});
});