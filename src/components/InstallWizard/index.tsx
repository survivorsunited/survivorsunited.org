import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Computer = 'windows' | 'mac';
const packUrl = 'https://github.com/survivorsunited/minecraft-mods-manager/releases/download/release-2026.10.02-1.21.11-r3/modpack-1.21.11.zip';
const server = 'minecraft.survivorsunited.org';
const titles = ['Download the modpack', 'Open Minecraft Launcher', 'Install Java 21', 'Install Fabric', 'Back up your old mods', 'Copy the new mods', 'Launch Minecraft', 'Join Survivors United'];

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
      <Help><p><strong>Buy Now / Play Demo?</strong> Check you are signed in to the account that owns Java Edition. Do not open a single-player world for this setup.</p></Help>
    </>;
    case 3: return <>
      <p>Java opens the Fabric installer. <strong>If Java 21 is already installed, click Next.</strong> If you are unsure, use the installer below.</p>
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
      <Help><p>If the installer will not open, go Back and complete Java installation. {mac && <>If macOS blocks it, follow <a href="https://support.apple.com/en-au/102445">Apple's instructions for opening a downloaded app</a>.</>}</p><p>The installer is included in our GitHub pack; you do not need a separate Fabric download.</p></Help>
    </>;
    case 5: return <>
      <p>Open your Minecraft folder:</p>
      <p>{mac ? <>In Finder, press <strong>Shift + Command + G</strong>, paste this path, and press <strong>Return</strong>.</> : <>Press <strong>Windows + R</strong>, paste this path, and press <strong>Enter</strong>.</>}</p>
      <CopyValue value={folder}/>
      <details className={styles.help}><summary>I previously chose a custom Minecraft folder</summary><p>In Minecraft Launcher, open <strong>Installations → your old Fabric profile → Edit</strong>. Read <strong>Game Directory</strong> and use that folder instead. Set the new <strong>1.21.11</strong> profile to that same folder, then close the launcher. A blank Game Directory means the default path above.</p></details>
      <ol>
        <li>If a folder named <strong>mods</strong> exists, move it to your Desktop and rename it <strong>Survivors United old mods</strong>. Use a different name if that backup already exists.</li>
        <li>Create a new, empty folder named <strong>mods</strong> in the Minecraft folder. Keep it open for the next step.</li>
      </ol>
      <p className={styles.note}><strong>Keep your worlds and settings.</strong> Only move <strong>mods</strong>. Leave <strong>saves</strong>, <strong>config</strong>, maps, and <strong>options.txt</strong> where they are. Keep your old mods backup until the new setup works.</p>
      <Help><p>No mods folder yet? Just create one. If the Minecraft folder is missing, go back to (2) and launch Java Edition once. Do not delete the Minecraft folder.</p></Help>
    </>;
    case 6: return <>
      <ol>
        <li>In the extracted download, open <strong>mods</strong>. Copy its <strong>.jar</strong> files into the empty Minecraft <strong>mods</strong> folder you opened in (5).</li>
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
      <Help><p><strong>Profile missing?</strong> Open <strong>Installations</strong> and enable <strong>Modded</strong>.</p><p><strong>Old version or incompatible mods?</strong> Check the Fabric version in (4), the fresh mods folder in (5), and both sets of files in (6).</p><p>Keep existing single-player worlds closed during setup. Back up <strong>saves</strong> before opening a world in a newer game version.</p></Help>
    </>;
    case 8: return <>
      <ol>
        <li>In Minecraft, click <strong>Multiplayer → Add Server</strong>.</li>
        <li>For <strong>Server Name</strong>, enter <strong>Survivors United</strong>.</li>
        <li>For <strong>Server Address</strong>, paste:</li>
      </ol>
      <CopyValue value={server}/>
      <p>Click <strong>Done</strong>, select <strong>Survivors United</strong>, then click <strong>Join Server</strong>.</p>
      <p className={styles.note}>Once you are connected, you're ready to play!</p>
      <Help><p>Check the address and make sure you launched the <strong>1.21.11 Fabric</strong> profile. If joining still fails, tell us the exact message using the support link below.</p></Help>
    </>;
    default: return null;
  }
}

