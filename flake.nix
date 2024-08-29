{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgName = "graphics";
        pkgs = import nixpkgs {
          inherit system;
        };
        # Directories
        web_dir = "www";
        # Build inputs used by dev shells, and packages alike
        buildInputs = [];
      in
        with pkgs; rec {
          ##############
          ## PACKAGES ##
          ##############
          packages = let
            # Simple copy of the website source into the Nix Store
            website = (callPackage (./. + "/${web_dir}") {inherit pkgs pkgName;}).default;
          in {
            inherit website;
            default = packages.website;
          };

          ############
          ## SHELLS ##
          ############
          devShells = import ./shell.nix {inherit pkgs web_dir buildInputs;};

          #############
          ## MODULES ##
          #############
          nixosModules.default = {
            lib,
            config,
            ...
          }: let
            # Check if both the website service is enabled, and this specific site is enabled.
            cfgcheck = config.services.websites.enable && config.services.websites.sites.${pkgName}.enable;
            # Website url
            domain = config.services.websites.sites.${pkgName}.domain;
          in {
            # Create the option to enable this site, and set its domain name
            options = {
              services = {
                websites = {
                  sites = {
                    "${pkgName}" = {
                      enable = lib.mkEnableOption "Webpage of my graphics demos.";
                      domain = lib.mkOption {
                        type = lib.types.str;
                        default = "graphics.xvrqt.com";
                        example = "gateway.xvrqt.com";
                        description = "Domain name for the website. In the form: sub.domain.tld, domain.tld";
                      };
                    };
                  };
                };
              };
            };

            config = {
              # Add the website to the system's packages
              environment.systemPackages = [packages.default];

              # Configure a virtual host on nginx
              services.nginx.virtualHosts.${domain} = lib.mkIf cfgcheck {
                forceSSL = true;
                enableACME = true;
                acmeRoot = null;
                locations."/" = {
                  root = "${packages.default}";
                  tryFiles = "$uri $uri.html /index.html";
                };
              };
            };
          };
        }
    );
}
