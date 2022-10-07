import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ExpensePopoverPage } from '../expense-module/expense-popover/expense-popover';
import { PlumberMeetDetailPage } from '../plumber-meet-detail/plumber-meet-detail';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
* Generated class for the PlumberMeetGalleryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-plumber-meet-gallery',
  templateUrl: 'plumber-meet-gallery.html',
})
export class PlumberMeetGalleryPage {
  
  plumber_meet_id:any = '';
  go_to_where:any='';
  plumber_meet_images:any=[];
  plumber_meet_videos:any=[];
  currentPlayingVideo: HTMLVideoElement;
  plumber_meet_status:any = '';
  expand_image:boolean = false;
  expand_video:boolean = false;

  
  
  
  
  constructor(public navCtrl: NavController,public modalCtrl:ModalController,public alertCtrl:AlertController, public navParams: NavParams,public popoverCtrl: PopoverController,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlumberMeetGalleryPage');
  }
  
  ionViewWillEnter(){
    
    console.log('from = '+this.navParams.get('from'));
    console.log('status = '+this.navParams.get('status'));
    this.plumber_meet_status = this.navParams.get('status');

    console.log('plumber_meet_id= '+this.navParams.get('plumber_meet_id'));
    
    if(this.navParams.get('plumber_meet_id') && (this.navParams.get('from') == 'plumber-meet-detail') && this.navParams.get('plumber_meet_id') != '0'){
      this.plumber_meet_id = this.navParams.get('plumber_meet_id')
      this.get_plumber_meet_gellery_detail();
    }
    else{
      console.log("in else");
      console.log(this.navParams.get('plumber_meet_id'));
    }
    
  }
  
  get_plumber_meet_gellery_detail(){
    console.log("get_plumber_meet_gellery_detail method calls");
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'plumber_meet_id':this.plumber_meet_id},'PlumberMeet/plumber_meet_media_file_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result);
      this.plumber_meet_images = result['plumber_image_file_listing'];
      this.plumber_meet_videos = result['plumber_video_file_listing'];
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
  
  presentPopover(myEvent) {
    
    let popover = this.popoverCtrl.create(ExpensePopoverPage,{'from':'Plumber Meet Gallery'});
    popover.present({
      ev: myEvent
    });
    
    popover.onDidDismiss(resultData => {
      console.log(resultData);
      this.go_to_where = resultData.TabStatus;
      
      if(this.go_to_where == 'Gallery'){
        this.get_plumber_meet_gellery_detail();
      }
      else if(this.go_to_where == 'Detail'){
        this.navCtrl.pop({animate:false});
        this.navCtrl.push(PlumberMeetDetailPage,{'meet id':this.plumber_meet_id , 'from':'plumber-meet-gallery'});
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
  
  view_image(src){
    this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
  }
  
  onPlayingVideo(event) {
    event.preventDefault();
    // play the first video that is chosen by the user
    if (this.currentPlayingVideo === undefined) {
      this.currentPlayingVideo = event.target;
      this.currentPlayingVideo.play();
    } else {
      // if the user plays a new video, pause the last one and play the new one
      if (event.target !== this.currentPlayingVideo) {
        this.currentPlayingVideo.pause();
        this.currentPlayingVideo = event.target;
        this.currentPlayingVideo.play();
      }
    }
  }

  delete_gallery_data(gallery_data_id){
    console.log("delete_gallery_data method calls");
    console.log("gallery_data_id = "+gallery_data_id);
    
    let alert = this.alertCtrl.create({
      title: 'Confirmation !',
      message: 'Are you sure you want to delete this Media File?',
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
            this.dbService.onPostRequestDataFromApi({'plumber_meet_media_file_id':gallery_data_id},"PlumberMeet/plumber_meet_media_file_remove", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
              console.log(resp);
              if(resp['msg'] == 'Deleted Successfully'){
                this.dbService.presentToast('Media File Deleted Sucessfully')
                this.dbService.dismiss_loading();
                this.get_plumber_meet_gellery_detail();
                
              }
              else{
                this.dbService.errToasr();
                this.dbService.dismiss_loading();
                this.get_plumber_meet_gellery_detail();
              }
            },err=>
            {
              this.dbService.dismiss_loading();
              this.get_plumber_meet_gellery_detail();
              
            })
          }
        }
      ]
    })
    alert.present();
    
  }
  
  
}
