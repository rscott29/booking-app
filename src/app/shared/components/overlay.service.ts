import {
  Injectable,
  NgZone,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ComponentType, GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { OverlayConfigModel } from './generic-overlay/model/overlay-config-model';
import { PositionConfig } from './generic-overlay/model/position-strategy-model';
import { ScrollStrategy } from './generic-overlay/model/scroll-strategy-model';
import { Subscription } from 'rxjs';
import { GenericOverlayComponent } from './generic-overlay/generic-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private overlayRef: OverlayRef | undefined | null;
  private backdropClickSubscription: Subscription | undefined | null;

  constructor(private overlay: Overlay,private ngZone: NgZone) {}

  open<T>(
    componentOrTemplate: ComponentType<T> | TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    data?: any,
    config?: OverlayConfigModel 
  ): OverlayRef {
    const defaultConfig: OverlayConfigModel = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: 'block',
      position: { centerHorizontally: true, centerVertically: true },
      backdropClickClose: true,
      width: 'auto',
      showTitle: true
    };
  
    const finalConfig = { ...defaultConfig, ...config };
  
    const positionStrategy = this.createPositionStrategy(finalConfig.position);
  
    const overlayConfig: OverlayConfig = {
      hasBackdrop: finalConfig.hasBackdrop,
      backdropClass: finalConfig.backdropClass,
      scrollStrategy: this.getScrollStrategy(finalConfig.scrollStrategy),
      positionStrategy: positionStrategy,
      disposeOnNavigation: true,
    };
  
    this.overlayRef = this.overlay.create(overlayConfig);

  
    if (componentOrTemplate instanceof TemplateRef) {
      const templatePortal = new TemplatePortal(
        componentOrTemplate,
        viewContainerRef,
        { $implicit: data }
      );
      this.overlayRef.attach(templatePortal);
    } else {
      const componentPortal = new ComponentPortal(GenericOverlayComponent);
      const componentRef = this.overlayRef.attach(componentPortal);
  
      if (componentRef.instance) {
        const componentInstance = componentRef.instance as GenericOverlayComponent;
        componentInstance.componentType = componentOrTemplate;
        componentInstance.data = { ...data, showTitle: finalConfig.showTitle }; 
    }
  }
  
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        if (this.overlayRef && finalConfig.width) {
          
          this.overlayRef.overlayElement.style.width = finalConfig.width;
        }
      });
    });
  
    if (finalConfig.backdropClickClose && this.overlayRef) {
      this.overlayRef.backdropClick().subscribe(() => this.close());
    }
   
  
    return this.overlayRef;
  }
  
  

  private getScrollStrategy(scrollStrategy: ScrollStrategy | undefined) {
    switch (scrollStrategy) {
      case 'block':
        return this.overlay.scrollStrategies.block();
      case 'reposition':
        return this.overlay.scrollStrategies.reposition();
      case 'close':
        return this.overlay.scrollStrategies.close();
      case 'noop':
        return this.overlay.scrollStrategies.noop();
      default:
        return this.overlay.scrollStrategies.noop();
    }
  }

  private createPositionStrategy(positionConfig?: PositionConfig): GlobalPositionStrategy {
    let positionStrategy = this.overlay.position().global();
    if (positionConfig) {
      const positionMethods: { [key: string]: (value?: string) => GlobalPositionStrategy } = {
        top: positionStrategy.top.bind(positionStrategy),
        bottom: positionStrategy.bottom.bind(positionStrategy),
        left: positionStrategy.left.bind(positionStrategy),
        right: positionStrategy.right.bind(positionStrategy),
        centerHorizontally: positionStrategy.centerHorizontally.bind(positionStrategy),
        centerVertically: positionStrategy.centerVertically.bind(positionStrategy)
      };
      for (const [key, value] of Object.entries(positionConfig)) {
        if (positionMethods[key]) {
          positionMethods[key](value);
        }
      }
    }
    return positionStrategy;
  }

  close(): void {
    if (this.backdropClickSubscription) {
      this.backdropClickSubscription.unsubscribe();
      this.backdropClickSubscription = null;
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
