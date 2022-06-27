sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("fiorilocaltest.controller.App", {
            onInit: function () {
               
            },
            onPress : function(){
                $.ajax({
                    url : "https://jsonplaceholder.typicode.com/posts",
                    type : "GET",
                    dataType : "json",
                    success : function(data, status){
                        console.log(data);
                    },
                    error : function(xhr,status){
                        console.log(xhr,status)
                    }
                })

                $.ajax({
                    url : "https://jsonplaceholder.typicode.com/posts",
                    type : "POST",
                    dataType : "json",
                    success : function(data, status){
                        console.log(data);
                    },
                    error : function(xhr,status){
                        console.log(xhr,status)
                    }
                })
            }
        });
    });
