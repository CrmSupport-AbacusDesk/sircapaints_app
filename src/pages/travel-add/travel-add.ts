import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
  selector: 'page-travel-add',
  templateUrl: 'travel-add.html',
})
export class TravelAddPage {
  
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;
  
  travel_data:any={
    district : [],
    dr_id : []
  };
  today_date = new Date().toISOString().slice(0,10);
  state_list:any=[]
  district_list:any=[];
  channel_partners:any=[];
  travel_list:any=[];
  loading:Loading;
  userType:any;
  cpVisitExist:any=false
  areaVisitExist:any=false
  travel_id: any = '0';
  travel_plan_detail_for_update: any = [];
  city_list:any=[];
  
  
  constructor(public navCtrl: NavController,public storage:Storage,public navParams: NavParams,public dbService: DbserviceProvider,public loadingCtrl: LoadingController ,public alertCtrl:AlertController,public toastCtrl: ToastController,) { 
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelAddPage');
    this.getStateList();
    this.getChannelPartner();
    
    const userType = this.dbService.userStorageData.user_type;
    console.log(userType);
    this.userType  = userType;
    
    
  }
  
  
  ionViewWillEnter(){
    if(this.navParams.get('from') == 'travel detail page' && this.navParams.get('travel_id')){
      this.travel_id=this.navParams.get('travel_id');
      console.log(this.travel_id);
      this.get_travel_plan_detail_for_update();
      
      
    }
  }
  
  
  getTravelPlan(date_from,date_to){
    this.cpVisitExist=false;
    this.areaVisitExist=false
    this.show_loading();
    this.dbService.onPostRequestDataFromApi({'date_from':date_from,'date_to':date_to,'from':'add'},'TravelPlan/get_travelPlan', this.dbService.rootUrlSfa).subscribe((result)=>
    {
      console.log(result);
      this.travel_list=result['travel_list'];
      console.log(this.travel_list.length);
      
      this.loading.dismiss();
      var index = this.travel_list.findIndex(row=>row.travel_type=='Channel Partner Visit')
      if(index!= -1){
        this.cpVisitExist=true
      }
      var index2 = this.travel_list.findIndex(row=>row.travel_type!='Channel Partner Visit')
      if(index2!= -1){
        this.areaVisitExist=true
      }
    },err=>
    {
      this.loading.dismiss()
      
    })
  }
  
  getStateList()
  {
    this.dbService.onPostRequestDataFromApi({},'TravelPlan/state_list', this.dbService.rootUrlSfa).subscribe((result)=>
    {
      console.log(result);
      this.state_list= result;
      
    },err=>
    {
      
    });
  }
  
