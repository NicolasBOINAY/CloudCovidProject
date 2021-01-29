import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from '@angular/fire'
import {AngularFirestoreModule} from '@angular/fire/firestore'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { CountryCasesComponent } from './country-cases/country-cases.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { WorldwideCasesComponent } from './worldwide-cases/worldwide-cases.component';
import { ChartsModule } from 'ng2-charts';
 

@NgModule({
  declarations: [
    AppComponent,
    WorldwideCasesComponent,
    CountryCasesComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    CommonModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [

    CommonModule
  ]
})
export class AppModule { }
