import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToAddArrow } from "../variants/add-arrow";
import { goToAddSticker } from "../variants/add-sticker";

export function useCommonActionsDecorator({ setViewState }: ViewModelParams) {
  return (viewModel: ViewModel): ViewModel => {
    return {
      ...viewModel,
      layout: {
        ...viewModel.layout,
        onKeyDown: (e) => {
          viewModel.layout?.onKeyDown?.(e);
          if (e.key === "s") {
            setViewState(goToAddSticker());
          }
          if (e.key === "a") {
            setViewState(goToAddArrow());
          }
        },
      },
      actions: {
        addArrow: {
          isActive: false,
          onClick: () => setViewState(goToAddArrow()),
        },
        addSticker: {
          isActive: false,
          onClick: () => setViewState(goToAddSticker()),
        },
        ...viewModel.actions,
      },
    };
  };
}
