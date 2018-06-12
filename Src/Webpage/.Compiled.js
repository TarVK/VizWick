(function(){$(function(){$(".layout").resizeContainer({vertical:true});$(".top-layout-part, .bottom-layout-part").resizeContainer({vertical:false});var quadrants=$(".top-layout-part, .bottom-layout-part").find(".quadrant");quadrants.css("transition","none");setTimeout(function(){quadrants.css("transition","")});$(".collapse").click(function(){var duration=500;$(".visualization-page").attr("id","information-collapse");$(".left-section").animate({width:10},duration);$(".right-section").animate({width:$(window).width()-25},{duration:duration,complete:function complete(){$(this).width("calc(100% - 25px)")}});updateVisualizationAreaSizes(duration)});$(".appear").click(function(){var duration=500;$(".visualization-page").attr("id","information-appear");$(".left-section").animate({width:300},duration);$(".right-section").animate({width:$(window).width()-315},{duration:duration,complete:function complete(){$(this).width("calc(100% - 315px)")}});updateVisualizationAreaSizes(duration)});$(".two-button").click(function(){$("body").attr("id","two");updateVisualizationAreaSizes(500);var bottomLeft=VisualisationHandler.getVisArea("bottom-left").getVisualisation();if(bottomLeft)bottomLeft.pause(true);var bottomRight=VisualisationHandler.getVisArea("bottom-right").getVisualisation();if(bottomRight)bottomLeft.pause(true)});$(".four-button").click(function(){$("body").attr("id","four");updateVisualizationAreaSizes(500);VisualisationHandler.getExistingVisualisations().forEach(function(vis){vis.start()})});$(".notch").click(function(){var optionPane=$(this).closest(".option-pane");var innerOptionPane=optionPane.find(".inner-option-pane");var duration=500;if(optionPane.is("#notch")){optionPane.animate({height:Math.floor(innerOptionPane.outerHeight(true))-1},{duration:duration,complete:function complete(){$(this).height("auto")}});optionPane.attr("id","options")}else{optionPane.animate({height:$(this).outerHeight(true)},duration);optionPane.attr("id","notch")}});$(".full-screen-button").click(function(){var body=$("body");if(body.is(".fullscreen")){body.attr("class",body.attr("class").replace(/fullscreen.*/g,""));VisualisationHandler.getExistingVisualisations().forEach(function(vis){vis.start()})}else{var quadrant=$(this).closest(".quadrant").attr("class").split(" ")[0];body.addClass("fullscreen").addClass("fullscreen-"+quadrant);VisualisationHandler.getExistingVisualisations().forEach(function(viz){viz.pause(true)});var viz=VisualisationHandler.getVisArea(quadrant).getVisualisation();if(viz)viz.start()}updateVisualizationAreaSizes(500)});$(".reset-button").click(function(){$(".top-layout-part, .bottom-layout-part").height("50%");$(".top-left, .top-right, .bottom-left, .bottom-right").width("50%");$(".layout, .top-layout-part, .bottom-layout-part").each(function(){this.sizes=[0.5,0.5]});updateVisualizationAreaSizes(500)});var areaNames=["top-left","top-right","bottom-left","bottom-right"];var _loop=function _loop(){var areaName=areaNames[i];VisualisationHandler.createVisArea(areaName,$("."+areaName+" .visualization-area"),function(options,visualisation){var quadrant=$("."+areaName);attachOptions(options,quadrant);if(visualisation instanceof VIZ3D.Visualisation){quadrant.find(".VR-button").show()}else{quadrant.find(".VR-button").hide()}})};for(var i=0;i<areaNames.length;i++){_loop()}var types=VisualisationHandler.getVisualisationTypes();for(var i=0;i<types.length;i++){var type=types[i].replace(/(^|\s)(.)/g,function(m,g1,g2){return g1+g2.toUpperCase()});$(".visualizations").append("<div class='visualization-button noselect' vizID='"+type+"'>"+"<div class='center'>"+type+"</div>"+"</div>")}$(".VR-button").click(function(){if(VRCamera.hasVRSupport()){var quadrant=$(this).closest(".quadrant").attr("class").split(" ")[0];var viz=VisualisationHandler.getVisArea(quadrant).getVisualisation();if(viz==VRCamera.getVisualisation()&&VRCamera.isInVR()){VRCamera.leaveVR()}else{VRCamera.setVisualisation(viz);VRCamera.enterVR()}}else{alert("This browser doesn't have WebVR support yet, please try using Firefox instead.")}});{var dragging=null;$(".visualizations").children().each(function(){$(this).mousedown(function(event){event.preventDefault();var This=$(this);var offset=This.offset();var elementCopy=This.clone().css({position:"absolute",zIndex:2000}).offset(offset);$("body").append(elementCopy);dragging={element:elementCopy,original:This,baseOffset:{left:offset.left-event.clientX,top:offset.top-event.clientY}};This.css("opacity",0);$("body").addClass("dragging");$(".quadrant").each(function(){$(this).find(".drop-indicator").height("calc(100% - "+$(this).find(".option-pane").height()+"px)")})})});$(window).mousemove(function(event){if(dragging){var offset={left:event.clientX+dragging.baseOffset.left,top:event.clientY+dragging.baseOffset.top};dragging.element.offset(offset);if(dragging.overArea)dragging.overArea.removeClass("dropHover");dragging.overArea=null;var visualisationAreas=$(".visualization-area");var size={width:dragging.element.width(),height:dragging.element.height()};for(var i=0;i<visualisationAreas.length;i++){var visualisationArea=$(visualisationAreas[i]);var vPos=visualisationArea.offset();var vSize={width:visualisationArea.width(),height:visualisationArea.height()};if(vPos.left<offset.left+size.width&&vPos.top<offset.top+size.height&&vPos.left+vSize.width>offset.left&&vPos.top+vSize.height>offset.top){var a=dragging.overArea=visualisationArea.closest(".quadrant").addClass("dropHover");break}}}}).mouseup(function(){if(dragging){$("body").removeClass("dragging");var duration=1000;var element=dragging.element;if(dragging.overArea){dragging.overArea.removeClass("dropHover");var visAreaName=dragging.overArea.find(".show-visualization");var data=visAreaName.offset();var properties=["color","background-color","border-radius","border-color","border-width","height","font-size","font"];for(var i=0;i<properties.length;i++){var prop=properties[i];var val=visAreaName.css(prop);if(val)data[prop]=val}element.css({borderStyle:"solid"}).animate(data,{duration:duration,complete:function complete(){visAreaName.stop().find(".center").text(element.text());visAreaName.css({opacity:1});element.remove()}});visAreaName.animate({opacity:0},duration);dragging.original.animate({opacity:1},duration);var areaID=dragging.overArea.closest(".quadrant").attr("class").split(" ")[0];setTimeout(function(){VisualisationHandler.setVisualisationForArea(areaID,element.attr("vizID"))},duration)}else{var original=dragging.original;var orPos=original.offset();element.animate(orPos,{duration:duration,complete:function complete(){element.remove();original.css("opacity",1)}})}dragging=null}})}VisualisationHandler.addTreeListener(function(tree){$(".stat.gereneral-height .stat-value").text(tree.getRoot().getHeight());$(".stat.gereneral-node-count .stat-value").text(tree.getRoot().getSubtreeNodeCount())})});function updateVisualizationAreaSizes(duration){var intervalID=setInterval(function(){$(".visualization-area").each(function(){var newSize={width:$(this).width(),height:$(this).height()};$(this).trigger("resize",newSize)})});setTimeout(function(){clearInterval(intervalID)},duration)}var optionTemplates={boolean:"<div class=\"option-outer\">"+"<div class=\"option toggle-type\">"+"<div class=\"option-name\">"+"test"+"</div>"+"<div class=\"option-value\">"+"<div class=\"toggle\" id=\"off\">"+"<div class=\"center\">"+"<div class=\"circle\">"+"</div>"+"</div>"+"</div>"+"</div>"+"</div>"+"</div>",button:"<div class=\"option-outer noselect\">"+"<div class=\"option button-type\">"+"<div class=\"option-name\">"+"test"+"</div>"+"</div>"+"</div>",buttonIcon:"<div class=option-button-icon-type>"+"<div class=center>"+"<div class=fa></div>"+"</div>"+"</div>"};function attachOptions(options,container){options.onOptionsChange(function(type,option){var name=option.getName();var camelCaseName=name.replace(/\s(.?)/g,function(all,g1){return g1.toUpperCase()});var description=option.getDescription()||name;var el;if(type=="create"){container.find(".no-options").hide();var optionType=option.getType();switch(optionType){case"boolean":el=$(optionTemplates.boolean);el.find(".toggle").click(function(){var on=$(this).is("#on");$(this).attr("id",on?"off":"on");option.setValue(!on)}).attr("id",option.getValue()?"on":"off");break;case"button":var icon=option.getIcon();if(icon){el=$(optionTemplates.buttonIcon);el.find(".fa").attr("class","fa fa-"+icon);option.onIconChange(function(icon){el.find(".fa").attr("class","fa-"+icon).addClass("fa")});el.click(function(){option.triggerClick()});el.addClass("option-for-"+camelCaseName);el.attr("title",description);container.find(".frequent-buttons").append(el);return}else{el=$(optionTemplates.button);option.onTextChange(function(text){el.find(".option-name").text(text)});el.click(function(){option.triggerClick()})}break;default:return;}el.addClass("option-for-"+camelCaseName);el.find(".option-name").text(name);el.attr("title",description);container.find(".option-columns").append(el)}else if(type=="delete"){container.find(".option-for-"+camelCaseName).remove()}if(container.find(".option").length==0)container.find(".no-options").show();else container.find(".no-options").hide()})};})();