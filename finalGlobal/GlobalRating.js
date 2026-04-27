// @flow
import React from 'react';
import Style from './GlobalRating.style';

// ─── Types ────────────────────────────────────────────────────────────────────

type AssessmentRow = {
  category: string,
  rating: string | null,
};

type PropsType = {
  initiative: Object,
};

// ─── Config ───────────────────────────────────────────────────────────────────

// Map backend values → display labels and colors
const RATING_CONFIG: { [string]: { label: string, color: string } } = {
  'VERY LOW':  { label: 'VL', color: '#4CAF50' },
  'LOW':       { label: 'L',  color: '#2E7D32' },
  'MEDIUM':    { label: 'M',  color: '#FFC107' },
  'HIGH':      { label: 'H',  color: '#FF5722' },
  'VERY HIGH': { label: 'VH', color: '#F44336' },
};

// Ordered list for the 5 dots scale
const RATING_ORDER = ['VERY LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];

// Categories to display with yellow badge
const YELLOW_CATEGORIES = ['finance', 'compliance'];

// ─── Sub-components ───────────────────────────────────────────────────────────

const RatingDots = ({ active }: { active: string | null }) => {
  const activeIndex = active ? RATING_ORDER.indexOf(active.toUpperCase()) : -1;

  return (
    <Style.DotsRow>
      {RATING_ORDER.map((level, i) => {
        const isActive = i === activeIndex;
        const config = RATING_CONFIG[level];
        return (
          <Style.Dot
            key={level}
            isActive={isActive}
            color={isActive ? config.color : '#e0e0e0'}
          >
            {isActive ? config.label : ''}
          </Style.Dot>
        );
      })}
    </Style.DotsRow>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const GlobalRating = ({ initiative }: PropsType) => {
  // Data comes directly from initiative prop (loaded by getOneInitiativePipeline)
  const assessments: AssessmentRow[] = initiative?.global_ratings || [];

  return (
    <Style.Container>
      <Style.SectionTitle>ASSESSMENTS</Style.SectionTitle>

      <Style.Table>
        {assessments.map((row) => (
          <Style.Row key={row.category}>
            <Style.EmptyCell />
            <Style.CategoryBadge
              categoryColor={
                YELLOW_CATEGORIES.includes(row.category.toLowerCase())
                  ? 'yellow'
                  : 'grey'
              }
            >
              {row.category}
            </Style.CategoryBadge>
            <RatingDots active={row.rating} />
            <Style.EmptyCell />
          </Style.Row>
        ))}

        {assessments.length === 0 && (
          <Style.EmptyState>No assessments available.</Style.EmptyState>
        )}
      </Style.Table>
    </Style.Container>
  );
};

export default GlobalRating;
