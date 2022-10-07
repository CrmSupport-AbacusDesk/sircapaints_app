import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { FollowUpAddPage } from '../follow-up-add/follow-up-add';
import * as moment from 'moment/moment';
import { AddCheckinPage } from '../../sales-app/add-checkin/add-checkin';
import { Storage } from '@ionic/storage';
import { AddActivityPage } from '../../add-activity/add-activity';


/**
* Generated class for the FollowUpDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-follow-up-detail',
  templateUrl: 'follow-up-detail.html',
})
export class FollowUpDetailPage {


  loading:Loading;
  followup_id:any = '0';
  followup_detail:any = [];
  status:any=''
  today_date = moment(new Date()).format('YYYY-MM-DD');
  max_date = new Date().getFullYear() + 1;
  disable_update : boolean = true;
  current_followup_date:any='';
  userStorageData:any={};
  lead_status: any = [];

  dead_reason: any = [];


  constructor(public navCtrl: NavController,public storage: Storage,private alertCtrl: AlertController,public loadingCtrl:LoadingController,public dbService:DbserviceProvider, public navParams: NavParams) {

    this.storage.get('userStorageData').then((resp)=>{
      console.log(resp);

      this.userStorageData = resp
      console.log(this.userStorageData);
      console.log(this.userStorageData.user_type);
    });
this.get_lead_status()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowUpDetailPage');
  }

  ionViewWillEnter(){

    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('follow_up_id'));

    if(this.navParams.get('from') == 'follow_up_list_page' && this.navParams.get('follow_up_id')){
      this.followup_id = this.navParams.get('follow_up_id')
      this.get_followup_detail();
    }

  }

  get_followup_detail(){
    console.log("get_followup_detail method call");
    this.show_loading();
    this.dbService.onPostRequestDataFromApi({'id':this.followup_id},'Followup/followup_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.followup_detail = result['followup_detail'];
      this.status = this.followup_detail.status;
      this.current_followup_date = this.followup_detail.follow_up_date;

      this.loading.dismiss();

    },err=>
    {
      this.loading.dismiss();
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
        },
      ]
    });
    alert.present();
    this.navCtrl.pop();
  });

}

show_loading()
{
  this.loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: `<img src="./assets/imgs/gif.svg"/>`,
    dismissOnPageChange: true
  });
  this.loading.present();
}

change_followup_status(){

  console.log("change_followup_status method call");
  console.log(this.followup_detail.status);
  console.log(this.followup_detail.id);
  console.log(this.followup_detail);

  this.show_loading();

  this.dbService.onPostRequestDataFromApi(this.followup_detail.status == 'Done' ? {'id':this.followup_detail.id,'status':this.followup_detail.status} : {'id':this.followup_detail.id,'status':this.followup_detail.status,'followup_date':this.followup_detail.follow_up_date,'followup_remark':this.followup_detail.followup_remark},'Followup/followup_status_change', this.dbService.rootUrlSfa).subscribe((result)=>{
    console.log(result);
    if(result['msg'] == 'Status Updated Successfully'){
      this.loading.dismiss();

      if(this.followup_detail.status == 'Done'){
        let alert = this.alertCtrl.create({
          title: 'Add Follow Up?',
          subTitle: 'Do You Want To Create Other Follow Up',
          cssClass: 'action-close',

          buttons: [{
            text: 'NO',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          },
          {
            text: 'YES',
            cssClass: 'close-action-sheet',
            handler: () => {
              this.navCtrl.push(FollowUpAddPage,{'follow_up_data':this.followup_detail,'from':'followup detail page'});
            }
          }]
        });
        alert.present();
      }
      else{

        let alert = this.alertCtrl.create({
          title: 'Success...',
          subTitle: 'Follow Up Update Successfully',
          cssClass: 'action-close',

          buttons: [{
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
        });
        alert.present();
      }
    }


  },err=>
  {
    this.loading.dismiss();
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
      },
    ]
  });
  alert.present();
  this.navCtrl.pop();
});

}

go_to(where){

  if(where == 'checkin_start'){
    this.navCtrl.push(AddCheckinPage,{'follow_up_data':this.followup_detail,'from':'followup detail page'});
  }

}

change_followup_status_for_inside_sales_user(){

  console.log("change_followup_status method call");
  console.log(this.followup_detail.status);
  console.log(this.followup_detail.id);
  console.log(this.followup_detail);

  this.show_loading();


  this.dbService.onPostRequestDataFromApi({'id':this.followup_detail.id,'lead_status':this.followup_detail.lead_status,'dead_reason':this.followup_detail.dead_reason,'status':this.followup_detail.status,'followup_remark':this.followup_detail.followup_remark,'payment_status':this.followup_detail.payment_status,'payment_date':this.followup_detail.payment_date,'order_amount':this.followup_detail.order_amount,'sale_type':this.followup_detail.sale_type},'Followup/followup_status_change_for_inside_sales_user', this.dbService.rootUrlSfa).subscribe((result)=>{
    console.log(result);
    if(result['msg'] == 'Status Updated Successfully'){
      this.loading.dismiss();

      let alert = this.alertCtrl.create({
        title: 'Success...',
        subTitle: 'Follow Up Update Successfully',
        cssClass: 'action-close',

        buttons: [{
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();

    }


  },err=>
  {
    this.loading.dismiss();
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
      },
    ]
  });
  alert.present();
  this.navCtrl.pop();
});

}


get_lead_status(){

  console.log("get_lead_status method call");
  // console.log(this.form.dr_network_type);
  // console.log(this.form.dr_type);
  this.lead_status = [];
  this.dbService.show_loading();
  this.dbService.onPostRequestDataFromApi({},'Followup/social_media_lead_status_listing', this.dbService.rootUrlSfa).subscribe((result)=>{
    console.log(result);
    this.lead_status = result['social_media_lead_status_listing']

    this.dbService.dismiss_loading();

  });

}

get_dead_reason(){

  console.log("get_dead_reason method call");
  // console.log(this.form.dr_network_type);
  // console.log(this.form.dr_type);
  this.dead_reason = [];
  this.dbService.show_loading();
  this.dbService.onPostRequestDataFromApi({},'Followup/social_media_lead_dead_reason_listing', this.dbService.rootUrlSfa).subscribe((result)=>{
    console.log(result);
    this.dead_reason = result['social_media_lead_dead_reason_listing']

    this.dbService.dismiss_loading();

  });

}

  gotoAddActivity(data){
  this.navCtrl.push(AddActivityPage, {'data':data , 'come_from':'follow_up_detail_page'});
  }

  goOnEditDetail(data){
    this.navCtrl.push(FollowUpAddPage , {'data':data , 'comes_from':'follow_up_detail_page'})
  }
  show_true:boolean = false;
  showActivityButton(event){
    console.log(event.checked); 
    this.show_true = true;
  }

}
