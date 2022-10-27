import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { RegistrationPage } from '../login-section/registration/registration';

/**
 * Generated class for the ArchitectorListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-architector-list',
  templateUrl: 'architector-list.html',
})
export class ArchitectorListPage {

  start:number=0;
  limit:number=10;
  filter:any={};
  architectList:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
    this.filter.start=this.start;
    this.filter.limit=this.limit;

    this.getArchitectList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArchitectorListPage');
  }

  getArchitectList(){

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'karigar':this.filter},'app_karigar/getArchitech',this.dbService.rootUrl).subscribe((ress)=>{
      console.log(ress);
      this.architectList=ress['architechData'];
      this.dbService.dismiss_loading();
    },err=>{
      this.dbService.errToasr();
      this.dbService.dismiss_loading();
    })

  }

  
  doRefresh (refresher)
  {
    this.filter=''
    this.limit=10;
    this.start=0;

      this.getArchitectList()
      setTimeout(() => {
          refresher.complete();
      }, 1000);
  }

  goToRegistrationPage(loginType){
    this.navCtrl.push(RegistrationPage,{loginType ,'Employee':'Employee'});
  } 

}
