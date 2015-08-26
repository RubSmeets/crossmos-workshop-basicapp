/**
 * The ResultList view displays the results from the JSONP request
 * stored in the Results-store.
 *
 * NOTE: We use a List view instead of a normal dataview,
 * because a list view has improved performance compared to
 * a dataview when handling infinite datasets. In other cases
 * the dataview has better performance.
 */
Ext.define('PropertyCrossWorkshopApp.view.ResultList', {
    extend: 'Ext.dataview.List',

    //Custom component name
    xtype: 'resultlist',


    /*---------------------------------------------------------*/
    //List of class dependencies
    /*---------------------------------------------------------*/
    requires: [
        'Ext.plugin.ListPaging',
        'PropertyCrossWorkshopApp.util.Format',
        'PropertyCrossWorkshopApp.view.ResultListItem'
    ],


    /*---------------------------------------------------------*/
    //Config object of ResultList listview
    /*---------------------------------------------------------*/
    config: {
        //Plugins associated with the listview component, granting it extra functionality.
        //The plugin allows for more results to be loaded on tap "Load more results".
        plugins: [{
            xclass: 'Ext.plugin.ListPaging' ,
            autoPaging: false,
            loadMoreText: 'Load more results',
            noMoreRecordsText: 'No more results',
            loadTpl: '<div class="{cssPrefix}list-paging-msg">{message}</div>'
        }],

        title: 'Results',
        store: 'Results',
        defaultType: 'resultlistitem',
        useComponents: true,
        itemHeight: '70px',

        //Listeners for the resultList (should be moved to applicationController)
        listeners: {
            //Note: using the refresh event is not ideal as it can be cancelled by other listeners..
            refresh: {
                fn: function(){
                    var store = this.getStore();
                    // only render the load more text for non-favourites view
                    if (store._storeId!=="favourites") {
                        var totalCount = store.getTotalCount();
                        var data = store.getData();
                        var pagingPlugin = this.getPlugins()[0];
                        if(totalCount && data) {
                            var fmt = PropertyCrossWorkshopApp.util.Format.number;
                            var xOfY = fmt(data.length) + " of " + fmt(totalCount);
                            // Title is not read after first set, but parent doesn't exist initially.
                            var titleLocation = this.parent ? this.parent.getNavigationBar() : this;
                            titleLocation.setTitle(xOfY + " matches");
                            var params = store.getProxy().getExtraParams();
                            var searchTerm = params.place_name || "current location";
                            pagingPlugin.setLoadMoreText("<span id='listpaging-loadmore'>Load more ...</span><br>"
                                + "<span id='listpaging-results'>Results for <b>" + searchTerm + "</b>, showing <b>"
                                + fmt(data.length) + "</b> of <b>" + fmt(totalCount) + "</b> properties</span>");
                        }
                    }
                }
            }
        }
    }
});
