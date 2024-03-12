## 介绍

这是一个模块化开发 `p5.js` 应用的库，内置多种图形实现以及测试图形学算法实现案例

/>>> <a href="https://yanglebupt.github.io/p5-project/">案例演示</a>

## 安装

```bash
npm i @ylbupt/p5-project
```

## 快速开始

```typescript
import { Circle, Sketch, createP5instance } from "@ylbupt/p5-project";
import { Vector } from "p5";

export class MainSketch extends Sketch {
  setup() {
    super.setup();
    this.createCanvas(300, 300);
    this.scene.add(new Circle(new Vector(100, 100), 20));
    console.log(this.width);
    this.frameRate(80);
  }
  draw() {
    this.clear();
    this.background(0);
    this.scene.draw();
  }
}

createP5instance((instance: p5) => new MainSketch(instance), "app");
```

## 更多文档

<a href="./docs/IShape.md">IShape</a>

## 主要 API

### createP5instance

该方法用于创建一个自定义 `p5` 实例和 `canvas` 元素，然后插入到指定 `id` 的 `div` 元素下，若父 `div` 元素不存在则会创建

```typescript
function createP5instance(
  sketchFunc: (instance: p5) => Sketch, 
  id?: string
): p5;
```

#### sketchFunc

注册函数接受一个 p5 instance 的参数，然后返回一个 <a href="#sketch">`Sketch`</a> 实例，我们将在 <a href="#sketch">`Sketch`</a> 类中完成 p5 instance 的生命周期函数的注册，原型链的迁移以及场景初始化

#### id

默认父 `div` 的 `id` 是 `#app`

#### 例子

```typescript
createP5instance(
  (instance: p5) => new MainSketch(instance), 
  "app"
);
```

### Sketch

为 p5 instance 注册全部生命周期函数，但继承自 `Sketch` 类时，必须实现 `draw`，最好继承重写 `setup`，其余生命周期函数可选

#### methods
```typescript
public preload() {}
public keyPressed() {}
public keyReleased() {}
public keyTyped() {}
public mouseMoved() {}
public mouseDragged() {}
public mousePressed() {}
public mouseReleased() {}
public mouseClicked() {}
public doubleClicked() {}
public mouseWheel(_evt: { delta: number }) {}
public touchStarted() {}
public touchMoved() {}
public touchEnded() {}
public setup() {}
public abstract draw(): void;
```

#### constructor

构造函数接受一个外部传入的 p5 instance 用于绘制

```typescript
constructor(protected p5: p5){}
```


#### p5

`Sketch` 类内部提供一个 p5 instance 用来绘制场景的对象，但该 `Sketch` 类上面已经代理了 `p5 instance` 的属性和方法，可以直接通过 `this` 绘制，而不需要 `this.p5` 来绘制

```typescript
protected p5: p5
```

#### scene

`Sketch` 类内部提供一个 <a href="#scene-1">`Scene`</a> 对象来记录并管理场景中全部对象，为了防止重复绘制，场景绘制前需要画布清空或者背景填充

```typescript
protected scene: Scene;
```

#### 例子

```typescript
export class MainSketch extends Sketch {
  setup() {
    super.setup();
    this.createCanvas(300, 300);
    this.background(125);
    this.scene.add();
  }
  draw() {
    this.clear();
    this.background(125);
    this.scene.draw();
  }
}
```

### Scene

用于管理场景中的对象

#### constructor

构造函数接受一个可选的 p5 instance 用于绘制，如果未传入，将采用全局绘制适配器 <a href="#instancedrawadapter">`InstanceDrawAdapter`</a> 进行绘制，默认是 <a href="#p5adapter">`P5Adapter`</a>

```typescript
constructor(protected p5?: p5){}
```

#### shapeList

场景中的形状 `Shape` 数组

```typescript  
public shapeList: IShape[] = []
```

#### add

向场景中添加一个形状并返回

```typescript
public add<T extends IShape>(shape: T): T
```

#### remove

在场景中移除形状并返回

```typescript
public remove<T extends IShape>(shape: T): T
```

#### clear

清空场景

```typescript
public clear<T extends IShape>(
  func?: (shape: T, index: number) => void
): T
```

#### traverse

遍历场景中所有形状

```typescript
public traverse<T extends IShape>(
  func: (shape: T, index: number) => void
): void
```

#### draw

绘制场景中所有形状，`useAdapter` 是否采用全局绘制适配器 `InstanceDrawAdapter` 进行绘制。默认 `true`，则优先采用全局适配器绘制，若无法绘制，则采用形状的 `draw` 方法绘制，若仍无法绘制，则报错

```typescript
public draw(
  useAdapter?: boolean
): void
```

### InstanceDrawAdapter

全局绘制适配器

#### UseAdapter

注册全局绘制适配器，绘制适配器必须实现接口 <a href="#drawadapter">`DrawAdapter`</a> 类

```typescript
public static UseAdapter<
  T extends DrawAdapter
>(
  drawAdapter: T
): void
```

### DrawAdapter

实现绘制适配器，必须在 draw 方法中实现对形状 `IShape` 的绘制

```typescript
export interface DrawAdapter {
  draw(shape: IShape): boolean;
}
```

### P5Adapter

使用 p5 instance 来绘制形状

```typescript
public static draw(
  shape: IShape, 
  p5: p5
): boolean
```

## 与前端组件框架结合开发

前端框架中，例如 Vue/React, 如果某个组件状态需要被 `Sketch` 类中读取或者修改，可以将该状态提升为全局状态，由第三方状态管理库例如 Pinia/Mobx，这样 `Sketch` 类既可以读取，也可以修改并触发前端组件更新