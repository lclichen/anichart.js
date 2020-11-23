import { DefaultFontOptions } from "./../options/font-options";
import { merge } from "lodash-es";
import Ani from "../base/ani";
import { FontOptions } from "../options/font-options";
import Position from "../utils/position";
import { Component } from "./component";
export abstract class Base implements Component {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;
  protected cAlpha: number;
  protected cPos: Position;

  constructor(options: any) {
    this.reset(options);
  }
  font: FontOptions;
  ctx: CanvasRenderingContext2D;

  reset(options: any = {}): void {
    if (options) merge(this, options);
  }

  saveCtx(): void {
    this.ani.ctx.save();
  }
  preRender(n: number) {
    if (this.pos == undefined) this.pos = { x: 0, y: 0 };
    this.cAlpha =
      this.alpha instanceof Function
        ? this.alpha(n / this.ani.fps)
        : this.alpha;
    this.cPos = this.getValue(this.pos, n);
    this.ani.ctx.globalAlpha = this.cAlpha;
    this.ani.ctx.translate(this.cPos.x, this.cPos.y);
  }

  abstract render(n: number): void;

  restoreCtx(): void {
    this.ani.ctx.restore();
  }

  draw(n: number) {
    try {
      this.saveCtx();
      this.preRender(n);
      this.render(n);
      this.restoreCtx();
    } catch (e) {
      console.error(e);
      this.ani.play();
    }
  }

  protected getValue(obj: any, n: number): any {
    return obj instanceof Function ? obj(n) : obj;
  }
}
