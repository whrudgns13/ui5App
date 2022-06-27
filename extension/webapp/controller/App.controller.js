sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("control.extension.controller.App", {
            onInit: function () {
                let oData = new sap.ui.model.odata.v2.ODataModel("https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/");

                oData.read("/BusinessPartnerSet",{
                    success : function(oData){
                        console.log(oData);
                    },
                    error : function(oErr){
                        console.log(oErr);
                    }
                })
            },
            onPress : function(oEvent){
                console.log(oEvent);
            }
        });
    });
