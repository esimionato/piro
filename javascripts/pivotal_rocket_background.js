((function(){var a;a=typeof global!="undefined"&&global!==null?global:window,a.PivotalRocketBackground={account:null,pivotal_api_lib:null,popup:null,is_loading:!1,tmp_counter:0,update_timer:null,init:function(){if(PivotalRocketStorage.get_accounts().length>0)return PivotalRocketBackground.account==null&&(PivotalRocketBackground.account=PivotalRocketStorage.get_accounts()[0]),PivotalRocketBackground.init_autoupdate(),PivotalRocketBackground.autoupdate()},init_autoupdate:function(){var a;return a=function(){return PivotalRocketBackground.autoupdate()},PivotalRocketBackground.update_timer=setInterval(a,PivotalRocketStorage.get_update_interval()*6e4)},load_popup_view:function(){return chrome.extension.getViews({type:"popup"})[0]},init_icon_status:function(){return PivotalRocketBackground.is_loading?chrome.browserAction.setBadgeText({text:"..."}):chrome.browserAction.setBadgeText({text:""})},init_popup:function(){PivotalRocketBackground.popup==null&&(PivotalRocketBackground.popup=PivotalRocketBackground.load_popup_view());if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.init_spinner(),PivotalRocketBackground.init_bindings(),PivotalRocketStorage.get_accounts().length>0?(PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.popup.$("#loginPage, #storyInfo").hide(),PivotalRocketBackground.popup.$("#mainPage").show()):(PivotalRocketBackground.popup.$("#mainPage, #storyInfo").hide(),PivotalRocketBackground.popup.$("#loginPage").show())},init_bindings:function(){var a=this;return PivotalRocketBackground.popup.$("#ownerStories").tabs(),PivotalRocketBackground.popup.$("#requesterStories").tabs(),PivotalRocketBackground.popup.$("#loginButton").click(function(a){return PivotalRocketBackground.login_by_user()}),PivotalRocketBackground.popup.$("#loginUsername, #loginPassword").keydown(function(a){if(13===a.keyCode)return PivotalRocketBackground.login_by_user()}),PivotalRocketBackground.popup.$("#updateStories").click(function(a){return PivotalRocketBackground.autoupdate()}),PivotalRocketBackground.popup.$("#changeAccount").change(function(a){return PivotalRocketBackground.change_account()}),PivotalRocketBackground.popup.$("#selecterStoriesType").change(function(a){return PivotalRocketBackground.change_view_type()}),PivotalRocketBackground.popup.$("#storiesTabs").on("click","li.story_info",function(a){var b;return b=$(a.target),PivotalRocketBackground.bind_story_cell(b)})},change_account:function(){var a,b,c,d,e;b=PivotalRocketBackground.popup.$("#changeAccount").val(),e=PivotalRocketStorage.get_accounts();for(c=0,d=e.length;c<d;c++){a=e[c];if(parseInt(a.id)===parseInt(b))return PivotalRocketBackground.account=a,PivotalRocketBackground.init_list_stories(),!0}return!1},change_view_type:function(){var a,b;if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null)return a=PivotalRocketBackground.popup.$("#selecterStoriesType").val(),PivotalRocketBackground.popup.$("#storiesTabs div.tabs_content_block").hide(),b=PivotalRocketBackground.popup.$("#storiesTabs #"+a+"Stories"),b.show()},bind_story_cell:function(a){var b,c,d,e;e=a.data("story-id"),e||(a=a.parents("li.story_info"),e=a.data("story-id")),b=a.parent("ul").data("project-id"),c=a.parent("ul").data("requested"),c=c!=null?!0:!1,d=PivotalRocketStorage.find_story(b,e,c);if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.popup.$("#storiesTabs").find("li.story_info").removeClass("active"),a.addClass("active"),PivotalRocketBackground.show_story_info(d)},show_story_info:function(a){var b,c,d,e;if(a!=null){console.debug(a),a.notes!=null&&(a.notes.note!=null?a.notes.note.constructor!==Array?a.notes=[a.notes.note]:a.notes=a.notes.note:a.notes.constructor!==Array&&(a.notes=[a.notes])),a.tasks!=null&&(a.tasks.task!=null?a.tasks.task.constructor!==Array?a.tasks=[a.tasks.task]:a.tasks=a.tasks.task:a.tasks.constructor!==Array&&(a.tasks=[a.tasks])),a.tasks!=null&&a.tasks.length>0&&(a.tasks=function(){var b,c,e,f;e=a.tasks,f=[];for(b=0,c=e.length;b<c;b++)d=e[b],d.complete="true"===d.complete?!0:!1,f.push(d);return f}()),a.description!=null&&jQuery.isEmptyObject(a.description)&&(a.description=""),e=PivotalRocketBackground.popup.$("#story_info_template").html();if(e.length>0)return c=Hogan.compile(e),b=PivotalRocketBackground.popup.$("#storyInfo"),b.empty().html(c.render(a)),PivotalRocketBackground.popup.$("#infoPanel").hide(),b.show()}},init_spinner:function(){var a,b,c;PivotalRocketBackground.init_icon_status();if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null)return c=PivotalRocketBackground.popup.$("#spinner_template").html(),c.length>0&&(a=Hogan.compile(c),b={update_msg:chrome.i18n.getMessage("update_stories_link")},PivotalRocketBackground.is_loading&&(b.is_loading={loading_msg:chrome.i18n.getMessage("loading_msg")}),PivotalRocketBackground.popup.$("#loaderSpinner").empty().html(a.render(b))),PivotalRocketBackground.init_account_swither(),PivotalRocketBackground.change_view_type()},init_account_swither:function(){var a,b,c,d,e;if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null){PivotalRocketBackground.popup.$("#changeAccount").prop("disabled",PivotalRocketBackground.is_loading).empty(),e=PivotalRocketStorage.get_accounts();for(c=0,d=e.length;c<d;c++)a=e[c],b=a.company_name?a.company_name:a.email,PivotalRocketBackground.popup.$("#changeAccount").append("<option value='"+a.id+"'>"+b+"</option>");return PivotalRocketBackground.popup.$("#changeAccount").val(PivotalRocketBackground.account.id)}},init_list_stories:function(){var a,b,c,d,e,f,g,h,i,j,k;if(PivotalRocketBackground.popup!=null){i=PivotalRocketBackground.popup.$("#project_cell").html();if(i.length>0){a=Hogan.compile(i),h={current:[],done:[],icebox:[],rcurrent:[],rdone:[],ricebox:[]},g={current:0,done:0,icebox:0,rcurrent:0,rdone:0,ricebox:0},e=PivotalRocketStorage.get_projects(PivotalRocketBackground.account);if(e!=null)for(j=0,k=e.length;j<k;j++)c=e[j],f=PivotalRocketStorage.get_status_stories(c),f!=null&&(f.current!=null&&f.current.length>0&&(c.stories=f.current,g.current+=f.current.length,h.current.push(a.render(c))),f.done!=null&&f.done.length>0&&(c.stories=f.done,g.done+=f.done.length,h.done.push(a.render(c))),f.icebox!=null&&f.icebox.length>0&&(c.stories=f.icebox,g.icebox+=f.icebox.length,h.icebox.push(a.render(c)))),d=PivotalRocketStorage.get_status_stories(c,!0),d!=null&&(c.is_requested_by_me=!0,d.current!=null&&d.current.length>0&&(c.stories=d.current,g.rcurrent+=d.current.length,h.rcurrent.push(a.render(c))),d.done!=null&&d.done.length>0&&(c.stories=d.done,g.rdone+=d.done.length,h.rdone.push(a.render(c))),d.icebox!=null&&d.icebox.length>0&&(c.stories=d.icebox,g.ricebox+=d.icebox.length,h.ricebox.push(a.render(c))));return b="<li class='txt-center pal'>"+chrome.i18n.getMessage("no_stories_msg")+"</li>",PivotalRocketBackground.popup.$("#currentTabLabel").empty().text(""+chrome.i18n.getMessage("current_stories_tab")+" ("+g.current.toString()+")"),g.current>0?PivotalRocketBackground.popup.$("#currentStoriesList").empty().html(h.current.join("")):PivotalRocketBackground.popup.$("#currentStoriesList").empty().html(b),PivotalRocketBackground.popup.$("#doneTabLabel").empty().text(""+chrome.i18n.getMessage("done_stories_tab")+" ("+g.done.toString()+")"),g.done>0?PivotalRocketBackground.popup.$("#doneStoriesList").empty().html(h.done.join("")):PivotalRocketBackground.popup.$("#doneStoriesList").empty().html(b),PivotalRocketBackground.popup.$("#iceboxTabLabel").empty().text(""+chrome.i18n.getMessage("icebox_stories_tab")+" ("+g.icebox.toString()+")"),g.icebox>0?PivotalRocketBackground.popup.$("#iceboxStoriesList").empty().html(h.icebox.join("")):PivotalRocketBackground.popup.$("#iceboxStoriesList").empty().html(b),PivotalRocketBackground.popup.$("#currentRequesterTabLabel").empty().text(""+chrome.i18n.getMessage("current_stories_tab")+" ("+g.rcurrent.toString()+")"),g.rcurrent>0?PivotalRocketBackground.popup.$("#currentRequesterStoriesList").empty().html(h.rcurrent.join("")):PivotalRocketBackground.popup.$("#currentRequesterStoriesList").empty().html(b),PivotalRocketBackground.popup.$("#doneRequesterTabLabel").empty().text(""+chrome.i18n.getMessage("done_stories_tab")+" ("+g.rdone.toString()+")"),g.rdone>0?PivotalRocketBackground.popup.$("#doneRequesterStoriesList").empty().html(h.rdone.join("")):PivotalRocketBackground.popup.$("#doneRequesterStoriesList").empty().html(b),PivotalRocketBackground.popup.$("#iceboxRequesterTabLabel").empty().text(""+chrome.i18n.getMessage("icebox_stories_tab")+" ("+g.ricebox.toString()+")"),g.ricebox>0?PivotalRocketBackground.popup.$("#iceboxRequesterStoriesList").empty().html(h.ricebox.join("")):PivotalRocketBackground.popup.$("#iceboxRequesterStoriesList").empty().html(b)}}},initial_sync:function(a,b){var c=this;return b==null&&(b=null),PivotalRocketBackground.is_loading=!0,PivotalRocketBackground.init_spinner(),PivotalRocketBackground.pivotal_api_lib=new PivotalApiLib(a),PivotalRocketBackground.pivotal_api_lib.get_projects({success:function(c,d,e){var f,g,h,i,j,k;f=XML2JSON.parse(c,!0),h=[],f.projects!=null&&f.projects.project!=null&&(h=f.projects.project),h.constructor!==Array&&(h=[h]),PivotalRocketStorage.set_projects(a,h),PivotalRocketBackground.tmp_counter=h.length*2,k=[];for(i=0,j=h.length;i<j;i++)g=h[i],PivotalRocketBackground.pivotal_api_lib.get_stories_for_project({project:g,complete:function(a,c){PivotalRocketBackground.tmp_counter-=1;if(PivotalRocketBackground.tmp_counter<=0){PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.is_loading=!1,PivotalRocketBackground.init_spinner();if(b!=null)return b()}},success:function(a,b,c,d){var e,f;return f=[],e=XML2JSON.parse(a,!0),e.stories!=null&&e.stories.story!=null&&(f=e.stories.story),f.constructor!==Array&&(f=[f]),f!=null&&f.length>0?PivotalRocketStorage.set_stories(d,f):PivotalRocketStorage.delete_stories(d)},error:function(a,b,c){}}),k.push(PivotalRocketBackground.pivotal_api_lib.get_stories_for_project_requester({project:g,complete:function(a,c){PivotalRocketBackground.tmp_counter-=1;if(PivotalRocketBackground.tmp_counter<=0){PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.is_loading=!1,PivotalRocketBackground.init_spinner();if(b!=null)return b()}},success:function(a,b,c,d){var e,f;return f=[],e=XML2JSON.parse(a,!0),e.stories!=null&&e.stories.story!=null&&(f=e.stories.story),f.constructor!==Array&&(f=[f]),f!=null&&f.length>0?PivotalRocketStorage.set_stories(d,f,!0):PivotalRocketStorage.delete_stories(d,!0)},error:function(a,b,c){}}));return k},error:function(a,b,c){}})},save_account:function(a){var b,c,d,e;if(a.email!=null)return b=PivotalRocketStorage.get_accounts(),c=!1,d=function(){var d,f,g;g=[];for(d=0,f=b.length;d<f;d++)e=b[d],e.email!=null?e.email===a.email?(c=!0,g.push(a)):g.push(e):g.push(void 0);return g}(),c===!1&&d.push(a),PivotalRocketStorage.set_accounts(d),a},login_by_user:function(){var a,b,c;c=PivotalRocketBackground.popup.$("#loginUsername").val(),a=PivotalRocketBackground.popup.$("#loginPassword").val();if(c!=null&&a!=null)return b=new PivotalAuthLib({username:c,password:a,success:function(a,b,c){var d,e;return d=XML2JSON.parse(a,!0),d.person!=null&&(d=d.person),e=PivotalRocketBackground.popup.$("#loginCompanyName").val(),e.length>0&&(d.company_name=e),PivotalRocketBackground.account=PivotalRocketBackground.save_account(d),PivotalRocketBackground.initial_sync(PivotalRocketBackground.account),PivotalRocketBackground.init_popup()},error:function(a,b,c){if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.popup.$("#loginPage").removeClass("locading"),PivotalRocketBackground.popup.$("#loginPage .error_msg").text(c)},beforeSend:function(a,b){if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.popup.$("#loginPage").addClass("locading")}})},autoupdate:function(){if(!PivotalRocketBackground.is_loading&&PivotalRocketStorage.get_accounts().length>0)return PivotalRocketBackground.autoupdate_by_account(0)},autoupdate_by_account:function(a){var b,c;if(PivotalRocketStorage.get_accounts().length>0&&PivotalRocketStorage.get_accounts()[a]!=null)return b=PivotalRocketStorage.get_accounts()[a],a+=1,c=function(){return PivotalRocketBackground.autoupdate_by_account(a)},PivotalRocketBackground.initial_sync(b,c)}},$(function(){return PivotalRocketBackground.init()})})).call(this)
