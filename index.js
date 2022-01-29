#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import fs from 'fs';
import kebabcase from 'lodash.kebabcase';

let postDoc = {};

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const docName = async () => {
  const doc = await inquirer.prompt({
    name: 'doc_name',
    type: 'input',
    message: 'Give your document a name',
    validate: (val) => {
      let invailidChar = /[~"#%&*:<>?/\\{|}]+/;
      if (invailidChar.test(val) || !val) {
        return 'not a valid name';
      }
      return true;
    },
  });

  postDoc.doc_name = doc.doc_name;
};

const postTitle = async () => {
  const post = await inquirer.prompt({
    name: 'post_title',
    type: 'input',
    message: 'Post Title',
    validate: (val) => !!val || 'Please enter a title',
  });

  postDoc.post_title = post.post_title;
};

const postExcerpt = async () => {
  const post = await inquirer.prompt({
    name: 'post_excerpt',
    type: 'input',
    message: 'Post Excerpt',
  });

  postDoc.post_excerpt = post.post_excerpt;
};

const postDate = async () => {
  const post = await inquirer
    .prompt({
      name: 'post_date',
      type: 'confirm',
      message: 'Use current date?',
    })
    .then((val) => {
      if (val.post_date) postDoc.post_date = new Date();
      else postDoc.post_date = '';
    });
};

const runScript = async () => {
  const rainbowTitle = chalkAnimation.rainbow('\nHI THERE!\n');
  await sleep();
  rainbowTitle.stop();

  await Promise.all([
    await docName(),
    await postTitle(),
    await postExcerpt(),
    await postDate(),
  ]).then(
    fs.appendFile(
      `${kebabcase(postDoc.doc_name)}.md`,
      `---
title: '${postDoc.post_title}'
excerpt: '${postDoc.post_excerpt}'
date: '${
        postDoc.post_date instanceof Date ? postDoc.post_date.toISOString() : ''
      }'
---`,
      async (err) => {
        const spinner = createSpinner('Creating File...').start();
        await sleep();

        if (err) {
          spinner.error({ text: 'Seems theres been an error...' });
          process.exit(1);
        } else {
          console.clear();
          console.log(
            chalk.bold.bgBlack(
              gradient.passion('Your file has been created successfully!')
            )
          );
          process.exit(0);
        }
      }
    )
  );
};

await runScript();
