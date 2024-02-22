import { Vector } from "p5";
import { AreaRange, Shape } from "../interfaces";
import { StrokeAndFillAttribute } from "../adapters/attribute-interface";
import { Rect } from "./Rect";

export class Circle extends Shape<StrokeAndFillAttribute> implements AreaRange {
  [Symbol.toStringTag] = "Circle";
  public static defaultAttribute: StrokeAndFillAttribute = {
    color: "white",
    stroke: false,
    fill: true,
    strokeWeight: 0,
    strokeColor: "white",
  };

  constructor(
    public center: Vector,
    public radius: number,
    attribute?: Partial<StrokeAndFillAttribute>
  ) {
    super(Circle.defaultAttribute, attribute);
  }

  public get position() {
    return this.center;
  }

  public set position(value: Vector) {
    this.center = value;
  }

  intersect(boundingBox: Rect) {
    const c = boundingBox.center;
    const h = new Vector(boundingBox.width / 2, boundingBox.height / 2);
    const p = this.center;
    //////////////////////////////////
    const v = Vector.abs(Vector.sub(p, c));
    const u = Vector.max(Vector.sub(v, h), 0);
    return Vector.dot(u, u) <= this.radius * this.radius;
  }

  contains(position: Vector): boolean {
    return Vector.sub(position, this.center).mag() <= this.radius;
  }
}
