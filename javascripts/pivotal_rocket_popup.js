((function(){var a;a=typeof global!="undefined"&&global!==null?global:window,a.PivotalRocketPopup={background_page:chrome.extension.getBackgroundPage(),init:function(){return PivotalRocketPopup.background_page.PivotalRocketBackground.popup=a,PivotalRocketPopup.background_page.PivotalRocketBackground.init_popup(),PivotalRocketPopup.init_listener()},init_listener:function(){return chrome.extension.onRequest.addListener(function(a,b,c){if(b.tab==null&&a.clippy_for_story!=null)return PivotalRocketPopup.init_clippy_for_story(a.clippy_for_story),c({})})},init_clippy_for_story:function(a){var b;return b={allowScriptAccess:"always",wmode:"opaque",scale:"noscale",quality:"high",width:110,height:15,bgcolor:"#000"},swfobject.embedSWF("images/clippy/clippy.swf","clippyStory"+a.id,110,15,"9.0.0","javascripts/vendors/swfobject/expressInstall.swf",{text:a.id},b,{}),swfobject.embedSWF("images/clippy/clippy.swf","clippyUrl"+a.id,110,15,"9.0.0","javascripts/vendors/swfobject/expressInstall.swf",{text:a.url},b,{})}},$(function(){return PivotalRocketPopup.init()})})).call(this)
