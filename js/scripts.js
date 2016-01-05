window.onload = function(){

    document.getElementById('search_field').addEventListener('keyup', request.find, false);

    //Set focus to search field
    document.getElementById('search_field').focus();


};


var d 		= document,
    request	= {},
    ajax	= (typeof(XMLHttpRequest) == 'undefined') ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest(),
    helper	= {};



filter.switchTestament = function(){

    //Initiate vars
    var list  = d.getElementById('list'),
        value = d.forms.searchForm.testament.value;

    console.log(value);

    if(value == 'all'){
        list.className = 'found_list';
    }else if(value == 'old'){
        list.className = 'found_list hide_new';
    }else if(value == 'new'){
        list.className = 'found_list hide_old';
    }

    //for(var i = 0; i < list.children.length; i++){
    //
    //}

    //console.log();


};

request.find = function(){

    var xhr 	= ajax,
        data	= {
            request	: this.value,
            mode	: d.searchForm.search_mode.value
        };

    var post = 'data=' + JSON.stringify(data);

    xhr.open("POST",'/query', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(post);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200){

            request.parse(JSON.parse(xhr.responseText));
            //console.log(xhr.responseText);

        }
    }
};


request.parse = function(object){

    //Get found chapters list
    var list 	= d.getElementById('list');
    list.innerHTML = '';

    for(var key in object){

        console.log('Объект = ', object[key]);

        if(object[key].matches != 0){

            //Create elements
            var LI 			 = d.createElement('LI'),
                HEADER 		 = d.createElement('DIV'),
                LINKS 		 = d.createElement('DIV'),
                MORE_BTN 	 = d.createElement('DIV'),
                CHAPTERS 	 = d.createElement('DIV'),
                CHAPTER_LIST = d.createElement('UL'),
                FOUND_TEXT	 = d.createElement('DIV'),
                FOUND_COUNT  = d.createElement('DIV');

            LI.className			= request.testament(object[key].id);
            HEADER.className		= 'found_header';
            LINKS.className			= 'links_wrapper';
            MORE_BTN.className		= 'more_chapters';		MORE_BTN.setAttribute('onClick', 'return chapter.moreSwitch(this)');
            CHAPTERS.className		= 'chapters_wrapper';
            CHAPTER_LIST.className	= 'chapter_list';
            FOUND_TEXT.className	= 'found_text';
            FOUND_COUNT.className 	= 'found_count';

            LINKS.innerHTML = '<span>'+ object[key].chapters[0].name + '</span>' + request.genLinks(object[key].chapters);
            request.genChaptersList(CHAPTER_LIST, object[key]);

            FOUND_TEXT.innerHTML  = '<span>' + object[key].chapters[0].text.substr(0, 120) + '...</span>';
            FOUND_COUNT.innerHTML = '<span>' + object[key].matches + ' совпадений в книге ' + object[key].chapters[0].name +'</span>';

            LI.appendChild(HEADER);
            HEADER.appendChild(LINKS);
            HEADER.appendChild(MORE_BTN);
            LI.appendChild(CHAPTERS);
            CHAPTERS.appendChild(CHAPTER_LIST);
            LI.appendChild(FOUND_TEXT);
            LI.appendChild(FOUND_COUNT);

            //Проверяем, если в текущей книге ничего не найдено, идем дальше
            for(var i = 1; i <= object[key].count_chapters; i++){

                //console.log(i);

            }
        }

        list.appendChild(LI);

    }
};


//Return testament from book id
request.testament = function(id){
    if(id <= 39) return 'old';
    else if((id > 39) && (id <= 66)) return 'new';
};

//Generate chapters list
request.genLinks = function(chapters){

    var links = "<span class='links'>",
        arr	  = [];

    //Тут нужно что то сделать еще

    for(var key in chapters){
        arr[chapters[key].chapter] = chapters[key].chapter;
    }

    for(var i = 0; i < arr.length; i++){
        if(arr[i]){
            if(i < 7) links += " <a href=''>" + arr[i] + '</a>';
        }
    }

    if(chapters.length > 7) links += '</span><span>...</span>';
    else links += '</span>';

    return links;
};

