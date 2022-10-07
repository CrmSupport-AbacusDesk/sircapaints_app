import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { BillingDetailPage } from '../billing-detail/billing-detail';

/**
* Generated class for the BillingListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-billing-list',
  templateUrl: 'billing-list.html',
})
export class BillingListPage {
  from: any = '';
  days: any = '';
  filter : any = {};
  billing_data_list: any = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingListPage');
  }
  
  ionViewWillEnter(){
    console.log(this.navParams);
    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('days'));
    
    this.from = (this.navParams.get('from'));
    this.days = (this.navParams.get('days'));
    this.get_selected_billing_data_list();
    
  }
  
  get_selected_billing_data_list(type:any = ''){
    
    console.log("get_selected_billing_data_list method calls");
    console.log(type);

    if(type != ''){
      this.filter.master='';
      this.filter.date = '';
      setTimeout(() => {
        type.complete();
      }, 1000);

    }

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'filter':this.filter,'balance_type':this.from,'days':this.days},'InvoiceBilling/outstanding_and_overdue_days_interval_list', this.dbService.rootUrlSfa).subscribe((result) => {
      this.dbService.dismiss_loading();
      console.log(result);
      this.billing_data_list = result
      
    })
    
  }
  
  go_to_bill_detail(bill_id){
    console.log("go_to_billing_list method calls");
    console.log(bill_id);
    this.navCtrl.push(BillingDetailPage,{'from':'billing-list','bill_id':bill_id});
  }
  
  
}
