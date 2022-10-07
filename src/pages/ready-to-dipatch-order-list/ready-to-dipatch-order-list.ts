import { Component, ViewChild } from '@angular/core';
import { AlertController, App, IonicPage, ModalController, Nav, NavController, NavParams, ToastController } from 'ionic-angular';
import { GenerateMasterCartForOrderDispatchPage } from '../generate-master-cart-for-order-dispatch/generate-master-cart-for-order-dispatch';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ScannedMasterQrCodeDetailPage } from '../scanned-master-qr-code-detail/scanned-master-qr-code-detail';
import { Storage } from '@ionic/storage';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { FiltersPage } from '../filters/filters';
import { ShowDetailsOfCalculatedStockPage } from '../show-details-of-calculated-stock/show-details-of-calculated-stock';



/**
* Generated class for the ReadyToDipatchOrderListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-ready-to-dipatch-order-list',
  templateUrl: 'ready-to-dipatch-order-list.html',
})
export class ReadyToDipatchOrderListPage {

  @ViewChild(Nav) nav: Nav;
  tab_active:any = 'Ready2Dispatch';
  master_qr_code:any = ''
  secondary_qr_code:any = ''
  order_list_for_dispatch_order:any = []
  start:any=0;
  limit:any=10;
  stop_pagination:boolean = false;
  scanned_master_QR_code_id: any = '';
  product_stock_qty_list:any = [];
  filter:any = {}
  options:any;
  coupon_type: any = '';
  login_user_data : any = {};
  ware_house_list:any=[];
  // current_page = 'ready_to_dispatch/stock_list';
  constructor(public navCtrl: NavController,public modal: ModalController,public app:App,public storage:Storage,public toastCtrl: ToastController, public navParams: NavParams,private barcodeScanner: BarcodeScanner,private alertCtrl: AlertController,public dbService:DbserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReadyToDipatchOrderListPage');
  }

  ionViewWillEnter(){

    this.options = {
      prompt : 'place a QR-Code inside the viewfinder rectangle to scan it'
    }

    this.storage.get('userStorageData').then((storageData) => {
      this.dbService.userStorageData = storageData;
      console.log(this.dbService.userStorageData);
      this.login_user_data = this.dbService.userStorageData
      this.login_user_data.role_id == '16' ? this.tab_active = 'Ready2Dispatch' : this.tab_active = 'Stock';

      this.tab_active == 'Ready2Dispatch' ? this.get_order_list_for_dispatch_order() : this.get_stock_qty_list();

    });

    this.get_order_list_for_dispatch_order();


  }

  doRefresh (refresher){
    this.filter.master='';
    this.tab_active == 'Stock'? this.get_stock_qty_list() : this.get_order_list_for_dispatch_order();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  go_to(where :any = '',order_id : any = ''){
    console.log("go_to method calls");
    console.log(where);
    if(where == 'generate_master_cart' && order_id!=''){
      this.navCtrl.push(GenerateMasterCartForOrderDispatchPage,{'order_id' : order_id});
    }
    else if(where == 'scanned_master_QR_code_detail'){
      this.navCtrl.push(ScannedMasterQrCodeDetailPage,{'scanned_master_QR_code_id' : this.scanned_master_QR_code_id,'coupon_type':this.coupon_type,'from':'ready_to_dispatch_order_list'});
    }

    else if(where == 'stock_calculation'){
      this.navCtrl.push(ShowDetailsOfCalculatedStockPage,{'where' : where ,'from':'ready_to_dispatch_order_list'});
    }

    else{
      console.log('where = '+where);
    }
  }

  scan_QR_code_for_master_packing() {


    this.barcodeScanner.scan(this.options).then(result => {
      console.log(result);
      this.master_qr_code=result.text;
      console.log( this.master_qr_code);
      if(this.master_qr_code != '')
      {
        this.dbService.show_loading();
        this.dbService.fileData({'master_qr_code':this.master_qr_code},'BoxPackaging/verify_master_box_used_or_not').subscribe((scanned_coupen_result:any)=>{
          console.log(scanned_coupen_result);
          this.scanned_master_QR_code_id = scanned_coupen_result['coupon_id']
          this.coupon_type = scanned_coupen_result['coupon_type']

          this.dbService.dismiss_loading();


          if(scanned_coupen_result['msg'] == 'Scanned'){
            this.go_to('scanned_master_QR_code_detail')
          }
          else if(scanned_coupen_result['msg'] == 'Available'){

            const success_alert = this.alertCtrl.create({
              title: 'Successfully Scan',
              message: scanned_coupen_result['coupon_type'] =='secondary coupon' ? 'Secondary Coupon Scan Successfully' : 'Master Coupon Scan Successfully, Now Scan Secondary Coupon',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    console.log("success_alert OK Clicked");
                    // this.scan_secondary_QR_code_for_master_packing(scanned_coupen_result['coupon_id'])
                    this.go_to('scanned_master_QR_code_detail')
                  }
                }
              ]
            })
            success_alert.present();

          }
          else if(scanned_coupen_result['msg'] == 'Received Successfully'){
            this.scan_QR_code_for_master_packing();
            // this.scan_QR_code_for_master_packing_test();
          }

          // else if(scanned_coupen_result['msg'] == 'Master Box Already Dispatched'){
          //   this.go_to('scanned_master_QR_code_detail');
          // }
          // else if(scanned_coupen_result['msg'] == 'This Master Box Is Destroyed!'){
          //   this.showAlert(scanned_coupen_result['msg']);
          // }
          // else if(scanned_coupen_result['msg'] == 'Master Box Set To Transfer Detail Not Match With Your Detail'){
          //   this.showAlert(scanned_coupen_result['msg']);
          // }
          else{
            this.showAlert(scanned_coupen_result['msg']);
          }

        });
      }
      else{
        console.log('not scanned anything');
      }
    });

  }

  scan_QR_code_for_master_packing_test() {

    let alert = this.alertCtrl.create({
      title: 'Submit Master Code',
      inputs: [
        {
          type: 'text',
          name: 'coupon_code',
          placeholder: 'coupon_code',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: result => {

            console.log(result);
            this.master_qr_code=result.coupon_code;
            console.log( this.master_qr_code);
            if(result != '')
            {
              this.dbService.fileData({'master_qr_code':this.master_qr_code},'BoxPackaging/verify_master_box_used_or_not').subscribe((scanned_coupen_result:any)=>{
                console.log(scanned_coupen_result);
                this.scanned_master_QR_code_id = scanned_coupen_result['coupon_id']
                this.coupon_type = scanned_coupen_result['coupon_type']

                this.dbService.dismiss_loading();


                if(scanned_coupen_result['msg'] == 'Scanned'){
                  this.go_to('scanned_master_QR_code_detail')
                }
                else if(scanned_coupen_result['msg'] == 'Available'){

                  const success_alert = this.alertCtrl.create({
                    title: 'Successfully Scan',
                    message: scanned_coupen_result['coupon_type'] =='secondary coupon' ? 'Secondary Coupon Scan Successfully' : 'Master Coupon Scan Successfully, Now Scan Secondary Coupon',
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          console.log("success_alert OK Clicked");
                          // this.scan_secondary_QR_code_for_master_packing(scanned_coupen_result['coupon_id'])
                          this.go_to('scanned_master_QR_code_detail')
                        }
                      }
                    ]
                  })
                  success_alert.present();

                }
                else if(scanned_coupen_result['msg'] == 'Received Successfully'){
                  this.scan_QR_code_for_master_packing_test();
                }

                // else if(scanned_coupen_result['msg'] == 'Master Box Already Dispatched'){
                //   this.go_to('scanned_master_QR_code_detail');
                // }
                // else if(scanned_coupen_result['msg'] == 'This Master Box Is Destroyed!'){
                //   this.showAlert(scanned_coupen_result['msg']);
                // }
                // else if(scanned_coupen_result['msg'] == 'Master Box Set To Transfer Detail Not Match With Your Detail'){
                //   this.showAlert(scanned_coupen_result['msg']);
                // }
                else{
                  this.showAlert(scanned_coupen_result['msg']);
                }

              });
            }
            else{
              console.log('not scanned anything');
            }


          }
        }
      ]
    });
    alert.present();

  }


  showAlert(text,master_coupon_id:any = '') {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text:'OK',
        cssClass: 'close-action-sheet',
        handler:()=>{
          master_coupon_id !='' ? this.scan_secondary_QR_code_for_master_packing(master_coupon_id):'';
        }
      }]
    });
    alert.present();
    return text;

  }

  // not use now
  scan_secondary_QR_code_for_master_packing(master_coupon_id){
    console.log('scan_secondary_QR_code_for_master_packing method calls');
    console.log('master_coupon_id = '+master_coupon_id);

    this.barcodeScanner.scan(this.options).then(result => {

      console.log(result);
      this.secondary_qr_code=result.text;
      console.log( this.secondary_qr_code);
      if(this.secondary_qr_code != ''){
        this.dbService.show_loading();
        this.dbService.fileData({'master_box_id':master_coupon_id,'secondary_box_coupon_code':this.secondary_qr_code},'BoxPackaging/sync_secondary_box_with_master_box_on_time_of_item_packaging').subscribe((scanned_secondary_coupen_result:any)=>{
          this.dbService.dismiss_loading();
          console.log(scanned_secondary_coupen_result);

          if(scanned_secondary_coupen_result['msg'] == 'Scanned'){
            this.showAlert("Coupon Already Used",master_coupon_id);
          }
          else if(scanned_secondary_coupen_result['msg'] == 'Coupon Does Not Exist, Please Scan Another coupon'){
            this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
          }
          else if(scanned_secondary_coupen_result['msg'] == 'Something Went Wrong! Please Scan Again'){
            this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
          }
          else{
            const again_show_alert = this.alertCtrl.create({
              title: 'Successfully Scan',
              message: 'Secondary Coupon scan successfully, Scan More Secondary Box?',
              buttons: [
                {
                  text: 'No',
                  handler: () => {
                    console.log('Cancel clicked');
                    console.log("again_show_alert No Clicked");
                    return
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    console.log("again_show_alert YES Clicked");
                    this.scan_secondary_QR_code_for_master_packing(master_coupon_id)

                  }
                }
              ]
            })
            again_show_alert.present();
          }

        });
      }
      else{
        console.log('not scanned anything');
      }
    });

  }

  get_order_list_for_dispatch_order(){
    console.log("get_order_list_for_dispatch_order method calls");
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'master':this.filter.master,"start":this.start,"pagelimit":this.limit},"BoxPackaging/order_list_for_ware_house_manager", this.dbService.rootUrlSfa).subscribe(resp=>{
      console.log(resp);
      this.order_list_for_dispatch_order = resp
      resp == [] ? this.stop_pagination=true : this.stop_pagination=false;

    },err=>
    {
      this.dbService.dismiss_loading();

    })
    setTimeout(() => {
      this.dbService.dismiss_loading();

    }, 2000);

  }

  loadData(infiniteScroll){
    console.log('loading');
    this.start = this.start+this.limit

    this.dbService.onPostRequestDataFromApi({"start":this.start,"pagelimit":this.limit},"BoxPackaging/order_list_for_ware_house_manager", this.dbService.rootUrlSfa).subscribe((resp) =>{
      console.log(resp);
      if(resp == []){
        this.stop_pagination=true
      }
      else
      {
        this.stop_pagination=false
        setTimeout(()=>{
          this.order_list_for_dispatch_order=this.order_list_for_dispatch_order.concat(resp);
          console.log('Asyn operation has stop')
          infiniteScroll.complete();
        },1000);
      }
    });
  }

  get_stock_qty_list(){
    console.log("get_stock_qty_list method calls");

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'master':this.filter.master},"BoxPackaging/product_wise_stock_listing", this.dbService.rootUrlSfa).subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      this.product_stock_qty_list = resp


    },err=>
    {
      this.dbService.dismiss_loading();

    })
    setTimeout(() => {
      this.dbService.dismiss_loading();

    }, 2000);


  }


  onLogoutHandler() {

    const alert = this.alertCtrl.create({
      title: 'Logout!',
      message: 'Are you sure you want Logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {

            this.storage.set('userStorageData', {});

            let alert2 = this.alertCtrl.create({
              title:'Success!',
              subTitle: 'Logout Successfully',
              buttons: [ {
                text: 'Ok',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }]
            });
            alert2.present();
            this.app.getRootNav().setRoot(SelectRegistrationTypePage);

          }
        }
      ]
    })

    alert.present();
  }


  get_warehouse_data(){
    console.log("get_warehouse_data method calls");
    this.dbService.show_loading();
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

  open_warehouse_list_modal(){
    console.log("open_warehouse_list_modal method calls");

    let FiltersPageModal =  this.modal.create(FiltersPage,{'from':'ready-to-dispatch-order-list-page'});
    FiltersPageModal.onDidDismiss(data =>{
      if(data == 'minimise'){

      }
      else{
        console.log(data);
        this.filter = data;
      }
    });
    FiltersPageModal.present();


  }

}
