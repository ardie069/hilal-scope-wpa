"use client";

import type { VisibilityPoint } from "@/types/hijri";
import { useVisibilityCanvas } from "@/hooks/maps/use-visibility-canvas";
import VisibilityCanvasView from "./VisibilityCanvasView";

interface Props {
  points: VisibilityPoint[];
  method: string;
}

export default function VisibilityCanvasLayer({ points, method }: Props) {
  const { canvasRef, wrapperRef, smartLabels } = useVisibilityCanvas({ points, method });
  return <VisibilityCanvasView canvasRef={canvasRef} wrapperRef={wrapperRef} smartLabels={smartLabels} />;
}
