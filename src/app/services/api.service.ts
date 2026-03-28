import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Question, UserProgress } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.satprep.mobigoal.com';

  // Mock data for development
  private mockQuestions: Question[] = [
    {
      id: 1,
      text: 'If 3x + 7 = 22, what is the value of x?',
      options: ['3', '5', '7', '15'],
      correctAnswer: 1,
      explanation: '3x + 7 = 22 → 3x = 15 → x = 5',
      category: 'math',
      difficulty: 'easy'
    },
    {
      id: 2,
      text: 'What is the square root of 144?',
      options: ['10', '11', '12', '14'],
      correctAnswer: 2,
      explanation: '√144 = 12 because 12² = 144',
      category: 'math',
      difficulty: 'easy'
    },
    {
      id: 3,
      text: 'Which word is a synonym of "ephemeral"?',
      options: ['Permanent', 'Transient', 'Solid', 'Eternal'],
      correctAnswer: 1,
      explanation: 'Ephemeral means lasting for a very short time, similar to transient.',
      category: 'reading',
      difficulty: 'medium'
    },
    {
      id: 4,
      text: 'Identify the correct sentence:',
      options: [
        'Their going to the store.',
        'They\'re going to the store.',
        'There going to the store.',
        'Theyre going to the store.'
      ],
      correctAnswer: 1,
      explanation: '"They\'re" is the contraction of "they are".',
      category: 'writing',
      difficulty: 'easy'
    },
    {
      id: 5,
      text: 'Solve: 2² + 3³ = ?',
      options: ['13', '31', '35', '41'],
      correctAnswer: 1,
      explanation: '2² = 4, 3³ = 27, 4 + 27 = 31',
      category: 'math',
      difficulty: 'medium'
    }
  ];

  getQuestions(category?: string, limit = 10): Observable<Question[]> {
    // In production, this would call the real API:
    // return this.http.get<Question[]>(`${this.baseUrl}/questions`, { params: { category, limit: limit.toString() } });
    
    // For development, return mock data
    let questions = this.mockQuestions;
    if (category) {
      questions = questions.filter(q => q.category === category);
    }
    return of(questions.slice(0, limit)).pipe(delay(300));
  }

  submitAnswer(questionId: number, answer: number): Observable<{ correct: boolean; explanation: string }> {
    // In production: return this.http.post<{ correct: boolean; explanation: string }>(`${this.baseUrl}/answers`, { questionId, answer });
    
    const question = this.mockQuestions.find(q => q.id === questionId);
    const isCorrect = question ? question.correctAnswer === answer : false;
    return of({ correct: isCorrect, explanation: question?.explanation || '' }).pipe(delay(200));
  }

  getProgress(): Observable<UserProgress> {
    // In production: return this.http.get<UserProgress>(`${this.baseUrl}/progress`);
    
    const progress: UserProgress = {
      totalQuestions: 150,
      correctAnswers: 112,
      accuracy: 74.67,
      categoryScores: { math: 75, reading: 78, writing: 70 }
    };
    return of(progress).pipe(delay(200));
  }
}