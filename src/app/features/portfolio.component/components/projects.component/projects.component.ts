import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})

export class ProjectsComponent {
  activeProjectId = 'Da Bubble';

  projects = [
    { id: 'Da Bubble', title: 'Da Bubble' },
    { id: 'El Pollo Loco', title: 'El Pollo Loco' },
    { id: 'Join', title: 'Join' },
    { id: 'Ongoing Project', title: 'Ongoing Project' },
  ];

  setActiveProject(id: string) {
    this.activeProjectId = id;
  }
}

