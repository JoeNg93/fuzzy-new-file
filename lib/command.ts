import fs from 'fs';
import path from 'path';

import yargs from 'yargs';
import globby from 'globby';
import inquirer from 'inquirer';
import FuzzySearch from 'fuzzy-search';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

interface CommandOptions {
  root?: string;
  noIgnoreVcs: boolean;
}

export const setupCommand = () => {
  return {
    command: '$0',
    description: 'Create file/folder with fuzzy-file matching autocomplete.',
    builder: {
      root: {
        description:
          'Root folder where autocomplete will list its subdirectories. Default is current working directory',
      },
      'no-ignore-vcs': {
        description:
          "Show search results from files and directories that would otherwise be ignored by '.gitignore' files",
        default: false,
      },
    },
    handler: async (args: yargs.Arguments<CommandOptions>) => {
      const { root, noIgnoreVcs } = args;

      let subDirs = globby.sync('**', {
        cwd: root ?? process.cwd(),
        onlyDirectories: true,
        gitignore: !noIgnoreVcs,
      });

      subDirs = ['/'].concat(subDirs.map((d) => '/' + d)); // Add current directory as one possible dir, also add leading slash to path
      const searcher = new FuzzySearch(subDirs);

      // Where to put a file/folder
      let { parentDir } = await inquirer.prompt({
        name: 'parentDir',
        message: 'Parent directory',
        type: 'autocomplete',
        source: async (_: any, input: string = '') => searcher.search(input),
      } as any);
      parentDir = parentDir.slice(1); // Remove leading slash

      // File/folder path relative to the parent dir
      const { targetPath } = await inquirer.prompt({
        name: 'targetPath',
        message: `Target path (end the path with '/' to create a folder):\n${parentDir}/`,
      });

      // Check if the path already exists
      const finalPath = path.join(parentDir, targetPath);
      if (fs.existsSync(finalPath)) {
        process.stderr.write(`${finalPath} already exist!\n`);
        process.exit(1);
      }

      // Create a file or a folder depending on the input
      if (finalPath.endsWith('/')) {
        fs.mkdirSync(finalPath, { recursive: true });
        process.stdout.write(`Folder created: ${finalPath}\n`);
      } else {
        // Make sure the parent folder exists
        fs.mkdirSync(path.dirname(finalPath), { recursive: true });
        // Create the file
        fs.writeFileSync(finalPath, '');
        process.stdout.write(`File created: ${finalPath}\n`);
      }
    },
  };
};
