((function(){var a;a=typeof global!="undefined"&&global!==null?global:window,a.PivotalRocketBackground={account:null,pivotal_api_lib:null,popup:null,is_loading:!1,tmp_counter:0,tmp_action_counter:0,update_timer:null,templates:{},selected_story:null,init:function(){if(PivotalRocketStorage.get_accounts().length>0)return PivotalRocketBackground.account==null&&(PivotalRocketBackground.account=PivotalRocketStorage.get_accounts()[0]),PivotalRocketBackground.init_autoupdate(),PivotalRocketBackground.autoupdate(),PivotalRocketBackground.init_omnibox()},init_autoupdate:function(){var a;return a=function(){return PivotalRocketBackground.autoupdate()},PivotalRocketBackground.update_timer=setInterval(a,PivotalRocketStorage.get_update_interval()*6e4)},load_popup_view:function(){return chrome.extension.getViews({type:"popup"})[0]},init_icon_status:function(){return PivotalRocketBackground.is_loading?chrome.browserAction.setBadgeText({text:"..."}):chrome.browserAction.setBadgeText({text:""})},init_popup:function(){PivotalRocketBackground.popup==null&&(PivotalRocketBackground.popup=PivotalRocketBackground.load_popup_view());if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.selected_story=null,PivotalRocketBackground.init_templates(),PivotalRocketBackground.init_spinner(),PivotalRocketBackground.init_bindings(),PivotalRocketStorage.get_accounts().length>0?(PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.popup.$("#loginPage, #storyInfo").hide(),PivotalRocketBackground.popup.$("#mainPage").show()):(PivotalRocketBackground.popup.$("#mainPage, #storyInfo").hide(),PivotalRocketBackground.popup.$("#loginPage .error_msg").hide(),PivotalRocketBackground.popup.$("#loginPage").show())},init_templates:function(){if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.templates.spinner=Hogan.compile(PivotalRocketBackground.popup.$("#spinner_template").html()),PivotalRocketBackground.templates.project=Hogan.compile(PivotalRocketBackground.popup.$("#project_cell_template").html()),PivotalRocketBackground.templates.story=Hogan.compile(PivotalRocketBackground.popup.$("#story_info_template").html())},init_bindings:function(){var a=this;return PivotalRocketBackground.popup.$("#ownerStories").tabs(),PivotalRocketBackground.popup.$("#requesterStories").tabs(),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.fine_delete_link",function(a){return $(a.target).parents(".fine_delete").addClass("delete_confirm"),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.fine_delete_cancel",function(a){return $(a.target).parents(".fine_delete").removeClass("delete_confirm"),!1}),PivotalRocketBackground.popup.$("#loginButton").click(function(a){return PivotalRocketBackground.login_by_user()}),PivotalRocketBackground.popup.$("#loginUsername, #loginPassword, #loginCompanyName").keydown(function(a){if(13===a.keyCode)return PivotalRocketBackground.login_by_user()}),PivotalRocketBackground.popup.$("#mainPage").on("click","a.update_stories",function(a){return PivotalRocketBackground.autoupdate()}),PivotalRocketBackground.popup.$("#changeAccount").change(function(a){return PivotalRocketBackground.change_account()}),PivotalRocketBackground.popup.$("#selecterStoriesType").change(function(a){return PivotalRocketStorage.set_role($(a.target).val()),PivotalRocketBackground.change_view_type()}),PivotalRocketBackground.popup.$("ul.projects_stories_list").sortable({handle:"span.sort_project",axis:"y",placeholder:"ui-state-highlight",update:function(a){var b,c;c=$(a.target).parents("ul.projects_stories_list").find("li.project_cell"),b=[],c.each(function(a){return b.push($(this).data("projectId"))});if(b.length>0)return PivotalRocketStorage.sort_projects(PivotalRocketBackground.account,b)}}).disableSelection(),PivotalRocketBackground.popup.$("ul.projects_stories_list").on("click","span.toggle_project",function(a){return PivotalRocketBackground.toggle_project_cell($(a.target))}),PivotalRocketBackground.popup.$("#storiesTabs").on("click","li.story_info",function(a){var b;return b=$(a.target),PivotalRocketBackground.bind_story_cell(b)}),PivotalRocketBackground.popup.$("#mainPage").on("keyup","#searchStories",function(a){return PivotalRocketBackground.init_list_stories()}),PivotalRocketBackground.popup.$("#mainPage").on("search","#searchStories",function(a){if(0===$(a.target).val().length)return PivotalRocketBackground.init_list_stories()}),PivotalRocketBackground.popup.$("a.open_popup_button").click(function(a){return chrome.tabs.create({url:"https://www.pivotaltracker.com/"}),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.story_label",function(a){var b;return b=$(a.target).data("label"),b!=null&&PivotalRocketBackground.popup.$("#searchStories").val(b).focus().trigger("keyup"),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("change","select.change_story_state",function(a){return PivotalRocketBackground.change_story_state($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("change","select.change_story_estimate",function(a){return PivotalRocketBackground.change_story_estimate($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("click","input.add_task_button",function(a){return PivotalRocketBackground.add_task_to_story($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("keydown","input.add_task_text",function(a){if(13===a.keyCode)return PivotalRocketBackground.add_task_to_story($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.edit_task_link",function(a){return $(a.target).parents("li.task_block").addClass("editing"),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.cancel_task_link",function(a){return $(a.target).parents("li.task_block").removeClass("editing"),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","input.edit_task_button",function(a){return PivotalRocketBackground.edit_task_in_story($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("keydown","input.edit_task_text",function(a){if(13===a.keyCode)return PivotalRocketBackground.edit_task_in_story($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.delete_task_link",function(a){return PivotalRocketBackground.delete_task_in_story($(a.target)),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("change","input.task_checkbox",function(a){return PivotalRocketBackground.change_task_status($(a.target))}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.filter_all_tasks",function(a){return PivotalRocketBackground.filter_tasks_by_state($(a.target)),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.filter_completed_tasks",function(a){return PivotalRocketBackground.filter_tasks_by_state($(a.target),"completed"),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.filter_uncompleted_tasks",function(a){return PivotalRocketBackground.filter_tasks_by_state($(a.target),"uncompleted"),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","input.add_comment_button",function(a){return PivotalRocketBackground.add_comment_to_story($(a.target)),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("keydown","textarea.add_comment_text",function(a){return(a.metaKey!=null&&a.metaKey===!0||a.ctrlKey!=null&&a.ctrlKey===!0)&&a.keyCode!=null&&83===a.keyCode?(a.preventDefault(),PivotalRocketBackground.add_comment_to_story($(a.target)),!1):!0}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.delete_comment_link",function(a){return PivotalRocketBackground.delete_comment_from_story($(a.target)),!1}),PivotalRocketBackground.popup.$("#storyInfo").on("click","a.desc_link",function(a){return chrome.tabs.create({url:$(a.target).attr("href"),active:!1}),!1})},change_account:function(){var a,b,c,d,e;b=PivotalRocketBackground.popup.$("#changeAccount").val(),e=PivotalRocketStorage.get_accounts();for(c=0,d=e.length;c<d;c++){a=e[c];if(parseInt(a.id)===parseInt(b))return PivotalRocketBackground.account=a,PivotalRocketBackground.init_list_stories(),!0}return!1},change_view_type:function(){var a,b;if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null)return a=PivotalRocketStorage.get_role(),PivotalRocketBackground.popup.$("#selecterStoriesType").val(a),PivotalRocketBackground.popup.$("#storiesTabs div.tabs_content_block").hide(),b=PivotalRocketBackground.popup.$("#storiesTabs #"+a+"Stories"),b.show()},bind_story_cell:function(a){var b,c,d,e;e=a.data("storyId"),e==null&&(a=a.parents("li.story_info"),e=a.data("storyId")),b=a.parent("ul.list").data("projectId"),c=a.parent("ul.list").data("requested"),c=c!=null?!0:!1,d=PivotalRocketStorage.find_story(b,e,c);if(d!=null&&PivotalRocketBackground.popup!=null)return PivotalRocketBackground.selected_story=d.id,PivotalRocketBackground.popup.$("#storiesTabs").find("li.story_info").removeClass("active"),a.addClass("active"),PivotalRocketBackground.show_story_info(d)},show_story_info:function(a){var b,c,d,e,f,g,h,i,j,k,l,m;if(a!=null){h=PivotalRocketStorage.find_project(PivotalRocketBackground.account,a.project_id);if(h!=null&&h.point_scale!=null){a.point_scale=[],m=h.point_scale.split(",");for(i=0,k=m.length;i<k;i++)g=m[i],a.point_scale.push({point:g})}if(a.labels!=null){e=a.labels.split(","),a.labels_html={text:""};if(e.length>0){f=[];for(j=0,l=e.length;j<l;j++)d=e[j],f.push("<a href='#' class='story_label' data-label='#"+d+"'>"+d+"</a>");a.labels_html.text=f.join(", ")}}if(a.story_type)switch(a.story_type){case"feature":a.current_state!=null&&jQuery.inArray(a.current_state,["unstarted","started"])!==-1&&(a.need_estimate=!0),a.not_estimated!=null&&a.not_estimated===!0&&(a.unestimated_feature=!0),a.story_type_can_started=!0,a.story_type_many_statuses=!0;break;case"bug":a.story_type_can_started=!0,a.story_type_many_statuses=!0;break;case"chore":a.story_type_can_started=!0}return a.attachments!=null&&a.attachments.length>0&&(a.has_attachments=!0),a.tasks!=null&&a.tasks.length>0&&(a.has_tasks=!0),a.comments!=null&&a.comments.length>0&&(a.has_comments=!0,a.comments=function(){var b,d,e,f;e=a.comments,f=[];for(b=0,d=e.length;b<d;b++)c=e[b],c.author!=null&&c.author.person!=null&&c.author.person.id!=null&&parseInt(c.author.person.id)===parseInt(PivotalRocketBackground.account.id)&&(c.is_owner=!0),f.push(c);return f}()),b=PivotalRocketBackground.popup.$("#storyInfo"),b.empty().html(PivotalRocketBackground.templates.story.render(a)),PivotalRocketBackground.popup.$("#infoPanel").hide(),b.show(),PivotalRocketBackground.popup.$("#storyInfo").find("select.change_story_state").val(a.current_state),PivotalRocketBackground.popup.$("#storyInfo").find("select.change_story_estimate").val(a.estimate),PivotalRocketBackground.set_description_links(),PivotalRocketStorage.get_tasks_filter()!=null&&(PivotalRocketBackground.popup.$("#storyInfo").find("a.filter_tasks").removeClass("active"),PivotalRocketBackground.popup.$("#storyInfo").find("a.filter_"+PivotalRocketStorage.get_tasks_filter()+"_tasks").addClass("active").trigger("click")),PivotalRocketBackground.bindings_story_info(a),chrome.extension.sendRequest({clippy_for_story:{id:a.id,url:a.url}})}},set_description_links:function(){var a,b;if(PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description").length>0)return b=/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,a=PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description"),a.html(a.html().replace(b,"<a class='desc_link' href='$1'>$1</a>"))},bindings_story_info:function(a){return PivotalRocketBackground.popup.$("#storyInfo").find("h1.story_title").editable(function(b,c){var d,e;return e=PivotalRocketBackground.get_requester_or_owner_status(),d=new PivotalApiLib(PivotalRocketBackground.account),d.update_story({project_id:a.project_id,story_id:a.id,data:{story:{name:b}},success:function(c,f,g){return d.get_story({project_id:a.project_id,story_id:a.id,success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,e)},error:function(a,c,d){return PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.popup.$("#storyInfo").find("h1.story_title").text(b)}})},error:function(a,c,d){return PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.popup.$("#storyInfo").find("h1.story_title").text(b)}}),'<img src="images/spinner3.gif" alt="loading..." title="loading..." />'},{type:"text",tooltip:"Double click to edit...",indicator:'<img src="images/spinner3.gif" alt="loading..." title="loading..." />',style:"editable-input",event:"dblclick"}),PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description").editable(function(b,c){var d,e;return e=PivotalRocketBackground.get_requester_or_owner_status(),d=new PivotalApiLib(PivotalRocketBackground.account),d.update_story({project_id:a.project_id,story_id:a.id,data:{story:{description:b}},success:function(c,f,g){return d.get_story({project_id:a.project_id,story_id:a.id,success:function(a,c,d){return PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description").text(b).data({description:b}),PivotalRocketBackground.set_description_links(),PivotalRocketBackground.story_changed_with_data(a,e)},error:function(a,c,d){return PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description").text(b).data({description:b}),PivotalRocketBackground.set_description_links()}})},error:function(a,c,d){return PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description").text(b).data({description:b}),PivotalRocketBackground.set_description_links()}}),'<img src="images/spinner3.gif" alt="loading..." title="loading..." />'},{type:"textarea",submit:"OK",cancel:"Cancel",tooltip:"Double click to edit...",indicator:'<img src="images/spinner3.gif" alt="loading..." title="loading..." />',style:"editable-textarea",event:"dblclick",data:function(a,b){return PivotalRocketBackground.popup.$("#storyInfo").find("div.story_description").data("description")}}),PivotalRocketBackground.popup.$("#storyInfo").find("ul.tasks_list").sortable({handle:"span.sort_task",axis:"y",placeholder:"ui-state-highlight",update:function(b){var c,d,e,f,g,h,i,j,k,l;e=$(b.target).parents("ul.tasks_list").find("input.task_checkbox"),i=e.data("storyId"),g=e.data("projectId"),h=PivotalRocketBackground.get_requester_or_owner_status(),d=[],e.each(function(a){return d.push($(this).data("taskId"))});if(d.length>0){PivotalRocketBackground.tmp_action_counter=d.length,f=new PivotalApiLib(PivotalRocketBackground.account),l=[];for(c=0,k=d.length;c<k;c++)j=d[c],l.push(f.update_task({project_id:g,story_id:i,task_id:j,data:{task:{position:parseInt(c)+1}},complete:function(b,c){PivotalRocketBackground.tmp_action_counter--;if(PivotalRocketBackground.tmp_action_counter<=0)return f.get_story({project_id:a.project_id,story_id:a.id,success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,h)},error:function(a,b,c){return PivotalRocketBackground.init_list_stories()}})}}));return l}}}).disableSelection()},init_spinner:function(){var a;PivotalRocketBackground.init_icon_status();if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null)return a={update_msg:chrome.i18n.getMessage("update_stories_link")},PivotalRocketBackground.is_loading&&(a.is_loading={loading_msg:chrome.i18n.getMessage("loading_msg")}),PivotalRocketBackground.popup.$("#loaderSpinner").empty().html(PivotalRocketBackground.templates.spinner.render(a)),PivotalRocketBackground.init_account_swither(),PivotalRocketBackground.change_view_type()},init_account_swither:function(){var a,b,c,d,e;if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null){PivotalRocketBackground.popup.$("#changeAccount").prop("disabled",PivotalRocketBackground.is_loading).empty(),e=PivotalRocketStorage.get_accounts();for(c=0,d=e.length;c<d;c++)a=e[c],b=a.company_name?a.company_name:a.email,PivotalRocketBackground.popup.$("#changeAccount").append("<option value='"+a.id+"'>"+b+"</option>");return PivotalRocketBackground.popup.$("#changeAccount").val(PivotalRocketBackground.account.id)}},init_list_stories:function(){var a,b,c,d,e,f,g,h,i,j;if(PivotalRocketBackground.popup!=null&&PivotalRocketBackground.account!=null){d=null,PivotalRocketBackground.popup.$("#searchStories").val().length>2&&(d=PivotalRocketBackground.popup.$("#searchStories").val()),h={current:[],done:[],icebox:[],rcurrent:[],rdone:[],ricebox:[]},g={current:0,done:0,icebox:0,rcurrent:0,rdone:0,ricebox:0},e=PivotalRocketStorage.get_projects(PivotalRocketBackground.account);if(e!=null)for(i=0,j=e.length;i<j;i++)b=e[i],f=PivotalRocketStorage.get_status_stories(b,!1,d),f!=null&&(f.current!=null&&f.current.length>0&&(b.stories=f.current,b.count_of_stories=f.current.length,g.current+=b.count_of_stories,h.current.push(PivotalRocketBackground.templates.project.render(b))),f.done!=null&&f.done.length>0&&(b.stories=f.done,b.count_of_stories=f.done.length,g.done+=b.count_of_stories,h.done.push(PivotalRocketBackground.templates.project.render(b))),f.icebox!=null&&f.icebox.length>0&&(b.stories=f.icebox,b.count_of_stories=f.icebox.length,g.icebox+=b.count_of_stories,h.icebox.push(PivotalRocketBackground.templates.project.render(b)))),c=PivotalRocketStorage.get_status_stories(b,!0,d),c!=null&&(b.is_requested_by_me=!0,c.current!=null&&c.current.length>0&&(b.stories=c.current,b.count_of_stories=c.current.length,g.rcurrent+=b.count_of_stories,h.rcurrent.push(PivotalRocketBackground.templates.project.render(b))),c.done!=null&&c.done.length>0&&(b.stories=c.done,b.count_of_stories=c.done.length,g.rdone+=b.count_of_stories,h.rdone.push(PivotalRocketBackground.templates.project.render(b))),c.icebox!=null&&c.icebox.length>0&&(b.stories=c.icebox,b.count_of_stories=c.icebox.length,g.ricebox+=b.count_of_stories,h.ricebox.push(PivotalRocketBackground.templates.project.render(b))));a="<li class='txt-center pal'>"+chrome.i18n.getMessage("no_stories_msg")+"</li>",PivotalRocketBackground.popup.$("#currentTabLabel").empty().text(""+chrome.i18n.getMessage("current_stories_tab")+" ("+g.current.toString()+")"),g.current>0?PivotalRocketBackground.popup.$("#currentStoriesList").empty().html(h.current.join("")):PivotalRocketBackground.popup.$("#currentStoriesList").empty().html(a),PivotalRocketBackground.popup.$("#doneTabLabel").empty().text(""+chrome.i18n.getMessage("done_stories_tab")+" ("+g.done.toString()+")"),g.done>0?PivotalRocketBackground.popup.$("#doneStoriesList").empty().html(h.done.join("")):PivotalRocketBackground.popup.$("#doneStoriesList").empty().html(a),PivotalRocketBackground.popup.$("#iceboxTabLabel").empty().text(""+chrome.i18n.getMessage("icebox_stories_tab")+" ("+g.icebox.toString()+")"),g.icebox>0?PivotalRocketBackground.popup.$("#iceboxStoriesList").empty().html(h.icebox.join("")):PivotalRocketBackground.popup.$("#iceboxStoriesList").empty().html(a),PivotalRocketBackground.popup.$("#currentRequesterTabLabel").empty().text(""+chrome.i18n.getMessage("current_stories_tab")+" ("+g.rcurrent.toString()+")"),g.rcurrent>0?PivotalRocketBackground.popup.$("#currentRequesterStoriesList").empty().html(h.rcurrent.join("")):PivotalRocketBackground.popup.$("#currentRequesterStoriesList").empty().html(a),PivotalRocketBackground.popup.$("#doneRequesterTabLabel").empty().text(""+chrome.i18n.getMessage("done_stories_tab")+" ("+g.rdone.toString()+")"),g.rdone>0?PivotalRocketBackground.popup.$("#doneRequesterStoriesList").empty().html(h.rdone.join("")):PivotalRocketBackground.popup.$("#doneRequesterStoriesList").empty().html(a),PivotalRocketBackground.popup.$("#iceboxRequesterTabLabel").empty().text(""+chrome.i18n.getMessage("icebox_stories_tab")+" ("+g.ricebox.toString()+")"),g.ricebox>0?PivotalRocketBackground.popup.$("#iceboxRequesterStoriesList").empty().html(h.ricebox.join("")):PivotalRocketBackground.popup.$("#iceboxRequesterStoriesList").empty().html(a);if(PivotalRocketBackground.selected_story!=null)return PivotalRocketBackground.bind_story_cell(PivotalRocketBackground.popup.$("#storiesTabs").find("li.story_"+PivotalRocketBackground.selected_story))}},initial_sync:function(a,b){var c=this;return b==null&&(b=null),PivotalRocketBackground.is_loading=!0,PivotalRocketBackground.init_spinner(),PivotalRocketBackground.pivotal_api_lib=new PivotalApiLib(a),PivotalRocketBackground.pivotal_api_lib.get_projects({success:function(c,d,e){var f,g,h,i,j,k,l;f=XML2JSON.parse(c,!0);if(f.projects!=null){i=[],f.projects!=null&&f.projects.project!=null&&(i=f.projects.project),i.constructor!==Array&&(i=[i]),PivotalRocketStorage.set_projects(a,i),PivotalRocketBackground.tmp_counter=i.length*2,g=function(){PivotalRocketBackground.tmp_counter--;if(PivotalRocketBackground.tmp_counter<=0){PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.is_loading=!1,PivotalRocketBackground.init_spinner();if(b!=null)return b()}},l=[];for(j=0,k=i.length;j<k;j++)h=i[j],PivotalRocketBackground.pivotal_api_lib.get_stories_for_project({project:h,complete:function(a,b){return g()},success:function(a,b,c,d){return PivotalRocketBackground.save_stories_data_by_project(d,a)},error:function(a,b,c){}}),l.push(PivotalRocketBackground.pivotal_api_lib.get_stories_for_project({requester:!0,project:h,complete:function(a,b){return g()},success:function(a,b,c,d){return PivotalRocketBackground.save_stories_data_by_project(d,a,!0)},error:function(a,b,c){}}));return l}PivotalRocketBackground.init_list_stories(),PivotalRocketBackground.is_loading=!1,PivotalRocketBackground.init_spinner();if(b!=null)return b()},error:function(a,b,c){return PivotalRocketBackground.is_loading=!1,PivotalRocketBackground.init_spinner()}})},change_story_state:function(a){var b,c,d,e,f;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null)return d=PivotalRocketBackground.get_requester_or_owner_status(),f=a.val(),e=a.data("storyId"),c=a.data("projectId"),b=new PivotalApiLib(PivotalRocketBackground.account),b.update_story({project_id:c,story_id:e,data:{story:{current_state:f}},beforeSend:function(a,b){return PivotalRocketBackground.popup.$("#storyInfo").find("select.change_story_state[data-story-id="+e+"]").parents("div.change_story_box").addClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,d)},error:function(a,b,f){var g;g=PivotalRocketStorage.find_story(c,e,d);if(g!=null)return PivotalRocketBackground.popup.$("#storyInfo").find("select.change_story_state[data-story-id="+e+"]").val(g.current_state).parents("div.change_story_box").removeClass("loading")}})},change_story_estimate:function(a){var b,c,d,e,f;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null)return d=PivotalRocketBackground.get_requester_or_owner_status(),e=a.val(),f=a.data("storyId"),c=a.data("projectId"),b=new PivotalApiLib(PivotalRocketBackground.account),b.update_story({project_id:c,story_id:f,data:{story:{estimate:e}},beforeSend:function(a,b){return PivotalRocketBackground.popup.$("#storyInfo").find("select.change_story_estimate[data-story-id="+f+"]").parents("div.change_story_box").addClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,d)},error:function(a,b,e){var g;g=PivotalRocketStorage.find_story(c,f,d);if(g!=null)return PivotalRocketBackground.popup.$("#storyInfo").find("select.change_story_estimate[data-story-id="+f+"]").val(g.estimate).parents("div.change_story_box").removeClass("loading")}})},add_task_to_story:function(a){var b,c,d,e,f,g;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null){c=a.parents("div.add_task_block"),f=PivotalRocketBackground.get_requester_or_owner_status(),g=c.data("storyId"),e=c.data("projectId"),b=a.parents("div.add_task_block").find("input.add_task_text").val();if(g!=null&&e!=null&&b!=null&&b.length>0)return d=new PivotalApiLib(PivotalRocketBackground.account),d.add_task({project_id:e,story_id:g,data:{task:{description:b,complete:!1}},beforeSend:function(a,b){return c.addClass("loading")},success:function(a,b,h){return d.get_story({project_id:e,story_id:g,error:function(a,b,d){return c.removeClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,f)}})},error:function(a,b,d){return PivotalRocketBackground.init_list_stories(),c.removeClass("loading")}})}},edit_task_in_story:function(a){var b,c,d,e,f,g,h,i;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null){d=a.parents("li.task_block"),g=PivotalRocketBackground.get_requester_or_owner_status(),c=d.find("input.task_checkbox"),i=c.data("taskId"),h=c.data("storyId"),f=c.data("projectId"),b=d.find("input.edit_task_text").val();if(i!=null&&h!=null&&f!=null&&b!=null&&b.length>0)return e=new PivotalApiLib(PivotalRocketBackground.account),e.update_task({project_id:f,story_id:h,task_id:i,data:{task:{description:b}},beforeSend:function(a,b){return d.removeClass("editing").addClass("loading")},success:function(a,b,c){return e.get_story({project_id:f,story_id:h,error:function(a,b,c){return d.removeClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,g)}})},error:function(a,b,c){return PivotalRocketBackground.init_list_stories(),d.removeClass("loading")}})}},delete_task_in_story:function(a){var b,c,d,e,f,g,h;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null){c=a.parents("li.task_block"),f=PivotalRocketBackground.get_requester_or_owner_status(),b=c.find("input.task_checkbox"),h=b.data("taskId"),g=b.data("storyId"),e=b.data("projectId");if(h!=null&&g!=null&&e!=null)return d=new PivotalApiLib(PivotalRocketBackground.account),d.delete_task({project_id:e,story_id:g,task_id:h,beforeSend:function(a,b){return c.removeClass("editing").addClass("loading")},success:function(a,b,h){return d.get_story({project_id:e,story_id:g,error:function(a,b,d){return c.removeClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,f)}})},error:function(a,b,d){return PivotalRocketBackground.init_list_stories(),c.removeClass("loading")}})}},filter_tasks_by_state:function(a,b){var c;b==null&&(b=null);if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.popup.$("#storyInfo").find("a.filter_tasks").removeClass("active"),a.addClass("active"),c=PivotalRocketBackground.popup.$("#storyInfo").find("ul.tasks_list"),c.removeClass("completed uncompleted"),b!=null&&c.addClass(b),PivotalRocketStorage.set_tasks_filter(b)},change_task_status:function(a){var b,c,d,e,f,g;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null){e=PivotalRocketBackground.get_requester_or_owner_status(),b=a.is(":checked")?!0:!1,g=a.data("taskId"),f=a.data("storyId"),d=a.data("projectId");if(g!=null&&f!=null&&d!=null)return c=new PivotalApiLib(PivotalRocketBackground.account),c.update_task({project_id:d,story_id:f,task_id:g,data:{task:{complete:b}},success:function(a,b,g){return c.get_story({project_id:d,story_id:f,success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,e)}})},error:function(a,b,c){return PivotalRocketBackground.init_list_stories()}})}},add_comment_to_story:function(a){var b,c,d,e,f,g;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null){f=PivotalRocketBackground.get_requester_or_owner_status(),c=a.parents("div.add_comment_block"),g=c.data("storyId"),e=c.data("projectId"),b=c.find("textarea.add_comment_text").val();if(g!=null&&e!=null&&b!=null&&b.length>0)return d=new PivotalApiLib(PivotalRocketBackground.account),d.add_comment({project_id:e,story_id:g,data:{comment:{text:b}},beforeSend:function(a,b){return c.addClass("loading")},success:function(a,b,h){return d.get_story({project_id:e,story_id:g,error:function(a,b,d){return c.removeClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,f)}})},error:function(a,b,d){return PivotalRocketBackground.init_list_stories(),c.removeClass("loading")}})}},delete_comment_from_story:function(a){var b,c,d,e,f,g,h;if(PivotalRocketBackground.account!=null&&PivotalRocketBackground.popup!=null){g=PivotalRocketBackground.get_requester_or_owner_status(),b=a.data("id"),d=a.parents("li.comment_block"),c=a.parents("ul.comments_list"),h=c.data("storyId"),f=c.data("projectId");if(b!=null&&h!=null&&f!=null)return e=new PivotalApiLib(PivotalRocketBackground.account),e.delete_comment({project_id:f,story_id:h,comment_id:b,beforeSend:function(a,b){return d.addClass("loading")},success:function(a,b,c){return e.get_story({project_id:f,story_id:h,error:function(a,b,c){return d.removeClass("loading")},success:function(a,b,c){return PivotalRocketBackground.story_changed_with_data(a,g)}})},error:function(a,b,c){return PivotalRocketBackground.init_list_stories(),d.removeClass("loading")}})}},story_changed_with_data:function(a,b){var c,d,e,f,g,h,i,j;b==null&&(b=!1),h=XML2JSON.parse(a,!0),h.story!=null&&(h=h.story),e=PivotalRocketBackground.normalize_story_for_saving(h),g=PivotalRocketStorage.get_stories({id:h.project_id},b),d=[],c=!1;for(i=0,j=g.length;i<j;i++)f=g[i],parseInt(f.id)===parseInt(e.id)?(d.push(e),c=!0):d.push(f);return c===!1&&d.push(e),d.length>0&&PivotalRocketStorage.set_stories({id:h.project_id},d,b),PivotalRocketBackground.init_list_stories()},normalize_story_for_saving:function(a){var b,c,d,e,f,g;if(a.comments!=null){a.comments.comment!=null?a.comments.comment.constructor!==Array?a.comments=[a.comments.comment]:a.comments=a.comments.comment:a.comments.constructor!==Array&&(a.comments=[a.comments]),b=[],g=a.comments;for(e=0,f=g.length;e<f;e++)c=g[e],c.text!=null&&c.text.constructor===String&&b.push(c);a.comments=b}return a.attachments!=null&&(a.attachments.attachment!=null?a.attachments.attachment.constructor!==Array?a.attachments=[a.attachments.attachment]:a.attachments=a.attachments.attachment:a.attachments.constructor!==Array&&a.attachments.url!=null&&(a.attachments=[a.attachments])),a.attachments!=null&&a.attachments.type!=null&&delete a.attachments,a.tasks!=null&&(a.tasks.task!=null?a.tasks.task.constructor!==Array?a.tasks=[a.tasks.task]:a.tasks=a.tasks.task:a.tasks.constructor!==Array&&(a.tasks=[a.tasks])),a.tasks!=null&&a.tasks.length>0&&(a.tasks=function(){var b,c,e,f;e=a.tasks,f=[];for(b=0,c=e.length;b<c;b++)d=e[b],d.complete=d.complete!=null&&"true"===d.complete?!0:!1,d.project_id=a.project_id,d.story_id=a.id,f.push(d);return f}()),a.estimate==null||a.estimate!=null&&-1===parseInt(a.estimate)?(a.estimate_text="Unestimated",a.not_estimated=!0):(a.estimate_text=""+a.estimate+" points",a.is_estimated=!0),a.description!=null&&jQuery.isEmptyObject(a.description)&&(a.description=""),a},save_account:function(a){if(a.email!=null)return PivotalRocketStorage.save_account(a)},login_by_user:function(){var a,b,c;c=PivotalRocketBackground.popup.$("#loginUsername").val(),a=PivotalRocketBackground.popup.$("#loginPassword").val();if(c!=null&&a!=null)return b=new PivotalAuthLib({username:c,password:a,success:function(a,b,c){var d;return d=XML2JSON.parse(a,!0),d.person!=null&&(d=d.person),PivotalRocketBackground.account=PivotalRocketBackground.save_account(d),PivotalRocketBackground.initial_sync(PivotalRocketBackground.account),PivotalRocketBackground.init_popup()},error:function(a,b,c){if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.popup.$("#loginPage").removeClass("locading"),PivotalRocketBackground.popup.$("#loginPage .error_msg").show().text(c)},beforeSend:function(a,b){if(PivotalRocketBackground.popup!=null)return PivotalRocketBackground.popup.$("#loginPage .error_msg").hide(),PivotalRocketBackground.popup.$("#loginPage").addClass("locading")}})},autoupdate:function(){if(!PivotalRocketBackground.is_loading&&PivotalRocketStorage.get_accounts().length>0)return PivotalRocketBackground.autoupdate_by_account(0)},autoupdate_by_account:function(a){var b,c;if(PivotalRocketStorage.get_accounts().length>0&&PivotalRocketStorage.get_accounts()[a]!=null)return b=PivotalRocketStorage.get_accounts()[a],c=function(){return PivotalRocketBackground.autoupdate_by_account(a+1)},PivotalRocketBackground.initial_sync(b,c)},updated_accounts:function(){if(0===PivotalRocketStorage.get_accounts().length)return PivotalRocketBackground.account=null;if(PivotalRocketBackground.account==null)return PivotalRocketBackground.account=PivotalRocketStorage.get_accounts()[0]},updated_options:function(){return clearInterval(PivotalRocketBackground.update_timer),PivotalRocketBackground.init_autoupdate()},save_stories_data_by_project:function(a,b,c){var d,e,f,g;return c==null&&(c=!1),f=[],d=XML2JSON.parse(b,!0),d.stories!=null&&d.stories.story!=null&&(f=d.stories.story),f.constructor!==Array&&(f=[f]),f!=null&&f.length>0?(e=function(){var a,b
,c;c=[];for(a=0,b=f.length;a<b;a++)g=f[a],c.push(PivotalRocketBackground.normalize_story_for_saving(g));return c}(),PivotalRocketStorage.set_stories(a,e,c)):PivotalRocketStorage.delete_stories(a,c)},get_requester_or_owner_status:function(){var a,b;return a=PivotalRocketBackground.popup.$("#selecterStoriesType").val(),b=a!=null&&"requester"===a?!0:!1,b},toggle_project_cell:function(a){var b,c;if(PivotalRocketBackground.popup!=null)return c=a.data("projectId"),b=a.parents("li.project_cell"),b.hasClass("hide-project")?(PivotalRocketStorage.update_view_options_in_project(PivotalRocketBackground.account,c,{hide_project_cell:!1}),PivotalRocketBackground.popup.$("ul.projects_stories_list").find("li.project_"+c).removeClass("hide-project")):(PivotalRocketStorage.update_view_options_in_project(PivotalRocketBackground.account,c,{hide_project_cell:!0}),PivotalRocketBackground.popup.$("ul.projects_stories_list").find("li.project_"+c).addClass("hide-project"))},init_omnibox:function(){return chrome.omnibox.onInputCancelled.addListener(function(){return PivotalRocketBackground.default_omnibox_suggestion()}),chrome.omnibox.onInputStarted.addListener(function(){return PivotalRocketBackground.set_omnibox_suggestion("")}),chrome.omnibox.onInputChanged.addListener(function(a,b){return PivotalRocketBackground.set_omnibox_suggestion(a)}),chrome.omnibox.onInputEntered.addListener(function(a){return chrome.tabs.query({active:!0},function(b){var c,d,e,f;f=[];for(d=0,e=b.length;d<e;d++)c=b[d],f.push(chrome.tabs.update(c.id,{url:"http://www.pivotaltracker.com/story/show/"+a}));return f})})},default_omnibox_suggestion:function(){return chrome.omnibox.setDefaultSuggestion({description:"<url><match>piro:</match></url> Go by Pivotaltracker ID"})},set_omnibox_suggestion:function(a){var b;return b="<match><url>piro</url></match><dim> [</dim> ",b+=a.length>0?"<match>"+a+"</match>":"pivotal story id",b+="<dim> ]</dim>",chrome.omnibox.setDefaultSuggestion({description:b})}},$(function(){return PivotalRocketBackground.init()})})).call(this);
