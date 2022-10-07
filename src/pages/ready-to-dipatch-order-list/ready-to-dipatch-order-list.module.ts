import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadyToDipatchOrderListPage } from './ready-to-dipatch-order-list';

@NgModule({
  declarations: [
    ReadyToDipatchOrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadyToDipatchOrderListPage),
  ],
})
export class ReadyToDipatchOrderListPageModule {}
