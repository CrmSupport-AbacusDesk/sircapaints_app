import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, App, IonicPage, ModalController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { FiltersPage } from '../filters/filters';
import { DispatchOrderCartPage } from '../dispatch-order-cart/dispatch-order-cart';


@IonicPage()
@Component({
  selector: 'page-scanned-master-qr-code-detail',
  templateUrl: 'scanned-master-qr-code-detail.html',
})
export class ScannedMasterQrCodeDetailPage {
  
  scanned_master_QR_code_id: any = '';
  coupon_type:any=''
  master_box_detail: any = {};
  secondary_coupon_assign_list: any = [];
  secondary_qr_code:any = ''
  order_detail:any = {};
  options:any;
  secondary_coupon_detail:any={};
  login_user_data : any = {};
  manual_mapping_product_item:any=[];
  current_page : any = 'scanned_master_qr_code_detail';
  
  
  
  
  
  constructor(public navCtrl: NavController,public app: App,public platform: Platform,public storage:Storage,public modal: ModalController, public navParams: NavParams,public toastCtrl: ToastController,private barcodeScanner: BarcodeScanner,private alertCtrl: AlertController,public dbService:DbserviceProvider) {
    
    platform.registerBackButtonAction(() => {
      
      console.log("this.dbService.backButton");
      console.log(this.dbService.backButton);
      
      if (this.dbService.backButton == 0 && this.current_page == 'scanned_master_qr_code_detail') {
        
        this.dbService.backButton = 1;
        
        let toast = this.toastCtrl.create({
          
          message: 'Press again to go back!',
          duration: 2000
        });
        toast.present();
        
        setTimeout(() => {
          
          this.dbService.backButton = 0;
          
        }, 2500);
      } else {
        this.current_page=''
        this.navCtrl.pop()
      }
      
      
      
    });
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ScannedMasterQrCodeDetailPage');
  }
  
  ionViewWillEnter(){
    console.log('ionViewWillEnter ScannedMasterQrCodeDetailPage');
    console.log(this.navParams);
    console.log(this.navParams['data']['scanned_master_QR_code_id']);
    this.scanned_master_QR_code_id = this.navParams['data']['scanned_master_QR_code_id'];
    this.coupon_type = this.navParams['data']['coupon_type'];
    
    this.storage.get('userStorageData').then((storageData) => {
      this.dbService.userStorageData = storageData;
      console.log(this.dbService.userStorageData);
      this.login_user_data = this.dbService.userStorageData
      
    });
    
    if(this.scanned_master_QR_code_id != '' && this.coupon_type !=''){
      this.get_data_assign_to_master_QR_code();
    }
    
    this.options = {
      prompt : 'place a QR-Code inside the viewfinder rectangle to scan it'
    }
    
  }
  
