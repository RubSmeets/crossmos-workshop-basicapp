/**
 * The "Favourites" store (advanced arraylist) holds a list of Result-models that
 * where favored by the user through the favoured button. The store is responsible
 * for retrieving the data from the localstorage of the browser (proxy defined in
 * Result-model). Once the data is loaded the Result-models are created and stored
 * inside this "store".
 */
Ext.define('PropertyCrossWorkshopApp.store.Favourites', {
    extend: 'Ext.data.Store',

    /*---------------------------------------------------------*/
    //Config object of the Favourites store
    /*---------------------------------------------------------*/
    config: {
        storeId: 'favourites',
        model: 'PropertyCrossWorkshopApp.model.Result',
        //On creation the data is loaded into the store
        autoLoad: true
    }
});