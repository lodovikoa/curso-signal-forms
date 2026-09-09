import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {

  protected menuItems = signal(this.createMenuItems());

  private createMenuItems() {
    return routes.map((route) => {
      route.path

      return {
        label: this.createMenuItemLabel(route.path!),
        route: route.path
      }
    })
  }

  private createMenuItemLabel(route: string) {
    return route
      .split('-')
      .map((word) =>  word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
