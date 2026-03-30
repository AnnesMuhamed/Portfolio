import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

/** `title` immer setzen (Strict Templates); `titleKey` optional für übersetzten Tab-Titel. */
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
  activeProjectId = 'Da Bubble';

  projects: ProjectTab[] = [
    { id: 'Da Bubble', title: 'Da Bubble' },
    { id: 'El Pollo Loco', title: 'El Pollo Loco' },
    { id: 'Join', title: 'Join' },
    { id: 'Ongoing Project', title: 'Ongoing Project', titleKey: 'projects.tabs.ongoing' },
  ];

  setActiveProject(id: string) {
    this.activeProjectId = id;
  }
}
