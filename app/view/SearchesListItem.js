Ext.define('PropertyCrossWorkshopApp.view.SearchesListItem', {
    extend: 'Ext.dataview.component.DataItem',

    //Custom component name
    xtype: 'searcheslistitem',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'PropertyCrossWorkshopApp.util.Format'
    ],


    /*---------------------------------------------------------*/
    //Config object of the SearchesListItem view
    /*---------------------------------------------------------*/
    config: {
        layout: 'hbox',
        padding: 10,
        cls: 'searcheslistitem',	// The CSS class to add to this component

        //Data mapping from record to view
        dataMap: {
            getPlaceName: {
                setHtml: 'display_name'
            },
            getCount: {
                setData: 'count'
            }
        },

        //Child component views of this listItem
        items: [
            {
                itemId: 'placeName',	// id is scoped locally to the container
                style: 'font-size: 18px',
                flex: 1
            },
            {
                itemId: 'count',		// id is scoped locally to the container
                tpl:  Ext.create('Ext.XTemplate', '{[PropertyCrossWorkshopApp.util.Format.number(values)]}')
            }
        ]
    },


    /*---------------------------------------------------------*/
    //Getters and setters for the child item components
    //  These are used to retrieve a reference to THIS-component's
    //  child items
    /*---------------------------------------------------------*/
    getPlaceName: function() {
        return this.down('#placeName'); // Retrieves the first descendant of the container
    },

    getCount: function() {
        return this.down('#count');
    }
});