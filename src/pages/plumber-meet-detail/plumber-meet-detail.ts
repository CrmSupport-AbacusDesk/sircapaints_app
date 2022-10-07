import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { ExpensePopoverPage } from '../expense-module/expense-popover/expense-popover';
import { PlumberMeetGalleryPage } from '../plumber-meet-gallery/plumber-meet-gallery';
import moment from 'moment';
import { File } from '@ionic-native/file';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
* Generated class for the PlumberMeetDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-plumber-meet-detail',
  templateUrl: 'plumber-meet-detail.html',
})
export class PlumberMeetDetailPage {
  
  meet_id: any = '';
  meet_detail: any = {};
  temp_participant_data:any = {
    'plumber_meet_id' : this.meet_id,
  };
  saved_participant_data:any = [];
  show_error : boolean = false;
  image:any='';
  image_data:any=[];
  selected_video_file:any=[];
  go_to_where:any=''
  today_date = moment(new Date()).format('YYYY-MM-DD');
  fixed_length_array = new Array(3)
  i = 0;
  multiple_images:any=[];
  user_data:any={};

  
  
  
  constructor(public navCtrl: NavController,public modalCtrl:ModalController,public toastCtrl:ToastController,public popoverCtrl: PopoverController,private camera: Camera ,public actionSheetController: ActionSheetController, public navParams: NavParams,public dbService:DbserviceProvider,private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlumberMeetDetailPage');
  }
  
  ionViewWillEnter(){

    console.log("ionViewWillEnter method calls");
    this.user_data = this.dbService.userStorageData;
    console.log(this.user_data);

    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('meet id'));
    
