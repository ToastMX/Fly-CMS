/*
TODO:
  * Embed links werden zuerst deaktiviert (display noned maybe)
  * editor text erst nach der fliege Animation ausklappen (performance)
  * seperiere Admin Mode PHP seitig aus der Datei (performance)
  * status anzeigen (data change api)
    - wenn man den Himmel nicht gespeichert hat
    - wenn man ein Post nicht gespeichert hat
    - wenn es etwas zu publishen gibt und was genau
  * sterntitel positionierung
  * bug: beim publishen auch date im JS anpassen
  * bug: externe imgs dürfen nicht angepasst werden
  * bug: nicht unbedingt background zoomen
*/
  



$( document ).ready(function() {
    console.log("document ready");
    //data = JSON.parse(data).
    initPage();
});

function initPage() {
    console.log("initPage");
    buildDOM(data);
    oneTimeAddEventListener();
    moveStars(true);
    
    firePageFromHash();
    
    //admin session:
    setTimeout(function(){
      if (data.pass = readCookie('pass')){
        notice('login succeeded');
        adminMode = true;
        $("body").addClass("admin").removeClass("adminLogin");
        createCookie('pass',data.pass,1); //unsafe but what ever
      }
    },1000);

    if (typeof prevtimeset != 'undefined'){ // if older version
      var date = timeConverter(prevtimeset);
      $("body").append('<div class="oldversion">Das ist eine alte Version von ' + date + '<a href="?">Zur aktuellen Version</a> </div>').addClass("oldversion");
      
      toggleEditMode();
      setTimeout(function(){
        $("#togglehistory").click();

      },1500);
    }
}

var postObjects = [];

function buildDOM(data) {
    if (data.whitefont === 'true')  { $('body').addClass('whitefont'); }
    console.log('whitefont: ', data.whitefont)

    for (var id in data.posts) {
        postObjects.push(new postObj(id));
    }

}

function getPostObject(id){
    var obj = false;
    postObjects.forEach(function(item) {
        if (item.id == id) { obj = item; }
    });
    return obj;
    //this is probably not the fastest way
}


var preventClickOnStars = false;

function serverpublish(){
   //var json = JSON.stringify(data);
   if (data.pass == undefined) {
      adminLogin();
      notice("bitte einloggen");
      return false;
   }
   var json = data;   
    //console.log(json);
    // TODO: anzeigen das es etwas zum publishen gibt
    // TODO: Data versioning
   $.post( "api.php", { data: json }, function( data ) {
      console.log( data ); // John
      if (data == "SUCCESS") notice('publishing succeed');
   });
}

function firePageFromHash() {
    //page system
    if (window.location.hash.length > 2) {
        var hash = window.location.hash.substring(2,window.location.hash.length);
        console.log("firefromhash: "+ hash);
            if (getPostObject(hash)) {
               var overviewStart = false;
               showPost(hash);
            }
            else {
               var overviewStart = true;
               notice("page error");
            }
    }
    else { var overviewStart = true;}
    if (overviewStart) {
        setTimeout(function(){ showOverview(); console.log("firefromhash: overview"); }, 100);
        //warum ??
    }
}

var activePost; //current post Obj or false for overview

function showPost(id) {
    var post = getPostObject(id);
    if (!post) { return false; }
    if( activePost ) activePost.notActive();
    $(".stern-post.active").removeClass("active");
    window.location.hash = "."+id;
    activePost = post;
    $("body").addClass("onepostview").removeClass("overview");
    moveStars(true);
    post.setActive();
    document.title = id + " - Lelia Fidealia";
    return true;
}

function showOverview() {
    if( activePost ) activePost.notActive();
    activePost = false;
    $("body").addClass("overview").removeClass("onepostview");
    moveStars();
    $(".stern-post.active").removeClass("active");
    document.title = "lelia Fidelia"
}

