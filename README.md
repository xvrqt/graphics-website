# Graphics Demos

Webpage hosting demos of my computer graphics journey. A portfolio of sorts.

Check it out: [https://graphics.xvrqt.com](https://graphics.xvrqt.com)

## Development

Clone this directory.
Run `nix develop` in the project root to start a server at `http://localhost:6969` that will preview your changes.

## Installation

Given this is a static website, it is trivial to serve.
Using Nix makes it more complicated because of course it does, so here's how to use Nix Flakes to serve it.

### Setup

First, you need to use my [websites](https://github.com/xvrqt/website-flake) flake to setup the appropriate options, and configurations to serve this website with no additional setup from you.

```nix
{
  inputs = {
    graphics.url = "github:xvrqt/graphics-website";
  };

  outputs = {...} @ sites: {
    nixosModules.default.imports = [
      # ... other sites
      sites.graphics.nixosModules.${system}.default
    ];
  };
}
```

### Options

Fortunately, this should already be included because you wrote both flakes. When you have added this flake as an input to the `website` flake, and then added the `website` flake to your NixOS Configuration flake modules list, then you can enable it in your main NixOS module via the following options:

```nix
services = {
  websites = {
    enable = true;
    email = "my@email.com";
    dnsProvider = "cloudflare";
    dnsTokenFile = ./path/to/secret;
    sites = {
      graphics = {
        enable = true;
        domain = "graphics.xvrqt.com";
      };
    };
  };
};
```
