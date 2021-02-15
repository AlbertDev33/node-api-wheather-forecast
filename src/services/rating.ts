import { BeachPosition } from '@src/models/beach';

export class Rating {
  public getRatingBasedOnWindAndWavePositions(
    wavePosition: BeachPosition,
    windPosition: BeachPosition,
  ): number {
    if (wavePosition === windPosition) {
      return 1;
    }
    return 3;
  }
}
