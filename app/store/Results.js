/**
 * The "Results" store (advanced arraylist) holds a list of Result-models.
 * The store is responsible for retrieving the data from a remote host (nestoria API)
 * and creating/storing the Result-models on load completion.
 */
Ext.define('PropertyCrossWorkshopApp.store.Results', {
    extend: 'Ext.data.Store',

    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires:[
        'Ext.data.proxy.JsonP'
    ],


    /*---------------------------------------------------------*/
    //Config object of the Results store
    /*---------------------------------------------------------*/
    config: {
        storeId: 'results',
        model: 'PropertyCrossWorkshopApp.model.Result',
        autoLoad: false, //need to set place_name or centre_point param before loading.
        pageSize: 20,
        //Since the nestoria API is located on a cross-domain
        //we use a JSONP proxy (request) with a JSON reader
        proxy: {
            type: 'jsonp',
            url: 'http://api.nestoria.co.uk/api',
            timeout: 5000, // 5s
            reader: {
                type: 'json',
                rootProperty: 'response.listings',
                totalProperty: 'response.total_results'
            },
            //Some extra default request parameters (can be overridden)
            extraParams: {
                country : 'uk',
                pretty : '1',
                action : 'search_listings',
                encoding : 'json',
                listing_type : 'buy'
            }
        }
    }
});