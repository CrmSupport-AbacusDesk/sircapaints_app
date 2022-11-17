import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ContractorDetailPage } from '../contractor-detail/contractor-detail';
import { RegistrationPage } from '../login-section/registration/registration';

/**
 * Generated class for the ContractorListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contractor-list',
  templateUrl: 'contractor-list.html',
})
export class ContractorListPage {
  start:number=0;
  limit:number=10;
  filter:any={};
  contractorList:any=[]
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
    this.getContractorList();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractorListPage');
  }

  getContractorList(){

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'search':this.filter,"start":this.start,"limit":this.limit},'app_karigar/getContractor',this.dbService.rootUrl).subscribe((ress)=>{
      console.log(ress);
      this.contractorList=ress['contractorData'];
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

      this.getContractorList()
      setTimeout(() => {
          refresher.complete();
      }, 1000);
  }

  goToRegistrationPage(loginType){
    this.navCtrl.push(RegistrationPage,{loginType ,'Employee':'Employee'});
  } 

  contractorDetail(id){

    this.navCtrl.push(ContractorDetailPage,{'id':id});

  }

}
