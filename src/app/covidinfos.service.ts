import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import{ AngularFireAuth} from '@angular/fire/auth';
import { User } from './user.model';
import {AngularFirestore} from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataWorldInfos } from './worldwide-cases/DataWorldInfos';



@Injectable({
  providedIn: 'root'
})
export class CovidinfosService {

  private user!: User;
 
private CovidUrl = 'https://api.covid19api.com/summary';


  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router, 
    private firestore: AngularFirestore) { }

  async signInWithGoogle(){
    const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    this.user = {
    uid: credientals.user?.uid as string,
    displayName: credientals.user?.displayName as string,
    email: credientals.user?.email as string
    };
    this.updateUserData();
  }

  
  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    },{merge: true});

  }

  updateCovidData(newdata: unknown){
    console.log(newdata);
    this.firestore.collection("global").doc("summary").set(newdata,{merge:true})
  }

  getDataFromFirebase(){
    return this.firestore.collection("global").doc("summary").valueChanges();
   }

  updateMonthlyData(data: object){
    console.log(data);
    this.firestore.collection("monthly").doc("Monthsummary").set(data,{merge:true})
  }

  getMonthlyFromFirebase(){
    return this.firestore.collection("monthly").doc("Monthsummary").valueChanges();
  }

  updateWeeklyData(weekdata: unknown){
    this.firestore.collection("weekly").doc("summary").set(weekdata,{merge:true})
  }

  getWeeklyFromFirebase(){
    return this.firestore.collection("weekly").doc("summary").valueChanges();
  }

  updateCountryData(newdata: unknown){
    this.firestore.collection("countries").doc("summary").set(newdata,{merge:true})
  }

  getCountryDataFromFirebase(){
    return this.firestore.collection("countries").doc("summary").valueChanges();
   }
  
   updateHistoryCountry(newdata: unknown){
     this.firestore.collection("country").doc("history").set(newdata, {merge: true})
   }

   getHistoryFromFirebase(){
     return this.firestore.collection("country").doc("history").valueChanges();
   }
  
  updateCountryAll(newdata: unknown){
    this.firestore.collection("AllCountries").doc("country").set(newdata,{merge:true});
   }

   getCountryAllFromFirebase(){
     return this.firestore.collection("AllCountries").doc("country").valueChanges();
   }
  
}