function moveStars(hideAussen) {
    postObjects.forEach(function(item) {
        var pos = item.data.symbol.position;
        if (hideAussen) { pos = aussenkords(pos) }
        item.setPosition(pos[0],pos[1]);
        item.setSymbolWidth();
    });
}

function aussenkords(kords){ // kords as [x,y]
    x = ( kords[0] - 50 ) * 10 +50;
    y = ( kords[1] - 50 ) * 10 +50;
    return [x,y];
}


function updateStarPositionToRelativ(){
    postObjects.forEach(function(item) { item.setPosition('to','relative'); });
}

function savePositionDataByDragDrog(){
   if (window.location.hash.length > 1) {return false} //wenn nicht im overview
   updateStarPositionToRelativ();
   winY = $(window).height();
   winX = $(window).width();
   
   postObjects.forEach(function(item) {
      var y = item.dom.css("top");
      y = y.substring(0,y.length-2);
      y = (y / winY) *100;
      y = Math.round(y); //runden
      var x = item.dom.css("left");
      x = x.substring(0,x.length-2);
      x = (x / winX) *100;
      x = Math.round(x); //runden
      
      item.data.symbol.position = [x,y];
      item.dom.find(".posiX").val(x);
      item.dom.find(".posiY").val(y);
      
      var width = item.dom.children("img.stern").width();
      item.data.symbol.width = width;
      console.log(item.id+": "+x+"/"+y+" width:"+width);
   });

   //save other parameters
   // var url = $("body").css("background-image","url("+url+")");
   // data.background = url;

   notice('Himmel gespeichert');
   return true;
}


var editMode = false;
var adminMode = false;
function toggleEditMode(){
    editMode = !editMode;
    console.log("editMode");
    if (editMode) {
        $("body").addClass("editMode");
        if (activePost) { activePost.activateEditor()}
    }
    else {
        $("body").removeClass("editMode");
        if (activePost) { activePost.closeEditor()}
    }
}

stopCheckPw = false;
//aktiviert admin login fenster und logt im weiten schritt ein
function adminLogin(pw) {
   $("body").addClass("adminLogin");
   setTimeout(function(){$("#adminLogin .pw").focus();}, 200);
   if (pw == undefined) {
      return false;
   }
   //
   if (!stopCheckPw) {
          //console.log("Postrequest Start");
      pwfrage = pw;
      stopCheckPw = true;
      var request = $.post( "api.php", { data: {pass:pw,checkpw:true} }, function( antwort ) {
         console.log( antwort );
         console.log(pwfrage);
         if (antwort == "SUCCESS") {
            notice('login succeeded');
            data.pass = pwfrage;
            adminMode = true;
            $("body").removeClass("adminLogin").addClass("admin");
            createCookie('pass',data.pass,1); //unsafe but what ever
         }
         else {
            $("#adminLogin .passwortinkorrekt").fadeIn(200).fadeOut(200);
         }
         stopCheckPw = false;
         pwfrage = undefined;
      });
      //console.log(request);
   }
}

