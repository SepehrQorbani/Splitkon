interface AvatarItem {
    id: string;
    avatar: string;
}
type AvatarItems = {
    name: string;
    children: AvatarItem[];
}[];

const monsters: AvatarItem[] = Array.from({ length: 15 }, (_, i) => ({
    id: `Monster${(i + 1).toString()}`,
    avatar: `/images/avatars/monsters/monster-${(i + 1)
        .toString()
        .padStart(2, "0")}.png`,
}));
const slimes: AvatarItem[] = Array.from({ length: 9 }, (_, i) => ({
    id: `Slime${(i + 1).toString()}`,
    avatar: `/images/avatars/slimes/slime-${(i + 1)
        .toString()
        .padStart(2, "0")}.png`,
}));
const animojies: AvatarItem[] = Array.from({ length: 73 }, (_, i) => ({
    id: `Avatar${(i + 1).toString()}`,
    avatar: `/images/avatars/animojies/animoji-${(i + 1)
        .toString()
        .padStart(2, "0")}.png`,
}));

export const avatarCollections: AvatarItems = [
    {
        name: "None",
        children: [{ id: "none", avatar: "" }],
    },
    {
        name: "Monsters",
        children: monsters,
    },
    {
        name: "Slimes",
        children: slimes,
    },
    {
        name: "Animojies",
        children: animojies,
    },
];
