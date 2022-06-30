import {TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';

describe('AppComponent', function () {
    function createComponent() {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [BrowserAnimationsModule],
        });
        TestBed.compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        const component = fixture.componentInstance;

        return {component};
    }

    it('should be created', function () {
        const { component } = createComponent();

        expect(component).toBeTruthy();
    });
});