# GitWatch CLI

GitWatch CLI is a simple command-line tool that allows you to fetch and display the recent activity of any GitHub user directly in your terminal.

## Features

- Fetch recent GitHub activity for any user
- Display activity in a human-readable format
- Handle various GitHub event types (Push, Issue, Watch, Create, Fork)
- Easy to use with a single command

## Installation

To install GitWatch CLI globally on your system, follow these steps:

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/gitwatch-cli.git
   ```

2. Navigate to the project directory:
   ```
   cd gitwatch-cli
   ```

3. Install the package globally:
   ```
   npm install -g .
   ```

## Usage

After installation, you can use GitWatch CLI with the following command:

```
gitwatch <username>
```

Replace `<username>` with the GitHub username you want to check.

Example:
```
gitwatch octocat
```

This will display the recent GitHub activity for the user "octocat".

## Output

The tool will display recent activities in the following format:

```
- Pushed 3 commit(s) to octocat/Hello-World
- Opened an issue in octocat/Spoon-Knife
- Starred octocat/git-consortium
- Created branch main in octocat/Hello-World
- Forked octocat/linguist
```

## Error Handling

If there's an error fetching the GitHub activity (e.g., invalid username, API failure), the tool will display an error message and exit with a non-zero status code.

## Dependencies

- Node.js
- Yargs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Author

Kartik Labhshetwar

---

Happy GitWatching!
