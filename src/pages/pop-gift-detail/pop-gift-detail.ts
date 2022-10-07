import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
* Generated class for the PopGiftDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-pop-gift-detail',
  templateUrl: 'pop-gift-detail.html',
})
export class PopGiftDetailPage {
  gift_detail: any = {};
  gift_id: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopGiftDetailPage');
    
  }
  
  ionViewWillEnter()
  {
    console.log(this.navParams);
    console.log(this.navParams.get('id'));
    this.gift_id =  this.navParams.get('id');
    this.pop_gift_detail();
    
  }
  
  pop_gift_detail()
  {
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({'id':this.gift_id},'Product/pop_master_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.gift_detail = result;
      console.log(this.gift_detail);

      this.dbService.onDismissLoadingHandler()
    },
    err=>
    {
      this.dbService.onDismissLoadingHandler();
      this.dbService.errToasr();
    })
  }
  
  
  
}
