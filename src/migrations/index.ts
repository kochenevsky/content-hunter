import * as migration_20260212_151842 from './20260212_151842';
import * as migration_20260212_163612 from './20260212_163612';
import * as migration_20260213_114137 from './20260213_114137';
import * as migration_20260213_114656 from './20260213_114656';

export const migrations = [
  {
    up: migration_20260212_151842.up,
    down: migration_20260212_151842.down,
    name: '20260212_151842',
  },
  {
    up: migration_20260212_163612.up,
    down: migration_20260212_163612.down,
    name: '20260212_163612',
  },
  {
    up: migration_20260213_114137.up,
    down: migration_20260213_114137.down,
    name: '20260213_114137',
  },
  {
    up: migration_20260213_114656.up,
    down: migration_20260213_114656.down,
    name: '20260213_114656'
  },
];
