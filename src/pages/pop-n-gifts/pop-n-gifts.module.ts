import { NgModule } from '@angular/core';
import { IonicPageModule,NavController } from 'ionic-angular';
import { PopNGiftsPage } from './pop-n-gifts';
import { AddPopOrderPage } from '../add-pop-order/add-pop-order';

@NgModule({
  declarations: [
    PopNGiftsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopNGiftsPage),
  ],
})
export class PopNGiftsPageModule {
  
  // constructor(public navCtrl: NavController){

  // }
  
  add_pop_order()
  {
      // this.navCtrl.push(AddPopOrderPage,{});
  }
}
