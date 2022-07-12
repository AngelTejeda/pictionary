import { AfterViewInit, Component,
         ElementRef, EventEmitter,
         HostListener, OnInit,
         Output, ViewChild } from '@angular/core';
import { IColor } from 'src/app/models/color';
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

  public colors: IColor[] = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Grey', hex: '#c3c3c3' },
    { name: 'Dark Grey', hex: '#585858' },
    { name: 'Black', hex: '#000000' },
    { name: 'Dark Red', hex: '#88001b' },
    { name: 'Red', hex: '#ec1c24' },
    { name: 'Orange', hex: '#ff7f27' },
    { name: 'Gold', hex: '#ffca18' },
    { name: 'Light Yellow', hex: '#fdeca6' },
    { name: 'Yellow', hex: '#fff200' },
    { name: 'Lime', hex: '#c4ff0e' },
    { name: 'Green', hex: '#0ed145' },
    { name: 'Aqua', hex: '#8cfffb' },
    { name: 'Turquoise', hex: '#00a8f3' },
    { name: 'Indigo', hex: '#3f48cc' },
    { name: 'Purple', hex: '#b83dba' },
    { name: 'Rose', hex: '#ffaec8' },
    { name: 'Brown', hex: '#b97a56' },
  ]

  public selectedColor: IColor = this.colors[3];
  public pencilSize: number = 3;

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

    this.context.lineWidth = this.pencilSize;
    this.context.lineCap = 'round';
    this.context.strokeStyle = this.selectedColor.hex;
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
      y: mouseEvent.clientY - elementRect.top,
      hexColor: this.selectedColor.hex,
      pencilSize: this.pencilSize
    };

    return currentPoint;
  }

  private addPoint(userId: string, newPoint: IPoint | null, emit: boolean = false) {
    const prevPoint: IPoint | null = this.previousPoints[userId];

    if (newPoint != null) {
      if (prevPoint == null)
        this.drawPoint(newPoint);
      else
        this.drawLine(prevPoint, newPoint);
    }

    this.previousPoints[userId] = newPoint;

    if (emit)
      this.drawService.emitNewPoint(newPoint);
  }

  private drawPoint(point: IPoint) {
    this.context.fillStyle = point.hexColor;
    this.context.fillRect(point.x, point.y, point.pencilSize, point.pencilSize);
  }

  private drawLine(prevPoint: IPoint, currentPoint: IPoint) {
    this.context.strokeStyle = currentPoint.hexColor;
    this.context.lineWidth = currentPoint.pencilSize;
    this.context.beginPath();

    this.context.moveTo(prevPoint.x, prevPoint.y);
    this.context.lineTo(currentPoint.x, currentPoint.y);
    this.context.stroke();
  }

  public clearCanvas(emit: boolean = false) {
    this.previousPoints = {};
    this.context.clearRect(0, 0, this.width, this.height);

    if (emit) {
      this.drawService.emitClearCanvas();
    }
  }

  public changeColor(color: IColor): void {
    this.selectedColor = color;
  }

  public grow(): void {
    this.pencilSize++;
    this.context.lineWidth = this.pencilSize;
  }

  public shrink(): void {
    this.pencilSize--;
    this.context.lineWidth = this.pencilSize;
  }
}
