sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/thirdparty/jquery",
	'sap/ui/export/Spreadsheet',
	'sap/ui/export/library'
], function (Log, Controller, JSONModel, MessageToast, DateFormat, jQuery, Spreadsheet, library) {
	"use strict";

	return Controller.extend("sap.ui.table.sample.Basic.Controller", {

		onInit: function () {
			// set explored app's demo model on this sample
			var oJSONModel = this.initSampleDataModel();
			this.getView().setModel(oJSONModel);
		},

		initSampleDataModel: function () {
			var oModel = new JSONModel();

			var oDateFormat = DateFormat.getDateInstance({ source: { pattern: "timestamp" }, pattern: "dd/MM/yyyy" });

			jQuery.ajax(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"), {
				dataType: "json",
				success: function (oData) {
					var aTemp1 = [];
					var aTemp2 = [];
					var aSuppliersData = [];
					var aCategoryData = [];
					for (var i = 0; i < oData.ProductCollection.length; i++) {
						var oProduct = oData.ProductCollection[i];
						if (oProduct.SupplierName && aTemp1.indexOf(oProduct.SupplierName) < 0) {
							aTemp1.push(oProduct.SupplierName);
							aSuppliersData.push({ Name: oProduct.SupplierName });
						}
						if (oProduct.Category && aTemp2.indexOf(oProduct.Category) < 0) {
							aTemp2.push(oProduct.Category);
							aCategoryData.push({ Name: oProduct.Category });
						}
						oProduct.DeliveryDate = (new Date()).getTime() - (i % 10 * 4 * 24 * 60 * 60 * 1000);
						oProduct.DeliveryDateStr = oDateFormat.format(new Date(oProduct.DeliveryDate));
						oProduct.Heavy = oProduct.WeightMeasure > 1000 ? "true" : "false";
						oProduct.Available = oProduct.Status == "Available" ? true : false;
					}

					oData.Suppliers = aSuppliersData;
					oData.Categories = aCategoryData;

					oModel.setData(oData);
				},
				error: function () {
					Log.error("failed to load json");
				}
			});

			return oModel;
		},

		updateMultipleSelection: function (oEvent) {
			var oMultiInput = oEvent.getSource(),
				sTokensPath = oMultiInput.getBinding("tokens").getContext().getPath() + "/" + oMultiInput.getBindingPath("tokens"),
				aRemovedTokensKeys = oEvent.getParameter("removedTokens").map(function (oToken) {
					return oToken.getKey();
				}),
				aCurrentTokensData = oMultiInput.getTokens().map(function (oToken) {
					return { "Key": oToken.getKey(), "Name": oToken.getText() };
				});

			aCurrentTokensData = aCurrentTokensData.filter(function (oToken) {
				return aRemovedTokensKeys.indexOf(oToken.Key) === -1;
			});

			oMultiInput.getModel().setProperty(sTokensPath, aCurrentTokensData);
		},

		formatAvailableToObjectState: function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		},

		formatAvailableToIcon: function (bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},

		handleDetailsPress: function (oEvent) {
			MessageToast.show("Details for product with id " + this.getView().getModel().getProperty("ProductId", oEvent.getSource().getBindingContext()));
		},

		onPaste: function (oEvent) {
			var aData = oEvent.getParameter("data");
			MessageToast.show("Pasted Data: " + aData);
		},
		excelDownload: function () {
			var EdmType = library.EdmType;
			let oView = this.getView();			
			let aCols = [
				{
					label : "Product Name",
					property : "Name",
					type : EdmType.String
				},
				{
					label : "Product Id",
					property : "ProductId", //바인딩된 속성
					type : EdmType.String
				},
				{
					label : "Quantity",
					property : "Quantity",
					type : EdmType.Number
				},
				{
					label : "Status",
					property : "Status",
					type : EdmType.String
				},
				{
					label : "Price",
					property : "Price",
					type : EdmType.Number
				},
				{
					label : "Delivery Date",
					property : "DeliveryDate",
					type : EdmType.Date
				}
			];
			let oTable = oView.byId("productTable");
			// oTable.getColumns().forEach(col=>{
			// 	aCols.push({
			// 		label : col.getLabel().getText(),
			// 		property : col.getLabel().getText()
			// 	})
			// })

			let oRowBinding = oTable.getBinding("rows");
			let oSettings = {
				workbook : {
					columns : aCols,
					hierarchyLevel : "Level"				
				},
				dataSource : oRowBinding,
				fileName : "ProductTable.xlsx",
				worker : false
			};
			let oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(()=>{
				oSheet.destroy();
			})
		
		}

	});

});