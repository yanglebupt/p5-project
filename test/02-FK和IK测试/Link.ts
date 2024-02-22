import { Ray } from "../../src/virtual-object/Ray";
import { Shape } from "../../src/interfaces";
import p5 from "p5";

/*
A 代表每节的属性接口
T 代表每节类型
*/

export default abstract class Link<
  A extends {},
  T extends Ray<A>
> extends Shape<A> {
  [Symbol.toStringTag] = "Link";
  public segments: T[] = [];
  public get position() {
    return this.segments[0].start;
  }
  public abstract addLink(segment: T): void;
  draw(p5: p5): boolean {
    this.segments.forEach((seg) => {
      seg.draw(p5);
    });
    return true;
  }
}
