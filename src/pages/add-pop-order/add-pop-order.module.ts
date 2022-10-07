import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddPopOrderPage } from './add-pop-order';


@NgModule({
  declarations: [
    AddPopOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPopOrderPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class AddPopOrderPageModule {}
