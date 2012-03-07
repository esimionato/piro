((function(){var a;a=typeof global!="undefined"&&global!==null?global:window,a.PivotalRocketStorage={set:function(a,b){return window.localStorage.setItem(a,JSON.stringify(b)),b},get:function(a){var b,c;return c=window.localStorage.getItem(a),b=c!=null?JSON.parse(c):null,b},delete_by_key:function(a){return window.localStorage.removeItem(a)},get_user_options:function(){return PivotalRocketStorage.get("user_options")||{user_role:"owner",tasks_filter:null,opened_task_box:!1,opened_comment_box:!1,last_created_project_id:0}},set_user_options:function(a){return PivotalRocketStorage.set("user_options",a)},get_role:function(){return PivotalRocketStorage.get_user_options().user_role},set_role:function(a){var b;return b=PivotalRocketStorage.get_user_options(),b.user_role=a,PivotalRocketStorage.set_user_options(b)},get_opened_by_type:function(a){return PivotalRocketStorage.get_user_options()[a]},set_opened_by_type:function(a,b){var c;return c=PivotalRocketStorage.get_user_options(),c[a]=b,PivotalRocketStorage.set_user_options(c)},get_tasks_filter:function(){return PivotalRocketStorage.get_user_options().tasks_filter},set_tasks_filter:function(a){var b;return b=PivotalRocketStorage.get_user_options(),b.tasks_filter=a,PivotalRocketStorage.set_user_options(b)},get_last_created_project_id:function(){return PivotalRocketStorage.get_user_options().last_created_project_id||0},set_last_created_project_id:function(a){var b;return b=PivotalRocketStorage.get_user_options(),b.last_created_project_id=a,PivotalRocketStorage.set_user_options(b)},get_accounts:function(){return PivotalRocketStorage.get("accounts")||[]},find_account:function(a){var b,c,d,e;e=PivotalRocketStorage.get_accounts();for(c=0,d=e.length;c<d;c++){b=e[c];if(parseInt(b.id)===parseInt(a))return b}return null},save_account:function(a){var b,c,d;return b=!1,c=function(){var c,e,f,g;f=PivotalRocketStorage.get_accounts(),g=[];for(c=0,e=f.length;c<e;c++)d=f[c],d.email!=null?d.email===a.email?(b=!0,g.push(a)):g.push(d):g.push(void 0);return g}(),b===!1&&c.push(a),PivotalRocketStorage.set_accounts(c),a},set_accounts:function(a){return PivotalRocketStorage.set("accounts",a)},sort_accounts:function(a){var b,c,d,e,f;d=[];for(e=0,f=a.length;e<f;e++)c=a[e],b=PivotalRocketStorage.find_account(c),b!=null&&d.push(b);return PivotalRocketStorage.set_accounts(d)},delete_account:function(a){var b,c,d,e,f,g,h,i,j,k;c=PivotalRocketStorage.find_account(a),f=PivotalRocketStorage.get_projects(c);if(f!=null)for(g=0,i=f.length;g<i;g++)e=f[g],PivotalRocketStorage.delete_stories(e),PivotalRocketStorage.delete_stories(e,!0);PivotalRocketStorage.delete_project(c),d=[],k=PivotalRocketStorage.get_accounts();for(h=0,j=k.length;h<j;h++)b=k[h],b.id!=null&&parseInt(b.id)!==parseInt(c.id)&&d.push(b);return PivotalRocketStorage.set_accounts(d)},set_projects:function(a,b){var c,d,e,f;return b=function(){var d,f,g;g=[];for(d=0,f=b.length;d<f;d++)e=b[d],e.memberships!=null&&(e.memberships.membership!=null?e.memberships.membership.constructor!==Array?e.memberships=[e.memberships.membership]:e.memberships=e.memberships.membership:e.memberships.constructor!==Array&&(e.memberships=[e.memberships])),e.view_conditions==null&&(c=PivotalRocketStorage.find_project(a,e.id),e.view_conditions=c!=null&&c.view_conditions!=null?c.view_conditions:{}),g.push(e);return g}(),d=PivotalRocketStorage.get_projects(a),d!=null&&d.length>0&&(f=function(){var a,b,e;e=[];for(a=0,b=d.length;a<b;a++)c=d[a],e.push(c.id);return e}(),b=PivotalRocketStorage.sort_projects_by_ids(b,f)),PivotalRocketStorage.set("projects_"+a.id,b)},sort_projects:function(a,b){var c,d;c=PivotalRocketStorage.get_projects(a);if(c!=null&&b!=null)return d=PivotalRocketStorage.sort_projects_by_ids(c,b),PivotalRocketStorage.set("projects_"+a.id,d)},sort_projects_by_ids:function(a,b){var c,d,e,f;e={};for(d=0,f=b.length;d<f;d++)c=b[d],e[parseInt(c)]=d;return a.sort(function(b,c){var d,f;return d=e[parseInt(b.id)],d==null&&(d=jQuery.inArray(b,a)),-1===d&&(d=a.length),f=e[parseInt(c.id)],f==null&&(f=jQuery.inArray(c,a)),-1===f&&(f=a.length),d-f}),a},find_project:function(a,b){var c,d,e,f;d=PivotalRocketStorage.get_projects(a);if(d!=null)for(e=0,f=d.length;e<f;e++){c=d[e];if(parseInt(c.id)===parseInt(b))return c}return null},update_project:function(a,b){var c,d,e;d=PivotalRocketStorage.get_projects(a);if(d!=null)return e=function(){var a,e,f;f=[];for(a=0,e=d.length;a<e;a++)c=d[a],parseInt(b.id)===parseInt(c.id)?f.push(b):f.push(c);return f}(),PivotalRocketStorage.set("projects_"+a.id,e)},set_options_for_project:function(a,b){var c,d;if(a!=null&&b!=null)for(c in b){d=b[c];switch(c){case"hide_project_cell":d===!0?a.view_conditions[c]=!0:delete a.view_conditions[c];break;default:a.view_conditions[c]=d}}return a},update_view_options_in_project:function(a,b,c){var d;return d=PivotalRocketStorage.find_project(a,b),c!=null&&d!=null&&(d=PivotalRocketStorage.set_options_for_project(d,c),PivotalRocketStorage.update_project(a,d)),!0},update_view_options_all_in_projects:function(a,b){var c,d,e;return d=PivotalRocketStorage.get_projects(a),e=function(){var a,e,f;f=[];for(a=0,e=d.length;a<e;a++)c=d[a],f.push(PivotalRocketStorage.set_options_for_project(c,b));return f}(),PivotalRocketStorage.set("projects_"+a.id,e)},get_projects:function(a){return PivotalRocketStorage.get("projects_"+a.id)},delete_project:function(a){return PivotalRocketStorage.delete_by_key("projects_"+a.id)},set_stories:function(a,b,c){var d;return c==null&&(c=!1),d=c?"stories_"+a.id:"requester_stories_"+a.id,PivotalRocketStorage.set(d,b)},get_stories:function(a,b){var c;return b==null&&(b=!1),c=b?"stories_"+a.id:"requester_stories_"+a.id,PivotalRocketStorage.get(c)},delete_stories:function(a,b){var c;return b==null&&(b=!1),c=b?"stories_"+a.id:"requester_stories_"+a.id,PivotalRocketStorage.delete_by_key(c)},get_status_stories:function(a,b,c){var d,e,f,g,h,i,j,k;b==null&&(b=!1),c==null&&(c=null),h=PivotalRocketStorage.get_stories(a,b);if(h!=null){d=[],e=[],f=[];for(j=0,k=h.length;j<k;j++)i=h[j],g=i,c!=null&&(g=PivotalRocketStorage.search_by_story(g,c)),g!=null&&("unscheduled"===g.current_state?(g.box_class="icebox",f.push(g)):"accepted"===g.current_state?(g.box_class="done",e.push(g)):(g.box_class="current",d.push(g)));return{current:d,done:e,icebox:f}}return null},search_by_story:function(a,b){var c;if(b.length>0&&"#"===b[0])return c=new RegExp(b.substr(1),"gi"),a.labels!=null&&a.labels.length>0&&a.labels.match(c)!=null&&a.labels.match(c).length>0?a:null;return c=new RegExp(b,"gi"),a.id!=null&&a.id.length>0&&a.id.match(c)!=null&&a.id.match(c).length>0?a:a.name!=null&&a.name.length>0&&a.name.match(c)!=null&&a.name.match(c).length>0?a:a.description!=null&&a.description.length>0&&a.description.match(c)!=null&&a.description.match(c).length>0?a:a.current_state!=null&&a.current_state.length>0&&a.current_state.match(c)!=null&&a.current_state.match(c).length>0?a:null},find_story:function(a,b,c){var d,e,f,g,h;c==null&&(c=!1),d=c?"stories_"+a:"requester_stories_"+a,e=PivotalRocketStorage.get(d);if(e!=null)for(g=0,h=e.length;g<h;g++){f=e[g];if(parseInt(f.id)===parseInt(b))return f}return null},get_update_interval:function(){return PivotalRocketStorage.get("update_interval")||10},set_update_interval:function(a){var b;return b=parseInt(a),b<10&&(b=10),b>360&&(b=360),PivotalRocketStorage.set("update_interval",b),b},get_fullscreen_mode:function(){return PivotalRocketStorage.get("fullscreen_mode")||!1},set_fullscreen_mode:function(a){return PivotalRocketStorage.set("fullscreen_mode",a)}}})).call(this);
