import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  public selectedOrder: {order: string; orderBy: string, name: string;};

  public selectedCategory: {id: number, value: string} = null;

  public selectedTags: [{id: number, value: string}] = null; // Can be more then one

  public page = 1;

  constructor() { }
}
