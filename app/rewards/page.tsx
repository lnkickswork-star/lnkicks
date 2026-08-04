'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';
import {
  authService,
  canClaimDailyLogin,
  canClaimShareReward,
  claimDailyLoginReward,
  claimShareReward,
  redeemRewardPoints,
  getRewardHistory,
  getWalletHistory,
  DAILY_LOGIN_REWARD_POINTS,
  SHARE_REWARD_POINTS,
  REFERRAL_REWARD_POINTS,
  WELCOME_REWARD_POINTS,
  POINTS_TO_RUPEE_RATIO,
  MIN_REDEMPTION_POINTS,
  type RewardTransaction,
  type WalletTransaction,
} from '@/lib/auth/authService';

/**
 * RewardsPage — LN KICKS Wallet + Reward Points hub.
 *
 * Sections (top to bottom):
 *   1. Hero wallet card — wallet ₹ balance (large) + reward pts (smaller)
 *      with "Redeem Points →" CTA
 *   2. Earn Rewards grid — 3 actionable cards:
 *        a) Daily Login Bonus (+10 pts) — claim button, shows "✓ Claimed"
 *           if already claimed today
 *        b) Share & Earn (+25 pts) — uses Web Share API if available,
 *           falls back to clipboard copy. Max 1 share per day.
 *        c) Refer a Friend (+200 pts) — referral code with copy button
 *   3. How to Earn info card — explains the points-to-₹ conversion
 *      (10 pts = ₹1, min 100 pts to redeem)
 *   4. Redeem panel — input points to redeem + "Redeem ₹X" button
 *   5. Transaction History — segmented tabs (All / Rewards / Wallet)
 *      showing recent transactions with timestamps
 *
 * Auth gate: if no session, redirects to /login.
 */
