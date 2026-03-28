import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="quiz">
      <div class="quiz-header">
        <div class="progress-info">
          <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
        </div>
        <div class="timer" [class.warning]="timeLeft < 60">
          ⏱ {{ formatTime(timeLeft) }}
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress" [style.width.%]="(currentIndex + 1) / questions.length * 100"></div>
      </div>

      <div class="question-container" *ngIf="currentQuestion">
        <span class="category-tag">{{ currentQuestion.category | titlecase }}</span>
        <span class="difficulty-tag" [class]="currentQuestion.difficulty">
          {{ currentQuestion.difficulty | titlecase }}
        </span>
        
        <h2 class="question-text">{{ currentQuestion.text }}</h2>
        
        <div class="options">
          <button 
            *ngFor="let option of currentQuestion.options; let i = index"
            class="option-btn"
            [class.selected]="answers[currentQuestion.id] === i"
            (click)="selectAnswer(i)"
          >
            <span class="option-letter">{{ getOptionLetter(i) }}</span>
            {{ option }}
          </button>
        </div>
      </div>

      <div class="quiz-nav">
        <button 
          class="btn btn-secondary" 
          [disabled]="currentIndex === 0"
          (click)="prevQuestion()"
        >
          Previous
        </button>
        <button 
          class="btn btn-primary" 
          *ngIf="currentIndex < questions.length - 1"
          (click)="nextQuestion()"
        >
          Next
        </button>
        <button 
          class="btn btn-finish" 
          *ngIf="currentIndex === questions.length - 1"
          (click)="finishQuiz()"
        >
          Finish Quiz
        </button>
      </div>

      <div class="question-dots">
        <button 
          *ngFor="let q of questions; let i = index"
          class="dot"
          [class answered]="answers[q.id] !== undefined"
          [class.current]="i === currentIndex"
          (click)="goToQuestion(i)"
        >
          {{ i + 1 }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .quiz {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .timer {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }
    .timer.warning {
      color: #dc2626;
    }
    .progress-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin-bottom: 2rem;
    }
    .progress {
      height: 100%;
      background: #2563eb;
      border-radius: 2px;
      transition: width 0.3s;
    }
    .category-tag, .difficulty-tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      margin-right: 0.5rem;
      margin-bottom: 1rem;
    }
    .category-tag {
      background: #e0e7ff;
      color: #3730a3;
    }
    .difficulty-tag.easy { background: #d1fae5; color: #065f46; }
    .difficulty-tag.medium { background: #fef3c7; color: #92400e; }
    .difficulty-tag.hard { background: #fee2e2; color: #991b1b; }
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
    .quiz-nav {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .btn {
      flex: 1;
      padding: 1rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-primary { background: #2563eb; color: white; }
    .btn-secondary { background: #f3f4f6; color: #374151; }
    .btn-finish { background: #10b981; color: white; }
    .question-dots {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }
    .dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      background: white;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .dot.answered { background: #10b981; color: white; border-color: #10b981; }
    .dot.current { border-color: #2563eb; }
  `]
})
export class QuizComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  
  questions: Question[] = [];
  currentIndex = 0;
  currentQuestion: Question | null = null;
  answers: { [key: number]: number } = {};
  timeLeft = 900; // 15 minutes
  private timerInterval: any;

  ngOnInit() {
    this.api.getQuestions(undefined, 10).subscribe(q => {
      this.questions = q;
      this.currentQuestion = q[0];
      this.startTimer();
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.finishQuiz();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  selectAnswer(index: number) {
    if (this.currentQuestion) {
      this.answers[this.currentQuestion.id] = index;
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentQuestion = this.questions[this.currentIndex];
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.currentQuestion = this.questions[this.currentIndex];
    }
  }

  goToQuestion(index: number) {
    this.currentIndex = index;
    this.currentQuestion = this.questions[index];
  }

  finishQuiz() {
    clearInterval(this.timerInterval);
    
    // Calculate score
    let correct = 0;
    this.questions.forEach(q => {
      if (this.answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    // Navigate to results (simplified - would go to a results page)
    alert(`Quiz complete! Score: ${correct}/${this.questions.length}`);
    this.router.navigate(['/']);
  }
}