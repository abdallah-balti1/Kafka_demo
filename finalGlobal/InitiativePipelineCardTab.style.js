// @flow
// ... keep all your existing styles and ADD / REPLACE these:

BottomContainer: styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: ${Grid(4)};
`,

GlobalRatingContainer: styled.div`
  flex: 2;          /* 2/4 of screen */
  min-width: 0;
`,

CommunityContainer: styled.div`
  flex: 1;          /* 1/4 of screen */
  min-width: 0;
`,

EmptyContainer: styled.div`
  flex: 1;          /* 1/4 empty */
`,
