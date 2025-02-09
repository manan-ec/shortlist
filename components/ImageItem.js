"use client";

export default function ImageItem({
    imgName,
    urlPrefix,
    isChecked,
    onToggle,
    containerClass,
    imageClass
}) {
    const imageUrl = `${urlPrefix}${imgName}`;

    return (
        <div className={`${containerClass} ${isChecked ? 'selected' : ''}`}>
            <label>
                <img src={imageUrl} alt={imgName} className={imageClass} />
                <input type="checkbox" checked={isChecked} onChange={() => onToggle(imgName)} />
            </label>
        </div>
    );
}
