import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MediaComponent} from "./components/media/media.component";
import {IndexComponent} from "./components/index/index.component";


const routes: Routes = [
  { path: 'media/:id', component: MediaComponent },
  { path: '**', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
