import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { BillingListPage } from '../billing-list/billing-list';

/**
* Generated class for the BillingTotalOutstandingPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-billing-total-outstanding',
  templateUrl: 'billing-total-outstanding.html',
})
export class BillingTotalOutstandingPage {
  outstanding_summary: any = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingTotalOutstandingPage');
  }
  
  ionViewWillEnter(){
    this.get_outstanding_data()
  }
  
  get_outstanding_data(){
    this.dbService.onPostRequestDataFromApi({'balance_type':'outstanding'},'InvoiceBilling/outstanding_and_overdue_days_interval', this.dbService.rootUrlSfa)
    .subscribe((res)=>
    {
      console.log(res);
      this.outstanding_summary = res['previous_summary']
    },err=>
    {
      
    })
  }

  go_to_billing_list(days){
    console.log("go_to_billing_list method calls");
    console.log(days);
    this.navCtrl.push(BillingListPage,{'from':'outstanding','days':days});
  }
  
}
