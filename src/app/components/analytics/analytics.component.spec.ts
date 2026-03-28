import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Analytics } from './analytics.component';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { UserProgress } from '../../models/question.model';

describe('Analytics', () => {
  let component: Analytics;
  let fixture: ComponentFixture<Analytics>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockProgress: UserProgress = {
    totalQuestions: 150,
    correctAnswers: 112,
    accuracy: 74.67,
    categoryScores: { math: 75, reading: 78, writing: 70 }
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getProgress']);
    spy.getProgress.and.returnValue(of(mockProgress));

    await TestBed.configureTestingModule({
      imports: [Analytics],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load progress on init', () => {
    expect(apiService.getProgress).toHaveBeenCalled();
  });

  it('should display progress data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.stat-value')?.textContent).toContain('150');
  });

  it('should calculate weak areas correctly', () => {
    const weakAreas = component.getWeakAreas();
    expect(weakAreas.length).toBe(1);
    expect(weakAreas[0].name).toBe('Writing');
  });

  it('should return empty weak areas when all scores >= 70', () => {
    component.progress = {
      totalQuestions: 100,
      correctAnswers: 80,
      accuracy: 80,
      categoryScores: { math: 80, reading: 85, writing: 75 }
    };
    const weakAreas = component.getWeakAreas();
    expect(weakAreas.length).toBe(0);
  });

  it('should convert category scores to array', () => {
    const categories = component.getCategoryArray();
    expect(categories.length).toBe(3);
    expect(categories.find(c => c.name === 'Math')?.score).toBe(75);
  });
});
