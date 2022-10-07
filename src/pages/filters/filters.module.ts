import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiltersPage } from './filters';

import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    FiltersPage,
  ],
  imports: [
    IonicPageModule.forChild(FiltersPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class FiltersPageModule {}
