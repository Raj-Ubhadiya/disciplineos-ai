# Phase 13 - Analytics Integration Notes

## What We Built

This phase connects newer modules into analytics and today planning.

Updated backend features:

- Analytics now includes focus session minutes.
- Analytics now includes distraction-free focus sessions.
- Analytics now includes daily reflection count.
- Analytics now includes average reflection score.
- Today Focus Plan now knows how many focused minutes were already logged today.
- Today Focus Plan can include the latest reflection commitment.

Updated frontend features:

- Analytics card shows focus minutes.
- Analytics card shows average reflection score.
- Analytics card shows distraction-free session count.
- Today Focus Plan shows progress like `45/90m`.

## Why We Built It

Earlier modules worked independently.

This phase makes the product feel connected:

```text
Focus sessions + reflections + distractions -> analytics -> better daily plan
```

That is how real products evolve. New features should feed back into the user's decision loop.

## Important Architecture Idea

Analytics is a derived read model.

It reads existing tables and calculates a summary.

We did not add a new analytics table because the current metrics can be calculated from existing data.

## Focus Score Update

The score now rewards:

- Active goals
- Habits
- Habit completions
- Streaks
- Accountability check-ins
- AI plans
- Focus session minutes
- Distraction-free sessions
- Daily reflections
- Reflection quality score

The score still penalizes distraction minutes.

## Interview Explanation

You can explain it like this:

After adding focus sessions and daily reflections, I updated the analytics service to include those signals in the focus score. I kept analytics as a derived read model, so it queries multiple Prisma models and calculates the result dynamically. I also updated Today Focus Plan so today's logged focus minutes and yesterday's reflection commitment influence the next recommended actions.

## Files To Revise

- `apps/api/src/analytics/analytics.service.ts`
- `apps/api/src/daily-plan/daily-plan.service.ts`
- `apps/web/src/components/app-dashboard.tsx`
- `packages/types/src/index.ts`

## Future Improvements

- Weekly analytics charts.
- Historical analytics snapshots.
- Trend comparison between distraction minutes and focus minutes.
- Separate scoring weights per user preference.
