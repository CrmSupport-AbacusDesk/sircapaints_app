import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { Storage } from '@ionic/storage';


/**
* Generated class for the ExpenseDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-expense-detail',
  templateUrl: 'expense-detail.html',
})
export class ExpenseDetailPage {
  expense_id: any = '';
  expand_local:any =false;
  expand_travel:any =false;
  expand_food:any =false;
  expand_hotel:any =false;
  expand_misc:any =false;
  expense_detail: any = {};
  enable_status_change:boolean = false;
  userStorageData: any = {};
  
  constructor(public navCtrl: NavController,public storage: Storage,public modalCtrl:ModalController, public navParams: NavParams,public dbService:DbserviceProvider,private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetailPage');
  }
  
  ionViewWillEnter(){
    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('expense id'));

    if(this.navParams.get('expense id') != '0' && this.navParams.get('from') == 'expense-list page' && this.navParams.get('expense id')){
      this.expense_id = this.navParams.get('expense id')
      this.get_expense_detail();
    }
    else{
      console.log("in else");
      console.log(this.navParams.get('expense id'));
      
    }

    this.storage.get('userStorageData').then((resp)=>{
      this.userStorageData = resp
      console.log(this.userStorageData);
    });


  }
  
  get_expense_detail(){
    console.log("get_expense_detail method calls");
    
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'expenseId':this.expense_id},'Expense/expDetail', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result);
      this.expense_detail = result['expense'];
      
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
    });
  }
  
  change_expense_status(){
    console.log("change_expense_status method calls");
    
    console.log(this.expense_detail);
    this.dbService.show_loading();
    
    this.dbService.onPostRequestDataFromApi({'status':this.expense_detail['seniorStatus'],'id':this.expense_detail['id'],'reason':this.expense_detail['seniorRemark']},'Expense/expense_status_update', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      
      if(result['msg'] == 'Status Updated Successfully'){
        this.dbService.dismiss_loading();
        let alert = this.alertCtrl.create({
          title: 'Success..',
          subTitle: 'Expense Detail Update Successfully',
          cssClass: 'action-close',
          
          buttons: [{
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
        });
        alert.present();
        
      }
      else{
        this.dbService.dismiss_loading();
        let alert=this.alertCtrl.create({
          title:'Error !',
          subTitle: 'Somethong Went Wrong Please Try Again',
          cssClass:'action-close',
          
          buttons: [{
            text: 'Okay',
            role: 'Okay',
            handler: () => {
              this.navCtrl.pop();
            }
          },]
        });
        alert.present();
      }
      
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
        },]
      });
      alert.present();
      this.navCtrl.pop();
    });
    
  }



  view_image(src){
      this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
  }
  
}
