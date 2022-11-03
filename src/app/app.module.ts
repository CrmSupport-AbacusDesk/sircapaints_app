import { NgModule, CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MobileLoginPage } from '../pages/login-section/mobile-login/mobile-login';
import { OtpPage } from '../pages/login-section/otp/otp';
import { RegistrationPage } from '../pages/login-section/registration/registration';
import { LoginScreenPage } from '../pages/login-section/login-screen/login-screen';

import { StatusBar } from '@ionic-native/status-bar';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CoupanCodePageModule } from '../pages/scane-pages/coupan-code/coupan-code.module';
import { ScanPageModule } from '../pages/scane-pages/scan/scan.module';
import { GiftDetailPageModule } from '../pages/gift-gallery/gift-detail/gift-detail.module';
import { GiftListPageModule } from '../pages/gift-gallery/gift-list/gift-list.module';
import { OffersPageModule } from '../pages/offers/offers.module';

import { PointListPageModule } from '../pages/points/point-list/point-list.module';
import { PointDetailPageModule } from '../pages/points/point-detail/point-detail.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MainHomePageModule } from '../pages/main-home/main-home.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { TermsPageModule } from '../pages/terms/terms.module';

import { ProductDetailPageModule } from '../pages/product-detail/product-detail.module';
import { ProductSubdetailPageModule } from '../pages/product-subdetail/product-subdetail.module';
import { TransactionPageModule } from '../pages/transaction/transaction.module';
import { ShippingDetailPageModule } from '../pages/shipping-detail/shipping-detail.module';
import { NotificationPageModule } from '../pages/notification/notification.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { VideoPageModule } from '../pages/video/video.module';
import { NewsPageModule } from '../pages/news/news.module';
import { NewsDetailPageModule } from '../pages/news-detail/news-detail.module';
import { FeedbackPageModule } from '../pages/feedback/feedback.module';

import { AboutusModalPageModule } from '../pages/aboutus-modal/aboutus-modal.module';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { OfferListPageModule } from '../pages/offer-list/offer-list.module';
import { IonicStorageModule } from '@ionic/storage';
import { SafePipe } from '../pipes/safe/safe';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ViewProfilePageModule } from '../pages/view-profile/view-profile.module';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ComplaintDetailPageModule } from '../pages/complaints/complaint-detail/complaint-detail.module';
import { AddNewComplaintPageModule } from '../pages/complaints/add-new-complaint/add-new-complaint.module';
import { ComplaintHistoryPageModule } from '../pages/complaints/complaint-history/complaint-history.module';
import { MyCamplaintsPageModule } from '../pages/plumber-camplaints/my-camplaints/my-camplaints.module';
import { PulmberCustomerDetailPageModule } from '../pages/plumber-camplaints/pulmber-customer-detail/pulmber-customer-detail.module';
import { EnquiryPageModule } from '../pages/enquiry/enquiry.module';
import { TaskClosePageModule } from '../pages/task-close/task-close.module';
import { Super30PageModule } from '../pages/super30/super30.module';
import { CancelComplaintPageModule } from '../pages/cancel-complaint/cancel-complaint.module';
import { MediaCapture} from '@ionic-native/media-capture';
import { PointLocationPageModule } from '../pages/point-location/point-location.module';
import { Geolocation } from  '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { ComplaintRemarksPageModule } from '../pages/complaint-remarks/complaint-remarks.module';
import { AppVersion } from '@ionic-native/app-version';
import { CategoryPageModule } from '../pages/category/category.module';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SelectRegistrationTypePage } from '../pages/select-registration-type/select-registration-type';
import { LoginPageModule } from '../pages/login/login.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { AddOrderPageModule } from '../pages/add-order/add-order.module';
import { CartDetailPageModule } from '../pages/cart-detail/cart-detail.module';
import { LeadsDetailPageModule } from '../pages/leads-detail/leads-detail.module';
import { LeaveListPageModule } from '../pages/leave-list/leave-list.module';
import { AddLeavePageModule } from '../pages/add-leave/add-leave.module';
import { MainDistributorListPageModule } from '../pages/sales-app/main-distributor-list/main-distributor-list.module';
import { WorkTypeModalPageModule } from '../pages/work-type-modal/work-type-modal.module';
import { AddCheckinPageModule } from '../pages/sales-app/add-checkin/add-checkin.module';
import { CheckinListPageModule } from '../pages/sales-app/checkin-list/checkin-list.module';
import { EndCheckinPageModule } from '../pages/sales-app/end-checkin/end-checkin.module';
import { OrderListPageModule } from '../pages/order-list/order-list.module';
import { AttendencePageModule } from '../pages/attendence/attendence.module';
import { TravelListPageModule } from '../pages/travel-list/travel-list.module';
import { TravelAddPageModule } from '../pages/travel-add/travel-add.module';
import { SearchPageModule } from '../pages/search/search.module';
import { AddDealerPageModule } from '../pages/sales-app/add-dealer/add-dealer.module';
import { DistributorDetailPageModule } from '../pages/sales-app/distributor-detail/distributor-detail.module';
import { CustomerOrderPageModule } from '../pages/sales-app/customer-order/customer-order.module';
import { CustomerCheckinPageModule } from '../pages/sales-app/customer-checkin/customer-checkin.module';
import { DistributorListPageModule } from '../pages/sales-app/distributor-list/distributor-list.module';
import { CheckinDetailPageModule } from '../pages/sales-app/checkin-detail/checkin-detail.module';
import { AddLeadsPageModule } from '../pages/sales-app/add-leads/add-leads.module';
import { OrderDetailPageModule } from '../pages/order-detail/order-detail.module';
import { NewarrivalsPageModule } from '../pages/newarrivals/newarrivals.module';

