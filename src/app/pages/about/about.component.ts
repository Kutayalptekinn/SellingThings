import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ensure CommonModule is imported

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  svgPath = 'src/assets/idea.svg';

  // SVG div'inin stilini dinamik olarak ayarlamak için bir nesne oluşturun
 svgStyle = {
    'background-image': `url(${this.svgPath})`,
    'background-size': 'cover',
    'background-position': 'center',
    'background-repeat': 'no-repeat'
  };
}
