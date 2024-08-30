#! /usr/bin/env node

import https from 'https'
import yargs from 'yargs';
import chalk from 'chalk'
import {hideBin} from 'yargs/helpers'

// This function fetches the user's activity from the GitHub API
function fetchGithubActivity(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/users/${username}/events`,
      headers: {
        "User-Agent": "gitwatch-cli",
      },
    };

    https
      .get(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(
              new Error(
                `API request failed with the status code ${res.statusCode}`
              )
            );
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// This function formats the activity data for display
function formatActivity(activity) {
  const eventTypes = {
    PushEvent: (event) =>
      `Pushed ${chalk.green(
        event.payload.commits.length
      )} commit(s) to ${chalk.blue(event.repo.name)}`,
    IssueEvent: (event) =>
      `${chalk.yellow(event.payload.action)} an issue in ${chalk.blue(
        event.repo.name
      )}`,
    WatchEvent: (event) => `Starred ${chalk.blue(event.repo.name)}`,
    CreateEvent: (event) =>
      `Created ${chalk.cyan(event.payload.ref_type)} ${
        event.payload.ref || ""
      } in ${chalk.blue(event.repo.name)}`,
    ForkEvent: (event) => `Forked ${chalk.blue(event.repo.name)}`,
  };

  return activity
    .filter((event) => eventTypes[event.type])
    .map((event) => `- ${eventTypes[event.type](event)}`)
    .join("\n");
}

// Use yargs to handle CLI arguments and run the functions
yargs(hideBin(process.argv))
  .command(
    "$0 <username>",
    "Fetch GitHub activity for a user",
    (yargs) => {
      return yargs.positional("username", {
        describe: "GitHub username",
        type: "string",
      });
    },
    async (argv) => {
      try {
        const activity = await fetchGithubActivity(argv.username);
        const formattedActivity = formatActivity(activity);
        console.log(formattedActivity);
      } catch (error) {
        console.error(
          chalk.red("Error fetching GitHub Activity:"),
          error.message
        );
        process.exit(1);
      }
    }
  )
  .help().argv;
