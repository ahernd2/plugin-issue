import { Tree, updateJson } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';

/**
 * This generator will add a cypress or playwright tag to the e2e project if the project has a cypress or playwright config file.
 *
 * Usage
 *
 *    pnpm exec nx workspace-generator e2e-project-tags
 *
 * @param tree
 * @param schema
 */
export default async function (tree: Tree) {
  const e2eProjects = tree
    .children('projects')
    .filter((project) => project.endsWith('-e2e'));

  return e2eProjects.forEach((projectName) => {
    updateJson(tree, `projects/${projectName}/project.json`, (json) => {
      if (json.tags.includes('cypress') || json.tags.includes('playwright')) {
        return json;
      }

      if (
        fs.existsSync(
          path.join(tree.root, 'projects', projectName, 'cypress.config.ts')
        )
      ) {
        json.tags.push('cypress');
      }

      if (
        fs.existsSync(
          path.join(tree.root, 'projects', projectName, 'playwright.config.ts')
        )
      ) {
        json.tags.push('playwright');
      }

      return json;
    });
  });
}
