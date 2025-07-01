interface Emotions {
    pose: number[];
    expression: number[];
}

type IEmotionBookmark = Record<string, Emotions>;
export default IEmotionBookmark;
