import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
 * Generated class for the ArchitectDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-architect-detail',
  templateUrl: 'architect-detail.html',
})
export class ArchitectDetailPage {
  getData:any={};
  id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider ,public modalCtrl:ModalController) {
    this.id=this.navParams.get('id');
    this.getArchitectDetail();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchitectDetailPage');
  }

  getArchitectDetail(){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'id':this.id},'app_karigar/getArchitechDetail',this.dbService.rootUrl).subscribe((res)=>{
      this.dbService.dismiss_loading();
      console.log(res);
      this.getData=res['architechDetail'];

    },err=>{
      this.dbService.dismiss_loading()
    })

  }

  imageModal(src)
  {
      console.log(src);
      
      this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
  }

}
