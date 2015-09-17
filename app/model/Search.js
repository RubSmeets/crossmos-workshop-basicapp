/**
 * The Search class serves as the underlying datamodel for
 * the searches store. The data fetched from the
 * localstorage is stored according to this model. A search
 * holds information about a successful previously performed
 * property search.
 */
Ext.define('PropertyCrossWorkshopApp.model.Search', {
    extend: 'Ext.data.Model',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'Ext.data.proxy.LocalStorage',
        'Ext.data.identifier.Uuid'
    ],


    /*---------------------------------------------------------*/
    //Config object of the Search model
    /*---------------------------------------------------------*/
    config: {
        //The various fields of the Result model
        fields: [
            'display_name',
            'place_name',
            'centre_point',
            'count',
            'searchTimeMS'
        ],

        //Proxy defined in model to allow for multiple stores
        //to use the same proxy (without explicitly defining
        //them in the store)
        //Note: localstorage proxys should have a unique id!!
        proxy: {
            type: 'localstorage',
            id  : 'PropertyCross-Searches'
        },

        //Add a unique id (created by the Uuid generator) to
        //a model instance
        identifier: {
            type: 'uuid'
        }
    }
});