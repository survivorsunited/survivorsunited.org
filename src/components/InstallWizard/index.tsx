import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Computer = 'windows' | 'mac';
const packUrl = 'https://github.com/survivorsunited/minecraft-mods-manager/releases/download/release-2026.10.02-1.21.11-r3/modpack-1.21.11.zip';
const server = 'minecraft.survivorsunited.org';
const titles = ['Download the modpack', 'Install Fabric', 'Back up your old mods', 'Copy the new mods', 'Launch Minecraft', 'Join Survivors United'];
const stepContent = [1, 4, 5, 6, 7, 8];
type Requirement = 'launcher' | 'account' | 'java';
const requirements: {id: Requirement; label: string; action: string}[] = [
  {id: 'launcher', label: 'I have Minecraft Launcher installed', action: 'Install the launcher'},
  {id: 'account', label: 'My account owns Minecraft: Java Edition', action: 'Check my account'},
  {id: 'java', label: 'I have Java 21 installed', action: 'Install Java / I’m not sure'},
];

function CopyValue({value}: {value: string}) {
  const [message, setMessage] = useState('Copy');
  return <div className={styles.copyRow}>
    <code>{value}</code>
    <button type="button" className="button button--secondary" onClick={async () => {
      try {await navigator.clipboard.writeText(value); setMessage('Copied');}
      catch {setMessage('Select and copy the text');}
    }}>{message}</button>
  </div>;
}

function Help({children}: {children: React.ReactNode}) {
  return <details className={styles.help}><summary>Need help with this step?</summary><div>{children}</div></details>;
}

function Screenshot({file, alt, caption}: {file: string; alt: string; caption: string}) {
  return <figure className={styles.screenshot}><img src={`/img/minecraft/${file}`} alt={alt} loading="lazy"/><figcaption>{caption}</figcaption></figure>;
}

