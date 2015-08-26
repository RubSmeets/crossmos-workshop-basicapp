/**
 * The Format class is a global utility class for this application
 * and provides functions for formatting numbers and text to the
 * desired form.
 */
Ext.define('PropertyCrossWorkshopApp.util.Format', {
    extend: 'Ext.Base',

    /*---------------------------------------------------------*/
    //List of static methods for this class
    /*---------------------------------------------------------*/
    statics: {
        currency: function(value) {
            return "$" + this.number(value);
        },
        title: function(title) {
            //chops off the second comma and everything after it.
            var parts = title.split(",");
            return parts[0] + "," + parts[1];
        },
        number: function(number) {
            number = number + "";
            var j = (j = number.length) > 3 ? j % 3 : 0; //part before first comma
            return (j ? number.substr(0, j) + ',' : "") + number.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ',');
        }
    }
});