//prototpe:
function postObj(id){
    this.construct = function(){
         this.dom = $("<div></div>").addClass("stern-post").attr("id",this.id);
         var img = $("<img></div>").addClass("stern").attr("src","user_uploads/"+this.data.symbol.url);
         if (this.data.symbol.width) $(img).css("width",this.data.symbol.width);
         var toggleedit = $('<a class="toggleEdit" href="#">edit stern</a>');
         var edit = $("<div></div>").addClass("edit symbol");
         edit.append('<div class="editSizeOverviewMode"><a class="bigger" href="#">bigger</a><a class="smaller" href="#">smaller</a> </div');
         edit.append('<div class="editSizeArticleMode"><a class="bigger" href="#">bigger</a><a class="smaller" href="#">smaller</a> <br> <a class="saveArticleSymbolSize" href="#">save size in article</a>  </div>');
         edit.append('<form class="editPosi"><input class="posiX" type="text" value="'+this.data.symbol.position[0]+'"><input class="posiY" type="text" value="'+this.data.symbol.position[1]+'"><input type="submit" value="set"><form><form>');
         edit.append('<form class="editImgLink"><input class="newImgLink" type="text" value="'+this.data.symbol.url+'"><br><input type="submit" value="set"><form>');
         edit.append('<a class="deletePage" href="#">Seite löschen</a><br>');
         var titel = $("<div></div>").addClass("sterntitel").text(this.data.title);
         var textcontainer = $("<div></div>").addClass("article-container");
         textcontainer.append($("<div></div>").addClass("article-text").html(this.data.text));
         var editorcontrol = $('<div class="editorcontrol"><a class="save" href="#">Speichern</a><br><a class="reset" href="#">Reset</a></div>');
         textcontainer.append(editorcontrol);
         this.dom.append(img,toggleedit,edit,titel,textcontainer)
         $("#himmel").prepend(this.dom);
         $("#starlist").append('<a href="#.'+this.id+'">'+this.data.title+'</a> </br>');
         img.click(this.id, function(e){
            if (preventClickOnStars) {return false;}   //verhindert schwierigkeiten mit draggable 
            showPost(e.data);
            return true;
         });
         $(img).one("load", function() {
            $(this).data("OriginalAspectRatio",  $(this).width() / $(this).height() );
            //console.log ("ratioSET: " + $(this).data("OriginalAspectRatio") );
            }).each(function() { if(this.complete) $(this).load();  }); //important if image is cached
         toggleedit.click(this, function(e){ event.preventDefault();
             $(this).siblings(".edit.symbol").toggleClass("showEditBox");
             var stern = e.data.dom.children("img.stern");
             if (e.data.active && editMode && $(this).siblings(".edit.symbol").is(":visible") ) { 
              stern.draggable({
                 delay: 100,
                 scroll: false,
                 start: function( event, ui ) {
                     preventClickOnStars = true;  
                     },
                 stop: function( event, ui ) {
                     setTimeout(function(){preventClickOnStars=false},100);
                 }
              });
             }
             else {
              if (stern.is('.ui-draggable')){
                stern.draggable("destroy");
              }
             }
             
         });
         this.dom.find(".editSizeOverviewMode .bigger").click({img: img}, function(event){ event.preventDefault();
            img = event.data.img;
            img.height(img.height()*1.15).width(img.width()*1.15);
         });
         this.dom.find(".editSizeOverviewMode .smaller").click({img: img}, function(event){ event.preventDefault();
            img = event.data.img;
            img.height(img.height()*0.85).width(img.width()*0.85);
         });
         this.dom.find(".editSizeArticleMode .bigger").click({img: img}, function(event){ event.preventDefault();
            img = event.data.img;
            img.height(img.height()*1.15).width(img.width()*1.15);
         });
         this.dom.find(".editSizeArticleMode .smaller").click({img: img}, function(event){ event.preventDefault();
            img = event.data.img;
            img.height(img.height()*0.85).width(img.width()*0.85);
         });
         this.dom.find(".editSizeArticleMode .saveArticleSymbolSize").click({obj: this}, function(event){ event.preventDefault();
            sternpost = event.data.obj;
            stern =  sternpost.dom.children("img.stern");
            sternpost.data.symbol.widthArticle = stern.width();
            var y = stern.css("top");
            var x = stern.css("left");
            sternpost.data.symbol.positionArticle = [x,y];
            console.log( [x,y] );
            notice("Symbol im Articleview gespeichert");
            console.log(sternpost.data);
         });
         this.dom.children(".edit.symbol").children("form.editPosi").submit(this, function(event){ event.preventDefault();
            var post = event.data;
            var x = $(this).children(".posiX").val();
            var y = $(this).children(".posiY").val();
            post.setPosition(x,y); // 'data' is from jquery object
            console.log(x +" + "+y);
         });
         this.dom.children(".edit.symbol").children("form.editImgLink").submit(this, function(event){ event.preventDefault();
            var post = event.data;
            var url = $(this).children(".newImgLink").val();
            post.data.symbol.url = url;
            post.dom.find("img.stern").attr("src","user_uploads/"+url);
         });
         this.dom.children(".edit.symbol").children(".deletePage").click(this, function(event){event.preventDefault();
            var post = event.data;          
            delete( data.posts[post.id] );   //from data
            post.closeEditor();
            post.dom.remove();                  // from dom
            postObjects.splice(postObjects.indexOf(post),1); // from obect array
            console.log('delete');
            notice('deleted');
            showOverview();
         });
         
         $(this.dom.find(".save")).click(this, function(event){
             event.preventDefault();
             var post = event.data;
             post.saveArticle();
         });
         $(this.dom.find(".reset")).click(this, function(event){
             event.preventDefault();
             var post = event.data;
             post.resetArticle();
         });
          $(this.dom).draggable({
             delay: 100,
             cancel: ".sterntitel, .article-container, .edit",
             scroll: false,
             start: function( event, ui ) {
                 preventClickOnStars = true;  
                 },
             stop: function( event, ui ) {
                 setTimeout(function(){preventClickOnStars=false},100);
                 updateStarPositionToRelativ();
             }
          });
          this.initSlideShowEventHandler();
    }
    this.dom;
    this.id = id;
    //reference variable! to data obj
    this.data = data.posts[this.id];

    this.active;
    this.setActive = function(){
        this.active = true;
        this.dom.addClass("active");
        this.setPosition(20,10);
        

        if (this.data.symbol.widthArticle) {
          this.setSymbolWidth(this.data.symbol.widthArticle);
        }
        if (this.data.symbol.positionArticle) {
          this.dom.find("img.stern").css({
            "top": this.data.symbol.positionArticle[1],
            "left": this.data.symbol.positionArticle[0]
          });
        }
        if (editMode) {
          this.activateEditor();
        }

        this.setImgsToOptimalSize();
        setTimeout( function () { activePost.openIframe(); } , 1000 ) ;
        
    }
    this.notActive = function(){
        this.active = false;
        this.dom.find("img.stern").css({
            "top": '',
            "left": ''
          });
        this.closeIframe();
        if (this.dom.find("img.stern").is('.ui-draggable')){
                this.dom.find("img.stern").draggable("destroy");
              }
        if (editMode) {this.closeEditor();}
    }
    
    this.setSymbolWidth = function(w){
      w = Number(w);
      if (!w) {
        w = this.data.symbol.width ? this.data.symbol.width : 80;
      }
      var img = this.dom.find("img.stern");
      
      var ratio = img.data("OriginalAspectRatio");
      img.width(w);
      img.height(w/ratio);
      //console.log(this.id +" w:"+w +" height:"+w/ratio +" ratio:"+ratio);
    }
    this.setPosition = function(x,y){
         x = Number(x);
         y = Number(y);
        //ergänze fehlende werte und konvertiere zu relativen angaben
        if (typeof x != 'number') {
            winX = $(window).width();
            x = this.dom.css("left");
            x = x.substring(0,x.length-2);
            x = (x / winX) *100;
            x = Math.round(x); //runden
        }
        if (typeof y != 'number') {
            winY = $(window).height();
            y = this.dom.css("top");
            y = y.substring(0,y.length-2);
            y = (y / winY) *100;
            y = Math.round(y);
        }
        this.dom.css({
            "top": y+"%",
            "left": x+"%"
        });
    }
    
    this.activateEditor = function (){
      this.dom.children(".sterntitel").attr("contenteditable","true");
      $(this.dom.find(".article-text")).editable({
          inlineMode: true,
          placeholder: "Text einfügen",
          minHeight: 60,
          buttons: ["bold", "italic", "underline", "strikeThrough", "fontSize", "fontFamily", "color",
                    "sep",
                    "formatBlock", "blockStyle", "align", "insertOrderedList", "insertUnorderedList", "outdent", "indent",
                    "sep",
                    "createLink", "insertImage", "insertVideo", "insertHorizontalRule", "undo","redo", "html"],
           imageUploadURL: './upload_image.php',
           imageUploadParams: {pass: data.pass}, 
           imagesLoadURL: './image_list.php',
           imagesLoadParams: {pass: data.pass}, 
           imageDeleteURL: "./delete_image.php",
           imageDeleteParams: {pass: data.pass}, 
           maxFileSize: 1024 * 1024 * 300
      }).on('editable.imageError', function (e, editor, error) {
        console.log(error); 
      }).editable("enable");
      $('a[href*="froala.com"]').parent().css({
        'z-index': '-20',
        'border-width': '0'
      });
    }
    this.closeEditor = function () {
         console.log("hasownproperty close")
         if ($(this.dom.find(".article-text")).hasClass("froala-box")){ // ein bisschen eine Faule methode
            this.dom.children(".sterntitel").attr("contenteditable","false");
            $(this.dom.find(".article-text")).editable("destroy");
         }
         this.removeSlideShowEventHandler();
         this.initSlideShowEventHandler();
    }
    
    this.saveArticle = function(){
        this.closeEditor();
        this.setImgsToThumbnail();
        this.closeIframe();
        this.data.text = this.dom.find(".article-text").html();
        //console.log(this.dom.find(".article-text").html());
        this.data.title = this.dom.children(".sterntitel").text();
        this.openIframe();
        this.setImgsToOptimalSize();
        this.activateEditor();
        console.log("saved");
        notice('saved');
    }   
    this.resetArticle = function(){
        this.closeEditor();
        this.dom.find(".article-text").html(this.data.text);
        this.activateEditor();
    }

    this.setImgsToThumbnail = function () {
        //evry IMG will be thumnaild ( to s size)
        this.dom.find(".article-text").find("img").each(function(){
          $(this).attr("src",  parseImgSrc( $(this).attr("src") ,'s') );
        });
    }
    this.setImgsToOptimalSize = function () {
        this.dom.find(".article-text img").imgQualitySet('auto');
    }

    this.openIframe = function (){
      this.dom.find(".article-text iframe").each(function(){
        $(this).attr("src",$(this).attr("data-src"));
      });
    }
    this.closeIframe = function (){
      this.dom.find(".article-text iframe").each(function(){
        $(this).attr("data-src",$(this).attr("src"));
        $(this).removeAttr("src");
      });
    }

    this.initSlideShowEventHandler = function (){
      this.dom.find('.article-text').find('img').each(function() {
        $(this).addClass("slideshow-clickable");
        $(this).click( function(e){     // event handler to slideshowstart
          $(this).addClass("firstImgSelector"); //marks the clicked image as the one to show first
          var bilder = $(this).parent().find('img');
          activeSlideshow = new slideshow(bilder);
        });
      });
    }
    this.removeSlideShowEventHandler = function(){
      this.dom.find('.article-text').find('img').off('click');
    }

    this.construct();
}