import { OtpverifyPage } from '../pages/otpverify/otpverify';

import { NearestDealerPageModule } from '../pages/nearest-dealer/nearest-dealer.module';
import { VideoCategoryPageModule } from '../pages/video-category/video-category.module';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { OfflineDbProvider } from '../providers/offline-db/offline-db';

import { Network } from '@ionic-native/network';
import { DealerHomePageModule } from '../pages/dealer-home/dealer-home.module';
import { DealerCheckInPageModule } from '../pages/dealer-check-in/dealer-check-in.module';
import { DealerOrderPageModule } from '../pages/dealer-order/dealer-order.module';
import { DealerDiscountPageModule } from '../pages/dealer-discount/dealer-discount.module';
import { DealerProfilePageModule } from '../pages/dealer-profile/dealer-profile.module';
import { DealerAddorderPageModule } from '../pages/dealer-addorder/dealer-addorder.module';
import { DealerDealerListPageModule } from '../pages/dealer-dealer-list/dealer-dealer-list.module';
import { DealerExecutiveAppPageModule } from '../pages/dealer-executive-app/dealer-executive-app.module';

import { DealerExecutiveListPageModule } from '../pages/dealer-executive-list/dealer-executive-list.module';

import { FavoriteProductPageModule } from '../pages/favorite-product/favorite-product.module';
import { ExecutivDetailPageModule } from '../pages/executiv-detail/executiv-detail.module';
import { EditNetworkPageModule } from '../pages/sales-app/edit-network/edit-network.module';
import { ExecutiveEditPageModule } from '../pages/executive-edit/executive-edit.module';
import { ExecutivePopoverPageModule } from '../pages/executive-popover/executive-popover.module';
import { ExecutiveOrderDetailPageModule } from '../pages/executive-order-detail/executive-order-detail.module';

import { CancelationPolicyPageModule } from '../pages/cancelation-policy/cancelation-policy.module';
import { CancelpolicyModalPageModule } from '../pages/cancelpolicy-modal/cancelpolicy-modal.module';

