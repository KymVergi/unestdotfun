import type { Metadata } from 'next';
import Section, { PageHero } from '@/components/layout/Section/Section';
import Panel from '@/components/pixel/Panel/Panel';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import { NETWORK_NAME } from '@/config/contracts';
import { SITE_NAME, X_HANDLE, X_URL } from '@/config/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Terms & Risk',
  description:
    'What UNEST is, what it is not, and the risks of interacting with it. No guarantees, no promised returns.',
};

const RISKS = [
  {
    title: 'TOTAL LOSS IS POSSIBLE',
    body: 'Interacting with any on-chain protocol can result in the complete loss of the assets involved. $UNEST can lose all of its value. EGGs can become worthless.',
  },
  {
    title: 'EGGS CAN BE BURNED',
    body: 'Backing is continuous. If a wallet stops holding enough $UNEST to back the EGGs it owns, the unsupported EGGs are burned according to protocol rules. This is a designed mechanic, not a bug.',
  },
  {
    title: 'HATCHING IS IRREVERSIBLE',
    body: 'Hatching burns $UNEST and permanently writes a creature. There is no undo and no refund.',
  },
  {
    title: 'EVOLUTION CAN FAIL',
    body: 'Evolution has a published probability of failure. The fuel is spent either way.',
  },
  {
    title: 'REWARDS ARE NOT GUARANTEED',
    body: 'Fee distribution depends entirely on pool activity. There is no minimum, no fixed rate and no APR. A creature can be perfectly fed and still earn nothing if the pool is quiet.',
  },
  {
    title: 'SMART CONTRACT RISK',
    body: 'The contracts may contain bugs. They are not represented as audited unless an audit is published with the evidence attached.',
  },
  {
    title: 'NO CUSTODY, NO RECOVERY',
    body: 'This interface never holds your keys or your assets. Nobody can reverse a transaction you signed or recover a wallet you lose access to.',
  },
];

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="BEFORE YOU TOUCH ANYTHING"
        title="TERMS & RISK"
        lead={
          <p>
            {SITE_NAME} is experimental software on {NETWORK_NAME}. Read this page as if it were
            written for someone about to lose money, because it was.
          </p>
        }
      />

      <Section width="narrow" size="md">
        <div className={styles.stack}>
          <Panel title="WHAT THIS IS" tone="terminal">
            <p className={styles.p}>
              {SITE_NAME} is an interface to a set of smart contracts. <strong>$UNEST</strong> is an
              ERC-20 token. <strong>EGG</strong> is an ERC-721 NFT. This website does not sell
              either of them, does not hold your assets, does not take custody of anything, and
              cannot execute a transaction you have not signed yourself.
            </p>
          </Panel>

          <Panel title="WHAT THIS IS NOT" tone="barn">
            <ul className={styles.negatives}>
              <li>Not financial, investment, legal or tax advice.</li>
              <li>Not a security, a fund, a deposit or a yield product.</li>
              <li>Not audited, unless an audit is published on the Contracts page.</li>
              <li>Not risk free.</li>
              <li>Not a promise of any return, of any size, at any time.</li>
            </ul>
          </Panel>

          <div>
            <h2 className={styles.heading}>RISKS</h2>
            <ul className={styles.risks}>
              {RISKS.map((r) => (
                <li key={r.title}>
                  <span className={styles.riskTitle}>{r.title}</span>
                  <span className={styles.riskBody}>{r.body}</span>
                </li>
              ))}
            </ul>
          </div>

          <Panel title="YOUR RESPONSIBILITIES" tone="wood">
            <ul className={styles.duties}>
              <li>Verify every contract address on Etherscan before interacting.</li>
              <li>Confirm what you are approving. Approvals grant spending rights.</li>
              <li>
                Assume any account, message or link that is not listed on this site is not us.
              </li>
              <li>Check that your jurisdiction permits this before participating.</li>
              <li>Never spend more than you are prepared to lose entirely.</li>
            </ul>
          </Panel>

          <Panel title="OFFICIAL CHANNELS" tone="green">
            <p className={styles.p}>
              The only accounts and addresses that belong to {SITE_NAME} are the ones published on
              this website. Anything else is impersonation, however convincing it looks.
            </p>
            <p className={styles.channels}>
              <a href={X_URL} target="_blank" rel="noopener noreferrer">
                {X_HANDLE}
              </a>
            </p>
          </Panel>

          <p className={styles.foot}>
            By using this interface you accept that you do so at your own risk, that no warranty of
            any kind is given, and that the authors are not liable for any loss arising from its
            use.
          </p>

          <div className={styles.actions}>
            <PixelLink href="/contracts" size="md">
              VERIFY THE CONTRACTS
            </PixelLink>
            <PixelLink href="/docs#security" size="md" variant="ghost">
              SECURITY NOTES
            </PixelLink>
          </div>
        </div>
      </Section>
    </>
  );
}
