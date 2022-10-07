import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { FollowUpAddPage } from '../follow-up-add/follow-up-add';
import { FollowUpDetailPage } from '../follow-up-detail/follow-up-detail';
import * as moment from 'moment/moment';


@IonicPage()
@Component({
  selector: 'page-follow-up-list',
  templateUrl: 'follow-up-list.html',
})
export class FollowUpListPage {
  
  
  loading:Loading;
  filter:any={}
  followup_list :any = [];
  start:any=0;
  today_date = moment(new Date()).format('YYYY-MM-DD');
  complete_count:any='0'
  upcoming_count:any='0'
  pending_count:any='0'

  
  
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public loadingCtrl:LoadingController,public dbService:DbserviceProvider, public navParams: NavParams) {
  }
  
  ionViewWillEnter()
  {
    this.filter.status='Pending'
    this.get_followup();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowUpListPage');
  }
  
  
  add_followup()
  {
    this.navCtrl.push(FollowUpAddPage);
  }
  
  go_to_followup_detail(id)
  {
    console.log("go_to_followup_detail method call");
    console.log(id);
    this.navCtrl.push(FollowUpDetailPage,{'follow_up_id':id , 'from':'follow_up_list_page'});
  }
  
  
  get_followup(){
    
    console.log("get_followup method calls");
    console.log(this.filter);
    
    this.show_loading();
    this.dbService.onPostRequestDataFromApi({'filter':this.filter},"Followup/followup_list", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      // this.loading.dismiss();
      console.log(resp);
      this.complete_count = resp['done'];
      this.pending_count = resp['pending_count'];
      this.upcoming_count = resp['upcoming_count'];

      this.followup_list = resp['followup_list']
      this.dismiss_loading();
    },err=>
    {
      this.dismiss_loading();
    })
    
  }
  
  
  show_loading(){
    console.log("in show");
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg"/>`,
        // dismissOnPageChange: true
      });
      this.loading.present();
    }
  }
  
  dismiss_loading(){
    console.log("in dismiss");
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }
  
  
  doRefresh (refresher){
    this.filter.master='';
    this.filter.date = '';
    this.get_followup()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  delete_followup(id){
    console.log("delete_followup method calls");
    console.log(id);
    
    
    let alert = this.alertCtrl.create({
      title: 'Confirm ',
      message: 'Are you sure you want to delete this Followup ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.dbService.show_loading();
            this.dbService.onPostRequestDataFromApi({'id':id},"Followup/followup_delete", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
              console.log(resp);
              if(resp['msg'] == 'Deleted Successfully'){
                this.dbService.presentToast('FollowUp Deleted Sucessfully')
                this.dismiss_loading();
                this.get_followup();

              }
            },err=>
            {
              this.dismiss_loading();
              this.get_followup();

            })
            
            
          }
        }
      ]
    })
    
    alert.present();
    
    
    
    
    
  }
  
  
  
  // loadData(infiniteScroll)
  // {
  //     console.log('loading');
  //     this.start = this.followup_list.length;
  //     this.dbService.onPostRequestDataFromApi({},"Followup/followup_list", this.dbService.rootUrlSfa)
  //     .subscribe((r) =>{
  //         console.log(r);
  //     });
  // }
  
  
  
  
  
}
