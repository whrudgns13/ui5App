sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,MessageBox) {
        "use strict";

        return Controller.extend("todolist.controller.App", {
            onInit: function () {
                let oView = this.getView()
                let oTodoDialogModel = new sap.ui.model.json.JSONModel({
                    title : "",
                    content : "",
                    date : ""                    
                });
                oView.setModel(oTodoDialogModel,"todoDialog");
                this._oTodoDialogModel = oView.getModel("todoDialog");
                this.oGridContainer = oView.byId("gridContainer");
                this.aLocalStorage = this.getLocalStorage();
                this.defaultSetting();
            },
            defaultSetting : function(){
                let aLocalStorage = this.getLocalStorage();
                if(!aLocalStorage) return;
                
                aLocalStorage.forEach(storageItem=>{
                    let oCard = this.createCard(storageItem);
                    this.oGridContainer.addItem(oCard);
                });
            },
            onOpenTodoDoalog : function(){
                let oView = this.getView();

                if(!this.oTodoDialog){
                    this.oTodoDialog = Fragment.load({
                        name : "todolist.view.TodoListDialog",
                        controller : this
                    });
                }

                this.oTodoDialog.then(oDialog =>{
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            },
            onSave : function(){
                let title = this._oTodoDialogModel.getProperty("/title");
                let content = this._oTodoDialogModel.getProperty("/content");
                
                if(!title || !content){
                    new sap.m.MessageToast.show("빈칸이 있는지 확인해주세요.");
                    return;
                }

                let sObj = this.getStorageModel();
                this.aLocalStorage.push(sObj);

                this.addCard(sObj);
                this.setLocalStorage(this.aLocalStorage);
                this.onClose();

                this._oTodoDialogModel.setProperty("/title","");
                this._oTodoDialogModel.setProperty("/content","");
                this._oTodoDialogModel.setProperty("/date","");
            },
            getStorageModel : function(){
                let title = this._oTodoDialogModel.getProperty("/title");
                let content = this._oTodoDialogModel.getProperty("/content");
                this._oTodoDialogModel.setProperty("/date",new Date());
                let date = this._oTodoDialogModel.getProperty("/date");
                return  {title,content,date};
            },
            setLocalStorage : function(aLocalStorage){
                window.localStorage.setItem("todo",JSON.stringify(aLocalStorage));
            },
            getLocalStorage : function(){
                let aLocalStorage = JSON.parse(window.localStorage.getItem("todo"));
                if(!aLocalStorage) return;

                aLocalStorage.forEach( item => item.date = new Date(item.date) );
                
                return aLocalStorage;
            },
            addCard : function(sObj){
                let oCard = this.createCard(sObj);
                this.oGridContainer.addItem(oCard);
            },           
            createCard : function({title,content,date}){
                let oCard = new sap.f.Card({
                    header : new sap.f.cards.Header({
                        title : title,
                        subtitle : this.getDate(date)
                    }),
                    content : [
                        new sap.m.HBox({
                            width : "100%",
                            alignItems : "Center",
                            justifyContent : "SpaceBetween",
                            items : [
                                new sap.m.Text({
                                    text : content
                                 }),
                                 new sap.m.Button({
                                     icon : "sap-icon://delete",
                                     press : this.deleteComfirm.bind(this)
                                 })
                            ]
                        }).addStyleClass("sapUiSmallMargin")                      
                    ],
                    customData : [
                        new sap.ui.core.CustomData({
                            key : date,
                            value : date
                        })
                    ]
                });
                return oCard;
            },
            deleteComfirm : function(oEvent){
                let _self = this;
                let oCard = oEvent.getSource().getParent().getParent();
              
                MessageBox.show("정말로 삭제하시겠습니까?",{
                    title : "정보",
                    icon: MessageBox.Icon.INFORMATION,
                    actions : [MessageBox.Action.YES,MessageBox.Action.NO],
                    emphasizedAction : MessageBox.Action.YES,
                    onClose : function(sAction){
                        if(sAction==="YES"){
                            cardDelete.bind(this)();
                        }
                    }
                });
                
                function cardDelete(){                    
                    let sKey = oCard.getCustomData()[0].getKey();
                    _self.aLocalStorage = _self.aLocalStorage.filter(storageItem=>{
                        return storageItem.date.toString() !==sKey;
                    });
                    _self.setLocalStorage(_self.aLocalStorage);
                    _self.oGridContainer.removeItem(oCard);
                }
            },
            getDate : function(date){                
                let sYear = date.getFullYear();
                let sMonth = date.getMonth();
                let sDay = date.getDate();
                return `${sYear}년 ${sMonth+1}월 ${sDay}일`;
            },
            onClose : function(){
                this.oTodoDialog.then(oDialog=>oDialog.close());
            }
        });
    });