import { SelectRegistrationTypePageModule } from '../pages/select-registration-type/select-registration-type.module';
import { LoginScreenPageModule } from '../pages/login-section/login-screen/login-screen.module';
import { MobileLoginPageModule } from '../pages/login-section/mobile-login/mobile-login.module';
import { OtpPageModule } from '../pages/login-section/otp/otp.module';
import { RegistrationPageModule } from '../pages/login-section/registration/registration.module';
import { OtpverifyPageModule } from '../pages/otpverify/otpverify.module';
import {ProgressBarModule} from "angular-progress-bar";
import { Zip } from '@ionic-native/zip';
import { OrderSummaryPageModule } from '../pages/order-summary/order-summary.module';
import { PopNGiftsPageModule } from '../pages/pop-n-gifts/pop-n-gifts.module';
import { AddPopOrderPageModule } from '../pages/add-pop-order/add-pop-order.module';
import { PopOrderDetailPageModule } from '../pages/pop-order-detail/pop-order-detail.module';
import { PopGiftListPageModule } from '../pages/pop-gift-list/pop-gift-list.module';
import { PopGiftDetailPageModule } from '../pages/pop-gift-detail/pop-gift-detail.module';
import { FollowUpAddPageModule } from '../pages/follow-up/follow-up-add/follow-up-add.module';
import { FollowUpListPageModule } from '../pages/follow-up/follow-up-list/follow-up-list.module';
import { FollowUpDetailPageModule } from '../pages/follow-up/follow-up-detail/follow-up-detail.module';
import { TargetAchievementPageModule } from '../pages/target-achievement/target-achievement.module';
import { EditDetailsPageModule} from '../pages/edit-details/edit-details.module';
import { ExpenseAddPageModule } from '../pages/expense-module/expense-add/expense-add.module';
import { ExpenseDetailPageModule } from '../pages/expense-module/expense-detail/expense-detail.module';
import { ExpenseListPageModule } from '../pages/expense-module/expense-list/expense-list.module';
import { ExpensePopoverPageModule } from '../pages/expense-module/expense-popover/expense-popover.module';
import { TravelDetailPageModule } from '../pages/travel-detail/travel-detail.module';
import { BillingTotalOverduePageModule } from '../pages/billing-total-overdue/billing-total-overdue.module';
import { BillingTotalOutstandingPageModule } from '../pages/billing-total-outstanding/billing-total-outstanding.module';
import { BillingListPageModule } from '../pages/billing-list/billing-list.module';
import { BillingDetailPageModule } from '../pages/billing-detail/billing-detail.module';
import { AccountStatementPageModule } from '../pages/account-statement/account-statement.module';
import { FiltersPageModule } from '../pages/filters/filters.module';
import { SelectFavProductQtyPageModule } from '../pages/select-fav-product-qty/select-fav-product-qty.module';
import { PlumberMeetListPageModule } from '../pages/plumber-meet-list/plumber-meet-list.module';
import { PlumberMeetAddPageModule } from '../pages/plumber-meet-add/plumber-meet-add.module';
import { PlumberMeetDetailPageModule } from '../pages/plumber-meet-detail/plumber-meet-detail.module';
import { PlumberMeetGalleryPageModule } from '../pages/plumber-meet-gallery/plumber-meet-gallery.module';
import { ReadyToDipatchOrderListPageModule } from '../pages/ready-to-dipatch-order-list/ready-to-dipatch-order-list.module';
import { GenerateMasterCartForOrderDispatchPageModule } from '../pages/generate-master-cart-for-order-dispatch/generate-master-cart-for-order-dispatch.module';
import { DispatchOrderCartPageModule } from '../pages/dispatch-order-cart/dispatch-order-cart.module';
import { ScannedMasterQrCodeDetailPageModule } from '../pages/scanned-master-qr-code-detail/scanned-master-qr-code-detail.module';
import { MapMasterBoxForTransferWarehouseToAnotherWarehousePageModule } from '../pages/map-master-box-for-transfer-warehouse-to-another-warehouse/map-master-box-for-transfer-warehouse-to-another-warehouse.module';
import { ShowDetailsOfCalculatedStockPageModule } from '../pages/show-details-of-calculated-stock/show-details-of-calculated-stock.module';
import { AddActivityPageModule } from '../pages/add-activity/add-activity.module';
import { ActivitydetailPageModule } from '../pages/activitydetail/activitydetail.module';
import { ActivitydetailPage } from '../pages/activitydetail/activitydetail';
import { PointHistoryPageModule } from '../pages/point-history/point-history.module';
import { QuotationDistributorPageModule } from '../pages/quotation-distributor/quotation-distributor.module';
import { AddQuotationPageModule } from '../pages/add-quotation/add-quotation.module';
import { QuotationDetailPageModule } from '../pages/quotation-detail/quotation-detail.module';
import { EmailModalPageModule } from '../pages/email-modal/email-modal.module';
import { ContractorListPageModule } from '../pages/contractor-list/contractor-list.module';
import { ArchitectorListPageModule } from '../pages/architector-list/architector-list.module';
import { SiteListPageModule } from '../pages/site-list/site-list.module';
import { SiteAddPageModule } from '../pages/site-add/site-add.module';
import { SiteDetailPageModule } from '../pages/site-detail/site-detail.module';



