import { AfterViewInit, Component,
         ElementRef, EventEmitter,
         HostListener, OnInit,
         Output, ViewChild } from '@angular/core';
import { IPoint } from 'src/app/models/point';
import { IRoomPoints } from 'src/app/models/room-points';
import { INewPoint } from 'src/app/models/socket-new-point';
import { DrawService } from 'src/app/services/draw.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() loadedEvent: EventEmitter<void> = new EventEmitter();

  public width: number = 450;
  public height: number = 450;

  private context!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;

  // The client only stores the last point each user drew in order to draw
  // the line between the last point and the current point, but the complete
  // list of points is stored server-side in order to replicate the drawing
  // when a new user joins the room.
  private previousPoints: { [userId: string]: IPoint | null } = {};

  public socketId!: string;

  // Event Listeners
  @HostListener('mousemove', ['$event'])
  private onMouseMove(e: MouseEvent) {
    if (this.isDrawing) {
      const currentPoint = this.getCurrentPoint(e);
      this.addPoint(this.socketId, currentPoint, true);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  private onMouseDown(e: MouseEvent) {
    this.isDrawing = true;

    const currentPoint = this.getCurrentPoint(e);
    this.addPoint(this.socketId, currentPoint, true);
  }

  @HostListener('document:mouseup', ['$event'])
  private onMouseUp(e: MouseEvent) {
    this.isDrawing = false;

    this.addPoint(this.socketId, null, true);
  }

  constructor(
    private drawService: DrawService
  ) {
  }

  ngOnInit(): void {
    this.drawService.listenNewPoint().subscribe({
      next: (newPoint: INewPoint) => {
        this.addPoint(newPoint.userId, newPoint.point);
      }
    });

    this.drawService.listenClearCanvas().subscribe({
      next: () => { this.clearCanvas(false); }
    });
  }

  ngAfterViewInit(): void {
    this.render();
    this.loadedEvent.emit();
  }

  private render(): void {
    const canvasElement: HTMLCanvasElement = this.canvasRef.nativeElement;

    this.context = canvasElement.getContext("2d") as CanvasRenderingContext2D;

    if (!this.context)  return;

    canvasElement.width = this.width;
    canvasElement.height = this.height;

    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
  }

  public loadPoints(points: IRoomPoints) {
    for (const [userId, userPoints] of Object.entries(points)) {
      for (const point of userPoints) {
        this.addPoint(userId, point);
      }
    }
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

  private addPoint(userId: string, newPoint: IPoint | null, emit: boolean = false) {
    const prevPoint: IPoint | null = this.previousPoints[userId];

    if (newPoint !== null) {
      if (prevPoint === null) {
        this.drawPoint(newPoint);
      }
      if (prevPoint !== null)
        this.drawLine(prevPoint, newPoint);
    }

    this.previousPoints[userId] = newPoint;

    if (emit)
      this.drawService.emitNewPoint(newPoint);
  }

  private drawPoint(point: IPoint) {
    this.context!.fillRect(point.x, point.y, 3, 3);
  }

  private drawLine(prevPoint: IPoint, currentPoint: IPoint) {
    this.context.beginPath();

    this.context.moveTo(prevPoint.x, prevPoint.y);
    this.context.lineTo(currentPoint.x, currentPoint.y);
    this.context.stroke();
  }

  public clearCanvas(emit: boolean = false) {
    this.previousPoints = {};
    this.context?.clearRect(0, 0, this.width, this.height);

    if (emit) {
      this.drawService.emitClearCanvas();
    }
  }
}
