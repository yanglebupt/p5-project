import { Vector } from "p5";
import { Shape } from "../interfaces";
import { StrokeAndFillAttribute } from "../adapters/attribute-interface";

export class Triangle extends Shape<StrokeAndFillAttribute> {
  [Symbol.toStringTag] = "Triangle";
  private static defaultAttribute: StrokeAndFillAttribute = {
    color: "white",
    stroke: false,
    fill: true,
    strokeWeight: 0,
    strokeColor: "white",
  };

  constructor(
    public p1: Vector,
    public p2: Vector,
    public p3: Vector,
    attribute?: Partial<StrokeAndFillAttribute>
  ) {
    super(Triangle.defaultAttribute, attribute);
  }

  public get position() {
    return Vector.add(Vector.add(this.p1, this.p2), this.p3).mult(1 / 3);
  }
}
