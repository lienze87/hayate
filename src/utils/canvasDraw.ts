export function initCanvasDraw(myCanvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Set Background Color
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

  // Mouse Event Handlers

  let isDown = false;
  let canvasX;
  let canvasY;

  const mouseDraw = {
    mousedown(evt: MouseEvent) {
      isDown = true;
      ctx.beginPath();
      const scrollTop = window.scrollY;
      canvasX = evt.pageX - myCanvas.getBoundingClientRect().left;
      canvasY = evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop;
      ctx.moveTo(canvasX, canvasY);
    },
    mousemove(evt: MouseEvent) {
      if (isDown !== false) {
        const scrollTop = window.scrollY;
        canvasX = evt.pageX - myCanvas.getBoundingClientRect().left;
        canvasY = evt.pageY - myCanvas.getBoundingClientRect().top - scrollTop;
        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
      }
    },
    mouseup(evt: MouseEvent) {
      isDown = false;
      ctx.closePath();
    },
    mouseleave(evt: MouseEvent) {
      isDown = false;
      ctx.closePath();
    },
  };

  // Mouse Events
  myCanvas.addEventListener('mousedown', mouseDraw.mousedown, false);
  myCanvas.addEventListener('mouseup', mouseDraw.mouseup, false);
  myCanvas.addEventListener('mousemove', mouseDraw.mousemove, false);
  myCanvas.addEventListener('mouseleave', mouseDraw.mouseleave, false);

  // Touch Events Handlers
  const touchDraw = {
    started: false,
    start(evt: TouchEvent) {
      ctx.beginPath();
      const scrollTop = window.scrollY;
      canvasX = evt.touches[0].pageX - myCanvas.getBoundingClientRect().left;
      canvasY = evt.touches[0].pageY - myCanvas.getBoundingClientRect().top - scrollTop;

      ctx.moveTo(canvasX, canvasY);
      this.started = true;
    },
    move(evt: TouchEvent) {
      evt.preventDefault();

      if (this.started) {
        const scrollTop = window.scrollY;
        canvasX = evt.touches[0].pageX - myCanvas.getBoundingClientRect().left;
        canvasY = evt.touches[0].pageY - myCanvas.getBoundingClientRect().top - scrollTop;

        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
      }
    },
    end(evt: TouchEvent) {
      this.started = false;
    },
  };

  // Touch Events
  myCanvas.addEventListener('touchstart', touchDraw.start, false);
  myCanvas.addEventListener('touchend', touchDraw.end, false);
  myCanvas.addEventListener('touchmove', touchDraw.move, false);

  // Disable Page Move
  document.body.addEventListener(
    'touchmove',
    (evt) => {
      evt.stopPropagation();
    },
    false,
  );
}
