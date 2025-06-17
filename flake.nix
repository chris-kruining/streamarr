{
  description = "Streamarr";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgsnixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    bix = {
      url = "github:knarkzel/bix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

    outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
    pkgs = nixpkgs.legacyPackages.${system};
    in
    {
        packages = bix.buildBunPackage {
            src = ./.;
            packages = ./package.json;
        };
    });
}
