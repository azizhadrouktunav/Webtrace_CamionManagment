import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticateService } from '../authenticate.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../parc/i18n/en';
import { locale as french } from '../../parc/i18n/fr';
import { locale as arabic } from '../../parc/i18n/ar';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { MatProgressSpinnerModule } from '@angular/material';

import * as _ from 'lodash';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { decrypt } from 'app/main/parc/Parc';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
//   providers: [
//     // The locale would typically be provided on the root module of your application. We do it at
//     // the component level here, due to limitations of our example generation script.
//     {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},

//     // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
//     // `MatMomentDateModule` in your applications root module. We provide it at the component level
//     // here, due to limitations of our example generation script.
//     {
//       provide: DateAdapter,
//       useClass: MomentDateAdapter,
//       deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//     },
//     {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
//   ],
})
export class AuthComponent implements OnInit {
    loginForm: FormGroup;
    ConnectionInfo : any ;
    languages: any;
    selectedLanguage: any;
    result: any;
    data: any;
    AccessRightsOfCurrentAccount: any;
    isLoading = false;
    isParcAuthorized = 'false';
    isAdminAuthorized = 'false';
    isSuiviAuthorized = 'false';
    isMonitoringTankAuthorized = 'false';
    hide = true;

    Params = {
        Login: '',
        Password: '',
        CultureInfoName: localStorage.getItem("lang"),
        ClientIPAddress: "",
        ClientCountry: "",
        AppTypeWebOrWin: "",
        AppReselerNameUsedByClient: "",
    }
    AccessParentPageOfCurrentAccount: any;
    recaptchaValidation ;

    spinnerButtonOptions: MatProgressButtonOptions = {
        active: false,
        text: "S'IDENTIFIER",
        spinnerSize: 30,
        raised: true,
        stroked: false,
        buttonColor: 'accent',
        spinnerColor: 'warn',
        fullWidth: true,
        disabled: true,
        mode: 'indeterminate',

      }
    isCustomerManagement: string;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthenticateService,
        private dialog: MatDialog,
        private _translateService: TranslateService,
        private _adapter: DateAdapter<any>,
        private translationLoader: FuseTranslationLoaderService,
        private router: Router,
        private dateAdapter: DateAdapter<any>

    )
    {
        this.languages = [
            
            {
                id   : 'fr',
                title: 'Français',
                flag : 'fr'
            },
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'ar',
                title: 'العربية',
                flag : 'tn'
            }
        ];
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
     // Load the translations
     this.translationLoader.loadTranslations(english, french, arabic);
    }
    
    Authenticate(){
        let lang ='';
        switch(this.selectedLanguage.id)
        {
            case 'fr': lang='fr-FR';
            break;
            case 'en': lang='en-US';
            break;
            case 'ar': lang='ar-TN';
            break;
        }
      
        this.isLoading = true;
        this.spinnerButtonOptions.active = true;
        this.Params.Login = this.loginForm.value.email,
        this.Params.Password = this.loginForm.value.password,
        this.Params.CultureInfoName =lang,
        this.authService.Authenticate(this.Params).subscribe( response => {
            this.spinnerButtonOptions.active = false;
            this.ConnectionInfo = JSON.parse(JSON.stringify(response));
            if(this.ConnectionInfo.IsConnectionOk){
                this.isLoading = false;
                localStorage.setItem('SessionId',response["SessionId"])
                //response["SessionId"]
                 //get user AccessRightsOfCurrentAccount
                 if(response["ForwardURL"] == "~/UICustomerManagement.aspx")
                 {  this.isCustomerManagement ="isCustomerManagement";
                     
                    localStorage.setItem('isCustomerManagement',this.isCustomerManagement);

                 // window.location.href = environment.iconUrl + "UICustomerManagement.aspx";
                 this.authService.SetConnexionState(true);
 
                 }
                 else{

                 this.AccessRightsOfCurrentAccount = response["AccessRightsOfCurrentAccount"];
                 this.AccessParentPageOfCurrentAccount = response["AccessParentPageOfCurrentAccount"];
                 if(this.AccessParentPageOfCurrentAccount["Administration"])
                 {
                     this.isAdminAuthorized ="isAdminAuthorized";
                 }
                 if(this.AccessParentPageOfCurrentAccount["Gestion du parc"])
                 {
                     this.isParcAuthorized ="isParcAuthorized";
                 }
                 if(this.AccessParentPageOfCurrentAccount["Suivi"])
                 {
                     this.isSuiviAuthorized ="isSuiviAuthorized";
                 }
                 if(this.AccessParentPageOfCurrentAccount["Surveillance du réservoir de carburant"] )
                 {
                     this.isMonitoringTankAuthorized = "isMonitoringTankAuthorized";
                 }
                
                 localStorage.setItem('isParcAuthorized',this.isParcAuthorized);
                 localStorage.setItem('isSuiviAuthorized',this.isSuiviAuthorized );
                 localStorage.setItem('isAdminAuthorized',this.isAdminAuthorized);
                 localStorage.setItem('isMonitoringTankAuthorized',this.isMonitoringTankAuthorized);
                 localStorage.setItem('AccessRightsOfCurrentAccount',JSON.stringify(this.AccessRightsOfCurrentAccount));

                 this.authService.SetConnexionState(true);
            
                
                localStorage.setItem('UserName',response["CustomerName"]);
                localStorage.setItem('CustomerGMT',response["CustomerGMT"]);
                localStorage.setItem('Customer',response["Customer"]);

                
                // localStorage.setItem('RememberUser',this.loginForm.value.RememberMe)
                localStorage.setItem('AuthDate',JSON.stringify((new Date()).getTime()))}
                
            }else{ 
                this.isLoading = false;
                const formControl = this.loginForm.get('password');
                if(formControl){
                    formControl.setErrors({
                        serverError: 'check Account'
                    })
                }
            }

        },
        () => {
          })
    
    }
    
  ngOnInit() {

    this.loginForm = this._formBuilder.group({
        email   : ['', Validators.required],
        password: ['', Validators.required],
        // RememberMe: [JSON.parse(localStorage.getItem('RememberUser'))?true:false]
        RememberMe: [false]
    });

    
        let lang = localStorage.getItem("lang")?localStorage.getItem("lang"):this._translateService.currentLang;
        this.selectedLanguage = _.find(this.languages, {id: lang}); 

     //get role of user 
     
     
  }
  errored() {
    console.warn(`reCAPTCHA error encountered`);
  }
  resolved(captchaResponse) {
  //  console.log(`Resolved captcha with response: ${captchaResponse}`);
    captchaResponse ? this.recaptchaValidation = true : this.recaptchaValidation = false
  }
  setLanguage(lang): void
    {
        // Set the selected language for the Authenticating Interface
        this.selectedLanguage = lang;
        this.dateAdapter.setLocale('fr-FR');
        // Use the selected language for translations
        this._translateService.use(lang.id);
        localStorage.setItem("lang" , lang.id);
        this._adapter.setLocale(lang.id);
        
        if(lang.id == "es")
       { this.spinnerButtonOptions.text = "LOGIN"}
       else if(lang.id == "fr")
       { this.spinnerButtonOptions.text = "S'IDENTIFIER"}
       else if(lang.id == "ar")
       { this.spinnerButtonOptions.text = 'تسجيل الدخول'}
    }

}
