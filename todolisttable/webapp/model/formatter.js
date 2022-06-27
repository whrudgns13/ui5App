sap.ui.define([], function() {
    'use strict';
    return {
        getDate : function(sDate){
            let dDate = new Date(sDate);
            let sYear = dDate.getFullYear();
            let sMonth = dDate.getMonth()+1;
            let sDay = dDate.getDate();
            return `${sYear}년 ${sMonth}월 ${sDay}일`;
        },
        getTime : function(sDate){
            let dDate = new Date(sDate);
            let sTime = dDate.getHours();
            let sMinutes = dDate.getMinutes();
            return `${sTime}시 ${sMinutes}분`;
        }
    }
});