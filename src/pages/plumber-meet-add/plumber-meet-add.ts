import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController , AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { IonicSelectableComponent } from 'ionic-selectable';


/**
* Generated class for the PlumberMeetAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-plumber-meet-add',
  templateUrl: 'plumber-meet-add.html',
})
export class PlumberMeetAddPage {

  @ViewChild('dealerSelectable') dealerSelectable: IonicSelectableComponent;

  meet_data: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  max_date = new Date().getFullYear() + 1;
  assing_dealer_data: any = [];
  temp_dealer_data:any={}
  user_data:any={};
  working_segment_list:any = [];

  gravity_branding_showroom:any = [
    'Front Sign board' , 'Display Panels' , 'In Shop Branding' , 'All Of The Above' , 'None Of The above'
  ];

  image_data: any = [];
  image: any = '';

  constructor(public navCtrl: NavController,private toastCtrl: ToastController, public navParams: NavParams, public actionSheetController: ActionSheetController ,public dbService: DbserviceProvider,private alertCtrl: AlertController , private camera: Camera) {

    this.get_working_segment();
this.get_fitting()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlumberMeetAddPage');
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter method calls");
    this.user_data = this.dbService.userStorageData;
    console.log(this.user_data);
    this.user_data.loginType =='SFA' ? this.get_dealers():'';
  }

  get_dealers() {

    this.dbService.show_loading();
    console.log("get_dealers method calls");
    this.dbService.onPostRequestDataFromApi({},'PlumberMeet/get_all_assign_dealers_to_user', this.dbService.rootUrlSfa).subscribe((response) => {
      this.dbService.dismiss_loading();
      console.log(response);
      if(response['assigned_dealers_list'].length == 0){
        let alert=this.alertCtrl.create({
          title:'',
          subTitle: 'You Have No Assign Dealer/Channel Partner',
          cssClass:'action-close',

          buttons: [{
            text: 'Okay',
            role: 'Okay',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
        });
        alert.present();
        return;
      }
      else{
        this.assing_dealer_data = response['assigned_dealers_list'];

        for(let i=0;i<this.assing_dealer_data.length;i++){
          this.assing_dealer_data[i].company_name = this.assing_dealer_data[i].company_name + (this.assing_dealer_data[i].contact_person && this.assing_dealer_data[i].contact_person != '' ? ' -- '+ this.assing_dealer_data[i].contact_person : '')
        }

      }
    }, er => {
      this.dbService.dismiss_loading();

    });

  }

  get_selected_dealer_data(event){
    console.log(this.meet_data);
    console.log(this.meet_data.dealer_id);
    console.log(event);
    console.log(event.value.id);
    this.meet_data.dealer_id = event.value.id;
  }

  save_meet_data(){
    console.log("save_meet_data method calls");
    console.log(this.meet_data);


    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'meet_data' : this.meet_data,'add_meet_images':this.image_data}, 'PlumberMeet/add_plumber_meet',  this.dbService.rootUrlSfa).subscribe(response => {
      console.log(response);
      this.dbService.dismiss_loading();

      if(response['msg'] == 'success'){
        let toast1 = this.toastCtrl.create({
          message: 'Plumber Meet Created Successfully',
          duration: 3000,
          position: 'bottom'
        });
        toast1.present();
        this.navCtrl.pop();
      }
      else{
        this.dbService.errToasr()
      }

    },err=> {
      this.dbService.dismiss_loading();
      this.dbService.errToasr()

    });

  }
  get_working_segment() {

    this.dbService.show_loading();
    console.log("get_working_segment method calls");
    this.dbService.onPostRequestDataFromApi({},'PlumberMeet/working_segment_list', this.dbService.rootUrlSfa).subscribe((response) => {
      this.dbService.dismiss_loading();
      console.log(response['working_segment_list']);

      this.working_segment_list = response['working_segment_list'];

    }, er => {
      this.dbService.dismiss_loading();

    });

  }
  category_name:any=[]
  get_fitting() {

    this.dbService.show_loading();
    console.log("get_working_segment method calls");
    this.dbService.onPostRequestDataFromApi({},'PlumberMeet/category_name_for_cp_fitting', this.dbService.rootUrlSfa).subscribe((response) => {
      this.dbService.dismiss_loading();
      console.log(response['category_name']);

      this.category_name = response['category_name'];

    }, er => {
      this.dbService.dismiss_loading();

    });

  }

  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log("Camera Clicked");
          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    actionsheet.present();
  }

  takePhoto() {
    console.log("i am in camera function");
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection:1,
      correctOrientation : true,
    }

    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    },
    (err) => {
    });
  }

  getImage() {
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    console.log(options);

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;

      console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }

  fileChange(img) {
    this.image_data.push(img);
    console.log(this.image_data);
    this.image = '';
  }

  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }

}
