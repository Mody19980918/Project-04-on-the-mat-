import { Button, Group, MantineSize, Text } from "@mantine/core";
import {
  IconArrowBigLeft,
  IconArrowBigRight,
  IconCheck,
  IconForbid,
  IconHeart,
  IconHeartOff,
  IconHomeMove,
  IconReceipt2,
  IconUserPlus,
} from "@tabler/icons";

export const icons = {
  next: <IconArrowBigRight />,
  back: <IconArrowBigLeft />,
  home: <IconHomeMove />,
  tick: <IconCheck />,
  forbidden: <IconForbid />,
  price: <IconReceipt2 />,
  plusUser: <IconUserPlus />,
  heart: <IconHeart />,
  heartOff: <IconHeartOff />,
};

type Icons = typeof icons;

export default function IconButton(props: {
  children: any;
  onClick?: Function;
  color?: string;
  type: keyof Icons;
  size?: MantineSize;
  disabled?: boolean;
}) {
  return (
    <Group position="center">
      <Button
        type="submit"
        onClick={() => !!props.onClick && props.onClick()}
        color={props.color || "violet.4"}
        radius="md"
        size={props.size || "lg"}
        disabled={props.disabled}
      >
        <Group>
          <Text>{props.children}</Text>
          {icons[props.type]}
        </Group>
      </Button>
    </Group>
  );
}
