/**
 * The SuggestedLocationsListItem class extends the DataItem class
 * used in dataviews (suggestedLocations in home.js). This view describes
 * the appearance of an item displayed in the dataview.
 */
Ext.define('PropertyCrossWorkshopApp.view.SuggestedLocationsListItem', {
    extend: 'Ext.dataview.component.DataItem',

    //Custom component name
    xtype: 'suggestedlocationslistitem',

    /*---------------------------------------------------------*/
    //Config object of the SuggestedLocationsListItem view
    /*---------------------------------------------------------*/
    config: {
        layout: 'hbox',
        padding: 10,
        border: 1,
        cls: 'searcheslistitem',    //CSS class assigned to this view component

        //Map data to dataItem setter
        dataMap: {
            getLongTitle: {
                setHtml: 'long_title'
            }
        },

        //Child items for this view
        items: [
            {
                itemId: 'placeName',
                style: 'font-size: 18px',
                flex: 1
            }
        ]
    },


    /*---------------------------------------------------------*/
    //Getters and setters for the child item components
    //  These are used to retrieve a reference to THIS-component's
    //  child items
    /*---------------------------------------------------------*/
    getLongTitle: function() {
        return this.down('#placeName');
    }
});