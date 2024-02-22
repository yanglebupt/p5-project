import { Vector } from "p5";
import { AreaRange, Shape } from "../interfaces";
import { StrokeAndFillAttribute } from "../adapters/attribute-interface";

export class Rect extends Shape<StrokeAndFillAttribute> implements AreaRange {
  [Symbol.toStringTag] = "Rect";
  private static defaultAttribute: StrokeAndFillAttribute = {
    color: "white",
    stroke: false,
    fill: true,
    strokeWeight: 0,
    strokeColor: "white",
  };

  constructor(
    public center: Vector,
    public width: number,
    public height: number,
    attribute?: Partial<StrokeAndFillAttribute>
  ) {
    super(Rect.defaultAttribute, attribute);
  }

  public get position() {
    return this.center;
  }

  public set position(value: Vector) {
    this.center = value;
  }

  getBounds() {
    return {
      left: this.center.x - this.width / 2,
      right: this.center.x + this.width / 2,
      top: this.center.y - this.height / 2,
      bottom: this.center.y + this.height / 2,
    };
  }

  public intersect(range: Rect) {
    const {
      left: o_left,
      right: o_right,
      top: o_top,
      bottom: o_bottom,
    } = range.getBounds();
    const {
      left: t_left,
      right: t_right,
      top: t_top,
      bottom: t_bottom,
    } = this.getBounds();
    return !(
      o_right <= t_left ||
      o_left >= t_right ||
      o_top >= t_bottom ||
      o_bottom <= t_top
    );
  }

  contains(position: Vector): boolean {
    const bounds = this.getBounds();
    return (
      bounds.left <= position.x &&
      position.x < bounds.right &&
      bounds.top <= position.y &&
      position.y < bounds.bottom
    );
  }
}
