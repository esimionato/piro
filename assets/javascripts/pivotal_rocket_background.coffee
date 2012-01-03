root = global ? window

root.PivotalRocketBackground =
  account: null
  pivotal_api_lib: null
  # popup
  popup: null
  # notification
  is_loading: false
  
  # tmp variables
  tmp_counter: 0
  
  init: ->
    if PivotalRocketStorage.get_accounts().length > 0
      PivotalRocketBackground.account = PivotalRocketStorage.get_accounts()[0]
      PivotalRocketBackground.initial_sync()
  
  load_popup_view: ->
    chrome.extension.getViews({type:"popup"})[0]
  
  init_popup: ->
    PivotalRocketBackground.popup = PivotalRocketBackground.load_popup_view() if !PivotalRocketBackground.popup?
    if PivotalRocketBackground.popup?
      PivotalRocketBackground.init_spinner()
      PivotalRocketBackground.init_bindings()
      if PivotalRocketStorage.get_accounts().length > 0
        PivotalRocketBackground.init_list_stories()
        PivotalRocketBackground.popup.$('#loginPage').hide()
        PivotalRocketBackground.popup.$('#mainPage').show()
      else
        PivotalRocketBackground.popup.$('#mainPage').hide()
        PivotalRocketBackground.popup.$('#loginPage').show()
  
  init_bindings: ->
    PivotalRocketBackground.popup.$('#storiesTabs').tabs()
    # login  
    PivotalRocketBackground.popup.$('#login_button').click (event) =>
      username = PivotalRocketBackground.popup.$('#login_username').val()
      password = PivotalRocketBackground.popup.$('#login_password').val()
      PivotalRocketBackground.login_by_user(username, password)
    
    # update link        
    PivotalRocketBackground.popup.$('#updateStories').click (event) =>
      PivotalRocketBackground.initial_sync()
  
  init_spinner: ->
    if PivotalRocketBackground.popup?
      template = PivotalRocketBackground.popup.$('#spinner_template').html()
      if template.length > 0
        compiledTemplate = Hogan.compile(template)
        hash_data = {
          update_msg: chrome.i18n.getMessage("update_stories_link")
        }
        if PivotalRocketBackground.is_loading
          hash_data.is_loading = {
            loading_msg: chrome.i18n.getMessage("loading_msg")
          }
      
        PivotalRocketBackground.popup.$('#loaderSpinner').html(compiledTemplate.render(hash_data))
  
  init_list_stories: ->
    if PivotalRocketBackground.popup?
      template = PivotalRocketBackground.popup.$('#project_cell').html()
      if template.length > 0
        compiledTemplate = Hogan.compile(template)
        stories_list = {current: [], done: [], icebox: [], rcurrent: [], rdone: [], ricebox: []}
        stories_count = {current: 0, done: 0, icebox: 0, rcurrent: 0, rdone: 0, ricebox: 0}
        stored_projects = PivotalRocketStorage.get_projects(PivotalRocketBackground.account)
        for project in stored_projects
          stored_stories = PivotalRocketStorage.get_status_stories(project)
          if stored_stories?
            if stored_stories.current? && stored_stories.current.length > 0
              project.stories = stored_stories.current
              stories_count.current += stored_stories.current.length
              stories_list.current.push(compiledTemplate.render(project))
            if stored_stories.done? && stored_stories.done.length > 0
              project.stories = stored_stories.done
              stories_count.done += stored_stories.done.length
              stories_list.done.push(compiledTemplate.render(project))
            if stored_stories.icebox? && stored_stories.icebox.length > 0
              project.stories = stored_stories.icebox
              stories_count.icebox += stored_stories.icebox.length
              stories_list.icebox.push(compiledTemplate.render(project))

          rstored_stories = PivotalRocketStorage.get_status_stories(project, true)
          if rstored_stories?
            if rstored_stories.current? && rstored_stories.current.length > 0
              project.stories = rstored_stories.current
              stories_count.rcurrent += rstored_stories.current.length
              stories_list.rcurrent.push(compiledTemplate.render(project))
            if rstored_stories.done? && rstored_stories.done.length > 0
              project.stories = rstored_stories.done
              stories_count.rdone += rstored_stories.done.length
              stories_list.rdone.push(compiledTemplate.render(project))
            if rstored_stories.icebox? && rstored_stories.icebox.length > 0
              project.stories = rstored_stories.icebox
              stories_count.ricebox += rstored_stories.icebox.length
              stories_list.ricebox.push(compiledTemplate.render(project))

        no_stories_msg = "<li class='empty'>#{chrome.i18n.getMessage("no_stories_msg")}</li>"
        # owner
        PivotalRocketBackground.popup.$('#currentTabLabel').text("#{chrome.i18n.getMessage("current_stories_tab")} (#{stories_count.current.toString()})")
        if stories_count.current > 0
          PivotalRocketBackground.popup.$('#currentStoriesList').html(stories_list.current.join(""))
        else
          PivotalRocketBackground.popup.$('#currentStoriesList').html(no_stories_msg)
        PivotalRocketBackground.popup.$('#doneTabLabel').text("#{chrome.i18n.getMessage("done_stories_tab")} (#{stories_count.done.toString()})")
        if stories_count.done > 0
          PivotalRocketBackground.popup.$('#doneStoriesList').html(stories_list.done.join(""))
        else
          PivotalRocketBackground.popup.$('#doneStoriesList').html(no_stories_msg)
        PivotalRocketBackground.popup.$('#iceboxTabLabel').text("#{chrome.i18n.getMessage("icebox_stories_tab")} (#{stories_count.icebox.toString()})")
        if stories_count.icebox > 0
          PivotalRocketBackground.popup.$('#iceboxStoriesList').html(stories_list.icebox.join(""))
        else
          PivotalRocketBackground.popup.$('#iceboxStoriesList').html(no_stories_msg)

        # requester
        PivotalRocketBackground.popup.$('#currentRequesterTabLabel').text("#{chrome.i18n.getMessage("current_stories_tab")} (#{stories_count.rcurrent.toString()})")
        if stories_count.rcurrent > 0
          PivotalRocketBackground.popup.$('#currentRequesterStoriesList').html(stories_list.rcurrent.join(""))
        else
          PivotalRocketBackground.popup.$('#currentRequesterStoriesList').html(no_stories_msg)
        PivotalRocketBackground.popup.$('#doneRequesterTabLabel').text("#{chrome.i18n.getMessage("done_stories_tab")} (#{stories_count.rdone.toString()})")
        if stories_count.rdone > 0
          PivotalRocketBackground.popup.$('#doneRequesterStoriesList').html(stories_list.rdone.join(""))
        else
          PivotalRocketBackground.popup.$('#doneRequesterStoriesList').html(no_stories_msg)
        PivotalRocketBackground.popup.$('#iceboxRequesterTabLabel').text("#{chrome.i18n.getMessage("icebox_stories_tab")} (#{stories_count.ricebox.toString()})")
        if stories_count.ricebox > 0
          PivotalRocketBackground.popup.$('#iceboxRequesterStoriesList').html(stories_list.ricebox.join(""))
        else
          PivotalRocketBackground.popup.$('#iceboxRequesterStoriesList').html(no_stories_msg)
      
  initial_sync: ->
    PivotalRocketBackground.is_loading = true
    PivotalRocketBackground.init_spinner()
    
    PivotalRocketBackground.pivotal_api_lib = new PivotalApiLib(PivotalRocketBackground.account)
    PivotalRocketBackground.pivotal_api_lib.get_projects
      success: (data, textStatus, jqXHR) ->
        allprojects = XML2JSON.parse(data, true)
        projects = []
        projects = allprojects.projects.project if allprojects.projects? && allprojects.projects.project?
        projects = [projects] if projects.constructor != Array
        PivotalRocketStorage.set_projects(PivotalRocketBackground.account, projects)
        PivotalRocketBackground.tmp_counter = projects.length * 2
        for project in projects
          PivotalRocketBackground.pivotal_api_lib.get_stories_for_project
            project: project
            complete: (jqXHR, textStatus) ->
              PivotalRocketBackground.tmp_counter -= 1
              if PivotalRocketBackground.tmp_counter <= 0
                PivotalRocketBackground.init_list_stories()
                PivotalRocketBackground.is_loading = false
                PivotalRocketBackground.init_spinner()
            success: (data, textStatus, jqXHR, project) ->
              stories = []
              allstories = XML2JSON.parse(data, true)
              stories = allstories.stories.story if allstories.stories? && allstories.stories.story?
              stories = [stories] if stories.constructor != Array
              if stories.length > 0
                PivotalRocketStorage.set_stories(project, stories)
              else
                PivotalRocketStorage.delete_stories(project)
            error: (jqXHR, textStatus, errorThrown) ->
              # error
              
          PivotalRocketBackground.pivotal_api_lib.get_stories_for_project_requester
            project: project
            complete: (jqXHR, textStatus) ->
              PivotalRocketBackground.tmp_counter -= 1
              if PivotalRocketBackground.tmp_counter <= 0
                PivotalRocketBackground.init_list_stories()
                PivotalRocketBackground.is_loading = false
                PivotalRocketBackground.init_spinner()
            success: (data, textStatus, jqXHR, project) ->
              stories = []
              allstories = XML2JSON.parse(data, true)
              stories = allstories.stories.story if allstories.stories? && allstories.stories.story?
              stories = [stories] if stories.constructor != Array
              if stories.length > 0
                PivotalRocketStorage.set_stories(project, stories, true)
              else
                PivotalRocketStorage.delete_stories(project, true)
            error: (jqXHR, textStatus, errorThrown) ->
              # error
            
      error: (jqXHR, textStatus, errorThrown) ->
        # error
                
  save_account: (account) ->
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
      account
  
  login_by_user: (username, password) ->
    if username? && password?
      pivotal_auth_lib = new PivotalAuthLib
        username: username
        password: password
        success: (data, textStatus, jqXHR) ->
          account = XML2JSON.parse(data, true)
          account = account.person if account.person?
          PivotalRocketBackground.account = PivotalRocketBackground.save_account(account)
          PivotalRocketBackground.initial_sync()
          
        error: (jqXHR, textStatus, errorThrown) ->
          # error


$ ->
  PivotalRocketBackground.init()