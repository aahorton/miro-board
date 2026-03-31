import { ArrowRightIcon, StickerIcon } from "lucide-react";

import { useNodes } from "./model/nodes";
import { useCanvasRect } from "./hooks/use-canvas-rect";
import { useLayoutFocus } from "./hooks/use-layout-focus";
import { useViewModel } from "./view-model/use-view-model";
import { useWindowEvents } from "./hooks/use-window-events";
import { SelectionWindow } from "./ui/selection-window";
import { Overlay } from "./ui/overlay";
import { Layout } from "./ui/layout";
import { Dots } from "./ui/dots";
import { Canvas } from "./ui/canvas";
import { Sticker } from "./ui/nodes/sticker";
import { Actions } from "./ui/actions";
import { ActionButton } from "./ui/action-button";
import { useNodesDimensions } from "./hooks/use-nodes-dimensions";
import { useWindowPositionModel } from "./model/window-position";
import { Arrow } from "./ui/nodes/arrow";
import { useCallback, useMemo, useRef } from "react";
import { createRectFromDimensions, isRectsIntersecting } from "./domain/rect";
import { Profiler } from "react";

export function useEventCallback<
  T extends ((...args: never[]) => void) | undefined,
>(fn: T): T {
  const ref = useRef(fn);

  ref.current = fn;

  return useCallback((...args: never[]) => ref.current?.(...args), []) as T;
}

function BoardPage() {
  const nodesModel = useNodes();
  const windowPositionModel = useWindowPositionModel();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { nodeRef, nodesDimensions } = useNodesDimensions();

  performance.mark("compute view model");
  const viewModel = useViewModel({
    nodesModel,
    canvasRect,
    nodesDimensions,
    windowPositionModel,
  });
  performance.mark("compute view model");

  useWindowEvents(viewModel);

  const windowPosition =
    viewModel.windowPosition ?? windowPositionModel.position;

  const windowRect = useMemo(
    () => ({
      x: windowPosition.x,
      y: windowPosition.y,
      width: canvasRect ? canvasRect.width / windowPosition.zoom : 0,
      height: canvasRect ? canvasRect.height / windowPosition.zoom : 0,
    }),
    [windowPosition, canvasRect],
  );

  const virtualNodes = useMemo(() => {
    return viewModel.nodes.filter((node) => {
      if (node.type === "arrow") return true;
      const nodeDimension = nodesDimensions[node.id];

      if (!nodeDimension) {
        return true;
      }
      const rect = createRectFromDimensions(node, nodeDimension);

      return isRectsIntersecting(windowRect, rect);
    });
  }, [viewModel.nodes, windowRect, nodesDimensions]);

  return (
    <Profiler id="all board" onRender={console.log}>
      <Layout ref={focusLayoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
        <Dots windowPosition={windowPosition} />

        <Canvas
          ref={canvasRef}
          overlay={
            <Overlay
              onClick={useEventCallback(viewModel.overlay?.onClick)}
              onMouseDown={useEventCallback(viewModel.overlay?.onMouseDown)}
              onMouseUp={useEventCallback(viewModel.overlay?.onMouseUp)}
            />
          }
          onClick={viewModel.canvas?.onClick}
          windowPosition={windowPosition}
        >
          <Profiler id="render sticker" onRender={console.log}>
            {useMemo(
              () =>
                virtualNodes.map((node) => {
                  if (node.type === "sticker") {
                    return <Sticker key={node.id} {...node} ref={nodeRef} />;
                  }
                  if (node.type === "arrow") {
                    return <Arrow key={node.id} {...node} ref={nodeRef} />;
                  }
                }),
              [virtualNodes, nodeRef],
            )}
          </Profiler>
          {viewModel.selectionWindow && (
            <SelectionWindow {...viewModel.selectionWindow} />
          )}
        </Canvas>

        <Actions>
          <ActionButton
            isActive={viewModel.actions?.addSticker?.isActive}
            onClick={useEventCallback(viewModel.actions?.addSticker?.onClick)}
          >
            <StickerIcon />
          </ActionButton>
          <ActionButton
            isActive={viewModel.actions?.addArrow?.isActive}
            onClick={useEventCallback(viewModel.actions?.addArrow?.onClick)}
          >
            <ArrowRightIcon />
          </ActionButton>
        </Actions>
      </Layout>
    </Profiler>
  );
}

export const Component = BoardPage;
