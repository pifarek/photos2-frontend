import {Category} from "./category.model";
import {Tag} from "./tag.model";

export class Media {
  public id: number;
  public filename: number;
  public name: string;
  public description: string;
  public category: Category;
  public takenAt: string;
  public tags: Tag[];

  constructor(media: Media) {
    this.id = media.id;
    this.filename = media.filename;
    this.name = media.name;
    this.description = media.description;
    this.category = new Category(media.category);
    this.takenAt = media.takenAt;

    let tags = [];
    media.tags.forEach(tag => {
      const tagObj = new Tag(tag);
      tags.push(tagObj);
    });
    this.tags = tags;
  }

  public extractCategories(category: Category) : string[] {
    let categories = [];
    categories.push(category.name);

    if(category.parent) {
      categories = categories.concat(this.extractCategories(category.parent));
    }

    return categories;
  }
}
