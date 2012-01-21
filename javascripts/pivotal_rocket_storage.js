((function(){var a;a=typeof global!="undefined"&&global!==null?global:window,a.PivotalRocketStorage={set:function(a,b){return window.localStorage.setItem(a,JSON.stringify(b)),b},get:function(a){var b,c;return c=window.localStorage.getItem(a),b=c!=null?JSON.parse(c):null,b},delete_by_key:function(a){return window.localStorage.removeItem(a)},get_accounts:function(){return PivotalRocketStorage.get("accounts")||[]},find_account:function(a){var b,c,d,e;e=PivotalRocketStorage.get_accounts();for(c=0,d=e.length;c<d;c++){b=e[c];if(parseInt(b.id)===parseInt(a))return b}return null},save_account:function(a){var b,c,d;return b=!1,c=function(){var c,e,f,g;f=PivotalRocketStorage.get_accounts(),g=[];for(c=0,e=f.length;c<e;c++)d=f[c],d.email!=null?d.email===a.email?(b=!0,g.push(a)):g.push(d):g.push(void 0);return g}(),b===!1&&c.push(a),PivotalRocketStorage.set_accounts(c),a},set_accounts:function(a){return PivotalRocketStorage.set("accounts",a)},sort_accounts:function(a){var b,c,d,e,f;d=[];for(e=0,f=a.length;e<f;e++)c=a[e],b=PivotalRocketStorage.find_account(c),b!=null&&d.push(b);return PivotalRocketStorage.set_accounts(d)},delete_account:function(a){var b,c,d,e,f,g,h,i,j,k;c=PivotalRocketStorage.find_account(a),f=PivotalRocketStorage.get_projects(c);if(f!=null)for(g=0,i=f.length;g<i;g++)e=f[g],PivotalRocketStorage.delete_stories(e),PivotalRocketStorage.delete_stories(e,!0);PivotalRocketStorage.delete_project(c),d=[],k=PivotalRocketStorage.get_accounts();for(h=0,j=k.length;h<j;h++)b=k[h],b.id!=null&&parseInt(b.id)!==parseInt(c.id)&&d.push(b);return PivotalRocketStorage.set_accounts(d)},set_projects:function(a,b){return PivotalRocketStorage.set("projects_"+a.id,b)},get_projects:function(a){return PivotalRocketStorage.get("projects_"+a.id)},delete_project:function(a){return PivotalRocketStorage.delete_by_key("projects_"+a.id)},set_stories:function(a,b,c){var d;return c==null&&(c=!1),d=c?"stories_"+a.id:"requester_stories_"+a.id,PivotalRocketStorage.set(d,b)},get_stories:function(a,b){var c;return b==null&&(b=!1),c=b?"stories_"+a.id:"requester_stories_"+a.id,PivotalRocketStorage.get(c)},delete_stories:function(a,b){var c;return b==null&&(b=!1),c=b?"stories_"+a.id:"requester_stories_"+a.id,PivotalRocketStorage.delete_by_key(c)},get_status_stories:function(a,b,c){var d,e,f,g,h,i,j,k;b==null&&(b=!1),c==null&&(c=null),h=PivotalRocketStorage.get_stories(a,b);if(h!=null){d=[],e=[],f=[];for(j=0,k=h.length;j<k;j++)i=h[j],g=i,c!=null&&(g=PivotalRocketStorage.search_by_story(g,c)),g!=null&&("unscheduled"===g.current_state?(g.box_class="icebox",f.push(g)):"accepted"===g.current_state?(g.box_class="done",e.push(g)):(g.box_class="current",d.push(g)));return{current:d,done:e,icebox:f}}return null},search_by_story:function(a,b){var c;return c=new RegExp(b,"gi"),a.id!=null&&a.id.length>0&&a.id.match(c)!=null&&a.id.match(c).length>0?a:a.title!=null&&a.title.length>0&&a.title.match(c)!=null&&a.title.match(c).length>0?a:a.description!=null&&a.description.length>0&&a.description.match(c)!=null&&a.description.match(c).length>0?a:a.labels!=null&&a.labels.length>0&&a.labels.match(c)!=null&&a.labels.match(c).length>0?a:null},find_story:function(a,b,c){var d,e,f,g,h;c==null&&(c=!1),d=c?"stories_"+a:"requester_stories_"+a,e=PivotalRocketStorage.get(d);if(e!=null)for(g=0,h=e.length;g<h;g++){f=e[g];if(parseInt(f.id)===parseInt(b))return f}return null},get_update_interval:function(){return PivotalRocketStorage.get("update_interval")||10},set_update_interval:function(a){var b;return b=parseInt(a),b<10&&(b=10),b>360&&(b=360),PivotalRocketStorage.set("update_interval",b),b}}})).call(this)
