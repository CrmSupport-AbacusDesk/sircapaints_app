import { Component } from '@angular/core';
import { IonicPage,  NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the EmailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-modal',
  templateUrl: 'email-modal.html',
})
export class EmailModalPage {
  data:any={};
  quotation_id:any='';
  user_id:any='';
  
  show_email_error:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public viewCtrl: ViewController,public toastCtrl:ToastController,public dbService:DbserviceProvider) {
    console.log(this.navParams);
    this.quotation_id=this.navParams.data.quotation_id;
    this.user_id=this.navParams.data.user_id;
    this.data.email=this.navParams.data.email_id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailModalPage');
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  submit(){
    console.log("submit api called");
    
    
  }
  sendEmail(){
    console.log("send email api called");
    // console.log(this.form.dealer.id);
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({'quotation_id':this.quotation_id , 'user_id': this.user_id , 'data':this.data},'dealerData/sendPdf_in_mail' ,this.dbService.rootUrlSfa).subscribe((resp)=>{
      console.log(resp);
      if(resp['msg']=="mail sent successfully"){
        this.dbService.onDismissLoadingHandler();

      this.viewCtrl.dismiss();
        let toast= this.toastCtrl.create({
          message:'Quotation Send To This Mail Id..',
          duration:3000
        });
        toast.present();
       

      }
      else if(resp['msg']=="There is some problem"){
        this.dbService.onDismissLoadingHandler();
        this.viewCtrl.dismiss();
        let toast= this.toastCtrl.create({
          message:'Something Went Wrong...',
          duration:3000
        });
        toast.present();
        setTimeout(() => {
          this.dbService.onDismissLoadingHandler();
        }, 1000);
      }
      else if(resp['msg']=="Email not found"){
        this.dbService.onDismissLoadingHandler();

        this.viewCtrl.dismiss();

        let toast= this.toastCtrl.create({
          message:'Oops Email not found !! Please Fill Right Data...',
          duration:3000
        });
        toast.present();
        
      }

      // setTimeout(() => {
      //   this.dbService.onDismissLoadingHandler();
      // }, 1000);
      
    })
    
  }
  
  checkEmail(){
    if(this.data.email==''){
      console.log("hello world");
      
      let toast=this.toastCtrl.create({
        message:'Please Fill Email..',
        duration:3000,

      });
      toast.present();
      return false;
    }

    // if(this.data.email!='/[a-zA-Z0-9._+$-]+@[0-9a-zA-Z]+.[a-zA-Z]{2,3}$/'){
    //   let toast=this.toastCtrl.create({
    //     message:'Format Of Email Is Wrong ..',
    //     duration:3000,

    //   });
    //   toast.present();
    //   return;
    // }
  }
  testEmail(data){
    console.log(data);
    let regex=/(^[a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,3}$)/;
      if(regex.test(data)){
         console.log('ok');   
        this.show_email_error=false;

      }else{
        this.show_email_error=true
        
      }
  }
}
