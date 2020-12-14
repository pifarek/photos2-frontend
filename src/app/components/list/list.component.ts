import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Category } from "../../models/category.model";
import {ConfigService} from "../../services/config.service";
import {ApiService, MediaListResponse} from "../../services/api.service";
import {Media} from "../../models/media.model";
import {Observable, Observer} from "rxjs";
import {IndexComponent} from "../index/index.component";
import {FiltersService} from "../../services/filters.service";
import {ScrollService} from "../../services/scroll.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {

  @ViewChild('sectionMedia') section: ElementRef;
  @ViewChild('moreButton') moreButton: ElementRef;
  @ViewChild('filterBar') filterBar: ElementRef;

  public categories: {id: number, value: string}[] = [];
  public tags: {id: number, value: string}[] = [];
  public media: Media[];
  public total = 0;
  public visible = 0;
  public pages = 1;
  public loadingMedia = true;

  public order = [
    {order: '', orderBy: 'random', name: 'Random Order'},
    {order: 'desc', orderBy: 'date', name: 'Newest to oldest'},
    {order: 'asc', orderBy: 'date', name: 'Oldest to newest'},
    {order: '', orderBy: 'views', name: 'Most Viewed'}
  ];

  public colClasses: string[];

  constructor(
    private index: IndexComponent,
    private api: ApiService,
    public config: ConfigService,
    public filters: FiltersService,
    private scrollService: ScrollService
  ) {
    // Repeatable Bootstrap classes
    this.colClasses = [
      'col-12 col-sm-6 col-md-4 col-xl-5',
      'col-12 col-sm-6 col-md-4 col-xl-3',
      'col-12 col-sm-6 col-md-4 col-xl-4',
      'col-12 col-sm-6 col-md-4 col-xl-4',
      'col-12 col-sm-6 col-md-4 col-xl-5',
      'col-12 col-sm-6 col-md-4 col-xl-3'
    ];

    // Set the default order
    if(!this.filters.selectedOrder) {
      this.filters.selectedOrder = this.order[0];
    }

    // Set the default tags
    if(!this.filters.selectedTags) {
      this.filters.selectedTags = null;
    }

    // Get the categories
    this.getCategories().then(() => {
      // Set default category
      if(!this.filters.selectedCategory) {
        this.filters.selectedCategory = this.categories[0];
      }
      // Get default media
      this.getMedia();
    });

    // Get tags
    this.getTags();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Pass section to parent component
    this.index.elements.push({name: 'media', element: this.section});
  }

  /**
   * Get categories
   * @return Promise<void>
   */
  private getCategories() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.getCategories().subscribe(response => {
        let options: {id: number, value: string}[] = [];

        // Set the first (default) option
        options.push({id: 0, value: 'Display Everything'});

        // Add other categories/options
        response.forEach(category => {
          options.push({id: category.id, value: category.name});
        })

        this.categories = options;

        resolve();
      });
    });
  }

  /**
   * Get Tags
   */
  private getTags() {
    this.api.getTags().subscribe(response => {
      let options: {id: number, value: string}[] = [];

      // Add other tags/options
      response.forEach(tag => {
        options.push({id: tag.id, value: tag.name});
      })

      this.tags = options;
    });
  }

  /**
   * Get Media items from the server
   */
  private getMedia() : Promise<void> {

    return new Promise((resolve, reject) => {
      let page = this.filters.page || 1;
      let categoryId = this.filters.selectedCategory ? this.filters.selectedCategory.id : null;
      let order = this.filters.selectedOrder ? this.filters.selectedOrder.order : 'desc';
      let orderBy = this.filters.selectedOrder ? this.filters.selectedOrder.orderBy : 'date';
      let tags = this.filters.selectedTags ? this.filters.selectedTags.map(tag => tag.id) : null;

      this.loadingMedia = true;
      this.api.getMediaList(page, categoryId, order, orderBy, tags).subscribe((response: MediaListResponse) => {
        const media = response.data;

        // Check if we have any Media to preload
        if (media.length) {
          let imagesToPreload = [];
          media.forEach(media => {
            imagesToPreload.push(media.filename);
          });

          this.preloadImages(imagesToPreload).subscribe({complete: () => {
            this.loadingMedia = false;

            this.media = media;

            this.total = response.total;
            this.pages = response.pages;
            this.visible = this.media.length;
          }});
        } else {
          this.media = [];
          this.loadingMedia = false;
        }

        resolve();
      });
    });
  }

  /**
   * Change category
   * @param event
   */
  public onCategoryChange(category: {id: number, value: string}) : void {
    this.filters.page = 1;
    this.filters.selectedCategory = category;
    this.getMedia();
  }

  /**
   * Change order
   * @param order
   */
  public onOrderChange(order: {order: string; orderBy: string, name: string;}) {
    this.filters.page = 1;
    this.filters.selectedOrder = order;
    this.getMedia();
  }

  /**
   * Change tag
   * @param order
   */
  public onTagChange(tags: [{id: number; value: string}]) {
    this.filters.page = 1;
    this.filters.selectedTags = tags.length ? tags : null;
    this.getMedia();
  }

  /**
   * Reset existing filters
   */
  public resetFilters() : void {
    this.filters.page = 1;
    this.filters.selectedOrder = this.order[0];
    this.filters.selectedCategory = this.categories[0];
    this.filters.selectedTags = null;
    this.getMedia();
  }

  /**
   * Load additional Media
   */
  public loadMoreMedia() {
    this.filters.page = this.filters.page + 1;

    const scrollTo = this.filterBar.nativeElement.offsetTop;
    const scrollFrom = window.scrollY;
    //window.scrollTo(0, scrollTo);
    this.scrollService.animate(scrollFrom, scrollTo, 200);
    // Get Media Items starting from Last Displayed Item
    this.getMedia().then(() => {
      // Scroll first to the button to see what's loaded
      //setTimeout(() => {window.scrollTo(0, scrollTo)}, 100);
    });
  }

  /**
   * Return col class
   * @param index
   */
  public colClass(index: number) : string {
    const length = this.colClasses.length;
    let arrayIndex = index;

    if(index >= length) {
      const quotient = Math.floor(index / length);
      arrayIndex = index - (quotient * length);
    }

    return this.colClasses[arrayIndex];
  }

  /**
   * Preload images
   * @param images
   */
  private preloadImages(images: String[]) : Observable<any> {
    const imagesCount = images.length;
    let imagesLoaded = 0;

    return new Observable((observer: Observer<any>) => {
      images.forEach(image => {

        let img = new Image();
        img.src = this.config.uploadURL + 'images/m/' + image;
        img.onload = () => {
          observer.next(img);
          imagesLoaded++;

          if(imagesCount === imagesLoaded) {
            observer.complete();
          }
        }
      })
    });
  }
}
