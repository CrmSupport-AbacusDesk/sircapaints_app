import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  profile_pic:any='';
  uploadURL:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public viewCtrl:ViewController) {
                this.uploadURL = this.dbService.uploadURL;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
    console.log(this.navParams);
    
    this.profile_pic=this.navParams.get("Image");
     console.log(this.profile_pic);

  }
  closeModal(){
    this.viewCtrl.dismiss();
  }


}
