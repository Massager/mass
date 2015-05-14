(function(){

	var rev = "fwd";

	function titlebar(val) {
	    var msg  = "You have new unread messages...",
	    	res = " ",
	    	speed = 100,
	    	pos = val,
	    	le = msg.length;

	    if(rev == "fwd") {
	        if(pos < le){
	        	pos = pos+1;
	        	scroll = msg.substr(0,pos);
	        	self.postMessage({ str: scroll }); 
	        	//document.title = scroll;
	        	timer = setTimeout(function(val){
	        		titlebar(val);
	        	}, speed, pos);
	        } else {
	        	rev = "bwd";
	        	timer = setTimeout(function(val) {
	        		titlebar(val)
	        	}, speed, pos);
	        }
	    }
	    else {
	        if(pos > 0) {
	        	pos = pos-1;
	        	var ale = le-pos;
	        	scrol = msg.substr(ale,le);
	        	//document.title = scrol;
	        	self.postMessage({ str: scrol });
	        	timer = setTimeout(function(val){
	        		titlebar(val);
	        	}, speed, pos);
	        } else {
	        	rev = "fwd";
	        	timer = setTimeout(function(val){
	        		titlebar(val);
	        	}, speed, pos);
	        }    
	    }
	}

	titlebar(0);

})();