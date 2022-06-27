sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/VBox"
], function(Control ,Button, Text,Input,VBox) {
    'use strict';
    return Control.extend("control.extension.MyControl2",{
        metadata  : {
                properties : {
                    text : {
                        type : "string"
                    }                 
                },//aggregation에 원하는 UI5 element를 선언
                aggregations :{
                    myControl : {
                        type : "control.extension.MyControl",
                        multiple : false
                    }
                },
                defaultAggregation : "myControl",
        },
        renderer : function(oRm,oControl){
                oRm.openStart("div",oControl);
                oRm.openEnd();
                oRm.renderControl(oControl.getAggregation("myControl"));
                oRm.close("div");
        } 
    })
});