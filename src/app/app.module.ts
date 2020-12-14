import {BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './components/intro/intro.component';
import { ListComponent } from './components/list/list.component';
import { ConfigService } from "./services/config.service";
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import { ProportionalDirective } from './proportional.directive';
import { MediaComponent } from './components/media/media.component';
import { IndexComponent } from './components/index/index.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { IsVisibleDirective } from './is-visible.directive';
import { MouseMoveDirective } from './mouse-move.directive';

import 'hammerjs';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    ListComponent,
    ProportionalDirective,
    MediaComponent,
    IndexComponent,
    AboutComponent,
    ContactComponent,
    IsVisibleDirective,
    MouseMoveDirective,
    TooltipDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HammerModule
  ],
  providers: [ConfigService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
