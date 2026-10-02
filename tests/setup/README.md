# Setup script validation

The scripts are published from `static/setup/`; the wizard links to those exact assets. Update their Minecraft/Loader versions and pack SHA256 together with the wizard when the server version changes.

Run Windows fixture checks without changing the machine's execution policy:

```powershell
& ([scriptblock]::Create((Get-Content tests/setup/windows.test.ps1 -Raw))) -Script (Resolve-Path static/setup/windows.ps1)
```

Run Bash syntax and isolated mod/backup fixtures (macOS or a POSIX test environment):

```bash
bash -n static/setup/mac.sh
bash tests/setup/mac.test.sh
```

Fixtures use disposable temporary directories and retain evidence. They cover required/optional mod copies, spaces in folder paths, preservation of worlds/config, dated backups on reruns, duplicate rejection, checksum failure, and restoration after a simulated activation failure. Windows also checks JSON profile preservation and a custom Game Directory. Bash checks symlink rejection.

Run the wizard Cypress spec against the production preview. It covers automatic/manual selection, command and script URLs, refresh, prerequisite gating and branches, both manual paths, keyboard focus, narrow layout, clipboard behavior, and independent reference pages.

These are not full OS installation tests. Native macOS DMG mounting, signature checks, JXA profile writing, and Intel/Apple-silicon Java execution need an actual Mac smoke test. Windows WinGet installation and the private Java download require a clean Windows smoke test. Account ownership, fresh game startup and server joining are user-completed checks. A real bundled Fabric CLI install was verified in an isolated launcher folder.
