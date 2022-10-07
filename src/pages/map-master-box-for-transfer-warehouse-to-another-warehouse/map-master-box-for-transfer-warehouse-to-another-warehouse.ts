import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


/**
* Generated class for the MapMasterBoxForTransferWarehouseToAnotherWarehousePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-map-master-box-for-transfer-warehouse-to-another-warehouse',
  templateUrl: 'map-master-box-for-transfer-warehouse-to-another-warehouse.html',
})
export class MapMasterBoxForTransferWarehouseToAnotherWarehousePage {
  
  selected_warehouse_id:any='0'
  assigned_master_box_detail_list:any=[]
  expand_master_detail = 0;
  selected_ware_house_detail : any = {}
  options: { prompt: string; };
  master_qr_code: any = '';
  master_box_id_array:any=[]
  
  
  
  
  constructor(public navCtrl: NavController,private barcodeScanner: BarcodeScanner, public navParams: NavParams,public dbService:DbserviceProvider,private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MapMasterBoxForTransferWarehouseToAnotherWarehousePage');
  }
  
  ionViewWillEnter(){
    console.log(this.navParams);
    if(this.navParams['data']['selected_ware_house_id'] && this.navParams['data']['from'] == "filters_page"){
      this.selected_warehouse_id = this.navParams['data']['selected_ware_house_id']
      this.get_assigned_master_box_to_warehouse_data();
    }
    
    this.options = {
      prompt : 'place a QR-Code inside the viewfinder rectangle to scan it'
    }
    
    
  }
  
  get_assigned_master_box_to_warehouse_data(){
    console.log("get_assigned_master_box_to_warehouse_data method calls");
    this.dbService.show_loading()
    this.dbService.onPostRequestDataFromApi({'selected_next_ware_house_id' : this.selected_warehouse_id},"BoxPackaging/before_send_master_box_to_selected_ware_house_tally_master_box_data", this.dbService.rootUrlSfa).subscribe(resp=>{
      console.log(resp);
      this.assigned_master_box_detail_list = resp['master_box_assigned_to_selected_next_ware_house']
      this.selected_ware_house_detail = resp['ware_house_detail']
      for(let index = 0; index < this.assigned_master_box_detail_list.length ; index++){
        this.master_box_id_array[index] = this.assigned_master_box_detail_list[index]['id']
      }
      
      this.dbService.dismiss_loading()
    },err=>
    {
      this.dbService.dismiss_loading();
      
    })
    setTimeout(() => {
      this.dbService.dismiss_loading();
      
    }, 2000);
    
  }
  
  
  add_remove_master_card_data_from_next_warehouse(){
    let alert = this.alertCtrl.create({
      title: 'Select Option . . .',
      inputs: [
        {
          type: 'radio',
          label: 'Assign',
          value: 'Assign'
        },
        {
          type: 'radio',
          label: 'Remove',
          value: 'Remove'
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
            if(result == 'Assign'){
              this.assign_master_cart_to_order();
              // this.assign_master_cart_to_order_test();
              
            }
            else{
              this.remove_master_code_from_order();
              // this.remove_master_code_from_order_test();
              
            }
          }
        }
      ]
    });
    alert.present();
  }
  
  assign_master_cart_to_order(){
    console.log("assign_master_cart_to_order method calls");
    
    this.barcodeScanner.scan(this.options).then(result => {
      console.log(result);
      this.master_qr_code=result.text;
      console.log( this.master_qr_code);
      if(this.master_qr_code != '')
      {
        this.dbService.show_loading();
        this.dbService.fileData({'selected_ware_house_id':this.selected_warehouse_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/send_master_box_to_selected_ware_house').subscribe((scanned_coupen_result:any)=>{
          this.dbService.dismiss_loading();
          console.log(scanned_coupen_result);
          
          if(scanned_coupen_result['msg'] == 'Master Box Already Mapped With Other Order'){
            this.showAlert('Master Box Already Mapped With Order')
          }
          else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
            this.showAlert(scanned_coupen_result['msg'])
          }
          else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Not Matched With Order Item'){
            this.showAlert(scanned_coupen_result['msg'])
          }
          else if(scanned_coupen_result['msg'] == 'Sync Successfully'){
            this.showAlert('This Master Code Sync Successfully')
          }
          else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Qty Is Larger Than Order Item Qty'){
            this.showAlert(scanned_coupen_result['msg'])
          }
          else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
            this.showAlert(scanned_coupen_result['msg'])
          }
          else if(scanned_coupen_result['msg'] == 'Successfully Set To Transfer Other Ware House'){
            this.assign_master_cart_to_order();
            this.get_assigned_master_box_to_warehouse_data();
            // this.showAlert(scanned_coupen_result['msg'])
          }
          else{
            this.showAlert(scanned_coupen_result['msg'])
          }
          
        });
      }
      else{
        console.log('not scanned anything');
      }
    });
    
  }
  
  assign_master_cart_to_order_test() {
    
    let alert = this.alertCtrl.create({
      title: 'Master code Assign',
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
            
            if(this.master_qr_code != '')
            {
              this.dbService.show_loading();
              this.dbService.fileData({'selected_ware_house_id':this.selected_warehouse_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/send_master_box_to_selected_ware_house').subscribe((scanned_coupen_result:any)=>{
                this.dbService.dismiss_loading();
                console.log(scanned_coupen_result);
                
                if(scanned_coupen_result['msg'] == 'Master Box Already Mapped With Other Order'){
                  this.showAlert('Master Box Already Mapped With Order')
                }
                else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
                  this.showAlert(scanned_coupen_result['msg'])
                }
                else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Not Matched With Order Item'){
                  this.showAlert(scanned_coupen_result['msg'])
                }
                else if(scanned_coupen_result['msg'] == 'Sync Successfully'){
                  this.showAlert('This Master Code Sync Successfully')
                }
                else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Qty Is Larger Than Order Item Qty'){
                  this.showAlert(scanned_coupen_result['msg'])
                }
                else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
                  this.showAlert(scanned_coupen_result['msg'])
                }
                else if(scanned_coupen_result['msg'] == 'Successfully Set To Transfer Other Ware House'){
                  // this.assign_master_cart_to_order();
                  this.assign_master_cart_to_order_test();
                  this.get_assigned_master_box_to_warehouse_data();
                  // this.showAlert(scanned_coupen_result['msg'])
                }
                else{

                  this.showAlert(scanned_coupen_result['msg'])
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
  
  
  remove_master_code_from_order(){
    console.log("remove_master_code_from_order method calls");
    
    this.barcodeScanner.scan(this.options).then(result => {
      console.log(result);
      this.master_qr_code=result.text;
      console.log( this.master_qr_code);
      if(this.master_qr_code != '')
      {
        this.dbService.show_loading();
        this.dbService.fileData({'selected_ware_house_id':this.selected_warehouse_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/remove_send_master_box_to_selected_ware_house').subscribe((scanned_coupen_result:any)=>{
          this.dbService.dismiss_loading();
          console.log(scanned_coupen_result);
          
          if(scanned_coupen_result['msg'] == 'Remove Successfully'){
            this.showAlert('Master Box Remove Successfully')
          }
          else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
            this.showAlert(scanned_coupen_result['msg'])
          }
          else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
            this.showAlert(scanned_coupen_result['msg'])
          }
          else if(scanned_coupen_result['msg'] == 'Remove Successfully From Transfer To Ware House'){
            this.remove_master_code_from_order();
            this.get_assigned_master_box_to_warehouse_data();

            // this.showAlert(scanned_coupen_result['msg'])
          }
          else{
            this.showAlert(scanned_coupen_result['msg'])
          }
          
        });
      }
      else{
        console.log('not scanned anything');
      }
    });
    
  }
  
  remove_master_code_from_order_test() {
    
    let alert = this.alertCtrl.create({
      title: 'Master code Remove',
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
            
            if(this.master_qr_code != '')
            {
              this.dbService.show_loading();
              this.dbService.fileData({'selected_ware_house_id':this.selected_warehouse_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/remove_send_master_box_to_selected_ware_house').subscribe((scanned_coupen_result:any)=>{
                this.dbService.dismiss_loading();
                console.log(scanned_coupen_result);
                
                if(scanned_coupen_result['msg'] == 'Remove Successfully'){
                  this.showAlert('Master Box Remove Successfully')
                }
                else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
                  this.showAlert(scanned_coupen_result['msg'])
                }
                else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
                  this.showAlert(scanned_coupen_result['msg'])
                }
                else if(scanned_coupen_result['msg'] == 'Remove Successfully From Transfer To Ware House'){
                  this.remove_master_code_from_order_test();
                  this.get_assigned_master_box_to_warehouse_data();

                  // this.showAlert(scanned_coupen_result['msg'])
                }
                else{
                  this.showAlert(scanned_coupen_result['msg'])
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
          this.get_assigned_master_box_to_warehouse_data();
        }
      }]
    });
    alert.present();
    return text;
    
  }
  
  dispatch_master_carton_to_next_warehouse(){
    console.log("dispatch_master_carton_to_next_warehouse method calls");
    
    let confirmation_alert=this.alertCtrl.create({
      title:'Confirmation. . .?',
      subTitle: 'Are You Ready To Transfer All Master Box ?',
      cssClass:'action-close',
      
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          
        }
      },
      {
        text:'Yes',
        cssClass: 'close-action-sheet',
        handler:()=>
        {
          this.dbService.show_loading()
          this.dbService.onPostRequestDataFromApi({"master_box_id_array":this.master_box_id_array,"warehouse_detail":this.selected_ware_house_detail},"BoxPackaging/final_transfer_of_master_box_to_selected_ware_house", this.dbService.rootUrlSfa).subscribe(resp=>{
            this.dbService.dismiss_loading();
            console.log(resp);
            if(resp['msg']){
              
              let alert = this.alertCtrl.create({
                title: '',
                subTitle: resp['msg'],
                cssClass: 'action-close',
                
                buttons: [{
                  text: 'Ok',
                  role: 'cancel',
                  handler: () => {
                    resp['msg'] == 'Successfully Transfer' ?  this.navCtrl.pop() : this.get_assigned_master_box_to_warehouse_data();
                  }
                }]
              });
              alert.present();
            }
          })
          
          
        }
      }]
    });
    confirmation_alert.present();
    
  }
  
}
