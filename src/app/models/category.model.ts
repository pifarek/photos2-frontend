export class Category {
  id: number;
  name: string;
  description: string;
  parent?: Category;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;

    if(category.parent) {
      this.parent = new Category(category.parent);
    }
  }
}
