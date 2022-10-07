import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { AddQuotationPage } from '../add-quotation/add-quotation';
import { QuotationDetailPage } from '../quotation-detail/quotation-detail';

/**
 * Generated class for the QuotationDistributorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quotation-distributor',
  templateUrl: 'quotation-distributor.html',
})
export class QuotationDistributorPage {
  quotation_data:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider , public alertCtrl:AlertController) {

  }

  ionViewWillEnter(){
    this.getQuotationList();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationDistributorPage');
    console.log(this.dbService.userStorageData.type);
    this.getQuotationList();

  }

  addQuotations(){
    this.navCtrl.push(AddQuotationPage);
  }

  gotoQuotationDetailPage(id,status){
    console.log(id+status);
    
    this.navCtrl.push(QuotationDetailPage , {'quotation_id':id,'status':status});
  }

  doRefresh(refresher){
    this.getQuotationList();
    refresher.complete();
  }

  delete_quotation(id){
    console.log(id);
    let alert = this.alertCtrl.create({
      title:'Are You Sure ?',
      subTitle:'You want to delete this Quotation ?',
      cssClass:'action-close',
      buttons:[{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      },{
        text:'Confirm',
        cssClass: 'close-action-sheet',
        handler:()=>
        {
          
          this.dbService.onPostRequestDataFromApi({'quotation_id':id},'dealerData/delete_quotaion',this.dbService.rootUrlSfa).subscribe((resp)=>{
            console.log(resp);
              if(resp['msg']=='data deleted successfully'){
                this.getQuotationList();
              }
           
          })

        }
      }]
    });
    alert.present();
  }
    getQuotationList(){
      console.log("Quotation gets called");
      this.dbService.onShowLoadingHandler();
        this.dbService.onPostRequestDataFromApi({},'dealerData/getQuotationList',this.dbService.rootUrlSfa).subscribe((res)=>{
          console.log(res);
          this.quotation_data=res['QuotationList'];
          setTimeout(() => {
            this.dbService.onDismissLoadingHandler();
          }, 1000);
        })
    }

}
