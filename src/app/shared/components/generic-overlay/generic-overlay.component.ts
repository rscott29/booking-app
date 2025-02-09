import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComponentType } from '@angular/cdk/portal';


@Component({
    selector: 'app-generic-overlay',
    imports: [NgScrollbarModule, MatButtonModule, MatIconModule],
    templateUrl: './generic-overlay.component.html',
    styleUrl: './generic-overlay.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericOverlayComponent implements OnInit {
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef,
    static: true,
  })
  dynamicComponentContainer: ViewContainerRef | undefined;
  @Input() componentType: ComponentType<any> | undefined;
  @Input() data = { showTitle: false, title: '' }

  constructor() {}

  ngOnInit(): void {
    if (this.componentType) {
      const componentRef = this.dynamicComponentContainer?.createComponent(
        this.componentType
      );
      if (this.data) {
        Object.assign(componentRef?.instance, this.data);
      }
    }
  }
}
