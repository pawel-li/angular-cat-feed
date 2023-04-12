import { catchError, takeUntil } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';
import { filter, firstValueFrom, fromEvent, map, pairwise, Subject, throttleTime } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

const SCROLL_THRESHOLD = 240;
export type FactData = { data: string[] }

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  @ViewChild('scroller') public scroller!: CdkVirtualScrollViewport;
  public items: string[] = [];
  private destroy$ = new Subject();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  async ngOnInit(): Promise<void> { await this.fetchMore(20); }

  ngAfterViewInit(): void {
    if (!this.scroller) return;
    fromEvent(this.scroller.elementRef.nativeElement, 'scroll')
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < SCROLL_THRESHOLD),
        throttleTime(200),
        takeUntil(this.destroy$)
      ).subscribe(async () => await this.fetchMore(10));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private async fetchMore(nuberOfFacts: number): Promise<void> {
    const newItems: string[] = [];
    for (let i = 0; i < nuberOfFacts; i++) {
      const newFact = await this.getFact();
      if (newFact && !this.items.includes(newFact)) newItems.push(newFact);
    }
    this.items = [...this.items, ...newItems];
  }

  private async getFact(): Promise<string> {
    const request$ = this.http.get<FactData>('https://meowfacts.herokuapp.com/').pipe(
      map((data) => data.data[0] || ''),
      catchError(err => {
        this.notificationService.error(err.message)
        return ''
      }),
    )
    return await firstValueFrom(request$);
  }
}
