import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FollowUpAddPage } from '../follow-up/follow-up-add/follow-up-add';
import { NotificationPage } from '../notification/notification';
import { ActivitydetailPage } from '../activitydetail/activitydetail';


/**
 * Generated class for the AddActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-activity',
  templateUrl: 'add-activity.html',
})
export class AddActivityPage {


  activity_data : any = {};
  dr_list:any=[];
  follow_up_data: any = {};
  userStorageData:any={};

  drDetail: any = {};

  disposition_type : any = [];

  disposition_name : any = [];
  selected_date_followups_list : any = [];

  today_date = new Date().toISOString().slice(0,10);
  max_date = new Date().getFullYear() + 1;

  dr_network_type : any = '';


  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public storage: Storage,private toastCtrl: ToastController,public loadingCtrl:LoadingController, public navParams: NavParams,public dbService: DbserviceProvider) {

    this.storage.get('userStorageData').then((resp)=>{
      console.log(resp);

      this.userStorageData = resp
      console.log(this.userStorageData);
    });

    console.log("Get NavParams Data: ",this.navParams.data);

    if(this.navParams.data['comes_from'] =='dr_detail_page'){

      this.activity_data = {
        dr_id: this.navParams.data['dr_id'],
        dr_network_type: this.navParams.data['network_type'],
        dr_type: this.navParams.data['type'],
        company_name : this.navParams.data['company_name'],
        comes_from:this.navParams.data['comes_from']
      }
    
  
      this.drDetail = {
        dr_id: this.navParams.data['dr_id'],
        dr_name: this.navParams.data['company_name'],
      }

      this.dr_list.push(this.drDetail);

      console.log("Dr List Array ", this.dr_list);


    }
    if(this.navParams.data['come_from'] == 'follow_up_detail_page'){
      this.activity_data = {
    dr_network_type: this.navParams.data['data'].network_type,
    dr_id: this.navParams.data['data'].dr_id,
    comes_from:this.navParams.data['come_from'],
    description:this.navParams.data['data'].description,
    dr_type : this.navParams.data['data'].type,
    followup_date :  this.navParams.data['data'].follow_up_date,
    followup_time : this.navParams.data['data'].follow_up_time,
    followup_type : this.navParams.data['data'].follow_up_type,
    area : this.navParams.data['data'].area,
    address : this.navParams.data['data'].address,
    assigned_to :this.navParams.data['data'].assigned_to, 
    city : this.navParams.data['data'].city,
    created_by : this.navParams.data['data'].created_by,
    created_by_name :  this.navParams.data['data'].created_by_name,
    date_created : this.navParams.data['data'].date_created,
    del : this.navParams.data['data'].del,
    district : this.navParams.data['data'].district,
    dr_name : this.navParams.data['data'].dr_name,
    id : this.navParams.data['data'].id,
    mobile : this.navParams.data['data'].mobile,
    pincode : this.navParams.data['data'].pincode,
    state : this.navParams.data['data'].state,
    status : this.navParams.data['data'].status,
    updated_at : this.navParams.data['data'].updated_at,
    updated_by : this.navParams.data['data'].updated_by,
      }
      console.log(this.activity_data);
      this.drDetail = {
        dr_id: this.navParams.data['data'].dr_id,
        dr_name : this.navParams.data['data'].dr_name,
      }

      this.dr_list.push(this.drDetail);

      console.log("Dr List Array ", this.dr_list);
  }
    console.log("today_date",this.today_date);

    console.log("max_date",this.max_date);


    // if(this.navParams.get('network_type'))
    // {
    //     this.activity_data.dr_network_type=this.navParams.get('network_type');
    //     console.log("From Party Clicked: ",this.activity_data.dr_network_type);
    //     // this.lead_detail();
    // }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddActivityPage');
  }

  getDrList(){
    console.log("getDrList method call");
    console.log(this.activity_data.dr_network_type);
    console.log(this.activity_data.dr_type);
    this.dr_list = []
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'dr_network_type':this.activity_data.dr_network_type,'dr_type':this.activity_data.dr_type},'Followup/dr_list', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.dr_list = result['dr_list']
      for(let i=0;i<this.dr_list.length;i++){
        this.dr_list[i].dr_name = this.dr_list[i].dr_name + (this.dr_list[i].dr_city && this.dr_list[i].dr_city != '' ? ' -- '+ this.dr_list[i].dr_city : '')
      }
      this.dbService.dismiss_loading();

    });

  }

  get_disposition_type(){

    console.log("get_disposition_type method call");
    console.log(this.activity_data.dr_network_type);
    console.log(this.activity_data.dr_type);
    this.disposition_type = [];
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'dr_type':this.activity_data.dr_type},'Followup/disposition_type_for_existing', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.disposition_type = result['disposition_type']

      this.dbService.dismiss_loading();

    });

  }

  get_disposition_type_name(){

    console.log("get_disposition_type_name method call");
    console.log(this.activity_data.dr_network_type);
    console.log(this.activity_data.dr_type);
    this.disposition_name = [];
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'dr_type':this.activity_data.dr_type , 'disposition_type':this.activity_data.disposition_type},'Followup/disposition_name_for_existing', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.disposition_name = result['disposition_name'];

      this.dbService.dismiss_loading();

    });

  }

  addActivity(){
    console.log("add_activity method call");
    console.log(this.activity_data);

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi(this.activity_data, 'Followup/add_activity',  this.dbService.rootUrlSfa).subscribe(response => {
      console.log(response);
      this.dbService.dismiss_loading();

      if(response['msg'] == 'success'){

        this.presentToast1();

        // this.navCtrl.push(FollowUpAddPage,{'comes_from':'activity_page' , 'dr_id':this.activity_data.dr_id, 'network_type':this.activity_data.dr_network_type, 'type':this.activity_data.dr_type, 'company_name':this.activity_data.company_name});

        this.navCtrl.push(NotificationPage,{});

        // this.presentAlert2();

        // this.navCtrl.pop();
      }
      // else if(response['msg'] == 'Already Exist Followup'){
      //   let alert=this.alertCtrl.create({
      //     title:'',
      //     subTitle: 'Follow Up already exist and in Pending stage',
      //     cssClass:'action-close',

      //     buttons: [{
      //       text: 'Okay',
      //       role: 'Okay',
      //       handler: () => {}
      //     }]
      //   });
      //   alert.present();
      //   return;
      // }
      else{
        this.dbService.errToasr()
      }

    },err=> {
      this.dbService.dismiss_loading();
      this.dbService.errToasr()

    });

  }

 

  presentToast1() {

    let toast1 = this.toastCtrl.create({
      message: 'Activity Added Successfully',
      duration: 3000,
      position: 'bottom'
    });
    toast1.present();
  }

  presentAlert2() {
    let alert = this.alertCtrl.create({
      title: 'Create Follow Up',
      message: 'Do you want to create follow up for this activity?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Yes',
          handler: () => {

            console.log('Yes clicked');
            this.navCtrl.pop();
            this.navCtrl.push(FollowUpAddPage,{'from':'activity page'});

          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

            console.log('Cancel clicked');

            this.navCtrl.pop();


          }
        }
      ]
    });
    alert.present();
  }


  test(event){

    console.log(this.activity_data);
    console.log(this.activity_data.dr_id);
    console.log(event);
    console.log(event.value.dr_id);
    this.activity_data.dr_id = event.value.dr_id;


  }

  get_selected_date_followup(){
    console.log("get_selected_date_followup method calls");
    console.log(this.activity_data.followup_date);
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'followup_date': this.activity_data.followup_date},'Followup/same_date_followup_list', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.selected_date_followups_list = result['same_date_followup_list'];
      this.dbService.dismiss_loading();

    });

  }


}
