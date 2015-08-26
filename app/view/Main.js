/**
 * The main view of the propertyCross application. This view
 * is called upon application startup and contains the
 * navigation toolbar as well as the home view (Home.js)
 */
Ext.define('PropertyCrossWorkshopApp.view.Main', {
    extend: 'Ext.navigation.View',

    //Custom component name
    xtype: 'mainview',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'PropertyCrossWorkshopApp.view.Home'
    ],


    /*---------------------------------------------------------*/
    //Config object of the controller
    /*---------------------------------------------------------*/
    config: {
        //Child items will not be destroyed upon removal
        autoDestroy: false,

        navigationBar: {},

        //Child items
        items: [
            { xtype: 'home' }
        ]
    },


    /*---------------------------------------------------------*/
    //Event handler for when the view component is initialized
    //  Defines the configuration of the navigation toolbar
    //  once the application is started. (Different visual
    //  aspects depending on the running mobile platform)
    /*---------------------------------------------------------*/
    initialize: function() {
        this.callParent(arguments);
        var isWindowsPhone = Ext.browser.is.IE;


        var navSettings = { alignment: 'right', listFaves: { iconCls: 'favourite' } };  //favourite

        navSettings = isWindowsPhone ? { buttonUi: 'round', listFaves: { text: 'favourites' } } : navSettings;

        navSettings.animation = Ext.os.is.Android ? false : {
            type: 'fadeIn',
            duration: 200
        };

        var navItems = [
            {
                xtype: 'button',
                id: 'listFavesButton',
                iconCls: navSettings.listFaves.iconCls,
                text: navSettings.listFaves.text,
                align: navSettings.alignment,
                showAnimation: navSettings.animation,
                ui: navSettings.buttonUi
            },
            {
                xtype: 'button',
                id: 'faveButton',
                align: navSettings.alignment,
                hidden: true,
                showAnimation: navSettings.animation,
                ui: navSettings.buttonUi
            }
        ];

        if(Ext.browser.is.IE) {
            this.add({
                docked: 'bottom',
                xtype: 'toolbar',
                id: 'win8-appbar',
                layout: { pack: 'center' },
                items: navItems
            });
        } else {
            this.getNavigationBar().add(navItems);

        }
    }

});