//Function generate chapters list
request.genChaptersList = function(parent, object){

    for(var i = 1; i <= object.count_chapters; i++){

        //Create elements
        var LI 	 = d.createElement('LI'),
            NUMB = d.createElement('DIV'),
            LINK = d.createElement('A');

        NUMB.className = 'numb';
        LINK.innerHTML = i;
        LINK.href = "genesis/2";
        LINK.setAttribute('data-book-name', object.chapters[0].alias);	//Получаем алиас текущей книги
        LINK.setAttribute('onClick', "return chapter.show(this)");

        //Запускаем цикл в котором будем проверять есть ли совпадения, если есть, то хорошо
        for(var key in object.chapters){
            if(object.chapters[key].chapter == i) LI.className = 'active';
        }

        LI.appendChild(NUMB);
        NUMB.appendChild(LINK);

        parent.appendChild(LI);
    }
};

//Show chapter
chapter.show = function(elem){

    var parentUl = d.getElementById('list'),
        parentLi = elem.parentNode.parentNode.parentNode.parentNode.parentNode,
        localUl  = elem.parentNode.parentNode.parentNode,
        localLi	 = elem.parentNode.parentNode;

    //Set default all link of chapters
    for(var i = 0; i < localUl.children.length; i++){
        if(localUl.children[i].className == 'active active_current'){
            localUl.children[i].className = 'active';
        }else if(localUl.children[i].className == 'current'){
            localUl.children[i].className = '';
        }
    }

    for(var cnt = 0; cnt < parentUl.children.length; cnt++){

        var currClassName = parentUl.children[cnt].className;

        if(currClassName == 'old' || currClassName == 'old active'){
            parentUl.children[cnt].className = 'old';
        }else if(currClassName == 'new' || currClassName == 'new active'){
            parentUl.children[cnt].className = 'new';
        }

    }

    //Set current chapter
    localLi.className = chapter.rankUp(localLi.className);

    //Making visible the current list
    parentLi.className = (parentLi.className == 'old') ? 'old active' : 'new active';

    //Show the entire chapter
    chapter.extended(elem);

    return false;
};

//Show the entire chapter
chapter.extended = function(elem){

    var alias 		= elem.getAttribute('data-book-name'),
        chapter_id	= elem.innerHTML;

    var xhr 	= ajax,
        data 	= {
            chapter_id	: chapter_id,
            alias		: alias
        };

    var post = 'data=' + JSON.stringify(data);

    xhr.open("POST",'/chapter', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(post);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status==200){

            //request.parse(JSON.parse(xhr.responseText));
            chapter.parse(JSON.parse(xhr.responseText.trim()), chapter_id);

        }
    };
};

//Switch more chapters
chapter.moreSwitch = function(elem){

    var block = elem.parentNode.nextElementSibling,
        height = block.children[0].clientHeight + 'px';

    if(block.clientHeight == 0){
        block.style.height = height;

        //Rotate the button
        elem.style.OTransform 	= 'rotate(135deg)'; elem.style.MozTransform = 'rotate(135deg)';
        elem.style.MsTransform 	= 'rotate(135deg)';	elem.style.transform 	= 'rotate(135deg)';
    }else{
        block.style.height = '0px';

        //Rotate the button
        elem.style.OTransform 	= 'rotate(-0deg)'; elem.style.MozTransform = 'rotate(-0deg)';
        elem.style.MsTransform 	= 'rotate(-0deg)';	elem.style.transform 	= 'rotate(-0deg)';
    }
};

