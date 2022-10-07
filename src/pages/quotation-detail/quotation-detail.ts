import { Component } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { AddQuotationPage } from '../add-quotation/add-quotation';
import { EmailModalPage } from '../email-modal/email-modal';
declare var DocumentViewer: any;

/**
 * Generated class for the QuotationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quotation-detail',
  templateUrl: 'quotation-detail.html',
})
export class QuotationDetailPage {
  form: any = {};
  add_list: any = [];
  quotationSummary: any = [];
  quotationDetails: any = [];
  quotation_id: any = '';
  app_user_id: any = '';
  app_user_name: any = '';
  active: any = {};
  check_qty_flag: boolean = true;
  order_data: any = {};
  loading: any;
  spcl_dis_amt: any = 0;
  type: any = '';
  pdfUrl:any;
  file: any;

  special_discount: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService: DbserviceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private transfer: FileTransfer,
    private modalCtrl:ModalController,
    ) {
      this.pdfUrl = this.dbService.stock_pdf_url+'quotaion/';
      console.log(this.pdfUrl);
      
    // this.quotationDetail();

  }

  ionViewWillEnter(){
    this.quotationDetail();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotationDetailPage');
    console.log(this.navParams);
    console.log(this.dbService.userStorageData);
    this.app_user_id = this.dbService.userStorageData.id;
    console.log(this.app_user_id);
    this.app_user_name = this.dbService.userStorageData.displayName;
    this.quotation_id = this.navParams['data'].quotation_id;
    console.log(this.quotation_id);
    // this.quotationDetail();
    

  }

  quotationDetail() {
    console.log("quotation Detail api Called");
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({ 'quotation_id': this.quotation_id }, 'dealerData/getQuotationDetail', this.dbService.rootUrlSfa).subscribe((resp) => {
      console.log(resp);
      if (resp) {
        this.form=resp['QuotationDetail']['details'];
        this.quotationSummary = resp['QuotationDetail']['QuotationSummary'];
        console.log(this.quotationDetails);
        console.log(this.quotationSummary);
        this.form.netBreakup=(parseInt(this.form.grand_total)/1.18);
        this.form.gstBreakup=(parseInt(this.form.grand_total))-(parseInt(this.form.netBreakup));
        this.form.gstBreakup.toFixed(); 

        this.dbService.onDismissLoadingHandler();

      }
      this.quotationSummary.map((items) => {
        items.edit_true = true
        items.edit_true1 = true
      })
      setTimeout(() => {
        this.dbService.onDismissLoadingHandler();
      }, 1000);
    })
  }

  openPdfQuotation() {
    let toast = this.toastCtrl.create({
      message: 'Comming Soon.. Please Wait..',
      duration: 3000
    });
    toast.present();
  }

  edit_qty(index) {
    this.active[index] = Object.assign({ 'qty': '1' });
    console.log(this.active[index]);
    this.quotationSummary[index].edit_true = false;
  }
  edit_discount(index){
    this.active[index]=Object.assign({'discount':'1'});
    console.log(this.active[index]);
    this.quotationSummary[index].edit_true1 = false;
  }

  calculateAmount(qty, index, del, type, data: any) {
    var itemData = this.quotationSummary[index]
    let tmpQty = itemData['qty'];
    console.log(tmpQty);
    console.log(itemData);

    this.form.special_discount_amount = 0

    this.quotationSummary[index].subTotal = this.quotationSummary[index].price * this.quotationSummary[index].qty;
    console.log(this.quotationSummary[index].subTotal);

    this.quotationSummary[index].discount_amount = this.quotationSummary[index].price * this.quotationSummary[index].discount / 100;
    console.log(this.quotationSummary[index].discount_amount);

    this.quotationSummary[index].discounted_amount = this.quotationSummary[index].price - this.quotationSummary[index].discount_amount;
    console.log(this.quotationSummary[index].discounted_amount);

    // this.quotationSummary[index].gst_amount = this.quotationSummary[index].discounted_amount * this.quotationSummary[index].gst_percent / 100;
    this.quotationSummary[index].amount = parseFloat(this.quotationSummary[index].discounted_amount) * this.quotationSummary[index].qty;
    console.log(this.quotationSummary[index].amount);

    this.quotationSummary[index].subTotal = parseFloat(this.quotationSummary[index].subTotal);
    console.log(this.quotationSummary[index].subTotal);

    this.quotationSummary[index].discount_amount = parseFloat(this.quotationSummary[index].discount_amount);
    console.log(this.quotationSummary[index].discount_amount);

    this.quotationSummary[index].discounted_amount = parseFloat(this.quotationSummary[index].discounted_amount);
    console.log(this.quotationSummary[index].discounted_amount);

    // this.quotationSummary[index].gst_amount = parseFloat(this.quotationSummary[index].gst_amount);
    // console.log(this.quotationSummary[index].gst_amount);

    this.quotationSummary[index].amount = parseFloat(this.quotationSummary[index].amount);
    console.log(this.quotationSummary[index].amount);

    this.order_data.sub_total = 0;
    this.order_data.discount = 0;
    this.order_data.gst = 0;
    this.order_data.order_total = 0;
    // this.order_data.special_discount_amount =0
    console.log(this.form);
    this.form.total_quantity = 0;
    for (var i = 0; i < this.quotationSummary.length; i++) {
      this.order_data.sub_total += parseFloat(this.quotationSummary[i]['subTotal']);
      this.order_data.order_total += parseFloat(this.quotationSummary[i]['subtotal_discounted']);
      this.order_data.discount += parseFloat(this.quotationSummary[i].subTotal) - parseFloat(this.quotationSummary[i].subtotal_discounted);
      this.order_data.subtotal_discounted = this.quotationSummary[i].subtotal_discounted
      // this.order_data.gst += parseFloat(this.quotationSummary[i]['gst_amount']);
      this.quotationSummary.qty += parseFloat(this.quotationSummary[i]['qty']);

      // console.log(this.order_data);


      console.log(this.quotationSummary[i].qty);
      if (this.quotationSummary[i].qty == null || this.quotationSummary[i].qty == '0') {
        let alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'You Cannot Make Qty Zero or Blank..',
          buttons: ['dismiss']
        });
        alert.present();
        return setTimeout(() => {
          this.quotationDetail()
        }, 1000);;
      }

      this.form.total_quantity = parseFloat(this.form.total_quantity) + parseFloat(this.quotationSummary[i].qty);
      this.form.sub_total = this.order_data.subTotal;
      this.form.order_total = this.order_data.order_total;
      this.form.order_discount = this.order_data.discount;
      this.form.order_gst = this.order_data.gst;
    }
    // this.order_data.special_discount_amount = (this.order_data.order_total * parseFloat(this.form.special_discount_percentage) )/100
    // this.form.special_discount_amount = this.order_data.special_discount_amount;
    if (this.form.DiscType == 'Discount') {
      this.order_data.order_grand_total = this.order_data.order_total - this.order_data.special_discount_amount
    }
    else {
      this.order_data.order_grand_total = this.order_data.order_total + this.order_data.special_discount_amount

    }
    console.log(this.order_data);

    this.form.sub_total = this.order_data.sub_total;
    this.form.dis_amt = this.order_data.discount;
    // this.form.grand_total=parseFloat(this.form.grand_total)+parseFloat(this.order_data.subtotal_discounted);
    this.form.net_total = parseFloat(this.form.net_total) + parseFloat(this.order_data.subtotal_discounted);
    this.spcl_dis_amt = parseFloat(this.form.net_total) * parseFloat(this.special_discount) / 100
    if (this.type == 'Discount') {
      this.form.grand_total = Math.round(this.form.net_total - this.spcl_dis_amt);
    } else {
      this.form.grand_total = Math.round(this.form.net_total + this.spcl_dis_amt);
    }

    // this.form.order_grand_totalAfterRoundOff = Math.round(this.form.order_grand_total)
    // this.form.netBreakup = (parseFloat(this.form.order_grand_total)/1.18)
    // this.form.gstBreakup = parseFloat(this.form.order_grand_total)-parseFloat(this.form.netBreakup)

    // if(del==true)
    // {

    //     this.update_order(data.index,data.order_id,data.order_item_id,true)
    // }



    this.check_qty(index);
  }

  calculateAmountq(qty,index,type) {
    console.log(qty);
    // console.log(discount);
    console.log(index);
    console.log(this.quotationSummary[index].qty);
    console.log(this.quotationSummary[index].cartoon_packing);
    console.log(this.quotationSummary[index].cartoon_qty);
    
    if(type=='cartoon_qty'){
      this.quotationSummary[index].qty=parseFloat(this.quotationSummary[index].cartoon_packing)*parseFloat(this.quotationSummary[index].cartoon_qty);
    }
    console.log(this.quotationSummary[index]);
    this.quotationSummary[index].discount_amount=0;
    this.quotationSummary[index].subTotal=0;
    this.quotationSummary[index].discountedAmount= 0;
    console.log(this.quotationSummary[index]);

    if(this.quotationSummary[index].qty==null){
      this.quotationSummary[index].qty = 0;
    }
    this.quotationSummary[index].subTotal = parseFloat(this.quotationSummary[index].price)*parseFloat(this.quotationSummary[index].qty);
    console.log(this.quotationSummary[index].subTotal);

    if(this.quotationSummary[index].discount)
    {
        this.quotationSummary[index].discount_amount = (parseFloat(this.quotationSummary[index].price) * parseFloat(this.quotationSummary[index].discount))/100;
    }
    this.quotationSummary[index].discountedAmount = parseFloat(this.quotationSummary[index].price) - parseFloat(this.quotationSummary[index].discount_amount)
    console.log(this.quotationSummary[index].discountedAmount);

    this.quotationSummary[index].subtotal_discount = parseFloat(this.quotationSummary[index].discount_amount) * parseFloat(this.quotationSummary[index].qty);
    console.log(this.quotationSummary[index].subtotal_discount);

    this.quotationSummary[index].subtotal_discounted = parseFloat(this.quotationSummary[index].discountedAmount) * parseFloat(this.quotationSummary[index].qty);
    console.log(this.quotationSummary[index].subtotal_discounted);

    this.quotationSummary[index].subtotal_discounted  = this.quotationSummary[index].subtotal_discounted.toFixed(2);
    console.log(this.quotationSummary[index].subtotal_discounted);

    console.log(this.quotationSummary[index]);
    
    console.log(this.type);

    console.log(this.form);
      this.form.total_quantity=0;
      this.form.grand_total=0;
      this.form.net_total=0;
      this.form.sub_total=0;
      this.order_data.discount=0;
      // this.form.dis_amt=0;
    for(let i=0; i<this.quotationSummary.length; i++){
      if (this.quotationSummary[i].qty == null || this.quotationSummary[i].qty == '0') {
        let alert = this.alertCtrl.create({
          title: 'Alert',
          subTitle: 'You Cannot Make Qty Zero or Blank..',
          buttons: ['dismiss']
        });
        alert.present();
        this.active[index]=Object.assign({'qty':'2'});
       setTimeout(() => {
          this.quotationDetail();
          this.dbService.onDismissLoadingHandler();
        }, 2000);;
      }
      // if (this.quotationSummary[i].discount > '100') {
      //   console.log(this.quotationSummary[i].discount);
        
      //   let alert = this.alertCtrl.create({
      //     title: 'Alert',
      //     subTitle: 'You Cannot Make Discount Greater Than 100...',
      //     buttons: ['dismiss']
      //   });
      //   alert.present();
      //   this.active[index]=Object.assign({'qty':'2'});
      //  setTimeout(() => {
      //     this.quotationDetail();
      //     this.dbService.onDismissLoadingHandler();
      //   }, 2000);;
      // }
      if(this.quotationSummary[i].discount == null ){
        this.quotationSummary[i].discount=0;
       
      }
      if(this.quotationSummary[i].discount > 100){

      }
      this.form.sub_total = parseFloat(this.form.sub_total) + parseFloat(this.quotationSummary[i].subTotal);
      this.order_data.discount += parseFloat(this.quotationSummary[i].subTotal) - parseFloat(this.quotationSummary[i].subtotal_discounted);

      // this.form.dis_amt = parseFloat(this.quotationSummary[i].subTotal) - parseFloat(this.quotationSummary[i].subtotal_discounted);
      console.log(this.form.dis_amt);

      this.form.net_total = parseFloat(this.form.net_total) + parseFloat(this.quotationSummary[i].subtotal_discounted);
      console.log(this.form.net_total);
      console.log(this.quotationSummary[i].subtotal_discount);
      
      console.log(this.special_discount);

      this.spcl_dis_amt = (this.form.net_total * this.special_discount)/100;
      console.log(this.spcl_dis_amt);

      if(this.type=='Discount')
      {
          this.form.grand_total = Math.round(this.form.net_total - this.spcl_dis_amt);
      }else
      {
          this.form.grand_total = Math.round(this.form.net_total + this.spcl_dis_amt);
      }
      this.form.total_quantity=parseFloat(this.form.total_quantity)+parseFloat(this.quotationSummary[i].qty);
      console.log(this.form.sub_total);
      this.form.dis_amt=this.order_data.discount;
      console.log(this.form.dis_amt);
      console.log(this.form.grand_total);
      console.log(this.form.net_total - this.spcl_dis_amt);
    }
    this.check_qty(index);
    this.check_discount(index);
  }

  check_discount(index) {
    if (this.quotationSummary[index].discount > 100) {
      this.active[index] = Object.assign({ 'discount': '2' });
      console.log(this.active[index]);

      let alert1 = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Discount Cannot Be Greater Than 100..',
        buttons: ['dismiss'],
      });
      alert1.present();
      setTimeout(() => {
        this.quotationDetail();
        this.dbService.onDismissLoadingHandler();

      }, 3000);
    }
  }
  check_qty(index) {
    if (this.form.total_quantity < 1 || this.form.sub_total < 1 || this.form.grand_total < 1 || this.form.net_total < 1) {
      this.active[index] = Object.assign({ 'qty': '2' });
      console.log(this.active[index]);

      let alert1 = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Values cannot be zero or negative',
        buttons: ['dismiss'],
      });
      alert1.present();
      setTimeout(() => {
        this.quotationDetail();
        this.dbService.onDismissLoadingHandler();

      }, 2000);
    }
  }

  lodingPersent() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    this.loading.present();
  }

  update_Quotation(index, qty, id,discount, del) {

    console.log(qty);
    console.log(index);
    console.log(id);
    var orderData = {
      'sub_total': this.form.sub_total,
      'dis_amt': this.form.dis_amt,
      'grand_total': this.form.grand_total,
      'net_total': this.form.net_total,
      'totalQty': this.form.total_quantity,

    };
    this.lodingPersent();
    this.dbService.onPostRequestDataFromApi({ 'qty': qty, 'discount':discount, 'quotation_item_id': id, 'quotation_id': this.quotation_id, 'orderData': orderData, 'cart_data': this.quotationSummary[index], 'user_data': this.form, 'login_name': this.app_user_name, 'login_id': this.app_user_id }, 'dealerData/EditQuantity', this.dbService.rootUrlSfa).subscribe((resp) => {
      console.log(resp);
      if (resp['message'] == 'Quotation updated sucessfully') {
        let alert = this.alertCtrl.create({
          title: 'Success',
          subTitle: 'Successfully Updated !',
          buttons: ['Okay']
        });
        alert.present();
        this.quotationDetail();
      }
      setTimeout(() => {
        this.loading.dismiss();
      }, 1000);
    });
    this.active = {};
    this.quotationSummary[index].edit_true = true;
    this.quotationSummary[index].edit_true1 = true;
  }

  more_item() {
    this.navCtrl.push(AddQuotationPage, { 'quotation_summary': this.quotationSummary, 'quotation_details': this.form, 'from': 'quotation_details' });
  }


  sendEmail(){
    console.log("send email api called");
    console.log(this.form.dealer.id);
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({'quotation_id':this.quotation_id ,'dr_id':this.form.dealer.id, 'user_id': this.app_user_id},'dealerData/sendPdf_in_mail' ,this.dbService.rootUrlSfa).subscribe((resp)=>{
      console.log(resp);
      if(resp['msg']=="mail sent successfully"){
        let toast= this.toastCtrl.create({
          message:'Quotation Send To Dealers Mail..',
          duration:3000
        });
        toast.present();
      }
      else if(resp['msg']=="There is some problem"){
        let toast= this.toastCtrl.create({
          message:'Something Went Wrong...',
          duration:3000
        });
        toast.present();
      }
      else if(resp['msg']=="Email not found"){
        let toast= this.toastCtrl.create({
          message:'Email not found...',
          duration:3000
        });
        toast.present();
      }

      setTimeout(() => {
        this.dbService.onDismissLoadingHandler();
      }, 1000);
      
    })
    
  }

  downloadQuotation(){
    
    console.log(this.quotation_id);
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
      dismissOnPageChange: true
  });
  
  this.loading.present();
  
  this.dbService.onPostRequestDataFromApi({'quotation_id':this.quotation_id ,'dr_id':this.form.dealer.id, 'user_id': this.app_user_id},"dealerData/quotation_pdf", this.dbService.rootUrlSfa).subscribe((result)=>
  {
      console.log(result);
      
      setTimeout(() => {
          this.loading.dismiss();
      }, 1000);
      
      
      if(result['status'] == 'Success')
      {
          console.log(this.pdfUrl);
          
          var pdfName = this.quotation_id +'.pdf';
          
          const fileTransfer: FileTransferObject = this.transfer.create();
          
          var url = this.pdfUrl + this.quotation_id +'.pdf';
          
          console.log(url);
          
         
          
          DocumentViewer.previewFileFromUrlOrPath(
              function () {
                  console.log('success');
              }, function (error) {
                  if (error == 53) {
                      console.log('No app that handles this file type.');
                  }else if (error == 2){
                      console.log('Invalid link');
                  }
              },
              url, 'PDF', 'application/pdf');
                fileTransfer.download(url, this.file.externalRootDirectory + '/Download/' + pdfName).then((entry) => {
                            console.log('download complete: ' + entry.toURL());
                        });
              
          }
          
      });

  }


  openEmailModal(data){
    console.log(data);
    // { cssClass: "my-modal"}
    let workTypeModal =  this.modalCtrl.create(EmailModalPage,{'quotation_id':this.quotation_id ,'dr_id':this.form.dealer.id, 'user_id': this.app_user_id ,'email_id':data});

        workTypeModal.onDidDismiss(data =>{
          this.dbService.onDismissLoadingHandler();
          
              this.quotationDetail();
            console.log(data);
          

        });

        workTypeModal.present();
  }

}