function newPlanet(id) {
   if (getPostObject(id) || id == 'urltag') { id = Math.random().toString(36).substring(7); }
   var title = id;
   id = id.replace(/[^a-zA-Z0-9]+/g,'');
   var planet = {"title" : title,
                  "symbol":{
                     "url" : "sonnemondgesicht.png",
                     "position":[40,40],
                     "width":50,
                     "rotate":true},
                  "text":"Text Text"
                  };
   data.posts[id] = planet;
   postObjects.push(new postObj(id));
   showOverview();
   return getPostObject(id);
}

//slideshow prototpe:
function slideshow(selector){
    this.construct = function(){
      slideshowLayer = $("<div></div>").addClass("slideshowLayer");
      var imageBuild = $(selector);
      var slideShowObjReference = this;
      imageBuild.each( function() {
        var pic = $(this).clone();
        if (pic.hasClass("firstImgSelector")) {
          pic.attr('id',"slideshow-active-img"); //marks the clicked image as the one to show first
          $(".firstImgSelector").removeClass("firstImgSelector");
        }
        pic.removeClass().removeAttr("width height");
        pic.click(slideShowObjReference, function(e){  
          if ($(this).attr('id') == 'slideshow-active-img') $(this).parent().toggleClass("biggerSlideShowImg");
          else {
            e.data.setActive(this);
          } 
        });
        slideshowLayer.append(pic);
      });
      this.dom = slideshowLayer;
      $('body').prepend(this.dom);
      $("#slideshow-active-img").imgQualitySet('l');
      setTimeout(function(){ $(".slideshowLayer").css("opacity",1); } , 50);
      if (!$('#slideshow-active-img').length) this.dom.children().first('img').attr('id',"slideshow-active-img");
      this.keyEvents = $(document).keydown(this, function(e) {
        switch(e.which) {
            case 37: // left
              e.data.prevImg();
            break;
            case 39: // right
              e.data.nextImg();
            break;
            case 27: // esc
              e.data.destroyLayer();
            break;
            case 8: // back
              e.data.destroyLayer();
              event.preventDefault();
            break;
            default: return; // exit this handler for other keys
        }
      });
      this.dom.click(this, function(e){  e.data.destroyLayer(); }); //close on layerclick
      this.dom.children().click(function(e) {                       //but not on children click
        e.stopPropagation();
      });
      this.updateMiniPreviews();
    }

    this.dom;
    this.keyEvents;

    this.setActive = function(ele){
      this.dom.children("#slideshow-active-img").removeAttr("id");
      $(ele).attr('id',"slideshow-active-img");
      this.updateMiniPreviews();
    }

    this.nextImg = function(){
      var active = this.dom.children("#slideshow-active-img");
      if (active.next("img").length){
        this.setActive(active.next("img"));
      }
    }
    this.prevImg = function(){ 
      var active = this.dom.children("#slideshow-active-img");
      if (active.prev("img").length){
        this.setActive(active.prev("img"));
      }
    }

    this.updateMiniPreviews = function(){
      $(".miniPreview").removeClass('miniPreview miniPreviewRight miniPreviewLeft');
      var active = this.dom.children("#slideshow-active-img");
      active.next("img").addClass("miniPreview miniPreviewRight").imgQualitySet('l');;
      active.prev("img").addClass("miniPreview miniPreviewLeft").imgQualitySet('l');;
    }

    this.destroyLayer = function(){
      this.keyEvents.off(); //delets window key event handler
      this.dom.children('img').css({"max-height": '0px'});
      this.dom.fadeOut(200 ,function(){
        $(this).remove();
      });
    }

    this.construct();
}


