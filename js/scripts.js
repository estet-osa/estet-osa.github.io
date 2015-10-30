$(document).ready(function(){


window.addEventListener("wheel", onwheel, false);

    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash,
            $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function () {
            window.location.hash = target;

            setTimeout(function(){onwheel();}, 200);
        });
    });



//Footer action event
document.getElementById('home').addEventListener('mousemove', cityAction, false);

});


function onwheel(event){
    var e = event || window.event;

//Initiate var
    var menu = document.getElementById('home').children[0];

    var scrollTop = window.pageYOffset ? window.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

    if(parseInt(scrollTop) > 600){

        menu.className = 'menu_hover';
        setTimeout(function(){
            menu.style.top = '0px';
        }, 100);

    }else if((parseInt(scrollTop) < 400) && (parseInt(scrollTop) > 200)) {
        menu.style.top = '-70px';
        setTimeout(function(){
            menu.className = 'menu';
        }, 100);
    }
}


function createAjax(){//AJAX ОБЪЕКТ...
    if(typeof(XMLHttpRequest) == 'undefined')return new ActiveXObject('Microsoft.XMLHTTP');
    else return new XMLHttpRequest()
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


//Eagle move
function cityAction(event){
    var home = document.getElementById('home');

    //var middleCircleWidth = home.offsetWidth / 2;
    //var middleCircleHeight = home.offsetHeight / 2;

   // var left = event.pageX / 100 * 5;
    var left = home.offsetWidth / 4 - ( event.pageX / 100 );

    console.log(home.offsetWidth);
    home.style.backgroundPosition = (-left) + 'px';

    //home.style.backgroundPosition = (event.pageX / 20) + 'px ' + (event.pageY / 20) + px;



}


//Switch main menu
function switch_menu(){

//Initiate vars
    var menu = document.getElementById('menu');

    if(menu.style.height != '220px')
        menu.style.height = '220px';
    else menu.style.height = '35px';

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




