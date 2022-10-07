import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MapMasterBoxForTransferWarehouseToAnotherWarehousePage } from '../map-master-box-for-transfer-warehouse-to-another-warehouse/map-master-box-for-transfer-warehouse-to-another-warehouse';

/**
* Generated class for the FiltersPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {


  tab_active:any = 'transactional';
  search:any = {};
  today_date = new Date().toISOString().slice(0,10);
  from:any='no_where'
  selected_warehouse:any=''
  ware_house_list:any=[]



  constructor(public navCtrl: NavController,private alertCtrl: AlertController, public navParams: NavParams,public viewcontrol:ViewController,public dbService:DbserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltersPage');
  }

  ionViewWillEnter(){
    console.log(this.navParams);
    if(this.navParams['data']['filter'] && this.navParams['data']['from'] == "account-statement-page"){
      this.search = this.navParams['data']['filter'];
      this.from = this.navParams['data']['from']
      console.log(this.search);
    }

    if(this.navParams['data']['from'] == "ready-to-dispatch-order-list-page"){
      this.from = this.navParams['data']['from']
      console.log(this.search);
      this.get_warehouse_data();
    }

    if(this.navParams['data']['from'] == "activity-notification-page"){
      this.search = this.navParams['data']['filter'];
      this.from = this.navParams['data']['from']
      console.log("Activity Data : ",this.search);
    }

  }

  closeModal(values:any=''){
    // this.viewcontrol.dismiss(this.data.work_type);
    this.viewcontrol.dismiss(values);

  }

  get_account_statement_list(){
    console.log("get_account_statement_list method calls");
    console.log(this.search);
    this.viewcontrol.dismiss(this.search);
  }

  get_warehouse_data(){
    console.log("get_warehouse_data method calls");
    this.dbService.onPostRequestDataFromApi({},"BoxPackaging/ware_house_listing", this.dbService.rootUrlSfa).subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      this.ware_house_list = resp['ware_house_listing']


    },err=>
    {
      this.dbService.dismiss_loading();

    })
    setTimeout(() => {
      this.dbService.dismiss_loading();

    }, 2000);

  }

  go_to(where:any=''){
    console.log("go_to method calls");
    console.log("where = "+where);

    if(where == 'scan_master_box_for_transfer'){
      // this.closeModal('minimise')
      this.navCtrl.push(MapMasterBoxForTransferWarehouseToAnotherWarehousePage,{'selected_ware_house_id' : this.selected_warehouse,'from':'filters_page'});

    }
    else{

      const alert = this.alertCtrl.create({
        title: 'Error. . .',
        message: 'Something Went Wrong, Please try again !',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('Cancel clicked');
              this.closeModal('minimise')
            }
          },
        ]
      })

      alert.present();
    }


  }

  //for testing purpose only
  test(){
    console.log("in test");
    console.log(this.selected_warehouse);


  }

  get_activity_list(){
    console.log("get_activity_list method calls");
    console.log(this.search);
    this.viewcontrol.dismiss(this.search);
  }


}
