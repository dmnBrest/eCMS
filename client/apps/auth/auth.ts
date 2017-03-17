import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AuthModule } from './auth.module';

import { SharedService } from './../../services/shared.service';

platformBrowserDynamic().bootstrapModule(
	AuthModule, 
	{ providers: [{provide: SharedService, useValue: (window as any).sharedService}] }
);
