import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PlumberMeetAddPage } from '../plumber-meet-add/plumber-meet-add';
import { PlumberMeetDetailPage } from '../plumber-meet-detail/plumber-meet-detail';

/**
* Generated class for the PlumberMeetListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-plumber-meet-list',
  templateUrl: 'plumber-meet-list.html',
})
export class PlumberMeetListPage {
  
  filter:any = {};
  tab_active:any = 'Pending';
  plumber_meet_list: any = [];
  count_data: any = [];
  user_data:any={};


  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider,private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlumberMeetListPage');
  }
  
  ionViewWillEnter(){
    console.log("ionViewWillEnter method calls");
    this.user_data = this.dbService.userStorageData;
    console.log(this.user_data);
    this.get_plumber_meet_list()
  }

  doRefresh (refresher){
    this.filter.master='';
    this.filter.date = '';
    this.get_plumber_meet_list()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  get_plumber_meet_list(){
    console.log("get_plumber_meet_list method calls");
    
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'filter':this.filter,'status':this.tab_active},"PlumberMeet/plumber_meet_list", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      this.plumber_meet_list = resp['plumber_meet_list']
      this.count_data = resp['count_data']
      
      
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
        }]
      });
      alert.present();
      this.navCtrl.pop();
    })
    
  }

  delete_meet(meet_id){
    console.log("delete_meet method calls");
    console.log("meet_id = "+meet_id);
    
    let alert = this.alertCtrl.create({
      title: 'Confirmation !',
      message: 'Are you sure you want to delete this Plumber Meet ?',
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
            this.dbService.onPostRequestDataFromApi({'meet_id':meet_id},"PlumberMeet/plumber_meet_remove", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
              console.log(resp);
              if(resp['msg'] == 'Deleted Successfully'){
                this.dbService.presentToast('Plumber Meet Deleted Sucessfully')
                this.dbService.dismiss_loading();
                this.get_plumber_meet_list();
                
              }
              else{
                this.dbService.errToasr();
                this.dbService.dismiss_loading();
                this.get_plumber_meet_list();
              }
            },err=>
            {
              this.dbService.dismiss_loading();
              this.get_plumber_meet_list();
              
            })
          }
        }
      ]
    })
    alert.present();
    
  }

  go_to(where,value:any=''){
    
    console.log("go_to method calls");
    console.log("where = "+where);
    console.log("value = "+value);

    if(where == 'plumber_meet_add'){
      this.navCtrl.push(PlumberMeetAddPage);
      
    }
    else if(where == 'meet_detail' && value!=''){
      console.log('in go to meet detail');
      this.navCtrl.push(PlumberMeetDetailPage,{'meet id':value , 'from':'plumber-meet-list page'});      
      
    }
    else{
      console.log("error in go_to");
    }
    
    
  }

}
