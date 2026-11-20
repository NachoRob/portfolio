import { defineCliConfig } from 'sanity/cli';
import { sanity } from '../src/data/sanity';

export default defineCliConfig({
  api: { projectId: sanity.projectId, dataset: sanity.dataset },
  deployment: { autoUpdates: true },
});