export default function RewardsPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof authService.getCurrentSession> | null>(null);
  const [dailyClaimable, setDailyClaimable] = useState(false);
  const [shareClaimable, setShareClaimable] = useState(false);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [claimingShare, setClaimingShare] = useState(false);
  const [rewardHistory, setRewardHistory] = useState<RewardTransaction[]>([]);
  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>([]);
  const [redeemInput, setRedeemInput] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'rewards' | 'wallet'>('all');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const sess = authService.getCurrentSession();
    if (!sess) {
      router.replace('/login');
      return;
    }
    setSession(sess);
    setDailyClaimable(canClaimDailyLogin(sess.uid));
    setShareClaimable(canClaimShareReward(sess.uid));
    setRewardHistory(getRewardHistory(sess.uid));
    setWalletHistory(getWalletHistory(sess.uid));
  }, [router]);

  const refreshAll = () => {
    const fresh = authService.getCurrentSession();
    if (fresh) {
      setSession(fresh);
      setDailyClaimable(canClaimDailyLogin(fresh.uid));
      setShareClaimable(canClaimShareReward(fresh.uid));
      setRewardHistory(getRewardHistory(fresh.uid));
      setWalletHistory(getWalletHistory(fresh.uid));
    }
  };

  const handleClaimDaily = () => {
    if (!session?.uid || claimingDaily || !dailyClaimable) return;
    setClaimingDaily(true);
    haptic.success();
    const txn = claimDailyLoginReward(session.uid);
    if (txn) {
      showToast(`+${DAILY_LOGIN_REWARD_POINTS} reward points claimed!`);
      refreshAll();
    } else {
      showToast('Already claimed today');
    }
    setClaimingDaily(false);
  };

  const handleShare = async () => {
    if (!session?.uid || claimingShare || !shareClaimable) return;
    setClaimingShare(true);
    haptic.medium();

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?ref=${session.referralCode}` : `https://my-project-three-tau-30.vercel.app/?ref=${session.referralCode}`;
    const shareText = `Check out LN KICKS — premium sneakers in India! Use my referral code ${session.referralCode} for ₹50 welcome bonus: ${shareUrl}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'LN KICKS — Premium Sneakers',
          text: shareText,
          url: shareUrl,
        });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        showToast('Referral link copied to clipboard');
      } else {
        showToast('Share not supported — link copied');
      }
    } catch (e) {
      // User cancelled share — don't show error
    }

    // Credit reward after share attempt (anti-abuse: 1/day max)
    const txn = claimShareReward(session.uid);
    if (txn) {
      haptic.success();
      showToast(`+${SHARE_REWARD_POINTS} reward points for sharing!`);
      refreshAll();
    }
    setClaimingShare(false);
  };

  const handleCopyCode = async () => {
    if (!session?.referralCode) return;
    haptic.light();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(session.referralCode);
        setCopiedCode(true);
        showToast('Referral code copied');
        setTimeout(() => setCopiedCode(false), 1800);
      }
    } catch {
      showToast('Copy failed — please copy manually');
    }
  };

  const handleRedeem = () => {
    if (!session?.uid || redeeming) return;
    const pts = parseInt(redeemInput, 10);
    if (isNaN(pts) || pts < MIN_REDEMPTION_POINTS) {
      haptic.error();
      showToast(`Minimum ${MIN_REDEMPTION_POINTS} points required to redeem`);
      return;
    }
    if (pts > (session.rewardPoints || 0)) {
      haptic.error();
      showToast('Insufficient reward points');
      return;
    }
    setRedeeming(true);
    haptic.success();
    const result = redeemRewardPoints(session.uid, pts);
    if (result.ok) {
      const rupees = Math.floor(pts / POINTS_TO_RUPEE_RATIO);
      showToast(`Redeemed ${pts} pts → ₹${rupees} added to wallet`);
      setRedeemInput('');
      refreshAll();
    } else {
      showToast(result.error);
    }
    setRedeeming(false);
  };

  const redemptionPreview = useMemo(() => {
    const pts = parseInt(redeemInput, 10);
    if (isNaN(pts) || pts < POINTS_TO_RUPEE_RATIO) return 0;
    return Math.floor(pts / POINTS_TO_RUPEE_RATIO);
  }, [redeemInput]);

  const combinedHistory = useMemo(() => {
    const r = rewardHistory.map((t) => ({
      kind: 'reward' as const,
      id: t.id,
      type: t.type,
      amount: t.points,
      description: t.description,
      createdAt: t.createdAt,
    }));
    const w = walletHistory.map((t) => ({
      kind: 'wallet' as const,
      id: t.id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      createdAt: t.createdAt,
    }));
    const all = [...r, ...w].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (activeTab === 'rewards') return all.filter((x) => x.kind === 'reward');
    if (activeTab === 'wallet') return all.filter((x) => x.kind === 'wallet');
    return all;
  }, [rewardHistory, walletHistory, activeTab]);

  if (!hydrated || !session) {
    return (
      <MobileLayout headerVariant="back" title="Rewards & Wallet">
        <div style={{ padding: 40, textAlign: 'center', color: theme.colors.textSecondary }}>Loading…</div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerVariant="back" title="Rewards & Wallet"
      desktopBreadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'My Account', href: '/account' },
        { label: 'Rewards & Wallet' },
      ]}
      desktopMaxWidth={1024}
    >
      <div style={{ padding: `0 ${theme.spacing.pad}px ${theme.spacing.xxl + 12}px` }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {/* ── HERO WALLET CARD ──────────────────────────────────── */}
          <div
            style={{
              background: theme.colors.black,
              color: theme.colors.white,
              borderRadius: theme.radius.hero,
              padding: `${theme.spacing.xxl + 4}px ${theme.spacing.xxl}px`,
              marginBottom: theme.spacing.lg,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                right: -30,
                top: -30,
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                LN KICKS Wallet
              </div>
              <div style={{ fontFamily: theme.fontFamily.display, fontSize: 44, fontWeight: 900, marginTop: 6, letterSpacing: '-0.02em', lineHeight: 1 }}>
                ₹{session.walletBalance || 0}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
                + {session.rewardPoints || 0} reward points
              </div>

              <div
                style={{
                  marginTop: theme.spacing.lg,
                  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: theme.radius.lg,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14 }}>💡</span>
                <span>{POINTS_TO_RUPEE_RATIO} pts = ₹1 · Min {MIN_REDEMPTION_POINTS} pts to redeem</span>
              </div>
            </div>
          </div>

          {/* ── EARN REWARDS GRID ─────────────────────────────────── */}
          <SectionHeading>Earn Rewards</SectionHeading>
          <div style={{ display: 'grid', gap: 10, marginBottom: theme.spacing.lg }}>
            {/* Daily Login */}
            <EarnCard
              icon="🎁"
              title="Daily Login Bonus"
              sub={`Claim ${DAILY_LOGIN_REWARD_POINTS} points every day you visit`}
              reward={`+${DAILY_LOGIN_REWARD_POINTS} pts`}
              ctaLabel={dailyClaimable ? (claimingDaily ? 'Claiming…' : 'Claim Now') : '✓ Claimed Today'}
              ctaDisabled={!dailyClaimable || claimingDaily}
              ctaOnClick={handleClaimDaily}
              highlight={dailyClaimable}
            />

            {/* Share & Earn */}
            <EarnCard
              icon="📤"
              title="Share & Earn"
              sub={`Share LN KICKS with friends — earn ${SHARE_REWARD_POINTS} pts (max 1/day)`}
              reward={`+${SHARE_REWARD_POINTS} pts`}
              ctaLabel={shareClaimable ? (claimingShare ? 'Sharing…' : 'Share Now') : '✓ Shared Today'}
              ctaDisabled={!shareClaimable || claimingShare}
              ctaOnClick={handleShare}
              highlight={shareClaimable}
            />

            {/* Refer a Friend */}
            <div
              style={{
                background: theme.colors.white,
                border: `1px solid ${theme.colors.grey150}`,
                borderRadius: theme.radius.xl,
                padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: theme.colors.grey100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                👥
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: theme.fontFamily.display, fontSize: theme.fontSize.md, fontWeight: 700 }}>
                  Refer a Friend
                </div>
                <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                  Both get {REFERRAL_REWARD_POINTS} pts when they sign up
                </div>
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <code
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 13,
                      fontWeight: 700,
                      padding: '4px 10px',
                      background: theme.colors.grey100,
                      borderRadius: 6,
                      letterSpacing: '0.04em',
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {session.referralCode}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="pressable"
                    aria-label="Copy referral code"
                    style={{
                      padding: '6px 10px',
                      background: copiedCode ? theme.colors.success : theme.colors.black,
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedCode ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: theme.colors.success,
                  padding: '4px 8px',
                  background: 'rgba(20,83,45,0.08)',
                  borderRadius: 999,
                  flexShrink: 0,
                }}
              >
                +{REFERRAL_REWARD_POINTS} pts
              </div>
            </div>
          </div>

          {/* ── REDEEM PANEL ──────────────────────────────────────── */}
          <SectionHeading>Redeem Points</SectionHeading>
          <div
            style={{
              background: theme.colors.white,
              border: `1px solid ${theme.colors.grey150}`,
              borderRadius: theme.radius.hero,
              padding: theme.spacing.xl,
              marginBottom: theme.spacing.lg,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: theme.colors.textSecondary }}>Available</div>
              <div style={{ fontFamily: theme.fontFamily.display, fontSize: 18, fontWeight: 800 }}>
                {session.rewardPoints || 0} pts
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                inputMode="numeric"
                min={MIN_REDEMPTION_POINTS}
                step={POINTS_TO_RUPEE_RATIO}
                value={redeemInput}
                onChange={(e) => setRedeemInput(e.target.value)}
                placeholder={`min ${MIN_REDEMPTION_POINTS}`}
                aria-label="Points to redeem"
                style={{
                  flex: 1,
                  padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                  borderRadius: theme.radius.lg,
                  border: `1px solid ${theme.colors.grey300}`,
                  fontSize: theme.fontSize.body,
                  fontFamily: theme.fontFamily.body,
                  color: theme.colors.textPrimary,
                  background: theme.colors.white,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={handleRedeem}
                disabled={redeeming || !redeemInput}
                className="pressable-strong"
                aria-label="Redeem points for wallet cash"
                style={{
                  padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
                  background: redeeming ? theme.colors.grey400 : theme.colors.black,
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: theme.radius.lg,
                  fontFamily: theme.fontFamily.display,
                  fontSize: theme.fontSize.sm,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: redeeming ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {redeeming ? 'Redeeming…' : redemptionPreview > 0 ? `Redeem ₹${redemptionPreview}` : 'Redeem'}
              </button>
            </div>
            <div style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 8 }}>
              Conversion: {POINTS_TO_RUPEE_RATIO} pts = ₹1 · Minimum {MIN_REDEMPTION_POINTS} pts per redemption
            </div>
          </div>

          {/* ── HOW TO EARN INFO ──────────────────────────────────── */}
          <SectionHeading>How It Works</SectionHeading>
          <div
            style={{
              background: theme.colors.grey50,
              border: `1px solid ${theme.colors.grey150}`,
              borderRadius: theme.radius.hero,
              padding: theme.spacing.xl,
              marginBottom: theme.spacing.lg,
            }}
          >
            <InfoRow icon="🎁" title="Welcome Bonus" desc={`${WELCOME_REWARD_POINTS} pts + ₹${50} wallet credit on signup`} />
            <InfoRow icon="📅" title="Daily Login" desc={`${DAILY_LOGIN_REWARD_POINTS} pts every day you visit (claim button on dashboard)`} />
            <InfoRow icon="📤" title="Share Reward" desc={`${SHARE_REWARD_POINTS} pts per share (max 1/day to prevent abuse)`} />
            <InfoRow icon="👥" title="Referral Bonus" desc={`${REFERRAL_REWARD_POINTS} pts when a friend signs up with your code`} last />
          </div>

          {/* ── TRANSACTION HISTORY ───────────────────────────────── */}
          <SectionHeading>Transaction History</SectionHeading>
          <div
            style={{
              background: theme.colors.white,
              border: `1px solid ${theme.colors.grey150}`,
              borderRadius: theme.radius.hero,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', borderBottom: `1px solid ${theme.colors.grey150}` }}>
              {(['all', 'rewards', 'wallet'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { haptic.light(); setActiveTab(tab); }}
                  style={{
                    flex: 1,
                    padding: `${theme.spacing.md}px ${theme.spacing.sm}px`,
                    background: activeTab === tab ? theme.colors.white : theme.colors.grey50,
                    border: 'none',
                    borderBottom: activeTab === tab ? `2px solid ${theme.colors.black}` : '2px solid transparent',
                    fontFamily: theme.fontFamily.display,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: activeTab === tab ? theme.colors.textPrimary : theme.colors.textSecondary,
                    cursor: 'pointer',
                  }}
                >
                  {tab === 'all' ? 'All' : tab === 'rewards' ? 'Reward Pts' : 'Wallet ₹'}
                </button>
              ))}
            </div>

            {combinedHistory.length === 0 ? (
              <div style={{ padding: `${theme.spacing.xxl}px ${theme.spacing.lg}px`, textAlign: 'center', color: theme.colors.textTertiary, fontSize: 13 }}>
                No transactions yet — start earning to see your history here.
              </div>
            ) : (
              combinedHistory.slice(0, 30).map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.md,
                    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
                    borderBottom: `1px solid ${theme.colors.grey100}`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: t.amount >= 0 ? theme.colors.grey100 : 'rgba(127,29,29,0.08)',
                      color: t.amount >= 0 ? theme.colors.textPrimary : theme.colors.error,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {t.kind === 'reward' ? '⭐' : '₹'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </div>
                    <div style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 2 }}>
                      {formatDate(t.createdAt)} · {t.type}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: theme.fontFamily.display,
                      fontSize: 14,
                      fontWeight: 800,
                      color: t.amount >= 0 ? theme.colors.success : theme.colors.error,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.kind === 'reward' ? `${t.amount >= 0 ? '+' : ''}${t.amount} pts` : `${t.amount >= 0 ? '+' : ''}₹${t.amount}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{pressableStyle}</style>
      <style jsx>{`
        .rwd-earn-cta:active { transform: scale(0.97); }
        .rwd-earn-cta:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>
    </MobileLayout>
  );
}

/* ─── helpers ─────────────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: theme.colors.textSecondary,
        marginBottom: 10,
        marginTop: 4,
      }}
    >
      {children}
    </div>
  );
}

function EarnCard({
  icon,
  title,
  sub,
  reward,
  ctaLabel,
  ctaDisabled,
  ctaOnClick,
  highlight,
}: {
  icon: string;
  title: string;
  sub: string;
  reward: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  ctaOnClick: () => void;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: theme.colors.white,
        border: `1px solid ${highlight ? theme.colors.black : theme.colors.grey150}`,
        borderRadius: theme.radius.xl,
        padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        boxShadow: highlight ? '0 4px 14px rgba(17,17,17,0.08)' : 'none',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: highlight ? theme.colors.black : theme.colors.grey100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: theme.fontFamily.display, fontSize: theme.fontSize.md, fontWeight: 700 }}>
            {title}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '2px 7px',
              borderRadius: 999,
              background: 'rgba(20,83,45,0.1)',
              color: theme.colors.success,
            }}
          >
            {reward}
          </span>
        </div>
        <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
          {sub}
        </div>
      </div>
      <button
        type="button"
        onClick={ctaOnClick}
        disabled={ctaDisabled}
        className="pressable-strong rwd-earn-cta"
        style={{
          padding: `${theme.spacing.sm + 2}px ${theme.spacing.lg}px`,
          background: ctaDisabled ? theme.colors.grey200 : (highlight ? theme.colors.black : theme.colors.white),
          color: ctaDisabled ? theme.colors.textSecondary : (highlight ? theme.colors.white : theme.colors.textPrimary),
          border: ctaDisabled ? 'none' : `1px solid ${theme.colors.black}`,
          borderRadius: theme.radius.pill,
          fontFamily: theme.fontFamily.display,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: ctaDisabled ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function InfoRow({ icon, title, desc, last }: { icon: string; title: string; desc: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: theme.spacing.md,
        paddingBottom: last ? 0 : theme.spacing.md,
        marginBottom: last ? 0 : theme.spacing.md,
        borderBottom: last ? 'none' : `1px solid ${theme.colors.grey150}`,
      }}
    >
      <div style={{ fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.colors.textPrimary }}>{title}</div>
        <div style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
