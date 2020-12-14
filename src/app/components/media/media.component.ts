import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {Media} from "../../models/media.model";
import {ConfigService} from "../../services/config.service";
import {FiltersService} from "../../services/filters.service";
import {Observable, Observer} from "rxjs";

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, OnDestroy {

  /**
   * Monitor keys press
   * @param event
   */
  @HostListener('window:keydown', ['$event']) keypress(event: KeyboardEvent) {
    if(!this.loadingMedia) {
      switch (event.key) {
        case 'ArrowLeft':
          this.previousMedia();
          break;
        case 'ArrowRight':
          this.nextMedia();
          break;
      }
    }
  }

  public fullscreenApiEnabled = false;
  public fullscreen = false;
  @HostListener('window:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  private fullscreenChange() {
    //alert('fs event');
    const element = document as Document & {
      fullscreenElement: Element;
      mozFullscreenElement: Element;
      webkitFullscreenElement: Element;
      msFullscreenElement: Element;
    };

    if(element.fullscreenElement || element.mozFullscreenElement || element.webkitFullscreenElement || element.msFullscreenElement) {
      this.fullscreen = true
    } else {
      this.fullscreen = false;
    }
  }

  public loadingMedia = true;
  private mediaId: number;
  public media: Media;
  public prevId: number = null;
  public nextId: number = null;
  public mediaSize = 'cover';

  private paramsSubscription;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public config: ConfigService,
    public filters: FiltersService
  ) {}

  ngOnInit(): void {
    this.fullscreenApiEnabled = this.checkFullscreen();

    this.paramsSubscription = this.route.params.subscribe(params => {
      this.mediaId = params.id;

      this.loadingMedia = true;

      let categoryId = this.filters.selectedCategory ? this.filters.selectedCategory.id : null;
      let order = this.filters.selectedOrder ? this.filters.selectedOrder.order : 'desc';
      let orderBy = this.filters.selectedOrder ? this.filters.selectedOrder.orderBy : 'date';
      let tags = this.filters.selectedTags ? this.filters.selectedTags.map(tag => tag.id) : null;

      this.api.getMedia(this.mediaId, categoryId, order, orderBy, tags).subscribe(response => {
        const media = response.data;
        const prevId = response.prevId;
        const nextId = response.nextId;

        this.preloadImage(media.filename).subscribe(() => {
          this.media = new Media(media);
          this.prevId = prevId;
          this.nextId = nextId;

          this.loadingMedia = false;
        });

      })
    })
  }

  public previousMedia() {
    if(this.prevId) {
      this.router.navigate(['/media/', this.prevId]);
    }
  }

  public nextMedia() {
    if(this.nextId) {
      this.router.navigate(['/media/', this.nextId]);
    }
  }

  /**
   * Change displayer image proportions
   * @param event
   */
  public toggleSize(event: MouseEvent) {
    event.preventDefault();

    this.mediaSize = this.mediaSize === 'cover' ? 'contain' : 'cover';
  }

  /**
   * Check if Fullscreen API is supported
   */
  private checkFullscreen() : boolean {
    const element = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if(element.requestFullscreen || element.mozRequestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen) {
      return true;
    }
    return false;
  }

  public startFullscreen(event: MouseEvent) : void {
    event.preventDefault();

    this._startFullscreen();
  }

  private _startFullscreen() : void {
    if(!this.fullscreen) {
      const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
        mozRequestFullScreen(): Promise<void>;
        webkitRequestFullscreen(): Promise<void>;
        msRequestFullscreen(): Promise<void>;
      };

      if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
        docElmWithBrowsersFullScreenFunctions.requestFullscreen();
      } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
        docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
      } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
      } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
        docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
      }
    }
  }

  public quitFullscreen(event: MouseEvent) : void {
    event.preventDefault();

    this._quitFullscreen();
  }

  private _quitFullscreen() : void {
    if(this.fullscreen) {
      const docWithBrowsersExitFunctions = document as Document & {
        mozCancelFullScreen(): Promise<void>;
        webkitExitFullscreen(): Promise<void>;
        msExitFullscreen(): Promise<void>;
      };
      if (docWithBrowsersExitFunctions.exitFullscreen) {
        docWithBrowsersExitFunctions.exitFullscreen();
      } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
        docWithBrowsersExitFunctions.mozCancelFullScreen();
      } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        docWithBrowsersExitFunctions.webkitExitFullscreen();
      } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
        docWithBrowsersExitFunctions.msExitFullscreen();
      }
    }
  }

  /**
   * Redirect direct to media
   * @param event
   */
  public download(event: MouseEvent) : void {
    event.preventDefault();

    const url = this.config.uploadURL + 'images/f/' + this.media.filename;

    window.open(url);
  }

  private preloadImage(image: String) : Observable<any> {
    return new Observable((observer: Observer<any>) => {
        let img = new Image();
        img.src = this.config.uploadURL + 'images/f/' + image;
        img.onload = () => {
          observer.next(img);
          observer.complete();
        }
      })
  }

  ngOnDestroy(): void {
    this._quitFullscreen();
    this.paramsSubscription.unsubscribe();
  }
}

