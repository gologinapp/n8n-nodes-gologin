# n8n-nodes-gologin

This is an n8n community node that lets you use [GoLogin](https://gologin.com) in your n8n workflows.

GoLogin is a powerful anti-detect browser that allows you to manage multiple browser profiles with different fingerprints, proxies, and settings.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations:

### Profile
- **Create**: Create a new browser profile
- **Delete**: Delete one or more profiles
- **Get**: Get a profile by ID
- **Get Many**: Get multiple profiles with filtering options
- **Update**: Update a profile's settings

### Proxy
- **Create**: Create a new proxy
- **Delete**: Delete a proxy
- **Get**: Get a proxy by ID
- **Get Many**: Get all proxies
- **Update**: Update a proxy

### Workspace
- **Create**: Create a new workspace
- **Delete**: Delete a workspace
- **Get**: Get a workspace by ID
- **Get Many**: Get all workspaces
- **Rename**: Rename a workspace

### Tag
- **Add to Profiles**: Add a tag to profiles
- **Create**: Create a new tag
- **Delete**: Delete a tag
- **Get Many**: Get all tags
- **Remove from Profiles**: Remove a tag from profiles
- **Update**: Update a tag

### Folder
- **Add Profiles**: Add profiles to a folder
- **Create**: Create a new folder
- **Delete**: Delete a folder
- **Get Many**: Get all folders
- **Remove Profiles**: Remove profiles from a folder

## Credentials

To use this node, you need a GoLogin API token. You can get your API token from the [GoLogin dashboard](https://app.gologin.com/).

1. Log in to your GoLogin account
2. Navigate to Settings → API
3. Generate or copy your API token
4. Add it to your n8n credentials

## Compatibility

This node was developed and tested with:
- n8n version 1.0.0+
- GoLogin API version as of December 2025

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GoLogin documentation](https://docs.gologin.com/)
- [GoLogin API documentation](https://docs-download.gologin.com/openapi.json)

## Version history

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

[MIT](LICENSE.md)
