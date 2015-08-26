/**
 * The HOME view represents the home screen that resides in the mainview container.
 * It is the first view container that is displayed inside the navigationview from
 * the mainview view component.
 *
 * This view allows the user to search for properties on location or select from a
 * list of suggested locations.
 */
Ext.define('PropertyCrossWorkshopApp.view.Home', {
    extend: 'Ext.Container',

    //Custom component name
    xtype: 'home',  // Better performance compared to alias: 'widget.home' -> requires extra look-up


    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Text',
        'PropertyCrossWorkshopApp.view.SuggestedLocationsListItem'
    ],


    /*---------------------------------------------------------*/
    //Config object of the controller
    /*---------------------------------------------------------*/
    config: {
        id: 'home',
        title: 'PropertyCross',
        scrollable: true,
        //Child components of this view
        items: [
            {
                html: 'Use the form below to search for houses to buy. You can search by ' +
                'place-name, postcode, or click \'My location\', to search in your current location!',
                margin: 10
            },
            {
                xtype: 'formpanel',
                scrollable: null,
                margin: 10,
                items: [
                    {
                        xtype: 'fieldset',
                        items: [
                            {
                                xtype: 'textfield',
                                label: 'Location',
                                /*
                                 * On small iOS 7 screens, default labelWidth of '30%' is too small
                                 */
                                labelWidth: 'auto',
                                name: 'place_name',
                                id: 'placeNameText'
                            }
                        ],
                        margin: 10
                    },
                    {
                        layout: 'hbox',
                        margin: 10,
                        defaults: {
                            margin: '0 5 0 0'
                        },
                        items: [
                            {
                                xtype: 'button',
                                id: 'goButton',
                                ui: 'normal',
                                text: 'Go'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'errorMessage',
                margin: '0 0 10 10',
                hidden: 'true'
            },
            {
                html: 'Suggested Locations:',
                margin: 10,
                hidden: 'true',
                id: 'listTitleLabel'
            },
            {
                xtype: 'dataview',
                padding: '0 10 10',
                hidden: 'true',
                ui: 'round',
                id: 'suggestedLocations',
                scrollable: null,
                store: {
                    fields: ['place_name', 'long_title']
                },
                itemTpl: '{long_title}',
                defaultType: 'suggestedlocationslistitem',
                useComponents: true
            }
        ]
    }
});
