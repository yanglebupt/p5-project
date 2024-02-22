import p5, { Vector } from "p5";
import { DrawAdapter } from "./DrawAdapter";
import { IShape } from "../interfaces";
import { Point } from "../virtual-object/Point";
import { Line } from "../virtual-object/Line";
import { Circle } from "../virtual-object/Circle";
import { Triangle } from "../virtual-object/Triangle";
import { Rect } from "../virtual-object/Rect";
import { StrokeAndFillAttribute } from "./attribute-interface";
import { ConeRay } from "../virtual-object/ConeRay";
import { FrustumRay } from "../virtual-object/FrustumRay";

export default class P5Adapter implements DrawAdapter {
  constructor(public p5: p5) {}

  draw(shape: IShape) {
    return P5Adapter.draw(shape, this.p5);
  }

  public static draw(shape: IShape, p5: p5) {
    const type = Object.prototype.toString.call(shape).slice(8, -1);
    const drawFunc = Reflect.get(P5Adapter, `draw${type}`);
    if (drawFunc) {
      drawFunc(shape, p5);
      return true;
    } else {
      return false;
    }
  }

  public static setStrokeAndFill(attribute: StrokeAndFillAttribute, p5: p5) {
    const { fill, color, strokeColor, strokeWeight, stroke } = attribute;
    if (!fill) p5.noFill();
    else p5.fill(color as any);
    if (!stroke) p5.noStroke();
    else {
      p5.stroke(strokeColor as any);
      p5.strokeWeight(strokeWeight);
    }
  }

  public static drawPoint(shape: Point, p5: p5) {
    p5.push();
    const { color, size } = shape.attribute;
    p5.stroke(color as any);
    p5.strokeWeight(size);
    p5.point(shape.x, shape.y);
    p5.pop();
  }

  public static drawLine(shape: Line, p5: p5) {
    p5.push();
    const { color, size, cap } = shape.attribute;
    p5.stroke(color as any);
    p5.strokeCap(cap);
    p5.strokeWeight(size);
    p5.line(shape.p1.x, shape.p1.y, shape.p2.x, shape.p2.y);
    p5.pop();
  }

  public static drawCircle(shape: Circle, p5: p5) {
    p5.push();
    P5Adapter.setStrokeAndFill(shape.attribute, p5);
    p5.circle(shape.center.x, shape.center.y, shape.radius);
    p5.pop();
  }

  public static drawTriangle(shape: Triangle, p5: p5) {
    p5.push();
    P5Adapter.setStrokeAndFill(shape.attribute, p5);
    p5.beginShape(p5.TRIANGLES);
    p5.vertex(shape.p1.x, shape.p1.y);
    p5.vertex(shape.p2.x, shape.p2.y);
    p5.vertex(shape.p3.x, shape.p3.y);
    p5.endShape();
    p5.pop();
  }

  public static drawRect(shape: Rect, p5: p5) {
    p5.push();
    P5Adapter.setStrokeAndFill(shape.attribute, p5);
    p5.rect(shape.center.x, shape.center.y, shape.width, shape.height);
    p5.pop();
  }

  public static drawConeRay(shape: ConeRay, p5: p5) {
    p5.push();
    const norm: Vector = shape.dir.cross(new Vector(0, 0, 1)).normalize();
    const left = Vector.sub(shape.start, norm.copy().mult(shape.radius));
    const right = Vector.add(shape.start, norm.copy().mult(shape.radius));
    P5Adapter.setStrokeAndFill(shape.attribute.triangle, p5);
    p5.beginShape(p5.TRIANGLES);
    p5.vertex(left.x, left.y);
    p5.vertex(right.x, right.y);
    p5.vertex(shape.end.x, shape.end.y);
    p5.endShape();
    P5Adapter.setStrokeAndFill(shape.attribute.circle, p5);
    p5.circle(shape.start.x, shape.start.y, shape.radius);
    p5.pop();
  }

  public static drawFrustumRay(shape: FrustumRay, p5: p5) {
    p5.push();
    const norm: Vector = shape.dir.cross(new Vector(0, 0, 1)).normalize();
    const leftTop = Vector.sub(shape.end, norm.copy().mult(shape.topRadius));
    const rightTop = Vector.add(shape.end, norm.copy().mult(shape.topRadius));
    const leftBottom = Vector.sub(
      shape.start,
      norm.copy().mult(shape.bottomRadius)
    );
    const rightBottom = Vector.add(
      shape.start,
      norm.copy().mult(shape.bottomRadius)
    );
    P5Adapter.setStrokeAndFill(shape.attribute.triangle, p5);
    p5.quad(
      leftTop.x,
      leftTop.y,
      rightTop.x,
      rightTop.y,
      rightBottom.x,
      rightBottom.y,
      leftBottom.x,
      leftBottom.y
    );
    P5Adapter.setStrokeAndFill(shape.attribute.bottomCircle, p5);
    p5.circle(shape.start.x, shape.start.y, shape.bottomRadius);
    P5Adapter.setStrokeAndFill(shape.attribute.topCircle, p5);
    p5.circle(shape.end.x, shape.end.y, shape.topRadius);
    p5.pop();
  }
}
