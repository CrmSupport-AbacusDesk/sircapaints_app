import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';


/**
* Generated class for the TargetAchievementPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-target-achievement',
  templateUrl: 'target-achievement.html',
})
export class TargetAchievementPage {
  target_list_next_months: any=[];
  form:any;
  target_list_previous_months: any=[];
  from:any;
  tab_active : any = 'Upcoming';
  dr_target_list:any=[];
  dr_upcoming_target:any=[];
  assigned_area_data: any = [];
  
  
  constructor(public navCtrl: NavController,public storage: Storage,public dbService: DbserviceProvider,public viewcontrol: ViewController, public navParams: NavParams) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TargetAchievementPage');
  }
  
  ionViewWillEnter()
  {
    
    this.storage.get('userStorageData').then((userStorageData) => {
      console.log(userStorageData);
    });
    console.log(this.navParams.get('from'));
    this.from = (this.navParams.get('from'));
    console.log(this.from);
    this.get_target_data();
    this.get_dr_target_data();
  }
  
  
  close() {
    this.viewcontrol.dismiss();
  }
  
  get_target_data(){
    console.log("get_target_data method calls");
    
    this.dbService.onGetRequestDataFromApi('User/last_twelve_months_and_next_three_months_target_list', this.dbService.rootUrlSfa).subscribe((result) => {
      console.log(result);
      this.target_list_previous_months = result['new_target_list_previous_months'];
      this.target_list_next_months = result['new_target_list_next_months'];
      
      console.log(this.target_list_previous_months);
      console.log(this.target_list_next_months);
      
      
    })
    
    
    
  }
  
  
  get_dr_target_data(){
    
    this.dbService.onGetRequestDataFromApi('Distributor/dr_target_and_achive_history', this.dbService.rootUrlSfa).subscribe((result) => {
      console.log(result);
      this.dr_target_list=result['dr_target_and_achive_history'];
      this.assigned_area_data=result['assigned_area_list'];
      console.log( this.dr_target_list);
      this.dr_upcoming_target=result['upcoming_target'];
      console.log( this.dr_upcoming_target);
      
      
    })
  }
  
}
