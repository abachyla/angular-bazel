import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot([], {
    enableTracing: true,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
