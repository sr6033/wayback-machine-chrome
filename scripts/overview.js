//Used to extact the current URL
function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

var url=getUrlByParameter('url');
console.log(url);

function get_details(){
    var url=getUrlByParameter('url');
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/__wb/search/metadata?q="+url;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        var type=JSON.parse(xhr.response).type;
        document.getElementById("details").innerHTML=type;
        var captures=JSON.parse(xhr.response).captures;
        var total="";
        for (var key in captures) {
            if (captures.hasOwnProperty(key)) {
                data=captures[key];
                total=parseInt(total+(data['text/html']));
            }
        }
        document.getElementById("total_archives").innerHTML=total;
        document.getElementById("save_now").href="https://web.archive.org/save/"+url;
    }
    xhr.send(null);
}

function first_archive_details(){
    var url=getUrlByParameter('url');
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/cdx/search?url="+url+"&limit=1&output=json";
    xhr.open("GET",new_url,true);
    xhr.send(null);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        var timestamp=data[1][1];
        var date=timestamp.substring(0,4)+'/'+timestamp.substring(4,6)+'/'+timestamp.substring(6,8);
        var time=timestamp.substring(8,10)+'.'+timestamp.substring(10,12)+'.'+timestamp.substring(12,14)
        document.getElementById("first_archive_date").innerHTML=date;
        document.getElementById("first_archive_date_2").innerHTML=date;
        document.getElementById("first_archive_time").innerHTML=time;
        document.getElementById("link_first").href="https://web.archive.org/web/0/"+url;
    }
}

function recent_archive_details(){
    var url=getUrlByParameter('url');
    var xhr=new XMLHttpRequest();
    var new_url="http://web.archive.org/cdx/search?url="+url+"&limit=-1&output=json";
    xhr.open("GET",new_url,true);
    xhr.send(null);
    xhr.onload=function(){
        var data=JSON.parse(xhr.response);
        var timestamp=data[1][1];
        var date=timestamp.substring(0,4)+'/'+timestamp.substring(4,6)+'/'+timestamp.substring(6,8);
        var time=timestamp.substring(8,10)+'.'+timestamp.substring(10,12)+'.'+timestamp.substring(12,14)
        document.getElementById("recent_archive_date").innerHTML=date;

        document.getElementById("recent_archive_time").innerHTML=time;
        document.getElementById("link_recent").href="https://web.archive.org/web/2/"+url;
    }
}

function get_thumbnail(){
    var url=getUrlByParameter('url');
    url = url.replace(/^https?:\/\//,'');
    if(url.slice(-1)=='/') url=url.substring(0,url.length-1);
    var xhr=new XMLHttpRequest();
    var new_url="https://web.archive.org/thumb/"+url;
    xhr.open("GET",new_url,true);
    xhr.onload=function(){
        if(this.response){
            var img = document.createElement('img');
            var url = window.URL || window.webkitURL;
            img.src = url.createObjectURL(this.response);
            var show_thumbnail=document.getElementById("show_thumbnail");
            show_thumbnail.appendChild(img);
        }
        else{
            document.getElementById("show_thumbnail").innerHTML="Thumbnail not found";
        }
    }
    xhr.responseType = 'blob';
    xhr.send(null);
}

window.onloadFuncs = [get_details,first_archive_details,recent_archive_details,get_thumbnail];
window.onload = function(){
 for(var i in this.onloadFuncs){
  this.onloadFuncs[i]();
 }
}
