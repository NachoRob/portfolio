import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { sanity } from '../src/data/sanity';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'NachoDev · Blog',
  projectId: sanity.projectId,
  dataset: sanity.dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: sanity.apiVersion }), codeInput()],
  schema: { types: schemaTypes },
});
