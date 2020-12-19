import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewsModule } from './views/views.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './views/navigation/header/header.component';
import { FooterComponent } from './views/navigation/footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ViewsModule,
        SharedModule,
        MaterialModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
