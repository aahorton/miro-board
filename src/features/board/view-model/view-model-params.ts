import { Dispatch } from "react";
import { CanvasRect } from "../hooks/use-canvas-rect";
import { NodesModel } from "../model/nodes";

import { SetStateAction } from "react";
import { ViewState } from "./use-view-model";
import { NodesDimensionsMap } from "../hooks/use-nodes-dimensions";
import { WindowPositionModel } from "../model/window-position";

export type ViewModelParams = {
  setViewState: Dispatch<SetStateAction<ViewState>>;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
  nodesDimensions: NodesDimensionsMap;
  windowPositionModel: WindowPositionModel;
};
