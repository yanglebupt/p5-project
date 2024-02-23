import p5, { Color, Vector } from "p5";
import { Sketch } from "./Sketch";

export type P5Color = number[] | string | Color;

export function findOrCreateElementById(id: string, parentDom: HTMLElement) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement("div");
    element.id = id;
    parentDom.appendChild(element);
  } else {
    parentDom.appendChild(element);
  }
  return element;
}

/**
 * 创建一个 p5 实例（一个 canvas）
 * @param sketchFunc p5 初始化方法
 * @param id 容器 id
 * @param parentId 父容器 id
 */
export function createP5instance(
  sketchFunc: (instance: p5) => Sketch,
  id: string = "app",
  cls: string = "relative",
  parentId: string = "root"
) {
  const rootElement = findOrCreateElementById(parentId, document.body);
  const element = findOrCreateElementById(id, rootElement);
  element.classList.add(cls);
  new p5(sketchFunc, element);
}

/**
interface Foo extends Mix, Mix2 {}
class Foo {}
applyMixins(Foo, [Mix, Mix2]); 
 */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

function VectorAbs(v: Vector): Vector {
  return new Vector(Math.abs(v.x), Math.abs(v.y));
}

function VectorMax(v: Vector, max: number | Vector): Vector {
  let xMax, yMax;
  if (max instanceof Vector) {
    (xMax = max.x), (yMax = max.y);
  } else {
    xMax = max;
    yMax = max;
  }
  return new Vector(Math.max(v.x, xMax), Math.max(v.y, yMax));
}

function VectorMin(v: Vector, min: number | Vector): Vector {
  let xMin, yMin;
  if (min instanceof Vector) {
    (xMin = min.x), (yMin = min.y);
  } else {
    xMin = min;
    yMin = min;
  }
  return new Vector(Math.min(v.x, xMin), Math.min(v.y, yMin));
}

Vector.prototype.abs = function () {
  const v: Vector = VectorAbs(this);
  this.x = v.x;
  this.y = v.y;
};

Vector.prototype.max = function (max: number | Vector) {
  const v: Vector = VectorMax(this, max);
  this.x = v.x;
  this.y = v.y;
};

Vector.prototype.min = function (min: number | Vector) {
  const v: Vector = VectorMin(this, min);
  this.x = v.x;
  this.y = v.y;
};

Vector.abs = VectorAbs;
Vector.max = VectorMax;
Vector.min = VectorMin;
