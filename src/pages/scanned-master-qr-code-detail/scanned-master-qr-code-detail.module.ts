import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScannedMasterQrCodeDetailPage } from './scanned-master-qr-code-detail';

@NgModule({
  declarations: [
    ScannedMasterQrCodeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ScannedMasterQrCodeDetailPage),
  ],
})
export class ScannedMasterQrCodeDetailPageModule {}
