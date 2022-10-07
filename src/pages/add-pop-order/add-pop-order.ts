import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, ModalController, Events } from 'ionic-angular';
import { AddOrderPage } from '../add-order/add-order';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { CameraOptions, Camera } from '@ionic-native/camera';

import { FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { ViewProfilePage } from '../view-profile/view-profile';
import { WorkTypeModalPage } from '../work-type-modal/work-type-modal';
import { OrderSummaryPage } from '../order-summary/order-summary';
import { findIndex } from 'rxjs/operator/findIndex';

@IonicPage()
@Component({
  selector: 'page-add-pop-order',
  templateUrl: 'add-pop-order.html',
})
export class AddPopOrderPage {
  popList: any;
  data:any={};
  order_data:any = {}
  gift_cart : any = [];
  order_total_item:any=0;  
  order_total_points:any=0;  
  cartFlag:any = 0;
  user_id:any;
  db_name:any='--';
  db_gift_points : any = 0;
  db_remaining_points : any = 0
  pop_order_id: any;
  pop_order_detail: any;
  cart_data: any;
  
  videoId: any;
  image:any='';
  image_data:any=[];
  
  tmp_image:any = ''
  
  
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl:AlertController,
    public storage: Storage,
    public events:Events,
    public actionSheetController:ActionSheetController,
    public camera:Camera,
    public dbService:DbserviceProvider,
    public file:File) {
      
      this.events.subscribe(('AddOrderBackAction'),(data)=>
      {
        this.backAction()
      })
    }
    
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad AddPopOrderPage');
    }
    
    ionViewWillEnter(){
      
      console.log(this.navParams);
      this.pop_order_id = this.navParams.get("order_id");
      
      if(this.navParams.get("from") == 'pop_order_detail' && this.navParams.get("order_id")){
        console.log("in navparams if condition");
        this.getOrderDetails(this.pop_order_id)
      }
      
      this.storage.get('userId').then((id) => {
        
        console.log(id);
        if (typeof (id) !== 'undefined' && id) {
          this.user_id = id;
          console.log(this.user_id);
          
        }
        
      });
      
      this.getPop();
    }
    
    
    getPop () {
      this.dbService.onPostRequestDataFromApi('', 'Product/pop_master_list', this.dbService.rootUrlSfa)
      .subscribe((result) => {
        console.log(result)
        this.popList = result['pop_list'];
        this.db_gift_points = parseInt(result['wallet_points']);
        this.db_remaining_points = this.db_gift_points;
        this.db_name = result['dr_name'];
        
      }, err => {
        this.dbService.errToasr();
      });
    }
    
    selected_Gift_Data(){
      console.log(this.data.popGift);
      this.data.gift_points = this.data.popGift['gift_points']
      this.data.u_o_m = this.data.popGift['u_o_m'];
      this.data.image = this.data.popGift['image'];
    }
    
    MobileNumber1(event: any) {
      console.log('Decimal Restrit');
      
      const charCode = (event.which) ? event.which : event.keyCode;
      console.log(charCode);
      
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
      
    }
    
    addToCart(){
      console.log("add to cart function calls");
      this.cartFlag = 0;
      console.log(this.data);

      // if((this.data['gift_points'].search(' /') != -1)){
      //   console.log("in if condition");
      //   let avr = this.data['gift_points'].indexOf(' /');
      //   this.data['gift_points'] = this.data['gift_points'].substring(0,avr);
      // }
      
      
      
      this.data.selected_gift_name = this.data.popGift['gift_name'];
      this.data.selected_gift_id = this.data.popGift['id'];
      
      delete this.data.popGift;
      console.log(this.data);
      
      if(this.gift_cart.length < 1){
        this.gift_cart.push(this.data);
        
      }
      
      else{
        for(let i=0;i<this.gift_cart.length;i++){
          if(this.data.selected_gift_id == this.gift_cart[i].selected_gift_id){
            this.gift_cart[i].pop_gift_qty = parseInt(this.data.pop_gift_qty) + parseInt(this.gift_cart[i].pop_gift_qty)
            this.gift_cart[i].selected_gift_total_points = parseInt(this.gift_cart[i].pop_gift_qty) * parseInt(this.gift_cart[i].gift_points)
            this.cartFlag++; 
            
          }
          
        }
        
        console.log(this.cartFlag);
        if(this.cartFlag == 0){
          this.gift_cart.push(this.data);
          
        } 
      }
      console.log(this.gift_cart);
      this.order_total_item = 0;
      this.order_total_points = 0;
      for(let i=0;i<this.gift_cart.length;i++){
        this.order_total_item =  parseInt(this.gift_cart[i].pop_gift_qty)+parseInt(this.order_total_item);
        this.order_total_points =  parseInt(this.gift_cart[i].selected_gift_total_points)+parseInt(this.order_total_points);
        
      }
      this.data = {};
      
    }
    
    conInt(val){
      val = parseInt(val);
      return val;
    }
    
    save_order(){
      console.log("save order method calls");
      console.log(this.gift_cart);
      console.log(this.order_total_item);
      console.log(this.order_total_points);
      
      if(this.navParams.get("from") == 'pop_order_detail' && this.navParams.get("order_id")){
        this.order_data = {
          'order_total_item' : this.order_total_item,
          'order_total_points' : this.order_total_points,
          'order_id' : this.navParams.get("order_id"),
        } 
      }
      else{
        this.order_data = {
          'order_total_item' : this.order_total_item,
          'order_total_points' : this.order_total_points,
        }
      }
      
      
      console.log(this.order_data);
      
      this.dbService.onShowLoadingHandler();
      this.dbService.onPostRequestDataFromApi({"cart_data":this.gift_cart,'order_data':this.order_data,'imgarr':this.image_data},"dealerData/save_pop_order", this.dbService.rootUrlSfa)
      
      .subscribe(resp=>{
        console.log(resp);
        var toastString=''
        if(resp['msg'] == "success")
        {
          let alert=this.alertCtrl.create({
            title:'Order Placed ',
            subTitle: 'Your Remaining Points is - '+ resp['remaining_wallet_points'],
            cssClass:'action-close',
            
            buttons: [{
              text: 'Okay',
              role: 'Okay',
              handler: () => {
                this.dbService.onDismissLoadingHandler()
                this.navCtrl.pop();
              }
            },
          ]
        });
        alert.present();
        this.dbService.onDismissLoadingHandler()
        return
      }
      else{
        this.navCtrl.pop();
        toastString='Something Went Wrong !'
        
      }
      this.dbService.presentToast(toastString)
      this.dbService.onDismissLoadingHandler()
    })
    
  }
  
  confirm_order(){
    
    let alert=this.alertCtrl.create({
      title:'Are You Sure?',
      subTitle: 'You want to submit order',
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
          this.save_order();
        }
      }]
    });
    alert.present();
    
    
  }
  
  delete_from_cart(index){
    this.db_remaining_points = this.db_remaining_points + parseInt(this.gift_cart[index].selected_gift_total_points);
    this.gift_cart.splice(index,1);
    this.order_total_item = 0;
    this.order_total_points = 0;
    for(let i=0;i<this.gift_cart.length;i++){
      this.order_total_item =  parseInt(this.gift_cart[i].pop_gift_qty)+parseInt(this.order_total_item);
      this.order_total_points =  parseInt(this.gift_cart[i].selected_gift_total_points)+parseInt(this.order_total_points);
    }
    
  }
  
  qty_validation(){
    let flag:boolean = true;
    console.log("qty_validation method calls");
    this.data.selected_gift_total_points = parseInt(this.data.selected_gift_total_points)
    this.db_remaining_points = parseInt(this.db_remaining_points)
    
    console.log(this.data.selected_gift_total_points);
    console.log(this.db_remaining_points);
    
    if(this.data.selected_gift_total_points <= this.db_remaining_points){
      this.db_remaining_points = this.db_remaining_points - this.data.selected_gift_total_points;
      flag = true;
      
      console.log(this.data.selected_gift_total_points);
      console.log(this.db_remaining_points);
    }
    else{ 
      flag = false;
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Your Remaining Points is - '+ this.db_remaining_points,
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {}
        }]
      });
      alert.present();
      return
      
    }
    return flag;
  }
  
  
  getOrderDetails(order_id){
    console.log(order_id);
    console.log(this.gift_cart);
    
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({"order_id":order_id},"Order/pop_master_order_detail", this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.pop_order_detail=result['pop_order_data'];
      this.image_data = (result['pop_order_data']['image'])
      
      this.db_gift_points = this.pop_order_detail.wallet_points;
      this.db_remaining_points = this.db_gift_points;
      this.gift_cart=result['pop_order_item'];
      console.log(this.gift_cart);
      
      for(let i = 0 ;i<this.gift_cart.length;i++){
        this.gift_cart[i].selected_gift_id = this.gift_cart[i].pop_master_id
        delete(this.gift_cart[i].pop_master_id);
        this.gift_cart[i].selected_gift_name=this.gift_cart[i].gift_name;
        delete(this.gift_cart[i].gift_name);
        this.gift_cart[i].pop_gift_qty=this.gift_cart[i].qty;
        delete(this.gift_cart[i].qty);
        this.gift_cart[i].selected_gift_total_points=this.gift_cart[i].total_points;
        delete(this.gift_cart[i].total_points);
      }
      
      
      this.order_total_item = parseInt(this.pop_order_detail.order_total_item)
      this.order_total_points = parseInt(this.pop_order_detail.order_total_points)  
      this.dbService.onDismissLoadingHandler()
      
    })
    
    
  }
  
  
  backAction(){
    if(this.gift_cart.length )
    {
      let alert=this.alertCtrl.create({
        title:'Are You Sure?',
        subTitle: 'Your Order Data Will Be Discarded ',
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
            console.log('AddOrderBackAction');
            
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();
      
    }
    else
    {
      this.navCtrl.pop();
      console.log('Array Blank');
      
    }
    
  }
  getImage(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
      this.image= 'data:image/jpeg;base64,' + imageData;
      
      console.log(this.image);
      if(this.image)
      {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }
  
  
  fileChange(img){
    // this.image_data=[];
    this.image_data.push(img);
    console.log(this.image_data);
    this.image = '';
  }
  
  captureImageVideo(){
    let actionsheet = this.actionSheetController.create({
      title:"Upload Image",
      cssClass: 'cs-actionsheet',
      
      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          console.log("Camera Clicked");
          
          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon:'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionsheet.present();
}

takePhoto(){
  console.log("i am in camera function");
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400,
    cameraDirection:1,
    correctOrientation : true,
  }
  
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.image);
    if(this.image)
    {
      this.fileChange(this.image);
    }
  }, (err) => {
  });
}


captureMedia(){
  if(this.videoId)
  {
    this.captureImageVideo();
  }
  else
  {
    this.captureImageVideo();
  }
  
}

remove_image(i:any){
  this.image_data.splice(i,1);
}

}
