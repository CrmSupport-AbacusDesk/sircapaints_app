import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SiteAddPage } from '../site-add/site-add';

/**
 * Generated class for the SiteDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-detail',
  templateUrl: 'site-detail.html',
})  
export class SiteDetailPage {

  details:any;
  getData:any={};
  user:any=[];
  id:any;
  selImages:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider) {
    console.log(this.navParams.get('id'));
    this.id=this.navParams.get('id')
    this.getSiteDetail();
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteDetailPage');
  }

  doRefresh(event){

  }
  
  getSiteDetail(){
    this.dbService.show_loading();

    this.dbService.onPostRequestDataFromApi({'site_location_id':this.id},'app_master/siteLocationDetail',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);

      this.dbService.dismiss_loading();
      this.getData=res['site_locations'];

    },err=>{
      this.dbService.dismiss_loading();

    })

  }

  editSiteDetailPage(){
      this.navCtrl.push(SiteAddPage,{ 'from':'siteDetail', 'id':this.id})
  }
}