  getDstrictList(){
    this.travel_data.district = [];
    this.travel_data.city = [];

    this.show_loading()
    
    this.dbService.onPostRequestDataFromApi({'state_name':this.travel_data.state},'TravelPlan/district_list', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.loading.dismiss()
      console.log(result);
      this.district_list=result;
      
      if(this.navParams.get('from') == 'travel detail page' && this.navParams.get('travel_id') && this.travel_data.travel_type == 'Area Visit'){
        for(let tmp_index = 0 ;tmp_index<this.travel_plan_detail_for_update.selected_data.length ; tmp_index++){
          
          var Index = (this.district_list.findIndex(row=>row.district_name == this.travel_plan_detail_for_update.selected_data[tmp_index].district));
          console.log(Index);
          if(Index != -1){
            var secondary_index =  this.travel_data.district.findIndex(row=>row.district_name == this.district_list[Index].district_name)
            if(secondary_index == -1){
              this.travel_data.district.push(this.district_list[Index]);
            }
          }
        }
        console.log(this.travel_data);
        this.getCityList()
      }
    },err=>
    {
      this.loading.dismiss()
      
    });
  }
  
  
  getCityList(){
    this.travel_data.city = [];
    console.log(this.travel_data);
    this.show_loading()
    
    this.dbService.onPostRequestDataFromApi({'district_name':this.travel_data.district,'state_name':this.travel_data.state},'TravelPlan/city_list', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.loading.dismiss()
      console.log(result);
      this.city_list=result;
      
      if(this.navParams.get('from') == 'travel detail page' && this.navParams.get('travel_id') && this.travel_data.travel_type == 'Area Visit'){
        for(let tmp_index = 0 ;tmp_index<this.travel_plan_detail_for_update.selected_data.length ; tmp_index++){
          var Index = (this.city_list.findIndex(row=>row.city == this.travel_plan_detail_for_update.selected_data[tmp_index].city));
          console.log(Index);
          if(Index != -1){
            this.travel_data.city.push(this.city_list[Index]);
          }
        
        }
        console.log(this.travel_data);
      }
      
    },err=>
    {
      this.loading.dismiss()
      
    });
  }
  
  
  getChannelPartner(){
    
    this.dbService.onPostRequestDataFromApi({},'TravelPlan/distributors_list', this.dbService.rootUrlSfa).subscribe((result)=>
    {
      console.log(result);
      this.channel_partners=result;
      if(this.navParams.get('from') == 'travel detail page' && this.navParams.get('travel_id') && this.travel_data.travel_type && this.travel_data.travel_type == 'Channel Partner Visit'){
        this.travel_data.dr_id = [];
        for(let tmp_index = 0 ;tmp_index<this.travel_plan_detail_for_update.selected_data.length ; tmp_index++){
          
          var Index = (this.channel_partners.findIndex(row=>row.id == this.travel_plan_detail_for_update.selected_data[tmp_index].dr_id ));
          
          if(Index != -1){
            console.log(Index);
            this.travel_data.dr_id.push(this.channel_partners[Index]);
          }
          
        }
        console.log(this.travel_data);
        
      }
      
    },err=>
    {
      
    });
  }
  
  addTravelPlan(){
    var planExist = false
    console.log(this.travel_data);
    
    // if(this.travel_data.travel_type != 'Area Visit'){
    //   var index = this.travel_list.findIndex(row=>row.dr_id==this.travel_data.dr_id)
    //   console.log(index);
    //   if(index!= -1){
    //     planExist=true
    //   }
    // }
    // else{
    //   var index2 = this.travel_list.findIndex(row=> row.state==this.travel_data.state && row.district ==this.travel_data.district)
    //   console.log(index2);
    //   if(index2 != -1){
    //     planExist=true
    //   }
    // }
    
    if(this.travel_list.length){
      planExist=true
    }
    
    console.log(planExist);
    if(planExist)
    {
      this.dbService.presentToast('Travel Plan Already Exists !!')
      return
    }
    
    this.show_loading()
    
    console.log(this.travel_data);
    if(this.travel_data.travel_type == 'Area Visit')
    {
      this.travel_data.dr_id ='';
    }
    else{
      this.travel_data.state ='';
      this.travel_data.district ='';
    }
    
    this.dbService.onPostRequestDataFromApi(this.travel_data,'TravelPlan/add_travelPlan', this.dbService.rootUrlSfa).subscribe((result)=>{
      
      this.loading.dismiss()
      
      let toast = this.toastCtrl.create({
        message: 'Travel Plan Saved Successfully!',
        duration: 3000
      });
      console.log(result);
      if(result=='success')
      {
        toast.present();
        // this.getTravelPlan(this.travel_data.date_from,this.travel_data.date_to);
        this.navCtrl.pop();
        this.travel_data.travel_type = '';
        this.travel_data.dr_id ='';
        this.travel_data.state ='';
        this.travel_data.district ='';
      }
      
    },err=>
    {
      this.loading.dismiss()
      
    });
    
  }
  
  deleteTravelPlan(id,i,flag){
    
    if(flag=='1')
    {
      this.presentAlert('Already Visted')
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: 'Delete Travel Plan',
        message: 'Do you want to delete travel plan?',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              
              this.dbService.onPostRequestDataFromApi({'id':id},'TravelPlan/deleteTravelPlan', this.dbService.rootUrlSfa).subscribe((result)=>
              {
                let toast = this.toastCtrl.create({
                  message: 'Travel Plan Deleted!',
                  duration: 3000
                });
                if(result=='success')
                {
                  toast.present();
                  this.travel_list.splice(i,1);
                  this.getTravelPlan(this.travel_data.date_from,this.travel_data.date_to);
                }
              });
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
    }
  }
  
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle:msg ,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }
  
  show_loading(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg"/>`,
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  
  update_travel_plan(){
    console.log("update_travel_plan method calls");
    
    var planExist = false
    console.log(this.travel_data);
    
    if(this.travel_list.length && this.travel_list[0].id != this.travel_id){
      planExist=true
    }
    
    console.log(planExist);
    
    if(planExist)
    {
      this.dbService.presentToast('Travel Plan Already Exists !!')
      return
    }
    this.travel_data.travel_id = this.travel_id
    
    this.show_loading()
    this.dbService.onPostRequestDataFromApi(this.travel_data,'TravelPlan/update_travel_plan', this.dbService.rootUrlSfa).subscribe((result)=>{
      
      this.loading.dismiss()
      
      let toast = this.toastCtrl.create({
        message: 'Travel Plan Update Successfully!',
        duration: 3000
      });
      console.log(result);
      if(result=='success')
      {
        toast.present();
        this.navCtrl.pop();
        
      }
      
    },err=>
    {
      this.loading.dismiss()
      
    });
    
  }
  
  
  get_travel_plan_detail_for_update() {
    console.log("get_travel_plan_detail_for_update method calls");
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'travel_id':this.travel_id},'TravelPlan/travel_plan_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result);
      this.travel_plan_detail_for_update = result['travel_detail'];
      console.log(this.travel_plan_detail_for_update);
      
      if(this.navParams.get('from') == 'travel detail page' && this.navParams.get('travel_id')){
        this.travel_data.date_from = this.travel_plan_detail_for_update.travel_date_from
        this.travel_data.date_to = this.travel_plan_detail_for_update.travel_date_to
        this.travel_data.travel_type = this.travel_plan_detail_for_update.travel_type
        
        
        if(this.travel_data.travel_type == 'Area Visit'){
          this.travel_data.state = this.travel_plan_detail_for_update.selected_data[0].state;
          this.getDstrictList();
          
        }
        
        else if(this.travel_data.travel_type == 'Channel Partner Visit'){
          this.getChannelPartner();
          
        }
        
        else{
          
        }
      }
      
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
  
  test(event,from){
    
    
    console.log(from);
    if(from == 'company_name'){
      console.log(this.travel_data);
      console.log(this.travel_data.dr_id);
      console.log(event);
      console.log(event.value);
      this.travel_data.dr_id = event.value;
      
    }
    else if(from == 'district_list'){
      console.log(this.travel_data);
      console.log(this.travel_data.district);
      console.log(event);
      console.log(event.value);
      this.travel_data.district = event.value;
      this.getCityList();
      
    }
    
    else if(from == 'city_list'){
      console.log(this.travel_data);
      console.log(this.travel_data.city);
      console.log(event);
      console.log(event.value);
      this.travel_data.city = event.value;
      
    }
    
    
  }
  
  
  
  
}
