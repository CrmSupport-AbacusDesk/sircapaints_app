import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events, Platform, MenuController, ModalCmp, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import moment from 'moment';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { OrderListPage } from '../order-list/order-list';
import { AddCheckinPage } from '../sales-app/add-checkin/add-checkin';
import { WorkTypeModalPage } from '../work-type-modal/work-type-modal';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { Network } from '@ionic-native/network';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PopNGiftsPage } from '../pop-n-gifts/pop-n-gifts';
import { TargetAchievementPage } from '../target-achievement/target-achievement';
import { FollowUpListPage } from '../follow-up/follow-up-list/follow-up-list';
import { ReadyToDipatchOrderListPage } from '../ready-to-dipatch-order-list/ready-to-dipatch-order-list';
import { NotificationPage } from '../notification/notification';
import { RegistrationPage } from '../login-section/registration/registration';
import { ContractorListPage } from '../contractor-list/contractor-list';
import { ArchitectorListPage } from '../architector-list/architector-list';
import { SiteListPage } from '../site-list/site-list';


@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {

    attend_id: any = '';
    currentTime: any = '';
    user_id: any = '';
    from: any = 'executive';
    last_attendence_data: any = [];
    user_data: any = [];
    today_checkin: any = [];
    total_dealer: any = [];
    total_distributor: any = [];
    total_direct_dealer: any = [];
    user_logged_in: boolean;
    start_attend_time: any;
    total_primary_order: any = [];
    total_secondary_order: any = [];
    primary_order_sum: number;
    secondary_order_sum: number;
    subscription: any;
    attendence_data: any = [];
    prodCount: any = {};
    target_vs_achievement: any = {};
    today_followup_count: any = 0;
    today_contractor_count: any = 0;
    today_oem_count:any=0;
    today_architect_count: any = 0;
    today_site_count: any = 0;
    test_flag: boolean = false
    today_activity_count: any;
    social_media_lead_count: any;

    constructor(private network: Network, public navCtrl: NavController, public loadingCtrl: LoadingController, public geolocation: Geolocation, private storage: Storage, public toastCtrl: ToastController, public alertCtrl: AlertController, public events: Events, public locationAccuracy: LocationAccuracy, public platform: Platform, public push: Push, public dbService: DbserviceProvider, public menu: MenuController, public modal: ModalController, public offlineService: OfflineDbProvider) {


        this.dbService.onGetRequestDataFromApi('Login/at_user_login_assigned_dr_category_assigned_with_discount', this.dbService.rootUrlSfa).subscribe((result) => {
            console.log(result);


        })




        events.subscribe('getCountProducts', (data) => {
            this.get_count_ofProducts();
        })
    }

    ionViewWillEnter() {
        this.notification();
        this.last_attendence();
        this.get_count_ofProducts();
        this.get_target_vs_achievement_data();


        var time = new Date();

        this.currentTime = moment().format("HH:mm:ss");

        this.platform.ready().then(() => {


            this.network.onConnect().subscribe(() => {
                this.dbService.connectionChk = 'online;'
            });
            this.network.onDisconnect().subscribe(() => {
                this.dbService.connectionChk = 'offline';
            });

        })
    }



    get_count_ofProducts() {

        this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {

            console.log(productCount);
            this.prodCount.total = productCount

        }, err => {

        });

        this.offlineService.onReturnActiveProductNewArrivalsCountHandler().subscribe(productCount1 => {

            this.prodCount.new = productCount1

        }, err => {

        });
        console.log(this.prodCount);

    }



    // onProcessSQLDataHandler() {

    //     if(this.offlineService.localDBCallingCount === 0) {

    //         this.offlineService.localDBCallingCount++;
    //         this.offlineService.onValidateLocalDBSetUpTypeHandler();
    //     }
    // }


    ionViewDidLoad() {


        // this.onProcessSQLDataHandler();
        // if(this.user_data.length<1){
        //     console.log(this.user_data); 
        //     var  apiInterval= setInterval(()=>{this.last_attendence},4000);
        //        console.log(apiInterval);

        // }else{
        //     console.log("hello world"); 

        //     clearInterval(apiInterval);

        // }

    }

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribe(() => {
            console.log("in exit function");

            let alert = this.alertCtrl.create({
                title: 'Exit Application?',
                subTitle: 'Are you sure want to exit the App?',
                cssClass: 'action-close',

                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Confirm',
                    cssClass: 'close-action-sheet',
                    handler: () => {
                        navigator['app'].exitApp();
                    }
                }]
            });
            alert.present();
        });

        this.last_attendence();
        this.events.publish('current_page', 'Dashboard');
    }

    ionViewWillLeave() {
        console.log("in exit function 2");
        this.subscription.unsubscribe();
    }

    ionViewDidLeave() {
        this.events.publish('current_page', '');
    }


    openModal() {
        let workTypeModal = this.modal.create(WorkTypeModalPage);

        workTypeModal.onDidDismiss(data => {
            this.events.publish('user:login');
            this.last_attendence();
            console.log(data);


        });

        workTypeModal.present();
    }

    stop_attend() {

        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {

            let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
            this.geolocation.getCurrentPosition(options).then((resp) => {

                var lat = resp.coords.latitude
                var lng = resp.coords.longitude
                this.dbService.onShowLoadingHandler()

                this.dbService.onPostRequestDataFromApi({ 'lat': lat, 'lng': lng, 'attend_id': this.last_attendence_data.attend_id }, 'Attendence/stop_attend', this.dbService.rootUrlSfa).subscribe((result) => {

                    if (result == 'success') {
                        this.last_attendence();
                        this.dbService.onDismissLoadingHandler();

                        this.dbService.presentToast('Work Time Stopped Successfully')
                    }
                }, err => {
                    this.dbService.onDismissLoadingHandler()
                    this.dbService.errToasr()
                })

            }).catch((error) => {
                this.dbService.presentToast('Could Not Get Location !!')
            });
        },
            error => {
                this.dbService.presentToast('Please Allow Location !!')

            });
    }

    presentAlert() {
        let alert = this.alertCtrl.create({
            title: 'Stop Time',
            message: 'Do you want to stop work time?',
            cssClass: 'alert-modal',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Yes clicked');
                        this.stop_attend();
                    }
                },
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');



                    }
                }

            ]
        });
        alert.present();
    }


    last_attendence() {
        this.dbService.onGetRequestDataFromApi('Attendence/last_attendence_data', this.dbService.rootUrlSfa).subscribe((result) => {
            console.log(result);
            this.last_attendence_data = result['attendence_data'];
            this.user_data = result['user_data'];
            this.today_checkin = result['today_checkin'];
            this.total_dealer = result['total_dealer'];
            this.total_direct_dealer = result['total_direct_dealer'];
            this.total_distributor = result['total_distributor'];
            this.total_primary_order = result['total_primary_order'];
            this.total_secondary_order = result['total_secondary_order'];
            this.today_followup_count = result['today_followup_count'];
            this.today_activity_count = result['today_activity_count'];
            this.social_media_lead_count = result['social_media_lead_count'];
            this.today_contractor_count = result['contractor'];
            this.today_architect_count= result['Architect'];
            this.today_oem_count= result['OEM'];
            this.today_site_count= result['site_location'];
            console.log("Social Media Lead Count ", this.social_media_lead_count);



            if (this.last_attendence_data.start_time != '') {
                var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                var H = +this.last_attendence_data.start_time.substr(0, 2);
                var h = (H % 12) || 12;
                var ampm = H < 12 ? "AM" : "PM";
                this.start_attend_time = h + this.last_attendence_data.start_time.substr(2, 3) + ampm;
            }
        })
    }

    open_menu() {
        console.log(this.dbService.userStorageData);
        this.events.publish('user:navigation_menu');
    }

    goToCheckin() {
        this.navCtrl.push(CheckinListPage);
    }

    goToMainDistributorListPage(type) {
        this.navCtrl.push(MainDistributorListPage, { 'type': type })
    }

    goToDrListPage(type, network_type) {
        this.navCtrl.push(MainDistributorListPage, { 'type': type, 'network_type': network_type })
    }

    start_visit() {
        this.navCtrl.push(AddCheckinPage);
    }

    activtiy() {
        this.navCtrl.push(NotificationPage);
    }

    goToOrders(type) {
        this.navCtrl.push(OrderListPage, { 'type': type });
    }
    goToFollowUp() {
        this.navCtrl.push(FollowUpListPage, {});
    }


    viewAchievement() {

        this.navCtrl.push(TargetAchievementPage, { 'from': this.from });

        //     let TargetAchievement = this.modal.create(TargetAchievementPage);
        //     TargetAchievement.onDidDismiss(data => {

        //     });
        //     TargetAchievement.present();
    }


    get_target_vs_achievement_data() {
        this.dbService.onGetRequestDataFromApi('User/user_target_list', this.dbService.rootUrlSfa).subscribe((result) => {
            console.log(result);
            this.target_vs_achievement = result['target_list'];
            console.log(this.target_vs_achievement);

        })
    }

    target_check(type) {

        if (type == 'primary') {

            return (parseInt(this.target_vs_achievement.primary_achievement) >= parseInt(this.target_vs_achievement.primary_target) ? true : false);

        }
        else if (type == 'secondary') {

            return (parseInt(this.target_vs_achievement.secondary_achievement) >= parseInt(this.target_vs_achievement.secondary_target) ? true : false);

        }
        else {

        }


    }

    notification() {
        console.log("notification method calls in dashboard.ts");

        this.push.hasPermission()
            .then((res: any) => {

                if (res.isEnabled) {
                    console.log('We have permission to send push notifications');
                } else {
                    console.log('We do not have permission to send push notifications');
                }
            });


        const options: PushOptions = {
            android: {
                senderID: '643423474252'
            },
            ios: {

                alert: 'true',
                badge: true,
                sound: true
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };

        const pushObject: PushObject = this.push.init(options);
        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
        pushObject.on('registration').subscribe((registration: any) => {
            console.log('Device registered', registration)
            this.dbService.onPostRequestDataFromApi({ 'registration_id': registration.registrationId }, 'User/save_user_device_id', this.dbService.rootUrlSfa).subscribe(r => {
                console.log(r);
            });
        }
        );

        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }

    test_method() {
        console.log("test method calls");
        // this.test_flag = !this.test_flag;

        this.go_to('ready_to_dispatch');

    }

    go_to(where: any = '') {
        console.log("go_to method calls");
        console.log(where);
        if (where == 'ready_to_dispatch') {
            this.navCtrl.push(ReadyToDipatchOrderListPage);
        }
        else if (where == 'dispatch') {

        }
        else {
            console.log('where = ' + where);
        }


    }

    doRefresh(refresher) {

        this.last_attendence();
        this.get_target_vs_achievement_data();

        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    goToRegistrationPage(loginType) {
        this.navCtrl.push(RegistrationPage, { loginType, 'Employee': 'Employee' });
    }
    goToContractorPage() {
        this.navCtrl.push(ContractorListPage);
    }
    goToArchitecturePage() {
        this.navCtrl.push(ArchitectorListPage);
    }

    goToSiteListPage() {
        this.navCtrl.push(SiteListPage);
    }
    //   refreshCatalogue(){
    //     this.offlineService.shouldStartSetUpProcess=true;
    //     this.offlineService.localDBCallingCount=0;
    //     if(this.offlineService.localDBCallingCount === 0) {
    //         console.log("testing purpose");

    //         this.offlineService.localDBCallingCount++;
    //         this.offlineService.onValidateLocalDBSetUpTypeHandler();
    //     }
    //   }

}
