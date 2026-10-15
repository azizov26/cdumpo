import * as migration_20261015_132718_initial from './20261015_132718_initial';
import * as migration_20261015_193512_news_legacy_html from './20261015_193512_news_legacy_html';

export const migrations = [
  {
    up: migration_20261015_132718_initial.up,
    down: migration_20261015_132718_initial.down,
    name: '20261015_132718_initial',
  },
  {
    up: migration_20261015_193512_news_legacy_html.up,
    down: migration_20261015_193512_news_legacy_html.down,
    name: '20261015_193512_news_legacy_html'
  },
];
