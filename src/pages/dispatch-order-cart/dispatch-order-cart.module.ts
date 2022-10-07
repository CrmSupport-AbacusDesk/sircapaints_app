import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { DispatchOrderCartPage } from './dispatch-order-cart';

@NgModule({
  declarations: [
    DispatchOrderCartPage,
  ],
  imports: [
    IonicPageModule.forChild(DispatchOrderCartPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class DispatchOrderCartPageModule {}
