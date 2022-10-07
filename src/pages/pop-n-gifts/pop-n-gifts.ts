import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { AddPopOrderPage } from '../add-pop-order/add-pop-order';
import { PopOrderDetailPage } from '../pop-order-detail/pop-order-detail';


/**
* Generated class for the PopNGiftsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-pop-n-gifts',
  templateUrl: 'pop-n-gifts.html',
})
export class PopNGiftsPage {
  
  filter:any={}
  pop_order_list:any=[];
  start: any;
  limit:any=10;
  flag:any='';
  count: any;
  user_id: any = 0;
  wallet_points: any;
  
  
  
  
  constructor(public navCtrl: NavController,public alertCtrl:AlertController, public navParams: NavParams,public dbService:DbserviceProvider,) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopNGiftsPage');
  }
  
  ionViewWillEnter()
  {
    console.log(this.navParams.get('wallet_points'));
    this.wallet_points = parseInt(this.navParams.get('wallet_points'))
    this.user_id = this.dbService.userStorageData.id;
    this.filter.order_status='Pending'
    this.get_pop_orders(); 
  }
  
  add_pop_order(){
    
    if(this.wallet_points == 0){
      let alert=this.alertCtrl.create({
        title:'',
        subTitle: 'Your Wallet Points is - '+ this.wallet_points,
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {}
        }]
      });
      alert.present();
      return;
    }
    else{
      this.navCtrl.push(AddPopOrderPage);
    }
    
  }
  
  doRefresh (refresher)
  {
    this.start=0
    this.filter.master='';
    this.filter.date = '';
    this.get_pop_orders();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  get_pop_orders(){
    
    this.start=0
    console.log(" get pop order method calls");
    this.pop_order_list = [];
    this.dbService.onPostRequestDataFromApi({"search":this.filter,"start":this.start,"limit":this.limit,'status':this.filter.order_status,"user_id":this.user_id},"Order/pop_master_order_list", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      console.log(resp);
      if(resp != ''){
        this.pop_order_list = resp;
        // this.count = resp['count'];
        console.log(this.pop_order_list);
        this.dbService.onDismissLoadingHandler()
      }
    },err=>
    {
      this.dbService.onDismissLoadingHandler()
      this.dbService.errToasr()
    })
    setTimeout(() => {
      this.dbService.onDismissLoadingHandler();
      
    }, 2000);
  }
  
  gotoDetail(id){
    this.navCtrl.push(PopOrderDetailPage,{id:id});
  }
  
  loadData(infiniteScroll)
  {
    console.log('loading');
    this.start = this.pop_order_list.length;
    
    this.dbService.onPostRequestDataFromApi({"search":this.filter,"start":this.start,"limit":this.limit,'status':this.filter.order_status,"user_id":this.user_id},"Order/pop_master_order_list", this.dbService.rootUrlSfa)
    .subscribe((r) =>{
      console.log(r);
      if(r=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.pop_order_list=this.pop_order_list.concat(r);
          console.log('Asyn operation has stop')
          infiniteScroll.complete();
        },1000);
      }
    });
  }
  
  
  
}
