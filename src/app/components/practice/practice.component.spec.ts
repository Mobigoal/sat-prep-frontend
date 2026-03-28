import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Practice } from './practice.component';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { Question } from '../../models/question.model';
import { ActivatedRoute } from '@angular/router';

describe('Practice', () => {
  let component: Practice;
  let fixture: ComponentFixture<Practice>;
  let apiService: jasmine.SpyObj<ApiService>;

  const mockQuestions: Question[] = [
    {
      id: 1,
      text: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      explanation: 'Explanation',
      category: 'math',
      difficulty: 'easy'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getQuestions', 'submitAnswer']);
    spy.getQuestions.and.returnValue(of(mockQuestions));
    spy.submitAnswer.and.returnValue(of({ correct: true, explanation: 'Correct!' }));

    const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { queryParams: {} } });

    await TestBed.configureTestingModule({
      imports: [Practice],
      providers: [
        { provide: ApiService, useValue: spy },
        { provide: ActivatedRoute, useValue: routeSpy }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture = TestBed.createComponent(Practice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load questions', () => {
    expect(apiService.getQuestions).toHaveBeenCalled();
  });

  it('should display question text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.question-text')?.textContent).toContain('Test question?');
  });

  it('should select answer', () => {
    component.selectAnswer(0);
    expect(component.selectedAnswer).toBe(0);
  });
});