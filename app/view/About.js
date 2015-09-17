Ext.define('PropertyCrossWorkshopApp.view.About', {
    extend: 'Ext.Container',

    //Custom component name
    xtype: 'aboutPage',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'Ext.Label',
        'Ext.Img'
    ],


    /*---------------------------------------------------------*/
    //Config object for the About view
    /*---------------------------------------------------------*/
    config: {
        title: 'About',
        layout: {
            type: 'vbox',
            align: 'middle'
        },
        scrollable: true,

        items: [
            {
                xtype: 'label',
                html: 'App description',
                style: 'font-size: 24px',
                cls: 'aboutHeader',
                padding: '15 15 0 15'
            },
            {
                xtype: 'panel',
                html: 'The PropertyCross app allows you to search for houses in the UK using search '
                        + 'criteria or by using the GPS for locations in the vecinity',
                style: {
                    textAlign:'center'
                },
                padding: '15 15 0 15'
            },
            {
                xtype: 'label',
                html: 'App version',
                style: 'font-size: 24px',
                cls: 'aboutHeader',
                padding: '15 15 0 15'
            },
            {
                xtype: 'panel',
                html: 'Version v1.0.0',
                padding: '15 15 0 15'
            },
            {
                xtype: 'label',
                html: 'Created by',
                style: 'font-size: 24px',
                cls: 'aboutHeader',
                padding: '15 15 0 15'
            },
            {
                xtype: 'panel',
                html: 'The app creator',
                padding: '15 15 0 15'
            },
            {
                xtype: 'image',
                src: PropertyCrossWorkshopApp.util.Constants.ABOUT_IMG,
                margin: '15 15 20 15',
                width: '150px',
                height: '150px'
            }
        ]

    }
});