function Step({computer, step}: {computer: Computer; step: number}) {
  const mac = computer === 'mac';
  const folder = mac ? '~/Library/Application Support/minecraft' : '%appdata%\\.minecraft';
  const installer = mac ? 'fabric-installer-1.1.0.jar' : 'fabric-installer-1.1.0.exe';
  switch (step) {
    case 1: return <>
      <p>Download our <strong>1.21.11 modpack</strong> from the trusted Survivors United GitHub release.</p>
      <a className="button button--primary" href={packUrl}>Download modpack ZIP</a>
      <ol>
        <li>Wait for <strong>modpack-1.21.11.zip</strong> to finish downloading.</li>
        <li>{mac ? <>In <strong>Finder → Downloads</strong>, double-click the ZIP to extract it. If it is already extracted, open that folder.</> : <>In <strong>Downloads</strong>, right-click the ZIP → <strong>Extract All → Extract</strong>.</>}</li>
        <li>Keep the extracted folder. You will use <strong>install</strong> and <strong>mods</strong> from inside it.</li>
      </ol>
      <Help><p>If the download has not finished, wait before extracting it. You need the ZIP file, not a GitHub source-code download.</p></Help>
    </>;
    case 2: return <>
      <p><strong>Already have the launcher? Keep it.</strong> You do not need to reinstall it when upgrading from 1.21.8.</p>
      <p>If you do not have it yet, <a href="https://www.minecraft.net/en-us/download">download Minecraft Launcher</a> for <strong>{mac ? 'Mac' : 'Windows'}</strong>. {mac ? <>Open the <strong>.dmg</strong> and drag <strong>Minecraft</strong> into <strong>Applications</strong>.</> : <>Open the downloaded installer and follow its prompts.</>}</p>
      <ol>
        <li>Open <strong>Minecraft Launcher</strong> and sign in with the Microsoft account that owns the game.</li>
        <li>Select <strong>Minecraft: Java Edition</strong> and launch the game once. Stop at the main menu.</li>
        <li>Quit the game and {mac ? 'quit' : 'close'} the launcher.</li>
      </ol>
      <Screenshot file="minecraft-launcher.png" alt="Minecraft Launcher signing in" caption="The launcher opens while it signs you in."/>
      <Help><p><strong>Buy Now / Play Demo?</strong> Check you are signed in to the account that owns Java Edition. Do not open a single-player world for this setup.</p></Help>
    </>;
    case 3: return <>
      <p>Java opens the Fabric installer. <strong>If Java 21 is already installed, you can skip installing it.</strong> If you are unsure, use the installer below.</p>
      {mac ? <>
        <p>Open <strong>Apple menu → About This Mac</strong> and check the chip or processor:</p>
        <ul>
          <li><strong>Apple M1, M2, M3, or another Apple M chip:</strong> <a href="https://adoptium.net/temurin/releases/?version=21&os=mac&arch=aarch64&package=jdk">get Java 21 for Apple silicon</a>.</li>
          <li><strong>Intel processor:</strong> <a href="https://adoptium.net/temurin/releases/?version=21&os=mac&arch=x64&package=jdk">get Java 21 for Intel</a>.</li>
        </ul>
        <p>Choose the <strong>.pkg</strong> download, open it, and follow the prompts. Keep the default settings.</p>
      </> : <>
        <p><a href="https://adoptium.net/temurin/releases/?version=21&os=windows&arch=x64&package=jdk">Get Java 21 for Windows</a>. Choose the <strong>Windows x64 .msi</strong> download, open it, and follow the prompts. Keep the default settings.</p>
      </>}
      <Help><p>Having Minecraft installed does not always mean you have Java installed for opening installers. The Minecraft Launcher manages its own Java for playing the game.</p></Help>
    </>;
    case 4: return <>
      <p><strong>Do this when upgrading too.</strong> Your old 1.21.8 Fabric profile still starts the old game.</p>
      <ol>
        <li>Make sure Minecraft and its launcher are closed.</li>
        <li>Open the extracted modpack → <strong>install</strong> → <strong>{installer}</strong>.</li>
        <li>On the <strong>Client</strong> tab, set <strong>Minecraft Version: 1.21.11</strong> and <strong>Loader Version: 0.19.5</strong>.</li>
        <li>Leave the install location unchanged and tick <strong>Create profile</strong>.</li>
        <li>Click <strong>Install</strong>. Wait for the success message, then close the installer.</li>
      </ol>
      <Help><p>If the installer will not open, open Check prerequisites and complete Java installation. {mac && <>If macOS blocks it, follow <a href="https://support.apple.com/en-au/102445">Apple's instructions for opening a downloaded app</a>.</>}</p><p>The installer is included in our GitHub pack; you do not need a separate Fabric download.</p></Help>
    </>;
    case 5: return <>
      <p>Open your Minecraft folder:</p>
      <p>{mac ? <>In Finder, press <strong>Shift + Command + G</strong>, paste this path, and press <strong>Return</strong>.</> : <>Press <strong>Windows + R</strong>, paste this path, and press <strong>Enter</strong>.</>}</p>
      <CopyValue value={folder}/>
      {!mac && <Screenshot file="windows-minecraft-folder.png" alt="Windows Run dialog with the Minecraft folder path" caption="Windows: paste the path into Run, then choose OK."/>}
      <details className={styles.help}><summary>I previously chose a custom Minecraft folder</summary><p>In Minecraft Launcher, open <strong>Installations → your old Fabric profile → Edit</strong>. Read <strong>Game Directory</strong> and use that folder instead. Set the new <strong>1.21.11</strong> profile to that same folder, then close the launcher. A blank Game Directory means the default path above.</p></details>
      <ol>
        <li>If a folder named <strong>mods</strong> exists, move it to your Desktop and rename it <strong>Survivors United old mods</strong>. Use a different name if that backup already exists.</li>
        <li>Create a new, empty folder named <strong>mods</strong> in the Minecraft folder. Keep it open for the next step.</li>
      </ol>
      <p className={styles.note}><strong>Keep your worlds and settings.</strong> Only move <strong>mods</strong>. Leave <strong>saves</strong>, <strong>config</strong>, maps, and <strong>options.txt</strong> where they are. Keep your old mods backup until the new setup works.</p>
      <Help><p>No mods folder yet? Just create one. If the Minecraft folder is missing, open Check prerequisites and launch Java Edition once. Do not delete the Minecraft folder.</p></Help>
    </>;
    case 6: return <>
      <ol>
        <li>In the extracted download, open <strong>mods</strong>. Copy its <strong>.jar</strong> files into the empty Minecraft <strong>mods</strong> folder you opened in (3).</li>
        <li>In the download, open <strong>mods → optional</strong>. Copy its <strong>.jar</strong> files into that same Minecraft <strong>mods</strong> folder.</li>
      </ol>
      <p><strong>Check:</strong> your Minecraft mods folder should contain the .jar files directly. It should have no ZIP and no second mods folder inside it.</p>
      <p>Leave the download's <strong>block</strong> folder and other files alone. You do not need to copy server files, config, or shaders to join.</p>
      <Help><p>Copy the files from both locations above, even though one folder is called optional: the release's client instructions include them. Do not double-click individual mod files or mix them with your old mods.</p></Help>
    </>;
    case 7: return <>
      <ol>
        <li>Open <strong>Minecraft Launcher → Minecraft: Java Edition</strong>.</li>
        <li>In the selector beside <strong>Play</strong>, choose the profile containing <strong>fabric-loader</strong> and <strong>1.21.11</strong>.</li>
        <li>Click <strong>Play</strong>. Confirm the modified-installation prompt if shown, and wait for the main menu.</li>
      </ol>
      <Screenshot file="fabric-selection.png" alt="Launcher with Java Edition, the Fabric profile selector and Play highlighted" caption="A: Java Edition. B: Fabric profile. C: Play. This older screenshot shows 1.21.5; choose 1.21.11 for this setup."/>
      <Help><p><strong>Profile missing?</strong> Open <strong>Installations</strong> and enable <strong>Modded</strong>.</p><p><strong>Old version or incompatible mods?</strong> Check the Fabric version in (2), the fresh mods folder in (3), and both sets of files in (4).</p><p>Keep existing single-player worlds closed during setup. Back up <strong>saves</strong> before opening a world in a newer game version.</p></Help>
    </>;
    case 8: return <>
      <ol>
        <li>In Minecraft, click <strong>Multiplayer → Add Server</strong>.</li>
        <li>For <strong>Server Name</strong>, enter <strong>Survivors United</strong>.</li>
        <li>For <strong>Server Address</strong>, paste:</li>
      </ol>
      <CopyValue value={server}/>
      <p>Click <strong>Done</strong>, select <strong>Survivors United</strong>, then click <strong>Join Server</strong>.</p>
      <Screenshot file="add-server.png" alt="Minecraft multiplayer screen with the Add Server button" caption="Choose Add Server. This older screenshot shows the button location; use the address above."/>
      <p className={styles.note}>Once you are connected, you're ready to play!</p>
      <Help><p>Check the address and make sure you launched the <strong>1.21.11 Fabric</strong> profile. If joining still fails, tell us the exact message using the support link below.</p></Help>
    </>;
    default: return null;
  }
}

export function SetupReference({kind}: {kind: 'java' | 'minecraft' | 'fabric' | 'mods'}) {
  const [computer, setComputer] = useState<Computer>('windows');
  const content = kind === 'java' ? [3] : kind === 'minecraft' ? [2] : kind === 'fabric' ? [1, 4, 7] : [1, 5, 6];
  const labels: Record<number, string> = {1: 'Download the modpack', 2: 'Install Minecraft Launcher', 3: 'Install Java 21', 4: 'Install Fabric', 5: 'Find your folder and back up old mods', 6: 'Copy the new mods', 7: 'Select your Fabric profile'};
  return <section className={styles.wizard} aria-label="Setup reference">
    <p>For guided setup, use the <Link to="/docs/minecraft/installation">Setup Wizard</Link>. This page lets you follow just this part of the process.</p>
    <div className={styles.choices}>{(['windows', 'mac'] as const).map(value => <button type="button" key={value} className={styles.choice} aria-pressed={computer === value} onClick={() => setComputer(value)}>{value === 'windows' ? 'Windows' : 'Mac'}{computer === value && ' ✓'}</button>)}</div>
    {content.map(value => <section key={`${computer}-${value}`}><h2>{labels[value]}</h2><Step computer={computer} step={value}/></section>)}
  </section>;
}

export function AutomaticSetup({computer}: {computer: Computer}) {
  const [origin, setOrigin] = useState('https://survivorsunited.org');
  useEffect(() => {setOrigin(window.location.origin);}, []);
  const windows = computer === 'windows';
  const download = windows ? `$setup = Join-Path $env:TEMP ('survivors-united-' + [guid]::NewGuid() + '.ps1'); iwr -UseBasicParsing '${origin}/setup/windows.ps1' -OutFile $setup` : `setup=$(mktemp /tmp/survivors-united-setup.XXXXXXXX); curl --fail --location '${origin}/setup/mac.sh' -o "$setup"`;
  const run = windows ? '& ([scriptblock]::Create((Get-Content -LiteralPath $setup -Raw)))' : 'bash "$setup"';
  return <>
    <h3>Automatic setup for {windows ? 'Windows' : 'Mac'}</h3>
    <p>The script checks your setup, installs the launcher if missing, finds or downloads Java 21, installs Fabric, creates a Survivors United profile, and replaces the mods after backing them up. Each stage prints its progress and saves a log.</p>
    <p><strong>You still sign in yourself.</strong> The script pauses while you open Java Edition once, then close the game and launcher. At the end, select the new profile, press Play, and join the server. It never asks for your password or buys the game.</p>
    <ol>
      <li>Open <strong>{windows ? 'PowerShell from the Start menu' : 'Terminal from Applications → Utilities'}</strong>. Use your normal account.</li>
      <li>Copy and run the download command:</li>
    </ol>
    <CopyValue value={download}/>
    <p><a href={windows ? '/setup/windows.ps1' : '/setup/mac.sh'}>Read or download the script</a> before running it. Run the following commands in the same window you used for the download.</p>
    <p>For a check without installing or changing files, run:</p>
    <CopyValue value={`${run} ${windows ? '-CheckOnly' : '--check-only'}`}/>
    <p>To install or upgrade, run:</p>
    <CopyValue value={run}/>
    <p>Follow the prompts. If you used a custom Game Directory, enter the full path from your old launcher profile when asked.</p>
    <p className={styles.note}>Old mods stay in a dated backup beside the new mods folder. Launcher profiles are backed up in the setup log folder. Keep these until you have joined successfully. Worlds, maps, config and settings stay in place.</p>
    <Help><p>If a check fails, the script stops and prints what to fix. Use the manual wizard or ask us on Discord with the message. Do not send passwords or account tokens. Windows needs 64-bit Windows and WinGet to install a missing launcher. Mac supports Intel and Apple silicon. Linked game folders use the manual path.</p></Help>
  </>;
}

export default function InstallWizard({initialComputer}: {initialComputer?: Computer}) {
  const [computer, setComputer] = useState<Computer | null>(initialComputer ?? null);
  const [step, setStep] = useState(0);
  const [checks, setChecks] = useState({launcher: false, account: false, java: false, launched: false});
  const [branch, setBranch] = useState<Requirement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [automatic, setAutomatic] = useState(false);
  const [moved, setMoved] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const ready = checks.launcher && checks.account && checks.java && checks.launched;
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setAutomatic(query.get('method') === 'automatic');
    const savedComputer = initialComputer ?? query.get('computer');
    if (savedComputer === 'windows' || savedComputer === 'mac') {
      setComputer(savedComputer);
      let saved = {launcher: false, account: false, java: false, launched: false};
      try {
        const stored = JSON.parse(sessionStorage.getItem(`su-setup-v2-${savedComputer}`) ?? '{}');
        saved = {launcher: stored.launcher === true, account: stored.account === true, java: stored.java === true, launched: stored.launched === true};
      } catch { /* The checklist still works when browser storage is unavailable. */ }
      setChecks(saved);
      const savedStep = Number(query.get('step'));
      if (saved.launcher && saved.account && saved.java && saved.launched && Number.isInteger(savedStep) && savedStep >= 1 && savedStep <= titles.length) setStep(savedStep);
    }
    setLoaded(true);
  }, [initialComputer]);
  useEffect(() => {
    if (!loaded || !computer) return;
    try {sessionStorage.setItem(`su-setup-v2-${computer}`, JSON.stringify(checks));} catch { /* Storage is optional. */ }
  }, [checks, computer, loaded]);
  useEffect(() => {
    if (moved) heading.current?.focus();
  }, [computer, step, branch, automatic, moved]);
  const move = (nextComputer: Computer | null, nextStep: number) => {
    if (computer !== nextComputer) setChecks({launcher: false, account: false, java: false, launched: false});
    setComputer(nextComputer); setStep(nextStep); setBranch(null); setMoved(true);
    setAutomatic(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('minecraft-os');
    url.searchParams.delete('method');
    if (nextComputer) {url.searchParams.set('computer', nextComputer); url.searchParams.set('step', String(nextStep));}
    else {url.searchParams.delete('computer'); url.searchParams.delete('step');}
    window.history.replaceState(window.history.state, '', url.toString());
  };
  const showBranch = (value: Requirement | null) => {setBranch(value); setMoved(true);};
  const chooseMethod = (value: boolean) => {
    setAutomatic(value); setBranch(null); setMoved(true);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set('method', 'automatic'); else url.searchParams.delete('method');
    window.history.replaceState(window.history.state, '', url.toString());
  };
  return <section className={styles.wizard} aria-label="Minecraft setup wizard">
    <h1>Setup Wizard</h1>
    {!computer ? <>
      <h2 ref={heading} tabIndex={-1}>Which computer do you use?</h2>
      <p>Check what you already have, then follow six steps to install or upgrade and join Survivors United.</p>
      <p>You will need internet access throughout setup.</p>
      <div className={styles.choices}>
        <button type="button" className={styles.choice} onClick={() => move('windows', 0)}><strong>I use Windows →</strong><span>Windows PC or laptop</span></button>
        <button type="button" className={styles.choice} onClick={() => move('mac', 0)}><strong>I use a Mac →</strong><span>MacBook, iMac, or another Apple Mac</span></button>
      </div>
      <p>For both <strong>first-time installs</strong> and <strong>upgrades from 1.21.8 or another older version</strong>.</p>
    </> : <>
      <div className={styles.progress}><span>{computer === 'windows' ? 'Windows' : 'Mac'} · {step === 0 ? 'Before you start' : `Step ${step} of ${titles.length}`}</span>{initialComputer ? <Link to="/docs/minecraft/installation">Change computer</Link> : <button type="button" className={styles.textButton} onClick={() => move(null, 0)}>Change computer</button>}</div>
      {step === 0 && <div className={styles.choices}><button type="button" className={styles.choice} aria-pressed={!automatic} onClick={() => chooseMethod(false)}>Manual · Follow the steps</button><button type="button" className={styles.choice} aria-pressed={automatic} onClick={() => chooseMethod(true)}>Automatic · Run the setup script</button></div>}
      {step === 0 ? automatic ? <><h2 ref={heading} tabIndex={-1}>Let the setup script help</h2><AutomaticSetup computer={computer}/></> : branch ? <>
        <h2 ref={heading} tabIndex={-1}>{requirements.find(item => item.id === branch)?.action}</h2>
        {branch === 'account' ? <>
          <p>Open Minecraft Launcher, sign in with the Microsoft account that owns the game, and select <strong>Minecraft: Java Edition</strong>.</p>
          <p>If you see <strong>Buy Now</strong> or <strong>Play Demo</strong>, check whether you used a different account when buying Minecraft. You need a Java Edition licence or an active subscription that includes it.</p>
          <p>If you do not own Java Edition, <a href="https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc">get it from the official Minecraft website</a>, then sign in with that account.</p>
          <p>Once you can play Java Edition, return and tick it off.</p>
        </> : <Step computer={computer} step={branch === 'launcher' ? 2 : 3}/>}
        <button type="button" className="button button--primary" onClick={() => showBranch(null)}>Return to checklist →</button>
      </> : <>
        <h2 ref={heading} tabIndex={-1}>Let’s check what you already have</h2>
        <p>Tick each item you already have. Use the help button for anything missing or uncertain, then return here.</p>
        <div className={styles.checklist}>
          {requirements.map(item => <div className={styles.checkItem} key={item.id}>
            <label><input type="checkbox" checked={checks[item.id]} onChange={event => setChecks({...checks, [item.id]: event.target.checked, launched: false})}/><span>{item.label}</span></label>
            <button type="button" className={styles.textButton} onClick={() => showBranch(item.id)}>{item.action}</button>
          </div>)}
        </div>
        <div className={styles.note}>
          <strong>One quick check before continuing</strong>
          <p>Open Minecraft Launcher, sign in, select <strong>Minecraft: Java Edition</strong>, and launch it once to the main menu. Then close the game and launcher. This confirms your account works and creates the Minecraft folder. Keep single-player worlds closed.</p>
          <label className={styles.confirm}><input type="checkbox" checked={checks.launched} disabled={!checks.launcher || !checks.account || !checks.java} onChange={event => setChecks({...checks, launched: event.target.checked})}/><span>I reached the main menu and closed Minecraft and its launcher</span></label>
        </div>
        <div className={styles.navigation}><button type="button" className="button button--primary" disabled={!ready} onClick={() => move(computer, 1)}>Continue to install or upgrade →</button></div>
        <p className={styles.caption}>Tick all three prerequisites and confirm the quick check to continue. We remember your checklist in this browser tab.</p>
      </> : <>
        <progress max={titles.length} value={step} aria-label={`Step ${step} of ${titles.length}`}/>
        <h2 ref={heading} tabIndex={-1}>({step}) {titles[step - 1]}</h2>
        <div key={`${computer}-${step}`}><Step computer={computer} step={stepContent[step - 1]}/></div>
        <div className={styles.navigation}>
          <button type="button" className="button button--secondary" onClick={() => move(computer, step - 1)}>← {step === 1 ? 'Checklist' : 'Back'}</button>
          {step < titles.length ? <button type="button" className="button button--primary" onClick={() => move(computer, step + 1)}>Next →</button> : <Link className="button button--primary" to="/docs/minecraft/first-steps/things-to-do-first">What to do after joining →</Link>}
        </div>
        <button type="button" className={styles.textButton} onClick={() => move(computer, 0)}>Check prerequisites</button>
        <p className={styles.caption}>Finish the actions above, then choose Next. Back lets you check an earlier step.</p>
      </>}
    </>}
    <p className={styles.support}><Link to="/docs/minecraft/server/discord">Ask us for help on Discord</Link>{computer && <> — tell us {computer === 'windows' ? 'Windows' : 'Mac'}, {step === 0 ? 'the prerequisite you need help with' : `step ${step}`}, and the exact message you see.</>}</p>
    <p className={styles.caption}>Know what you need? Use the individual guides in <strong>Setup Reference</strong> in the menu.</p>
    <noscript>This guide needs JavaScript to show the steps. Enable JavaScript in your browser, or contact us using the support link above.</noscript>
  </section>;
}
