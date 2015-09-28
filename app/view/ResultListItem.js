/**
 * The ResultListItem class extends the ListItem class
 * used in List views (ResultList). This view describes the appearance
 * of an item displayed in the List view.
 */
Ext.define('PropertyCrossWorkshopApp.view.ResultListItem', {
    extend: 'Ext.dataview.component.ListItem',

    //Custom component name
    xtype: 'resultlistitem',


    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'Ext.Img',
        'PropertyCrossWorkshopApp.util.Format'
    ],

    /*---------------------------------------------------------*/
    //Config object of the ResultListItem ListItem view
    /*---------------------------------------------------------*/
    config: {
        layout: 'hbox',
        padding: 5,
        border: '0 0 1', //bottom border only - border stlye and colour has to be defined in CSS...
        cls: 'resultlistitem',

        //Data mapping from record to view (where e.g. 'thumb_url' is a record field)
        dataMap: {
            getImage: {
                setSrc: 'thumb_url'
            },
            getPrice: {
                setData: 'price'
            },
            getTitle: {
                setHtml: 'title'
            }
        },

        //Child component views of this listItem
        items: [
            {
                xtype: 'img',
                width: 60,
                height: 60
            },
            {
                xtype: 'container',
                layout: 'vbox',
                padding: '0 0 0 5',
                flex: 1,
                items: [
                    {
                        itemId: 'price',
                        style: 'font-size: 18px; line-height: normal',
                        tpl:  Ext.create('Ext.XTemplate', '{[PropertyCrossWorkshopApp.util.Format.currency(values)]}')
                    },
                    {
                        itemId: 'title',
                        style: 'font-size: 12px; line-height: normal;'
                    }
                ]
            }
        ]
    },


    /*---------------------------------------------------------*/
    //Getters and setters for the child item components
    //  These are used to retrieve a reference to THIS-component's
    //  child items
    /*---------------------------------------------------------*/
    getImage: function() {
        return this.down('img');
    },
    getPrice: function() {
        return this.down('#price');
    },
    getTitle: function() {
        return this.down('#title');
    }
});
