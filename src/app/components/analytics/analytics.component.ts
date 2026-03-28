import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserProgress } from '../../models/question.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="analytics-container">
      <header class="header">
        <a routerLink="/" class="back-link">← Back to Home</a>
        <h1>Analytics Dashboard</h1>
      </header>
      
      <div class="dashboard" *ngIf="progress">
        <!-- Overall Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ progress.totalQuestions }}</div>
            <div class="stat-label">Total Questions</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ progress.correctAnswers }}</div>
            <div class="stat-label">Correct Answers</div>
          </div>
          <div class="stat-card highlight">
            <div class="stat-value">{{ progress.accuracy | number:'1.1-1' }}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
        </div>
        
        <!-- Progress Chart -->
        <div class="chart-section">
          <h2>Overall Progress</h2>
          <div class="progress-bar-chart">
            <div class="progress-fill" [style.width.%]="progress.accuracy"></div>
          </div>
          <div class="progress-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <!-- Category Scores -->
        <div class="category-section">
          <h2>Performance by Category</h2>
          <div class="category-grid">
            <div class="category-card" *ngFor="let cat of getCategoryArray()">
              <div class="category-name">{{ cat.name }}</div>
              <div class="category-score">{{ cat.score }}%</div>
              <div class="category-bar">
                <div class="category-fill" [style.width.%]="cat.score" [class.low]="cat.score < 60" [class.medium]="cat.score >= 60 && cat.score < 80" [class.high]="cat.score >= 80"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Weak Areas -->
        <div class="weak-areas-section">
          <h2>Areas for Improvement</h2>
          <div class="weak-areas-list">
            <div class="weak-area-card" *ngFor="let area of getWeakAreas()">
              <div class="area-name">{{ area.name }}</div>
              <div class="area-score">{{ area.score }}%</div>
              <div class="area-action">
                <button class="practice-btn" [routerLink]="['/practice']" [queryParams]="{topic: area.name}">Practice</button>
              </div>
            </div>
            <div class="no-weak-areas" *ngIf="getWeakAreas().length === 0">
              🎉 Great job! No weak areas identified.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      min-height: 100vh;
      padding: 2rem;
      background: #0f0f1a;
      color: #fff;
    }
    
    .header {
      margin-bottom: 2rem;
    }
    
    .back-link {
      color: #00d9ff;
      text-decoration: none;
      font-size: 0.9rem;
    }
    
    h1 {
      font-size: 2rem;
      margin-top: 0.5rem;
      background: linear-gradient(90deg, #00d9ff, #00ff88);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    h2 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #aaa;
    }
    
    .dashboard {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: #1a1a2e;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
    }
    
    .stat-card.highlight {
      background: linear-gradient(135deg, #1a1a2e, #2a2a4e);
      border: 1px solid #00d9ff;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #00d9ff;
    }
    
    .stat-label {
      color: #888;
      margin-top: 0.5rem;
    }
    
    .chart-section {
      background: #1a1a2e;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    .progress-bar-chart {
      height: 24px;
      background: #2a2a4e;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00d9ff, #00ff88);
      transition: width 0.5s ease;
    }
    
    .progress-labels {
      display: flex;
      justify-content: space-between;
      color: #666;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
    
    .category-section {
      background: #1a1a2e;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .category-card {
      background: #2a2a4e;
      padding: 1rem;
      border-radius: 8px;
    }
    
    .category-name {
      font-size: 0.9rem;
      color: #aaa;
    }
    
    .category-score {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }
    
    .category-bar {
      height: 6px;
      background: #1a1a2e;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .category-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }
    
    .category-fill.low { background: #ef4444; }
    .category-fill.medium { background: #f59e0b; }
    .category-fill.high { background: #22c55e; }
    
    .weak-areas-section {
      background: #1a1a2e;
      padding: 1.5rem;
      border-radius: 12px;
    }
    
    .weak-areas-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .weak-area-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2a2a4e;
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid #ef4444;
    }
    
    .area-name {
      font-weight: bold;
    }
    
    .area-score {
      color: #ef4444;
    }
    
    .practice-btn {
      background: #00d9ff;
      color: #1a1a2e;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s;
    }
    
    .practice-btn:hover {
      transform: scale(1.05);
    }
    
    .no-weak-areas {
      text-align: center;
      padding: 2rem;
      color: #22c55e;
      font-size: 1.1rem;
    }
  `]
})
export class Analytics implements OnInit {
  progress: UserProgress | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProgress().subscribe(progress => {
      this.progress = progress;
    });
  }

  getCategoryArray(): { name: string; score: number }[] {
    if (!this.progress?.categoryScores) return [];
    const scores = this.progress.categoryScores;
    return Object.entries(scores).map(([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      score: score as number
    }));
  }

  getWeakAreas(): { name: string; score: number }[] {
    if (!this.progress?.categoryScores) return [];
    const scores = this.progress.categoryScores;
    return Object.entries(scores)
      .filter(([_, score]) => (score as number) < 70)
      .map(([name, score]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        score: score as number
      }));
  }
}
