import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractorListPage } from './contractor-list';

@NgModule({
  declarations: [
    ContractorListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorListPage),
  ],
})
export class ContractorListPageModule {}
