import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController,Loading, LoadingController, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import moment from 'moment';

/**
 * Generated class for the SiteSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-select',
  templateUrl: 'site-select.html',
})
export class SiteSelectPage {
  siteform:any={};
  site_List:any=[];
  filter:any={};
  loading:Loading;
  alertMsg:any={};


  qr_code:any='';

  id:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public viewCtrl: ViewController,public toastCtrl:ToastController,public dbService:DbserviceProvider,
    private barcodeScanner: BarcodeScanner,
    public loadingCtrl:LoadingController,
    public alertCtrl:AlertController,

    ) {
    console.log(this.dbService.userStorageData);
    this.id=this.dbService.userStorageData.id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteSelectPage');
    this.siteList();

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
  siteList(){

    this.dbService.show_loading();

    this.dbService.onPostRequestDataFromApi({'id':this.id},'app_master/siteDetailList',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
      this.dbService.dismiss_loading();
      this.site_List=res['site_locations'];
    },err=>{
      this.dbService.dismiss_loading();
    })


  }
  
  presentLoading(text)
  {
      this.loading = this.loadingCtrl.create({
          content: text,
          dismissOnPageChange: true
      });
      this.loading.present();
  }

  showAlert(text)
  {
      let alert = this.alertCtrl.create({
          title:'Alert!',
          cssClass:'action-close',
          subTitle: text,
          buttons: ['OK']
      });
      alert.present();
  }

  showSuccess(text)
  {
      let alert = this.alertCtrl.create({
          title:'Success!',
          cssClass:'action-close',
          subTitle: text,
          buttons: [
            
            {
              text: 'Scan More...',
              handler: () => {
                console.log("Scan Clicked");
                this.scan();
              }
            },
            {
              cssClass: 'cs-cancel',
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
      });
      alert.present();
  }
  scan() {
    // if( this.karigar_detail.manual_permission==1)
    // {
    //     console.log('1');
        
    //     this.navCtrl.push(CoupanCodePage)
    // }
    // else
    // {
        console.log('0');
        
        this.barcodeScanner.scan().then(resp => {
            console.log(resp);
            this.qr_code=resp.text;
            this.presentLoading('QR code scanning is processing. Please wait...');
            if(resp.text != '')
            {
                this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'qr_code':this.qr_code , 'site_id':this.siteform.Site},'app_master/qrCodeScan', this.dbService.rootUrl)
                .subscribe((r:any)=>
                {
                    console.log(r);
                    
                    if(r['status'] == 'INVALID'){
                        this.loading.dismiss();
                        this.showAlert("Invalid Coupon Code");
                        return;
                    }
                    else if(r['status'] == 'USED'){
                        
                        this.loading.dismiss();
                        this.alertMsg.scan_date=r.scan_date;
                        this.alertMsg.karigar_data=r.karigar_data;
                        this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
                        this.showAlert("Coupon Already Used By "+this.alertMsg.karigar_data.first_name+" ( "+this.alertMsg.karigar_data.mobile_no+" ) on " + this.alertMsg.scan_date );
                        return;
                    }
                    else if(r['status'] == 'UNASSIGNED OFFER'){
                        this.loading.dismiss();
                        this.showAlert("This Coupon Code is not applicable in your Area");
                        return;
                    }
                    else if(r['status'] == 'ERROR'){
                      this.loading.dismiss();
                      this.showAlert("This Contractor is not Linked With any Dealer!");
                      return;
                  }
                    this.loading.dismiss();
                    this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
                    // this.getData();
                });
            }
            else{
                this.loading.dismiss();
            }
        });
    // }
    
    
}


}
