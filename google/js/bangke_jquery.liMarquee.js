(function(b){var a={init:function(c){var d={direction:"left",loop:-1,scrolldelay:0,scrollamount:50,circular:true,drag:true,runshort:true,hoverstop:true,inverthover:false,xml:false};if(c){b.extend(d,c)}return this.each(function(){var p="mouseenter";var g="mouseleave";if(d.inverthover){p="mouseleave";g="mouseenter"}var j=d.loop,l=b(this).addClass("str_wrap").data({scrollamount:d.scrollamount}),n=false;var f=l.attr("style");if(f){var o=f.split(";");var q=false;for(var h=0;h<o.length;h++){var m=b.trim(o[h]);var k=m.search(/^height/g);if(k!=-1){q=parseFloat(l.css("height"))}}}var e=function(){l.off("mouseleave");l.off("mouseenter");l.off("mousemove");l.off("mousedown");l.off("mouseup");if(!b(".str_move",l).length){l.wrapInner(b("<div>").addClass("str_move"))}var D=b(".str_move",l).addClass("str_origin"),i=D.clone().removeClass("str_origin").addClass("str_move_clone"),s=0;if(!d.hoverstop){l.addClass("noStop")}var z=function(){i.clone().css({left:"100%",right:"auto",width:D.width()}).appendTo(D);i.css({right:"100%",left:"auto",width:D.width()}).appendTo(D)};var r=function(){i.clone().css({top:"100%",bottom:"auto",height:D.height()}).appendTo(D);i.css({bottom:"100%",top:"auto",height:D.height()}).appendTo(D)};if(d.direction=="left"){l.height(D.outerHeight());if(D.width()>l.width()){var v=-D.width();if(d.circular){if(!d.xml){z();v=-(D.width()+(D.width()-l.width()))}}if(d.xml){D.css({left:l.width()})}var w=l.width(),C=0,t=function(){var F=Math.abs(v),G=(F/l.data("scrollamount"))*1000;if(parseFloat(D.css("left"))!=0){F=(F+l.width());G=(F-(l.width()-parseFloat(D.css("left"))))/l.data("scrollamount")*1000}return G},u=false,E=function(){if(j!=0){D.stop(true).animate({left:v},t(),"linear",function(){b(this).css({left:l.width()});if(j==-1){u=setTimeout(E,d.scrolldelay)}else{j--;u=setTimeout(E,d.scrolldelay)}})}};l.data({moveId:u,moveF:E});if(!d.inverthover){E()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");clearTimeout(u);D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");E()});if(d.drag){l.on("mousedown",function(H){if(d.inverthover){D.stop(true)}var J;var F=1;var I;var G=H.clientX;w=D.position().left;C=w-(H.clientX-l.offset().left);b(this).on("mousemove",function(K){n=true;I=K.clientX;if(I>G){F=1}else{F=-1}G=I;J=C+(K.clientX-l.offset().left);if(!d.circular){if(J<-D.width()&&F<0){J=l.width();w=D.position().left;C=w-(K.clientX-l.offset().left)}if(J>l.width()&&F>0){J=-D.width();w=D.position().left;C=w-(K.clientX-l.offset().left)}}else{if(J<-D.width()&&F<0){J=0;w=D.position().left;C=w-(K.clientX-l.offset().left)}if(J>0&&F>0){J=-D.width();w=D.position().left;C=w-(K.clientX-l.offset().left)}}D.stop(true).css({left:J})}).on("mouseup",function(){b(this).off("mousemove");if(d.inverthover){D.trigger("mouseenter")}setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{if(d.runshort){D.css({left:l.width()});var w=l.width(),C=0,y=function(){s=(D.width()+D.position().left)/l.data("scrollamount")*1000;return s};var A=function(){var F=-D.width();D.animate({left:F},y(),"linear",function(){b(this).css({left:l.width()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(H){if(d.inverthover){D.stop(true)}var J;var F=1;var I;var G=H.clientX;w=D.position().left;C=w-(H.clientX-l.offset().left);b(this).on("mousemove",function(K){n=true;I=K.clientX;if(I>G){F=1}else{F=-1}G=I;J=C+(K.clientX-l.offset().left);if(J<-D.width()&&F<0){J=l.width();w=D.position().left;C=w-(K.clientX-l.offset().left)}if(J>l.width()&&F>0){J=-D.width();w=D.position().left;C=w-(K.clientX-l.offset().left)}D.stop(true).css({left:J})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{l.addClass("str_static")}}}if(d.direction=="right"){l.height(D.outerHeight());l.addClass("str_right");D.css({left:-D.width(),right:"auto"});if(D.width()>l.width()){var v=l.width();D.css({left:0});if(d.circular){if(!d.xml){z();v=D.width()}}var B=0;y=function(){var F=l.width(),G=(F/l.data("scrollamount"))*1000;if(parseFloat(D.css("left"))!=0){F=(D.width()+l.width());G=(F-(D.width()+parseFloat(D.css("left"))))/l.data("scrollamount")*1000}return G};var A=function(){if(j!=0){D.animate({left:v},y(),"linear",function(){b(this).css({left:-D.width()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})}};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(H){if(d.inverthover){D.stop(true)}var J;var F=1;var I;var G=H.clientX;w=D.position().left;B=w-(H.clientX-l.offset().left);b(this).on("mousemove",function(K){n=true;I=K.clientX;if(I>G){F=1}else{F=-1}G=I;J=B+(K.clientX-l.offset().left);if(!d.circular){if(J<-D.width()&&F<0){J=l.width();w=D.position().left;B=w-(K.clientX-l.offset().left)}if(J>l.width()&&F>0){J=-D.width();w=D.position().left;B=w-(K.clientX-l.offset().left)}}else{if(J<-D.width()&&F<0){J=0;w=D.position().left;B=w-(K.clientX-l.offset().left)}if(J>0&&F>0){J=-D.width();w=D.position().left;B=w-(K.clientX-l.offset().left)}}D.stop(true).css({left:J})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{if(d.runshort){var B=0;var y=function(){s=(l.width()-D.position().left)/l.data("scrollamount")*1000;return s};var A=function(){var F=l.width();D.animate({left:F},y(),"linear",function(){b(this).css({left:-D.width()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(H){if(d.inverthover){D.stop(true)}var J;var F=1;var I;var G=H.clientX;w=D.position().left;B=w-(H.clientX-l.offset().left);b(this).on("mousemove",function(K){n=true;I=K.clientX;if(I>G){F=1}else{F=-1}G=I;J=B+(K.clientX-l.offset().left);if(J<-D.width()&&F<0){J=l.width();w=D.position().left;B=w-(K.clientX-l.offset().left)}if(J>l.width()&&F>0){J=-D.width();w=D.position().left;B=w-(K.clientX-l.offset().left)}D.stop(true).css({left:J})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{l.addClass("str_static")}}}if(d.direction=="up"){l.addClass("str_vertical");if(D.height()>l.height()){var x=-D.height();if(d.circular){if(!d.xml){r();x=-(D.height()+(D.height()-l.height()))}}if(d.xml){D.css({top:l.height()})}var B=0;y=function(){var F=Math.abs(x),G=(F/l.data("scrollamount"))*1000;if(parseFloat(D.css("top"))!=0){F=(F+l.height());G=(F-(l.height()-parseFloat(D.css("top"))))/l.data("scrollamount")*1000}return G};var A=function(){if(j!=0){D.animate({top:x},y(),"linear",function(){b(this).css({top:l.height()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})}};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(J){if(d.inverthover){D.stop(true)}var H;var F=1;var I;var G=J.clientY;strMoveTop=D.position().top;B=strMoveTop-(J.clientY-l.offset().top);b(this).on("mousemove",function(K){n=true;I=K.clientY;if(I>G){F=1}else{if(I<G){F=-1}}G=I;H=B+K.clientY-l.offset().top;if(!d.circular){if(H<-D.height()&&F<0){H=l.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}if(H>l.height()&&F>0){H=-D.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}}else{if(H<-D.height()&&F<0){H=0;strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}if(H>0&&F>0){H=-D.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}}D.stop(true).css({top:H})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{if(d.runshort){D.css({top:l.height()});var B=0;var y=function(){s=(D.height()+D.position().top)/l.data("scrollamount")*1000;return s};var A=function(){var F=-D.height();D.animate({top:F},y(),"linear",function(){b(this).css({top:l.height()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(J){if(d.inverthover){D.stop(true)}var H;var F=1;var I;var G=J.clientY;strMoveTop=D.position().top;B=strMoveTop-(J.clientY-l.offset().top);b(this).on("mousemove",function(K){n=true;I=K.clientY;if(I>G){F=1}else{if(I<G){F=-1}}G=I;H=B+K.clientY-l.offset().top;if(H<-D.height()&&F<0){H=l.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}if(H>l.height()&&F>0){H=-D.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}D.stop(true).css({top:H})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{l.addClass("str_static")}}}if(d.direction=="down"){l.addClass("str_vertical").addClass("str_down");D.css({top:-D.height(),bottom:"auto"});if(D.height()>l.height()){var x=l.height();if(d.circular){if(!d.xml){r();x=D.height()}}if(d.xml){D.css({top:-D.height()})}var B=0;y=function(){var F=l.height(),G=(F/l.data("scrollamount"))*1000;if(parseFloat(D.css("top"))!=0){F=(D.height()+l.height());G=(F-(D.height()+parseFloat(D.css("top"))))/l.data("scrollamount")*1000}return G};var A=function(){if(j!=0){D.animate({top:x},y(),"linear",function(){b(this).css({top:-D.height()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})}};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(J){if(d.inverthover){D.stop(true)}var H;var F=1;var I;var G=J.clientY;strMoveTop=D.position().top;B=strMoveTop-(J.clientY-l.offset().top);b(this).on("mousemove",function(K){n=true;I=K.clientY;if(I>G){F=1}else{if(I<G){F=-1}}G=I;H=B+K.clientY-l.offset().top;if(!d.circular){if(H<-D.height()&&F<0){H=l.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}if(H>l.height()&&F>0){H=-D.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}}else{if(H<-D.height()&&F<0){H=0;strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}if(H>0&&F>0){H=-D.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}}D.stop(true).css({top:H})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{if(d.runshort){var B=0;var y=function(){s=(l.height()-D.position().top)/l.data("scrollamount")*1000;return s};var A=function(){var F=l.height();D.animate({top:F},y(),"linear",function(){b(this).css({top:-D.height()});if(j==-1){setTimeout(A,d.scrolldelay)}else{j--;setTimeout(A,d.scrolldelay)}})};l.data({moveF:A});if(!d.inverthover){A()}if(d.hoverstop){l.on(p,function(){b(this).addClass("str_active");D.stop(true)}).on(g,function(){b(this).removeClass("str_active");b(this).off("mousemove");A()});if(d.drag){l.on("mousedown",function(J){if(d.inverthover){D.stop(true)}var H;var F=1;var I;var G=J.clientY;strMoveTop=D.position().top;B=strMoveTop-(J.clientY-l.offset().top);b(this).on("mousemove",function(K){n=true;I=K.clientY;if(I>G){F=1}else{if(I<G){F=-1}}G=I;H=B+K.clientY-l.offset().top;if(H<-D.height()&&F<0){H=l.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}if(H>l.height()&&F>0){H=-D.height();strMoveTop=D.position().top;B=strMoveTop-(K.clientY-l.offset().top)}D.stop(true).css({top:H})}).on("mouseup",function(){if(d.inverthover){D.trigger("mouseenter")}b(this).off("mousemove");setTimeout(function(){n=false},50)});return false}).on("click",function(){if(n){return false}})}else{l.addClass("no_drag")}}}else{l.addClass("str_static")}}}};if(d.xml){b.ajax({url:d.xml,dataType:"xml",success:function(s){var x=b(s).find("text");var w=x.length;for(var t=0;t<w;t++){var u=x.eq(t);var r=u.text();var v=b("<span>").text(r).appendTo(l);if(d.direction=="left"||d.direction=="right"){v.css({display:"inline-block",textAlign:"right"});if(t>0){v.css({width:l.width()+v.width()})}}if(d.direction=="down"||d.direction=="up"){v.css({display:"block",textAlign:"left"});if(t>0){v.css({paddingTop:l.height()})}}}e()}})}else{e()}l.data({ini:e,startheight:q})})},update:function(){var d=b(this);var c=b(".str_origin",d);var e=b(".str_move_clone",d);c.stop(true);e.remove();d.data("ini")()},destroy:function(){var e=b(this);var f=b(".str_move",e);var n=e.data("startheight");b(".str_move_clone",e).remove();e.off("mouseenter");e.off("mousedown");e.off("mouseup");e.off("mouseleave");e.off("mousemove");e.removeClass("noStop").removeClass("str_vertical").removeClass("str_active").removeClass("no_drag").removeClass("str_static").removeClass("str_right").removeClass("str_down");var m=e.attr("style");if(m){var c=m.split(";");for(var j=0;j<c.length;j++){var l=b.trim(c[j]);var k=l.search(/^height/g);if(k!=-1){c[j]=""}}var h=c.join(";");var g=h.replace(/;+/g,";");if(g==";"){e.removeAttr("style")}else{e.attr("style",g)}if(n){e.css({height:n})}}f.stop(true);if(f.length){var d=f.html();f.remove();e.html(d)}},pause:function(){var c=b(this);var d=b(".str_move",c);d.stop(true)},play:function(){var c=b(this);b(this).off("mousemove");c.data("moveF")()}};b.fn.liMarquee=function(c){if(a[c]){return a[c].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof c==="object"||!c){return a.init.apply(this,arguments)}else{b.error("Метод "+c+" в jQuery.liMarquee не существует")}}}})(jQuery);