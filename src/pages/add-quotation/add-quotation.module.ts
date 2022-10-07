import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddQuotationPage } from './add-quotation';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    AddQuotationPage,
  ],
  imports: [
    IonicPageModule.forChild(AddQuotationPage),
  
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class AddQuotationPageModule {}
