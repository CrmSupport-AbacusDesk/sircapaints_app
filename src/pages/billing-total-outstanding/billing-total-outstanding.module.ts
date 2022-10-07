import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingTotalOutstandingPage } from './billing-total-outstanding';

@NgModule({
  declarations: [
    BillingTotalOutstandingPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingTotalOutstandingPage),
  ],
})
export class BillingTotalOutstandingPageModule {}
