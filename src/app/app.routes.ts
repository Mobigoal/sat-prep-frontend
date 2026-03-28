import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PracticeComponent } from './components/practice/practice.component';
import { QuizComponent } from './components/quiz/quiz.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'practice', component: PracticeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '**', redirectTo: '' }
];