chapter.parse = function(object, chapter_id){

    //Initiate vars
    var list = d.getElementById('extended_list'),
        name = d.getElementById('chapter_name'),
        type = d.getElementById('chapter_id');

    name.innerHTML = object.name + ' ' + chapter_id;
    type.innerHTML = object.name + ' • ' +object.type;

    //Cliar the list
    list.innerHTML = '';

    for(var i in object.verse){

        var LI 		  = d.createElement('LI'),
            CONTAINER = d.createElement('DIV'),
            NUMB	  = d.createElement('DIV'),
            TEXT	  = d.createElement('DIV');

        CONTAINER.className = 'verse_container';
        NUMB.className = 'numb';	NUMB.innerHTML = object.verse[i].key;
        TEXT.className = 'txt';		TEXT.innerHTML = object.verse[i].value;

        list.appendChild(LI);
        LI.appendChild(CONTAINER);
        CONTAINER.appendChild(NUMB);
        CONTAINER.appendChild(TEXT);
    }

};


chapter.rankDown = function(li){



};

//Делаем видимым текущую выбранную главу
chapter.rankUp = function(className){
    if(className == 'active')
        return 'active active_current';
    else return 'current';
};


helper.switch = function(block, option){
    if(block.style.visibility == '' || block.style.visibility == 'hidden'){
        block.style.visibility = 'visible';
        block.style.margin = '13px 0 0 -205px';
        block.style.opacity = '1';
    }else{
        block.style.visibility = 'hidden';
        block.style.margin = '30px 0 0 -205px';
        block.style.opacity = '0';
    }
};







var node 	= {};
node.val = function(elem){

    var e = event || window.event;
    // кросс-браузерно получить target
    var target = e.target || e.srcElement;
    if(target.tagName == 'SPAN'){
        target.style.color = '#BB7A47';
    }
};





































//$(document).ready(function(){
//
////Initiate vars
//	document.getElementById('shadow').style.visibility = 'hidden';
//	document.getElementById("circle_wrapper").style.display = 'none';
//
//	window.addEventListener("wheel", onwheel, false);
//
//
//
//
//	document.getElementById('menu_btn').addEventListener('click', switch_menu, false);
//
//	document.getElementById('woman').addEventListener('mousemove', show_girl, false);
////Показываем лупу
//	document.getElementById('woman').addEventListener('mouseover', function(){
//		document.getElementById('second_woman').style.opacity = '1';
//	}, false);
////Прячем лупу
//	document.getElementById('woman').addEventListener('mouseout', function(){
//		document.getElementById('second_woman').style.opacity = '0';
//	}, false);
//
//	document.getElementById('man').addEventListener('mousemove', show_man, false);
////Прячем лупу
//	document.getElementById('man').addEventListener('mouseout', function(){
//		document.getElementById('second_man').style.opacity = '0';
//	}, false);
////Показываем лупу
//	document.getElementById('man').addEventListener('mouseover', function(){
//		document.getElementById('second_man').style.opacity = '1';
//	}, false);
//
////Close all modals
//	document.getElementById('shadow').addEventListener('click', close_modals, false);
//
//	document.getElementById('modal_btn').addEventListener('click', function(){
//		send_mail(document.getElementById('name'), document.getElementById('phone'));
//	}, false);
//
//
////Footer action event
//	document.getElementById('footer').addEventListener('mousemove', eagle_move, false);
//	setInterval(flashbang, Math.random() * (3000 - 2000) + 2000);
//
//});

/*
 $(document).ready(function() {
 if(navigator.userAgent.match(/(iPhone|iPad|iPod|Macintosh)/i)) {
 setTimeout(function() {
 location.href = '/mobile';
 }, 4000);
 };
 });
 */

