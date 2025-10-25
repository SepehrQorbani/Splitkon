import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface RecentGroup {
    id: number;
    title: string;
    edit_token?: string | null;
    view_token?: string;
    lastAccessed: number;
}

interface RecentGroupsState {
    recentGroups: Record<string, RecentGroup>;
    addRecentGroup: (group: Omit<RecentGroup, "lastAccessed">) => void;
    removeRecentGroup: (id: string) => void;
    getRecentGroup: (id: string) => RecentGroup | undefined;
}

export const useRecentGroupsStore = create<RecentGroupsState>()(
    persist(
        (set, get) => ({
            recentGroups: {},

            addRecentGroup: (group) => {
                const now = Date.now();
                set((state) => {
                    const existing = state.recentGroups[group.id];

                    // اگر گروه قبلاً وجود داشت، فیلدها رو با هوشمندی merge کن
                    const mergedGroup: RecentGroup = {
                        id: group.id,
                        title: group.title, // اسم معمولاً همیشه بروز هست
                        lastAccessed: now,

                        // edit_token: فقط اگر جدید معتبر باشه، آپدیت بشه؛ وگرنه قبلی حفظ بشه
                        edit_token:
                            group.edit_token != null && group.edit_token !== ""
                                ? group.edit_token
                                : existing?.edit_token ?? null,

                        // view_token: همیشه آپدیت بشه (چون همیشه از URL میاد)
                        view_token:
                            group.view_token ?? existing?.view_token ?? "",
                    };

                    return {
                        recentGroups: {
                            ...state.recentGroups,
                            [group.id]: mergedGroup,
                        },
                    };
                });
            },
            // addRecentGroup: (group) => {
            //     const now = Date.now();
            //     const groupWithTimestamp = {
            //         ...group,
            //         lastAccessed: now,
            //     };
            //     set((state) => ({
            //         recentGroups: {
            //             ...state.recentGroups,
            //             [group.id]: groupWithTimestamp,
            //         },
            //     }));
            // },

            removeRecentGroup: (id) =>
                set((state) => {
                    const { [id]: _, ...rest } = state.recentGroups;
                    return { recentGroups: rest };
                }),

            getRecentGroup: (id) => get().recentGroups[id],
        }),
        {
            name: "recent-groups-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
