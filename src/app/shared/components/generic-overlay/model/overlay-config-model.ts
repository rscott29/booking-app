import { PositionConfig } from "./position-strategy-model";
import { ScrollStrategy } from "./scroll-strategy-model";

export interface OverlayConfigModel {
    position?:PositionConfig;
    hasBackdrop?: boolean;
    backdropClass?: string;
    scrollStrategy?: ScrollStrategy;
    backdropClickClose?: boolean;
    width?: string
  }
  