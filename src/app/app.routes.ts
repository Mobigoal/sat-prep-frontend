import { Routes } from '@angular/router';
import { Home } from './components/home/home.component';
import { Practice } from './components/practice/practice.component';
import { Quiz } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'practice', component: Practice },
  { path: 'quiz', component: Quiz },
  { path: '**', redirectTo: '' }
];