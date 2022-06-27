sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment, MessageBox,formatter) {
        "use strict";

        return Controller.extend("todolisttable.controller.App", {
            formatter : formatter,
            onInit: function () {
                let _self = this;
                let oView = this.getView();
                let oDialogModel = new sap.ui.model.json.JSONModel({
                    title : "",
                    content : "",
                    date : new Date(),
                    time : new Date(),
                    state : true
                });
                oView.setModel(oDialogModel,"todoDialog");
                this.oDialogModel = oView.getModel("todoDialog");

                this.toDos = this.getLocalStorage() ? this.getLocalStorage() : [];
                let oTodoListModel = new sap.ui.model.json.JSONModel({
                    list : this.toDos
                });
                oView.setModel(oTodoListModel,"toDos");
                this.todoListModel = oView.getModel("toDos"); 
                
                setInterval(()=>{
                    _self.onClock();
                },1000)
            },
            onClock : function(){
                let curDate = getDate(new Date());
                let _self = this;
                
                this.toDos.forEach((todo)=>{
                    let todoDate = new Date(todo.date);
                    let sYear = todoDate.getFullYear();
                    let sMonth = todoDate.getMonth()+1;
                    let sDay = todoDate.getDate();  

                    let todoTime = new Date(todo.time);
                    let sTime = todoTime.getHours();
                    let sMinutes = todoTime.getMinutes();
                    let thisTodoDate = `${sYear}${sMonth}${sDay}${sTime}${sMinutes}`;
                    
                    if(curDate===thisTodoDate){
                        if(!todo.state) return;
                        todo.state = false;
                        this.ClockDialog = new sap.m.Dialog({
                            title : `시간이 되었습니다`,
                            content : new sap.m.Text({
                                text : `${todo.title} 할 시간`
                            }),
                            endButton : new sap.m.Button({
                                text : `Close`,
                                press : function(oEvent){
                                    oEvent.getSource().getParent().close();
                                    oEvent.getSource().getParent().destroy();
                                    _self.modelUpdate();
                                }
                            })
                        });
                        this.ClockDialog.open();
                    }
                });
                
                function getDate(date){
                    let sYear = date.getFullYear();
                    let sMonth = date.getMonth()+1;
                    let sDay = date.getDate();
                    let sTime = date.getHours();
                    let sMinutes = date.getMinutes();
                    return  `${sYear}${sMonth}${sDay}${sTime}${sMinutes}`;
                }

            },
            onOpenDialog : function(){
                let oView = this.getView();

                if(!this.oDialog){
                    this.oDialog = Fragment.load({
                        name : "todolisttable.view.TodoListDialog",
                        controller : this
                    });
                }

                this.oDialog
                .then(oDialog =>{
                    oView.addDependent(oDialog);
                    oDialog.open();
                })
            },
            onSave : function(){
                let id = new Date();
                let title = this.oDialogModel.getProperty("/title");
                let content = this.oDialogModel.getProperty("/content");            
                let date = this.oDialogModel.getProperty("/date");
                let time = this.oDialogModel.getProperty("/time");
                let state = this.oDialogModel.getProperty("/state");
                let oTodoObj = {id, title, content, date, time, state};
                this.toDos.push(oTodoObj);
                this.modelUpdate();
                this.onClose();             
            },
            toDoDelete : function(oEvent){
                let _self = this;
                let oDeleteItem = oEvent.getParameter("listItem");

                MessageBox.show("정말로 삭제하시겠습니까?",{
                    title : "정보",
                    icon: MessageBox.Icon.INFORMATION,
                    actions : [MessageBox.Action.YES,MessageBox.Action.NO],
                    emphasizedAction : MessageBox.Action.YES,
                    onClose : function(sAction){
                        if(sAction==="YES"){
                            deleteList.bind(_self)();
                        }
                    }
                });

                function deleteList(){
                    let aPath = oDeleteItem.getBindingContext("toDos").getPath().split("/");
                    let iIndex = aPath[aPath.length-1];
                    this.toDos.splice(iIndex,1);
                    this.modelUpdate();
                }
                
            },
            setLocalStorage : function(){
                window.localStorage.setItem("todo",JSON.stringify(this.toDos));
            },
            getLocalStorage : function(){
                let aToDos = JSON.parse(window.localStorage.getItem("todo"));
                if(aToDos) return aToDos;                            
            },
            onClose : function(){
                this.oDialog.then(oDialog=>oDialog.close());
            },
            modelUpdate : function(){
                this.setLocalStorage();
                this.todoListModel.setProperty("/list", this.getLocalStorage());
            }
        });
    });
