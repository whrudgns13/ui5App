sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/VBox"
], function(Control ,Button, Text,Input,VBox) {
    'use strict';
    return Control.extend("control.extension.MyFlexBox",{
        metadata  : {
                properties : {
                    "alignItems" : {
                        type : "string"
                    },
                    "justifyContent" : {
                        type : "string"
                    },
                    "width" : {
                        type : "string"
                    }                   
                },
                aggregations :{
                    items : {type : "sap.ui.core.Control", multiple: true, singularName: "items" },
                }
        },
        renderer : function(oRm,oControl){
                console.log(navigator.userAgent);
                oRm.openStart("div",oControl);
                console.log(oRm);
                oRm.addStyle("display","flex");
                oRm.addStyle('align-items',oControl.getAlignItems());
                oRm.addStyle('justify-content',oControl.getJustifyContent());
                oRm.addStyle('width',oControl.getWidth());
                oRm.openEnd();
                oControl.getItems().forEach(item=>{
                   oRm.renderControl(item);
                });
                oRm.close("div");
        }        
        
    })
});