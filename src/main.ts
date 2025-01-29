import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom([
			ServiceWorkerModule.register('ngsw-worker.js', {
				enabled: !isDevMode(),
				// Register the ServiceWorker as soon as the application is stable
				// or after 30 seconds (whichever comes first).
				registrationStrategy: 'registerWhenStable:30000',
			}),
		]),
	],
}).catch((err) => console.error(err));
