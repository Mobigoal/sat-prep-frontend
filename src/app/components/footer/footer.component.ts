import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p>&copy; 2026 MobiGoal SAT Prep. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 1.5rem;
      text-align: center;
      background: #f9fafb;
      color: #6b7280;
      font-size: 0.875rem;
    }
  `]
})
export class FooterComponent {}