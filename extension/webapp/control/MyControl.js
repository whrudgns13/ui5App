sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/VBox"
], function(Control ,Button, Text,Input,VBox) {
    'use strict';
    return Control.extend("control.extension.MyControl",{
        metadata  : {
                properties : {
                    "text" : {
                        type : "string"
                    },
                    "value" : {
                        type : "string"
                    },
                    "btnText" : {
                        type : "string"
                    }                   
                },//aggregation에 원하는 UI5 element를 선언
                aggregations :{
                    _Input : {type : "sap.m.Input", multiple: false, visibility : "hidden" },
                    _Button : {type : "sap.m.Button", multiple: false, visibility : "hidden" }
                },
                events :{
                    "press" : {
                        parameters : {
                            value : {type : "string"}
                        }
                    }
                }
        },        
        init : function(){
            let oBtn = new Button({
                press : this.onMessageToast.bind(this)
            });

            let oInput = new Input({
                placeholder  :"place holder",
            });

            this.setAggregation("_Input",oInput);
            this.setAggregation("_Button",oBtn);
        },
        onMessageToast : function(){
            this.fireEvent("press",{
                value : this.getAggregation("_Input").getValue()
            })
        },
        renderer : function(oRm,oControl){
                oRm.openStart("div",oControl);
                oRm.openEnd();
                oRm.text(oControl.getText());
                oRm.renderControl(oControl.getAggregation("_Input").setValue(oControl.getValue()));
                oRm.renderControl(oControl.getAggregation("_Button").setText(oControl.getBtnText()));
                oRm.close("div");
        }
           
        
    })
});