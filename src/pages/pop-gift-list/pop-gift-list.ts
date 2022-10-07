import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PopGiftDetailPage } from '../pop-gift-detail/pop-gift-detail';

/**
* Generated class for the PopGiftListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-pop-gift-list',
  templateUrl: 'pop-gift-list.html',
})
export class PopGiftListPage {
  
  row :any =[]
  pop_list: any=[];
  load_data:any
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
    
    this.row = new Array(10);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopGiftListPage');
  }
  
  
  ionViewWillEnter()
  {
    this.get_pop_list();
  }
  
  get_pop_list()
  {
    this.load_data=''
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({},"Product/pop_master_list", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      console.log(resp);
      this.dbService.onDismissLoadingHandler()
      this.pop_list = resp['pop_list'];
      if(!this.pop_list.length)
      {
        this.load_data='1'
      }
    },
    err=>
    {
      this.dbService.onDismissLoadingHandler();
      this.dbService.errToasr();
    })
  }
  
  
  
  go_to_pop_detail(pop_id){
    console.log(pop_id);
    this.navCtrl.push(PopGiftDetailPage,{'id':pop_id})
  }
  
}
