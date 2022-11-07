import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SiteListPage } from '../site-list/site-list';

/**
 * Generated class for the SiteAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-add',
  templateUrl: 'site-add.html',
})
export class SiteAddPage {

  siteform:any={};
  citys:any=[];
  districts:any=[];
  states:any=[];
  dealers:any=[];
  brandData:any=[];
  pcs:any=[];
  engineer:any=[];
  contractorList:any=[];
  data:any={};
  flag:boolean=true;
  loginType:any='';
  loginId:any='';
  loginName:any='';
  id:any=0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider , public actionSheetController:ActionSheetController , private camera: Camera,) {
    console.log(this.navParams.get('id'));
    this.id=this.navParams.get('id');
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteAddPage');
    console.log(this.dbService.userStorageData);
    this.loginType=this.dbService.userStorageData.type;
    this.loginId=this.dbService.userStorageData.id;
    this.loginName=this.dbService.userStorageData.first_name + this.dbService.userStorageData.last_name;
    this.siteform.document_image='';
    
    if(this.id){
      this.getSiteDetail();
      }else{
        this.id=0;
      }
      this.getStates();
    this.getContractorList();
  }


  submit(){
    this.dbService.onShowLoadingHandler();
    this.siteform.loginType=this.loginType;
    this.siteform.loginId=this.loginId;
    this.siteform.loginName=this.loginName;
    this.siteform.site_location_id=this.id;
    this.dbService.onPostRequestDataFromApi({'data':this.siteform},'app_master/siteLocationAdd',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
      this.dbService.onDismissLoadingHandler();
      if(res['status']=='SUCCESS'){
        this.navCtrl.push(SiteListPage);
      }
    },err=>{
      this.dbService.onDismissLoadingHandler();
    })

  }


  getSiteDetail(){
    this.dbService.show_loading();

    this.dbService.onPostRequestDataFromApi({'site_location_id':this.id},'app_master/siteLocationDetail',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);

      this.dbService.dismiss_loading();
      this.siteform=res['site_locations'];
     
      console.log( this.siteform.state);
    },err=>{
      this.dbService.dismiss_loading();

    })

  }
  getStates(){
    this.dbService.show_loading();
    this.dbService.onGetRequestDataFromApi('app_master/getStates',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
        this.states=res['states'];
        this.dbService.dismiss_loading();
    },err=>{
      this.dbService.dismiss_loading();

    })
    

  }

  getDistrictList(state_name){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
        this.districts=res['districts'];
        this.dbService.dismiss_loading();
    },err=>{
      this.dbService.dismiss_loading();

    })
    
  }

  getCityList(district_name){
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({'district_name':district_name},'app_master/getCity',this.dbService.rootUrl).subscribe((res)=>{
      console.log(res);
        this.citys=res['cities'];
        this.dbService.dismiss_loading();
    },err=>{
      this.dbService.dismiss_loading();

    })
  }

  getZoneList(city_name){

  }

  getContractorList(){

    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({},'app_karigar/getContractor',this.dbService.rootUrl).subscribe((ress)=>{
      console.log(ress);
      this.contractorList=ress['contractorData'];
      this.dbService.dismiss_loading();
    },err=>{
      this.dbService.errToasr();
      this.dbService.dismiss_loading();
    })

  }

  onUploadChange(evt: any) {
    // this.flag=false;
    // const file = evt.target.files[0];

    // if (file) {
    //   const reader = new FileReader();

    //   reader.onload = this.handleReaderLoaded.bind(this);
    //   reader.readAsBinaryString(file);
    // }
    let actionsheet = this.actionSheetController.create({
      title:" Upload File",
      cssClass: 'cs-actionsheet',

      buttons:[{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon:'camera',
        handler: () => {
          console.log("Camera Clicked");
          this.takeDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon:'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getDocImage();
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
takeDocPhoto()
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
    this.flag=false;
    this.siteform.document_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.siteform.document_image);
  }, (err) => {
  });
}
getDocImage()
{
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
  }
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.siteform.document_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.siteform.document_image);
  }, (err) => {
  });
}


}
