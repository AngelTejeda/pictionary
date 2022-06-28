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

  public width: number = 800;
  public height: number = 800;

  private context: CanvasRenderingContext2D | null = null;

  private points: Array<IPoint | null> = [];

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === 'canvas') {
      this.write(e);
    }
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

    canvasElement.width = this.width;
    canvasElement.height = this.height;

    this.context!.lineWidth = 3;
    this.context!.lineCap = 'round';
    this.context!.strokeStyle = '#000';
  }

  private write(mouseEvent: MouseEvent): void {
    const canvasElement: HTMLCanvasElement = this.canvasRef.nativeElement;
    const elementRect = canvasElement.getBoundingClientRect();

    if (mouseEvent.buttons === 1) {
      const currentPoint: IPoint = {
        x: mouseEvent.clientX - elementRect.left,
        y: mouseEvent.clientY - elementRect.top
      };
  
      this.writeSingle(currentPoint);
    }
    else {
      this.writeSingle(null);
    }
  }

  private writeSingle(currentPoint: IPoint | null) {
    const prevPoint: IPoint | null = this.points.length > 0
      ? this.points[this.points.length - 1]
      : null;

    if (prevPoint !== null && currentPoint !== null)
      this.drawOnCanvas(prevPoint, currentPoint);

    this.points.push(currentPoint);
  }

  private drawOnCanvas(prevPoint: IPoint, currentPoint: IPoint) {
    if (!this.context)
      return;

    this.context.beginPath();

    if (prevPoint) {
      this.context.moveTo(prevPoint.x, prevPoint.y);
      this.context.lineTo(currentPoint.x, currentPoint.y);
      this.context.stroke();
    }
  }
}
