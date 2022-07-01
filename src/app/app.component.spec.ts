import {TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  const createComponent = () => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [BrowserAnimationsModule, RouterTestingModule],
    });
    TestBed.compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    return {component};
  };

  it('should be created', () => {
    const {component} = createComponent();

    expect(component).toBeTruthy();
  });
});
