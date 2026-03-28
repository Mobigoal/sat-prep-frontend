import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { UserProgress } from '../../models/question.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="home">
      <section class="hero">
        <h1>Master the SAT</h1>
        <p>Practice with real questions, track your progress, and ace the exam.</p>
        <div class="hero-actions">
          <a routerLink="/practice" class="btn btn-primary">Start Practice</a>
          <a routerLink="/quiz" class="btn btn-secondary">Take Quiz</a>
        </div>
      </section>

      <section class="stats" *ngIf="progress">
        <div class="stat-card">
          <span class="stat-value">{{ progress.totalQuestions }}</span>
          <span class="stat-label">Questions</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ progress.accuracy | number:'1.0-0' }}%</span>
          <span class="stat-label">Accuracy</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ progress.categoryScores.math }}%</span>
          <span class="stat-label">Math</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ progress.categoryScores.reading }}%</span>
          <span class="stat-label">Reading</span>
        </div>
      </section>

      <section class="categories">
        <h2>Practice Categories</h2>
        <div class="category-grid">
          <a routerLink="/practice" [queryParams]="{category: 'math'}" class="category-card">
            <h3>📐 Math</h3>
            <p>Algebra, geometry, statistics</p>
          </a>
          <a routerLink="/practice" [queryParams]="{category: 'reading'}" class="category-card">
            <h3>📖 Reading</h3>
            <p>Comprehension & vocabulary</p>
          </a>
          <a routerLink="/practice" [queryParams]="{category: 'writing'}" class="category-card">
            <h3>✍️ Writing</h3>
            <p>Grammar & essay skills</p>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero {
      text-align: center;
      padding: 3rem 0;
    }
    .hero h1 {
      font-size: 2.5rem;
      color: #111827;
      margin-bottom: 1rem;
    }
    .hero p {
      font-size: 1.25rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
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
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .stat-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-align: center;
    }
    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #2563eb;
    }
    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .categories h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    .category-card {
      background: white;
      border: 1px solid #e5e7eb;
      padding: 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .category-card:hover {
      border-color: #2563eb;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .category-card h3 {
      color: #111827;
      margin-bottom: 0.5rem;
    }
    .category-card p {
      color: #6b7280;
      margin: 0;
    }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  progress: UserProgress | null = null;

  ngOnInit() {
    this.api.getProgress().subscribe(p => this.progress = p);
  }
}