function oneTimeAddEventListener() {
    console.log("add Event Listener");
    $("#reset").click(function(){
        showOverview();  
    });
    $("#toggleadmin").click(function(){
      if(adminMode){
         $("#admin").toggle();
      }
      else {
        adminLogin();
      }
      event.preventDefault();
    });

    $(".closeAdminLogin").click(function(){ event.preventDefault();
      $("body").removeClass("adminLogin");
    });
    $("#editMode").click(function(){
        event.preventDefault();
        toggleEditMode();
        
    });
     $("#serverpublish").click(function(){
        serverpublish();
        event.preventDefault();
    });
   $("#editoverview a.toggleEdit").click(function(){
      $(this).parent().children(".edit").toggleClass("showEditBox");
      event.preventDefault();
   });
    $("#savePosition").click(function(){
        savePositionDataByDragDrog();
        event.preventDefault();
    });
    $("#newPlanet").click(function(){
        event.preventDefault();
        $("form#setNewPlanetId").toggle();
    });
    $("#blackwhitefont").click(function(){
        event.preventDefault();
        $("body").toggleClass("whitefont");
        if ($('body').hasClass('whitefont')) {
          data.whitefont = true;
          notice('schrift weiß');
        }
        else  { 
          data.whitefont = false;
          notice('schrift schwarz');
        }
        
    });
    $("form#setNewPlanetId").submit(function(){
        event.preventDefault();
        var id = $(this).children("input.newPlanetId").val();
        if ( newPlanet(id) ) $("form#setNewPlanetId").hide();
    });
    $("#changeBackground").click(function(){
        event.preventDefault();
        $("form#setNewBackground").toggle();
    });
    $("form#setNewBackground").submit(function(){
        event.preventDefault();
        var url = $(this).children("input.newBackground").val();
        $("body").css("background-image","url("+url+")");
        data.background = url;
        $("form#setNewBackground").hide();
    });
    $( "#adminLogin" ).submit(function( event ) {
      event.preventDefault();
      adminLogin($(this).children(".pw").val());
   });
    $("#togglefiles").click(function(){
      $("#history").hide();
      $("#files").toggle();
        if ($("#files").is(':visible')){
          $.get( "image_list.php", {'pass': data.pass}, function( data ) {
            if (data.length){ 
              $("#files").empty();
              data.forEach(function(item) {
                //console.log(item);
                var fileContainer = $("<div></div>").addClass("oneImg-Container").hide();
                var link = $('<div class="filelink">'+parseImgSrc( item , 'name')+'</div>');
                link.css( {
                  "background-image": "url(" + parseImgSrc( item ) +")"
                });
                link.click({src: item}, function(e){
                    var toggleContainer = $(this).next('.oneImg-Container');
                    console.log(toggleContainer);
                    if (toggleContainer.is(':empty')){
                      $('<img>').attr('src', parseImgSrc( e.data.src, 's' ) ).appendTo(toggleContainer);
                      var sizeMenue = $("<div></div>").addClass("sizemenue");
                      sizeMenue.append('<a href="'+parseImgSrc( $(this).text(), 's' )+'" target="_blank"> S </a>');
                      sizeMenue.append('<a href="'+parseImgSrc( $(this).text(), 'm' )+'" target="_blank"> M </a>');
                      sizeMenue.append('<a href="'+parseImgSrc( $(this).text(), 'l' )+'" target="_blank"> L </a>');
                      sizeMenue.append('<a href="'+parseImgSrc( $(this).text(), 'original' )+'" target="_blank"> Ori </a>');
                      toggleContainer.append(sizeMenue);
                    }
                    toggleContainer.toggle();
                    event.preventDefault();
                });
                $("#files").append(link, fileContainer);
              });
            }
          }, "json" );
        }
      event.preventDefault();
    });
    $("#togglestarlist").click(function(){
      $("#starlist").toggle();
      event.preventDefault();
    });
    $("#togglehistory").click(function(){
      $("#files").hide();
      $("#history").toggle();
        if ($("#history").is(':visible')){
          //$("#history").append('Alte speicherstände Zurückholen folgt');
          $.get( "data_list.php", {'pass': data.pass}, function( postdata ) {
            if (postdata.length){
              $("#history").empty();
              postdata.forEach(function(item) {
                //console.log(item);
                datetime = timeConverter(item)
                var link = $('<a class="historylink" href="?t='+item+'">'+datetime+'</a>');
                if (data.date == item) link.addClass("thisoneyouseenow"); 
                $("#history").prepend(link);
              });
            }
          }, "json" );
        }
      event.preventDefault();
    });

    $("#togglerawedit").click(function(){
      if ( $(".rawedit").length > 0 ){
         $(".rawedit").remove();
      }
      else {
        var fenster = $("<div></div>").addClass("rawedit");

        var recursion = function(item){
          var tree = $("<div></div>").addClass("rawdataitem");
          if (typeof item == "string" || typeof item == "number" || typeof item == "boolean"){
            tree.append($('<textarea>'+item+'</textarea>'));
          }
          if (typeof item == "object") {
            for (var key in item) {
               if (item.hasOwnProperty(key)) {
                  var toggle = $('<a href="#"></a>')
                    .text(key)
                    .click(function(){
                      $(this).next(".rawdataitem").toggle();
                    })
                    .addClass("rawdataitemlink");
                  tree.append(toggle);
                  tree.append( recursion( item[key] ) );
               }
            }
          }
          //console.log(item);
          return tree;
        }
        var tree = recursion(data);
        tree.show().appendTo(fenster);
        $("body").append(fenster);  
        //console.log(recursion(data));
      }
      event.preventDefault();
    });
    //if hash changes // (back bottum)
    window.onhashchange = firePageFromHash;
}


