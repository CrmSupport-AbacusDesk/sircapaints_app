import { Component, ViewChild } from '@angular/core';
import { AlertController, App, Events, IonicPage, Navbar, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
declare var DocumentViewer: any;



/**
* Generated class for the ShowDetailsOfCalculatedStockPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-show-details-of-calculated-stock',
  templateUrl: 'show-details-of-calculated-stock.html',
})
export class ShowDetailsOfCalculatedStockPage {
  
  @ViewChild(Navbar) navBar: Navbar;
  
  where: any = '';
  from:any=''
  login_user_data : any = {}
  options:any;
  master_qr_code:any = ''
  master_box_array : any = []
  secondary_box_array : any = []
  scanned_coupon_product_detail : any = []
  manual_secondary_box_qty:any='0';
  pdfUrl:any;
  current_page : any = 'show_details_of_calculated_stock'
  
  
  
  
  constructor(public navCtrl: NavController,public app: App,public platform: Platform,public toastCtrl:ToastController,private transfer: FileTransfer,public events:Events, public navParams: NavParams,private alertCtrl: AlertController,private barcodeScanner: BarcodeScanner,public storage:Storage,public dbService:DbserviceProvider) {
    this.pdfUrl = this.dbService.stock_pdf_url +'stock/';

    // if hardware navigation back key is pressed
    platform.registerBackButtonAction(() => {
      
      const nav = app.getActiveNav();
      const activeView = nav.getActive().name;
      
      if (this.dbService.backButton == 0 && this.current_page == 'show_details_of_calculated_stock') {
        
        this.dbService.backButton = 1;
        
        this.click_back_button()
        
        
        setTimeout(() => {
          
          this.dbService.backButton = 0;
          
        }, 2500);
      } else {
        
      }
      
      
      
    });
    
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowDetailsOfCalculatedStockPage');
  }
  
  ionViewWillEnter(){
    console.log('ionViewWillEnter ScannedMasterQrCodeDetailPage');
    console.log(this.navParams);
    console.log(this.navParams['data']['where']);
    
    this.navBar.backButtonClick = () => {
      console.log('back button test');
      
      this.click_back_button()
      
    };   
    
    this.where = this.navParams['data']['where'];
    this.from = this.navParams['data']['from'];
    
    this.storage.get('userStorageData').then((storageData) => {
      this.dbService.userStorageData = storageData;
      console.log(this.dbService.userStorageData);
      this.login_user_data = this.dbService.userStorageData
      
    });
    
    if(this.where == 'stock_calculation' && this.from =='ready_to_dispatch_order_list'){
      this.calculte_stock();
      // this.calculte_stock_test();
      
    }
    
    this.options = {
      prompt : 'place a QR-Code inside the viewfinder rectangle to scan it'
    }
    
    
  }
  
  
  check_qr_code_type(){
    console.log("check_qr_code_type method calls");
    
    if(this.master_qr_code.slice(0,2) == 'S-'){
      
      let alert = this.alertCtrl.create({
        title: 'Enter Secondary Box Qty.',
        inputs: [
          {
            type: 'number',
            name: 'secondary_box_qty',
            placeholder: 'Secondary Box Qty',
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
            handler: data => {
              
              console.log(data);
              if(data['secondary_box_qty'] != ''){
                this.manual_secondary_box_qty = data['secondary_box_qty']
                
                this.dbService.fileData({'master_box_qr_code':this.master_qr_code,'manual_secondary_box_qty':this.manual_secondary_box_qty},'BoxPackaging/stock_tally').subscribe((scanned_coupen_result:any)=>{
                  this.dbService.dismiss_loading();
                  console.log(scanned_coupen_result);
                  if(scanned_coupen_result['msg'] == 'Scanned' && scanned_coupen_result['type'] == 'secondary_box'){
                    console.log("in else if");
                    // const secondary_temp_index = this.secondary_box_array.findIndex(row => row == scanned_coupen_result['product_wise_detail'][0].secondary_box_id);
                    // if(secondary_temp_index == -1){
                    if(true){
                      const temp_index = this.scanned_coupon_product_detail.findIndex(row => row.product_id == scanned_coupen_result['product_wise_detail'][0].product_id);
                      
                      if(temp_index != -1){
                        
                        // this.scanned_coupon_product_detail[temp_index].total_master_box_qty = this.scanned_coupon_product_detail[temp_index].total_master_box_qty+ scanned_coupen_result['product_wise_detail'][0].total_master_box_qty
                        // this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty+ scanned_coupen_result['product_wise_detail'][0].total_secondary_box_qty
                        // this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(this.scanned_coupon_product_detail[temp_index].total_primary_box_qty)+ parseInt(scanned_coupen_result['product_wise_detail'][0].total_primary_box_qty)
                        // this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
                        
                        this.scanned_coupon_product_detail[temp_index].total_master_box_qty = scanned_coupen_result['product_wise_detail'][0].total_master_box_qty
                        this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = scanned_coupen_result['product_wise_detail'][0].total_secondary_box_qty
                        this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(scanned_coupen_result['product_wise_detail'][0].total_primary_box_qty)
                        this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
                        
                      }
                      else{
                        
                        this.scanned_coupon_product_detail.push(scanned_coupen_result['product_wise_detail'][0])
                        this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
                        
                      }
                      
                      
                    }
                    
                    console.log('secondary_box_array = ');
                    console.log(this.secondary_box_array);
                    
                    console.log('scanned_coupon_product_detail = ');
                    console.log(this.scanned_coupon_product_detail);
                    
                    this.calculte_stock();
                  }               
                  
                });
                
              }
              else if(data['secondary_box_qty'] == ''){
                this.showErrorToast('Add Secondary Box Qty')
                
              }
              else{
                
              }
            }
          }
        ],
        enableBackdropDismiss: false
      });
      alert.present();
      
      
    }
    else{
      
      this.dbService.fileData({'master_box_qr_code':this.master_qr_code,'manual_secondary_box_qty':'0'},'BoxPackaging/stock_tally').subscribe((scanned_coupen_result:any)=>{
        this.dbService.dismiss_loading();
        console.log(scanned_coupen_result);
        
        if(scanned_coupen_result['msg'] == 'Scanned' && scanned_coupen_result['type'] == 'master_box'){
          console.log("in if");
          const secondary_temp_index = this.master_box_array.findIndex(row => row == scanned_coupen_result['product_wise_detail'][0].master_box_id);
          if(secondary_temp_index == -1){
            
            for(let index = 0 ; index < scanned_coupen_result['product_wise_detail'].length;index++){
              
              const temp_index = this.scanned_coupon_product_detail.findIndex(row => row.product_id == scanned_coupen_result['product_wise_detail'][index].product_id);
              
              if(temp_index != -1){
                
                this.scanned_coupon_product_detail[temp_index].total_master_box_qty = this.scanned_coupon_product_detail[temp_index].total_master_box_qty+ scanned_coupen_result['product_wise_detail'][index].total_master_box_qty
                this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty+ scanned_coupen_result['product_wise_detail'][index].total_secondary_box_qty
                this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(this.scanned_coupon_product_detail[temp_index].total_primary_box_qty)+ parseInt(scanned_coupen_result['product_wise_detail'][index].total_primary_box_qty)
                this.master_box_array.push(scanned_coupen_result['product_wise_detail'][index].master_box_id)
                
              }
              else{
                
                this.scanned_coupon_product_detail.push(scanned_coupen_result['product_wise_detail'][index])
                this.master_box_array.push(scanned_coupen_result['product_wise_detail'][index].master_box_id)
                
              }
              
            }
            
          }
          else{
            console.log("in else");
            console.log(secondary_temp_index);
            console.log(this.master_box_array[secondary_temp_index]);
            
          }
          
          console.log('master_box_array = ');
          console.log(this.master_box_array);
          
          console.log('scanned_coupon_product_detail = ');
          console.log(this.scanned_coupon_product_detail);
          
          this.calculte_stock();
          
        }
        
      });
      
      
    }
    
    
  }
  
  calculte_stock() {
    
    this.barcodeScanner.scan(this.options).then(result => {
      console.log(result);
      this.master_qr_code=result.text;
      console.log( this.master_qr_code);
      
      if(this.master_qr_code != '')
      {
        this.check_qr_code_type()
        
        // this.dbService.show_loading();
        // this.dbService.fileData({'master_box_qr_code':this.master_qr_code,'manual_secondary_box_qty':this.manual_secondary_box_qty},'BoxPackaging/stock_tally').subscribe((scanned_coupen_result:any)=>{
        //   this.dbService.dismiss_loading();
        //   console.log(scanned_coupen_result);
        
        //   if(scanned_coupen_result['msg'] == 'Scanned' && scanned_coupen_result['type'] == 'master_box'){
        //     console.log("in if");
        //     const secondary_temp_index = this.master_box_array.findIndex(row => row == scanned_coupen_result['product_wise_detail'][0].master_box_id);
        //     if(secondary_temp_index == -1){
        
        //       for(let index = 0 ; index < scanned_coupen_result['product_wise_detail'].length;index++){
        
        //         const temp_index = this.scanned_coupon_product_detail.findIndex(row => row.product_id == scanned_coupen_result['product_wise_detail'][index].product_id);
        
        //         if(temp_index != -1){
        
        //           this.scanned_coupon_product_detail[temp_index].total_master_box_qty = this.scanned_coupon_product_detail[temp_index].total_master_box_qty+ scanned_coupen_result['product_wise_detail'][index].total_master_box_qty
        //           this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty+ scanned_coupen_result['product_wise_detail'][index].total_secondary_box_qty
        //           this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(this.scanned_coupon_product_detail[temp_index].total_primary_box_qty)+ parseInt(scanned_coupen_result['product_wise_detail'][index].total_primary_box_qty)
        //           this.master_box_array.push(scanned_coupen_result['product_wise_detail'][index].master_box_id)
        
        //         }
        //         else{
        
        //           this.scanned_coupon_product_detail.push(scanned_coupen_result['product_wise_detail'][index])
        //           this.master_box_array.push(scanned_coupen_result['product_wise_detail'][index].master_box_id)
        
        //         }
        
        //       }
        
        //     }
        //     else{
        //       console.log("in else");
        //       console.log(secondary_temp_index);
        //       console.log(this.master_box_array[secondary_temp_index]);
        
        //     }
        
        //     console.log('master_box_array = ');
        //     console.log(this.master_box_array);
        
        //     console.log('scanned_coupon_product_detail = ');
        //     console.log(this.scanned_coupon_product_detail);
        
        //   }
        
        //   else if(scanned_coupen_result['msg'] == 'Scanned' && scanned_coupen_result['type'] == 'secondary_box'){
        //     console.log("in else if");
        //     const secondary_temp_index = this.secondary_box_array.findIndex(row => row == scanned_coupen_result['product_wise_detail'][0].secondary_box_id);
        //     if(secondary_temp_index == -1){
        //       const temp_index = this.scanned_coupon_product_detail.findIndex(row => row.product_id == scanned_coupen_result['product_wise_detail'][0].product_id);
        
        //       if(temp_index != -1){
        
        //         this.scanned_coupon_product_detail[temp_index].total_master_box_qty = this.scanned_coupon_product_detail[temp_index].total_master_box_qty+ scanned_coupen_result['product_wise_detail'][0].total_master_box_qty
        //         this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty+ scanned_coupen_result['product_wise_detail'][0].total_secondary_box_qty
        //         this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(this.scanned_coupon_product_detail[temp_index].total_primary_box_qty)+ parseInt(scanned_coupen_result['product_wise_detail'][0].total_primary_box_qty)
        //         this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
        
        //       }
        //       else{
        
        //         this.scanned_coupon_product_detail.push(scanned_coupen_result['product_wise_detail'][0])
        //         this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
        
        //       }
        
        
        //     }
        //     else{
        //       console.log("in else");
        //       console.log(secondary_temp_index);
        //       console.log(this.secondary_box_array[secondary_temp_index]);
        
        //     }
        
        
        //     console.log('secondary_box_array = ');
        //     console.log(this.secondary_box_array);
        
        //     console.log('scanned_coupon_product_detail = ');
        //     console.log(this.scanned_coupon_product_detail);
        
        //     this.calculte_stock_test();
        //   }  
        
        //   this.calculte_stock();
        
        // });
      }
      else{
        console.log('not scanned anything');
      }
    });
    
  }
  
  //for testing purpose
  calculte_stock_test() {
    
    let alert = this.alertCtrl.create({
      title: 'Submit Master,Secondary Code',
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
            this.check_qr_code_type();
            // if(result != ''){
            //   this.dbService.fileData({'master_box_qr_code':this.master_qr_code,'manual_secondary_box_qty':this.manual_secondary_box_qty},'BoxPackaging/stock_tally').subscribe((scanned_coupen_result:any)=>{
            //     this.dbService.dismiss_loading();
            //     console.log(scanned_coupen_result);
            
            //     if(scanned_coupen_result['msg'] == 'Scanned' && scanned_coupen_result['type'] == 'master_box'){
            //       console.log("in if");
            //       const secondary_temp_index = this.master_box_array.findIndex(row => row == scanned_coupen_result['product_wise_detail'][0].master_box_id);
            //       if(secondary_temp_index == -1){
            
            //         for(let index = 0 ; index < scanned_coupen_result['product_wise_detail'].length;index++){
            
            //           const temp_index = this.scanned_coupon_product_detail.findIndex(row => row.product_id == scanned_coupen_result['product_wise_detail'][index].product_id);
            
            //           if(temp_index != -1){
            
            //             this.scanned_coupon_product_detail[temp_index].total_master_box_qty = this.scanned_coupon_product_detail[temp_index].total_master_box_qty+ scanned_coupen_result['product_wise_detail'][index].total_master_box_qty
            //             this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty+ scanned_coupen_result['product_wise_detail'][index].total_secondary_box_qty
            //             this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(this.scanned_coupon_product_detail[temp_index].total_primary_box_qty)+ parseInt(scanned_coupen_result['product_wise_detail'][index].total_primary_box_qty)
            //             this.master_box_array.push(scanned_coupen_result['product_wise_detail'][index].master_box_id)
            
            //           }
            //           else{
            
            //             this.scanned_coupon_product_detail.push(scanned_coupen_result['product_wise_detail'][index])
            //             this.master_box_array.push(scanned_coupen_result['product_wise_detail'][index].master_box_id)
            
            //           }
            
            //         }
            
            //       }
            //       else{
            //         console.log("in else");
            //         console.log(secondary_temp_index);
            //         console.log(this.master_box_array[secondary_temp_index]);
            
            //       }
            
            //       console.log('master_box_array = ');
            //       console.log(this.master_box_array);
            
            //       console.log('scanned_coupon_product_detail = ');
            //       console.log(this.scanned_coupon_product_detail);
            
            //       this.calculte_stock_test();
            //     }
            
            //     else if(scanned_coupen_result['msg'] == 'Scanned' && scanned_coupen_result['type'] == 'secondary_box'){
            //       console.log("in else if");
            //       const secondary_temp_index = this.secondary_box_array.findIndex(row => row == scanned_coupen_result['product_wise_detail'][0].secondary_box_id);
            //       if(secondary_temp_index == -1){
            //         const temp_index = this.scanned_coupon_product_detail.findIndex(row => row.product_id == scanned_coupen_result['product_wise_detail'][0].product_id);
            
            //         if(temp_index != -1){
            
            //           this.scanned_coupon_product_detail[temp_index].total_master_box_qty = this.scanned_coupon_product_detail[temp_index].total_master_box_qty+ scanned_coupen_result['product_wise_detail'][0].total_master_box_qty
            //           this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty = this.scanned_coupon_product_detail[temp_index].total_secondary_box_qty+ scanned_coupen_result['product_wise_detail'][0].total_secondary_box_qty
            //           this.scanned_coupon_product_detail[temp_index].total_primary_box_qty = parseInt(this.scanned_coupon_product_detail[temp_index].total_primary_box_qty)+ parseInt(scanned_coupen_result['product_wise_detail'][0].total_primary_box_qty)
            //           this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
            
            //         }
            //         else{
            
            //           this.scanned_coupon_product_detail.push(scanned_coupen_result['product_wise_detail'][0])
            //           this.secondary_box_array.push(scanned_coupen_result['product_wise_detail'][0].secondary_box_id)
            
            //         }
            
            
            //       }
            //       else{
            //         console.log("in else");
            //         console.log(secondary_temp_index);
            //         console.log(this.secondary_box_array[secondary_temp_index]);
            
            //       }
            
            
            //       console.log('secondary_box_array = ');
            //       console.log(this.secondary_box_array);
            
            //       console.log('scanned_coupon_product_detail = ');
            //       console.log(this.scanned_coupon_product_detail);
            
            //       this.calculte_stock_test();
            //     }               
            
            //   });
            // }
            // else{
            //   console.log('not scanned anything');
            // }
            
          }
        }
      ]
    });
    alert.present();
    
  }
  
  
  click_back_button(){
    console.log('click_back_button method calls');
    
    if(this.scanned_coupon_product_detail.length > 0 )
    {
      let alert=this.alertCtrl.create({
        title:'Are You Sure Want To Go Back?',
        subTitle: 'Scanned Data Will Be Discarded ',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.dbService.presentToast('Your Data Is Safe')
          }
        },
        {
          text:'Confirm',
          cssClass: 'close-action-sheet',
          handler:()=>
          {
            this.current_page=''
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();
    }
    else
    {
      console.log('In else');
      this.navCtrl.pop();
    }
  }
  
  
  showErrorToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top'
    });
    
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    
    toast.present();
  }
  
  download_stock_list(){
    console.log("download_stock_list method calls");
    
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'stock_data':this.scanned_coupon_product_detail},"cron/generate_stock_tally_pdf", this.dbService.rootUrlSfa).subscribe((result)=>
    {
      console.log(result);
      
      
      setTimeout(() => {
        this.dbService.dismiss_loading();
      }, 1000);
      
      
      if(result == 'success')
      {
        console.log(this.pdfUrl);
        
        var pdfName = 'stock_tally.pdf';
        
        const fileTransfer: FileTransferObject = this.transfer.create();
        
        var url = this.pdfUrl + pdfName;
        
        
        console.log(url);
        window.open(url, '_blank');
        
        DocumentViewer.previewFileFromUrlOrPath(function () {
          console.log('success');
        }, function (error) {
          if (error == 53) {
            console.log('No app that handles this file type.');
          }else if (error == 2){
            console.log('Invalid link');
          }
        },
        url, 'PDF', 'application/pdf');
        
      }
      
    });
    
    
  }
  
  
  
}
