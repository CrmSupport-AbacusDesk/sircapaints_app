import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOrderDetailPage } from './pop-order-detail';

@NgModule({
  declarations: [
    PopOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PopOrderDetailPage),
  ],
})
export class PopOrderDetailPageModule {}
