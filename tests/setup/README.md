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

Both fixture suites exercise explicit restoration of old mods and launcher profiles, retention of backups and replaced mods, and restoration after a first install with no prior mods. Windows mocks the missing-WinGet bootstrap so no packages are installed on the test machine. Bash also exercises the failure handler's interactive restore choice. Run `bash tests/setup/mac-entry.test.sh` to check the one-line entry style without a native Mac.

Run the wizard Cypress spec against the production preview. It covers automatic/manual selection, command and script URLs, refresh, prerequisite gating and branches, both manual paths, keyboard focus, narrow layout, clipboard behavior, and independent reference pages.

Run `bash tests/setup/mac-extraction.test.sh` for the client-only ZIP extraction regression. It includes a shader filename with special characters, selects both client mod folders under the C locale, and checks that unused shaders/server files are excluded. Full ZIP extraction failed on native macOS 11.7.11 over SSH; client-only extraction avoids that failure.

Native Intel Mac validation on macOS 11.7.11 confirmed Java 21 download checksum and execution, Foundation/JXA launcher profile writing, official Launcher DMG mounting/signature verification/detach, and a real Fabric 1.21.11/Loader 0.19.5 install. An isolated copy of the existing 47-mod game setup was upgraded to all 82 release client JARs, verified against pack files, then restored; every original mod and profile hash matched. The active game folder was untouched. Its running Launcher correctly blocked the published check-only command; the process guard was bypassed only for the isolated clone's file operations. Apple-silicon execution, sign-in, actual gameplay/server connection, and the full interactive flow remain unverified.

Windows PowerShell 5.1 also completed the corrected interactive script against the actual default Minecraft folder after opening and closing Launcher, without first launching vanilla Minecraft. Java and modpack SHA256 checks, Fabric installation, profile creation and all 82 mod copies passed. Restoration recovered the original launcher profile byte-for-byte and the original absent-mods-folder state. The installation was then reapplied and every active mod checked against the release. The final state contains the Survivors United 1.21.11 profile. Launcher is responsible for downloading the base game's remaining files on Play; game startup and server joining remain unverified.

These are not full interactive OS installation tests. Apple-silicon Java execution and first-install copying of the launcher application still need native checks. Account ownership, fresh game startup and server joining are user-completed checks. Windows fixture checks mock missing-WinGet bootstrap; separate machine testing verified the WinGet Launcher installation, real private Java download and isolated real-pack upgrade/restore. Real bundled Fabric CLI installs were verified in isolated launcher folders on Windows and Intel Mac.
