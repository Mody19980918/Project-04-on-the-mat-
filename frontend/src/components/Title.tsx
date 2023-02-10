import { Text } from "@mantine/core";
import { CSSProperties } from "react";

type Title = {
  children: string;
  size?: string;
  weight?: number;
};

export default function Title({ children, size, weight }: Title) {
  return (
    <>
      <Text fz={size || "xl"} fw={weight || 700}>
        {children}
      </Text>
    </>
  );
}
