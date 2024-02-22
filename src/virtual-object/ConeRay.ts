import { Vector } from "p5";
import { Ray } from "./Ray";
import { StrokeAndFillAttribute } from "../adapters/attribute-interface";

export interface ConeRayAttribute {
  triangle: StrokeAndFillAttribute;
  circle: StrokeAndFillAttribute;
}

export class ConeRay extends Ray<ConeRayAttribute> {
  [Symbol.toStringTag] = "ConeRay";

  static defaultAttribute: ConeRayAttribute = {
    triangle: {
      color: "red",
      stroke: false,
      fill: true,
      strokeWeight: 0,
      strokeColor: "red",
    },
    circle: {
      color: "yellow",
      stroke: false,
      fill: true,
      strokeWeight: 0,
      strokeColor: "red",
    },
  };

  public radius: number;
  constructor(
    start: Vector,
    dirOrAngle: Vector | number,
    len: number,
    radius: number,
    attribute?: Partial<ConeRayAttribute>,
    defaultAttribute?: Partial<ConeRayAttribute>
  ) {
    super(
      start,
      dirOrAngle,
      len,
      attribute,
      defaultAttribute ?? ConeRay.defaultAttribute
    );
    this.radius = radius;
  }
}
