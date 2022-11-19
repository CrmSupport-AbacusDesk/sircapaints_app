import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
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
  site_List:any=[];
  filter:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
    this.siteList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
  }

  doRefresh (refresher)
  {
    this.filter=''
   

      this.siteList()
      setTimeout(() => {
          refresher.complete();
      }, 1000);
  }

  goOnSiteDetail(id){
    this.navCtrl.push(SiteDetailPage,{id});
  }


  // loadData(infiniteScroll)
  // {
  //     console.log('loading');
  //     this.start = this.site_List.length;

  //     this.dbService.onPostRequestDataFromApi({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit,'status':this.filter.order_status},"dealerData/get_orders2", this.dbService.rootUrlSfa)
  //     .subscribe((r) =>{
  //         console.log(r);
  //         if(r['order_list']=='')
  //         {
  //             this.flag=1;
  //         }
  //         else
  //         {
  //             setTimeout(()=>{
  //                 this.order_list=this.order_list.concat(r['order_list']);
  //                 console.log('Asyn operation has stop')
  //                 infiniteScroll.complete();
  //             },1000);
  //         }
  //     });
  // }
  goOnSiteAdd(){
    this.navCtrl.push(SiteAddPage);
  }

  siteList(){

    this.dbService.show_loading();

    this.dbService.onPostRequestDataFromApi({'filter':this.filter},'app_master/siteLocationList',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
      this.dbService.dismiss_loading();
      this.site_List=res['site_locations']['data'];
    },err=>{
      this.dbService.dismiss_loading();
    })


  }
}
