import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="header">
      <div class="logo">
        <a routerLink="/">SAT Prep</a>
      </div>
      <nav class="nav">
        <a routerLink="/" class="nav-link">Home</a>
        <a routerLink="/practice" class="nav-link">Practice</a>
        <a routerLink="/quiz" class="nav-link">Quiz</a>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563eb;
      text-decoration: none;
    }
    .nav {
      display: flex;
      gap: 1.5rem;
    }
    .nav-link {
      color: #374151;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-link:hover {
      color: #2563eb;
    }
  `]
})
export class HeaderComponent {}