import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

import { ExpenseAddPage } from '../expense-add/expense-add';
import { ExpenseDetailPage } from '../expense-detail/expense-detail';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';

/**
* Generated class for the ExpenseListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-expense-list',
  templateUrl: 'expense-list.html',
})
export class ExpenseListPage {
  
  tab_active:any = 'Pending';
  filter:any = {};
  expense_list: any = [];
  count_data: any = [];
  expenseType:any="My";
  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService:DbserviceProvider,private alertCtrl: AlertController,  public popoverCtrl: PopoverController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseListPage');
  }
  
  ionViewWillEnter(){
    this.get_expense_list();
  }
  
  doRefresh (refresher){
    this.filter.master='';
    this.filter.date = '';
    this.get_expense_list()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  get_expense_list(){
    console.log("get_expense_list method calls");
    
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'filter':this.filter,'status':this.tab_active,'expense_type':this.expenseType},"Expense/expList", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      console.log(resp);
      this.expense_list = resp['result']
      this.count_data = resp['count_data']
      this.dbService.dismiss_loading();
      
    },err=>
    {
      this.dbService.dismiss_loading();
      console.log("error");
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Somethong Went Wrong Please Try Again',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            
          }
        }]
      });
      alert.present();
      this.navCtrl.pop();
    })
    
  }
  
  go_to_expense_detail(expense_id){
    console.log("go_to_expense_detail method calls");
    console.log(expense_id);
    this.navCtrl.push(ExpenseDetailPage,{'expense id':expense_id , 'from':'expense-list page'});
  }
  
  delete_expense(expense_id){
    console.log("delete_expense method calls");
    console.log(expense_id);
    
    let alert = this.alertCtrl.create({
      title: 'Confirmation !',
      message: 'Are you sure you want to delete this Expense ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.dbService.show_loading();
            this.dbService.onPostRequestDataFromApi({'expenseId':expense_id},"Expense/expense_delete", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
              console.log(resp);
              if(resp['msg'] == 'Deleted Successfully'){
                this.dbService.presentToast('Expense Deleted Sucessfully')
                this.dbService.dismiss_loading();
                this.get_expense_list();
                
              }
              else{
                this.dbService.errToasr();
                this.dbService.dismiss_loading();
                this.get_expense_list();
              }
            },err=>
            {
              this.dbService.dismiss_loading();
              this.get_expense_list();
              
            })
          }
        }
      ]
    })
    
    alert.present();
    
    
    
    
  }
  
  add_expense(){
    console.log("add_expense method calls");
    this.navCtrl.push(ExpenseAddPage,{'from':'expense-list page'});
    
  }
  
  
  presentPopover(myEvent) {
    
    let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Expense List'});
    popover.present({
      ev: myEvent
    });
    
    popover.onDidDismiss(resultData => {
      console.log(resultData);
      this.expenseType = resultData.TabStatus;
      console.log(this.expenseType);
      this.get_expense_list();
    })
    
  }
  
}
