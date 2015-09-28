/**
 * This view class contains the layout of detail card that gets
 * displayed when an item is selected from the listView (ResultList).
 * The data for the detail card is supplied by a record
 */
Ext.define('PropertyCrossWorkshopApp.view.ResultDetails', {
    extend: 'Ext.Container',

    //Custom component name
    xtype: 'resultdetails',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'PropertyCrossWorkshopApp.util.Format',
        'Ext.Img'
    ],


    /*---------------------------------------------------------*/
    //Config object for the ResultDetails view
    /*---------------------------------------------------------*/
    config: {
        title: 'Property Details',
        iconCls: 'home',
        scrollable: true,
        //Every item is of type "panel" unless otherwise specified with "xtype"
        defaultType: 'panel',
        items: [
            {
                padding: '15 15 0 15',
                style: 'font-size: 24px',
                //Syntax for calling a function inside the template using the inline JavaScript blocks
                tpl:  Ext.create('Ext.XTemplate', '{[PropertyCrossWorkshopApp.util.Format.currency(values.price)]}')
            },
            {
                padding: '2 15 0 15',
                style: 'font-size: 18px',
                tpl:  Ext.create('Ext.XTemplate', '{[PropertyCrossWorkshopApp.util.Format.title(values.title)]}')
            },
            {
                xtype: 'img',
                padding: 5,
                mode: 'image',
                width: '100%'
            },
            {
                padding: '2 15 0 15',
                style: 'font-size: 14px',
                tpl: '<tpl if="bedroom_number">{bedroom_number} bed<tpl if="bathroom_number">, </tpl></tpl><tpl if="bathroom_number">{bathroom_number} bathroom</tpl><tpl if="property_type"> {property_type}</tpl>'
            },
            {
                padding: '2 15 15 15',
                style: 'font-size: 18px',
                tpl: '{summary}'
            }
        ],

        record: null
    },


    /*---------------------------------------------------------*/
    //UpdateRecord method that updates the panels with data
    //from the supplied record. Here we use UpdateRecord
    //instead of dataMap (unlike ResultListItem), because
    //the dataMap config is only available for ListItem or
    //dataItem components.
    /*---------------------------------------------------------*/
    updateRecord: function(newRecord) {
        if (newRecord) {
            //set data on details tab
            var data = newRecord.data;

            //this.query('panel') == Ext.ComponentQuery.query('panel',this) -- returns array of matching components
            Ext.each(this.query('panel'), function(item, index){
                item.setData(data);
            });
            this.down('img').setSrc(data.img_url);
        }
    }
});
