## 内置形状

`Point、Line、Circle、Rect、Triangle、LineRay、ConeRay、FrustumRay`

## 自定义形状

### 接口

`IShape` 接口包含 `hidden` 字段和 `position` 属性以及 `draw` 方法

```typescript
export interface IShape {
  hidden: boolean;
  get position(): Vector;
  set position(value: Vector);
  draw(_p5: p5): boolean;
}
```

其中抽象类 `Shape` 默认实现了 `hidden=false` 和一个空 `draw` 方法

```typescript
export abstract class Shape<T extends {}> implements IShape {
  [Symbol.toStringTag] = "Shape";
  public hidden: boolean = false;
  draw(_p5: p5): void {}

  public abstract get position(): Vector;
  public attribute: T;
  constructor(defaultAttribute: T, attribute?: Partial<T>) {
    // .....
    this.attribute = Object.assign(
      JSON.parse(JSON.stringify(defaultAttribute)),
      attribute
    ) as T;
    // .....
  }
}
```

因此自定义形状直接继承抽象类 `Shape`，需要实现 `position` 属性，泛型 `T` 代表该形状的绘制属性，在构造函数中进行默认绘制属性和传入绘制属性的合并，默认绘制属性一般直接放在类的 `static` 变量上

另外最好加上 `[Symbol.toStringTag]=<class name>`

### 例子

下面的代码展示了一个自定义点形状

```typescript
// 形状属性
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
```