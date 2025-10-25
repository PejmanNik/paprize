export const SplitResult = {
    None: 0, // The node fits completely on the page, no further splitting required.
    FullNodePlaced: 1, // The entire node was placed on the page, continue with the next sibling or element.
    SplitChildren: 2, // The node is too large for the page, and its children must be paginated individually.
} as const;

export type SplitResult = (typeof SplitResult)[keyof typeof SplitResult];