    if(this.navParams.get('meet id') && (this.navParams.get('from') == 'plumber-meet-list page' || this.navParams.get('from') == 'plumber-meet-gallery') && this.navParams.get('meet id') != '0'){
      this.meet_id = this.navParams.get('meet id')
      this.temp_participant_data.plumber_meet_id = this.meet_id;
      this.get_meet_detail();
    }
    else{
      console.log("in else");
      console.log(this.navParams.get('meet id'));
    }
    
  }
  view_image(src){
    this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
  }
  get_meet_detail(){
    console.log("get_meet_detail method calls");
    
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'meet_id':this.meet_id},'PlumberMeet/plumber_meet_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result);
      this.meet_detail = result['plumber_meet_detail'];
      this.saved_participant_data = result['participents_list'];
      
      
    },err=>
    {
      this.dbService.dismiss_loading();
      console.log("error");
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Somethong Went Wrong Please Try Again',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            
          }
        }]
      });
      alert.present();
      this.navCtrl.pop();
    });
  }
  
  add_participants(){
    console.log("add_participants method calls");
    console.log('participent data = ');
    console.log(this.temp_participant_data);
    
    this.dbService.show_loading();
    
    this.dbService.onPostRequestDataFromApi({'participent_data':this.temp_participant_data},'PlumberMeet/add_participents_of_plumber_meet', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result);
      if(result['msg'] == 'Participant Data Updated Successfully'){
        
        let alert = this.alertCtrl.create({
          title: 'Success',
          subTitle: result['msg'],
          cssClass: 'action-close',
          
          buttons: [{
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.temp_participant_data.participent_name = '';
              this.temp_participant_data.participent_mobile = '';
              this.show_error = false;
              this.get_meet_detail();
            }
          }]
        });
        alert.present();
        
      }
      
      else if(result['msg'] == 'Already Exist Mobile No.'){
        
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: result['msg'],
          cssClass: 'action-close',
          
          buttons: [{
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              
            }
          }]
        });
        alert.present();
        
      }
      
      else{
        let alert=this.alertCtrl.create({
          title:'Error !',
          subTitle: 'Participant Data Not Updated, Please Try Again',
          cssClass:'action-close',
          
          buttons: [{
            text: 'Okay',
            role: 'Okay',
            handler: () => {
              
            }
          },]
        });
        alert.present();
      }
      
    },err=>
    {
      this.dbService.dismiss_loading();
      console.log("error");
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Somethong Went Wrong Please Try Again',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            
          }
        },]
      });
      alert.present();
    });
    
    
  }
  
  delete_participent(participent_id){
    console.log('delete_participent method calls');
    console.log('participent_id = '+participent_id);
    
    let alert = this.alertCtrl.create({
      title: 'Confirmation !',
      message: 'Are you sure you want to delete this Participant Data ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.dbService.show_loading();
            this.dbService.onPostRequestDataFromApi({'participent_id':participent_id},"PlumberMeet/plumber_meet_participent_remove", this.dbService.rootUrlSfa).subscribe(resp=>{
              console.log(resp);
              if(resp['msg'] == 'Deleted Successfully'){
                this.dbService.presentToast('Participant Data Deleted Sucessfully')
                this.dbService.dismiss_loading();
                this.get_meet_detail();
                
              }
              else{
                this.dbService.errToasr();
                this.dbService.dismiss_loading();
                this.get_meet_detail();
              }
            },err=>
            {
              this.dbService.dismiss_loading();
              this.get_meet_detail();
              
            })
          }
        }
      ]
    })
    alert.present();
    
    
    
  }
  
  captureImageVideo()
  {
    let actionsheet = this.actionSheetController.create({
      title:"Upload Image",
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
        icon:'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
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
      this.image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.image);
      if(this.image)
      {
        this.fileChange(this.image);
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
      this.image= 'data:image/jpeg;base64,' + imageData;
      
      console.log(this.image);
      if(this.image)
      {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }
  
  fileChange(img)
  {
    this.image_data=[];
    this.image_data.push(img);
    console.log(this.image_data);
    
    const formData = new FormData();
    this.dbService.show_loading();
    for(let i=0;i<this.image_data.length;i++){
      formData.append("image_file",this.image_data);
      formData.append("plumber_meet_id",this.meet_id);
      console.log(formData);
      this.dbService.fileData(formData,'PlumberMeet/upload_meet_file').subscribe((result)=>{
        console.log(result);
        this.dbService.dismiss_loading();
        console.log(result);
        if(result == 'success'){
          formData.delete('image_file')
          
          let alert = this.alertCtrl.create({
            title: 'Success?',
            subTitle: 'Image Upload Successfully',
            cssClass: 'action-close',
            
            buttons: [{
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.get_meet_detail();
              }
            }]
          });
          alert.present();
          
        }
        else{
          let alert=this.alertCtrl.create({
            title:'Error !',
            subTitle: 'Somethong Went Wrong Please Try Again',
            cssClass:'action-close',
            
            buttons: [{
              text: 'Okay',
              role: 'Okay',
              handler: () => {
                
              }
            },]
          });
          alert.present();
        }
        
      })
    }
    
  }
  
  upload_video(event) {
    console.log(event.target.files);
    for (var i = 0; i < event.target.files.length; i++) {
      this.selected_video_file.push(event.target.files[i]);
      // let reader = new FileReader();
      // reader.onload = (e: any) => {
      //     this.urls.push(e.target.result);
      //     console.log(e.target.result);
      // }
      // reader.readAsDataURL(event.target.files[i]);
    }
    console.log(this.selected_video_file);
    
    for(i=0;i<this.selected_video_file.length;i++) {
      
      if(this.selected_video_file[i].size > (2500000 *10)) {
        
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Video Size Must be less than 25 MB',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                
                console.log('ok clicked');
                this.selected_video_file = [];
                
              }
            }
          ]
        });
        
        alert.present();
        
        return false;
      }
    } 
    
    const  formData = new FormData();
    this.dbService.show_loading();
    for(i=0;i<this.selected_video_file.length;i++){
      formData.append("video_file",this.selected_video_file[i],this.selected_video_file[i]['name']);
      formData.append("plumber_meet_id",this.meet_id);
      console.log(formData);
      this.dbService.fileData(formData,'PlumberMeet/upload_meet_file').subscribe((result)=>{
        this.dbService.dismiss_loading();
        console.log(result);
        if(result == 'success'){
          formData.delete('video_file')
          
          let alert = this.alertCtrl.create({
            title: 'Success?',
            subTitle: 'Video Upload Successfully',
            cssClass: 'action-close',
            
            buttons: [{
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.get_meet_detail();
              }
            }]
          });
          alert.present();
          
        }
        else{
          let alert=this.alertCtrl.create({
            title:'Error !',
            subTitle: 'Somethong Went Wrong Please Try Again',
            cssClass:'action-close',
            
            buttons: [{
              text: 'Okay',
              role: 'Okay',
              handler: () => {
                
              }
            },]
          });
          alert.present();
        }
        
      })
    }
    this.selected_video_file = [];
    
  }
  
  presentPopover(myEvent,status) {
    
    let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Plumber Meet Detail'});
    popover.present({
      ev: myEvent,
      
    });
    
    popover.onDidDismiss(resultData => {
      console.log(resultData);
      resultData != null ?  this.go_to_where = resultData.TabStatus:'';
      
      if(this.go_to_where == 'Gallery'){
        this.navCtrl.pop({animate:false});
        this.navCtrl.push(PlumberMeetGalleryPage,{'plumber_meet_id':this.meet_id , 'from':'plumber-meet-detail','status': status});
      }
      else if(this.go_to_where == 'Detail'){
        this.get_meet_detail();
      }
      else{
        let alert=this.alertCtrl.create({
          title:'Error !',
          subTitle: 'Somethong Went Wrong Please Try Again',
          cssClass:'action-close',
          
          buttons: [{
            text: 'Okay',
            role: 'Okay',
            handler: () => {
              
            }
          },]
        });
        alert.present();
      }
      
    })
    
  }
  
  add_expese_of_plumber_meet_prompt(){
    
    let alert = this.alertCtrl.create({
      title: 'Submit Expense',
      inputs: [
        {
          type: 'number',
          name: 'Expense',
          placeholder: 'Expense',
        },
        {
          type: 'text',
          name: 'Remark',
          placeholder: 'Remark',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: data => {
            
            console.log(data);
            if(data['Expense'] != '' && data['Remark'] != ''){
              
              this.dbService.show_loading();
              this.dbService.onPostRequestDataFromApi({'plumber_meet_id':this.meet_id,'expense':data['Expense'],'expense_remark':data['Remark']},"PlumberMeet/plumber_meet_status_change ", this.dbService.rootUrlSfa).subscribe(result=>{
                
                this.dbService.dismiss_loading();
                console.log(result);
                if(result == 'success'){                  
                  let alert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Plumber Meet Successully Completed',
                    cssClass: 'action-close',
                    
                    buttons: [{
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {
                        this.navCtrl.pop();
                      }
                    }]
                  });
                  alert.present();
                  
                }
                else{
                  let alert=this.alertCtrl.create({
                    title:'Error !',
                    subTitle: 'Somethong Went Wrong Please Try Again',
                    cssClass:'action-close',
                    
                    buttons: [{
                      text: 'Okay',
                      role: 'Okay',
                      handler: () => {
                        
                      }
                    },]
                  });
                  alert.present();
                }
                
              })
              
            }
            else if(data['Expense'] == ''){
              this.showErrorToast('Add Expese To Complete Plumber Meet.')
            }
            else{
              this.showErrorToast('Add Remark To Complete Plumber Meet.')
            }
          }
        }
      ]
    });
    alert.present();
    
    
  }
  
  showErrorToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top'
    });
    
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    
    toast.present();
  }
  
  test(){

    console.log(this.fixed_length_array.length);
    console.log(this.fixed_length_array);

    this.fixed_length_array.push(this.i)
    this.i++
  
  }

  
}