@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        HomePage,
        SafePipe,
        AboutPage,
        // IonicSelectableModule
    ],
    imports: [
        ShowDetailsOfCalculatedStockPageModule,
        MapMasterBoxForTransferWarehouseToAnotherWarehousePageModule,
        ScannedMasterQrCodeDetailPageModule,
        DispatchOrderCartPageModule,
        GenerateMasterCartForOrderDispatchPageModule,
        ReadyToDipatchOrderListPageModule,
        PlumberMeetGalleryPageModule,
        PlumberMeetDetailPageModule,
        PlumberMeetAddPageModule,
        PlumberMeetListPageModule,
        SelectFavProductQtyPageModule,
        FiltersPageModule,
        AccountStatementPageModule,
        BillingDetailPageModule,
        BillingListPageModule,
        BillingTotalOverduePageModule,
        BillingTotalOutstandingPageModule,
        EditDetailsPageModule,
        ExpenseAddPageModule,
        ExpenseDetailPageModule,
        ExpenseListPageModule,
        PopOrderDetailPageModule,
        AddPopOrderPageModule,
        ProgressBarModule,
        DealerExecutiveAppPageModule,
        AboutusModalPageModule,
        SelectRegistrationTypePageModule,
        MobileLoginPageModule,
        RegistrationPageModule,
        OtpverifyPageModule,
        LoginScreenPageModule,
        ExecutivDetailPageModule,
        TaskClosePageModule,
        ContractorListPageModule,
        ArchitectorListPageModule,
        SiteListPageModule,
        SiteAddPageModule,
        SiteDetailPageModule,
        QuotationDistributorPageModule,
        AddQuotationPageModule,
        QuotationDetailPageModule,
        EnquiryPageModule,
        OtpPageModule,
        BrowserModule,
        IonicModule.forRoot(MyApp),
        ScanPageModule,
        CoupanCodePageModule,
        GiftDetailPageModule,
        GiftListPageModule,
        OffersPageModule,
        ViewProfilePageModule,
        PointListPageModule,
        PointDetailPageModule,
        ProfilePageModule,
        MainHomePageModule,
        ProductsPageModule,
        TermsPageModule,
        NewarrivalsPageModule,
        ProductDetailPageModule,
        VideoCategoryPageModule,
        ProductSubdetailPageModule,
        TransactionPageModule,
        ShippingDetailPageModule,
        NotificationPageModule,
        ContactPageModule,
        VideoPageModule,
        NewsPageModule,
        PinchZoomModule,
        NewsDetailPageModule,
        FeedbackPageModule,
        HttpClientModule,
        HttpModule,
        AboutusModalPageModule,
        IonicStorageModule.forRoot(),
        OfferListPageModule,
        AddNewComplaintPageModule,
        ComplaintDetailPageModule,
        ComplaintHistoryPageModule,
        MyCamplaintsPageModule,
        PulmberCustomerDetailPageModule ,
        Super30PageModule,
        CancelComplaintPageModule,
        PointLocationPageModule ,
        EmailModalPageModule,
        EditProfilePageModule ,
        ComplaintRemarksPageModule,
        CategoryPageModule,
        FavoriteProductPageModule,
        WorkTypeModalPageModule,
        LoginPageModule,
        DashboardPageModule,
        AddOrderPageModule,
        CartDetailPageModule,
        LeadsDetailPageModule,
        LeaveListPageModule,
        AddLeavePageModule,
        MainDistributorListPageModule,
        DealerDealerListPageModule,
        AddCheckinPageModule,
        CheckinListPageModule,
        EndCheckinPageModule,
        OrderListPageModule,
        AttendencePageModule,
        NewarrivalsPageModule,
        TravelListPageModule,
        TravelAddPageModule,
        SearchPageModule,
        AddDealerPageModule,
        DistributorDetailPageModule,
        CustomerOrderPageModule,
        CustomerCheckinPageModule,
        DistributorListPageModule,
        NearestDealerPageModule,
        AddLeadsPageModule,
        CheckinDetailPageModule,
        OrderDetailPageModule,
        ExecutiveOrderDetailPageModule,
        DealerHomePageModule,
        DealerCheckInPageModule,
        DealerOrderPageModule,
        DealerDiscountPageModule,
        DealerProfilePageModule,
        DealerAddorderPageModule,
        DealerExecutiveListPageModule,
        EditNetworkPageModule,
        ExecutiveEditPageModule,
        ExecutivePopoverPageModule,
        CancelationPolicyPageModule,
        CancelpolicyModalPageModule,
        ProgressBarModule,
        OrderSummaryPageModule,
        PopNGiftsPageModule,
        PopGiftListPageModule,
        PopGiftDetailPageModule,
        FollowUpAddPageModule,
        FollowUpListPageModule,
        FollowUpDetailPageModule,
        TargetAchievementPageModule,
        ExpensePopoverPageModule,
        TravelDetailPageModule,
        AddActivityPageModule,
        ActivitydetailPageModule,
        PointHistoryPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        MobileLoginPage,
        OtpPage,
        SelectRegistrationTypePage,
        RegistrationPage,
        LoginScreenPage,
        OtpverifyPage,
        ActivitydetailPage,
    ],
    providers: [
        StatusBar,
        DbserviceProvider,
        SplashScreen,
        Geolocation,
        NativeGeocoder,
        Camera,
        MediaCapture,
        BarcodeScanner,
        FileTransfer,
        SocialSharing,
        Push,
        FileTransferObject,
        File,
        LaunchNavigator,
        Diagnostic,
        AndroidPermissions,
        AppVersion,
        LocationAccuracy,
        SQLite,
        SQLitePorter,
        Network,
        Zip,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        OfflineDbProvider
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class AppModule {}
