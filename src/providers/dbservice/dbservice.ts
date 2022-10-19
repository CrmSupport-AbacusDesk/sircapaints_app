import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DbserviceProvider {

  loading:Loading;

  public rootUrl: string =  'https://devcrm.abacusdesk.com/sircapaints/dd_api/'
  public rootUrlSfa: string =  'https://devcrm.abacusdesk.com/sircapaints/crm/api/index.php/app/'
  public server_url: string = this.rootUrl + 'index.php/app/';
  public upload_url: string = this.rootUrl;
  public upload_url1: string = 'https://devcrm.abacusdesk.com/sircapaints/crm/api/index.php/uploads/';
  public upload_url2: string = 'https://devcrm.abacusdesk.com/sircapaints/uploads/order-invoice/';
  public upload_url3: string = 'https://devcrm.abacusdesk.com/sircapaints/dd_api/app/uploads/';
  public stock_pdf_url: string = 'https://devcrm.abacusdesk.com/sircapaints/crm/api/uploads/';
  public uploadURL: string = 'https://devcrm.abacusdesk.com/sircapaints/dd_api/app/uploads/images/';


  userStorageData: any;

  connection: any;

  public networkType = '';
  connectionChk: any;
  public backButton = 0;

  public deviceId:any
  public tabSelectedOrder:any;

  constructor(public http: HttpClient,
    public alertCtrl:AlertController,
    public loadingCtrl:LoadingController,
    public toastCtrl: ToastController,
    public http1:HttpClient,
    public storage: Storage,
    private sqlite: SQLite) {

      console.log('Hello DbserviceProvider Provider');
    }

    onPostRequestDataFromApi(requestData: any, fn: any, serverURL:any):any {

      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      console.log(serverURL);

      console.log(this.userStorageData);

      if(this.userStorageData && this.userStorageData.token) {
        headers = headers.set('Authorization', 'Bearer ' + this.userStorageData.token);
        headers = headers.set('Token', 'Bearer ' + this.userStorageData.token);
      }

      return this.http.post(serverURL + fn, JSON.stringify(requestData), {headers: headers});
    }


    onGetRequestDataFromApi(fn:any, serverURL:any):any {

      let headers = new HttpHeaders().set('Content-Type', 'application/json');

      console.log(this.userStorageData);

      if(this.userStorageData && this.userStorageData.token) {
        headers = headers.set('Authorization', 'Bearer ' + this.userStorageData.token);
        headers = headers.set('Token', 'Bearer ' + this.userStorageData.token);
      }
      console.log(serverURL);

      return this.http.get (serverURL + fn, {headers: headers});
    }

    fileData(request_data:any,fn:any):any{

      let headers = new HttpHeaders();

      // headers.append('Content-Type', undefined);
      headers = headers.set('Authorization', 'Bearer ' + this.userStorageData.token);
      headers = headers.set('Token', 'Bearer ' + this.userStorageData.token);
      return this.http.post(this.rootUrlSfa + fn, request_data , {headers:headers})
    }



    onMobileValidateHandler(event: any) {

      const pattern = /[0-9]/;

      let inputChar = String.fromCharCode(event.charCode);

      if (event.keyCode != 8 && !pattern.test(inputChar)) {

        event.preventDefault();
      }
    }  


    onShowMessageAlertHandler(messageText) {

      const alert = this.alertCtrl.create({
        title:'Message!',
        cssClass:'action-close',
        subTitle: messageText,
        buttons: ['OK']
      });

      alert.present();
    }


    onShowLoadingHandler() {

      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true
      });

      this.loading.present();
    }


    onDismissLoadingHandler()  {
      this.loading.dismiss();
    }

    public errToasr() {

      let toast = this.toastCtrl.create({
        message: 'Error Occured ,Please try Again!!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }

    public presentToast(msg) {

      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'bottom'
      });

      toast.present();
    }



    show_loading(){
      console.log("in show loading");
      if(!this.loading){
        this.loading = this.loadingCtrl.create({
          spinner: 'hide',
          // content: `<img src="./assets/imgs/tail-spin.svg"/>`,
          content: `<img src="./assets/imgs/gif.svg"/>`,
          // dismissOnPageChange: true
        });
        this.loading.present();
      }
    }

    dismiss_loading(){
      console.log("in dismiss");
      if(this.loading){
        this.loading.dismiss();
        this.loading = null;
      }
    }

  }
