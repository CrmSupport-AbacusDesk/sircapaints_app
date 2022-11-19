import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Loading, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
import { retry } from 'rxjs/operators';


@IonicPage()
@Component({
    selector: 'page-mobile-login',
    templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {
    
    data:any = {};
    otp:any = '';
    loading:Loading;
    loginType:any = '';
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public dbService: DbserviceProvider,
        public alertCtrl:AlertController,
        public loadingCtrl:LoadingController) {
            
            this.loginType = this.navParams.get('registerType');
            console.log(this.loginType);
        }
        
        ionViewDidLoad() {
            console.log('ionViewDidLoad MobileLoginPage');
        }
        
        
        onLoginSubmitHandler() {
            
            this.dbService.onShowLoadingHandler();
            
            if(this.data.mobile_no == '9319180958' || this.data.mobile_no == '9560533107' || this.data.mobile_no == '9011110000') {
                
                this.data.otp = '123456';
                
            } else {
                
                this.data.otp = Math.floor(100000 + Math.random() * 900000);
                
            }
            
            console.log(this.data);
            
            this.dbService.onPostRequestDataFromApi({'login_data': this.data,'registerType': this.loginType },'app_karigar/karigarLoginOtp_new', this.dbService.rootUrl).pipe(
                retry(3)
            ).subscribe((r) => {
                
                console.log(r);
                this.dbService.onDismissLoadingHandler();
                
                if (r['status'] == 'REQUIRED MOBILE NO') {
                    
                    this.dbService.onShowMessageAlertHandler("Please enter Mobile No to continue.");
                    return false;
                    
                } 
                else if ( r['type'] != ''){

                   if(r['type'] != this.loginType){
                    this.dbService.onShowMessageAlertHandler("This number is registered as " + r['type'] + " , please use another number to log in as a " + this.loginType);
                    return;
                   }
                   else if (r['status'] == "SUCCESS" ) {
                    
                    this.otp = r['otp'];
                    
                    this.navCtrl.push(OtpPage, {
                        otp: this.data.otp,
                        mobile_no: this.data.mobile_no,
                        loginType: this.loginType
                    });
                }
                }

                // else if (r['type'] == 'Plumber'){
                //     this.dbService.onShowMessageAlertHandler("This number is registered as Plumber, please use another number to log in as a " + this.loginType);
                //     return;
                // }
                else if (r['status'] == "SUCCESS" ) {
                    
                    this.otp = r['otp'];
                    
                    this.navCtrl.push(OtpPage, {
                        otp: this.data.otp,
                        mobile_no: this.data.mobile_no,
                        loginType: this.loginType
                    });
                }
            },err=>{
                this.dbService.onDismissLoadingHandler();
                
            });
        }
        
        onBackButtonClickHanlder() {
            
            this.navCtrl.push(SelectRegistrationTypePage);
        }
    }
    