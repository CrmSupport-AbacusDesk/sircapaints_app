import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractorDetailPage } from './contractor-detail';

@NgModule({
  declarations: [
    ContractorDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorDetailPage),
  ],
})
export class ContractorDetailPageModule {}
