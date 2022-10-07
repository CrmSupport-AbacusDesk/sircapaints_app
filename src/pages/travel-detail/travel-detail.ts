import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TravelAddPage } from '../travel-add/travel-add';
import { Storage } from '@ionic/storage';


/**
* Generated class for the TravelDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-travel-detail',
  templateUrl: 'travel-detail.html',
})
export class TravelDetailPage {
  travel_plan_id: any = '0';
  travel_plan_detail: any = {
    'travel_type' : '',
    'district_wise_assign_dr' : [],
    'status' : ''
  };
  userStorageData: any = {};
  enable_status_change:boolean = false;
  
  
  
  
  constructor(public navCtrl: NavController,public storage: Storage,private alertCtrl: AlertController,public toastCtrl: ToastController, public navParams: NavParams,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelDetailPage');
  }
  
  ionViewWillEnter(){
    
    this.storage.get('userStorageData').then((resp)=>{
      this.userStorageData = resp
      console.log(this.userStorageData);
    });
    
    if(this.navParams.get('from') == 'travel_plan_list_page' && this.navParams.get('travel_plan_id')){
      this.travel_plan_id = this.navParams.get('travel_plan_id')
      this.get_travel_plan_detail();
    }
    
  }
  
  
  get_travel_plan_detail() {
    console.log("get_travel_plan_detail method calls");
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'travel_id':this.travel_plan_id},'TravelPlan/travel_plan_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result);
      this.travel_plan_detail = result['travel_detail']
      
    },err=>
    {
      this.dbService.dismiss_loading();
      console.log("error");
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Somethong Went Wrong Please Try Again',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            
          }
        },]
      });
      alert.present();
      this.navCtrl.pop();
    });
    
  }
  
  edit_travel_plan_detail(travel_id){
    console.log("edit_travel_plan_detail method calls");
    this.navCtrl.push(TravelAddPage,{'from':'travel detail page','travel_id':travel_id})
    
  }
  
  change_travel_plan_status(){
    console.log("change_travel_plan_status method calls");
    console.log(this.travel_plan_detail);
    console.log(this.travel_plan_detail.id);
    console.log(this.travel_plan_detail.reason);
    console.log(this.travel_plan_detail.status);
    this.dbService.show_loading()
    this.dbService.onPostRequestDataFromApi({'status':this.travel_plan_detail.status,'reason': this.travel_plan_detail.reason,'travel_id':this.travel_plan_detail.id},'TravelPlan/update_travel_plan_status_by_senior', this.dbService.rootUrlSfa).subscribe((result)=>{
      
      this.dbService.dismiss_loading()
      let toast = this.toastCtrl.create({
        message: 'Travel Plan Status Update Successfully!',
        duration: 3000
      });
      console.log(result['msg']);
      if(result['msg']=='success')
      {
        toast.present();
        this.navCtrl.pop();
        
      }
      
    },err=>
    {
      this.dbService.dismiss_loading()
      
    });
    
  }
  
}
