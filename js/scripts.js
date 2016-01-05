window.onload = function(){

    //Send the message
    document.getElementById('send').addEventListener('click', request.send, false);

    document.getElementById('msg_field').addEventListener('keydown', function(e){
        if(e.keyCode == 13){
            request.send();
            e.preventDefault();
        }
    }, false);
};

var d 		= document,
    request	= {};

//Forming the message and generate to page
request.send = function(){

    var list = d.getElementById('list'),
        msg  = d.getElementById('msg_field');

    if(msg.innerHTML.trim().length >= 1){
        //Create elements
        var LI 			 = d.createElement('LI'),
            MSG_WRAP	 = d.createElement('DIV'),
            LABEL 		 = d.createElement('LABEL'),
            INPT 		 = d.createElement('INPUT'),
            SPAN_BOX   	 = d.createElement('SPAN'),
            SPAN_COVER 	 = d.createElement('SPAN'),
            IMG          = d.createElement('IMG'),
            SPAN_MSG	 = d.createElement('SPAN'),
            LINK_FROM    = d.createElement('A'),
            TEXT         = d.createElement('SPAN');

        MSG_WRAP.className = 'msg_wrap';
        LABEL.className = 'msgLabel';
        LABEL.setAttribute('for', list.children.length++);
        INPT.setAttribute('type', 'checkbox');
        INPT.setAttribute('id', list.children.length++);
        SPAN_BOX.className = 'checkbox';
        SPAN_COVER.className = '_cover';
        IMG.setAttribute('src', '/img/checkbox.gif');
        SPAN_MSG.className = 'msg';
        LINK_FROM.setAttribute('href', '/');
        LINK_FROM.className = 'from';
        LINK_FROM.innerHTML = 'John Doe';
        TEXT.className = 'txt';
        TEXT.innerHTML = msg.innerHTML.trim();

        list.appendChild(LI);
        LI.appendChild(MSG_WRAP);
        MSG_WRAP.appendChild(LABEL);
        LABEL.appendChild(INPT);
        LABEL.appendChild(SPAN_BOX);
        SPAN_BOX.appendChild(SPAN_COVER);
        SPAN_COVER.appendChild(IMG);
        LABEL.appendChild(SPAN_MSG);
        SPAN_MSG.appendChild(LINK_FROM);
        SPAN_MSG.appendChild(TEXT);

        //Cliar the message field
        request.cliarField(msg);
    }
};


request.cliarField = function(fild){
    fild.innerHTML = '';
};