  get_data_assign_to_master_QR_code(){
    console.log("get_data_assign_to_master_QR_code method calls");
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({"scanned_master_QR_code_id":this.scanned_master_QR_code_id,"coupon_type":this.coupon_type},"BoxPackaging/after_verify_master_box_used_detail", this.dbService.rootUrlSfa).subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      
      this.master_box_detail = resp['master_box_coupon_scanned']
      console.log(this.master_box_detail);
      
      this.secondary_coupon_assign_list = resp['secondary_coupon_assign_list']
      console.log(this.secondary_coupon_assign_list);
      
      this.secondary_coupon_detail = resp['secondary_coupon_detail']
      console.log(this.secondary_coupon_detail);
      
      this.order_detail = resp['order_detail']
      console.log(this.order_detail);
      
      this.manual_mapping_product_item = resp['manual_mapping_product_item']
      console.log(this.manual_mapping_product_item);
      
      console.log(this.master_box_detail['dispatch_status_flag']);
      this.master_box_detail['dispatch_status_flag'] == '1' ? this.showAlert('Master Box Already Dispatched') : '';
      
    },err=>
    {
      this.dbService.dismiss_loading();
      
    })
    setTimeout(() => {
      this.dbService.dismiss_loading();
      
    }, 2000);
  }
  
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
          else if(scanned_secondary_coupen_result['msg'] == 'sync secondary coupon successfully'){
            this.get_data_assign_to_master_QR_code();
            this.scan_secondary_QR_code_for_master_packing(master_coupon_id)
          }
          
          // else if(scanned_secondary_coupen_result['msg'] == 'Coupon Does Not Exist, Please Scan Another coupon'){
          //   this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
          // }
          // else if(scanned_secondary_coupen_result['msg'] == 'Something Went Wrong! Please Scan Again'){
          //   this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
          // }
          // else if(scanned_secondary_coupen_result['msg'] == 'Already Sync With Other Master Box'){
          //   this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
          // }
          
          else{
            this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
          }
          
        });
      }
      else{
        console.log('not scanned anything');
      }
    });
    
  }
  
  scan_secondary_QR_code_for_remove_master_packing(master_coupon_id) {
    
    this.barcodeScanner.scan(this.options).then(result => {
      
      console.log(result);
      this.secondary_qr_code=result.text;
      console.log( this.secondary_qr_code);
      if(this.secondary_qr_code != ''){
        {
          this.dbService.fileData({'master_box_id':master_coupon_id,'secondary_box_coupon_code':this.secondary_qr_code},'BoxPackaging/unsync_secondary_box').subscribe((scanned_secondary_coupen_result:any)=>{
            this.dbService.dismiss_loading();
            console.log(scanned_secondary_coupen_result);
            
            if(scanned_secondary_coupen_result['msg'] == 'Remove Successfully'){
              this.showAlert("Secondary Box Remove Successfully",master_coupon_id);
              this.get_data_assign_to_master_QR_code();
            }
            else if(scanned_secondary_coupen_result['msg'] == 'Coupon Does Not Exist'){
              this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
              this.get_data_assign_to_master_QR_code();
            }
            else if(scanned_secondary_coupen_result['msg'] == 'Something Went Wrong! Please Scan Again'){
              this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
              this.get_data_assign_to_master_QR_code();
            }
            
          });
        }
      }
      else{
        console.log('not scanned anything');
      }
      
      
    });
  }
  
  scan_secondary_QR_code_for_master_packing_test(master_coupon_id) {
    
    let alert = this.alertCtrl.create({
      title: 'Secondary code',
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
            this.secondary_qr_code=result.coupon_code;
            console.log( this.secondary_qr_code);
            if(result != '')
            {
              this.dbService.show_loading();
              this.dbService.fileData({'master_box_id':master_coupon_id,'secondary_box_coupon_code':this.secondary_qr_code},'BoxPackaging/sync_secondary_box_with_master_box_on_time_of_item_packaging').subscribe((scanned_secondary_coupen_result:any)=>{
                this.dbService.dismiss_loading();
                console.log(scanned_secondary_coupen_result);
                
                if(scanned_secondary_coupen_result['msg'] == 'Scanned'){
                  this.showAlert("Coupon Already Used",master_coupon_id);
                }
                else if(scanned_secondary_coupen_result['msg'] == 'sync secondary coupon successfully'){
                  this.scan_secondary_QR_code_for_master_packing_test(master_coupon_id)
                }
                
                // else if(scanned_secondary_coupen_result['msg'] == 'Coupon Does Not Exist, Please Scan Another coupon'){
                //   this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
                // }
                // else if(scanned_secondary_coupen_result['msg'] == 'Something Went Wrong! Please Scan Again'){
                //   this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
                // }
                // else if(scanned_secondary_coupen_result['msg'] == 'Already Sync With Other Master Box'){
                //   this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
                // }
                
                else{
                  this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
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
  
  scan_secondary_QR_code_for_remove_master_packing_test(master_coupon_id) {
    
    let alert = this.alertCtrl.create({
      title: 'Secondary code',
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
            this.secondary_qr_code=result.coupon_code;
            console.log( this.secondary_qr_code);
            if(result != '')
            {
              this.dbService.fileData({'master_box_id':master_coupon_id,'secondary_box_coupon_code':this.secondary_qr_code},'BoxPackaging/unsync_secondary_box').subscribe((scanned_secondary_coupen_result:any)=>{
                this.dbService.dismiss_loading();
                console.log(scanned_secondary_coupen_result);
                
                if(scanned_secondary_coupen_result['msg'] == 'Remove Successfully'){
                  this.showAlert("Secondary Box Remove Successfully",master_coupon_id);
                  this.get_data_assign_to_master_QR_code();
                }
                else if(scanned_secondary_coupen_result['msg'] == 'Coupon Does Not Exist'){
                  this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
                  this.get_data_assign_to_master_QR_code();
                }
                else if(scanned_secondary_coupen_result['msg'] == 'Something Went Wrong! Please Scan Again'){
                  this.showAlert(scanned_secondary_coupen_result['msg'],master_coupon_id);
                  this.get_data_assign_to_master_QR_code();
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
          this.master_box_detail != {} && this.master_box_detail['dispatch_status_flag'] == '0' ? this.get_data_assign_to_master_QR_code() : '';
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
    
  }
  
  delete_master_box(){
    
    
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: 'Are You Sure Want To Open This Master Box',
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('No clicked');
        }
      },
      {
        text:'Yes',
        cssClass: 'close-action-sheet',
        handler:()=>{
          
          this.dbService.fileData({'master_box_id':this.scanned_master_QR_code_id,},'BoxPackaging/destroy_master_box').subscribe((master_box_destroy_response:any)=>{
            this.dbService.dismiss_loading();
            console.log(master_box_destroy_response);
            
            if(master_box_destroy_response['msg'] == 'Delete Successfully'){
              let toast = this.toastCtrl.create({
                message: 'Master Box Open Successfully',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              this.navCtrl.pop();
            }
            // else if(master_box_destroy_response['msg'] == 'Something Went Wrong! Please Try Again'){
            //   this.showAlert(master_box_destroy_response['msg']);
            // }
            else{
              this.showAlert(master_box_destroy_response['msg']);
            }
            
          });
          
          
        }
      }]
    });
    alert.present();
    
  }
  
  open_page_item_manual_map(){
    console.log("open_page_item_manual_map method calls");
    
    this.navCtrl.push(DispatchOrderCartPage,{'from':'scanned_master_qr_code_detail','master_box_id':this.scanned_master_QR_code_id});
    
  }
  
  delete_manual_item_from_master_box(manual_map_product_id){
    console.log("delete_manual_item_from_master_box method calls");
    console.log("scanned_master_QR_code_id = "+this.scanned_master_QR_code_id);
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({"product_id":manual_map_product_id,'master_box_id':this.scanned_master_QR_code_id,},"BoxPackaging/unsync_manual_entry_product_from_master_box", this.dbService.rootUrlSfa).subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      this.get_data_assign_to_master_QR_code()      
    },err=>{
      this.dbService.dismiss_loading();
      this.get_data_assign_to_master_QR_code()      
      
    })
    
    
  }
  
  
}
