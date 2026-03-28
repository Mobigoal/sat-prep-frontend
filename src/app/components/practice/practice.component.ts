import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="practice">
      <div class="practice-header">
        <a routerLink="/" class="back-link">← Back to Home</a>
        <span class="category-tag">{{ currentQuestion?.category | titlecase }}</span>
      </div>

      <div class="question-container" *ngIf="currentQuestion && !showResult">
        <div class="progress-bar">
          <div class="progress" [style.width.%]="(currentIndex + 1) / questions.length * 100"></div>
        </div>
        
        <div class="question-number">Question {{ currentIndex + 1 }} of {{ questions.length }}</div>
        
        <h2 class="question-text">{{ currentQuestion.text }}</h2>
        
        <div class="options">
          <button 
            *ngFor="let option of currentQuestion.options; let i = index"
            class="option-btn"
            [class.selected]="selectedAnswer === i"
            (click)="selectAnswer(i)"
          >
            <span class="option-letter">{{ getOptionLetter(i) }}</span>
            {{ option }}
          </button>
        </div>

        <button 
          class="submit-btn" 
          [disabled]="selectedAnswer === null"
          (click)="submitAnswer()"
        >
          Check Answer
        </button>
      </div>

      <div class="result-container" *ngIf="showResult">
        <div class="result-card" [class.correct]="isCorrect" [class.incorrect]="!isCorrect">
          <h3>{{ isCorrect ? '✓ Correct!' : '✗ Incorrect' }}</h3>
          <p class="explanation">{{ feedbackExplanation }}</p>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" (click)="nextQuestion()" *ngIf="hasMoreQuestions">
            Next Question
          </button>
          <a routerLink="/" class="btn btn-secondary" *ngIf="!hasMoreQuestions">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .practice {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .practice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .back-link {
      color: #6b7280;
      text-decoration: none;
    }
    .back-link:hover { color: #2563eb; }
    .category-tag {
      background: #e0e7ff;
      color: #3730a3;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .progress-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin-bottom: 1.5rem;
    }
    .progress {
      height: 100%;
      background: #2563eb;
      border-radius: 2px;
      transition: width 0.3s;
    }
    .question-number {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    .question-text {
      font-size: 1.25rem;
      color: #111827;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .option-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
      font-size: 1rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-btn:hover {
      border-color: #2563eb;
      background: #f0f5ff;
    }
    .option-btn.selected {
      border-color: #2563eb;
      background: #e0e7ff;
    }
    .option-letter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    .option-btn.selected .option-letter {
      background: #2563eb;
      color: white;
    }
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .submit-btn:hover:not(:disabled) { background: #1d4ed8; }
    .submit-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    .result-card {
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .result-card.correct {
      background: #ecfdf5;
      border: 1px solid #10b981;
    }
    .result-card.incorrect {
      background: #fef2f2;
      border: 1px solid #ef4444;
    }
    .result-card h3 {
      margin-bottom: 0.5rem;
    }
    .correct h3 { color: #059669; }
    .incorrect h3 { color: #dc2626; }
    .result-actions {
      display: flex;
      gap: 1rem;
    }
    .btn {
      flex: 1;
      padding: 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }
    .btn-secondary:hover { background: #e5e7eb; }
  `]
})
export class Practice implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  
  questions: Question[] = [];
  currentIndex = 0;
  currentQuestion: Question | null = null;
  selectedAnswer: number | null = null;
  showResult = false;
  isCorrect = false;
  feedbackExplanation = '';
  hasMoreQuestions = false;

  ngOnInit() {
    const category = this.route.snapshot.queryParams['category'];
    this.api.getQuestions(category, 10).subscribe(q => {
      this.questions = q;
      this.currentQuestion = q[0];
      this.hasMoreQuestions = q.length > 1;
    });
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  selectAnswer(index: number) {
    this.selectedAnswer = index;
  }

  submitAnswer() {
    if (this.selectedAnswer === null || !this.currentQuestion) return;
    
    this.api.submitAnswer(this.currentQuestion.id, this.selectedAnswer).subscribe(result => {
      this.isCorrect = result.correct;
      this.feedbackExplanation = result.explanation;
      this.showResult = true;
    });
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentIndex];
      this.hasMoreQuestions = this.currentIndex < this.questions.length - 1;
    }
    this.selectedAnswer = null;
    this.showResult = false;
  }
}