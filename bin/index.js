#! /usr/bin/env node

const yargs = require("yargs");
const https = require("https");
const {hideBin} = require("yargs/helpers")


//This function fetches the user's activity from the github api
function fetchGithubActivity(username){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/users/${username}/events`,
            headers: {
                'User-Agent': 'gitwatch-cli'
            }
        };

        https.get(options, (res)=> {

            let data = '';

            res.on('data', (chunk)=>{
                data += chunk;
            });

            res.on('end', ()=> {
                if(res.statusCode === 200){
                    resolve(JSON.parse(data))
                } else {
                    reject(new Error(`API request failed with the status code ${res.statusCode}`))
                }
            });

        }).on('error', (error)=> {
            reject(error)
        })
    })
}

//this function formats the activity data for display

function formatActivity(activity){
    const eventTypes = {
        PushEvent: (event) => `Pushed ${event.payload.commits.length} commit(s) to ${event.repo.name}`,
        IssueEvent: (event) => `${event.payload.action} an issue in ${event.repo.name}`,
        WatchEvent: (event) => `Starred ${event.repo.name}`,
        CreateEvent: (event) => `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`,
        ForkEvent: (event) => `Forked ${event.repo.name}`
    };

    return activity
            .filter(event => eventTypes[event.type])
            .map(event => `- ${eventTypes[event.type](event)}`)
            .join('\n')
}


//use yargs to handle cli arguments and run the functions

yargs(hideBin(process.argv))
    .command('$0 <username>', 'Fetch Github activity for a user', (yargs) => {
        return yargs.positional('username', {
            describe: 'Github username',
            type: 'string'
        })
    }, async (argv)=> {
        try {
            const activity = await fetchGithubActivity(argv.username);
            const formattedActivity = formatActivity(activity);
            console.log(formattedActivity);
            

        } catch(e){
            console.error("Error fetching Github Activity:", error.message)
            process.exit(1);
        }
    })
    .help()
    .argv;