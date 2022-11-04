import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SiteAddPage } from '../site-add/site-add';
import { SiteDetailPage } from '../site-detail/site-detail';

/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-list',
  templateUrl: 'site-list.html',
})
export class SiteListPage {

  data:any=[];
  flag:number=0;
  filter:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
  }

  doRefresh(event){

  }

  goOnSiteDetail(id){
    this.navCtrl.push(SiteDetailPage,{id});
  }


  loadData(event){

  }

  goOnSiteAdd(){
    this.navCtrl.push(SiteAddPage);
  }

  siteList(search,details,sites){

  }
}
