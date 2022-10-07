import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DispatchOrderCartPage } from '../dispatch-order-cart/dispatch-order-cart';

/**
* Generated class for the GenerateMasterCartForOrderDispatchPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-generate-master-cart-for-order-dispatch',
  templateUrl: 'generate-master-cart-for-order-dispatch.html',
})
export class GenerateMasterCartForOrderDispatchPage {
  
  
  expand_order_detail = 0;
  order_id:any = '0';
  order_detail : any = {};
  order_item_detail : any = [];
  master_qr_code: any = '';
  expand_master_detail = 0;
  assigned_product_detail_list:any = []
  options:any
  show_dispatch:boolean = false;
  
  
  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner,public navParams: NavParams,private alertCtrl: AlertController,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad GenerateMasterCartForOrderDispatchPage');
  }
  
  ionViewWillEnter(){
    console.log('ionViewWillEnter ScannedMasterQrCodeDetailPage');
    console.log(this.navParams);
    console.log(this.navParams['data']['order_id']);
    this.order_id = this.navParams['data']['order_id']
    if(this.order_id != ''){
      this.get_order_detail_for_dispatch()
    }
    
    this.options = {
      prompt : 'place a QR-Code inside the viewfinder rectangle to scan it'
    }
    
    
  }
  
  get_order_detail_for_dispatch(){
    console.log("get_data_assign_to_master_QR_code method calls");
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({"order_id":this.order_id},"BoxPackaging/order_detail_for_ware_house_manager", this.dbService.rootUrlSfa).subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      this.order_detail = resp['order_detail']
      this.order_item_detail = resp['order_item_detail']
      this.assigned_product_detail_list = resp['assigned_product_detail_list']
      this.show_dispatch = false;
      for(let index = 0;index < this.assigned_product_detail_list.length; index++){
        
        if(this.assigned_product_detail_list[index].dispatch_status_flag == '0'){
          this.show_dispatch = true
          return;
        }
        else{
          this.show_dispatch = false
        }
        
      }
      console.log(this.show_dispatch);
      
      
      
    },err=>
    {
      this.dbService.dismiss_loading();
      
    })
    setTimeout(() => {
      this.dbService.dismiss_loading();
      
    }, 2000);
    
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
        this.dbService.fileData({'order_id':this.order_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/master_box_mapped_with_order').subscribe((scanned_coupen_result:any)=>{
          this.dbService.dismiss_loading();
          console.log(scanned_coupen_result);
          
          if(scanned_coupen_result['msg'] == 'Sync Successfully'){
            const success_alert = this.alertCtrl.create({
              title: 'Sync Successfully',
              message: 'This Master Code Sync Successfully',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    console.log("success_alert OK Clicked");
                    this.get_order_detail_for_dispatch();
                  }
                }
              ]
            })
            success_alert.present();
            
          }
          // else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
          //   this.showAlert(scanned_coupen_result['msg'])
          // }
          // else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Not Matched With Order Item'){
          //   this.showAlert(scanned_coupen_result['msg'])
          // }
          // else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Qty Is Larger Than Order Item Qty'){
          //   this.showAlert(scanned_coupen_result['msg'])
          // }
          // else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
          //   this.showAlert(scanned_coupen_result['msg'])
          // }
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
              this.dbService.fileData({'order_id':this.order_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/master_box_mapped_with_order').subscribe((scanned_coupen_result:any)=>{
                this.dbService.dismiss_loading();
                console.log(scanned_coupen_result);
                
                if(scanned_coupen_result['msg'] == 'Sync Successfully'){
                  const success_alert = this.alertCtrl.create({
                    title: 'Sync Successfully',
                    message: 'This Master Code Sync Successfully',
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          console.log("success_alert OK Clicked");
                          this.get_order_detail_for_dispatch();
                        }
                      }
                    ]
                  })
                  success_alert.present();
                  
                }
                // else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
                //   this.showAlert(scanned_coupen_result['msg'])
                // }
                // else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Not Matched With Order Item'){
                //   this.showAlert(scanned_coupen_result['msg'])
                // }
                // else if(scanned_coupen_result['msg'] == 'Error ! Master Box Item Qty Is Larger Than Order Item Qty'){
                //   this.showAlert(scanned_coupen_result['msg'])
                // }
                // else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
                //   this.showAlert(scanned_coupen_result['msg'])
                // }
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
  
  add_remove_master_card_datas_from_order(){
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
  
  
  remove_master_code_from_order(){
    console.log("remove_master_code_from_order method calls");
    
    this.barcodeScanner.scan(this.options).then(result => {
      console.log(result);
      this.master_qr_code=result.text;
      console.log( this.master_qr_code);
      if(this.master_qr_code != '')
      {
        this.dbService.show_loading();
        this.dbService.fileData({'order_id':this.order_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/removed_master_box_from_order').subscribe((scanned_coupen_result:any)=>{
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
              this.dbService.fileData({'order_id':this.order_id,'master_box_qr_code':this.master_qr_code},'BoxPackaging/removed_master_box_from_order').subscribe((scanned_coupen_result:any)=>{
                this.dbService.dismiss_loading();
                console.log(scanned_coupen_result);
                
                if(scanned_coupen_result['msg'] == 'Remove Successfully'){
                
                  const success_alert = this.alertCtrl.create({
                    title: 'Remove Successfully',
                    message: 'Master Box Remove Successfully',
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          console.log("success_alert OK Clicked");
                          this.get_order_detail_for_dispatch();
                        }
                      }
                    ]
                  })
                  success_alert.present();


                }
                // else if(scanned_coupen_result['msg'] == 'Coupon Does Not Exist'){
                //   this.showAlert(scanned_coupen_result['msg'])
                // }
                // else if(scanned_coupen_result['msg'] == 'This Master Box Already Dispatched'){
                //   this.showAlert(scanned_coupen_result['msg'])
                // }
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
  
  
  
  
  go_to(where :any = ''){
    console.log("go_to method calls");
    console.log(where);
    if(where == 'view_cart'){
      this.navCtrl.push(DispatchOrderCartPage);
    }
    else{
      console.log('where = '+where);
    }
    
    
  }
  
  dispatch_master_cart_data(){
    console.log("dispatch_master_cart_data method calls");
    
    let confirmation_alert=this.alertCtrl.create({
      title:'Confirmation. . .?',
      subTitle: 'You want to dispatch order ?',
      cssClass:'action-close',
      
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          
        }
      },
      {
        text:'Confirm',
        cssClass: 'close-action-sheet',
        handler:()=>
        {
          this.dbService.show_loading()
          this.dbService.onPostRequestDataFromApi({"order_id":this.order_id},"BoxPackaging/dispatched_master_box", this.dbService.rootUrlSfa).subscribe(resp=>{
            this.dbService.dismiss_loading();
            console.log(resp);
            this.dbService.dismiss_loading();
            
            if(resp['msg']){
              
              let alert = this.alertCtrl.create({
                title: '',
                subTitle: resp['msg'],
                cssClass: 'action-close',
                
                buttons: [{
                  text: 'Ok',
                  role: 'cancel',
                  handler: () => {
                    resp['msg'] == 'Dispatch Successfully' ?  this.navCtrl.pop() : this.get_order_detail_for_dispatch();
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
          this.get_order_detail_for_dispatch();
        }
      }]
    });
    alert.present();
    return text;
    
  }
  
  // show_dipatch_button(){
  //   this.show_dispatch = true
  // }
  
}
