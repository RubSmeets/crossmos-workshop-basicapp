/**
 * The Result class serves as the underlying datamodel for
 * the results and favourites store. The data fetched from the
 * remote server is stored according to this model (for the location
 * search results).
 */
Ext.define('PropertyCrossWorkshopApp.model.Result', {
    extend: 'Ext.data.Model',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'Ext.data.proxy.LocalStorage',
        'Ext.data.identifier.Uuid'
    ],


    /*---------------------------------------------------------*/
    //Config object of the Result model
    /*---------------------------------------------------------*/
    config: {
        //The various fields of the Result model
        fields: [
            'guid', 'title', 'price', 'property_type', 'img_url', 'thumb_url', 'summary',
            'bedroom_number', 'bathroom_number', 'latitude', 'longitude'
        ],

        //Proxy defined in model to allow for multiple stores
        //to use the same proxy (without explicitly defining
        //them in the store)
        //Note: localstorage proxys should have a unique id!!
        proxy: {
            type: 'localstorage',
            id  : 'favourite-properties'
        },

        //Add a unique id (created by the Uuid generator) to
        //a model instance
        identifier: {
            type: 'uuid'
        }
    }
});