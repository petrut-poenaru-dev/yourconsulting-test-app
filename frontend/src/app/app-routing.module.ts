import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersoaneComponent } from './components/persoane/persoane.component';
import { MasiniComponent } from './components/masini/masini.component';

const routes: Routes = [
  { path: '', redirectTo: 'persoane', pathMatch: 'full' },
  { path: 'persoane', component: PersoaneComponent },
  { path: 'masini', component: MasiniComponent },
  { path: '**', redirectTo: 'persoane' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
