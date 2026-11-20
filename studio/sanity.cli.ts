import { defineCliConfig } from 'sanity/cli';
import { sanity } from '../src/data/sanity';

export default defineCliConfig({
  api: { projectId: sanity.projectId, dataset: sanity.dataset },
  // El Studio publicado queda en https://nachodev.sanity.studio
  studioHost: 'nachodev',
  deployment: { autoUpdates: true, appId: 'mwm8t2no4qu35i5tz0wjf507' },
});
