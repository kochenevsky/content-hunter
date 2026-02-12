import * as migration_20260212_151842 from './20260212_151842';
import * as migration_20260212_163612 from './20260212_163612';

export const migrations = [
  {
    up: migration_20260212_151842.up,
    down: migration_20260212_151842.down,
    name: '20260212_151842',
  },
  {
    up: migration_20260212_163612.up,
    down: migration_20260212_163612.down,
    name: '20260212_163612'
  },
];
