import { Vector } from "p5";
import { Shape } from "../interfaces";
import { P5Color } from "../tools";

export interface PointAttribute {
  color: P5Color;
  size: number;
}

export class Point extends Shape<PointAttribute> {
  [Symbol.toStringTag] = "Point";

  public static defaultAttribute: PointAttribute = {
    color: "white",
    size: 10,
  };

  constructor(
    public x: number,
    public y: number,
    attribute?: Partial<PointAttribute>
  ) {
    super(Point.defaultAttribute, attribute);
  }

  public get position() {
    return new Vector(this.x, this.y);
  }
}