function onwheel(event){
    var e = event || window.event;

// wheelDelta не дает возможность узнать количество пикселей
    var delta = e.deltaY || e.detail || e.wheelDelta;

    var list = document.getElementById('wizard_local_list');
    var scrollTop = window.pageYOffset ? window.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

//Элемент с другим списком
    var well = document.getElementById('wizard_local_list');

    if((parseInt(well.offsetTop) - 800) < scrollTop){
        if(parseInt(document.body.clientWidth) > 1000){
            setTimeout(function(){well.children[0].style.margin = '30px 0 55px';well.children[0].style.opacity = '1';}, 0);
            setTimeout(function(){well.children[1].style.margin = '30px 0 55px';well.children[1].style.opacity = '1';}, 500);
            setTimeout(function(){well.children[2].style.margin = '30px 0 55px';well.children[2].style.opacity = '1';}, 1100);
        }else{
            setTimeout(function(){well.children[0].style.margin = '30px auto 55px';well.children[0].style.opacity = '1';}, 0);
            setTimeout(function(){well.children[1].style.margin = '30px auto 55px';well.children[1].style.opacity = '1';}, 500);
            setTimeout(function(){well.children[2].style.margin = '30px auto 55px';well.children[2].style.opacity = '1';}, 1100);
        }
    }





    //well.innerHTML = delta + "<br>" + scrollTop + "<br> Положение блока - " + document.getElementById('wizard_scroll').offsetTop;

}



//Show request modal
function show_modal(){

//Initiate vars
    var modal = document.getElementById('request_modal_wrapper');
    var shadow = document.getElementById('shadow');


    if(shadow.style.visibility == 'hidden'){
        shadow.style.visibility = 'visible';
        modal.style.visibility = 'visible';
    }
}


//Показываем татуировки на девушке
function show_girl(event){
    var e = event || window.event;

//Инициируем окружность
    var circle = document.getElementById('second_woman');

    if(e.target.className == 'point'){
        circle.style.opacity = '0';
    }else circle.style.opacity = '1';

    var bg = document.getElementById('woman');
    var circle = document.getElementById('second_woman');

    var middleCircleWidth = circle.offsetWidth / 2;
    var middleCircleHeight = circle.offsetHeight / 2;

    var left = event.pageX - bg.offsetLeft - middleCircleWidth;
    var top = event.pageY - bg.offsetTop - middleCircleHeight;


    if(left < -middleCircleWidth)
        left = -middleCircleWidth;
    else if(left > bg.offsetWidth - middleCircleWidth)
        left = bg.offsetWidth - middleCircleWidth;

    if(top < -middleCircleHeight)
        top = -middleCircleHeight;
    else if(top > bg.offsetHeight - middleCircleHeight)
        top = bg.offsetHeight - middleCircleHeight;

    circle.style.left = left + 'px';
    circle.style.top = top + 'px';
    circle.style.backgroundPosition = (-left) + 'px ' + (-top) + 'px';

}

//Показываем татуировки на мужчине
function show_man(event){

    var e = event || window.event;

//Инициируем окружность
    var circle = document.getElementById('second_man');

    if(e.target.className == 'point'){
        circle.style.opacity = '0';
    }else circle.style.opacity = '1';

    var bg = document.getElementById('man');
    var circle = document.getElementById('second_man');

    var middleCircleWidth = circle.offsetWidth / 2;
    var middleCircleHeight = circle.offsetHeight / 2;

    var left = event.pageX - bg.offsetLeft - middleCircleWidth;
    var top = event.pageY - bg.offsetTop - middleCircleHeight;


    if(left < -middleCircleWidth)
        left = -middleCircleWidth;
    else if(left > bg.offsetWidth - middleCircleWidth)
        left = bg.offsetWidth - middleCircleWidth;

    if(top < -middleCircleHeight)
        top = -middleCircleHeight;
    else if(top > bg.offsetHeight - middleCircleHeight)
        top = bg.offsetHeight - middleCircleHeight;

    circle.style.left = left + 'px';
    circle.style.top = top + 'px';
    circle.style.backgroundPosition = (-left) + 'px ' + (-top) + 'px';

}

