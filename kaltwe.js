/*
 * 칼퇴도우미
 * Author: Jaeho Shin <netj@sparcs.org>
 * Created: 2010-02-13
 *
 * 마음껏 고쳐 쓰셔도 좋습니다.
 * ( http://creativecommons.org/licenses/by-sa/2.0/kr/ )
 */

function setCookie(name, value, expiresIn) {
    var now = new Date();
    var expires = expiresIn ? new Date(now.getTime() + expiresIn*1000) : null;
    document.cookie = name + "=" + escape(value) +
        (expires ? ";expires=" + expires.toGMTString() : "") +
        ";path=" + location.pathname +
        ";domain=" + location.host;
}
function getCookie(name) {
    var cs = document.cookie.split(';');
    for (i in cs) {
        var pair = cs[i].split('=', 2);
        if (pair.length == 2) {
            var n = pair[0].replace(/^\s+|\s+$/, '', 'g');
            var v = pair[1].replace(/^\s+|\s+$/, '', 'g');
            if (n == name)
                return unescape(v);
        }
    }
    return null;
}

function displayTime(group, h, m) {
    document.getElementById(group+"H").innerHTML = h;
    document.getElementById(group+"M").innerHTML = (m < 10 ? "0" : "") + m;
}

var beganWork = null;
function update() {
    var workHours = parseInt(document.getElementById("workHours").value);
    if (document.getElementById("dinnerTime").checked)
        workHours += 0.5;
    // calculate end time
    var endWork = new Date();
    endWork.setTime(beganWork.getTime() + (workHours * 3600) * 1000 );
    displayTime("end", endWork.getHours(), endWork.getMinutes());
    // calculate remaining/past time
    var msg;
    var now = new Date();
    var s = (endWork.getTime() - now.getTime()) / 1000;
    if (s > 0) {
        document.getElementById("before").style.display = "";
        document.getElementById("after").style.display = "none";
        msg = "remaining";
    } else {
        s = -s;
        document.getElementById("before").style.display = "none";
        document.getElementById("after").style.display = "";
        msg = "past";
    }
    var h = Math.floor(s / 3600);
    var m = Math.floor(s % 3600 / 60);
    displayTime(msg, h, m);
}

var isTimestamp = false;
function startAt(then, isTimestamp, save) {
    if (save) {
        // save timestamp for a while
        var workHours = parseInt(document.getElementById("workHours").value);
        setCookie("beganWork", then.getTime(), workHours*15/6*3600);
        setCookie("isTimestamp", isTimestamp, workHours*15/6*3600);
    }
    // update
    if (isTimestamp)
        document.getElementById("timestamp").innerHTML = then.toLocaleString();
    else
        document.getElementById("timestamp").innerHTML = "";
    beganWork = new Date(then);
    beganWork.setMinutes(Math.ceil(beganWork.getMinutes() / 10) * 10);
    document.getElementById("beginH").value = beganWork.getHours();
    document.getElementById("beginM").value = beganWork.getMinutes();
    update();
}

function startThen() {
    var beginH = parseInt(document.getElementById("beginH").value);
    var beginM = parseInt(document.getElementById("beginM").value);
    var then = new Date();
    // if given hour is greater, then go back a day
    if (beginH > then.getHours())
        then.setTime(then.getTime() - 86400*1000);
    then.setHours(beginH);
    then.setMinutes(beginM);
    startAt(then, false, true);
}

function changeSettings() {
    document.getElementById("workHours").blur();
    // save settings
    setCookie("workHours", document.getElementById("workHours").value,     365*24*3600);
    setCookie("dinnerTime", document.getElementById("dinnerTime").checked, 365*24*3600);
    // update
    update();
}

function load() {
    var wH = document.getElementById("workHours");
    wH.type = "number";
    // load settings from cookie
    var h = getCookie("workHours");
    if (h) wH.value = h;
    var d = getCookie("dinnerTime");
    if (d) document.getElementById("dinnerTime").checked = d == "true";
    // load beganWork from cookie
    var t = getCookie("beganWork");
    if (t)
        startAt(new Date(parseInt(t)), getCookie("isTimestamp") == "true", false);
    else 
        startAt(new Date(), true, true);
    setInterval(update, 60 * 1000);
    // show instructions for adding icon to home
    if (!navigator.standalone &&
            navigator.userAgent.match(/Safari\//) && navigator.userAgent.match(/Mobile\//)) {
        alert("iPhone과 iPod touch에서는\n"
                + "1. 아랫쪽의 \"+\"를 눌러\n"
                + "2. \"홈 화면에 추가\"를 해두시고\n"
                + "요긴하게 사용하세요 ㅋ");
    }
}
