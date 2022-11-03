import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the SiteAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-add',
  templateUrl: 'site-add.html',
})
export class SiteAddPage {

  siteform:any={};
  citys:any=[];
  districts:any=[];
  states:any=[];
  dealers:any=[];
  brandData:any=[];
  pcs:any=[];
  engineer:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteAddPage');
    this.getStates();
  }


  submit(){

  }

  getStates(){
    this.dbService.show_loading();
    this.dbService.onGetRequestDataFromApi('app_master/getStates',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
        this.states=res['states'];
        this.dbService.dismiss_loading();
    },err=>{
      this.dbService.dismiss_loading();

    })
    

  }

  getDistrictList(state_name){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
        this.districts=res['districts'];
        this.dbService.dismiss_loading();
    },err=>{
      this.dbService.dismiss_loading();

    })
    
  }

  getCityList(district_name){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'district_name':district_name},'app_master/getCity',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
        this.citys=res['cities'];
        this.dbService.dismiss_loading();
    },err=>{
      this.dbService.dismiss_loading();

    })
  }

  getZoneList(city_name){

  }

}