//Eagle move
function eagle_move(event){
    var eagle = document.getElementById('eagle');
    var rock =  document.getElementById('footer');

    //Initiate clouds
    var cloud1 = document.getElementById('cloud1');
    var cloud2 = document.getElementById('cloud2');
    var cloud3 = document.getElementById('cloud3');

    eagle.style.opacity = '1';
    eagle.style.left = (event.pageX / 20) + 'px';
    eagle.style.top = (parseInt(event.clientY) / 20) + 'px';

    //Двигаем облака
    cloud1.style.marginLeft =  (-parseInt(event.clientX) / 40) + 'px';
    cloud2.style.marginLeft =  (parseInt(event.clientX) / 130) + 'px';
    cloud3.style.marginRight =  (-parseInt(event.clientX) / 130) + 'px';


    //console.log('PAGE-Y' + event.clientY);
    //console.log('Это положение на странице - ' + eagle.offsetWidth);

}

function flashbang(){

//Initiate vars
    var flash_switch = [true, false];

    var current_litning = Math.floor(Math.random() * (3 - 1 + 1) + 1);
    document.getElementById('cloud' + current_litning).children[1].style.opacity = '1';
    document.getElementById('lightning').style.opacity = '0.8';

    setTimeout(function(){
        document.getElementById('lightning').style.opacity = '0';
        document.getElementById('cloud' + current_litning).children[1].style.opacity = '0';
    },500);

}



//Switch main menu
function switch_menu(){

//Initiate vars
    var menu = document.getElementById('menu');

    if(menu.style.height != '220px')
        menu.style.height = '220px';
    else menu.style.height = '35px';

}





/*

 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 */

var player;


//ааОаКаАаЗбаВаАаЕаМ аВаИаДаЕаО аБаЛаОаК
function show_video(btn){

// 2. This code loads the IFrame Player API code asynchronously.


//ааНаИбаИаИббаЕаМ аПаЕбаЕаМаЕаНаНбаЕ
    var video = document.getElementById('video');

    btn.style.display = 'none';
    video.style.display = 'block';

    player = new YT.Player('video', {
        videoId: '4EBBitMvq4A',
        width: '100%',
        events: {
            'onReady':onPlayerReady,
            'onStateChange':onPlayerStateChange
        }
    });

    //4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }


}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        //setTimeout(stopVideo, 12000);
        done = true;
    }
}
function stopVideo(){
    player.stopVideo();
}


/*



 //Показываем видео блок
 function show_video(btn){

 // 2. This code loads the IFrame Player API code asynchronously.
 var tag = document.createElement('script');

 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 //Инициируем переменные
 var video = document.getElementById('video');

 btn.style.display = 'none';
 video.style.display = 'block';

 var player;
 player = new YT.Player('v', {
 videoId: 'KAWmbuOF3PU',
 width: '100%',
 events: {
 'onReady':onPlayerReady,
 'onStateChange':onPlayerStateChange
 }
 });

 // 4. The API will call this function when the video player is ready.
 function onPlayerReady(event) {
 event.target.playVideo();
 }
 var done = false;
 function onPlayerStateChange(event) {
 if (event.data == YT.PlayerState.PLAYING && !done) {
 setTimeout(stopVideo, 12000);
 done = true;
 }
 }
 function stopVideo() {
 // player.stopVideo();
 }


 }

 */





//Читаем больше текста в блоке ПРИЧИНЫ
function read_reason(){

//Initiate vars
    var txt = document.getElementById('reason_more_txt');
    var btn = document.getElementById('reason_btn');

//Через промежуток времени показываем дополнительный текст
    setTimeout(function(){
        txt.style.height = txt.children[0].clientHeight + 'px';
        btn.style.display = 'block';
    }, 1200);

}


//Инициируем переменную для ютуба
var play;


//закрываем модальное окно с видео
function close_video_modal(){
    var modal = document.getElementById('video_modal');
    var shadow = document.getElementById('shadow');

    shadow.style.visibility = 'hidden';
    modal.style.display = 'none';

    play.pauseVideo();

    console.log(player);

    if(player) player.pauseVideo();

}


