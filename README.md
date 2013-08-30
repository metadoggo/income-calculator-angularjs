# UK Income Calculator in AngularJS

The calculator that keeps coming back is back once more, this time as a web app!

## Getting started

vagrant up

## Directory Layout

    Vagrantfile         --> Vagrant config file
    bootstrap.sh        --> bootstrap file for setting up Vagrant
    app/                --> all of the files to be used in production
      css/              --> Sass generated css files - don't edit!
        ie.css          --> ie specific stylesheet
        print.css       --> print stylesheet
        screen.css      --> default stylesheet
      img/              --> image files
      index.html        --> app layout file (the main html template file of the app)
      js/               --> javascript files
        app.js                --> application
        income-calculator.js  --> income calculator module
      lib/              --> angular and 3rd party javascript libraries
        angular/
          angular.js        --> the latest angular js
          angular.min.js    --> the latest minified angular js
          angular-*.js      --> angular add-on modules
          version.txt       --> version number
      partials/             --> angular view partials (partial html templates)
        income-calculator.html  --> income calculator view

    config/karma.conf.js        --> config file for running unit tests with Karma
    config/karma-e2e.conf.js    --> config file for running e2e tests with Karma

    scripts/            --> handy shell/js/ruby scripts
      e2e-test.sh       --> runs end-to-end tests with Karma (*nix)
      e2e-test.bat      --> runs end-to-end tests with Karma (windows)
      test.bat          --> autotests unit tests with Karma (windows)
      test.sh           --> autotests unit tests with Karma (*nix)
      web-server.js     --> simple development webserver based on node.js

    test/               --> test source files and libraries
      e2e/              -->
        runner.html     --> end-to-end test runner (open in your browser to run)
        scenarios.js    --> end-to-end specs
      lib/
        angular/                --> angular testing libraries
          angular-mocks.js      --> mocks that replace certain angular services in tests
          angular-scenario.js   --> angular's scenario (end-to-end) test runner library
          version.txt           --> version file
      unit/                     --> unit level specs/tests
        controllersSpec.js      --> specs for controllers
        directivessSpec.js      --> specs for directives
        filtersSpec.js          --> specs for filters
        servicesSpec.js         --> specs for services

    sass/
      ie.scss          --> ie specific stylesheet
      print.scss       --> print stylesheet
      screen.scss      --> default stylesheet
