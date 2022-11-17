import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
 * Generated class for the ContractorDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contractor-detail',
  templateUrl: 'contractor-detail.html',
})
export class ContractorDetailPage {
  getData:any={};
  id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider ,public modalCtrl:ModalController ) {

    this.id=this.navParams.get('id');
    this.getContractorDetail();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractorDetailPage');
  }

  getContractorDetail(){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'id':this.id},'app_karigar/getContractorDetail',this.dbService.rootUrl).subscribe((res)=>{
      this.dbService.dismiss_loading();
      console.log(res);
      this.getData=res['contractorDetail'];

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
