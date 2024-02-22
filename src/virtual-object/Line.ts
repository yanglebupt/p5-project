import { STROKE_CAP, Vector } from "p5";
import { Shape } from "../interfaces";
import { P5Color } from "../tools";

export interface LineAttribute {
  color: P5Color;
  size: number;
  cap: STROKE_CAP;
}

export class Line extends Shape<LineAttribute> {
  [Symbol.toStringTag] = "Line";
  public static defaultAttribute: LineAttribute = {
    color: "white",
    size: 10,
    cap: "round",
  };

  constructor(
    public p1: Vector,
    public p2: Vector,
    attribute?: Partial<LineAttribute>
  ) {
    super(Line.defaultAttribute, attribute);
  }

  public get position(): Vector {
    return Vector.add(this.p1, this.p2).mult(0.5);
  }
}
