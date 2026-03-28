import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home.component';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { UserProgress } from '../../models/question.model';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
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
      imports: [Home],
      providers: [{ provide: ApiService, useValue: spy }]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(Home);
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
});