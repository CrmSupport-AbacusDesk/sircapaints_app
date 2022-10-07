import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';


/**
* Generated class for the EditDetailsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-edit-details',
  templateUrl: 'edit-details.html',
})
export class EditDetailsPage {

  form : any = {};
  id:any;
  data_array:any=[];
  lead_status: any = [];

  dead_reason: any = [];
  userStorageData:any={};

  constructor(public navCtrl: NavController,public storage: Storage,private alertCtrl: AlertController, public navParams: NavParams, public dbService:DbserviceProvider,) {

    this.storage.get('userStorageData').then((resp)=>{
      console.log(resp);

      this.userStorageData = resp
      console.log(this.userStorageData);
    });

    this.get_lead_status();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditDetailsPage');
  }

  ionViewWillEnter(){

    console.log("Nav Params Data : ",this.navParams);

    if(this.navParams.get('lead_detail'))
    {
      this.form = this.navParams.get('lead_detail');
      console.log(this.form);
    }
  }


  submit(){
    this.dbService.onPostRequestDataFromApi({'data':this.form},'Distributor/update_lead_by_executive', this.dbService.rootUrlSfa).subscribe((resp)=>{

      console.log(resp);
      if(resp['msg'] == 'Updated Successfully'){

        let alert=this.alertCtrl.create({
          title:'Update Successful',
          subTitle: "This Lead Is Updated Successfully",
          cssClass:'action-close',

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
      else{

        let alert=this.alertCtrl.create({
          title:'Error',
          subTitle: "Something Went Wrong, Please Try Again !",
          cssClass:'action-close',

          buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {

              }
          }]
      });
      alert.present();
      }

    });

  }
  check_mobile:any=''
  check_mobile_existence(mobile)
  {
    this.check_mobile=''
    // console.log(this.dr_id);
    if(mobile && mobile.length==10)
    {
      this.dbService.onPostRequestDataFromApi({dr_id:this.form.id,'mobile':mobile},'Enquiry/check_mobile_existence', this.dbService.rootUrlSfa).subscribe((result)=>{
        this.check_mobile = result['check_mobile'];

      })
    }

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

}
