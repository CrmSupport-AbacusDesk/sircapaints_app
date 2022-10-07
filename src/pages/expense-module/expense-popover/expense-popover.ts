import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
* Generated class for the ExpensePopoverPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-expense-popover',
  templateUrl: 'expense-popover.html',
})
export class ExpensePopoverPage {
  page_from: any = '';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }
  
  ionViewDidLoad(){
    console.log('ionViewDidLoad ExpensePopoverPage');
  }
  
  ionViewWillEnter(){
    this.page_from = this.navParams.get('from');
  }
  
  close(type) {
    this.viewCtrl.dismiss({ 'TabStatus': type});
    this.page_from = ''
  }
  
  
}
