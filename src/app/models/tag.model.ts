export class Tag {
  public id: number;
  public name: string;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.name = tag.name;
  }
}
