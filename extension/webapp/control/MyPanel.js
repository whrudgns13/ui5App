sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/VBox"
], function(Control ,Button, Text,Input,VBox) {
    'use strict';
    return Control.extend("control.extension.MyPanel",{
        metadata  : {
                defaultAggregation : "content",
                properties : {
                    title : {
                        type : "string"
                    }    
                },
                aggregations : {
                    content : {
                        type : "sap.ui.core.Control", 
                        multiple : true,
                        singularName: "content"
                    }
                }               
        },
        renderer : function(oRm,oControl){
                oRm.openStart("div",oControl);
                oRm.openEnd();
                if(oControl.getTitle()){
                    oRm.write(`<h1>${oControl.getTitle()}</h1>`);
                }
                oControl.getContent().forEach((content)=>{
                    oRm.renderControl(content)
                });
                oRm.close("div");
        }      
    })
});