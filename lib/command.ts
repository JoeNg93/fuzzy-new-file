import fs from 'fs';
import path from 'path';

import yargs from 'yargs';
import globby from 'globby';
import inquirer from 'inquirer';

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

interface CommandOptions {
  root: string;
  noIgnoreVcs: boolean;
}

export const setupCommand = () => {
  return {
    command: '$0',
    description: 'Create file/folder with fuzzy-file matching autocomplete.',
    builder: {
      root: {
        description:
          'Root folder where autocomplete will list its subdirectories',
        default: process.cwd(),
      },
      'no-ignore-vcs': {
        description:
          "Show search results from files and directories that would otherwise be ignored by '.gitignore' files",
        default: false,
      },
    },
    handler: async (args: yargs.Arguments<CommandOptions>) => {
      const { root, noIgnoreVcs } = args;

      const subDirs = globby.sync('**', {
        cwd: root,
        onlyDirectories: true,
        gitignore: !noIgnoreVcs,
      });

      // Where to put a file/folder
      const { parentDir } = await inquirer.prompt({
        name: 'parentDir',
        message: 'Parent directory',
        type: 'autocomplete',
        source: async (_: any, input: string = '') =>
          subDirs.filter((dir) => dir.indexOf(input) !== -1),
      } as any);

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
