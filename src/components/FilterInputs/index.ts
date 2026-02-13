import TextFilterInput from "./TextFilterInput";
import NumberFilterInput from "./NumberFilterInput";
import DateRangeFilterInput from "./DateRangeFilterInput";
import AmountRangeFilterInput from "./AmountRangeFilterInput";
import SingleSelectFilterInput from "./SingleSelectFilterInput";
import MultiSelectFilterInput from "./MultiSelectFilterInput";
import BooleanFilterInput from "./BooleanFilterInput";
import type { FieldType, FilterInputProps } from "../../types";

export const FILTER_INPUT_REGISTRY: Record<
  FieldType,
  React.ComponentType<FilterInputProps>
> = {
  text: TextFilterInput,
  number: NumberFilterInput,
  date: DateRangeFilterInput,
  amount: AmountRangeFilterInput,
  singleSelect: SingleSelectFilterInput,
  multiSelect: MultiSelectFilterInput,
  boolean: BooleanFilterInput,
};

export {
  TextFilterInput,
  NumberFilterInput,
  DateRangeFilterInput,
  AmountRangeFilterInput,
  SingleSelectFilterInput,
  MultiSelectFilterInput,
  BooleanFilterInput,
};
