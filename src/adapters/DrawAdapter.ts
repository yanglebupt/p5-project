import { IShape } from "../interfaces";

export interface DrawAdapter {
  draw(shape: IShape): boolean;
}

export class InstanceDrawAdapter {
  public static drawAdapter: DrawAdapter | null = null;
  public static UseAdapter(drawAdapter: DrawAdapter) {
    InstanceDrawAdapter.drawAdapter = drawAdapter;
  }
}
