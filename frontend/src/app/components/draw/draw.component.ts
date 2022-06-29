import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

interface IPoint {
  x: number,
  y: number
}

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  public width: number = 450;
  public height: number = 450;

  private context: CanvasRenderingContext2D | null = null;

  private points: Array<IPoint | null> = [];

  private isDrawing: boolean = false;

  @HostListener('mousemove', ['$event'])
  private onMouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      const currentPoint = this.getCurrentPoint(e);
      const prevPoint: IPoint | null = this.points.length > 0
        ? this.points[this.points.length - 1]
        : null;

      if (prevPoint !== null)
        this.drawLine(prevPoint, currentPoint);

      this.points.push(currentPoint);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  private onMouseDown(e: MouseEvent) {
    this.isDrawing = true;

    const currentPoint = this.getCurrentPoint(e);
    this.drawPoint(currentPoint);

    this.points.push(currentPoint);
  }

  @HostListener('document:mouseup', ['$event'])
  private onMouseUp(e: MouseEvent) {
    this.isDrawing = false;

    this.points.push(null);
  }

  constructor() {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.render();
  }

  private render(): void {
    const canvasElement: HTMLCanvasElement = this.canvasRef.nativeElement;

    this.context = canvasElement.getContext("2d");

    if (!this.context)  return;

    canvasElement.width = this.width;
    canvasElement.height = this.height;

    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
  }

  private getCurrentPoint(mouseEvent: MouseEvent): IPoint {
    const canvasElement: HTMLCanvasElement = this.canvasRef.nativeElement;
    const elementRect = canvasElement.getBoundingClientRect();

    const currentPoint: IPoint = {
      x: mouseEvent.clientX - elementRect.left,
      y: mouseEvent.clientY - elementRect.top
    };

    return currentPoint;
  }

  private drawPoint(point: IPoint) {
    this.context?.fillRect(point.x, point.y, 3, 3);
  }

  private drawLine(prevPoint: IPoint, currentPoint: IPoint) {
    if (!this.context)  return;

    this.context.beginPath();

    if (prevPoint) {
      this.context.moveTo(prevPoint.x, prevPoint.y);
      this.context.lineTo(currentPoint.x, currentPoint.y);
      this.context.stroke();
    }
  }

  public clearCanvas() {
    this.points = [];
    this.context?.clearRect(0, 0, this.width, this.height);
  }
}
