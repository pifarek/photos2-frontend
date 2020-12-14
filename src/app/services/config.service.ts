import {Injectable, isDevMode} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public apiUrl: string;
  public uploadURL: string;

  constructor() {
    if(isDevMode()) {
      this.apiUrl = 'http://photos-backend.local/api/';
      this.uploadURL = 'http://photos-backend.local/upload/';
    } else {
      this.apiUrl = 'http://photos-api.piwarski.pl/api/';
      this.uploadURL = 'http://photos-api.piwarski.pl/upload/';
    }
  }
}
