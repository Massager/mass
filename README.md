# Web Messenger Application
This application shows VoxImplant IM/Presence capabilities in action. It's built using [ReactJS/Flux](http://facebook.github.io/react/) and [VoxImplant Web SDK](http://voximplant.com/docs/references/websdk/). [Gulp](http://gulpjs.com/) is used as building system. Application Roster subsystem is used for roster management - all application users will appear in the roster.

## Installation
* Create VoxImplant application and enable IM, presence and application roster in settings.
* Create a couple of users and assign it to the application.
* Clone the repository.
* Once you have the repository cloned, building the app is really easy (assuming you already have nodejs installed):
    1. Install Gulp and modules including VoxImplant Web SDK:
            npm install gulp
            npm install gulp-sass
            npm install browserify
            npm install reactify
            npm install vinyl-source-stream
            npm install voximplant-websdk
    2. Change **src/app.js** file by replacing **appname** and **accname** in `<App name="appname.accname.voximplant.com" />` with your VoxImplant application and account name accordingly
    3. Build the application:
            gulp default
    4. Open index.html in your browser
