import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController, PopoverController } from 'ionic-angular';
import { TravelAddPage } from '../travel-add/travel-add';
import moment from 'moment';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TravelDetailPage } from '../travel-detail/travel-detail';
import { ExpensePopoverPage } from '../expense-module/expense-popover/expense-popover';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-travel-list',
  templateUrl: 'travel-list.html',
})
export class TravelListPage {
  
  today_date = new Date().toISOString().slice(0,10);
  travel_list:any=[];
  selected_date =new Date().toISOString().slice(0,10);
  loading:Loading;
  userId:any
  filter:any = {};
  cpVisitExist:any=false
  areaVisitExist:any=false
  requestSend:any = false;
  userStorageData: any = {};

  travel_plan_counts: any = {
    
    travel_plan_today_count : '0',
    travel_plan_reject_count : '0',
    travel_plan_pending_count : '0',
    travel_plan_approved_count : '0'
    
  };
  travel_team_type: any = 'My';
  
  constructor(public navCtrl: NavController,public storage: Storage,public popoverCtrl: PopoverController,public navParams: NavParams,public dbService: DbserviceProvider,public loadingCtrl: LoadingController,public alertCtrl:AlertController,public toastCtrl: ToastController){
    this.userId = this.navParams.get('userId');
  }
  
  ionViewWillEnter(){

    this.storage.get('userStorageData').then((resp)=>{
      this.userStorageData = resp
      console.log(this.userStorageData);
    });

    this.filter.status='Today'
    this.getTravelPlan();
  }
  
  goOnAddTravel(){
    this.navCtrl.push(TravelAddPage,{'from':'travel list page'})
  }
  
  
  nextDate(){
    console.log( this.selected_date);
    this.selected_date = moment(this.selected_date).add(1, 'days').format('YYYY-M-D');
    console.log( this.selected_date);
    this.getTravelPlan();
    
  }
  
  previousDate(){
    this.selected_date = moment(this.selected_date).subtract(1, "days").format('YYYY-M-D');
    this.getTravelPlan();
  }
  
  getTravelPlan(){
    this.cpVisitExist=false;
    this.areaVisitExist=false
    this.requestSend=false
    this.show_loading();
    // this.dbService.onPostRequestDataFromApi({'travel_date':date,userId:this.userId},'TravelPlan/get_travelPlan', this.dbService.rootUrlSfa).subscribe((result)=>
    this.dbService.onPostRequestDataFromApi({'travel_team_type':this.travel_team_type,'filter':this.filter,'from':'list'},'TravelPlan/get_travelPlan', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.travel_list=result['travel_list'];
      this.travel_plan_counts=result['travel_plan_status_wise_count_data'];
      
      this.loading.dismiss();
      var index = this.travel_list.findIndex(row=>row.travel_type=='Channel Partner Visit')
      if(index!= -1){
        this.cpVisitExist=true
      }
      var index2 = this.travel_list.findIndex(row=>row.travel_type!='Channel Partner Visit')
      if(index2!= -1){
        this.areaVisitExist=true
      }
      this.requestSend=true
    })
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
            handler: () =>
            {
              this.dbService.onPostRequestDataFromApi({'id':id},'TravelPlan/deleteTravelPlan', this.dbService.rootUrlSfa).subscribe((result)=>
              {
                let toast = this.toastCtrl.create({
                  message: 'Travel Plan Deleted!',
                  duration: 3000
                });
                if(result=='success')
                {
                  this.travel_list.splice(i,1);
                  this.getTravelPlan();
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
  
  show_loading(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg"/>`,
      dismissOnPageChange: true
    });
    this.loading.present();
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
  
  doRefresh (refresher){
    this.filter.master='';
    this.filter.date = '';
    this.getTravelPlan()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  
  go_to_travel_plane_detail(id){
    console.log("go_to_travel_plane_detail method calls");
    console.log(id);
    this.navCtrl.push(TravelDetailPage,{'travel_plan_id':id , 'from':'travel_plan_list_page'});
  }
  
  presentPopover(myEvent){
    let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Travel Plan List'});
    popover.present({
      ev: myEvent
    });
    
    popover.onDidDismiss(resultData => {
      console.log(resultData);
      this.travel_team_type = resultData.TabStatus;
      console.log(this.travel_team_type);
      this.getTravelPlan();
    })
    
  }
  
  
  
  
}
