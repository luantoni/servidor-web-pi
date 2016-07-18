function hideButton(){
	$('.switch').hide();
}

function showButton(){
	$('.switch').fadeIn(1000);
}

function unlock(){
	$.ajax({
		url: "http://localhost:3000?key=DD2016TRNEE",
		success: function(result){
        	alert(result);
    	}
    });
}

function clickButton(){
	$('#button').click(function(){
    	var state = $('#button').is(":checked");
    	$(this).prop('disabled', true);
    	unlock();
    	if(state===true){
    		setTimeout(function(){
    			$('#button').attr('checked', false);
    			$('#button').prop('disabled', false);
    		},4000);
    	}
	});
}

$(document).ready(function(){
    hideButton();
    showButton();
    clickButton();
});