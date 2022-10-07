import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams,ModalController} from 'ionic-angular';
import { timestamp } from 'rxjs/operators';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { AddPopOrderPage } from '../add-pop-order/add-pop-order';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
* Generated class for the PopOrderDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-pop-order-detail',
  templateUrl: 'pop-order-detail.html',
})
export class PopOrderDetailPage {
  today_date: Date;
  order_id : any = 0;
  loading:any;
  order_detail : any = {};
  cart_data : any =[];
  tmp_cart_data : any ={};
  
  globalCollapsible : boolean = false;
  openCollapse:any;
  active:any = {};
  db_remaining_points :any = 0;
  disable_save = false;
  order_total_item:any=0;  
  order_total_points:any=0; 
  tmp_total_qty:any=0; 
  image: any =[];
  
  
  
  
  
  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public navParams: NavParams,public loadingCtrl: LoadingController,public dbService:DbserviceProvider,public modalCtrl:ModalController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOrderDetailPage');
  }
  
  ionViewWillEnter()
  {
    this.today_date = new Date();
    console.log(this.navParams);
    this.order_id = parseInt(this.navParams.get("id"))
    console.log(this.order_id);
    this.getOrderDetails();
    
  }
  
  addMoreItem(order_id){
    console.log("add more item method calls");
    console.log(order_id);
    this.navCtrl.push(AddPopOrderPage,{"order_id":order_id,"from":"pop_order_detail"});
  }
  
  getOrderDetails(){
    console.log(this.order_id);
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({"order_id":this.order_id},"Order/pop_master_order_detail", this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.order_detail=result['pop_order_data'];
      this.image=result['pop_order_data']['image'];

      this.db_remaining_points = this.order_detail.wallet_points;
      this.cart_data=result['pop_order_item'];
      for(let i = 0;i<result['pop_order_item'].length;i++){
        this.tmp_cart_data[i] = {
          'final_points': result['pop_order_item'][i]['total_points']
        }
      }
      console.log(this.tmp_cart_data);
      
      console.log(this.cart_data);
      for(let i = 0 ;i<this.cart_data.length; i++){
        this.cart_data[i].edit_true = true;
      }      
      
      this.dbService.onDismissLoadingHandler()
    })
    
    
  }
  
  lodingPersent(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    this.loading.present();
  }
  
  calculate_values(index,qty){
    
    if(qty != null){
      console.log(this.tmp_cart_data[index]);
      console.log(this.cart_data[index]);
      console.log(this.tmp_cart_data[index].final_points > this.cart_data[index].total_points);
      
      
      if(this.tmp_cart_data[index].final_points > this.cart_data[index].total_points){
        this.order_detail.wallet_points = parseInt(this.order_detail.wallet_points) + (parseInt(this.tmp_cart_data[index].final_points) - parseInt(this.cart_data[index].total_points))
        this.tmp_cart_data[index].final_points = this.cart_data[index].total_points;
      }
      else if(this.tmp_cart_data[index].final_points < this.cart_data[index].total_points){
        this.order_detail.wallet_points = parseInt(this.order_detail.wallet_points) - (parseInt(this.cart_data[index].total_points) - parseInt(this.tmp_cart_data[index].final_points))
        this.tmp_cart_data[index].final_points = this.cart_data[index].total_points;
      }
      else{
        console.log(this.order_detail.wallet_points);
        
      }
      
      console.log(this.order_detail.wallet_points);
      console.log("calculate_values method calls");
      console.log(index);
      console.log(this.cart_data[index].qty);
      console.log(this.cart_data);
      
      console.log(qty);
      
      // if(this.cart_data[index].total_points <= this.order_detail.wallet_points){
      if(this.order_detail.wallet_points >= 0 ){
        this.cart_data[index].pending_qty = this.cart_data[index].qty;
        console.log(this.cart_data[index].total_points);
        this.disable_save = false;
      }
      else{ 
        let alert=this.alertCtrl.create({
          title:'Error !',
          // subTitle: 'Your Wallet Points is - '+ this.order_detail.wallet_points,
          subTitle: 'Your Wallet Points is - 0',
          cssClass:'action-close',
          buttons: [{
            text: 'Okay',
            role: 'Okay',
            handler: () => {}
          }]
        });
        
        if(this.cart_data[index].qty != '' && this.cart_data[index].qty != null){
          this.disable_save = true;
          alert.present();
          return;
        }
      }
      
    }
    else{
      this.disable_save = true;
    }
  }
  
  con_Int(val){
    return val = parseInt(val);
  }
  
  
  update_Order(del,index){
    
    this.lodingPersent();
    console.log(this.cart_data);
    console.log(this.order_detail);
    this.order_detail.order_total_item = 0;  
    this.order_detail.order_total_points = 0; 
    
    if(del == false){
      for(let i=0;i<this.cart_data.length;i++){
        this.order_detail.order_total_item =  parseInt(this.cart_data[i].qty)+parseInt(this.order_detail.order_total_item);
        this.order_detail.order_total_points =  parseInt(this.cart_data[i].total_points)+parseInt(this.order_detail.order_total_points);  
        
      }
      
    }
    else if (del == true){
      console.log(index);
      for(let i=0;i<this.cart_data.length;i++){
        if( i != index){
          this.order_detail.order_total_item =  parseInt(this.cart_data[i].qty)+parseInt(this.order_detail.order_total_item);
          this.order_detail.order_total_points =  parseInt(this.cart_data[i].total_points)+parseInt(this.order_detail.order_total_points);  
        } 
      }
    }
    else{
      
    }
    console.log(this.order_detail);
    
    this.dbService.onPostRequestDataFromApi({'cart_data':this.cart_data[index], 'order_data':this.order_detail, delete:del},'Order/update_pop_order_item', this.dbService.rootUrlSfa)
    .subscribe((result)=>{
      console.log(result);
      this.loading.dismiss();
      var toastString=''
      if(result['msg'] == "success")
      {
        let alert=this.alertCtrl.create({
          title:'Order Update ',
          subTitle: 'Your Remaining Points is - '+ result['remaining_wallet_points'],
          cssClass:'action-close',
          
          buttons: [{
            text: 'Okay',
            role: 'Okay',
            handler: () => {
              this.navCtrl.pop();
            }
          },
        ]
      });
      alert.present();
      return
      
      
    }
    else{
      toastString='Something Went Wrong Please try again later !'
    }
    this.dbService.presentToast(toastString)
    
  })
  
}

viewProfiePic(src)
{
    this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
}








}
