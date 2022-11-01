import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,Nav, Events, ActionSheetController, AlertController, ModalController} from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViewProfilePage } from '../view-profile/view-profile';

import { PointLocationPage } from '../point-location/point-location';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { DomSanitizer  } from '@angular/platform-browser';
import { HomePage } from '../home/home';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';

import {App} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  
  @ViewChild(Nav) nav: Nav;
  karigar_detail:any={};
  loading:Loading;
  today_point:any='';
  last_point:any='';
  uploadURL:any;


  constructor(public navCtrl: NavController,
    public app:App,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController,
    public socialSharing:SocialSharing,
    public storage: Storage,
    public events: Events,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    public alertCtrl:AlertController,
    public modalCtrl: ModalController,
    public sanitizer: DomSanitizer) {
      
      this.uploadURL = this.dbService.upload_url3;


      if(this.dbService.connection=='offline')
      {
        this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
        this.navCtrl.setRoot(HomePage);
      }
    }
    
    photoURL(url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    
    logout()
    {
      let alert = this.alertCtrl.create({
        title: 'Logout!',
        message: 'Are you sure you want Logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Cancel clicked');
              // this.d.('Action Cancelled!')
            }
          },
          {
            text: 'Yes',
            handler: () => {
              
              this.storage.set('userStorageData', {});
              
              let alert2 = this.alertCtrl.create({
                title:'Success!',
                subTitle: 'Logout Successfully',
                buttons: [ {
                  text: 'Ok',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }]
              });
              alert2.present();
              this.app.getRootNav().setRoot(SelectRegistrationTypePage);
              
            }
          }
        ]
      })
      
      alert.present();
      
    }
    
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilePage');
      if(this.dbService.connection!='offline')
      {
        this.presentLoading();
      }
    }
    
    ionViewWillEnter()
    {
      if(this.dbService.connection!='offline')
      {
        this.getKarigarDetail();
      }
    }
    
    
    getKarigarDetail()
    {
      console.log('karigar');
      
      this.dbService.onPostRequestDataFromApi( {'karigar_id': this.dbService.userStorageData.id },'app_karigar/profile', this.dbService.rootUrl).subscribe(r =>
        {
          console.log(r);
          this.loading.dismiss();
          this.karigar_detail=r['karigar'];
          console.log(this.karigar_detail.profile);
          // this.karigar_detail.profile =  this.sanitizer.bypassSecurityTrustResourceUrl( this.dbService.upload_url+'app/uploads/'+this.karigar_detail.profile  );
          // this.karigar_detail.document_image =  this.sanitizer.bypassSecurityTrustResourceUrl( this.dbService.upload_url+'app/uploads/'+this.karigar_detail.document_image  );
          // console.log( this.karigar_detail.document_image);
          
          
          // this.karigar_detail.service_wallet_balance_points = parseInt(this.karigar_detail.service_wallet_balance_points)
          this.karigar_detail.totalpoints = parseInt(this.karigar_detail.balance_point)+ parseInt(this.karigar_detail.service_wallet_balance_points)
          this.last_point = r['last_point'];
          this.today_point = r['today_point'];
          
          
        });
      }
      
      pointLocation()
      {
        this.navCtrl.push(PointLocationPage,{'lat':this.karigar_detail.cust_lat,'log':this.karigar_detail.cust_long,'old_loc':this.karigar_detail.cust_geo_address});
      }
      openeditprofile()
      {
        let actionsheet = this.actionSheetController.create({
          title:"Profile photo",
          cssClass: 'cs-actionsheet',
          
          buttons:[{
            cssClass: 'sheet-m',
            text: 'Camera',
            icon:'camera',
            handler: () => {
              console.log("Camera Clicked");
              this.takePhoto();
            }
          },
          {
            cssClass: 'sheet-m1',
            text: 'Gallery',
            icon:'image',
            handler: () => {
              console.log("Gallery Clicked");
              this.getImage();
            }
          },
          {
            cssClass: 'cs-cancel',
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionsheet.present();
    }
    takePhoto()
    {
      console.log("i am in camera function");
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
      }
      
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
        this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile);
        }
      }, (err) => {
      });
    }
    getImage()
    {
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
      }
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
        this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.karigar_detail.profile);
        if(this.karigar_detail.profile)
        {
          this.uploadImage(this.karigar_detail.profile);
        }
      }, (err) => {
      });
    }
    uploadImage(profile)
    {
      console.log(profile);
      this.dbService.onPostRequestDataFromApi( {'karigar_id': this.dbService.userStorageData.id,'profile':profile },'app_karigar/updateProfilePic', this.dbService.rootUrl).subscribe(r =>
        {
          console.log(r);
          this.showSuccess("Profile Photo Updated")
        });
        
      }
      
      viewProfiePic()
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile}).present();
      }
      
      showSuccess(text)
      {
        let alert = this.alertCtrl.create({
          title:'Success!',
          subTitle: text,
          buttons: ['OK']
        });
        alert.present();
      }
      presentLoading()
      {
        this.loading = this.loadingCtrl.create({
          content: "Please wait...",
          dismissOnPageChange: true
        });
        this.loading.present();
      }
      
      
      ref_code:any="";
      ShareApp()
      {
        // alert('hello')
        console.log(this.karigar_detail);
        if(this.karigar_detail.type == "Plumber" && this.karigar_detail.referral_code!="")
        {
          this.ref_code = ' and use my Code *'+this.karigar_detail.referral_code+'* to get points back in your wallet'
        }
        this.socialSharing.share('Hey There ! here is an awesome app from Gravity Bath Pvt Ltd  ..Give it a try https://play.google.com/store/apps/details?id=com.gravitybath.app '+this.ref_code).then(() => {
        console.log("success");
      }).catch((e) => {
        console.log(e);
      });
    }
    
    editProfilePage()
    {
      this.navCtrl.push(EditProfilePage,{'detail':this.karigar_detail});
    }
  }
  