function onYouTubePlayerAPIReady(){

    play = new YT.Player('video_wizard', {videoId: document.curr_video,});

    document.getElementById('stoun_show').onclick = function(){

        close_video_modal();

        //Initiate vars
        var video = document.getElementById('video_wizard');
        var modal = document.getElementById('video_modal');
        var shadow = document.getElementById('shadow');


        var id = document.curr_video;
        play.loadVideoById(id);
        play.playVideo();

        shadow.style.visibility = 'visible';
        modal.style.display = 'block';

    }

    document.getElementById('stella_show').onclick = function(){

        close_video_modal();

        //Initiate vars
        var video = document.getElementById('video_wizard');
        var modal = document.getElementById('video_modal');
        var shadow = document.getElementById('shadow');

        var id = document.curr_video;
        play.loadVideoById(id);
        play.playVideo();

        shadow.style.visibility = 'visible';
        modal.style.display = 'block';


    }
    document.getElementById('buba_show').onclick = function(){

        close_video_modal();

        //Initiate vars
        var video = document.getElementById('video_wizard');
        var modal = document.getElementById('video_modal');
        var shadow = document.getElementById('shadow');

        var id = document.curr_video;
        play.loadVideoById(id);
        play.playVideo();

        shadow.style.visibility = 'visible';
        modal.style.display = 'block';


    }






    document.getElementById('close_video_modal').onclick = function(){close_video_modal()};


}



//Функция вызывается при клике на КРЕСТИК
function show_popup_pointer(elem){

//Initiate vars
    var popup = elem.parentNode.nextElementSibling;
    //var pList = document.getElementById('woman_pointer_list');
    var pList = elem.parentNode.parentNode.parentNode;

//Current elem
    var curr = elem.id;
    console.log(curr);

//Свернем все лишние модальные окна
    for(var i=0; i < pList.children.length; i++){
        pList.children[i].children[1].style.height = '0px';

        return_false(pList.children[i].children[0].children[0]);

    }

    if(popup.clientHeight > 0){
        popup.style.height = '0px';
        elem.style.OTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.MozTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.MsTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.transform = 'rotate(-45deg) scale(1, 1)';
    }else{
        popup.style.height = popup.children[0].clientHeight + 'px';

        elem.style.WebkitTransform = 'rotate(90deg) scale(1.3, 1.3)';
        elem.style.MozTransform = 'rotate(90deg) scale(1.3, 1.3)';
        elem.style.OTransform = 'rotate(90deg) scale(1.3, 1.3)';
        elem.style.MsTransform = 'rotate(90deg) scale(1.3, 1.3)';
        elem.style.transform = 'rotate(90deg) scale(1.3, 1.3)';
    }

}

//Функция возвращает точки на исходную позицию
function return_false(elem){
    elem.style.OTransform = 'rotate(-45deg) scale(1, 1)';
    elem.style.MozTransform = 'rotate(-45deg) scale(1, 1)';
    elem.style.MsTransform = 'rotate(-45deg) scale(1, 1)';
    elem.style.transform = 'rotate(-45deg) scale(1, 1)';
}


//Прячем блок при наведении
function close_pointer_popup(elem){

//Получаем модальное окно точки
    var popup = elem.parentNode.nextElementSibling;

//Initiate vars
    var cirlcle = document.getElementById('second_woman');
    cirlcle.style.opacity = '1';

//Если текущее модальное окно не свернуто, то при убирании курсора
//не сворачиваем pointer

    if(popup.clientHeight == 0){
        elem.style.OTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.MozTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.MsTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.transform = 'rotate(-45deg) scale(1, 1)';
    }

}

