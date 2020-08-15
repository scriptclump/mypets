'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize');
const moment = require('moment');
var database = require('../../config/mysqldb');
var inventoryModel = require('../model/Inventory.js');
var role = require('../model/Role');
var roleModel = require('../model/Rolerepo');
let db = database.DB;
var qtycheck = [];
var http = require('http');
const { fromCallback } = require('bluebird');
var url = process.env.APP_TAXAPI;
let purchaseOrder = require('../model/purchaseOrder.js');


module.exports = {

    getAllInwards: async (userId, grnStatus, approvalStatusId, rowCnt = 0, fromDate, toDate, filter, perPage, offset, sortField = "inward_code", sortType = "desc") => {
        try {
            return new Promise(async (resolve, reject) => {
    
                const currentDateEnd = moment().format(("YYYY-MM-DD 23:59:59"));
                let userData = await module.exports.checkUserIsSupplier(userId);
                let globalFeature = await roleModel.checkPermissionByFeatureCode('GLB0001', userId);//response true/false
                let inActiveDCAccess = await roleModel.checkPermissionByFeatureCode('GLBWH0001', userId);//response true/false
                // let accessList = await module.exports.getAccesDetails(1);
                // console.log('DC accesss list:  ',accessList); // DC Access List
                
                let query = `SELECT inward.*, 
                legal.business_legal_name, currency.symbol_left AS symbol,
                po.po_code AS poCode, GetUserName(inward.created_by,2) AS createdBy,
                getLeWhName(inward.le_wh_id) AS dcname, 
                (SELECT SUM(po_products.sub_total) FROM po_products WHERE po_products.po_id=po.po_id) AS povalue,
                SUM(products.discount_total) AS item_discount_value,
                inward.grand_total AS grnvalue, po.po_code, po_invoice_grid.invoice_code FROM inward 
                LEFT JOIN legal_entities AS legal ON legal.legal_entity_id = inward.legal_entity_id
                LEFT JOIN inward_products AS products ON products.inward_id = inward.inward_id
                LEFT JOIN currency ON currency.currency_id = inward.currency_id 
                LEFT JOIN po ON po.po_id = inward.po_no 
                LEFT JOIN po_invoice_grid ON inward.inward_id = po_invoice_grid.inward_id 
                INNER JOIN legalentity_warehouses AS lwh ON lwh.le_wh_id = inward.le_wh_id`
                if (!globalFeature) {
                    query += ` INNER JOIN user_permssion AS up ON CASE WHEN up.object_id=0 THEN 1 else up.object_id=lwh.bu_id end 
                                  AND up.user_id = ${userId} AND up.permission_level_id = 6`
                }

                query += ` WHERE legal.legal_entity_type_id in ( 1002, 1014, 1016 )  ` // Supplier, DC, FC
                query += ` AND lwh.status = 1`;
                if (grnStatus != "" && grnStatus != 'all') {
                    if (grnStatus == 'invoiced') {
                        query += ` AND po_invoice_grid.inward_id != "" `
                    } else if (grnStatus == 'notinvoiced') {
                        query += ` AND po_invoice_grid.inward_id IS NULL`
                    }else if (grnStatus == 'approved') {
                        query += ` AND inward.approval_status = 1`
                    }else if (grnStatus == 'notapproved') {
                        query += ` AND inward.approval_status != 1`
                    }    
                }
    
                if (Object.keys(filter).length > 0) {
                    if (filter['createdBy'] != null && filter['createdBy'] != "") {
                        if (filter['createdBy'][1] == 'contains') {
                            query += `  AND GetUserName(inward.created_by,2) LIKE '%${filter['createdBy'][0]}%' `
                        } else {
                            query += `  AND GetUserName(inward.created_by,2) = '${filter['createdBy'][0]}' `
                        }
                    }
                    if (filter['dcname'] != null && filter['dcname'] != "") {
                        if (filter['dcname'][1] == 'contains') {
                            query += `  AND getLeWhName(inward.le_wh_id) LIKE '%${filter['dcname'][0]}%' `
                        } else {
                            query += `  AND getLeWhName(inward.le_wh_id) = '${filter['dcname'][0]}' `
                        }
                    }
                    if (filter['grnDate'] != null && filter['grnDate'] != "") {
                        const dateStart = moment(filter['grnDate'][0]).format(("YYYY-MM-DD 00:00:00"));
                        const dateEnd = moment(filter['grnDate'][0]).format(("YYYY-MM-DD 23:59:59"));
                        if (filter['grnDate'][1] == 'on') {
                            query += ` AND po.created_at between '${dateStart}' AND '${dateEnd}'`
                        } else if (filter['grnDate'][1] == 'after') {
                            query += ` AND po.created_at > '${dateEnd}' `
                        } else if (filter['grnDate'][1] == 'before') {
                            query += ` AND po.created_at < '${dateStart}' `
                        } else if (filter['grnDate'][1] == 'today') {
                            query += ` AND po.created_at  between '${dateStart}' AND '${dateEnd}' `
                        } else if (filter['grnDate'][1] == 'yesterday') {
                            query += ` AND po.created_at  between '${dateStart}' AND '${dateEnd}' `
                        }
                    }
                    if (filter['grnCode'] != null && filter['grnCode'] != "") {
                        if (filter['grnCode'][1] == 'contains') {
                            query += `  AND inward_code LIKE '%${filter['grnCode'][0]}%' `
                        } else {
                            query += `  AND inward_code = '${filter['grnCode'][0]}' `
                        }
                    }
                    // if (filter['grnvalue'] != null && filter['grnvalue'] != "") {
                    //     if (filter['grnvalue'][1] == 'contains') {
                    //         query += `  AND grn.grnvalue LIKE '%${filter['grnvalue'][0]}%' `
                    //     } else {
                    //         query += `  AND grn.grnvalue = '${filter['grnvalue'][0]}' `
                    //     }
                    // }
                    if (filter['invoice_no'] != null && filter['invoice_no'] != "") {
                        if (filter['invoice_no'][1] == 'contains') {
                            query += `  AND invoice_no LIKE '%${filter['invoice_no'][0]}%' `
                        } else {
                            query += `  AND invoice_no = '${filter['invoice_no'][0]}' `
                        }
                    }
                    // if (filter['item_discount_value'] != null && filter['item_discount_value'] != "") {
                    //     if (filter['item_discount_value'][1] == 'contains') {
                    //         query += `  AND grn.item_discount_value LIKE '%${filter['item_discount_value'][0]}%' `
                    //     } else {
                    //         query += `  AND grn.item_discount_value = '${filter['item_discount_value'][0]}' `
                    //     }
                    // }
                    if (filter['legalsuplier'] != null && filter['legalsuplier'] != "") {
                        if (filter['legalsuplier'][1] == 'contains') {
                            query += `  AND legal.business_legal_name LIKE '%${filter['legalsuplier'][0]}%' `
                        } else {
                            query += `  AND legal.business_legal_name = '${filter['legalsuplier'][0]}' `
                        }
                    }
                    if (filter['poCode'] != null && filter['poCode'] != "") {
                        if (filter['poCode'][1] == 'contains') {
                            query += `  AND po.po_code LIKE '%${filter['poCode'][0]}%' `
                        } else {
                            query += `  AND po.po_code = '${filter['poCode'][0]}' `
                        }
                    }
                    // if (filter['povalue'] != null && filter['povalue'] != "") {
                    //     if (filter['povalue'][1] == 'contains') {
                    //         query += `  AND grn.povalue LIKE '%${filter['povalue'][0]}%' `
                    //     } else {
                    //         query += `  AND grn.povalue = '${filter['povalue'][0]}' `
                    //     }
                    // }
                    if (filter['ref_no'] != null && filter['ref_no'] != "") {
                        if (filter['ref_no'][1] == 'contains') {
                            query += `  AND inward_ref_no LIKE '%${filter['ref_no'][0]}%' `
                        } else {
                            query += `  AND inward_ref_no = '${filter['ref_no'][0]}' `
                        }
                    }
                }
                if (fromDate != null && toDate != null && fromDate != "" && toDate != "") {
                    query += ` AND po.po_date between '${fromDate + ' 00:00:00'}' AND '${toDate + ' 23:59:59'}'`
                }
    
    
                query += ` GROUP BY inward.inward_id `
    
                // //below queries shall be performed after group by in sql 
                if (filter['grnvalue'] != null && filter['grnvalue'] != "") {
                    if (filter['grnvalue'][1] == '=') {
                        query += `  having ROUND(grnvalue,2) = '${filter['grnvalue'][0]}' `
                    } else if (filter['grnvalue'][1] == '>') {
                        query += ` having ROUND(grnvalue,2) > '${filter['grnvalue'][0]}' `
                    } else {
                        query += ` having ROUND(grnvalue,2) < '${filter['grnvalue'][0]}' `
                    }
                }
    
                if (filter['item_discount_value'] != null && filter['item_discount_value'] != "") {
                    if (filter['item_discount_value'][1] == '=') {
                        query += `   having ROUND(grn.item_discount_value,2) = '${filter['item_discount_value'][0]}' `
                    } else if (filter['grn_value'][1] == '>') {
                        query += `  having ROUND(grn.item_discount_value,2) > '${filter['item_discount_value'][0]}' `
                    } else {
                        query += `  having ROUND(grn.item_discount_value,2) < '${filter['item_discount_value'][0]}' `
                    }
                }
    
                if (filter['povalue'] != null && filter['povalue'] != "") {
                    if (filter['povalue'][1] == '=') {
                        query += `  having ROUND(grn.povalue,2) = '${filter['povalue'][0]}' `
                    } else if (filter['povalue'][1] == '>') {
                        query += `  having ROUND(grn.povalue,2) > '${filter['povalue'][0]}' `
                    } else {
                        query += `  having ROUND(grn.povalue,2) < '${filter['povalue'][0]}' `
                    }
                }
                if (rowCnt == 1) {
                    query += ` ORDER BY inward_code DESC`
                    sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                        resolve(response.length);
                    })
                } else {
                    query += ` ORDER BY ${sortField} ${sortType} LIMIT ${perPage} OFFSET ${offset};`
                    //console.log('query', query);
                    sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                        resolve(response);
                    })
                }
            })
        } catch (err) {
            reject(err);
        }
    
    },
    getAccesDetails: async function (user_id) {
        return new Promise((resolve, reject) => {
            role.getFilterData(6, user_id).then((roles) => {
                roles = JSON.parse(roles);
                var data = [];
                var filters = JSON.parse(roles.sbu);
                var dc_acess_list = filters.hasOwnProperty('118001') ? filters['118001'] : 'NULL';
                var hub_acess_list = filters.hasOwnProperty('118002') ? filters['118002'] : 'NULL';
                data.dc_acess_list = dc_acess_list;
                data.hub_acess_list = hub_acess_list;
                return resolve(data);
            });
        });
    },

    checkUserIsSupplier: async (userId) => {
        try {
            return new Promise((resolve, reject) => {
                let query = ` SELECT * FROM users u JOIN legal_entities l ON u.legal_entity_id= l.legal_entity_id 
                WHERE l.legal_entity_type_id IN (1006,1002,89002) 
                AND  u.is_active=1 AND u.user_id= ${userId}`
    
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    (response.length > 0) ? resolve(response) : resolve([]);
                })
            })
        } catch (err) {
            console.log('checkUserIsSupplier Error : ', err);
            reject(err);
        }
    },

    getSuppliers: async function (req, res) {
        var legalentitytype;
        var params = { 'user_id': req.user_id, 'permissionLevelId': '6' };
        var suppliersMergeArray = [];
        var dcfcList = [];
        return new Promise((resolve, reject) => {

            module.exports.getLegalEntityTypeId(req.legalentity).then(async (data1) => {
                legalentitytype = data1;
                let sbu = await role.getFilterData(params);//.then(async(sbu)=>{
                //if(sbu[0].hasOwnProperty('sbu')){
                var filters = sbu[0].sbu;
                var dc_acess_list = filters.hasOwnProperty('118001') ? filters[118001] : 'NULL';
                let suppliers = await role.suppliersbasedOnLegalEnitityID(req.legalentity);

                var params1 = { 'legalentity': req.legalentity, 'fields': 'legal_entity_id,business_legal_name' };
                let dcfcdata = await role.getDCFCData(params1);
                //console.log(suppliers);
                if (dcfcdata.length > 0) {
                    suppliersMergeArray = [...dcfcdata, ...suppliers];
                }else{
                    suppliersMergeArray = [...suppliers];
                }
                if (legalentitytype == 1001) {
                    var legal_entity_type_id = [1014, 1016];
                    let fc_dc_legal_entities = await module.exports.getDCFCMappingsForDCList(dc_acess_list);
                    fc_dc_legal_entities = fc_dc_legal_entities.hasOwnProperty('dc_le_id') ? fc_dc_legal_entities.dc_le_id : "";
                    if (fc_dc_legal_entities != '') {
                        dcfcList = await module.exports.getDCFCListForLegalEnitytType(fc_dc_legal_entities, legal_entity_type_id);
                        if (dcfcList.length) {
                            suppliersMergeArray = [...suppliersMergeArray, ...dcfcList];
                        }
                    }
                    resolve(suppliersMergeArray);
                }else{
                    resolve(suppliers);
                }
                //}
                //});	
            });
        })
    },
    getLegalEntityTypeId: async function (legalentity) {
        return new Promise((resolve, reject) => {
            var qry = "select legal_entity_type_id from legal_entities where legal_entity_id=" + legalentity + " limit 1";
            db.query(qry, {}, async function (err, rows) {
                if (err) {
                    await reject('error');
                }
                if (Object.keys(rows).length > 0) {
                    var le_type_id = rows[0].hasOwnProperty('legal_entity_type_id') ? rows[0].legal_entity_type_id : '';
                    await resolve(le_type_id);
                }
            });
        });
    },
    getDCFCMappingsForDCList: async function (dclist) {
        return new Promise((resolve, reject) => {
            var dcfcqry = "select GROUP_CONCAT(DISTINCT CONCAT(dc_le_id,',',fc_le_id) ) AS dc_le_id from dc_fc_mapping where dc_fc_mapping.dc_le_wh_id in (" + dclist + ") or dc_fc_mapping.fc_le_wh_id in (" + dclist + ") limit 1";
            db.query(dcfcqry, {}, async function (err, result) {
                if (err) {
                    reject('error');
                }
                if (Object.keys(result).length > 0) {
                    //console.log(typeof(result)+'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                    await resolve(result);
                }
            });
        });
    },

    getDCFCListForLegalEnitytType: async function (dcfcList, legal_entity_type_id) {
        return new Promise((resolve, reject) => {
            var dcfclist = "select legal_entity_id,business_legal_name from legal_entities where legal_entities.legal_entity_id in (" + fc_dc_legal_entities + ") and legal_entities.legal_entity_type_id in (" + legal_entity_type_id + ")";
            db.query(dcfclist, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (Object.keys(rows).length > 0) {
                    //console.log(typeof(rows)+'aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                    resolve(rows);
                }
            })
        })
    },
    poList: async function (params) {
        return new Promise((resolve, reject) => {
            var legal_entity_id = params.legalentity;
            var user_id = params.user_id;
            var legalentitytype;
            var suppliersMergeArray;
            var globalsupplier;
            module.exports.getLegalEntityTypeId(params.legalentity).then(async (data1) => {
                legalentitytype = data1;
                var filterdata = { "permissionLevelId": '6', "user_id": user_id };
                let sbu = await role.getFilterData(filterdata);
                var filters = sbu[0].sbu;
                var dc_acess_list = filters.hasOwnProperty('118001') ? filters[118001] : 'NULL';
                let suppliers = await role.suppliersbasedOnLegalEnitityID(params.legalentity);
                var params1 = { 'legalentity': params.legalentity, 'fields': 'legal_entity_id,business_legal_name' };
                let dcfcdata = await role.getDCFCData(params1);
                if (dcfcdata.length > 0) {
                    //console.log('suppliers '+suppliers);
                    dcfcdata = dcfcdata.map(function (value, index) { return value['legal_entity_id'] });
                    //console.log('dcfcdata '+dcfcdata);
                    suppliers = suppliers.map(function (value, index) { return value['legal_entity_id'] });
                    suppliersMergeArray = [...dcfcdata, ...suppliers];
                    if (suppliersMergeArray.length == 0) {
                        suppliersMergeArray = dcfcdata;
                    }
                    //resolve(suppliersMergeArray);
                } else {
                    suppliersMergeArray = suppliers;
                }
                var fields1 = "po.po_id,po.po_code";
                var query = "select " + fields1 + " from po";
                if (legalentitytype == 1001) {
                    query += " where ";
                } else {
                    dc_acess_list = dc_acess_list.split(',');
                    query += " where po.le_wh_id in (" + dc_acess_list + ") and";
                }
                globalsupplier = await role.masterLookUpDescriptionByvalue(78023);
                var globalSupperLierId = globalsupplier.hasOwnProperty('description') ? globalsupplier.description : 'NULL';
                suppliersMergeArray.push(globalSupperLierId);
                suppliersMergeArray.push(2);
                query += " po.is_closed=0 and po.approval_status in (57107,57119,57120,1) and po.po_status in (87001, 87005) order by po.po_id desc";
                db.query(query, {}, async function (err, rows) {
                    if (err) {
                        reject('error');
                    }
                    if (rows.length > 0) {
                        resolve(rows);
                    }
                });
            });
        })
    },
    getPOQtyById: async function (poid) {
        return new Promise((resolve, reject) => {
            var fields2 = "SUM(poprd.qty*no_of_eaches) AS totpo_qty";
            var poqtyqry = "select " + fields2 + " from po join po_products as poprd on poprd.po_id=po.po_id where po.po_id=" + poid;
            db.query(poqtyqry, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (rows.length > 0) {
                    resolve(rows);
                } else {
                    resolve({});
                }
            })
        })
    },
    getGrnQtyByPOId: async function (poid) {
        return new Promise((resolve, reject) => {
            var fields3 = "SUM(received_qty) AS tot_received";
            var grnqtyqry = "select " + fields3 + " from inward join inward_products as inwrdprd on inwrdprd.inward_id=inward.inward_id where inward.po_no=" + poid;
            db.query(grnqtyqry, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (rows.length > 0) {
                    resolve(rows);
                } else {
                    resolve({});
                }
            });
        });
    },
    getPOSupplierProductList: async function (params) {
        return new Promise(async (resolve, reject) => {
            var legal_entity_id = params.legal_entity_id;
            var user_id = params.userid;
            var poid = params.poid;
            var legal_entity_type_id = [1002, 1014, 1016];
            var response = '';

            var supplierlist = await module.exports.suppliersListByPOID(poid, legal_entity_type_id, legal_entity_id);
            var warehouselist = await module.exports.warehouseListByPO(poid, legal_entity_id);
            response={ "supplierList": supplierlist, "warehouselist": warehouselist };
            resolve(response);
        });
    },
    suppliersListByPOID: async function (poid, legal_entity_type_id, legal_entity_id) {
        return new Promise((resolve, reject) => {
            var supplierslist = "select legal_entities.legal_entity_id,legal_entities.business_legal_name from legal_entities";
            if (poid > 0) {
                supplierslist += " join po on po.legal_entity_id=legal_entities.legal_entity_id where po.po_id=" + poid + " and legal_entities.legal_entity_type_id in (" + legal_entity_type_id + ")";
            } else {
                supplierslist += " legal_entities.legal_entity_type_id=1002 and parent_id=" + legal_entity_id;
            }
            supplierslist += "and legal_entities.is_approved=1";
            db.query(supplierslist, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve({});
                }
            });

        });
    },
    warehouseListByPO: async function (poid, legal_entity_id) {
        return new Promise((resolve, reject) => {
            var warehouselistbypoid = "select legalentity_warehouses.lp_wh_name,legalentity_warehouses.le_wh_id from legalentity_warehouses";
            if (poid > 0) {
                warehouselistbypoid += " join po on po.le_wh_id=legalentity_warehouses.le_wh_id where po.po_id=" + poid;
            } else {
                warehouselistbypoid += " legalentity_warehouses.legal_entity_id=" + legal_entity_id;
            }
            db.query(warehouselistbypoid, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (rows.length > 0) {
                    resolve(rows[0]);
                } else {
                    resolve({});
                }
            });
        });
    },
    getPODiscountDetails: async function (params) {
        return new Promise((resolve, reject) => {
            var podiscountqry = "select apply_discount_on_bill,discount_type,discount,discount_before_tax from po where po_id=" + params.poid + " and apply_discount_on_bill=1 limit 1";
            db.query(podiscountqry, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (rows.length > 0) {
                    resolve(rows);
                } else {
                    resolve({});
                }
            });
        });
    },
    getPOGRNProductList: async function (params) {
        return new Promise((resolve, reject) => {
            var legal_entity_id = params.legal_entity_id;
            var user_id = params.userid;
            var poid = params.poid;
            var legal_entity_type_id = [1002, 1014, 1016];
            var response = [];
            if (poid > 0) {
                var productsqry = "select poprod.product_id,po.approval_status,products.product_title as product_name,poprod.qty,poprod.is_tax_included,poprod.no_of_eaches,sum(inward_products.received_qty) as received_qty,poprod.tax_per,poprod.tax_name,poprod.uom,products.sku,products.seller_sku,products.mrp,products.kvi,products.upc,poprod.unit_price,brands.brand_id,brands.brand_name,inventory.mbq,inventory.soh,(poprod.no_of_eaches * poprod.qty) AS actual_po_quantity,inventory.atp,inventory.order_qty,products.pack_size,tot.dlp,tot.base_price,currency.symbol_right as symbol,(CASE WHEN poprod.parent_id=0 THEN poprod.product_id ELSE poprod.parent_id END) AS product_parent_id,poprod.apply_discount,poprod.discount_type,poprod.discount,(CASE WHEN inward_products.received_qty IS NOT NULL THEN (poprod.no_of_eaches * poprod.qty) - inward_products.received_qty ELSE (poprod.no_of_eaches * poprod.qty) END) AS po_quantity from po_products as poprod left join products on products.product_id=poprod.product_id left join po on po.po_id=poprod.po_id left join inward on inward.po_no=po.po_id left join inward_products on inward_products.inward_id=inward.inward_id and poprod.product_id=inward_products.product_id left join brands on products.brand_id=brands.brand_id left join product_tot as tot on products.product_id=tot.product_id and tot.supplier_id=po.legal_entity_id and tot.le_wh_id=po.le_wh_id left join inventory on products.product_id=inventory.product_id and po.le_wh_id=inventory.le_wh_id left join currency on tot.currency_id=currency.currency_id where poprod.po_id=" + poid + " group by poprod.product_id having po_quantity>0 order by product_parent_id asc";
                db.query(productsqry, {}, async function (err, rows) {
                    if (err) {
                        reject('error');
                    }
                    if (Object.keys(rows).length > 0) {
                        //console.log(rows);
                        qtycheck = rows;
                        var productslist = await Promise.all(qtycheck.map((value, key) => module.exports.loopingthroughProducts(value, key, poid)));

                        Promise.all(qtycheck.map((value, key) => module.exports.getProductPackUOMInfo(value.product_id, value.uom))).then(data => {
                            Promise.all(qtycheck.map((value, key) => module.exports.getProductTaxClass(value.product_id, key, 4033, 4033))).then(data => {
                                console.log(qtycheck,'qtycheckqtycheckqtycheckqtycheck');
                                resolve(qtycheck);
                            });
                        });


                    } else {
                        resolve({});
                    }
                });
            }
        });
    },
    loopingthroughProducts: function (value, key, poid) {
        return new Promise(async (resolve, reject) => {
            await module.exports.getGrnQtyByPOProductId(value.product_id, key, poid).then(async (productslist) => {
                resolve(productslist);
            });

        });
    },
    getGrnQtyByPOProductId: function (product_id, key, poid) {
        return new Promise(async (resolve, reject) => {
            console.log(product_id,'product_idproduct_idproduct_idproduct_id');
            var qry = "select orderd_qty,(poprd.qty*poprd.no_of_eaches) AS po_qty,SUM(inwrdprd.received_qty) AS tot_received,SUM(inwrdprd.free_qty) AS tot_free_received from inward join inward_products as inwrdprd on inwrdprd.inward_id=inward.inward_id LEFT JOIN po_products as poprd ON poprd.po_id=inward.po_no and poprd.product_id=inwrdprd.product_id where inward.po_no=" + poid + " and inwrdprd.product_id=" + product_id + " limit 1";
            db.query(qry, {}, async function (err, rows) {
                if (err) {
                    reject('error');
                }
                if (Object.keys(rows).length > 0) {
                    //resolve(rows);
                    if ((rows.tot_received >= rows.po_qty) && rows.tot_received != '') {
                        delete qtycheck.key;
                    } else {
                        if (rows.hasOwnProperty('tot_received') && rows.tot_received != '' && rows.orderd_qty != '' && rows.orderd_qty > rows.tot_received) {
                            qtycheck[key].qty = rows.orderd_qty - rows.tot_received;
                        }
                    }
                    resolve(qtycheck);
                } else {
                    resolve({});
                }
            })
        });
    },
    getProductTaxClass: function (value, index, wh_state_code = 4033, seller_state_code = 4033) {
        var Curl = require('node-libcurl').Curl;
        return new Promise(async (resolve, reject) => {
            var curl = new Curl();
            curl.setOpt(Curl.option.URL, url);
            curl.setOpt('FOLLOWLOCATION', true);
            curl.setOpt(Curl.option.POST, 1);
            curl.setOpt(Curl.option.POSTFIELDS, "product_id=" + value.product_id + "&buyer_state_id=" + wh_state_code + "&seller_state_id=" + seller_state_code);
            curl.on('end', function (statusCode, body, headers) {
                body = JSON.parse(body);
                if (statusCode == 200) {
                    if (body.Status == 200) {
                        qtycheck[index].taxinfo = body.ResponseBody;
                    } else {
                        qtycheck[index].taxinfo = "No data from Api";
                    }
                } else {
                    qtycheck[index].taxinfo = "No data from Api";
                }
                this.close();
                resolve(qtycheck);
            });

            curl.on('error', function (err, curlErrorCode) {
                console.error(err.message);
                console.error('---');
                console.error(curlErrorCode);
                this.close();
            });
            let buffer = curl.perform();

        })
    },

    /* 
    author : Muzzamil,
    previous-author : Nishant,
     */
    getProductPackUOMInfo: function (product_id, pack_size) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(product_id,'product_idproduct_idproduct_id');
                let uomqry = "select lookup.value,lookup.master_lookup_name as uomName,pack.no_of_eaches from product_pack_config as pack left join master_lookup as lookup on pack.level=lookup.value where pack.product_id=" + product_id + " and pack.level=" + pack_size + " limit 1";
                sequelize.query(uomqry, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    if (response.length > 0) {
                        resolve(response);
                    }
                })
            } catch (err) {
                console.log(err);
                reject(err);
            }
            // db.query(uomqry, {}, async function (err, rows) {
            //     if (err) {
            //         reject('error');
            //     }
            //     if (Object.keys(rows).length > 0) {
            //         qtycheck[index].packuom = rows;
            //         resolve(qtycheck);
            //     } else {
            //         resolve({});
            //     }
            // });
        });
    },

    checkGRNCreated: async function (poid, checkgrnproducts) {
        return new Promise((resolve, reject) => {
            try {
                let productId;
                let grn_received;
                let check = true;
                if (Array.isArray(checkgrnproducts)) {
                    // console.log(checkgrnproducts)

                    let po_qty;
                    let tot_received;
                    checkgrnproducts.forEach(async (product) => {
                        // console.log('tttttttt');
                        productId = product.product_id;
                        grn_received = product.received_qty;
                        let podata = await this.getPOQtyByProductId(poid, productId);
                        // console.log('podata',podata);
                        let grndata = await this.getGRNQtyByProductId(poid, productId);
                        // console.log('grndata',grndata);
                        // console.log (podata[0].po_qty, grndata[0].tot_received,grn_received);
                        let po_qty = podata[0].po_qty ? podata[0].po_qty : 0;
                        // console.log('po_qty',po_qty);
                        //120
                        let tot_received = grndata[0].tot_received ? grndata[0].tot_received : 0;
                        // console.log('tot_received',tot_received);
                        //1152
                        let remaining_qty = (po_qty - tot_received);
                        // console.log('sub',grn_received, remaining_qty)
                        if (grn_received > remaining_qty) {
                            check = false;
                            resolve(check);
                        }
                    })
                } else {
                    check = false;
                    // resolve(check);
                }
            } catch (err) {

            }
        })



    },

    getPOQtyByProductId: async function (poid, productId) {
        return new Promise((resolve, reject) => {
            try {
                let query = `SELECT po_id,(poprd.qty*poprd.no_of_eaches) AS po_qty FROM po_products AS poprd
                WHERE po_id = ${poid} AND product_id = ${productId} LIMIT 1;`
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    resolve(response);
                })

            } catch (err) {
                console.log(err);
                reject(err);
            }
        })

    },
    getGRNQtyByProductId: async function (poid, productId) {
        return new Promise((resolve, reject) => {
            try {
                // poid = 0;
                // productId = 31;
                let query = `SELECT orderd_qty,SUM(inwrdprd.received_qty) AS tot_received FROM inward JOIN inward_products AS inwrdprd ON
                inwrdprd.inward_id = inward.inward_id WHERE inward.po_no = ${poid} AND inwrdprd.product_id = ${productId} LIMIT 1 `;
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    resolve(response);
                })

            } catch (err) {
                // console.log(err);
                reject(err);
            }
        })

    },

    checkPOType: async function (poid) {
        return new Promise((resolve, reject) => {
            try {
                // console.log("started successfully",poid)
                let query = `SELECT po_so_order_code FROM po WHERE po_id = ${poid} AND po_so_status = 1;`
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    resolve(response[0]);
                    console.log('response', response[0])
                })
            } catch (err) {

            }
        })
    },

    getPOInfo: async function (poid) {
        return new Promise((resolve, reject) => {
            try {
                // console.log("starddffddfted successfully",poid)
                let query = `SELECT * FROM po WHERE po_id = ${poid} limit 1;`
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    resolve(response[0]);
                    // console.log('response',response)
                })
            } catch (err) {
                reject(err);
            }
        })
    },

    checkPOSOInvoiceStatus: async function (gds_order_id) {
        return new Promise((resolve, reject) => {
            try {
                gds_order_id = 2;
                console.log('gds_order_id', gds_order_id);
                let query = `SELECT gds_order_id FROM gds_invoice_grid WHERE gds_order_id = '${gds_order_id}';`
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    console.log(response, "error handle");
                    let result = [];
                    if (response.length > 0) {
                        result = response[0].gds_order_id;
                        console.log(result, 'result')
                    } else {
                        result = [];
                    }
                    resolve(result);
                })
                // resolve(checkPOInvoice);
            }
            catch (err) {

            }
        })
    },

    getPoApprovalStatusByPoId: (poid) => {
        return new Promise((resolve, reject) => {
            try {
                let query = `SELECT approval_status FROM po WHERE po_id = ${poid};`

                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    let result = response.map(xx => xx.approval_status);
                    // resolve(result);
                    if (result.length > 0 && typeof result[0] != 'undefined') {
                        let approvalStatus = result[0];
                        resolve(approvalStatus);
                    } else {
                        reject();
                    }
                })

            } catch (err) {

            }
        })
    },

    /*
    author : Muzzamil
     */

    getSkus: (supplier_id, le_wh_id, term) => {
        return new Promise((resolve, reject) => {
            try {
                let query = `SELECT p.product_id,p.product_title,p.upc,p.sku,p.pack_size,p.seller_sku,p.mrp,brands.brand_id,
                brands.brand_name  FROM products AS p  LEFT JOIN product_tot AS tot ON p.product_id = tot.product_id 
                LEFT JOIN brands ON p.brand_id = brands.brand_id 
                LEFT JOIN product_content AS content ON p.product_id = content.product_id
                 WHERE tot.supplier_id = '${supplier_id}' AND tot.le_wh_id= '${le_wh_id}' AND
                ( p.sku LIKE '%${term}%'  OR p.product_title LIKE '%${term}%' OR p.upc LIKE '%${term}%')`;
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                    let prodAry = [];
                    if (response.length > 0) {
                        response.forEach((product) => {
                            let arr = {
                                'label': product.product_title,
                                'product_id': product.product_id,
                                'product_title': product.product_title,
                                'brand': product.brand_name,
                                'upc': product.upc,
                                'mrp': `Rs. ${(product.mrp != '') ? product.mrp : 0}`,
                            }
                            prodAry.push(arr);
                        })
                        //    console.log(prodAry);
                    } else {
                        resolve("No data found");
                    }
                    // resolve(response[0]);
                    resolve(prodAry);
                })
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    },

    /*
   author : Muzzamil
    */
    getProductPackStatus: () => {
        return new Promise((resolve, reject) => {
            //try {
            let query = `SELECT lookup.value, lookup.master_lookup_name 
                        FROM master_lookup AS lookup WHERE lookup.mas_cat_id = 91 `;
            sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                if (response.length > 0) {
                    resolve(response);
                } else {
                    reject("no response from getProductPackStatus ")
                }
            })
            // } catch {
            //     reject("Query failed for getProductPackStatus Promise");
            // }
        }
        )
    },

    /*
   author : Muzzamil
    */
    getProductShelfLife: async (product_id) => {
        return new Promise((resolve, reject) => {
            //try {
            let query = `SELECT products.shelf_life,products.shelf_life_uom,
                lookup.master_lookup_name FROM products LEFT JOIN master_lookup AS lookup ON lookup.value = products.shelf_life_uom 
                WHERE products.product_id = ` + product_id + ' LIMIT 1';
            sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(async (response) => {
                if (response.length > 0) {
                    resolve(response);
                } else {
                    console.log("no data");
                    resolve("no data");
                }
            }).catch(err => {
                console.log(err);
            })
            // } catch {
            //     console.log(" getProductShelfLife query failed");
            //     reject(" getProductShelfLife query failed ");
            // }
        })
    },

    getDeliveryGtin: async function (inwardId) {
        return new Promise((resolve, reject) => {
            let query = "select `le`.`gstin` from `legal_entities` left join `inward` on `inward`.`legal_entity_id` = `legal_entities`.`legal_entity_id` left join `legal_entities` as `le` on `le`.`legal_entity_id` = `legal_entities`.`parent_id` where `inward`.`inward_id` =" + inwardId + " limit 1";
            db.query(query, {}, (err, rows) => {
                if (err) {
                    reject('error');
                }
                if (Object.keys(rows).length > 0) {
                    return resolve(rows);
                } else {
                    return resolve([]);
                }
            });
        });
    },

    getBillingAddress: async function (whId) {
        return new Promise((resolve, reject) => {
            let query = "select lwh.lp_wh_name as business_legal_name, `lwh`.`address1`, `lwh`.`address2`, countries.name as country_name, getStateNameById(lwh.state) AS state, getStateCodeById(lwh.state) AS state_code, lwh.tin_number as gstin, `lwh`.`legal_entity_id` from `legalentity_warehouses` as `lwh` left join `countries` on `countries`.`country_id` = `lwh`.`country` where `lwh`.`le_wh_id` =" + whId + " limit 1";
            db.query(query, {}, (err, rows) => {
                if (err) {
                    reject('error');
                }
                if (Object.keys(rows).length > 0) {
                    return resolve(rows[0]);
                } else {
                    return resolve([]);
                }
            });
        });
    },

    isDocExist: async (ref_no, documentType) => {
        try {
            let query = `SELECT * 
            FROM   inward_docs i 
                   JOIN inward id 
                     ON i.inward_id = id.inward_id 
            WHERE  i.doc_ref_no = ${ref_no} 
                   AND i.doc_ref_type = ${documentType}; `

            let response = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            if (response.length > 0) return response.length;
            else return 0;
        } catch (err) {
            return `isDocExist error : ${err}`;
        }
    },

    saveDocument: async (docsObj) => {
        try {
            let query = `INSERT INTO inward_docs (doc_ref_no,po_id,doc_ref_type,allow_duplicate,doc_url,created_by,created_at) 
            VALUES ('${docsObj.doc_ref_no}','${docsObj.po_id}','${docsObj.doc_ref_type}','${docsObj.allow_duplicate}','${docsObj.doc_url}','${docsObj.created_by}','${docsObj.created_at}');`
             let response = await new Promise((resolve,reject) => db.query(query, {}, (err, rows) => {
                // console.log('rows', rows);
                if (err) {
                    reject(err);
                }
                if (Object.keys(rows).length > 0) {
                    resolve(rows);
                } else {
                    resolve(0);
                }
            }));
            return response.insertId
        } catch (err) {
            return `saveDocument error : ${err}`;
        }
    },

    deleteDocument: async (id) => {
        try{
            let query = `DELETE FROM inward_docs WHERE inward_doc_id = ${id};`

            let response = await new Promise((resolve, reject) => db.query(query, {}, (err, rows) => {
                if(err){
                    reject(err);
                }
                if(Object.keys(rows).length > 0) {
                    resolve(rows);
                } else {
                    resolve(0);
                }
            }))

            return response.affectedRows;

        } catch (err) {

        }
    },

    saveReferenceNo: async(id, refNo) => {
        try{
            let query = `UPDATE inward_docs SET doc_ref_no = ${refNo} WHERE inward_doc_id = ${id};`
            let response = await new Promise((resolve, reject) => db.query(query, {}, (err, rows) => {
                if(err){
                    reject(err);
                }

                
                if(Object.keys(rows).length > 0) {
                    resolve(rows);
                } else {
                    resolve(0);
                }
            }))

            return response.affectedRows;
        } catch (err) {

        }
    },

    getDocumentTypes: async () => {
        try {
            let query = `SELECT value, 
            master_lookup_name 
            FROM   master_lookup 
            WHERE  mas_cat_id = 95; `
            let response = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            if (response.length > 0) return response;
            else return 0;

        } catch (err) {
            return `getDocumentTypes error : ${err}`;
        }
    },

    userInfo: async (userId) => {
        try{
            let query = `SELECT firstname, lastname FROM users WHERE user_id = ${userId};`
            let response = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            if (response.length > 0) return response[0];
            else return 0;
        } catch (err) {
            return `userInfo error : ${err}`;
        }
    }, 
    getProductInfo : async (productId)=>{
        return new Promise((resolve,reject)=>{
            let productqry = "select * from products where product_id="+productId+" limit 1";
            sequelize.query(productqry, { type: Sequelize.QueryTypes.SELECT }).then(async (response) => {
                if (response.length > 0) {
                    resolve(response);
                } else {
                    console.log("no data");
                    resolve([]);
                }
            }).catch(err => {
                console.log(err);
                resolve([]);
            })
        })
    },

    getPackPrice : async(poProductQty,packSizeArr)=>{
        return new Promise((resolve,reject)=>{
            //poProductQty=120;
            //console.log(poProductQty,'packSizeArrpackSizeArrpackSizeArr');
            //console.log(packSizeArr,'packSizeArrpackSizeArrpackSizeArrpackSizeArr');
            if(packSizeArr.hasOwnProperty(poProductQty)){
              //  console.log('ifffffffffffffffffffffffffffffff');
                resolve(packSizeArr.poProductQty);
            }else{
                //console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                packSizeArr=(Object.keys(packSizeArr)).sort();
                for(const [packSize,packPrice] of packSizeArr){
                    if(poProductQty>packSize){
                        console.log(packSize);
                        resolve(packSizeArr.packSize);
                        break; 
                    }
                }
            }
        })
    },

    grnSave : async(grnArr)=>{
        return new Promise((resolve,reject)=>{
            var grnColumns = '';
            var grnSaveInfo=''
            for (var key in grnArr) {
                grnColumns  += key + ",";
                grnSaveInfo += "'"+grnArr[key] + "',";
            }
            var grnColumnslastChar = grnColumns.slice(-1);
            if (grnColumnslastChar == ',') {
                grnColumns = grnColumns.slice(0, -1);
            }
            var grnSaveInfolastChar = grnSaveInfo.slice(-1);
            if (grnSaveInfolastChar == ',') {
                grnSaveInfo = grnSaveInfo.slice(0, -1);
            }
            var grnInsertQry= "insert into inward ("+grnColumns+") values ("+grnSaveInfo+")";
      //      console.log(grnInsertQry,'grnInsertQrygrnInsertQry');
            // db.query(grnInsertQry, {}, function (err, rows) {
            //     if (err) {
            //             reject(err)
            //     }
            //     if (Object.keys(rows).length > 0) {
            //         return resolve(rows.insertId);
            //     } else {
            //         return resolve([]);
            //     }
            // });
            resolve(1);
        })
    },

    checkStockInward :async(inward_id,productId)=>{
        try{
            return new Promise((resolve,reject)=> {
                let checkstockbyinwardid = "select stock_inward_id from stock_inward where reference_no ="+inward_id+" and product_id="+productId+" limit 1";
                sequelize.query(checkstockbyinwardid, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                    //console.log(result,'resultresultresultresultresult');
                     if (result != '' && result.length > 0) {
                          resolve(result[0].stock_inward_id);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            })
        }catch (err) {
              console.log(err)
        }
    },
    getProductByOrderId :async(gds_order_id,productId)=>{
        try{
            return new Promise((resolve,reject)=> {
                let checkstockbyinwardid = "select product.*,GROUP_CONCAT(DISTINCT(`master_lookup`.`master_lookup_name`) ) as starname,GROUP_CONCAT(DISTINCT(master_lookup.description) ) as starcolor,currency.code,(product.price / product.qty) as unitPrice,orders.le_wh_id,orders.order_code,orders.order_status_id,orders.shop_name,currency.symbol_left as symbol,(CASE WHEN ISNULL(`product`.`parent_id`) THEN `product`.`product_id` ELSE `product`.`parent_id` ) AS `parent_id`,getInvoicePrdQty (product.gds_order_id,product.product_id)  AS invoiced_qty from gds_order_products as product join gds_orders as orders on orders.gds_order_id=product.gds_order_id left join gds_order_product_pack as gop on product.product_id=gop.product_id and orders.gds_order_id=gop.gds_order_id left join master_lookup on master_lookup.value=gop.star join currency on orders.currency_id=currency.currency_id";

                if(productId.length>0){
                    checkstockbyinwardid += " where product.product_id in ("+productId+")"                    
                }

                if(Array.isArray(gds_order_id) && gds_order_id.length>0){
                    checkstockbyinwardid += " and product.gds_order_id in ("+gds_order_id+") group by orders.gds_order_id";
                }else{
                    checkstockbyinwardid += " and product.gds_order_id in ("+gds_order_id+")";
                }

                checkstockbyinwardid += " group by product.product_id order by product.pname asc,parent_id asc";

                sequelize.query(checkstockbyinwardid, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                     if (result != '' && result.length > 0) {
                          resolve(result[0]);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            })
        }catch (err) {
              console.log(err)
        }
    },

    getTaxPercentageOnGdsProductId: async(gds_order_prod_id)=>{
        try{
            return new Promise((resolve,reject)=> {
                let taxbygdsproductqry = "select sum(tax) as tax_percentage , tax_class,tax.CGST,tax.IGST,tax.SGST,tax.UTGST from gds_orders_tax as tax where tax.gds_order_prod_id ="+gds_order_prod_id+" limit 1";
                //sequelize.query(checkfreebee).then(result => {
                sequelize.query(taxbygdsproductqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                    //console.log(result,'resultresultresultresultresult');
                     if (result != '' && result.length > 0) {
                          resolve(result[0]);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            })
        }catch (err) {
              console.log(err)
        }
    },

    saveGrnProducts : async(grnProducts)=>{
        return new Promise((resolve,reject)=>{
            var grnPrdColumns = '';
            var grnPrdSaveInfo='';
            for (const key of grnProducts) {
                grnPrdColumns  = '';
                grnPrdSaveInfo = '';
                for(const [columnkey,grnPrdArr] of Object.entries(key)){
                    grnPrdColumns  += columnkey + ",";
                    grnPrdSaveInfo += "'"+ grnPrdArr + "',";
                }
            
                    var grnPrdColumnslastChar = grnPrdColumns.slice(-1);
                    if (grnPrdColumnslastChar == ',') {
                        grnPrdColumns = grnPrdColumns.slice(0, -1);
                    }
                    var grnPrdSaveInfolastChar = grnPrdSaveInfo.slice(-1);
                    if (grnPrdSaveInfolastChar == ',') {
                        grnPrdSaveInfo = grnPrdSaveInfo.slice(0, -1);
                    }                    
                    var insertqry = "insert into inward_products("+grnPrdColumns+") values ("+grnPrdSaveInfo+")";
                    db.query(insertqry, {}, function (err, rows) {
                        if (err) {
                                reject(err)
                        }
                        if (Object.keys(rows).length > 0) {
                            return resolve(rows.insertId);
                        } else {
                            return resolve(0);
                        }
                    });
            }
        })
    },

    saveInputTax : async(inputTax)=>{
        return new Promise((resolve,reject)=>{
            var grnTaxColumns = '';
            var grnTaxSaveInfo='';
            for (const key of inputTax) {
                grnTaxColumns = '';
                grnTaxSaveInfo='';
                for(const [columnkey,grnTaxArr] of Object.entries(key)){
                    grnTaxColumns  += columnkey + ",";
                    grnTaxSaveInfo += "'"+grnTaxArr + "',";
                }
            
                var grnTaxPrdColumnslastChar = grnTaxColumns.slice(-1);
                if (grnTaxPrdColumnslastChar == ',') {
                    grnTaxColumns = grnTaxColumns.slice(0, -1);
                }
                var grnTaxPrdSaveInfolastChar = grnTaxSaveInfo.slice(-1);
                if (grnTaxPrdSaveInfolastChar == ',') {
                    grnTaxSaveInfo = grnTaxSaveInfo.slice(0, -1);
                }
                var insertqry = "insert into input_tax("+grnTaxColumns+") values ("+grnTaxSaveInfo+")";
               db.query(insertqry, {}, function (err, rows) {
                    if (err) {
                            reject(err)
                    }
                    if (Object.keys(rows).length > 0) {
                        return resolve(rows.insertId);
                    } else {
                        return resolve(0);
                    }
                });
            }
        })
    },

    saveGrnProductDetails : async(grnProductsDetails)=>{
        return new Promise((resolve,reject)=>{
            var grnPrdDtlsColumns = '';
            var grnPrdDtlsSaveInfo='';
            for (const key of grnProductsDetails) {
                grnPrdDtlsColumns = '';
                grnPrdDtlsSaveInfo='';
                for(const [columnkey,grnPrdDtlsArr] of Object.entries(key)){
                    grnPrdDtlsColumns  += columnkey + ",";
                    grnPrdDtlsSaveInfo += "'"+grnPrdDtlsArr + "',";
                }
            //}
                var grnPrdDtlsColumnslastChar = grnPrdDtlsColumns.slice(-1);
                if (grnPrdDtlsColumnslastChar == ',') {
                    grnPrdDtlsColumns = grnPrdDtlsColumns.slice(0, -1);
                }
                var grnPrdDtlsSaveInfolastChar = grnPrdDtlsSaveInfo.slice(-1);
                if (grnPrdDtlsSaveInfolastChar == ',') {
                    grnPrdDtlsSaveInfo = grnPrdDtlsSaveInfo.slice(0, -1);
                }
                var insertqry = "insert into inward_product_details("+grnPrdDtlsColumns+") values ("+grnPrdDtlsSaveInfo+")";
                console.log(insertqry,'insertqryinsertqryinsertqry');
                db.query(insertqry, {}, function (err, rows) {
                    if (err) {
                            reject(err)
                    }
                    if (Object.keys(rows).length > 0) {
                        return resolve(rows.insertId);
                    } else {
                        return resolve(0);
                    }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                });
            }
        })
    },

    updateTaxValues : async(inward_id)=>{
        try{
            inward_id=15118;
            return new Promise((resolve,reject)=> {
                if(inward_id>0){
                    let getInwardPrdList = "select inward_products.inward_prd_id,po_products.hsn_code,po_products.tax_data,inward_products.tax_amount from inward_products left join inward on inward.inward_id=inward_products.inward_id left join po_products on po_products.product_id=inward_products.product_id and inward.po_no=po_products.po_id where inward_products.inward_id="+inward_id+" group by inward_products.product_id";
                    sequelize.query(getInwardPrdList, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                         if (result != '' && result.length > 0) {
                              for( const inwardPrdlst of result){
                                var inputData=[];
                                var taxInfo = [];
                                var taxDetails = [];
                                var inward_prd_id = inwardPrdlst.hasOwnProperty('inward_prd_id')?inwardPrdlst.inward_prd_id:0;
                                var hsnCode = inwardPrdlst.hasOwnProperty('hsn_code')?inwardPrdlst.hsn_code:'';
                                var taxData = inwardPrdlst.hasOwnProperty('tax_data')?inwardPrdlst.tax_data:'';
                                var taxAmount = inwardPrdlst.hasOwnProperty('tax_amount')?inwardPrdlst.tax_amount:0.00;
                                inputData['hsn_code'] =hsnCode;
                                taxDetails = taxData;

                                if(taxDetails.length>0){
                                    //console.log(taxDetails,'taxDetailstaxDetailstaxDetails');
                                    taxInfo = taxDetails[0];
                                    var CGST    = taxInfo.hasOwnProperty('CGST')?taxInfo.CGST: 0
                                    var IGST    = taxInfo.hasOwnProperty('IGST')?taxInfo.IGST: 0
                                    var SGST    = taxInfo.hasOwnProperty('SGST')?taxInfo.SGST: 0
                                    var UTGST    = taxInfo.hasOwnProperty('UTGST')?taxInfo.UTGST: 0
                                
                                    CGST = (CGST/100) * taxAmount;
                                    IGST = (IGST/100) * taxAmount;
                                    SGST = (SGST/100) * taxAmount;
                                    UTGST = (UTGST/100) * taxAmount;
                                    
                                    taxInfo['CGST_VALUE'] = CGST;
                                    taxInfo['IGST_VALUE'] = IGST;
                                    taxInfo['SGST_VALUE'] = SGST;
                                    taxInfo['UTGST_VALUE'] = UTGST;
                                }
                                //taxInfo[] = taxInfo;
                                //inputData['tax_data'] = 
                              }
                         } else {
                              resolve(0);
                         }
                    }).catch(err => {
                        console.log(err);
                         reject(err);
                    })
                }
            })
        }catch (err) {
              console.log(err)
        }        
    },

    getPoApprovalStatusByPoId : async(poId)=>{
        return new Promise((resolve,reject)=>{
            try{
                var approvalStatus = 0;
                if(poId>0){
                    var approvalStatusDataqry = "select approval_status from po where po_id="+poId;
                    sequelize.query(approvalStatusDataqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                         if (result != '' && result.length > 0) {
                              resolve(result[0].approval_status);
                         } else {
                              resolve(0);
                         }
                    }).catch(err => {
                        console.log(err);
                         reject(err);
                    })
                }
            }catch (err) {
                  console.log(err)
            }   
        })
    },

    updateElpData :async(inward_id,userid)=>{
        return new Promise((resolve,reject)=>{
            try{
                var elpDataArr=[];
                if(inward_id){
                    var elpDetailsqry = "select po.po_id,inward_products.product_id,po.le_wh_id,po.legal_entity_id as supplier_id,inward_products.cur_elp AS elp,NOW() AS effective_date from inward_products left join inward on inward.inward_id=inward_products.inward_id left join po on po.po_id=inward.po_no where inward.inward_id="+inward_id+" having elp > 0";
                    sequelize.query(elpDetailsqry, { type: Sequelize.QueryTypes.SELECT }).then(async (elpDetails) => {
                        //console.log(result,'resultresultresultresultresult');
                         if (elpDetails != '' && elpDetails.length > 0) {
                              var childPOexist = await purchaseOrder.checkChildPoExist(elpDetails[0].po_id);
                              var wh_data = await purchaseOrder.getLEWHById(elpDetails[0].le_wh_id);
                              var wh_legal_entity_id = wh_data.legal_entity_id;
                              var wh_state_id = wh_data.state_id;
                              var checkDCFC = await module.exports.getLegalEntityTypeId(wh_legal_entity_id);
                              var dc_le_wh_id = 0;

                              if(checkDCFC == 1014){
                                var params = { 'legalentity': wh_legal_entity_id, 'fields': 'dc_le_wh_id' };
                                dc_le_wh_id = await role.getDCFCData(params);
                                dc_le_wh_id = dc_le_wh_id[0].hasOwnProperty('dc_le_wh_id')?dc_le_wh_id[0].dc_le_wh_id:0;
                              }else if(checkDCFC == 1016){
                                var supplier_id = elpDetails[0].supplier_id;
                                var check_supplier = await purchaseOrder.getWHByLEId(supplier_id);

                                if(check_supplier.length>0){
                                    dc_le_wh_id = check_supplier[0].le_wh_id
                                }else{
                                    dc_le_wh_id = await purchaseOrder.getApobData(wh_legal_entity_id);
                                    dc_le_wh_id = dc_le_wh_id[0].hasOwnProperty('dc_le_wh_id')?dc_le_wh_id[0].dc_le_wh_id:0;    
                                }
                              }

                              for(const elpData of elpDetails){
                                elpData['created_by']=userid;
                                var productId = elpData.hasOwnProperty('product_id')?elpData.product_id:0;

                                if(productId > 0){
                                    var elp = await module.exports.getCurrentElpByPrdPO(elpDetails[0].po_id,productId);

                                    elpData['elp'] = elp.cur_elp;

                                    if(childPOexist > 0){
                                        elp = await module.exports.getCurrentElpByParentPrdPO(elpDetails[0].po_id,productId);
                                        elpData['elp'] = elp.cur_elp;
                                    }

                                    elpData['actual_elp'] = elpData['elp'];

                                    if(dc_le_wh_id!=0){
                                        var actual_elp = await module.exports.getActualELPByLEWHIDprdId(dc_le_wh_id,productId);

                                        if(actual_elp!=""){
                                            elpData['actual_elp'] = actual_elp;
                                        }
                                        elpDataArr.push(elpData);
                                    }
                                }
                              }
                              //purchase price inser query
                              console.log(elpDataArr,'elpDataArrelpDataArrelpDataArr');
                                resolve(1);
                         } else {
                            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
                              resolve(0);
                         }
                    }).catch(err => {
                        console.log(err);
                         reject(err);
                    })

                }
            }catch (err) {
                  console.log(err)
            }
        })
    },

    saveStockInwardNew: async(inward_code,warehouse,stockInward,productInfo,stock_transfer=0,stock_transfer_dc=0,po_id=0)=>{
        return new Promise(async (resolve,reject)=>{
            try{
                var stockInwardId =await module.exports.saveInwardStock(stockInward);
                
                if(productInfo.length>0){
                    //code commented in grn       
                }   
                var response = await inventoryModel.inventoryStockInward(productInfo,warehouse,inward_code,1);

                if(stock_transfer==1){
                    inventoryModel.inventoryStockOutward(productInfo, stock_transfer_dc, 1, po_id, 3);
                }

                resolve(stockInwardId);
            }catch (err) {
                  console.log(err)
            }
        })
    },

    /*checkPOType: async(po_id)=>{
        return new Promise((resolve,reject)=>{
            try{
                var posoorderqry = "select po_so_order_code from po where po_id="+po_id+" and po_so_status=1 limit 1";
                sequelize.query(posoorderqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                         if (result != '' && result.length > 0) {
                              resolve(result[0].approval_status);
                         } else {
                              resolve(0);
                         }
                    }).catch(err => {
                        console.log(err);
                         reject(err);
                    })                   
            }catch (err) {
                  console.log(err)
            }
        })
    },*/

    saveStockInward: async()=>{
        return new Promise((resolve,reject)=>{
        try
        {
            var stockInwardId=0;

            if(inwardId>0){
                var productList =[];
                var inwardDeailsqry = "select inward.le_wh_id, inward.inward_code, inward.po_no, inward_products.product_id, inward_products.received_qty,inward_products.free_qty, inward_products.damage_qty, inward_products.missing_qty,inward_products.excess_qty, inward_products.quarantine_stock,inward_products.orderd_qty FROM inward LEFT JOIN inward_products ON inward_products.inward_id=inward.inward_id WHERE inward_products.inward_id="+inwardId;
                sequelize.query(inwardDeailsqry, { type: Sequelize.QueryTypes.SELECT }).then(async (result) => {
                        //console.log(result,'resultresultresultresultresult');
                     if (result != '' && result.length > 0) {
                          var data = [];
                          var ref_type = "Grn";
                          var i=0;
                          var productInfo=[];
                          var inwardCode = 0;
                          var leWhId = 0;
                          var productId =0;
                          var productList=[];
                          var checkStockInward ='';
                          var stockInwardInsertQry='';
                          for(const inwardProducts of result[0]){
                            productId = inwardProducts.product_id;
                            productList.push(productId);

                            checkStockInwardQry = "select stock_inward_id from stock_inward where reference_no="+inwardId+" and product_id="+productId+" limit 1";

                            sequelize.query(checkStockInwardQry, { type: Sequelize.QueryTypes.SELECT }).then(async (checkStockInward) => {
                                
                                    inwardCode= inwardProducts[0].inward_code;
                                    leWhId = inwardProducts[0].le_wh_id;

                                    if(checkStockInward.lengt==0){
                                        var stockInward = [];
                                        stockInward['le_wh_id']=inwardProducts.le_wh_id;
                                        stockInward['product_id']=inwardProducts.product_id;
                                        stockInward['good_qty']=(inwardProducts.received_qty - 
                                        (inwardProducts.damage_qty + inwardProducts.missing_qty + inwardProducts.quarantine_stock));
                                        stockInward['free_qty']=inwardProducts.free_qty;
                                        stockInward['dnd_qty']=inwardProducts.missing_qty;
                                        stockInward['dit_qty']=inwardProducts.damage_qty;
                                        stockInward['quarantine_qty']=inwardProducts.quarantine_stock;
                                        stockInward['po_no']=inwardProducts.po_no;
                                        stockInward['reference_no']=inwardId;
                                        stockInward['inward_date']=inwardProducts.le_wh_id;
                                        stockInward['status']='';
                                        stockInward['created_by']=userid;

                                        stockInwardInsertQry= await saveInwardStock(stockInward);
                                        var productData = [];
                                        productData['product_id'] = inwardProducts.product_id;
                                        $productData['soh'] = (inwardProducts.received_qty - 
                                                    (inwardProducts.damage_qty + inwardProducts.missing_qty + inwardProducts.quarantine_stock));
                                        productData['free_qty'] = inwardProducts.free_qty;
                                        productData['quarantine_qty'] = inwardProducts.quarantine_stock;
                                        productData['dit_qty'] = inwardProducts.damage_qty;  //damage in transit
                                        productData['dnd_qty'] = inwardProducts.missing_qty;
                                        
                                        productInfo.push(productData);
                                    }
                                
                            })


                          }
                            if(productInfo.length>0){
                                //code commented in grn       
                               
                                var response = await inventoryModel.inventoryStockInward(productInfo,leWhId,inwardCode,1);

                                if(response){

                                }else{
                                    console.log('Error from inventory model inventoryStockInward for inward '.$inwardCode);
                                }
                            }
                        resolve(stockInwardId);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }
        }catch (err) {
                  console.log(err)
        }  
        })
    },

    assetProductDetails: async(inwardId)=>{
        return new Promise((resolve,reject)=>{
            try{
                var qty = 0;
                var product_id=0;
                var createdByID=0;
                var purchase_date=0;
                var invoice_no = 0;
                var businessunitname =0;
                var warentyEndDate= 0;
                var WarrantyYear =0;
                var WarrantyMonts =0;
                var depresiationDate=0;
                var depresiation_month=0;
                var depresiation_per_month=0;
                var asset_category_id =0;
                var isManualImport=0;
                var qty_data = [];
                var productList = "select products.product_id,products.business_unit_id,products.asset_category,inward_products.received_qty as qty,inward_products.created_by,inward.invoice_no,inward.invoice_date from inward_products left join inward on inward.inward_id=inward_products.inward_id left join products on products.product_id=inward_products.product_id where products.product_type_id=130001 and inward_products.inward_id="+inwardId;
                sequelize.query(productList, { type: Sequelize.QueryTypes.SELECT }).then(async (response) => {
                   if(response.length>0){
                        for(const productData of response[0]){
                            qty = productData.hasOwnProperty('qty') ? productData.qty : 0;
                            product_id = productData.hasOwnProperty('product_id') ? productData.product_id : 0;
                            createdByID = productData.hasOwnProperty('created_by') ? productData.created_by : 0;
                            purchase_date = productData.hasOwnProperty('invoice_date') ? productData.invoice_date : "";
                            invoice_no = productData.hasOwnProperty('invoice_no') ? productData.invoice_no : 0;

                            //sending values from import excel
                            businessunitname = productData.hasOwnProperty('business_unit_id') ? $productData.business_unit_id : 0;
                            
                            warentyEndDate =productData.hasOwnProperty('warranty_end_date') ? productData.warranty_end_date : 0;
                            WarrantyYear =productData.hasOwnProperty('WarrantyYear') ? productData.WarrantyYear : 0;
                            WarrantyMonts =productData.hasOwnProperty('WarrantyMonts') ? productData.WarrantyMonts : 0;

                            depresiationDate =productData.hasOwnProperty('depresiation_date') ? productData.depresiation_date : 0;
                            depresiation_month =productData.hasOwnProperty('depresiation_month') ? productData.depresiation_month : 0;
                            depresiation_per_month =productData.hasOwnProperty('depresiation_per_month') ? productData.depresiation_per_month : 0;
                            asset_category_id=productData.hasOwnProperty('asset_category')?productData.asset_category:0;

                            isManualImport = productData.hasOwnProperty('is_manual_import') ? productData.is_manual_import : 0;
                        
                            for ( i = 1; i <= qty; i++){

                                qty_data = []; 
                                qty_data['product_id']          =      product_id;
                                qty_data['purchase_date']       =      purchase_date;
                                qty_data['invoice_number']      =      invoice_no;
                                qty_data['is_working']          =      "Yes";
                                qty_data['business_unit']       =      businessunitname;

                                qty_data['warranty_end_date']   =      warentyEndDate;
                                qty_data['warranty_year']       =      WarrantyYear;
                                qty_data['warranty_month']      =      WarrantyMonts;

                                qty_data['created_by']          =      createdByID;
                                qty_data['is_manual_import']    =      isManualImport;
                                qty_data['depresiation_date']   =      depresiationDate;
                                qty_data['depresiation_per_month']=    depresiation_per_month;
                                qty_data['depresiation_month']  =      depresiation_month;
                                qty_data['asset_category']      =      asset_category_id;
                                qty_data['asset_status']        =      1;  
                                  

                                await module.exports.saveQtyWiseProducts(qty_data);
                        }

                        }
                        resolve(1);
                   }
                })
            }catch (err) {
                  console.log(err)
            }
        })
    },

    saveQtyWiseProducts: async(qty_data)=>{
        return new Promise((resolve,reject)=>{
            try{

            }catch (err) {
                  console.log(err)
            }
        })
    },

    getTotalInwardQtyById:async(poid)=>{
        return new Promise((resolve,reject)=>{
            try{
             var query ="select SUM(inward_products.received_qty) as totQty from inward_products left join inward on inward.inward_id=inward_products.inward_id where inward.po_no="+poid+" group by inward.po_no limit 1";
             
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0].totQty);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })                
            }catch (err) {
                  console.log(err)
            }
        })
    },

    getInvoiceGridOrderId: async(gds_order_id,fieldsList)=>{
        return new Promise((resolve,reject)=>{
            try{
            var invoiceqry= "select "+fieldsList+" FROM gds_invoice_grid as grid where grid.gds_order_id="+gds_order_id;
                sequelize.query(invoiceqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0]);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }catch (err) {
                  console.log(err)
            }
        })
    },

    remittanceMapping : async(remittanceArray)=>{
        return new Promise((resolve,reject)=>{
            try{
                var remittanceColumns = '';
                var remittanceSaveInfo='';
                for (const key of remittanceArray) {
                //    console.log(key,'=====================');
                    for(const [columnkey,remittance] of Object.entries(key)){
              //          console.log(columnkey,'=====================',grnTaxArr);
                        remittanceColumns  += columnkey ;
                        remittanceSaveInfo += "'"+remittance + "',";
                    }
                }
                var grnremittanceColumnslastChar = remittanceColumns.slice(-1);
                if (grnremittanceColumnslastChar == ',') {
                    remittanceColumns = remittanceColumns.slice(0, -1);
                }
                var remittanceSaveInfolastChar = remittanceSaveInfo.slice(-1);
                if (remittanceSaveInfolastChar == ',') {
                    remittanceSaveInfo = remittanceSaveInfo.slice(0, -1);
                }


            }catch (err) {
                  console.log(err)
            }
        })
    },

    collectionRemittanceMapping : async(collectionremittanceArray)=>{
        return new Promise((resolve,reject)=>{
            try{
                var collectionremittanceColumns = '';
                var collectionremittanceSaveInfo='';
                for (const key of remittanceArray) {
                //    console.log(key,'=====================');
                    for(const [columnkey,remittance] of Object.entries(key)){
              //          console.log(columnkey,'=====================',grnTaxArr);
                        collectionremittanceColumns  += columnkey ;
                        collectionremittanceSaveInfo += "'"+remittance + "',";
                    }
                }
                var collectionremittanceColumnslastChar = collectionremittanceColumns.slice(-1);
                if (collectionremittanceColumnslastChar == ',') {
                    collectionremittanceColumns = collectionremittanceColumns.slice(0, -1);
                }
                var collectionremittanceSaveInfolastChar = remittanceSaveInfo.slice(-1);
                if (collectionremittanceSaveInfolastChar == ',') {
                    collectionremittanceSaveInfo = collectionremittanceSaveInfo.slice(0, -1);
                }
            }catch (err) {
                  console.log(err)
            }
        })
    },

    getUserByLegalEntityId :async(legal_entity_id)=>{
        return new Promise((resolve,reject)=>{
            try{
                var tokenqry = "select password_token,user_id from users where legal_entity_id="+legal_entity_id+" and is_active =1 and is_parent=0";
                sequelize.query(tokenqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0]);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })   
            }catch (err) {
                  console.log(err)
            }
        })
    },

    getOrderInfo :async(orderIds,fields)=>{
        return new Promise((resolve,reject)=>{
            try{
             var orderstsqry = "select "+fields+" from gds_orders as orders where orders.gds_order_id="+orderIds;   
                sequelize.query(orderstsqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0]);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }catch (err) {
                  console.log(err)
            }
        })
    },

    getInwardProductID : async(prdId,inwardId)=>{
      return new Promise((resolve,reject)=>{
            try{
             var inwrdprdqry = "SELECT inward_prd_id from inward_products where product_id="+prdId+" and inward_id="+inwardId;
                sequelize.query(inwrdprdqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0].inward_prd_id);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }catch (err) {
                  console.log(err)
            }
        })  
    },

    getCurrentElpByPrdPO : async(poId,productId)=>{
      return new Promise((resolve,reject)=>{
            try{
             var curelpqry = "SELECT pp.cur_elp from po left join po_products as pp ON po.po_id=pp.po_id where po.po_id="+poId+" and pp.product_id="+productId+ "  limit 1";
                sequelize.query(curelpqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0].cur_elp);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }catch (err) {
                  console.log(err)
            }
        })  
    },

    getCurrentElpByParentPrdPO : async(poId,productId)=>{
      return new Promise((resolve,reject)=>{
            try{
             var curelpqry = "SELECT pp.cur_elp from po left join po_products as pp ON po.po_id=pp.po_id where po.parent_id="+poId+" and pp.product_id="+productId+"  limit 1";
                sequelize.query(curelpqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0].cur_elp);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }catch (err) {
                  console.log(err)
            }
        })  
    },

    getActualELPByLEWHIDprdId : async(dcId,productId)=>{
      return new Promise((resolve,reject)=>{
            try{
             var curelpqry = "SELECT actual_elp from purchase_price_history where le_wh_id="+dcId+" and product_id="+productId+" order by created_at desc limit 1";
                sequelize.query(curelpqry, { type: Sequelize.QueryTypes.SELECT }).then(result => {
                        //console.log(result,'resultresultresultresultresult');
                if (result != '' && result.length > 0) {
                          resolve(result[0].actual_elp);
                     } else {
                          resolve(0);
                     }
                }).catch(err => {
                    console.log(err);
                     reject(err);
                })
            }catch (err) {
                  console.log(err)
            }
        })  
    },

    saveInwardStock : async(saveStock)=>{
        return new Promise((resolve,reject)=>{
            var stkInwardColumns = '';
            var stkInwardSaveInfo='';
            for (const key of saveStock) {
                stkInwardColumns = '';
                stkInwardSaveInfo='';
                for(const [columnkey,saveStockArr] of Object.entries(key)){
                    stkInwardColumns  += columnkey + ",";
                    stkInwardSaveInfo += "'"+saveStockArr + "',";
                }
            //}
                var stkInwardColumnslastChar = stkInwardColumns.slice(-1);
                if (stkInwardColumnslastChar == ',') {
                    stkInwardColumns = stkInwardColumns.slice(0, -1);
                }
                var stkInwardSaveInfolastChar = stkInwardSaveInfo.slice(-1);
                if (stkInwardSaveInfolastChar == ',') {
                    stkInwardSaveInfo = stkInwardSaveInfo.slice(0, -1);
                }
                var insertqry = "insert into stock_inward("+stkInwardColumns+") values ("+stkInwardSaveInfo+")";
                console.log(insertqry,'insertqryinsertqryinsertqry');
                // db.query(insertqry, {}, function (err, rows) {
                //     if (err) {
                //             reject(err)
                //     }
                //     if (Object.keys(rows).length > 0) {
                //         return resolve(rows.insertId);
                //     } else {
                //         return resolve(0);
                //     }
                // }).catch(err => {
                //     console.log(err);
                //      reject(err);
                // });
            }
        })
    },

    getCSV : async (fromDate, toDate) => {
        try{
            let query = `CALL getGRNReport('${fromDate}','${toDate}')`;
            let response = await new Promise((resolve,reject) => db.query(query,{}, (err, rows) => {
                if(err){
                    reject(err);
                }
                if(Object.keys(rows).length > 0) {
                    resolve(rows);
                } else {
                    resolve(0);
                }
            }
            
            ))

            // console.log('response', response);
            return response;
            
            
        } catch (err) {
            console.log("getCSV error", err);
            return "";
        }
    },

    getPOHistory: async (poCode) => {
        try {
            return new Promise(async (resolve, reject) => {
                let totalHistory;
                let history;
                let value;
                let poId;

                //get the poId from poCode
                let poQuery = `SELECT po_id FROM po WHERE po_code = '${poCode}';`
                        let result = await sequelize.query(poQuery, { type: Sequelize.QueryTypes.SELECT })
                        poId = result[0].po_id;
    
                //getting approvalHistory from appr_comments table
                //get value dynamically (value = 56015)
                let query = `SELECT value FROM master_lookup WHERE master_lookup_name = 'Purchase Order'  AND mas_cat_id = 56;`
                sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
                    .then(response => {
                        value = response[0].value;
                    })
                    //get comments from appr_comments table
                    .then(() => {
                        let query1 = `SELECT comments FROM appr_comments WHERE comments_id = ${poId} AND awf_for_type_id = ${value};`
                        sequelize.query(query1, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                            if (response.length > 0) {
                                history = response[0].comments;
                                history = JSON.parse(history);
                                if (Array.isArray(history) || history.length > 0) {
                                    history = history.reverse();
                                    resolve(history);
                                } else {
                                    history = [];
                                    resolve(history);
                                }
                            }
    
                            // get details from appr_workflow_history table
                            else {
                                let query2 = `SELECT us.profile_picture, us.firstname, us.lastname, group_concat(rl.name) 
                                AS 
                                  name, 
                                  hs.created_at, hs.status_to_id, hs.status_from_id, hs.awf_comment, ml.master_lookup_name 
                                  FROM appr_workflow_history 
                                AS 
                                  hs 
                                  JOIN users 
                                AS 
                                  us ON us.user_id=hs.user_id 
                                  JOIN user_roles 
                                AS 
                                  ur ON ur.user_id=hs.user_id 
                                  JOIN roles 
                                AS 
                                  rl ON rl.role_id=ur.role_id 
                                  JOIN master_lookup 
                                AS 
                                  ml ON ml.value=hs.status_to_id 
                                  WHERE hs.awf_for_id = ${poId} 
                                  AND hs.awf_for_type = 'Purchase Order' 
                                  GROUP BY hs.created_at 
                                  ORDER BY hs.created_at DESC ;`
    
                                sequelize.query(query2, { type: Sequelize.QueryTypes.SELECT }).then(response => {
                                    history = response;
                                    resolve(history);
                                })
    
                            }
                        })
                    })
            })
        } catch (err) {
            console.lo("getApprovalHistory Error", err);
            reject(err);
        }
    }

}
