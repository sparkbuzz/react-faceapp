const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillRect(x - 1, y - 1, 2, 2);
}

export { drawDot };
