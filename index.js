const core = require("@actions/core");
const github = require("@actions/github");
const asana = require("asana");

async function addComment(asanaPAT, taskId, taskComment) {
    try {
        const asanaClient = asana.Client.create({
            defaultHeaders: { "asana-enable": "new_sections,string_ids" },
            logAsanaChangeWarnings: false
        }).useAccessToken(asanaPAT);

        await client.tasks.addComment(taskId, {
            text: taskComment
        });
        core.info("Added the pull request link to the Asana task.");
    } catch (err) {
        core.setFailed(err.value);
    }
}

try {
    const asanaPat = core.getInput("asana-pat");
    const taskComment = core.getInput("task-comment");
    const triggerPharse = core.getInput("trigger-phrase");
    const pullRequests = github.context.payload.pull_request;
    const formattedLink = new RegExp(
        `${triggerPharse} *\\[(.*?)\\]\\(https:\\/\\/app.asana.com\\/(\\d+)\\/(?<project>\\d+)\\/(?<task>\\d+).*?\\)`,
        "g"
    );
    const parseAsanaURL = REGEX.exec(PULL_REQUEST.body);

    if (parseAsanaURL !== null && taskComment) {
        const taskId = parseAsanaURL.groups.task;
        if (taskId) {
            addComment(asanaPat, taskId, taskComment);
        }
    } else {
        core.info(`Invalid Asana task URL ${triggerPharse}`);
    }
} catch (error) {
    core.setFailed(error.message);
}
