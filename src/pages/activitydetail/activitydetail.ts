import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


/**
 * Generated class for the ActivitydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activitydetail',
  templateUrl: 'activitydetail.html',
})
export class ActivitydetailPage {
  userStorageData:any={};
  activity_id:any = '0';
  activity_detail:any=[];
  loading:Loading;



  constructor(public navCtrl: NavController,public storage: Storage, public navParams: NavParams,public dbService:DbserviceProvider,private alertCtrl: AlertController,public loadingCtrl:LoadingController) {
    this.storage.get('userStorageData').then((resp)=>{
      console.log(resp);

      this.userStorageData = resp
      console.log(this.userStorageData);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivitydetailPage');
  }
  ionViewWillEnter(){

    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('activity_id'));

    if(this.navParams.get('from') == 'activity_list_page' && this.navParams.get('activity_id')){
      this.activity_id = this.navParams.get('activity_id')
      this.get_activity_detail();
    }

  }
  get_activity_detail(){
    console.log("get_Activity_detail method call");
    // this.show_loading();
    this.dbService.onPostRequestDataFromApi({'id':this.activity_id},'Followup/activity_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.activity_detail = result['inside_sales_activity_detail']

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


}
