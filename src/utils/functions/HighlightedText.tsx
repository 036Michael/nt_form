export const HighlightedText = ({ text, highlight }: any) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part: any, index: number) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={index}>{part}</mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};
