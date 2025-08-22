# Create Access Application Action for GitHub

Creates CloudFlare ZeroTrust Access Application with a given name. Outputs the app's id.

It supports only self-hosted applications.

## Usage via Github Actions

```yaml
name: example
on:
  pull_request:
    type: [closed]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kourawealthtech/cf-ensure-access-app@main
        with:
          name: "my app name"
          domain: "my.domain.com"
          idps: "00000-0000-0000-00000,00000-0000-0000-00001" #uuids
          policies: "00000-0000-0000-00000,00000-0000-0000-00001" #uuids
          app_launcher_visible: false
          auto_redirect_to_identity: false
          account_id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          token: ${{ secrets.CLOUDFLARE_TOKEN }}
          preflight_bypass: true
```
## Action Parameters

| Name                     | Required | Description                                                                                       | Example                                      |
|--------------------------|----------|---------------------------------------------------------------------------------------------------|----------------------------------------------|
| `name`                   | Yes      | Access Application name                                                                            | `"my app name"`                              |
| `domain`                 | Yes      | The URL the application represents (e.g., example.com/uri)                                        | `"my.domain.com"`                            |
| `idps`                   | Yes      | Allowed IDPs (comma separated list of IDP IDs)                                                    | `"uuid1,uuid2"`                              |
| `policies`               | Yes      | Access policies (comma separated list of IDs)                                                     | `"policy1,policy2"`                          |
| `app_launcher_visible`   | No       | Whether the application should be visible in the app launcher (`true` or `false`)                 | `false`                                      |
| `auto_redirect_to_identity` | No    | Automatically redirect to identity provider if only one IDP (`true` or `false`)                   | `false`                                      |
| `preflight_bypass`       | No       | Allow OPTIONS preflight requests to bypass Access authentication (`true` or `false`)              | `true`                                       |
| `account_id`             | Yes      | CloudFlare Account ID                                                                             | `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`       |
| `token`                  | Yes      | CloudFlare API token                                                                              | `${{ secrets.CLOUDFLARE_TOKEN }}`            |

**Output:**

- `id`: The Access Application ID.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
