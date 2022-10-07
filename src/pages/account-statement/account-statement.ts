import { Component } from '@angular/core';
import { Events, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FiltersPage } from '../filters/filters';

/**
* Generated class for the AccountStatementPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-account-statement',
  templateUrl: 'account-statement.html',
})
export class AccountStatementPage {
  final_pending_balance: any = 0;
  final_opening_balance: any = 0;
  account_statement_list: any = [];
  filter : any = {}
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public modal: ModalController,public events: Events,public dbService: DbserviceProvider,) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountStatementPage');
  }
  
  ionViewWillEnter(){
    this.get_account_statement_data();
  }
  
  
  open_filter_modal(){
    
    console.log("open_filter_modal method calls");
    
    let FiltersPageModal =  this.modal.create(FiltersPage,{'filter':this.filter,'from':'account-statement-page'});
    FiltersPageModal.onDidDismiss(data =>{
      if(data == 'minimise'){

      }
      else{
        console.log(data);
        this.filter = data;
        this.get_account_statement_data();
      }
    });
    FiltersPageModal.present();
  }
  
  
  get_account_statement_data(){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'filter':this.filter},'InvoiceBilling/account_statement_list', this.dbService.rootUrlSfa).subscribe((result) => {
      this.dbService.dismiss_loading();
      console.log(result);
      this.account_statement_list = result['account_list'];
      this.final_opening_balance = result['final_opening_balance'];
      this.final_pending_balance = result['closed_balance'];

    })
  }
  
  
}
