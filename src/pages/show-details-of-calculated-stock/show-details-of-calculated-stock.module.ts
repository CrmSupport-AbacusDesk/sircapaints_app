import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowDetailsOfCalculatedStockPage } from './show-details-of-calculated-stock';

@NgModule({
  declarations: [
    ShowDetailsOfCalculatedStockPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowDetailsOfCalculatedStockPage),
  ],
})
export class ShowDetailsOfCalculatedStockPageModule {}
