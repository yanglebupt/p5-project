import p5, { Vector } from "p5";
import {
  AreaRange,
  IShape,
  Rect,
  StrokeAndFillAttribute,
  P5Adapter,
} from "@ylbupt/p5-project";

/* 
  可以定制化 bound，不一定非是 rect 也可以是 circle
*/
// 动态场景如何更新 四叉树
export class Quadtree<T extends IShape> extends Rect {
  [Symbol.toStringTag] = "Quadtree";
  public objects: T[] = [];
  public isSplit: boolean = false;
  public children: Quadtree<T>[] | null = null; // 左下角，顺时针
  constructor(
    public center: Vector,
    public width: number,
    public height: number,
    private _attribute: StrokeAndFillAttribute = {
      color: "white",
      stroke: true,
      fill: false,
      strokeWeight: 1,
      strokeColor: "black",
    },
    private _maxCapacity: number = 5,
    private _showBounds: boolean = true
  ) {
    super(center, width, height, _attribute);
  }

  public get maxCapacity() {
    return this._maxCapacity;
  }
  public set maxCapacity(value: number) {
    this._maxCapacity = value;
    this.children?.forEach((c) => (c.maxCapacity = value));
  }

  public get showBounds() {
    return this._showBounds;
  }
  public set showBounds(value: boolean) {
    this._showBounds = value;
    this.children?.forEach((c) => (c.showBounds = value));
  }

  public clear() {
    this.children?.forEach((c) => c.clear());
    this.clearObject();
    this.clearChildren();
    this.isSplit = false;
  }

  public clearObject() {
    for (let i = 0; i < this.objects.length; i++) {
      //@ts-ignore
      this.objects[i] = null;
    }
    this.objects = [];
  }

  public clearChildren() {
    if (this.children) {
      for (let i = 0; i < this.children.length; i++) {
        //@ts-ignore
        this.children[i] = null;
      }
      this.children = null;
    }
  }

  public add(obj: T) {
    if (!this.contains(obj.position)) return;
    if (this.isFull()) {
      if (!this.isSplit) {
        this.split();
      }
      this.children!.forEach((c) => c.add(obj));
    } else {
      this.objects.push(obj);
    }
  }

  public query(range: AreaRange): T[] {
    if (!range.intersect(this)) return [];
    else {
      const funds: T[] = this.objects.filter((o) => range.contains(o.position));
      return this.isSplit
        ? (this.children?.reduce(
            (pre, c) => pre.concat(c.query(range)),
            funds
          ) as T[])
        : funds;
    }
  }

  // bound 的方法
  public split() {
    this.children = [];
    this.children.push(
      new Quadtree(
        new Vector(
          this.center.x - this.width / 4,
          this.center.y + this.height / 4
        ),
        this.width / 2,
        this.height / 2,
        this._attribute,
        this._maxCapacity,
        this._showBounds
      )
    );
    this.children.push(
      new Quadtree(
        new Vector(
          this.center.x - this.width / 4,
          this.center.y - this.height / 4
        ),
        this.width / 2,
        this.height / 2,
        this._attribute,
        this._maxCapacity,
        this._showBounds
      )
    );
    this.children.push(
      new Quadtree(
        new Vector(
          this.center.x + this.width / 4,
          this.center.y - this.height / 4
        ),
        this.width / 2,
        this.height / 2,
        this._attribute,
        this._maxCapacity,
        this._showBounds
      )
    );
    this.children.push(
      new Quadtree(
        new Vector(
          this.center.x + this.width / 4,
          this.center.y + this.height / 4
        ),
        this.width / 2,
        this.height / 2,
        this._attribute,
        this._maxCapacity,
        this._showBounds
      )
    );
    this.isSplit = true;
  }

  public isFull() {
    return this.objects.length >= this._maxCapacity;
  }

  draw(p5: p5): boolean {
    if (this._showBounds) {
      P5Adapter.drawRect(this, p5);
      this.children?.forEach((r) => r.draw(p5));
    }
    this.objects.forEach((o) => {
      P5Adapter.draw(o, p5);
    });
    return true;
  }
}
