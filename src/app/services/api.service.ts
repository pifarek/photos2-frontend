import { Injectable } from '@angular/core';
import {ConfigService} from "./config.service";
import {Observable, Observer, Subscription} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {Media} from "../models/media.model";
import {Category} from "../models/category.model";
import {Tag} from "../models/tag.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private config: ConfigService, private http: HttpClient) { }

  /**
   * Get the categories
   * @return Observable
   */
  public getCategories() : Observable<any>
  {
    return this.http.get(this.config.apiUrl + 'categories/list').pipe(
      map((response: Category[]) => {
        return response.map(category => {
          return new Category(category);
        })
      }));
  }

  /**
   * Get the tags
   * @return Observable
   */
  public getTags() : Observable<any>
  {
    return this.http.get(this.config.apiUrl + 'tags/list').pipe(
      map((response: Tag[]) => {
        return response.map(tag => {
          return new Tag(tag);
        })
      }));
  }

  /**
   * Get Media items
   * @param page
   * @param categoryId
   * @param order
   * @param orderBy
   * @param tags
   */
  public getMediaList(page?: number, categoryId?: number, order?: string, orderBy?: string, tags?: number[]) : Observable<any> {

    page = page ? page : 1;

    let queryParams = new HttpParams();

    if(page) {
      queryParams = queryParams.append('page', page.toString());
    }

    if(categoryId) {
      queryParams = queryParams.append('category_id', categoryId.toString());
    }

    if(order) {
      queryParams = queryParams.append('order', order);
    }

    if(orderBy) {
      queryParams = queryParams.append('order_by', orderBy);
    }

    if(tags) {
        queryParams = queryParams.append('tags', tags.join(','));
    }

    // but why 'queryParams' is returning a new object every time? :o

    return this.http.get<MediaListResponse>(this.config.apiUrl + 'media/list', {params: queryParams}).pipe(
      map((response: MediaListResponse) => {
        // Convert to Media Object Array
        response.data = response.data.map(media => {
          return new Media(media);
        });

        return response;
      })
    );
  }

  public getMedia(mediaId: number, categoryId?: number, order?: string, orderBy?: string, tags?: number[]) : Observable<any> {

    let queryParams = new HttpParams();

    if(categoryId) {
      queryParams = queryParams.append('category_id', categoryId.toString());
    }

    if(order) {
      queryParams = queryParams.append('order', order);
    }

    if(orderBy) {
      queryParams = queryParams.append('order_by', orderBy);
    }

    if(tags) {
      queryParams = queryParams.append('tags', tags.join(','));
    }

    return this.http.get<MediaResponse>(this.config.apiUrl + 'media/get/' + mediaId, {params: queryParams}).pipe(
      map((response: MediaResponse) => {
        let newResponse: {data: Media, nextId: number, prevId: number} = {data: null, nextId: null, prevId: null};
        // Convert to Media Object
        newResponse.data = new Media(response.data);
        newResponse.nextId = response.next_id;
        newResponse.prevId = response.prev_id;
        return newResponse;
      })
    );
  }

  /**
   * Send message
   * @param name
   * @param email
   * @param message
   */
  public postMessage(name: string, email: string, message: string) : Observable<any> {
    const body = {
      name: name,
      email: email,
      message: message
    }
    return this.http.post(this.config.apiUrl + 'mail/send', body);
  }
}

export interface MediaListResponse {
  data: Media[];
  total: number;
  pages: number;
  page: number;
}

export interface MediaResponse {
  data: Media;
  prev_id: number;
  next_id: number;
}
