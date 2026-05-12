import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-wizbot-profile',
  templateUrl: './wizbot-profile.component.html',
  styleUrls: ['./wizbot-profile.component.scss'],
})
export class WizbotProfileComponent implements AfterViewInit {
  static _count = 0;
  uid = 'wb-' + WizbotProfileComponent._count++;

  @Input() scaleValue: string = '';
  @Input() ex2: string = '';
  @Input() width: number = 100;
  @Input() height: number = 100;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const svg: SVGElement = this.el.nativeElement.querySelector('svg');
    if (!svg) return;
    const uid = this.uid;

    svg.querySelectorAll('defs [id]').forEach(elem => {
      const oldId = elem.id;
      const newId = `${oldId}-${uid}`;
      elem.id = newId;

      svg.querySelectorAll(`[fill="url(#${oldId})"]`).forEach(el => {
        el.setAttribute('fill', `url(#${newId})`);
      });

      svg.querySelectorAll(`[clip-path="url(#${oldId})"]`).forEach(el => {
        el.setAttribute('clip-path', `url(#${newId})`);
      });

      svg.querySelectorAll('linearGradient').forEach(grad => {
        if (grad.getAttribute('xlink:href') === `#${oldId}`) {
          grad.setAttribute('xlink:href', `#${newId}`);
        }
      });
    });
  }
}
