{
  pkgs,
  web_dir,
  buildInputs,
  ...
}: {
  default = let
    # Port to run the local server on
    port = "6969";
  in
    pkgs.mkShell {
      # Include a Web Server so we can test locally
      buildInputs = buildInputs ++ [pkgs.python3];

      shellHook = ''
        project_directory=$(pwd)
        clear
        if pgrep -x python3 >> /dev/null
        then
          echo "Server already running."
        else
          # Start the server, set a trap on exit
          python3 -m http.server ${port} -d ./${web_dir}> logs/server.log 2>&1 &
          WEB_PID=$!
          # Clean up the server on exit
          trap "kill -9 $WEB_PID" EXIT
        fi
      '';
    };
}
