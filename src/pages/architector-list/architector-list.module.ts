import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchitectorListPage } from './architector-list';

@NgModule({
  declarations: [
    ArchitectorListPage,
  ],
  imports: [
    IonicPageModule.forChild(ArchitectorListPage),
  ],
})
export class ArchitectorListPageModule {}
