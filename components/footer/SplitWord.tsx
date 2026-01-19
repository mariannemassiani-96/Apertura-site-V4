function SplitWord({ text }: { text: string }) {
  return (
    <span
      data-ap-word
      aria-label={text}
      className="relative block text-[14vw] font-semibold leading-none tracking-tight text-ivoire"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {Array.from(text).map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            data-ap-char
            className="inline-block will-change-transform"
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
