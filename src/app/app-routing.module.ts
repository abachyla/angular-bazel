import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

/**
  Main application module.
 */
@NgModule({
  imports: [
    RouterModule.forRoot([], {
      enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