//Прячем блок при наведении
function close_man_pointer_popup(elem){

//Получаем модальное окно точки
    var popup = elem.parentNode.nextElementSibling;

//Initiate vars
    var cirlcle = document.getElementById('second_woman');
    cirlcle.style.opacity = '1';

//Если текущее модальное окно не свернуто, то при убирании курсора
//не сворачиваем pointer

    if(popup.clientHeight == 0){

        elem.style.OTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.MozTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.MsTransform = 'rotate(-45deg) scale(1, 1)';
        elem.style.transform = 'rotate(-45deg) scale(1, 1)';

    }

}

//Показываем блок при наведении
function pointer_popup(elem){

//Initiate vars
    var cirlcle = document.getElementById('second_woman');
    cirlcle.style.opacity = '0';

    elem.style.WebkitTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.MozTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.OTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.MsTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.transform = 'rotate(90deg) scale(1.3, 1.3)';
}

//Показываем блок при наведении
function pointer_man_popup(elem){

//Initiate vars
    var cirlcle = document.getElementById('second_man');
    cirlcle.style.opacity = '0';

    elem.style.WebkitTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.MozTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.OTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.MsTransform = 'rotate(90deg) scale(1.3, 1.3)';
    elem.style.transform = 'rotate(90deg) scale(1.3, 1.3)';
}


//send data on server
function send_mail(name, phone){
    var shadow = document.getElementById("shadow");
    var modal = document.getElementById("request_modal_wrapper");
//var new_modal = document.getElementById('new_modal_wrapper');
    var doneModal = document.getElementById("circle_wrapper");

    name.style.background = "#FFF";
    phone.style.background = "#FFF";

    if(name.value != ""){
        if(phone.value != ""){

            var HTTP=createAjax();
            HTTP.open("POST",'/addrequest/?phone='+phone.value.trim()+"&owner="+name.value.trim() + "&type=" + document.request, true);
            HTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            HTTP.send();
            HTTP.onreadystatechange = function(){
                if(HTTP.readyState == 4){
                    console.log(HTTP.responseText);
                    if(HTTP.responseText.trim() === "ok"){
                        name.value = "";
                        phone.value = "";

                        modal.style.visibility = "hidden";
                        //new_modal.style.display = "none";
                        shadow.style.visibility = "visible";

                        doneModal.style.display = "block"; //doneModal.style.opacity = "1";

                        setTimeout(close_the_modal, 10000);

                    }
                }
            }
        }else{phone.style.background = "#DB5D59";}
    }else{name.style.background = "#DB5D59";}
}

//Close main modal
function close_main_modal(){

//Initiate vars
    var modal = document.getElementById('request_modal_wrapper');
    var shadow = document.getElementById('shadow');

    shadow.style.visibility = 'hidden';
    modal.style.visibility = 'hidden';

}

//Закрываем модальное после отправки письма
function close_done_modal(){
    var modal = document.getElementById('circle_wrapper');
    var shadow = document.getElementById('shadow');

    shadow.style.visibility = 'hidden';
    modal.style.display = 'none';

}

//Зактываем все модальные окна
function close_modals(event){

//Закрываем основное модальное окно
    close_main_modal();

//Закрываем модальное окно с видео
    close_video_modal();

//Закрываем модаль, которая учавсвтут после завершения сообщения
    close_the_modal();

}

//Прячем модальное окно
function close_the_modal(){
    var modal = document.getElementById('request_modal_wrapper');
//var modal_two = document.getElementById('gallery_block');
    var doneModal = document.getElementById('circle_wrapper');
    var shadow = document.getElementById('shadow');

    //modal_two.style.visibility = 'hidden';
    modal.style.visibility = 'hidden';
    doneModal.style.display = 'none';
    shadow.style.visibility = 'hidden';
}








//Прячем модальное окно
function close_the_modal(){
    var modal = document.getElementById('request_modal_wrapper');
    var doneModal = document.getElementById('circle_wrapper');
    var shadow = document.getElementById('shadow');

    modal.style.visibility = 'hidden';
    doneModal.style.display = 'none';
    shadow.style.visibility = 'hidden';
}






























