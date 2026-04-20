import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Tab metadata for the projects section (optional i18n key for the title).
 */
export interface ProjectTab {
  id: string;
  title: string;
  titleKey?: string;
}

/**
 * Projects section with selectable tabs and detail panels.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  activeProjectId = 'Da Bubble';

  projects: ProjectTab[] = [
    { id: 'Da Bubble', title: 'Da Bubble' },
    { id: 'El Pollo Loco', title: 'El Pollo Loco' },
    { id: 'Join', title: 'Join' },
    { id: 'Ongoing Project', title: 'Ongoing Project', titleKey: 'projects.tabs.ongoing' },
  ];

  /**
   * Sets which project tab is active.
   * @param id - Project tab id
   */
  setActiveProject(id: string): void {
    this.activeProjectId = id;
  }
}
