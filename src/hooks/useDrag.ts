import { useCallback, useEffect, useState, RefObject } from "react";

export const useDrag = ({ ref, calculateFor = "topLeft" }: {ref: RefObject<any>, calculateFor?: string}) => {
  const [dragInfo, setDragInfo] = useState<any>();
  const [finalPosition, setFinalPosition] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);

  const updateFinalPosition = useCallback(
    (width: number, height: number, x: number, y: number) => {
      if (calculateFor === "bottomRight") {
        setFinalPosition({
          x: Math.max(
            Math.min(
              window.innerWidth - width,
              window.innerWidth - (x + width)
            ),
            0
          ),
          y: Math.max(
            Math.min(
              window.innerHeight - height,
              window.innerHeight - (y + height)
            ),
            0
          )
        });

        return;
      }

      setFinalPosition({
        x: Math.min(Math.max(0, x), window.innerWidth - width),
        y: Math.min(Math.max(0, y), window.innerHeight - height)
      });
    },
    [calculateFor]
  );

  const handleMouseUp = (evt: MouseEvent) => {
    evt.preventDefault();

    setIsDragging(false);
  };

  const handleMouseDown = (evt: MouseEvent) => {
    evt.preventDefault();

    const { clientX, clientY } = evt;
    const { current: draggableElement } = ref;

    if (!draggableElement) {
      return;
    }

    const {
      top,
      left,
      width,
      height
    } = draggableElement.getBoundingClientRect();

    setIsDragging(true);
    setDragInfo({
      startX: clientX,
      startY: clientY,
      top,
      left,
      width,
      height
    });
  };

  const handleMouseMove = useCallback(
    (evt: MouseEvent) => {
      const { current: draggableElement } = ref;

      if (!isDragging || !draggableElement) return;

      evt.preventDefault();

      const { clientX, clientY } = evt;

      const position = {
        x: dragInfo.startX - clientX,
        y: dragInfo.startY - clientY
      };

      const { top, left, width, height } = dragInfo;

      updateFinalPosition(width, height, left - position.x, top - position.y);
    },
    [isDragging, dragInfo, ref, updateFinalPosition]
  );

  const recalculate = (width: number, height: number) => {
    const { current: draggableElement } = ref;
    const {
      top,
      left,
      width: boundingWidth,
      height: boundingHeight
    } = draggableElement.getBoundingClientRect();

    updateFinalPosition(
      width ?? boundingWidth,
      height ?? boundingHeight,
      left,
      top
    );
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return {
    position: finalPosition,
    handleMouseDown,
    recalculate
  };
};
