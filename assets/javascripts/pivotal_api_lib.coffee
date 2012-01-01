class window.PivotalApiLib
  constructor: (@account) ->
    # constructor
    $.ajaxSetup
      timeout: 30000
      crossDomain: true
      dataType: 'xml'
      headers:
        "X-TrackerToken": @account.token.guid
  first_sync: =>
    this.get_projects()
    
  get_projects: =>
    $.ajax
      url: "https://www.pivotaltracker.com/services/v4/projects"
      success: (data, textStatus, jqXHR) =>
        projects = $.xml2json(data)
        PivotalRocketStorage.set_projects(@account, projects.project)
        tmp_data = for project in projects.project
          this.get_stories_for_project(project)
      error: (jqXHR, textStatus, errorThrown) =>
        console.debug jqXHR
        console.debug textStatus
        console.debug errorThrown
    
  get_stories_for_project: (project) =>
    $.ajax
      url: "http://www.pivotaltracker.com/services/v4/projects/" + project.id + "/stories?filter=" + encodeURIComponent("owner:" + @account.initials)
      success: (data, textStatus, jqXHR) =>
        stories = $.xml2json(data)
        console.debug stories
        
      
  update_account: =>
    $.ajax
      url: "https://www.pivotaltracker.com/services/v4/me"
      success: (data, textStatus, jqXHR) =>
        account = $.xml2json(data)
        if account.email?
          accounts = PivotalRocketStorage.get_accounts()
          new_accounts = for one_account in accounts
            if one_account.email?
              if one_account.email == account.email
                account
              else
                one_account
           PivotalRocketStorage.set_accounts(new_accounts)
    
 
 
 
# pivotal auth lib   
class window.PivotalAuthLib
  constructor: (username, password) ->
    $.ajaxSetup
      timeout: 30000
      crossDomain: true
      dataType: 'xml'
      headers: {}
      
    $.ajax
      url: "https://www.pivotaltracker.com/services/v4/me"
      username: username
      password: password
      success: (data, textStatus, jqXHR) ->
        account = $.xml2json(data)
        if account.email?
          accounts = PivotalRocketStorage.get_accounts()
          is_pushed = false
          new_accounts = for one_account in accounts
            if one_account.email?
              if one_account.email == account.email
                is_pushed = true
                account
              else
                one_account
                
          if is_pushed is false
            new_accounts.push(account)
          
          PivotalRocketStorage.set_accounts(new_accounts)
          pivotal_api_obj = new PivotalApiLib account
          pivotal_api_obj.first_sync()
      error: (jqXHR, textStatus, errorThrown) ->
        console.debug jqXHR
        console.debug textStatus
        console.debug errorThrown
 
$ ->
  #data = new PivotalAuthLib "test", "test"     