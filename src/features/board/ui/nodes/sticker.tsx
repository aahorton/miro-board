/* eslint-disable @typescript-eslint/no-empty-object-type */
import clsx from "clsx";
import React, { FC, memo, Ref, useLayoutEffect, useRef, useState } from "react";
import { useEventCallback } from "../../board.page";

export const Sticker = withMemoCallbacks(
  function Sticker({
    id,
    text,
    x,
    y,
    onClick,
    ref,
    isSelected,
    isEditing,
    onTextChange,
    onMouseDown,
    onMouseUp,
  }: {
    id: string;
    ref: Ref<HTMLButtonElement>;
    text: string;
    x: number;
    y: number;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isSelected?: boolean;
    isEditing?: boolean;
    onTextChange?: (text: string) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) {
    return (
      <button
        data-id={id}
        ref={ref}
        className={clsx(
          "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md text-left",
          isSelected && "outline outline-2 outline-blue-500 ",
        )}
        style={{ transform: `translate(${x}px, ${y}px)` }}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <TextareaAutoSize
          isEditing={isEditing ?? false}
          value={text}
          onChange={(value) => onTextChange?.(value)}
        />
      </button>
    );
  },
  ["onMouseUp", "onMouseDown", "onTextChange", "onClick"],
);

const TextareaAutoSize = memo(function TextareaAutoSize({
  value,
  onChange,
  isEditing,
}: {
  isEditing: boolean;
  value: string;
  onChange?: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const { scrollWidth, clientHeight } = ref.current;
    setHeight(clientHeight);
    setWidth(scrollWidth);
  }, [value]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className={clsx("whitespace-pre-wrap ", isEditing && "opacity-0")}
      >
        {value}
      </div>
      {isEditing && (
        <textarea
          className="absolute left-0 top-0 resize-none overflow-hidden focus:outline-none"
          value={value}
          autoFocus
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: width + 2,
            height: height + 2,
          }}
        />
      )}
    </div>
  );
});

function withMemoCallbacks<P = {}>(
  Component: FC<P>,
  callbacks: string[],
): FC<P> {
  const MemoComponent = memo(Component);
  return memo(function NewComponent(props: P) {
    const newProps = { ...props };
    for (const cb of callbacks) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      newProps[cb as keyof typeof newProps] = useEventCallback(
        newProps[cb as keyof typeof newProps] as never,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <MemoComponent {...(newProps as any)} />;
  });
}
