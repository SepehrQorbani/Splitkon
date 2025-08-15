import { numberToWords as numberToWordsFa } from "@persian-tools/persian-tools";

export const numberToWordsEn = (num: number): string => {
    if (num === 0) return "zero";

    const smallNumbers = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];
    const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];
    const scales = ["", "thousand", "million", "billion", "trillion"];

    const convertChunk = (num: number) => {
        let str = "";
        if (num >= 100) {
            const h = Math.floor(num / 100);
            str += smallNumbers[h] + " hundred";
            num %= 100;
            if (num) str += " ";
        }
        if (num >= 20) {
            const t = Math.floor(num / 10);
            str += tens[t];
            num %= 10;
            if (num) str += "-" + smallNumbers[num];
        } else if (num > 0) {
            str += smallNumbers[num];
        }
        return str;
    };

    let words: string[] = [];
    let scale = 0;
    while (num > 0) {
        const chunk = num % 1000;
        if (chunk) {
            words.unshift(
                `${convertChunk(chunk)}${
                    scales[scale] ? " " + scales[scale] : ""
                }`
            );
        }
        num = Math.floor(num / 1000);
        scale++;
    }

    return words.join(", ").trim();
};

export const numberToWords = (num: number, locale: string) => {
    return locale.startsWith("fa")
        ? numberToWordsFa(num)?.toString()
        : numberToWordsEn(num);
};
