# Create Access Application Action for GitHub

Creates CloudFlare ZeroTrust Access Application with a given name. Outputs the app's id.

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
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
