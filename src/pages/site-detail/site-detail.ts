import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  selImages:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteDetailPage');
  }

  doRefresh(event){

  }

}
