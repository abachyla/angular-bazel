import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

/**
  Main application routes module.
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
