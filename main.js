/**
 * Create CloudFlare TunnelAction for GitHub
 */

const fs = require("fs");
const cp = require("child_process");

const CF_API_BASE_URL = "https://api.cloudflare.com/client/v4";

const setOutput = (name, value) => {
  if (process.env.GITHUB_ACTIONS) {
    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `${name}=${value}\n`);
    } else {
      console.log(`::set-output name=${name}::${value}`);
    }
  }
}

const getCurrentAppId = () => {
  const params = new URLSearchParams({
    name: process.env.INPUT_NAME,
  });

  const { status, stdout } = cp.spawnSync("curl", [
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    `${CF_API_BASE_URL}/accounts/${process.env.INPUT_ACCOUNT_ID}/access/apps?${params.toString()}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, result, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.log(`::error ::${errors[0].message}`);
    process.exit(1);
  }

  const name = process.env.INPUT_NAME;
  const record = result.find((x) => x.name === name);

  if (!record) {
    return null
  }

  setOutput('id', record.id);
  return record.id;
};

const createApp = () => {
  // https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--request", "POST"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    ...["--silent", "--data"],
    JSON.stringify({
      name: process.env.INPUT_NAME,
      domain: process.env.INPUT_DOMAIN,
      type: "self_hosted",
      auto_redirect_to_identity: process.env.INPUT_AUTO_REDIRECT_TO_IDENTITY === "true",
      app_launcher_visible: process.env.INPUT_APP_LAUNCHER_VISIBLE === "true",
      allowed_idps: process.env.INPUT_IDPS.trim().split(",").map((x) => x.trim()),
      policies: process.env.INPUT_POLICIES.trim().split(",").map((x) => x.trim()),
    }),
    `${CF_API_BASE_URL}/accounts/${process.env.INPUT_ACCOUNT_ID}/access/apps`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, result, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.dir(errors[0]);
    console.log(`::error ::${errors[0].message}`);
    process.exit(1);
  }

  setOutput('id', result.id);
};

const updateApp = (id) => {
  const { status, stdout } = cp.spawnSync("curl", [
    ...["--request", "PUT"],
    ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
    ...["--header", "Content-Type: application/json"],
    ...["--silent", "--data"],
    JSON.stringify({
      domain: process.env.INPUT_DOMAIN,
      type: "self_hosted",
      auto_redirect_to_identity: process.env.INPUT_AUTO_REDIRECT_TO_IDENTITY === "true",
      app_launcher_visible: process.env.INPUT_APP_LAUNCHER_VISIBLE === "true",
      allowed_idps: process.env.INPUT_IDPS.trim().split(",").map((x) => x.trim()),
      policies: process.env.INPUT_POLICIES.trim().split(",").map((x) => x.trim()),
    }),
    `${CF_API_BASE_URL}/accounts/${process.env.INPUT_ACCOUNT_ID}/access/apps/${id}`,
  ]);

  if (status !== 0) {
    process.exit(status);
  }

  const { success, result, errors } = JSON.parse(stdout.toString());

  if (!success) {
    console.dir(errors[0]);
    console.log(`::error ::${errors[0].message}`);
    process.exit(1);
  }

  setOutput('id', id);
}

const id = getCurrentAppId();
if (!id) {
  createApp();
} else {
  updateApp(id);
}
