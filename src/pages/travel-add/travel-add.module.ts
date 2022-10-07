import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { TravelAddPage } from './travel-add';

@NgModule({
  declarations: [
    TravelAddPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class TravelAddPageModule {}
