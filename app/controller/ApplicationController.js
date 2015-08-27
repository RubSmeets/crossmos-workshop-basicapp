/**
 * The main applicationController provides a connection between
 * the view components (widgets) and the underlying data models.
 * Actions from the user are captured here and translated into
 * data request, view manipulation and execution of application
 * logic.
 */
Ext.define('PropertyCrossWorkshopApp.controller.ApplicationController', {
    extend: 'Ext.app.Controller',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'PropertyCrossWorkshopApp.view.ResultList',
        'PropertyCrossWorkshopApp.view.ResultDetails',
        'PropertyCrossWorkshopApp.view.About',
        'Ext.device.Geolocation',
        'Ext.MessageBox'
    ],


    /*---------------------------------------------------------*/
    //Config object of the controller
    /*---------------------------------------------------------*/
    config: {
        //List of (view)component references mapped to controller variable name
        refs: {
            main: 'mainview',
            home: 'home',
            mainAppBar: '#win8-appbar',
            faveButton: '#faveButton',
            resultList: 'resultlist',
            favesList: 'resultlist',
            resultdetails: 'resultdetails',
            locationField: '#placeNameText',
            goButton: '#goButton',
            listFavesButton: '#listFavesButton',
            errorMessage: '#errorMessage',
            suggestedLocations: '#suggestedLocations',
            listTitleLabel: '#listTitleLabel',
            aboutButton: '#aboutButton',
            aboutPage: 'aboutPage',
            locationButton: '#currLocationButton',
            previousSearches: '#previousSearches'
        },

        //List of events with their associated handler
        control: {
            main: {
                push: 'onMainPush',
                pop: 'onMainPop'
            },
            home: {
                show: 'resetHome'
            },
            goButton: {
                tap: 'onGo'
            },
            locationField: {
                action: 'onLocationEnter'
            },
            resultList: {
                itemtap: 'onResultSelect'
            },
            suggestedLocations: {
                itemtap: 'onSuggestedLocations'
            },
            listFavesButton: {
                tap: 'onListFaves'
            },
            faveButton: {
                tap: 'onFaveTap'
            },
            aboutButton: {
                tap: 'onAboutTap'
            },
            locationButton: {
                tap: 'onLocationTap'
            },
            previousSearches: {
                itemtap: 'onPreviousSearches'
            }
        }
    },


    /*---------------------------------------------------------*/
    //Initialisation event handler for the controller is called
    //at boot time before application "launch"
    /*---------------------------------------------------------*/
    init: function() {
        /* pop a view when the back button is pressed
         note: if it's already at the root it's a noop
         The event is dispatched to the window every time
         the active history entry changes (hardware back
         button or calling history.back()) */
        var that = this;
        window.onpopstate = function() {
            that.getMain().pop();
        };

        //Custom internal variable used by the controller for navigation history tracking
        this.backStackDepth = 0;
    },


    /*---------------------------------------------------------*/
    //Custom functions used by the event handlers
    /*---------------------------------------------------------*/

    //Disable the backbutton event listener when reaching the root view
    updateBackStackDepth: function(increment) {
        this.backStackDepth += increment;
        document.removeEventListener("backbutton", this.onBack, false);
        if (this.backStackDepth > 0) {
            document.addEventListener("backbutton", this.onBack, false)
        } else if(this.backStackDepth === 0) {
            //Show listFavesButton
            this.showButton(this.getListFavesButton());
            this.showAppBar();

            //Show about button
            this.showButton(this.getAboutButton());
        }
    },

    //Function that performs search with search criteria specified in the search textfield
    performSearch: function(elt) {
        this.resetHome();
        var values = elt.up('formpanel').getValues();
        this.makeRequest(values);
    },

    //Function to generate/execute the JSONP request by gathering the desired information
    makeRequest: function(values) {
        var that = this;

        var store = Ext.getStore('results');

        var proxy = store.getProxy();
        var extraParams = proxy.getExtraParams();
        store.currentPage = 1;
        //Note: place_name takes precedence if defined and non-null..
        extraParams.place_name = values.place_name;
        extraParams.centre_point = values.centre_point && this.formatCoord(values.centre_point);

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Loading...',
            indicator: true
        });

        //need to handle initial request to see if it's valid, either show error or go to results view
        store.load({
            callback: function (records, operation, success) {
                Ext.Viewport.setMasked(false);
                if (success) {
                    that.onFirstResult(operation.getResponse(), values, store);
                }
                else
                {
                    that.getErrorMessage().setHtml("An error occurred while searching. Please check your network connection and try again.");
                    that.getErrorMessage().show();
                }
            }
        });
    },

    //Function that analyse the JSONP-request response (response codes are defined by http://www.nestoria.co.uk/help/api)
    onFirstResult: function (result, values, store) {
        var that = this,
            response = result.response,
            responseCode = response.application_response_code;

        //one unambiguous location..
        if(responseCode === "100" || /* one unambiguous location */
            responseCode === "101" || /* best guess location */
            responseCode === "110" /* large location, 1000 matches max */) {
            //place_name is both display and search name for previous searches

            if(response.listings.length === 0) {
                that.getErrorMessage().setHtml("There were no properties found for the given location.");
                that.getErrorMessage().show();
            } else {
                that.addToPreviousSearches(response.locations[0].place_name, values.centre_point, response.locations[0].long_title, response.total_results);
                that.goToResultsList(store);
            }
        } else if(responseCode === "201" || /* unknown location */
            responseCode === "210" /* coordinate error */) {
            that.getErrorMessage().setHtml("The location given was not recognised.");
            that.getErrorMessage().show();
        } else {
            //have a go at displaying "did you mean" locations
            if(response.locations) {
                var suggestedLocationsList = that.getSuggestedLocations();
                suggestedLocationsList.getStore().setData(response.locations);

                that.getListTitleLabel().setHtml("Please select a location below:");
                that.getListTitleLabel().show();

                //Hide the previous searches when suggestions are shown
                that.getPreviousSearches().hide();
                suggestedLocationsList.show();
            } else {
                that.getErrorMessage().setHtml("The location given was not recognised.");
                that.getErrorMessage().show();
            }
        }
    },

    //Function that tries to add the current successful search to the searches store
    addToPreviousSearches: function(placeName, centre_point, displayName, totalResults) {
        var searches = Ext.getStore('searches');

        // Place name is well defined even when searching for location - still use that as a key

        //sort out previous searches..
        var oldModel = searches.findRecord('place_name', placeName, 0, false, true, true);
        if(oldModel){
            searches.remove(oldModel);
        } else {
            var numResults = searches.getData().length;
            if(numResults >= 4){
                searches.removeAt(numResults - 1);
            }
        }
        searches.add({
            display_name: centre_point ? this.formatCoord(centre_point, 2) : displayName,
            place_name: placeName,
            centre_point: centre_point,
            count: totalResults,
            searchTimeMS: new Date().getTime()
        });

        searches.sync();

        this.getListTitleLabel().show(); //hidden if zero results - so need to show
    },

    //Function that pushes the resultList view onto the navigation view
    goToResultsList: function(store) {
        if (!this.resultList) {
            this.resultList = Ext.create('PropertyCrossWorkshopApp.view.ResultList', {store: store});
        }

        this.getMain().push(this.resultList);

        this.resultList.deselectAll();
        this.resetHome();
    },

    /*---------------------------------------------------------*/
    //Event handler functions defined in the config(control)
    //segment
    /*---------------------------------------------------------*/

    //Push event is called when a new view is pushed onto the navigationview
    onMainPush: function(view, item) {
        if (item.xtype === 'resultdetails') {
            this.showButton(this.getFaveButton());
            this.showAppBar();
        } else {
            this.hideButton(this.getFaveButton());
            this.hideAppBar();
        }
        this.hideButton(this.getListFavesButton());

        //Disable info button
        this.hideButton(this.getAboutButton());

        //push state so back button will work..
        history.pushState(null, "");
        this.updateBackStackDepth(+1);
    },

    //Pop event is called when a view is popped from the navigationview
    onMainPop: function(view, item) {
        this.hideButton(this.getFaveButton());
        this.hideAppBar();

        this.updateBackStackDepth(-1);
    },

    //Reset the home screen when it is shown again after user navigation
    resetHome: function() {
        this.getSuggestedLocations().hide();
        this.getErrorMessage().hide();
        var titleListLabel = this.getListTitleLabel();

        //Show previous searches
        this.getPreviousSearches().show();

        //Show the title depending on the previous searches store
        if(Ext.getStore('searches').getData().length !== 0) {
            titleListLabel.setHtml("Previous Searches");
            titleListLabel.show();
        } else {
            titleListLabel.hide();
        }
    },

    //Called when the "GO" button is tapped
    onGo: function(button, event, opts) {
        this.performSearch(button);
    },

    //Called when the user presses keyboard "return/enter"
    onLocationEnter: function(textField, event, opts) {
        this.performSearch(textField);
    },

    //Called when the user selects an item from the ResultList view
    onResultSelect: function(list, index, node, record) {
        //lazy initialise result details view..
        if (!this.resultDetails) {
            this.resultDetails = Ext.create('PropertyCrossWorkshopApp.view.ResultDetails');
        }

        // Bind the record onto the show contact view
        this.resultDetails.setRecord(record);

        //Sort out the fave button..
        var store = Ext.getStore('favourites');
        store.load();
        var me = this;
        me.showFavouriteUnset();
        Ext.each(store.getData().items, function(item, index) {
            if(item && record.getData().guid === item.getData().guid) {
                me.showFavouriteSet();
            }
        });
        this.getMain().push(this.resultDetails);
    },

    //Called when the user selects an item from the suggestedLocations dataview (defined in view.Home)
    onSuggestedLocations: function(list, index, node, record) {
        this.makeRequest(record.getData());

        this.resetHome();
    },

    //Function that pushes the resultList view onto the navigation view filled with
    onListFaves: function() {
        if (!this.favesList) {
            this.favesList = Ext.create('PropertyCrossWorkshopApp.view.ResultList', {
                store: Ext.getStore('favourites'),
                title: 'Favourites',
                id: 'favouritesList',
                emptyText: 'You have not added any properties to your favourites'
            });
        }
        this.getMain().push(this.favesList);
    },


    //Called when the favourite button is tapped on a detailcard
    onFaveTap: function() {
        var record = this.resultDetails.getRecord();
        var store = Ext.getStore('favourites');
        var faveButton = this.getFaveButton();
        var found = false;
        var recordGuid = record.getData().guid;
        var me = this;

        Ext.each(store.getData().items, function(item, index) {
            if(item && recordGuid === item.getData().guid) {
                //Note: store.remove doesn't mark record "dirty" so add/remove/add
                //      then sync doesn't work - we manually mark it instead..
                record.dirty = true;
                store.remove(item);
                found = true;
                me.showFavouriteUnset();
                return false; //break..
            }
        });
        if(!found) {
            store.add(record);
            me.showFavouriteSet();
        }
        //Note: sync won't fire refresh on list so we'll load again afterwards..
        store.sync();
        faveButton.setDisabled(true);
        store.load(function() {
            faveButton.setDisabled(false);
        });
    },

    //The about button handler
    onAboutTap: function() {
        //Create the about page if it doesn't exist
        if(!this.aboutPage) {
            this.aboutPage = Ext.create('PropertyCrossWorkshopApp.view.About');
        }

        //Push the about page onto the view
        this.getMain().push(this.aboutPage);
    },

    //The 'My Location' button handler
    onLocationTap: function() {
        var that = this;
        var coords = {
            longitude: 0,
            latitude: 0
        };

        Ext.device.Geolocation.getCurrentPosition({
            timeout: 5000, //timeout in 5s (default: not documented)
            maximumAge: 60000, //allow caching location for 1m (default: none)
            success: function(position) {
                //Note: only works with locations in the UK, we need to apply location fix here
                coords.longitude = position.coords.longitude - 4.9857;
                coords.latitude = position.coords.latitude + 0.6983;

                //Must make a request to get count for this position - and show error if 0.
                that.makeRequest({ centre_point: coords });
            },
            failure: function() {
                //Note: doesn't differentiate between user disabled and location not found.
                that.getErrorMessage().setHtml("Unable to detect current location. Please ensure location is turned on in your phone settings and try again");
                that.getErrorMessage().show();
            }
        });
    },

    //Called when the user selects an item from the previousSearches dataview (defined in view.Home)
    onPreviousSearches: function(list, index, node, record) {
        this.makeRequest(record.getData());

        //Note: this seems odd but apparently you need to do this on timeout..
        Ext.defer(function(){
            list.deselect(index);
        }, 200);
    },

    /*---------------------------------------------------------*/
    //Utility functions used throughout the controller
    /*---------------------------------------------------------*/

    //Format function that returns the string combination of coordinates for a given precision
    formatCoord: function(coords, precision) {
        var lat = precision ? coords.latitude.toFixed(precision) : coords.latitude;
        var lon = precision ? coords.longitude.toFixed(precision) : coords.longitude;
        return lat + "," + lon;
    },


    /*---------------------------------------------------------*/
    //Utility functions used to manipulate small parts of the
    //view
    /*---------------------------------------------------------*/

    //Function that shows the specified button (if not visible already)
    showButton: function(button) {
        if (!button.isHidden()) {
            return;
        }
        button.show();
    },

    //Function that hides the specified button (if not hidden already)
    hideButton: function(button) {
        if (button.isHidden()) {
            return;
        }
        button.hide();
    },

    //Function that changes the favourites icon appearance to HEART
    showFavouriteSet: function() {
        var faveButton = this.getFaveButton();
        if(Ext.browser.is.IE) {
            faveButton.setText("remove from favourites");
        } else {
            faveButton.setIconCls("favourite");
        }
    },

    //Function that changes the favourites icon appearance to HEART EMPTY
    showFavouriteUnset: function() {
        var faveButton = this.getFaveButton();
        if(Ext.browser.is.IE) {
            faveButton.setText("add to favourites");
        } else {
            faveButton.setIconCls("unfavourite");
        }
    },


    /*---------------------------------------------------------*/
    //Utility functions used to manipulate small parts of the
    //view specific to the windows phone platform
    /*---------------------------------------------------------*/

    //Function for showing the main app bar
    showAppBar: function() {
        var appBar = this.getMainAppBar();
        if (!appBar || !appBar.isHidden()) {
            return;
        }
        appBar.show();
    },

    //Function for hiding the main app bar
    hideAppBar: function() {
        var appBar = this.getMainAppBar();
        if (!appBar || appBar.isHidden()) {
            return;
        }
        appBar.hide();
    }

});
