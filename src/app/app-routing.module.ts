import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryCasesComponent } from './country-cases/country-cases.component';
import { SigninComponent } from './signin/signin.component';
import { WorldwideCasesComponent } from './worldwide-cases/worldwide-cases.component';



const routes: Routes = [
  {path: "worldwide-cases", component: WorldwideCasesComponent,},
  {path: "country-cases", component: CountryCasesComponent,},
  {path: "", pathMatch: "full", redirectTo: "worldwide-cases"},
  {path: "**", redirectTo: "worldwide-cases"}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
