export const splitAt = (subject: string, index: number): readonly [string, string] => {
    if (index < 0) {
        return [subject, ''];
    }

    if (index > subject.length) {
        return [subject, ''];
    }

    return [subject.slice(0, index), subject.slice(index + 1)];
};

export const toSlug = (subject: string) => {
    return subject.toLowerCase().replaceAll(' ', '-');
};