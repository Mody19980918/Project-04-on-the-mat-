import RangeSelector, {
  Margin,
  Scale,
  MinorTick,
  Label,
  SliderMarker,
} from "devextreme-react/range-selector";

const defaultValue = [500, 600];

export default function RangeBar() {
  return (
    <RangeSelector
      id="range-selector"
      title="Select A Creadits range"
      defaultValue={defaultValue}
    >
      <Margin top={50} />
      <Scale
        startValue={10}
        endValue={1100}
        minorTickInterval={100}
        tickInterval={100}
      >
        <MinorTick visible={true} />
        <Label format="currency" />
      </Scale>
      <SliderMarker format="currency" />
    </RangeSelector>
  );
}
