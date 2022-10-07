import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotationDetailPage } from './quotation-detail';

@NgModule({
  declarations: [
    QuotationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotationDetailPage),
  ],
})
export class QuotationDetailPageModule {}