export default function InstallWizard({initialComputer}: {initialComputer?: Computer}) {
  const [computer, setComputer] = useState<Computer | null>(initialComputer ?? null);
  const [step, setStep] = useState(1);
  const [moved, setMoved] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const savedComputer = query.get('computer');
    if (initialComputer || savedComputer === 'windows' || savedComputer === 'mac') {
      setComputer(initialComputer ?? savedComputer as Computer);
      const savedStep = Number(query.get('step'));
      if (Number.isInteger(savedStep) && savedStep >= 1 && savedStep <= titles.length) setStep(savedStep);
    }
  }, [initialComputer]);
  useEffect(() => {
    if (moved) heading.current?.focus();
  }, [computer, step, moved]);
  const move = (nextComputer: Computer | null, nextStep: number) => {
    setComputer(nextComputer); setStep(nextStep); setMoved(true);
    const url = new URL(window.location.href);
    url.searchParams.delete('minecraft-os');
    if (nextComputer) {url.searchParams.set('computer', nextComputer); url.searchParams.set('step', String(nextStep));}
    else {url.searchParams.delete('computer'); url.searchParams.delete('step');}
    window.history.replaceState(window.history.state, '', url.toString());
  };
  return <section className={styles.wizard} aria-label="Minecraft installation guide">
    <h1>Install or Upgrade</h1>
    {!computer ? <>
      <h2 ref={heading} tabIndex={-1}>Which computer do you use?</h2>
      <p>Choose one. We will show you one step at a time, all the way to joining Survivors United.</p>
      <div className={styles.choices}>
        <button type="button" className={styles.choice} onClick={() => move('windows', 1)}><strong>I use Windows →</strong><span>Windows PC or laptop</span></button>
        <button type="button" className={styles.choice} onClick={() => move('mac', 1)}><strong>I use a Mac →</strong><span>MacBook, iMac, or another Apple Mac</span></button>
      </div>
      <p>For both <strong>first-time installs</strong> and <strong>upgrades from 1.21.8 or another older version</strong>.</p>
      <p>You need internet access and a Microsoft account that owns <strong>Minecraft: Java Edition</strong>. This setup is for computers, including both Apple silicon and Intel Macs.</p>
    </> : <>
      <div className={styles.progress}><span>{computer === 'windows' ? 'Windows' : 'Mac'} · Step {step} of {titles.length}</span>{initialComputer ? <Link to="/docs/minecraft/installation">Change computer</Link> : <button type="button" className={styles.textButton} onClick={() => move(null, 1)}>Change computer</button>}</div>
      <progress max={titles.length} value={step} aria-label={`Step ${step} of ${titles.length}`}/>
      <h2 ref={heading} tabIndex={-1}>({step}) {titles[step - 1]}</h2>
      <div key={`${computer}-${step}`}><Step computer={computer} step={step}/></div>
      <div className={styles.navigation}>
        <button type="button" className="button button--secondary" disabled={step === 1} onClick={() => move(computer, step - 1)}>← Back</button>
        {step < titles.length ? <button type="button" className="button button--primary" onClick={() => move(computer, step + 1)}>Next →</button> : <Link className="button button--primary" to="/docs/minecraft/first-steps/things-to-do-first">What to do after joining →</Link>}
      </div>
      <p className={styles.caption}>Finish the actions above, then choose Next. Back lets you check an earlier step.</p>
    </>}
    <p className={styles.support}><Link to="/docs/minecraft/server/discord">Ask us for help on Discord</Link>{computer && <> — tell us {computer === 'windows' ? 'Windows' : 'Mac'}, step {step}, and the exact message you see.</>}</p>
    <noscript>This guide needs JavaScript to show the steps. Enable JavaScript in your browser, or contact us using the support link above.</noscript>
  </section>;
}