function parseImgSrc(src, size){
  if (typeof src == "undefined") return false;
  if (size != 's' && size != 'm' && size != 'l' && size != 'original' && size != 'name') size = 's';
  var srcparts = src.split("/");
  src = srcparts[srcparts.length-1];
  if (size != 'name'){
    if (size != 'original') src = size+ '/'+ src;
    src = 'user_uploads/'+ src;
  }
  return src;  
}


(function( $ ) {
    //jquery function to image replace with better quality 
    // possible = ['s','m','l','original']
    $.fn.imgQualitySet = function( size ) {
        var possible = ['s','m','l','original']; // in this order
        if (possible.indexOf(size) == '-1') size = 'auto';
        // console.log(size);
        var passing = size;
        this.filter( "img:visible" ).each(function() { //go throu visible images
          var size = passing; //i dont know why
          var img = $( this ); 
          //wait if it is not possible to calculate auto resizing because image needs loading time
          if (!this.complete && size == 'auto'){
            img.one("load", function() { 
              console.log("loadevent");
              $(this).imgQualitySet('auto'); 
            });
            console.log('waitforload');
          }
          else {
            var src = img.attr('src');
            var srcparts = src.split("/");
            var name = srcparts[srcparts.length-1];
            var curSize = srcparts[srcparts.length-2];      //current Size, detectable through Folder
            if (possible.indexOf(curSize) == '-1') curSize = 'original';
            console.log("current: " + curSize, name);
            //setSize if auto
            if ( size == 'auto') {       
                var w = img.outerWidth(); 
                var h = img.outerHeight();
                var greaterAspect = w > h ? w : h;
                var size = 's';
                if (greaterAspect > 220) { size = 'm';}
                if (greaterAspect > 860) { size = 'l';}
                // if (greaterAspect > 1700) { size = 'original';}
                console.log("aspect: ", greaterAspect, w, h);
            }

            console.log(curSize, size);
            if (possible.indexOf(size) > possible.indexOf(curSize)){ // if increasing is needed (decreasing seems meaningless)
              console.log('newsize now: ' + size);
              var newImg = img.clone(true);     //also clone eventListeners
              src = name;
              if (size != 'original') src = size+ '/'+ src; //sizefolder
              src = 'user_uploads/'+ src;
              newImg.attr('src', src); // start loading
              newImg.one("load", {'oldImg': img}, function(e) {
                e.data.oldImg.attr('src',$(this).attr('src')).addClass('resized');
                console.log('newPicReplaced!!!!!');
              }).each(function() { if(this.complete) $(this).load();  }); //important for cached images
            }
          
          }

        });
 
        return this;
 
    };
 
}( jQuery ));





function notice(msg, duration) {
    var duration = duration?duration:800;
   console.log(msg);
   $("body").append('<div class="notice">'+msg+'</div>');
   setTimeout(function(){
      $(".notice").fadeOut(200, function() { $(this).remove(); });
   }
   ,800);
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp*1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = date + '. ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function plugin (){
  this.construct = function(){

  }
  this.destroy = function(){

  }

  construct();
}