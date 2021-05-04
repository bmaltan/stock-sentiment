import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private isDark = false;

    private renderer!: Renderer2

    constructor(
        rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: string
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        if (!isPlatformServer(this.platformId)) {
            this.isDark = window.localStorage.getItem('isDark') === 'true';
            this.setTheme();
        }
    }

    isThemeDark() {
        return this.isDark;
    }

    setTheme() {
        if (this.isDark) {
            this.renderer.addClass(document.body, 'dark-theme');
        } else {
            this.renderer.removeClass(document.body, 'dark-theme');
        }
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        this.setTheme();

        if (!isPlatformServer(this.platformId)) {
            window.localStorage.setItem('isDark', this.isDark.toString());
        }
    }
}
