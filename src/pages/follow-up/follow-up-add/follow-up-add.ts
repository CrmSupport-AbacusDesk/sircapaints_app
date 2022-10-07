import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-follow-up-add',
  templateUrl: 'follow-up-add.html',
})
export class FollowUpAddPage {

  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

  followup_data : any = {};
  today_date = new Date().toISOString().slice(0,10);
  max_date = new Date().getFullYear() + 1;
  dr_list:any=[];
  selected_date_followups_list : any = [];
  loading:Loading;
  checkinData: any = {};
  temp_data:any = {};
  follow_up_data: any = {};
  userStorageData:any={};

  drDetail: any = {};




  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public storage: Storage,private toastCtrl: ToastController,public loadingCtrl:LoadingController, public navParams: NavParams,public dbService: DbserviceProvider) {

    this.storage.get('userStorageData').then((resp)=>{
      console.log(resp);

      this.userStorageData = resp
      console.log(this.userStorageData);
    });


    console.log("NavParams Data : ",this.navParams.data['comes_from']);

    if(this.navParams.get('for_order') && this.navParams.get('from') == 'end_checkin page'){
      console.log("from end_checkin page");

      this.checkinData = this.navParams.get('for_order')
      console.log(this.checkinData);
      this.followup_data.followup_date = this.today_date;
      this.get_selected_date_followup()
      this.followup_data.dr_network_type = this.checkinData['lead_type'];
      this.followup_data.dr_type = this.checkinData['dr_type'];
      this.getDrList();
    }

    if(this.navParams.get('follow_up_data') && this.navParams.get('from') == 'followup detail page'){
      console.log("from followup detail page");
      this.follow_up_data = this.navParams.get('follow_up_data')
      console.log(this.follow_up_data);
      this.followup_data.followup_date = this.today_date;
      this.get_selected_date_followup()
      this.followup_data.dr_network_type = this.follow_up_data['network_type'];
      this.followup_data.dr_type = this.follow_up_data['type'];
      this.getDrList();

    }

    if(this.navParams.data['comes_from'] == 'follow_up_detail_page'){
      console.log("follow up detail page");
      
      this.followup_data = {
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
      this.drDetail = {
        dr_id: this.navParams.data['data'].dr_id,
        dr_name: this.navParams.data['data'].dr_name,
      }

      this.dr_list.push(this.drDetail);
      console.log(this.dr_list);
      
    }

    if(this.navParams.data['comes_from'] == 'activity_page'){

      this.followup_data = {
        dr_id: this.navParams.data['dr_id'],
        dr_network_type: this.navParams.data['network_type'],
        dr_type: this.navParams.data['type'],
        company_name : this.navParams.data['company_name']
      }

      this.drDetail = {
        dr_id: this.navParams.data['dr_id'],
        dr_name: this.navParams.data['company_name'],
      }

      this.dr_list.push(this.drDetail);

    }






  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowUpAddPage');
  }


  getDrList(){
    console.log("getDrList method call");
    console.log(this.followup_data.network_type);
    console.log(this.followup_data.dr_type);
    this.dr_list = []
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'dr_network_type':this.followup_data.dr_network_type,'dr_type':this.followup_data.dr_type},'Followup/dr_list', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.dr_list = result['dr_list']
      for(let i=0;i<this.dr_list.length;i++){
        this.dr_list[i].dr_name = this.dr_list[i].dr_name + (this.dr_list[i].dr_city && this.dr_list[i].dr_city != '' ? ' -- '+ this.dr_list[i].dr_city : '')
      }
      this.dbService.dismiss_loading();

      if(this.navParams.get('for_order') && this.navParams.get('from') == 'end_checkin page'){
        var Index =  this.dr_list.findIndex(row=>row.dr_id==this.checkinData.dr_id)
        console.log(this.dr_list[Index]);
        this.temp_data = this.dr_list[Index]
        this.followup_data.dr_id = this.checkinData.dr_id;
      }

      if(this.navParams.get('follow_up_data') && this.navParams.get('from') == 'followup detail page'){
        var Index =  this.dr_list.findIndex(row=>row.dr_id==this.follow_up_data.dr_id)
        console.log(this.dr_list[Index]);
        this.temp_data = this.dr_list[Index]
        this.followup_data.dr_id = this.follow_up_data.dr_id;
      }

      if( this.navParams.data['comes_from'] == 'follow_up_detail_page'){
        console.log('dr list'+this.dr_list);
        
        var Index =  this.dr_list.findIndex(row=>row.dr_id==this.follow_up_data.dr_id)
        console.log(this.dr_list[Index]);
        this.temp_data = this.dr_list[Index]
        this.followup_data.dr_id = this.follow_up_data.dr_id;
      }


    });

  }



  add_Followup(){
    console.log("add_Followup method call");
    console.log(this.followup_data);

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi(this.followup_data, 'Followup/add_followup',  this.dbService.rootUrlSfa).subscribe(response => {
      console.log(response);
      this.dbService.dismiss_loading();

      if(response['msg'] == 'success'){
        this.presentToast1();
        this.navCtrl.pop();
      }
      else if(response['msg'] == 'Already Exist Followup'){
        let alert=this.alertCtrl.create({
          title:'',
          subTitle: 'Follow Up already exist and in Pending stage',
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
        this.dbService.errToasr()
      }

    },err=> {
      this.dbService.dismiss_loading();
      this.dbService.errToasr()

    });

  }

  Update_Followup(){
    console.log("add_Followup method call");
    console.log(this.followup_data);

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi(this.followup_data, 'Followup/update_followup',  this.dbService.rootUrlSfa).subscribe(response => {
      console.log(response);
      this.dbService.dismiss_loading();

      if(response['msg'] == 'success'){
        this.presentToast1();
        this.navCtrl.pop();
      }
      else if(response['msg'] == 'Already Exist Followup'){
        let alert=this.alertCtrl.create({
          title:'',
          subTitle: 'Follow Up already exist and in Pending stage',
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
        this.dbService.errToasr()
      }

    },err=> {
      this.dbService.dismiss_loading();
      this.dbService.errToasr()

    });

  }

  presentToast1() {

    let toast1 = this.toastCtrl.create({
      message: 'Follow Up Added Successfully',
      duration: 3000,
      position: 'bottom'
    });
    toast1.present();
  }

  get_selected_date_followup(){
    console.log("get_selected_date_followup method calls");
    console.log(this.followup_data.followup_date);
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'followup_date': this.followup_data.followup_date},'Followup/same_date_followup_list', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.selected_date_followups_list = result['same_date_followup_list'];
      this.dbService.dismiss_loading();

    });

  }

  test(event){

    console.log(this.followup_data);
    console.log(this.followup_data.dr_id);
    console.log(event);
    console.log(event.value.dr_id);
    this.followup_data.dr_id = event.value.dr_id;


  }

}
