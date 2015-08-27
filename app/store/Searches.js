/**
 * The "Searches" store (advanced arraylist) holds a list of Search-models that
 * where created when a search was performed. The store is responsible
 * for retrieving the data from the localstorage of the browser (proxy defined in
 * Search-model). Once the data is loaded the Search-models are created and stored
 * inside this "store".
 */
Ext.define('PropertyCrossWorkshopApp.store.Searches', {
    extend: 'Ext.data.Store',

    /*---------------------------------------------------------*/
    //Config object of the Searches store
    /*---------------------------------------------------------*/
    config: {
        storeId: 'searches',
        model: 'PropertyCrossWorkshopApp.model.Search',
        //On creation the data is loaded into the store
        autoLoad: true,
        sorters: {
            property: 'searchTimeMS',	// Property of model.Search
            direction: 'DESC'			// Descending order
        }
    }
});