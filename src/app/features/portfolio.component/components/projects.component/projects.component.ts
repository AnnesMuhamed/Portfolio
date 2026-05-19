import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

export interface ProjectTab {
  id: string;
  title: string;
  titleKey?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  activeProjectId = 'El Pollo Loco';

  projects: ProjectTab[] = [
    { id: 'El Pollo Loco', title: 'El Pollo Loco' },
    { id: 'Join', title: 'Join' },
  ];

  /**
   * Sets the currently active project tab.
   * @param id Project tab id.
   */
  setActiveProject(id: string): void {
    this.activeProjectId = id;
  }
}
